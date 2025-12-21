import { NextRequest } from 'next/server';
import { items, createSuccessResponse, createErrorResponse } from '@/lib/database';
import { requireAuth } from '@/lib/auth-backend';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;

  const { user } = auth;
  const { id } = params;

  // Find item
  const item = items.find(i => i.id === id && i.userId === user.id);
  if (!item) {
    return createErrorResponse('Item not found', 404);
  }

  return createSuccessResponse(item, 'Item retrieved successfully');
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;

  try {
    const { title, description } = await request.json();
    const { user } = auth;
    const { id } = params;

    // Find item
    const itemIndex = items.findIndex(i => i.id === id && i.userId === user.id);
    if (itemIndex === -1) {
      return createErrorResponse('Item not found', 404);
    }

    // Validation
    if (!title || !description) {
      return createErrorResponse('Title and description are required', 400);
    }

    // Update item
    items[itemIndex] = {
      ...items[itemIndex],
      title,
      description,
      updatedAt: new Date(),
    };

    return createSuccessResponse(items[itemIndex], 'Item updated successfully');

  } catch (error) {
    console.error('Update item error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;

  const { user } = auth;
  const { id } = params;

  // Find item
  const itemIndex = items.findIndex(i => i.id === id && i.userId === user.id);
  if (itemIndex === -1) {
    return createErrorResponse('Item not found', 404);
  }

  // Remove item
  const deletedItem = items.splice(itemIndex, 1)[0];

  return createSuccessResponse(deletedItem, 'Item deleted successfully');
}