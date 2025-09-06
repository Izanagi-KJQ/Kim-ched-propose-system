import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BulkScholarshipUpdateSchema, validateRequest } from '@/lib/validations';

export const runtime = 'nodejs';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request with Zod
    const validation = validateRequest(BulkScholarshipUpdateSchema, body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error, 
        details: validation.details 
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { ids, status } = validation.data;
    
    const updated: string[] = [];
    const failed: { id: string; error: string; code?: string }[] = [];
    
    for (const id of ids) {
      try {
        // Check if scholarship exists
        const scholarship = await prisma.scholarship.findUnique({
          where: { id },
          select: { id: true, status: true, deadline: true }
        });
        
        if (!scholarship) {
          failed.push({ id, error: 'Scholarship not found', code: 'NOT_FOUND' });
          continue;
        }
        
        // Business logic: prevent reopening expired scholarships
        const now = new Date();
        if (scholarship.deadline < now && status === 'active') {
          failed.push({ id, error: 'Cannot activate expired scholarship', code: 'EXPIRED' });
          continue;
        }
        
        // Skip if status is already the same
        if (scholarship.status === status) {
          failed.push({ id, error: 'Scholarship already has this status', code: 'NO_CHANGE_NEEDED' });
          continue;
        }
        
        await prisma.scholarship.update({
          where: { id },
          data: { status }
        });
        
        updated.push(id);
      } catch (err: any) {
        let errorMsg = 'Status update failed';
        let errorCode = undefined;
        
        if (err?.code === 'P2025') {
          errorMsg = 'Scholarship not found';
          errorCode = 'NOT_FOUND';
        }
        
        failed.push({ id, error: errorMsg, code: errorCode });
      }
    }
    
    const batchId = Math.random().toString(36).substring(2, 10);
    const success = failed.length === 0;
    
    const responseData = {
      success,
      summary: {
        total: ids.length,
        successful: updated.length,
        failed: failed.length
      },
      updated,
      failed,
      metadata: {
        operation: 'bulk_scholarship_status_update',
        timestamp: new Date(),
        batchId,
        newStatus: status
      }
    };
    
    return NextResponse.json(responseData, {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    console.error('Bulk scholarship update error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        error: 'Bulk scholarship update validation failed',
        details: error.errors?.map((e: any) => e.message) || ['Invalid request data']
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return NextResponse.json({ 
      error: 'Bulk scholarship update failed',
      details: ['An unexpected error occurred during bulk scholarship update']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}