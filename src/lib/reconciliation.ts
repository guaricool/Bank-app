import { prisma } from './prisma';

export async function reconcileTransactions(userId: string) {
  try {
    console.log(`[Reconciliation] Starting for user ${userId}`);
    
    // 1. Get all bank accounts for this user
    const accounts = await prisma.bankAccount.findMany({
      where: {
        item: {
          userId: userId
        }
      }
    });

    const depositoryAccountIds = accounts
      .filter(a => a.type === 'depository')
      .map(a => a.id);
      
    const creditAccountIds = accounts
      .filter(a => a.type === 'credit' || a.type === 'loan')
      .map(a => a.id);

    if (depositoryAccountIds.length === 0 || creditAccountIds.length === 0) {
      console.log(`[Reconciliation] Not enough account types to reconcile for user ${userId}`);
      return;
    }

    // We can't use relation filtering since we didn't add the reverse relation on Transaction yet.
    // Instead, we will fetch all matches first and filter.
    const allMatches = await prisma.reconciliationMatch.findMany({
      select: { debitTxId: true, creditTxId: true }
    });
    
    const matchedDebitIds = new Set(allMatches.map(m => m.debitTxId));
    const matchedCreditIds = new Set(allMatches.map(m => m.creditTxId));

    // 2. Fetch unmatched debit transactions (money leaving checking)
    // In Plaid, positive amount means money leaving a depository account
    const debits = await prisma.transaction.findMany({
      where: {
        accountId: { in: depositoryAccountIds },
        amount: { gt: 0 },
        isRemoved: false,
      },
      orderBy: { date: 'desc' }
    });
    
    const unmatchedDebits = debits.filter(tx => !matchedDebitIds.has(tx.transactionId));

    // 3. Fetch unmatched credit transactions (payments to credit card)
    // In Plaid, negative amount means money entering a credit account (payment)
    const credits = await prisma.transaction.findMany({
      where: {
        accountId: { in: creditAccountIds },
        amount: { lt: 0 },
        isRemoved: false,
      },
      orderBy: { date: 'desc' }
    });
    
    const unmatchedCredits = credits.filter(tx => !matchedCreditIds.has(tx.transactionId));

    let matchCount = 0;

    // 4. Match algorithm
    for (const creditTx of unmatchedCredits) {
      const creditAbsAmount = Math.abs(creditTx.amount);
      const creditDate = creditTx.date.getTime();

      // Find a matching debit transaction
      // Criteria: Exact amount match, and date within 5 days
      const MATCH_WINDOW_MS = 5 * 24 * 60 * 60 * 1000;

      const matchedDebitIndex = unmatchedDebits.findIndex(debitTx => {
        const debitAmount = debitTx.amount;
        const debitDate = debitTx.date.getTime();
        
        // Check amount match
        if (Math.abs(debitAmount - creditAbsAmount) > 0.01) return false;
        
        // Check date window (debit usually happens before or same day as credit, but we check absolute diff)
        const timeDiff = Math.abs(debitDate - creditDate);
        if (timeDiff > MATCH_WINDOW_MS) return false;

        return true;
      });

      if (matchedDebitIndex !== -1) {
        const debitTx = unmatchedDebits[matchedDebitIndex];

        // Create the match
        await prisma.reconciliationMatch.create({
          data: {
            debitTxId: debitTx.transactionId,
            creditTxId: creditTx.transactionId,
            amount: creditAbsAmount,
            status: 'MATCHED'
          }
        });

        matchCount++;
        
        // Remove from unmatched list
        unmatchedDebits.splice(matchedDebitIndex, 1);
      }
    }

    console.log(`[Reconciliation] Finished for user ${userId}. Matched ${matchCount} pairs.`);
    return matchCount;
  } catch (error) {
    console.error(`[Reconciliation] Error for user ${userId}:`, error);
    throw error;
  }
}
