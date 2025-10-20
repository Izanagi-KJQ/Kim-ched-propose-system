import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('Database connected successfully');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    
    // Test creating a simple record (if possible)
    try {
      const testUser = await prisma.user.findFirst();
      console.log('Found user:', testUser ? 'Yes' : 'No');
    } catch (queryError) {
      console.error('Query error:', queryError);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      userCount 
    });
  } catch (error: any) {
    console.error('Database test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: ['Database connection test failed']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
