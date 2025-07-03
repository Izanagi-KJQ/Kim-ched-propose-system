import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const data = await req.json();
    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        name: data.name,
        region: data.region,
        email: data.email,
        scholarshipId: data.scholarshipId,
        amount: data.amount,
        gpa: data.gpa,
        status: data.status,
        submittedDate: new Date(data.submittedDate),
        avatar: data.avatar,
        review: data.review,
        score: data.score,
        userId: data.userId,
      },
    });
    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
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