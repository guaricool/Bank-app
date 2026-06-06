import { config } from 'dotenv';
config({ path: '.env.local' });
import { prisma } from './src/lib/prisma';

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'cpierluissis@gmail.com' }, // Assuming this is the email
    include: {
      items: {
        include: {
          accounts: {
            include: {
              transactions: true
            }
          }
        }
      }
    }
  });

  if (!user) {
    // Try without @gmail.com
    const users = await prisma.user.findMany();
    console.log("All users:", users.map(u => u.email));
    return;
  }

  let txCount = 0;
  for (const item of user.items) {
    for (const acc of item.accounts) {
      console.log(`Account ${acc.name} (${acc.type}): ${acc.transactions.length} transactions`);
      txCount += acc.transactions.length;
    }
  }
  console.log(`Total transactions for user: ${txCount}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
