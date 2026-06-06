import { plaidClient } from './plaid';
import { prisma } from './prisma';
import { reconcileTransactions } from './reconciliation';
import { decrypt } from './encryption';

/**
 * Syncs transactions for a specific PlaidItem using the /transactions/sync endpoint.
 */
export async function syncTransactions(plaidItemId: string) {
  const item = await prisma.plaidItem.findUnique({
    where: { id: plaidItemId },
  });

  if (!item) {
    throw new Error('PlaidItem not found');
  }

  // Decrypt the access token before using it with Plaid API
  const accessToken = decrypt(item.accessToken); 
  let cursor = item.syncCursor;

  // Fetch user for alerts
  const user = await prisma.user.findUnique({
    where: { id: item.userId }
  });
  const prefs = user?.alertPreferences as any || {};


  // New transactions, modified, removed
  let added: any[] = [];
  let modified: any[] = [];
  let removed: any[] = [];

  let hasMore = true;

  try {
    // Iterate through pages
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
        cursor: cursor || undefined,
      });

      const data = response.data;

      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);

      hasMore = data.has_more;
      cursor = data.next_cursor;
    }

    // Persist results
    // Use transaction to ensure consistency
    await prisma.$transaction(async (tx) => {
      
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - 24);

      // 1. Add new transactions
      for (const t of added) {
        const txDate = new Date(t.date);
        if (txDate < cutoffDate) {
          continue; // Skip transactions older than 2 months
        }

        // Ensure the account exists before adding the transaction.
        // In a real app, you might sync accounts first if they're missing.
        let accountExists = await tx.bankAccount.findUnique({
          where: { accountId: t.account_id }
        });

        // FIX: Prevent silent data loss by creating a placeholder account
        if (!accountExists) {
          try {
            accountExists = await tx.bankAccount.create({
              data: {
                accountId: t.account_id,
                itemId: item.id,
                name: 'Auto-synced Account',
                type: 'unknown',
              }
            });
          } catch (e) {
            console.error('Failed to create placeholder account for tx:', t.transaction_id, e);
          }
        }

        if (accountExists) {
          await tx.transaction.upsert({
            where: { transactionId: t.transaction_id },
            create: {
              transactionId: t.transaction_id,
              accountId: accountExists.id,
              amount: t.amount,
              date: new Date(t.date),
              name: t.name,
              merchantName: t.merchant_name || null,
              pending: t.pending,
              personalFinanceCategory: t.personal_finance_category?.detailed || null,
              personalFinanceCategoryPrimary: t.personal_finance_category?.primary || null,
            },
              update: {
              amount: t.amount,
              date: new Date(t.date),
              name: t.name,
              merchantName: t.merchant_name || null,
              pending: t.pending,
              personalFinanceCategory: t.personal_finance_category?.detailed || null,
              personalFinanceCategoryPrimary: t.personal_finance_category?.primary || null,
              isRemoved: false,
            },
          });

          // Send Alert Emails
          if (user?.email && accountExists) {
            const { sendAlertEmail } = await import('@/lib/email');
            
            // Deposits (Negative amount in Plaid for checking usually means deposit, 
            // but let's check account type)
            if (accountExists.type === 'depository' && t.amount < 0 && prefs.deposits) {
              await sendAlertEmail(
                user.email,
                'New Deposit Alert',
                `A new deposit of $${Math.abs(t.amount)} was recorded in your account ${accountExists.name}.`
              );
            }
            
            // Withdrawals (Positive amount in depository)
            if (accountExists.type === 'depository' && t.amount > 0 && prefs.withdrawals) {
              await sendAlertEmail(
                user.email,
                'New Withdrawal Alert',
                `A new withdrawal/expense of $${t.amount} was recorded in your account ${accountExists.name} at ${t.name}.`
              );
            }

            // Payments (Negative amount in credit account)
            if ((accountExists.type === 'credit' || accountExists.type === 'loan') && t.amount < 0 && prefs.payments) {
              await sendAlertEmail(
                user.email,
                'Payment Received Alert',
                `A payment of $${Math.abs(t.amount)} was recorded in your credit account ${accountExists.name}.`
              );
            }
          }
        }
      }

      // 2. Modify existing transactions
      for (const t of modified) {
        // Find existing transaction to see if it's there
        const existingTx = await tx.transaction.findUnique({
          where: { transactionId: t.transaction_id }
        });

        if (existingTx) {
          await tx.transaction.update({
            where: { transactionId: t.transaction_id },
            data: {
              amount: t.amount,
              date: new Date(t.date),
              name: t.name,
              merchantName: t.merchant_name || null,
              pending: t.pending,
              personalFinanceCategory: t.personal_finance_category?.detailed || null,
              personalFinanceCategoryPrimary: t.personal_finance_category?.primary || null,
            },
          });
        }
      }

      // 3. Remove transactions
      for (const t of removed) {
        const existingTx = await tx.transaction.findUnique({
          where: { transactionId: t.transaction_id }
        });
        
        if (existingTx) {
          await tx.transaction.update({
            where: { transactionId: t.transaction_id },
            data: {
              isRemoved: true,
            },
          });
        }
      }

      // 4. Update the sync cursor
      await tx.plaidItem.update({
        where: { id: item.id },
        data: { syncCursor: cursor },
      });
    });

    console.log(`Successfully synced ${added.length} added, ${modified.length} modified, ${removed.length} removed transactions for PlaidItem ${item.id}`);

    // Call automatic reconciliation
    await reconcileTransactions(item.userId);

  } catch (error) {
    console.error(`Error syncing transactions for item ${item.id}:`, error);
    throw error;
  }
}

/**
 * Syncs liabilities (credit cards, loans) to update APR and minimum payments.
 */
export async function syncLiabilities(plaidItemId: string) {
  const item = await prisma.plaidItem.findUnique({
    where: { id: plaidItemId },
  });

  if (!item) {
    throw new Error('PlaidItem not found');
  }

  const accessToken = decrypt(item.accessToken);

  try {
    const response = await plaidClient.liabilitiesGet({ access_token: accessToken });
    const { credit, student } = response.data.liabilities;

    // Process credit cards
    if (credit && credit.length > 0) {
      for (const c of credit) {
        let apr: number | null = null;
        if (c.aprs && c.aprs.length > 0) {
          const purchaseApr = c.aprs.find((a: any) => a.apr_type === 'purchase_apr');
          apr = purchaseApr ? purchaseApr.apr_percentage : c.aprs[0].apr_percentage;
        }

        if (c.account_id) {
          await prisma.bankAccount.updateMany({
            where: { accountId: c.account_id },
            data: {
              apr: apr,
              minimumPayment: c.minimum_payment_amount,
            }
          });
        }
      }
    }
    
    // Process student loans
    if (student && student.length > 0) {
      for (const s of student) {
        if (s.account_id) {
          await prisma.bankAccount.updateMany({
            where: { accountId: s.account_id },
            data: {
              apr: s.interest_rate_percentage,
              minimumPayment: s.minimum_payment_amount,
            }
          });
        }
      }
    }

    console.log(`Successfully synced liabilities for PlaidItem ${item.id}`);
  } catch (error) {
    console.error(`Error syncing liabilities for item ${item.id}:`, error);
  }
}
