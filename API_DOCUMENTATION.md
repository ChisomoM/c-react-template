# API Documentation

This document describes the API endpoints available in the React Template backend.

## Base URL
```
http://localhost:3000/api
```

## Response Format

All API responses follow a standardized format:

**Success Response:**
```json
{
  "data": {
    // Response data object
  },
  "message": "Success message",
  "status": 1
}
```

**Error Response:**
```json
{
  "data": null,
  "message": "Error message",
  "status": 0
}
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "abc123",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2025-12-21T..."
    },
    "token": "jwt-token-here"
  },
  "message": "User registered successfully",
  "status": 1
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "abc123",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2025-12-21T..."
    },
    "token": "jwt-token-here"
  },
  "message": "Login successful",
  "status": 1
}
```

### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": {
    "id": "abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-12-21T..."
  },
  "message": "Profile retrieved successfully",
  "status": 1
}
```

## Items API

### Get All Items
```http
GET /api/items
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": {
    "items": [
      {
        "id": "item123",
        "title": "Sample Item",
        "description": "This is a sample item",
        "userId": "abc123",
        "createdAt": "2025-12-21T...",
        "updatedAt": "2025-12-21T..."
      }
    ],
    "count": 1
  },
  "message": "Items retrieved successfully",
  "status": 1
}
```

### Create Item
```http
POST /api/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Item",
  "description": "Description of the new item"
}
```

**Response:**
```json
{
  "data": {
    "id": "new-item-id",
    "title": "New Item",
    "description": "Description of the new item",
    "userId": "abc123",
    "createdAt": "2025-12-21T...",
    "updatedAt": "2025-12-21T..."
  },
  "message": "Item created successfully",
  "status": 1
}
```

### Get Single Item
```http
GET /api/items/{id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": {
    "id": "item123",
    "title": "Sample Item",
    "description": "This is a sample item",
    "userId": "abc123",
    "createdAt": "2025-12-21T...",
    "updatedAt": "2025-12-21T..."
  },
  "message": "Item retrieved successfully",
  "status": 1
}
```

### Update Item
```http
PUT /api/items/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "data": {
    "id": "item123",
    "title": "Updated Title",
    "description": "Updated description",
    "userId": "abc123",
    "createdAt": "2025-12-21T...",
    "updatedAt": "2025-12-21T..."
  },
  "message": "Item updated successfully",
  "status": 1
}
```

### Delete Item
```http
DELETE /api/items/{id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": {
    "id": "item123",
    "title": "Sample Item",
    "description": "This is a sample item",
    "userId": "abc123",
    "createdAt": "2025-12-21T...",
    "updatedAt": "2025-12-21T..."
  },
  "message": "Item deleted successfully",
  "status": 1
}
```

## Health Check

### Get API Health
```http
GET /api/health
```

**Response:**
```json
{
  "data": {
    "status": "ok",
    "timestamp": "2025-12-21T...",
    "version": "1.0.0"
  },
  "message": "API is running",
  "status": 1
}
```

## Error Responses

All endpoints may return the following error format:

```json
{
  "data": null,
  "message": "Error message here",
  "status": 0
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `409` - Conflict (user already exists)
- `500` - Internal Server Error

## Development Notes

- This template uses in-memory storage for demonstration
- In production, replace with a proper database (PostgreSQL, MongoDB, etc.)
- Update the `JWT_SECRET` environment variable
- Configure CORS properly for production
- Add rate limiting and other security measures