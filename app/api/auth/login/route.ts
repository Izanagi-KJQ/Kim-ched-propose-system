import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signJwt } from '@/lib/jwt';
import { LoginSchema, validateRequest } from '@/lib/validations';

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
  // Set explicit JSON response headers
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
  };

  try {
    // Validate request content type
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' }, 
        { status: 400, headers }
      );
    }

    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' }, 
        { status: 400, headers }
      );
    }

    // Validate request with Zod
    const validation = validateRequest(LoginSchema, requestBody);
    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error, 
        details: validation.details 
      }, { 
        status: 400,
        headers
      });
    }
    
    const { email, password } = validation.data;

    let user;
    try {
      user = await prisma.user.findUnique({ where: { email } }) as any;
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed. Please try again.' }, 
        { status: 500, headers }
      );
    }

    if (!user) {
      return NextResponse.json({ 
        error: 'Invalid credentials.',
        details: ['Email or password is incorrect']
      }, { 
        status: 401,
        headers
      });
    }

    let valid = false;
    try {
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
    } catch (bcryptError) {
      console.error('Password validation error:', bcryptError);
      return NextResponse.json(
        { error: 'Authentication error. Please try again.' }, 
        { status: 500, headers }
      );
    }
    
    if (!valid) {
      return NextResponse.json({ 
        error: 'Invalid credentials.',
        details: ['Email or password is incorrect']
      }, { 
        status: 401,
        headers
      });
    }
    
    // If firstName or lastName is missing, but name is present, try to split and update
    let needsProfileUpdate = false;
    try {
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
    } catch (updateError) {
      console.error('User update error:', updateError);
      // Continue with login even if update fails
    }
    
    const { password: _pw, ...userWithoutPassword } = user;
    
    try {
      const token = signJwt({ userId: user.id, email: user.email, name: user.firstName || user.name, role: user.role });
      return NextResponse.json(
        { token, user: userWithoutPassword, needsProfileUpdate },
        { status: 200, headers }
      );
    } catch (jwtError) {
      console.error('JWT signing error:', jwtError);
      return NextResponse.json(
        { error: 'Authentication token generation failed.' }, 
        { status: 500, headers }
      );
    }
  } catch (error: any) {
    console.error('Login API unexpected error:', error);
    return NextResponse.json(
      { error: 'Login failed due to server error.', details: ['An unexpected error occurred during login'] }, 
      { status: 500, headers }
    );
  }
}