import * as jwt from 'jsonwebtoken';

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