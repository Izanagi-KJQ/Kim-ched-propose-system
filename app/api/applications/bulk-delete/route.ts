import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BulkDeleteSchema, validateRequest } from '@/lib/validations';

export const runtime = 'nodejs';

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request with Zod
    const validation = validateRequest(BulkDeleteSchema, body);
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
    
    // If permanent deletion, actually delete from database
    if (permanent) {
      for (const id of ids) {
        try {
          await prisma.application.delete({
            where: { id }
          });
          deleted.push(id);
        } catch (err: any) {
          let errorMsg = 'Delete failed';
          let errorCode = undefined;
          
          if (err?.code === 'P2025') {
            errorMsg = 'Application not found';
            errorCode = 'NOT_FOUND';
          } else if (err?.code === 'P2003') {
            errorMsg = 'Cannot delete: has dependencies';
            errorCode = 'DEPENDENCY_ERROR';
          }
          
          failed.push({ id, error: errorMsg, code: errorCode });
        }
      }
    } else {
      // For soft delete, we'd typically update a 'deleted' flag
      // Since this system uses frontend trash handling, we'll just validate IDs exist
      for (const id of ids) {
        try {
          const application = await prisma.application.findUnique({
            where: { id },
            select: { id: true }
          });
          
          if (application) {
            deleted.push(id);
          } else {
            failed.push({ id, error: 'Application not found', code: 'NOT_FOUND' });
          }
        } catch (err: any) {
          failed.push({ id, error: 'Validation failed', code: 'VALIDATION_ERROR' });
        }
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
        operation: permanent ? 'bulk_permanent_delete' : 'bulk_soft_delete',
        timestamp: new Date(),
        batchId
      }
    };
    
    return NextResponse.json(responseData, {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    console.error('Bulk delete error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        error: 'Bulk delete validation failed',
        details: error.errors?.map((e: any) => e.message) || ['Invalid request data']
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return NextResponse.json({ 
      error: 'Bulk delete operation failed',
      details: ['An unexpected error occurred during bulk delete']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}