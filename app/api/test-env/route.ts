import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'Set' : 'Not set',
    };
    
    console.log('Environment check:', envCheck);
    
    return NextResponse.json({ 
      success: true, 
      environment: envCheck,
      message: 'Environment variables checked'
    });
  } catch (error: any) {
    console.error('Environment check failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: ['Environment check failed']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
