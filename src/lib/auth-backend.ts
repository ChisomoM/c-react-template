import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { users, type User } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface JWTPayload {
  userId: string;
  email: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function getUserFromToken(token: string): User | null {
  const payload = verifyToken(token);
  if (!payload) return null;

  return users.find(user => user.id === payload.userId) || null;
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

export function requireAuth(request: NextRequest): { user: User } | { error: NextResponse } {
  const token = getTokenFromRequest(request);
  if (!token) {
    return { error: new NextResponse(JSON.stringify({
      data: null,
      message: 'No token provided',
      status: 1
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }) };
  }

  const user = getUserFromToken(token);
  if (!user) {
    return { error: new NextResponse(JSON.stringify({
      data: null,
      message: 'Invalid token',
      status: 1
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }) };
  }

  return { user };
}