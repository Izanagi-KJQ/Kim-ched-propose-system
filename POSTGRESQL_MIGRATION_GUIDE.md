# 🐘 PostgreSQL Migration Guide for SAMRS

This guide will help you migrate your SAMRS (Scholarship Application Management & Ranking System) from SQLite to PostgreSQL.

## Prerequisites

### 1. Install PostgreSQL
- Download and install PostgreSQL from [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
- Make sure to remember the superuser (postgres) password during installation
- Default port is usually 5432

### 2. Create Database and User

Open PostgreSQL command line (psql) or pgAdmin and run:

```sql
-- Connect as postgres superuser
-- Create database
CREATE DATABASE samrsdb;

-- Create user
CREATE USER samrsuser WITH PASSWORD 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE samrsdb TO samrsuser;

-- Connect to the database
\c samrsdb;

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO samrsuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO samrsuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO samrsuser;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO samrsuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO samrsuser;
```

## Migration Steps

### Step 1: Update Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` file with your PostgreSQL credentials:
   ```env
   DATABASE_URL="postgresql://samrsuser:your_secure_password_here@localhost:5432/samrsdb?schema=public"
   JWT_SECRET="your-strong-jwt-secret-for-production"
   ```

### Step 2: Reset and Create New Migrations

1. **Backup your current data** (if you have important data in SQLite):
   ```bash
   # Optional: Export your current data
   npx prisma studio  # Browse and export data manually if needed
   ```

2. **Remove old migration history**:
   ```bash
   # Remove the migrations folder
   rmdir /s prisma\migrations
   
   # Or manually delete the migrations folder
   ```

3. **Create fresh migrations for PostgreSQL**:
   ```bash
   # Generate new migration for PostgreSQL
   npx prisma migrate dev --name init
   
   # This will create the initial migration for PostgreSQL
   ```

### Step 3: Generate Prisma Client

```bash
# Generate the new Prisma client for PostgreSQL
npx prisma generate
```

### Step 4: Verify Database Connection

```bash
# Test the connection and view the database
npx prisma studio
```

### Step 5: Setup Admin User

```bash
# Run the admin setup script
node scripts/setup-admin.js
```

## Data Migration (Optional)

If you need to migrate existing data from SQLite to PostgreSQL:

### Option 1: Manual Export/Import
1. Use `npx prisma studio` to view and export data from SQLite
2. Manually recreate the data in PostgreSQL

### Option 2: Custom Migration Script
Create a custom Node.js script to read from SQLite and write to PostgreSQL.

## Verification Checklist

After migration, verify:

- [ ] Database connection works (`npx prisma studio`)
- [ ] All tables are created correctly
- [ ] Admin user is created (`node scripts/setup-admin.js`)
- [ ] Application starts without errors (`npm run dev`)
- [ ] User authentication works
- [ ] Admin panel is accessible
- [ ] All CRUD operations work properly

## Troubleshooting

### Common Issues:

1. **Connection refused**:
   - Ensure PostgreSQL service is running
   - Check port (default 5432)
   - Verify firewall settings

2. **Authentication failed**:
   - Double-check username/password in DATABASE_URL
   - Verify user permissions

3. **Permission denied**:
   - Run the permission grant SQL commands as superuser
   - Check schema ownership

4. **Migration fails**:
   - Ensure the database is empty before first migration
   - Check for syntax errors in schema

## Performance Benefits of PostgreSQL

After migration, you'll enjoy:

- **Better Concurrency**: Multiple users can access safely
- **ACID Compliance**: Full transaction support
- **Advanced Features**: JSON fields, full-text search, etc.
- **Scalability**: Handle thousands of scholarship applications
- **Backup/Recovery**: Robust backup and point-in-time recovery
- **Analytics**: Better reporting and analytics capabilities

## Support

If you encounter issues:
1. Check the PostgreSQL logs
2. Verify your `.env` configuration
3. Test database connectivity with `psql`
4. Review Prisma documentation: [https://www.prisma.io/docs](https://www.prisma.io/docs)

---

🎉 **Congratulations!** Your SAMRS system is now running on PostgreSQL and ready to handle multiple users and scale efficiently!