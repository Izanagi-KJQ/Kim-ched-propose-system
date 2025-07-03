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
    // Expecting scholarshipId and (optionally) userId in the request body
    const application = await prisma.application.create({
      data: {
        name: data.name,
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