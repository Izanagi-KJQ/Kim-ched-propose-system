-- Fix PostgreSQL permissions for samrsuser
-- Run this script as postgres superuser

-- Connect to the database
\c samrsdb;

-- Grant all necessary permissions
GRANT USAGE ON SCHEMA public TO samrsuser;
GRANT CREATE ON SCHEMA public TO samrsuser;
GRANT ALL PRIVILEGES ON SCHEMA public TO samrsuser;

-- Grant privileges on existing tables (if any exist)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO samrsuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO samrsuser;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO samrsuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO samrsuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO samrsuser;

-- Grant database ownership if needed
GRANT ALL PRIVILEGES ON DATABASE samrsdb TO samrsuser;

-- Show current permissions
\dp public.*; 