import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { ApiUserUpdateSchema, validateRequest, ChangePasswordSchema } from '@/lib/validations';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    
    // Validate request with Zod
    const validation = validateRequest(ApiUserUpdateSchema, body);
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
    
    // Hash password if provided
    const updateData: any = {
      ...(data.firstName && { firstName: data.firstName }),
      ...(data.middleName !== undefined && { middleName: data.middleName || '' }),
      ...(data.lastName && { lastName: data.lastName }),
      ...(data.email && { email: data.email }),
      ...(data.role && { role: data.role }),
      ...(data.department !== undefined && { department: data.department }),
      ...(data.status && { status: data.status }),
      lastActive: new Date(),
    };
    
    // Update computed name if name fields are being updated
    if (data.firstName || data.middleName !== undefined || data.lastName) {
      const user = await prisma.user.findUnique({ where: { id: params.id } });
      if (user) {
        const firstName = data.firstName || user.firstName;
        const middleName = data.middleName !== undefined ? data.middleName : user.middleName;
        const lastName = data.lastName || user.lastName;
        updateData.name = [firstName, middleName, lastName].filter(Boolean).join(' ');
      }
    }
    
    // Hash password if provided
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    
    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
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
    
    const needsProfileUpdate = !user.firstName || !user.lastName;
    
    return NextResponse.json({ 
      ...user, 
      needsProfileUpdate 
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('User update error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ 
        error: 'User not found',
        details: ['The user you are trying to update does not exist']
      }, { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
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
      error: 'Failed to update user',
      details: ['An unexpected error occurred during user update']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
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