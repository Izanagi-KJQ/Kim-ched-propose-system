import * as jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { canAccessUserManagement } from './validations';

const JWT_SECRET: string = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '3600';

export function signJwt(payload: string | object | Buffer): string;
export function signJwt(payload: any) {
  // @ts-expect-error: jsonwebtoken v9+ TypeScript overload bug
  return jwt.sign(payload, JWT_SECRET as any, { expiresIn: JWT_EXPIRES_IN, algorithm: 'HS256' });
}

export function verifyJwt(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET as any, { algorithms: ['HS256'] });
  } catch {
    return null;
  }
}

// Extract user from JWT token in request headers
export function getUserFromRequest(req: NextRequest): { id: string; email: string; role: string } | null {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyJwt(token);
    
    if (!decoded || !decoded.id || !decoded.email || !decoded.role) {
      return null;
    }
    
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
  } catch {
    return null;
  }
}

// Check if user has admin access for user management
export function validateAdminAccess(req: NextRequest): { success: true; user: { id: string; email: string; role: string } } | { success: false; error: string } {
  const user = getUserFromRequest(req);
  
  if (!user) {
    return { success: false, error: 'Authentication required' };
  }
  
  if (!canAccessUserManagement(user.role)) {
    return { success: false, error: 'Administrator privileges required' };
  }
  
  return { success: true, user };
} 