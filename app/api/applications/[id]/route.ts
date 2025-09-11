import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiApplicationUpdateSchema, validateRequest } from '@/lib/validations';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        scholarship: true,
        user: true,
      },
    });
    if (!application) return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    
    // Validate request with Zod
    const validation = validateRequest(ApiApplicationUpdateSchema, body);
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
    
    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.firstName !== undefined && { firstName: data.firstName ?? null }),
        ...(data.middleName !== undefined && { middleName: data.middleName ?? null }),
        ...(data.lastName !== undefined && { lastName: data.lastName ?? null }),
        ...(data.birthdate !== undefined && { birthdate: data.birthdate ? new Date(data.birthdate) : null }),
        ...(data.gender !== undefined && { gender: data.gender ?? null }),
        ...(data.mobileNumber !== undefined && { mobileNumber: data.mobileNumber ?? null }),
        ...(data.region && { region: data.region }),
        ...(data.city !== undefined && { city: data.city ?? null }),
        ...(data.email && { email: data.email }),
        ...(data.schoolSector !== undefined && { schoolSector: data.schoolSector ?? null }),
        ...(data.scholarshipId && { scholarshipId: data.scholarshipId }),
        ...(data.amount && { amount: data.amount }),
        ...(data.gwa !== undefined && { gwa: data.gwa }),
        ...(data.status && { status: data.status }),
        ...(data.submittedDate && { submittedDate: new Date(data.submittedDate) }),
        ...(data.documents !== undefined && { documents: data.documents ? JSON.stringify(data.documents) : null }),
        ...(data.score !== undefined && { score: data.score }),
      },
      include: {
        scholarship: true,
        user: true,
      },
    });
    
    return NextResponse.json(application, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Application update error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ 
        error: 'Application not found',
        details: ['The application you are trying to update does not exist']
      }, { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json({ 
        error: 'Invalid reference', 
        details: ['Invalid scholarship or user reference'] 
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return NextResponse.json({ 
      error: 'Failed to update application',
      details: ['Internal server error occurred']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.application.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Application deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
  }
} 