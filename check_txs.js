const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const txs = await prisma.transaction.findMany();
  console.log('Total transactions:', txs.length);
  if (txs.length > 0) {
    console.log('Sample:', txs[0]);
  }
}

main().finally(() => prisma.$disconnect());
