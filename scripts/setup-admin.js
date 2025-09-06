const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupAdmin() {
  const adminEmail = 'angelojoseenrico@gmail.com';
  
  try {
    // Check if admin user already exists
    let adminUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (adminUser) {
      console.log(`✅ Admin user found: ${adminEmail}`);
      
      // Update to ensure they have Administrator role
      if (adminUser.role !== 'Administrator') {
        adminUser = await prisma.user.update({
          where: { email: adminEmail },
          data: { 
            role: 'Administrator',
            status: 'active',
            lastActive: new Date()
          }
        });
        console.log(`✅ Updated ${adminEmail} to Administrator role`);
      } else {
        console.log(`✅ ${adminEmail} already has Administrator role`);
      }
    } else {
      // Create admin user if doesn't exist
      const hashedPassword = await bcrypt.hash('admin123!', 10);
      
      adminUser = await prisma.user.create({
        data: {
          firstName: 'Angelo Jose',
          middleName: '',
          lastName: 'Enrico',
          name: 'Angelo Jose Enrico', // For backward compatibility
          email: adminEmail,
          password: hashedPassword,
          role: 'Administrator',
          department: 'IT Administration',
          status: 'active',
          avatar: '',
          lastActive: new Date()
        }
      });
      console.log(`✅ Created admin user: ${adminEmail}`);
      console.log(`📝 Default password: admin123!`);
      console.log(`⚠️  Please change the password after first login`);
    }

    // Display current admin user info
    console.log('\n📋 Admin User Details:');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Name: ${adminUser.firstName} ${adminUser.lastName}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Department: ${adminUser.department}`);
    console.log(`   Status: ${adminUser.status}`);
    console.log(`   Last Active: ${adminUser.lastActive}`);

    // Check all users and their roles
    const allUsers = await prisma.user.findMany({
      select: {
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true
      }
    });

    console.log('\n👥 All Users in System:');
    allUsers.forEach((user, index) => {
      const isAdmin = user.role === 'Administrator';
      console.log(`   ${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
      console.log(`      Role: ${user.role} ${isAdmin ? '👑' : ''}`);
      console.log(`      Status: ${user.status}`);
    });

  } catch (error) {
    console.error('❌ Error setting up admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();