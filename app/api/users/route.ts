import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { ApiUserCreateSchema, validateRequest } from '@/lib/validations';

export async function GET(req: NextRequest) {
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
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request with Zod
    const validation = validateRequest(ApiUserCreateSchema, body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error, 
        details: validation.details 
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = validation.data;
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
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
      },
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
    
    return NextResponse.json(user, { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('User creation error:', error);
    
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
      details: ['An unexpected error occurred during user creation']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 