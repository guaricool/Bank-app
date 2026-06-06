const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("All users:", users.map(u => ({ email: u.email, name: u.name })));
  
  // Find the cpierluissis user
  const targetUser = users.find(u => u.email && u.email.includes('cpierluissis'));
  if (targetUser) {
    await prisma.user.update({
      where: { id: targetUser.id },
      data: { name: 'Carlos Pierluissi' }
    });
    console.log(`Updated user ${targetUser.email} name to 'Carlos Pierluissi'`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
