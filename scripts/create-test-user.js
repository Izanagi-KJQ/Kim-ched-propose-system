const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if test user already exists
    let testUser = await prisma.user.findUnique({
      where: { email: 'test.staff@example.com' }
    });

    if (testUser) {
      console.log('✅ Test user already exists');
    } else {
      // Create a test Staff user for role change testing
      const hashedPassword = await bcrypt.hash('test123!', 10);
      
      testUser = await prisma.user.create({
        data: {
          firstName: 'Test',
          middleName: '',
          lastName: 'Staff',
          name: 'Test Staff',
          email: 'test.staff@example.com',
          password: hashedPassword,
          role: 'Staff',
          department: 'Testing Department',
          status: 'active',
          avatar: '',
          lastActive: new Date()
        }
      });
      console.log('✅ Created test user: test.staff@example.com');
      console.log('📝 Default password: test123!');
    }

    // Display all users and their current roles
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        department: true
      },
      orderBy: { email: 'asc' }
    });

    console.log('\n👥 All Users in System:');
    allUsers.forEach((user, index) => {
      const isAdmin = user.role === 'Administrator';
      const isTestUser = user.email === 'test.staff@example.com';
      console.log(`   ${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
      console.log(`      Role: ${user.role} ${isAdmin ? '👑' : isTestUser ? '🧪' : '👤'}`);
      console.log(`      Department: ${user.department}`);
      console.log(`      Status: ${user.status}`);
      console.log('');
    });

    console.log('🎯 Admin User Features Available:');
    console.log('   ✅ Access Users tab (Admin only)');
    console.log('   ✅ Create new users');
    console.log('   ✅ Edit user details');
    console.log('   ✅ Change user roles (Administrator/Staff/Viewer)');
    console.log('   ✅ Change departments');
    console.log('   ✅ Reset passwords');
    console.log('   ✅ Delete users');
    console.log('   ✅ View all user information');

  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();