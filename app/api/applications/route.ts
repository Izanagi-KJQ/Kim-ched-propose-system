import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiApplicationCreateSchema, validateRequest } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const applications = await prisma.application.findMany({
      include: {
        scholarship: true,
        user: true,
      },
    });
    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received request body:', JSON.stringify(body, null, 2));
    
    // Validate request with Zod
    const validation = validateRequest(ApiApplicationCreateSchema, body);
    if (!validation.success) {
      console.error('Validation failed:', validation.details);
      return NextResponse.json({ 
        error: validation.error, 
        details: validation.details 
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = validation.data;
    console.log('Validated data:', JSON.stringify(data, null, 2));
    
    // Build the data object for Prisma create
    const createData: any = {
      name: data.name || '',
      firstName: data.firstName ?? null,
      middleName: data.middleName ?? null,
      lastName: data.lastName ?? null,
      birthdate: data.birthdate ? new Date(data.birthdate) : null,
      gender: data.gender ?? null,
      mobileNumber: data.mobileNumber ?? null,
      region: data.region,
      city: data.city ?? null,
      email: data.email,
      schoolSector: data.schoolSector ?? null,
      amount: data.amount,
      gwa: data.gwa,
      status: data.status || 'pending',
      submittedDate: new Date(data.submittedDate),
      documents: data.documents ? JSON.stringify(data.documents) : null,
      avatar: data.avatar || '',
      review: data.review || '',
      score: data.score,
    };
    
    // Add optional foreign keys only if provided
    if (data.scholarshipId) {
      createData.scholarshipId = data.scholarshipId;
    }
    if (data.userId) {
      createData.userId = data.userId;
    }
    
    console.log('Prisma create data:', JSON.stringify(createData, null, 2));
    
    // Expecting scholarshipId and (optionally) userId in the request body
    const application = await prisma.application.create({
      data: createData,
      include: {
        scholarship: true,
        user: true,
      },
    });
    
    console.log('Application created successfully:', application.id);
    
    return NextResponse.json(application, { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Application creation error:', error);
    
    // Handle Prisma/database specific errors
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'Application already exists', 
        details: ['An application with this information already exists'] 
      }, { 
        status: 409,
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
      error: 'Failed to create application',
      details: ['Internal server error occurred']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}