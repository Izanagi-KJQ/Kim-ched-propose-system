const { PrismaClient } = require('@prisma/client');

async function setupPostgreSQL() {
  const prisma = new PrismaClient();

  try {
    console.log('🐘 Setting up PostgreSQL for SAMRS...\n');

    // Test database connection
    console.log('📡 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');

    // Check if database is empty (no users exist)
    const userCount = await prisma.user.count();
    console.log(`📊 Current users in database: ${userCount}`);

    if (userCount === 0) {
      console.log('🆕 Database appears to be empty. This is expected for a new PostgreSQL setup.');
      console.log('💡 Run the migration command: npx prisma migrate dev --name init');
      console.log('💡 Then run: node scripts/setup-admin.js');
    } else {
      console.log('📋 Existing users found:');
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true
        }
      });

      users.forEach((user, index) => {
        const isAdmin = user.role === 'Administrator';
        console.log(`   ${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
        console.log(`      Role: ${user.role} ${isAdmin ? '👑' : ''}`);
        console.log(`      Status: ${user.status}`);
      });
    }

    // Test query performance
    console.log('\n⚡ Testing query performance...');
    const startTime = Date.now();
    await prisma.user.findMany({ take: 10 });
    const endTime = Date.now();
    console.log(`✅ Query executed in ${endTime - startTime}ms`);

    // Check database info
    console.log('\n📊 Database Information:');
    
    // Get table information (PostgreSQL specific)
    const tableInfo = await prisma.$queryRaw`
      SELECT table_name, table_schema 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    console.log('📋 Tables in database:');
    tableInfo.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.table_name}`);
    });

    // Check for indexes
    const indexInfo = await prisma.$queryRaw`
      SELECT indexname, tablename 
      FROM pg_indexes 
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `;
    
    console.log('\n🔍 Indexes:');
    indexInfo.forEach((index, i) => {
      console.log(`   ${i + 1}. ${index.indexname} on ${index.tablename}`);
    });

    console.log('\n🎉 PostgreSQL setup verification completed successfully!');
    console.log('\n📚 Next steps:');
    console.log('   1. Ensure your .env file has the correct DATABASE_URL');
    console.log('   2. Run migrations if needed: npx prisma migrate dev');
    console.log('   3. Set up admin user: node scripts/setup-admin.js');
    console.log('   4. Start the application: npm run dev');

  } catch (error) {
    console.error('❌ PostgreSQL setup failed:', error);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   • Ensure PostgreSQL is installed and running');
      console.log('   • Check if the service is started (Windows: services.msc)');
      console.log('   • Verify the port (default: 5432)');
      console.log('   • Check firewall settings');
    } else if (error.code === 'P1001') {
      console.log('\n💡 Database connection failed:');
      console.log('   • Verify DATABASE_URL in .env file');
      console.log('   • Check username and password');
      console.log('   • Ensure database "samrsdb" exists');
      console.log('   • Verify user "samrsuser" has proper permissions');
    } else if (error.code === 'P3009') {
      console.log('\n💡 Migration needed:');
      console.log('   • Run: npx prisma migrate dev --name init');
      console.log('   • This will create the database schema');
    }
    
    console.log('\n📖 See POSTGRESQL_MIGRATION_GUIDE.md for detailed setup instructions');
  } finally {
    await prisma.$disconnect();
  }
}

// Check if this file is being run directly
if (require.main === module) {
  setupPostgreSQL();
}

module.exports = setupPostgreSQL;