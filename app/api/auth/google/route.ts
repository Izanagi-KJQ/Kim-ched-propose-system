import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signJwt } from '@/lib/jwt';
import { OAuth2Client } from 'google-auth-library';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error('Google Client ID is not set in environment variables.');
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
  try {
    const { credential } = await req.json();
    if (!credential) {
      return NextResponse.json({ error: 'Missing Google credential.' }, { status: 400 });
    }
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ error: 'Invalid Google token.' }, { status: 401 });
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
      // (Consider making password nullable in the future for OAuth-only users)
      const randomPassword = Math.random().toString(36).slice(-12);
      user = await prisma.user.create({
        data: {
          firstName,
          middleName,
          lastName,
          name: [firstName, middleName, lastName].filter(Boolean).join(' '),
          email,
          password: randomPassword, // Set a random password for Google users
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
          data: { avatar },
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
      return NextResponse.json({ error: 'User creation or fetch failed.' }, { status: 500 });
    }
    // Remove password before returning user
    const { password: _pw, ...userWithoutPassword } = user;
    const token = signJwt({ userId: user.id, email: user.email, name: user.firstName, role: user.role });
    return NextResponse.json({ token, user: userWithoutPassword, isNewUser });
  } catch (error: any) {
    return NextResponse.json({ error: 'Google authentication failed.' }, { status: 500 });
  }
} 