import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const data = await req.json();
    
    // Server-side validation
    const validationErrors: string[] = [];
    
    // Check required fields
    if (!data.name?.trim()) validationErrors.push("Scholarship Name is required");
    if (!data.amount?.trim()) validationErrors.push("Amount is required");
    if (!data.deadline?.trim()) validationErrors.push("Deadline is required");
    if (!data.status?.trim()) validationErrors.push("Status is required");
    
    // Check name length
    if (data.name && data.name.trim().length < 3) {
      validationErrors.push("Scholarship Name must be at least 3 characters long");
    }
    
    // Check amount format
    if (data.amount && !/^\d+(\.\d{1,2})?$/.test(data.amount.replace(/[^\d.]/g, ''))) {
      validationErrors.push("Please enter a valid amount");
    }
    
    // Check deadline (must be in the future)
    if (data.deadline) {
      const deadlineDate = new Date(data.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate <= today) {
        validationErrors.push("Deadline must be in the future");
      }
    }
    
    // Check applicants count
    if (data.applicants < 0) {
      validationErrors.push("Applicants count cannot be negative");
    }
    
    // Return validation errors if any
    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }
    
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
    return NextResponse.json(scholarship, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create scholarship' }, { status: 500 });
  }
} 