require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const prisma = new PrismaClient();

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});
const plaidClient = new PlaidApi(configuration);

// Mock decrypt
function decrypt(text) {
  const crypto = require('crypto');
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  
  // Try getting auth tag if available
  try {
    const authTag = encryptedText.slice(encryptedText.length - 16);
    const content = encryptedText.slice(0, encryptedText.length - 16);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(content);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch(e) {
    // fallback for older encryption without auth tag
    const decipher2 = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher2.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher2.final()]);
    return decrypted.toString();
  }
}

async function main() {
  const items = await prisma.plaidItem.findMany();
  for (const item of items) {
    console.log('Syncing item:', item.itemId);
    const accessToken = decrypt(item.accessToken);
    let hasMore = true;
    let cursor = item.syncCursor || null;
    let added = [], modified = [], removed = [];
    
    while(hasMore) {
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
    
    console.log(`Plaid returned: ${added.length} added, ${modified.length} modified, ${removed.length} removed.`);
    
    for(const t of added) {
      let acc = await prisma.bankAccount.findUnique({ where: { accountId: t.account_id } });
      if(!acc) {
        acc = await prisma.bankAccount.create({
          data: {
            accountId: t.account_id,
            itemId: item.id,
            name: 'Auto-synced Account',
            type: 'unknown',
          }
        });
      }
      
      await prisma.transaction.upsert({
        where: { transactionId: t.transaction_id },
        create: {
          transactionId: t.transaction_id,
          accountId: acc.id,
          amount: t.amount,
          date: new Date(t.date),
          name: t.name,
          merchantName: t.merchant_name || null,
          pending: t.pending,
          personalFinanceCategory: t.personal_finance_category?.detailed || null,
        },
        update: {
          amount: t.amount,
          date: new Date(t.date),
          name: t.name,
          merchantName: t.merchant_name || null,
          pending: t.pending,
          personalFinanceCategory: t.personal_finance_category?.detailed || null,
          isRemoved: false,
        }
      });
    }
    
    await prisma.plaidItem.update({
      where: { id: item.id },
      data: { syncCursor: cursor }
    });
    
    console.log('Finished syncing item', item.itemId);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
