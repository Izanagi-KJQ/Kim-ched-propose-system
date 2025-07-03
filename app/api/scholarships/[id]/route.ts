import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const data = await req.json();
    const scholarship = await prisma.scholarship.update({
      where: { id: params.id },
      data: {
        name: data.name,
        amount: data.amount,
        deadline: new Date(data.deadline),
        applicants: data.applicants,
        status: data.status,
        type: data.type,
      },
    });
    return NextResponse.json(scholarship);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update scholarship' }, { status: 500 });
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