import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiScholarshipUpdateSchema, validateRequest } from '@/lib/validations';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const scholarship = await prisma.scholarship.findUnique({ where: { id: params.id } });
    if (!scholarship) return NextResponse.json({ error: 'Scholarship not found' }, { status: 404 });
    return NextResponse.json(scholarship);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch scholarship' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    
    // Validate request with Zod
    const validation = validateRequest(ApiScholarshipUpdateSchema, body);
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
    
    const scholarship = await prisma.scholarship.update({
      where: { id: params.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.amount && { amount: data.amount }),
        ...(data.deadline && { deadline: new Date(data.deadline) }),
        ...(data.applicants !== undefined && { applicants: data.applicants }),
        ...(data.status && { status: data.status }),
        ...(data.type && { type: data.type }),
      },
    });
    
    return NextResponse.json(scholarship, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Scholarship update error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ 
        error: 'Scholarship not found',
        details: ['The scholarship you are trying to update does not exist']
      }, { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'Scholarship name already exists',
        details: ['A scholarship with this name already exists']
      }, { 
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return NextResponse.json({ 
      error: 'Failed to update scholarship',
      details: ['Internal server error occurred']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.scholarship.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Scholarship deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete scholarship' }, { status: 500 });
  }
} 