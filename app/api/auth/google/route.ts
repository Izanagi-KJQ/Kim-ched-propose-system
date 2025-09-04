import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signJwt } from '@/lib/jwt';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';
import { GoogleAuthSchema, validateRequest } from '@/lib/validations';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error('Google Client ID is not set in environment variables.');
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request with Zod
    const validation = validateRequest(GoogleAuthSchema, body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error, 
        details: validation.details 
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { credential } = validation.data;
    
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ 
        error: 'Invalid Google token.',
        details: ['Google token verification failed']
      }, { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Extract user info
    const email = payload.email;
    const firstName = payload.given_name || '';
    const lastName = payload.family_name || '';
    const middleName = '';
    const avatar = payload.picture || '';
    
    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    let isNewUser = false;
    
    if (!user) {
      // Prisma User.password is required, so set a random string for Google users
      const randomPassword = Math.random().toString(36).slice(-12);
      const hashedRandomPassword = await bcrypt.hash(randomPassword, 10);
      
      user = await prisma.user.create({
        data: {
          firstName,
          middleName,
          lastName,
          name: [firstName, middleName, lastName].filter(Boolean).join(' '),
          email,
          password: hashedRandomPassword, // Store hashed random password for Google users
          role: 'Staff',
          department: '',
          status: 'Active',
          avatar,
          lastActive: new Date(),
        },
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          name: true,
          email: true,
          role: true,
          department: true,
          lastActive: true,
          status: true,
          avatar: true,
          password: true, // select password for type safety, but do not return
        },
      });
      isNewUser = true;
    } else {
      // Update avatar if changed
      if (avatar && user.avatar !== avatar) {
        user = await prisma.user.update({
          where: { email },
          data: { avatar, lastActive: new Date() },
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            name: true,
            email: true,
            role: true,
            department: true,
            lastActive: true,
            status: true,
            avatar: true,
            password: true, // select password for type safety, but do not return
          },
        });
      }
    }
    
    // Issue JWT only if user is not null
    if (!user) {
      return NextResponse.json({ 
        error: 'User creation or fetch failed.',
        details: ['Failed to create or retrieve user account']
      }, { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Remove password before returning user
    const { password: _pw, ...userWithoutPassword } = user;
    
    try {
      const token = signJwt({ userId: user.id, email: user.email, name: user.firstName, role: user.role });
      return NextResponse.json({ 
        token, 
        user: userWithoutPassword, 
        isNewUser 
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (jwtError) {
      console.error('JWT signing error in Google OAuth:', jwtError);
      return NextResponse.json({ 
        error: 'Authentication token generation failed.',
        details: ['Failed to generate authentication token']
      }, { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error: any) {
    console.error('Google authentication error:', error);
    
    if (error.message?.includes('Token used too late')) {
      return NextResponse.json({ 
        error: 'Google token expired.',
        details: ['Please try signing in again']
      }, { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return NextResponse.json({ 
      error: 'Google authentication failed.',
      details: ['An unexpected error occurred during Google authentication']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}