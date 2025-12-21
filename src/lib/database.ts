import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory database for template purposes
// In production, replace with a proper database like PostgreSQL, MongoDB, etc.
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

interface Item {
  id: string;
  title: string;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Template data store
const users: User[] = [];
const items: Item[] = [];

// Helper functions
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function createSuccessResponse(data: any, message: string = "Success") {
  return NextResponse.json({
    data,
    message,
    status: 0
  });
}

export function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json({
    data: null,
    message,
    status: 1
  }, { status });
}

// Export the data stores for use in API routes
export { users, items };
export type { User, Item };