import { prisma } from './src/lib/prisma';

async function main() {
  try {
    const count = await prisma.user.count();
    console.log('SUCCESS! Users count:', count);
  } catch (error) {
    console.error('ERROR CONNECTING TO DB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
