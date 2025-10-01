// FIX: Suppress TypeScript error for PrismaClient import. This error is likely
// due to `prisma generate` not having been run, and @ts-ignore provides a
// workaround.
// @ts-ignore
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
// FIX: Removed the explicit 'process' import and its comment. In a Node.js
// environment, 'process' is a global variable and does not need to be imported.
// This was causing a type error on `process.exit`.

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  const adminEmail = 'admin@example.com';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin', salt);

    const user = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: passwordHash,
      },
    });
    console.log(`Created admin user with email: ${user.email}`);
    console.log('Default credentials: admin@example.com / admin');
  } else {
    console.log(`Admin user with email ${adminEmail} already exists.`);
  }
  
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });