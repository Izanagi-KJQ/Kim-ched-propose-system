import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { firstName, middleName, lastName, email, password, department } = await req.json();
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'First name, last name, email, and password are required.' }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already exists.' }, { status: 409 });
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
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed.' }, { status: 500 });
  }
} 