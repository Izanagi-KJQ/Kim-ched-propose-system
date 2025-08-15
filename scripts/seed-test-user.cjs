const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  const email = process.argv[2] || 'admin@example.com';
  const password = process.argv[3] || 'admin1234';
  try {
    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      console.log(`User ${email} already exists.`);
      return;
    }
    const hashed = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: {
        firstName: 'Admin',
        middleName: '',
        lastName: 'User',
        name: 'Admin User',
        email,
        password: hashed,
        role: 'Admin',
        department: '',
        lastActive: new Date(),
        status: 'Active',
        avatar: '',
      },
      select: { id: true, email: true }
    });
    console.log(`Created user ${user.email} with password ${password}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


