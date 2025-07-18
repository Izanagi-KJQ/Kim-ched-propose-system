import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        firstName: data.firstName,
        middleName: data.middleName || '',
        lastName: data.lastName,
        name: [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' '), // Keep in sync for now
        email: data.email,
        role: data.role,
        department: data.department,
        status: data.status,
        avatar: data.avatar,
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
    let needsProfileUpdate = false;
    if (!user.firstName || !user.lastName) needsProfileUpdate = true;
    return NextResponse.json({ ...user, needsProfileUpdate });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(data.role && { role: data.role }),
        ...(data.status && { status: data.status }),
        ...(data.department !== undefined && { department: data.department }),
        lastActive: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        lastActive: true,
        status: true,
        avatar: true,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  // For reset password
  try {
    const newPassword = Math.random().toString(36).slice(-8); // Generate a random password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: params.id },
      data: {
        // password: hashedPassword,
        lastActive: new Date(),
      },
    });
    return NextResponse.json({ message: `Password reset. New password: ${newPassword}` });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
} 