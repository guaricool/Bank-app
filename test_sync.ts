import { prisma } from './src/lib/prisma';
import { syncTransactions } from './src/lib/sync';

async function main() {
  const items = await prisma.plaidItem.findMany();
  let totalAdded = 0;
  for (const item of items) {
    console.log(`Syncing item ${item.itemId}...`);
    try {
      const added = await syncTransactions(item.id);
      totalAdded += added || 0;
    } catch (e) {
      console.error('Error syncing:', e);
    }
  }
  console.log(`Done! Total added: ${totalAdded}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
