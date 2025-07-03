import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const { ids, status } = await req.json();
    if (!Array.isArray(ids) || typeof status !== 'string') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    const updated: string[] = [];
    const failed: { id: string; error: string }[] = [];
    for (const id of ids) {
      try {
        const app = await prisma.application.update({
          where: { id },
          data: { status },
        });
        updated.push(id);
      } catch (err: any) {
        failed.push({ id, error: err?.message || 'Update failed' });
      }
    }
    const success = failed.length === 0;
    return NextResponse.json({ success, updated, failed });
  } catch (error) {
    return NextResponse.json({ error: 'Batch update failed' }, { status: 500 });
  }
} 