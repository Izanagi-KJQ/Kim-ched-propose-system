import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiScholarshipCreateSchema, validateRequest } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const scholarships = await prisma.scholarship.findMany();
    return NextResponse.json(scholarships);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch scholarships' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request with Zod
    const validation = validateRequest(ApiScholarshipCreateSchema, body);
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
    
    const scholarship = await prisma.scholarship.create({
      data: {
        name: data.name,
        amount: data.amount,
        deadline: new Date(data.deadline),
        applicants: data.applicants || 0,
        status: data.status,
        type: data.type,
      },
    });
    
    return NextResponse.json(scholarship, { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Scholarship creation error:', error);
    
    // Handle Prisma/database specific errors
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'Scholarship already exists', 
        details: ['A scholarship with this name already exists'] 
      }, { 
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create scholarship',
      details: ['Internal server error occurred']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 