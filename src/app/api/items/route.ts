import { NextRequest } from 'next/server';
import { items, generateId, createSuccessResponse, createErrorResponse, type Item } from '@/lib/database';
import { requireAuth } from '@/lib/auth-backend';

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;

  const { user } = auth;

  // Get user's items
  const userItems = items.filter(item => item.userId === user.id);

  return createSuccessResponse({
    items: userItems,
    count: userItems.length
  }, 'Items retrieved successfully');
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;

  try {
    const { title, description } = await request.json();
    const { user } = auth;

    // Validation
    if (!title || !description) {
      return createErrorResponse('Title and description are required', 400);
    }

    // Create item
    const newItem: Item = {
      id: generateId(),
      title,
      description,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    items.push(newItem);

    return createSuccessResponse(newItem, 'Item created successfully', 201);

  } catch (error) {
    console.error('Create item error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}