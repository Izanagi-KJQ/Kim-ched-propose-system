@echo off
echo Setting up PostgreSQL PATH...
set PATH=%PATH%;C:\Program Files\PostgreSQL\17\bin

echo.
echo Please run the following command to fix database permissions:
echo psql -U postgres -d samrsdb -f fix_permissions.sql
echo.
echo You will be prompted for the postgres password.
echo.
pause 