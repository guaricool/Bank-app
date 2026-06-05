import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'cpierluissis@gmail.com';
  console.log(`Buscando usuario con email: ${email}`);
  
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.log(`Usuario con email ${email} no encontrado. Asegúrate de haberte registrado primero.`);
    return;
  }
  
  await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' }
  });
  console.log(`✅ Usuario ${email} actualizado a ADMIN.`);
  
  if (user.familyId) {
    await prisma.family.update({
      where: { id: user.familyId },
      data: { stripeExempt: true }
    });
    console.log(`✅ Familia del usuario configurada como stripeExempt (no requiere pago).`);
  } else {
    console.log(`⚠️ El usuario no tiene una familia asignada aún.`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
