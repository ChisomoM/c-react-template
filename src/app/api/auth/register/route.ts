import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { users, generateId, createSuccessResponse, createErrorResponse, type User } from '@/lib/database';
import { generateToken } from '@/lib/auth-backend';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validation
    if (!email || !password || !name) {
      return createErrorResponse('Email, password, and name are required', 400);
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return createErrorResponse('User already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser: User & { password: string } = {
      id: generateId(),
      email,
      name,
      password: hashedPassword,
      createdAt: new Date(),
    };

    // Store user (in production, exclude password from storage)
    users.push(newUser);

    // Generate token
    const token = generateToken({ userId: newUser.id, email: newUser.email });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;

    return createSuccessResponse({
      user: userWithoutPassword,
      token
    }, 'User registered successfully');

  } catch (error) {
    console.error('Registration error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}