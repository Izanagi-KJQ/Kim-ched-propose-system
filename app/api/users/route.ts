import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

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
    const data = await req.json();
    if (!data.password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }
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
        status: data.status || 'Active',
        avatar: data.avatar || '',
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
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
} 