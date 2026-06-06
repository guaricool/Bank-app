import { config } from 'dotenv';
config({ path: '.env.local' });
import { prisma } from './src/lib/prisma';

async function main() {
  const users = await prisma.user.findMany();
  console.log('Users:');
  for (const u of users) {
    console.log(`Email: ${u.email}, Name: ${u.name}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
