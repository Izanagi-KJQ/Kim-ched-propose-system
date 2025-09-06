import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BulkUserUpdateSchema, validateRequest } from '@/lib/validations';
import { validateAdminAccess } from '@/lib/jwt';

export const runtime = 'nodejs';

export async function PATCH(req: NextRequest) {
  // Validate admin access
  const authResult = validateAdminAccess(req);
  if (!authResult.success) {
    return NextResponse.json({ 
      error: authResult.error,
      details: ['Administrator privileges required for bulk user operations']
    }, { 
      status: authResult.error === 'Authentication required' ? 401 : 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    
    // Validate request with Zod
    const validation = validateRequest(BulkUserUpdateSchema, body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error, 
        details: validation.details 
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { ids, operation } = validation.data;
    
    const updated: string[] = [];
    const deleted: string[] = [];
    const failed: { id: string; error: string; code?: string }[] = [];
    
    for (const id of ids) {
      try {
        // Prevent admin user from being deleted or deactivated
        const user = await prisma.user.findUnique({
          where: { id },
          select: { id: true, email: true, role: true }
        });
        
        if (!user) {
          failed.push({ id, error: 'User not found', code: 'NOT_FOUND' });
          continue;
        }
        
        // Protect the admin user
        if (user.email === 'angelojoseenrico@gmail.com' && (operation === 'delete' || operation === 'deactivate')) {
          failed.push({ id, error: 'Cannot modify admin user', code: 'PROTECTED_USER' });
          continue;
        }
        
        switch (operation) {
          case 'activate':
            await prisma.user.update({
              where: { id },
              data: { 
                status: 'active',
                lastActive: new Date()
              }
            });
            updated.push(id);
            break;
            
          case 'deactivate':
            await prisma.user.update({
              where: { id },
              data: { 
                status: 'inactive',
                lastActive: new Date()
              }
            });
            updated.push(id);
            break;
            
          case 'delete':
            await prisma.user.delete({
              where: { id }
            });
            deleted.push(id);
            break;
            
          default:
            failed.push({ id, error: 'Invalid operation', code: 'INVALID_OPERATION' });
        }
      } catch (err: any) {
        let errorMsg = 'Operation failed';
        let errorCode = undefined;
        
        if (err?.code === 'P2025') {
          errorMsg = 'User not found';
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
        successful: updated.length + deleted.length,
        failed: failed.length
      },
      updated,
      deleted,
      failed,
      metadata: {
        operation: `bulk_user_${operation}`,
        timestamp: new Date(),
        batchId
      }
    };
    
    return NextResponse.json(responseData, {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    console.error('Bulk user update error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        error: 'Bulk user operation validation failed',
        details: error.errors?.map((e: any) => e.message) || ['Invalid request data']
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return NextResponse.json({ 
      error: 'Bulk user operation failed',
      details: ['An unexpected error occurred during bulk user operation']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}