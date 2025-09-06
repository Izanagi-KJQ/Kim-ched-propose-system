import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BulkScholarshipDeleteSchema, validateRequest } from '@/lib/validations';

export const runtime = 'nodejs';

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request with Zod
    const validation = validateRequest(BulkScholarshipDeleteSchema, body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error, 
        details: validation.details 
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { ids, permanent } = validation.data;
    
    const deleted: string[] = [];
    const failed: { id: string; error: string; code?: string }[] = [];
    
    for (const id of ids) {
      try {
        // Check if scholarship has applications
        const applicationsCount = await prisma.application.count({
          where: { scholarshipId: id }
        });
        
        if (applicationsCount > 0 && permanent) {
          failed.push({ 
            id, 
            error: `Cannot delete scholarship with ${applicationsCount} applications`, 
            code: 'HAS_APPLICATIONS' 
          });
          continue;
        }
        
        if (permanent) {
          await prisma.scholarship.delete({
            where: { id }
          });
        } else {
          // For soft delete, we'd typically update a 'deleted' flag
          // Since this system uses frontend trash handling, we'll just validate IDs exist
          const scholarship = await prisma.scholarship.findUnique({
            where: { id },
            select: { id: true }
          });
          
          if (!scholarship) {
            failed.push({ id, error: 'Scholarship not found', code: 'NOT_FOUND' });
            continue;
          }
        }
        
        deleted.push(id);
      } catch (err: any) {
        let errorMsg = 'Delete failed';
        let errorCode = undefined;
        
        if (err?.code === 'P2025') {
          errorMsg = 'Scholarship not found';
          errorCode = 'NOT_FOUND';
        } else if (err?.code === 'P2003') {
          errorMsg = 'Cannot delete: has dependencies';
          errorCode = 'DEPENDENCY_ERROR';
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
        successful: deleted.length,
        failed: failed.length
      },
      deleted,
      failed,
      metadata: {
        operation: permanent ? 'bulk_scholarship_permanent_delete' : 'bulk_scholarship_soft_delete',
        timestamp: new Date(),
        batchId
      }
    };
    
    return NextResponse.json(responseData, {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    console.error('Bulk scholarship delete error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        error: 'Bulk scholarship delete validation failed',
        details: error.errors?.map((e: any) => e.message) || ['Invalid request data']
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return NextResponse.json({ 
      error: 'Bulk scholarship delete failed',
      details: ['An unexpected error occurred during bulk scholarship delete']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}