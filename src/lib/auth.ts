import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'ecell_vitb_jwt_super_secret_production_key_2026_innovate_create_lead';
const AUTH_COOKIE_NAME = 'ecell_admin_token';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';

export interface AuthPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(req: NextRequest): AuthPayload | null {
  const cookie = req.cookies.get(AUTH_COOKIE_NAME);
  if (!cookie?.value) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return verifyToken(authHeader.substring(7));
    }
    return null;
  }
  return verifyToken(cookie.value);
}

export { AUTH_COOKIE_NAME };
