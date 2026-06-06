import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from 'dotenv';

config(); // Load .env
config({ path: '.env.local' }); // Load .env.local if present

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

import bcrypt from 'bcryptjs';

async function main() {
  const users = await prisma.user.findMany();
  console.log('Users in DB before update:', users);
  
  const accounts = await prisma.bankAccount.findMany();
  console.log('Bank accounts in DB:', accounts.length);
  
  // Clean up any dummy items/accounts to start fresh
  const items = await prisma.plaidItem.deleteMany({});
  console.log('Deleted Plaid Items and their accounts:', items.count);
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
