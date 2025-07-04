import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signJwt } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } }) as any;
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }
    const { password: _pw, ...userWithoutPassword } = user;
    const token = signJwt({ userId: user.id, email: user.email, name: user.name, role: user.role });
    return NextResponse.json({ token, user: userWithoutPassword });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
} 