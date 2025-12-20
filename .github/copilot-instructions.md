# Project Instructions

## Project Overview
- **Stack**: React 18, TypeScript, Vite, Tailwind CSS, Radix UI.
- **Package Manager**: `pnpm`.
- **Routing**: `react-router-dom` v7.
- **State Management**: React Context (specifically `AuthContext`).
- **Icons**: `lucide-react`.
- **Notifications**: `sonner`.

## Architecture & Structure
- **Route Grouping**: Pages are organized by domain in `src/(admin)` and `src/(public)`.
- **Layouts**: Use `MainLayout` for public pages and `AdminLayout` for protected admin areas.
- **Components**:
  - `src/components/ui`: Reusable UI components (Radix UI wrappers).
  - `src/components`: Feature-specific components.
- **Context**: Global state (Auth) lives in `src/lib/context`.

## Authentication & Security
- **Auth Context**: Use `useAuth()` hook to access `user`, `tokens`, `login`, `logout`.
- **Protection**: Wrap protected routes with `<ProtectedRoute>` component.
- **Storage**: Auth tokens and user data are persisted in `localStorage` using keys defined in `STORAGE_KEYS` (`auth_tokens`, `auth_user`).
- **Token Management**: `fetchData` automatically attaches the Bearer token from storage.

## API & Data Fetching
- **Pattern**: Use `fetchData` from `@/lib/api/crud` for all API requests.
- **Endpoints**: Define all API paths in `@/lib/api/end_points.tsx` in the `API` object.
- **Usage**:
  ```typescript
  import { fetchData } from '@/lib/api/crud';
  // GET request
  const data = await fetchData('SOME_ENDPOINT_KEY', 'GET');
  // POST request
  await fetchData('SOME_ENDPOINT_KEY', 'POST', {}, payload);
  ```
- **Dynamic Routes**: Use `pipe` utility for parameterized URLs (e.g., `users/:id`).

## Styling & UI Conventions
- **Tailwind**: Use utility classes for styling. Avoid custom CSS files unless necessary.
- **Components**: Prefer using existing UI components from `@/components/ui` (e.g., `Button`, `Input`, `Dialog`) over native HTML elements.
- **Icons**: Use `lucide-react` icons.
- **Toasts**: Use `toast` from `sonner` for notifications.

## Development Workflow
- **Imports**: Use the `@/` alias for all internal imports (maps to `./src`).
- **Linting**: Run `pnpm lint` to check for issues.
- **Types**: Ensure strict type safety. Define shared types in `src/types`.
