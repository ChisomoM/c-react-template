import { NextResponse } from 'next/server';
import { createSuccessResponse } from '@/lib/database';

export async function GET() {
  return createSuccessResponse({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }, 'API is running');
}