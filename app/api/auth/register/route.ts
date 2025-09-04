import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { RegisterSchema, validateRequest } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request with Zod
    const validation = validateRequest(RegisterSchema, body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error, 
        details: validation.details 
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { firstName, middleName, lastName, email, password, department } = validation.data;
    
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ 
        error: 'Email already exists.',
        details: ['A user with this email address already exists']
      }, { 
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        firstName,
        middleName: middleName || '',
        lastName,
        name: [firstName, middleName, lastName].filter(Boolean).join(' '), // For backward compatibility
        email,
        password: hashedPassword,
        role: 'Staff',
        department: department || '',
        status: 'Active',
        avatar: '',
        lastActive: new Date(),
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
    console.error('Registration error:', error);
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'Email already exists.',
        details: ['A user with this email address already exists']
      }, { 
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return NextResponse.json({ 
      error: 'Registration failed.',
      details: ['An unexpected error occurred during registration']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 