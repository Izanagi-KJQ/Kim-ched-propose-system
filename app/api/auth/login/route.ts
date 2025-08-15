import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signJwt } from '@/lib/jwt';

function splitName(name: string) {
  if (!name) return { firstName: '', middleName: '', lastName: '' };
  const parts = name.trim().split(' ');
  if (parts.length === 1) return { firstName: parts[0], middleName: '', lastName: '' };
  if (parts.length === 2) return { firstName: parts[0], middleName: '', lastName: parts[1] };
  return { firstName: parts[0], middleName: parts.slice(1, -1).join(' '), lastName: parts[parts.length - 1] };
}

function isBcryptHash(value: string): boolean {
  // Bcrypt hashes start with $2a$, $2b$, or $2y$ and are ~60 chars
  return typeof value === 'string' && /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(value);
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }
    let user = await prisma.user.findUnique({ where: { email } }) as any;
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }
    let valid = false;
    if (isBcryptHash(user.password)) {
      valid = await bcrypt.compare(password, user.password);
    } else {
      // Legacy/incorrectly stored plaintext password fallback
      valid = user.password === password;
      if (valid) {
        // Upgrade to bcrypt hash immediately
        const hashed = await bcrypt.hash(password, 10);
        user = await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
      }
    }
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }
    // If firstName or lastName is missing, but name is present, try to split and update
    let needsProfileUpdate = false;
    if ((!user.firstName || !user.lastName) && user.name) {
      const { firstName, middleName, lastName } = splitName(user.name);
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          firstName,
          middleName,
          lastName,
        },
      });
      needsProfileUpdate = true;
    } else if (!user.firstName || !user.lastName) {
      needsProfileUpdate = true;
    }
    const { password: _pw, ...userWithoutPassword } = user;
    const token = signJwt({ userId: user.id, email: user.email, name: user.firstName, role: user.role });
    return NextResponse.json({ token, user: userWithoutPassword, needsProfileUpdate });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
} 