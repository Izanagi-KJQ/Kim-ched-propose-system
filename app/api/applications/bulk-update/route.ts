import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BulkUpdateSchema, validateRequest } from '@/lib/validations';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request with Zod
    const validation = validateRequest(BulkUpdateSchema, body);
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
    const failed: { id: string; error: string }[] = [];
    
    for (const id of ids) {
      try {
        await prisma.application.update({
          where: { id },
          data: { status },
        });
        updated.push(id);
      } catch (err: any) {
        const errorMsg = err?.code === 'P2025' ? 'Application not found' : 'Update failed';
        failed.push({ id, error: errorMsg });
      }
    }
    
    const success = failed.length === 0;
    
    return NextResponse.json({ 
      success, 
      updated, 
      failed,
      summary: {
        total: ids.length,
        successful: updated.length,
        failed: failed.length
      }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Bulk update error:', error);
    
    return NextResponse.json({ 
      error: 'Batch update failed',
      details: ['Internal server error occurred during bulk update']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 