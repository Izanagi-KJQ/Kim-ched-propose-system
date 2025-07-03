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