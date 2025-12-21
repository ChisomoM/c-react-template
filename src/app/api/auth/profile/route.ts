import { NextRequest } from 'next/server';
import { createSuccessResponse } from '@/lib/database';
import { requireAuth } from '@/lib/auth-backend';

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;

  const { user } = auth;

  return createSuccessResponse(user, 'Profile retrieved successfully');
}