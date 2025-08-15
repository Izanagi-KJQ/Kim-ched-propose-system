import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const data = await req.json();
    
    // Server-side validation
    const validationErrors: string[] = [];
    
    // Check required fields
    if (!data.firstName?.trim()) validationErrors.push("First Name is required");
    if (!data.lastName?.trim()) validationErrors.push("Last Name is required");
    if (!data.email?.trim()) validationErrors.push("Email is required");
    if (!data.region?.trim()) validationErrors.push("Province is required");
    if (!data.scholarshipId?.trim()) validationErrors.push("Scholarship selection is required");
    if (!data.amount?.trim()) validationErrors.push("Amount is required");
    if (data.gpa === null || data.gpa === undefined) validationErrors.push("GPA is required");
    if (!data.submittedDate?.trim()) validationErrors.push("Submitted Date is required");
    
    // Check email format
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      validationErrors.push("Please enter a valid email address");
    }
    
    // Check GPA range
    if (data.gpa !== null && data.gpa !== undefined && (data.gpa < 0 || data.gpa > 5)) {
      validationErrors.push("GPA must be between 0 and 5");
    }
    
    // Check amount format
    if (data.amount && !/^\d+(\.\d{1,2})?$/.test(data.amount.replace(/[^\d.]/g, ''))) {
      validationErrors.push("Please enter a valid amount");
    }
    
    // Check if at least one name field is filled
    if (!data.firstName?.trim() && !data.lastName?.trim() && !data.name?.trim()) {
      validationErrors.push("At least one name field must be filled");
    }
    
    // Return validation errors if any
    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }
    
    // Expecting scholarshipId and (optionally) userId in the request body
    const application = await prisma.application.create({
      data: {
        name: data.name,
        firstName: data.firstName ?? null,
        middleName: data.middleName ?? null,
        lastName: data.lastName ?? null,
        birthdate: data.birthdate ? new Date(data.birthdate) : null,
        region: data.region,
        email: data.email,
        scholarshipId: data.scholarshipId,
        amount: data.amount,
        gpa: data.gpa,
        status: data.status,
        submittedDate: new Date(data.submittedDate),
        avatar: data.avatar || '',
        review: data.review,
        score: data.score,
        userId: data.userId,
      },
      include: {
        scholarship: true,
        user: true,
      },
    });
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
} 