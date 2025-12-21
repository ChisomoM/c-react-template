import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { users, createSuccessResponse, createErrorResponse } from '@/lib/database';
import { generateToken } from '@/lib/auth-backend';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return createErrorResponse('Email and password are required', 400);
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return createErrorResponse('Invalid credentials', 401);
    }

    // Check password (in a real app, you'd store hashed passwords)
    // For this template, we'll use a simple check since we're using in-memory storage
    const isValidPassword = password === 'password123'; // Template default

    if (!isValidPassword) {
      return createErrorResponse('Invalid credentials', 401);
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    return createSuccessResponse({
      user,
      token
    }, 'Login successful');

  } catch (error) {
    console.error('Login error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}