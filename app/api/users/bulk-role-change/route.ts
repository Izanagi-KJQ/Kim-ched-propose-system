import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BulkUserRoleChangeSchema, validateRequest } from '@/lib/validations';
import { validateAdminAccess } from '@/lib/jwt';

export const runtime = 'nodejs';

export async function PATCH(req: NextRequest) {
  // Validate admin access
  const authResult = validateAdminAccess(req);
  if (!authResult.success) {
    return NextResponse.json({ 
      error: authResult.error,
      details: ['Administrator privileges required for bulk role changes']
    }, { 
      status: authResult.error === 'Authentication required' ? 401 : 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    
    // Validate request with Zod
    const validation = validateRequest(BulkUserRoleChangeSchema, body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error, 
        details: validation.details 
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { ids, role } = validation.data;
    
    const updated: string[] = [];
    const failed: { id: string; error: string; code?: string }[] = [];
    
    for (const id of ids) {
      try {
        // Check if user exists and prevent changing admin user role
        const user = await prisma.user.findUnique({
          where: { id },
          select: { id: true, email: true, role: true }
        });
        
        if (!user) {
          failed.push({ id, error: 'User not found', code: 'NOT_FOUND' });
          continue;
        }
        
        // Protect the admin user's role
        if (user.email === 'angelojoseenrico@gmail.com' && role !== 'Administrator') {
          failed.push({ id, error: 'Cannot change admin user role', code: 'PROTECTED_USER' });
          continue;
        }
        
        // Skip if role is already the same
        if (user.role === role) {
          failed.push({ id, error: 'User already has this role', code: 'NO_CHANGE_NEEDED' });
          continue;
        }
        
        await prisma.user.update({
          where: { id },
          data: { 
            role,
            lastActive: new Date()
          }
        });
        
        updated.push(id);
      } catch (err: any) {
        let errorMsg = 'Role change failed';
        let errorCode = undefined;
        
        if (err?.code === 'P2025') {
          errorMsg = 'User not found';
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
        operation: 'bulk_role_change',
        timestamp: new Date(),
        batchId,
        newRole: role
      }
    };
    
    return NextResponse.json(responseData, {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    console.error('Bulk role change error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        error: 'Bulk role change validation failed',
        details: error.errors?.map((e: any) => e.message) || ['Invalid request data']
      }, { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return NextResponse.json({ 
      error: 'Bulk role change failed',
      details: ['An unexpected error occurred during bulk role change']
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}