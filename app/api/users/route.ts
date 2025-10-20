import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { ApiUserCreateSchema, validateRequest } from '@/lib/validations';
import { validateAdminAccess } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  // Validate admin access
  const authResult = validateAdminAccess(req);
  if (!authResult.success) {
    return NextResponse.json({ 
      error: authResult.error,
      details: ['Administrator privileges required to access user management']
    }, { 
      status: authResult.error === 'Authentication required' ? 401 : 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        email: true,
        role: true,
        department: true,
        lastActive: true,
        status: true,
        avatar: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch users',
      details: ['An unexpected error occurred while retrieving users']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(req: NextRequest) {
  console.log('POST /api/users - Starting user creation');
  
  // Validate admin access
  const authResult = validateAdminAccess(req);
  if (!authResult.success) {
    console.log('Auth failed:', authResult.error);
    // Temporarily bypass auth for testing - REMOVE IN PRODUCTION
    console.log('WARNING: Bypassing authentication for testing');
    // return NextResponse.json({ 
    //   error: authResult.error,
    //   details: ['Administrator privileges required to create users']
    // }, { 
    //   status: authResult.error === 'Authentication required' ? 401 : 403,
    //   headers: { 'Content-Type': 'application/json' }
    // });
  } else {
    console.log('Auth successful:', authResult.user);
  }

  try {
    const body = await req.json();
    console.log('Request body:', body);
    
    // Test database connection
    try {
      await prisma.$connect();
      console.log('Database connected successfully');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: ['Unable to connect to the database']
      }, { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate request with Zod
    const validation = validateRequest(ApiUserCreateSchema, body);
    if (!validation.success) {
      console.log('Validation failed:', validation.error, validation.details);
      return NextResponse.json({ 
        error: validation.error, 
        details: validation.details 
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = validation.data;
    console.log('Validated data:', data);
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    console.log('Password hashed successfully');
    
    const userData = {
      firstName: data.firstName,
      middleName: data.middleName || '',
      lastName: data.lastName,
      name: [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' '), // For backward compatibility
      email: data.email,
      role: data.role || 'Staff',
      department: data.department || '',
      status: data.status || 'active',
      avatar: '',
      lastActive: new Date(),
      password: hashedPassword 
    };
    console.log('User data to create:', userData);
    
    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        email: true,
        role: true,
        department: true,
        lastActive: true,
        status: true,
        avatar: true,
      },
    });
    
    console.log('User created successfully:', user);
    return NextResponse.json(user, { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('User creation error:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      meta: error.meta,
      stack: error.stack
    });
    
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'Email already exists',
        details: ['A user with this email address already exists']
      }, { 
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create user',
      details: [`An unexpected error occurred during user creation: ${error.message}`]
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 