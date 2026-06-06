import { prisma } from './src/lib/prisma';

async function main() {
  const items = await prisma.plaidItem.findMany();
  console.log('Plaid items:', items.length);
  
  const accounts = await prisma.bankAccount.findMany();
  console.log('Bank accounts:', accounts.length);
  
  const txs = await prisma.transaction.findMany();
  console.log('Total transactions:', txs.length);
  
  if (txs.length > 0) {
    console.log('Sample TX:', txs[0]);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
