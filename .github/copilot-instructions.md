# GitHub Copilot Instructions for Zute (c-react-template)

This document provides context and guidelines for AI agents working on the Zute codebase.

## Project Overview
- **Type**: Modern React Application (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Package Manager**: pnpm

## Architecture & Structure

### Directory Structure
- **`src/(admin)`**: Admin dashboard routes and components.
- **`src/(teacher)`**: Teacher dashboard routes and components.
- **`src/(public)`**: Public-facing pages (Home, Contact, Join).
- **`src/components/ui`**: Reusable UI components (shadcn/ui).
- **`src/layouts`**: Layout wrappers (`AdminLayout`, `TeacherLayout`, `MainLayout`).
- **`src/lib`**: Core utilities, API clients, and configuration.
  - **`api/`**: Backend interaction layer (`auth.tsx`, `crud.tsx`, `services.tsx`).
  - **`context/`**: React Context providers (Auth).
  - **`firebase.ts`**: Firebase initialization.

### Key Patterns
- **Routing**: Uses `react-router-dom`. Routes are defined in `src/App.tsx`.
- **Route Grouping**: Uses folder grouping with parentheses (e.g., `(admin)`) to organize related features without affecting the URL path.
- **Authentication**: Managed via `AuthContext` and `useAuth` hook.
- **Access Control**: `ProtectedRoute` component handles route protection based on `isAuthenticated`, `accountType`, `role`, and `permissions`.
- **Permissions**: Role-based access control logic resides in `src/lib/permissions.tsx`.

## Tech Stack Details
- **Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: Radix UI primitives via shadcn/ui.
- **Icons**: `lucide-react`.
- **Notifications**: `sonner` (Toaster).
- **Date Handling**: `date-fns` / `dayjs`.
- **Forms**: Custom form components (check `src/components/ui/form.tsx` if available, or standard React forms).

## Coding Conventions

### Imports & Aliases
- Use the `@/` alias for all imports from `src/`.
  - Example: `import { Button } from '@/components/ui/button';`

### Component Guidelines
- **Naming**: PascalCase for components (e.g., `AdminDashboard.tsx`).
- **Structure**: Functional components with TypeScript interfaces for props.
- **Styling**: Use Tailwind CSS utility classes. Avoid inline styles.
- **Icons**: Import icons from `lucide-react`.

### State Management
- Use `useAuth()` for user session data.
- Prefer local state (`useState`) for component-specific logic.
- Use Context for global state where necessary.

### Data Fetching
- Use the API layer in `@/lib/api` for backend interactions.
- Do not import `firebase/*` directly in UI components if a service wrapper exists in `@/lib/api`.

## Development Workflows
- **Start Server**: `pnpm dev`
- **Build**: `pnpm build` (runs `tsc` + `vite build`)
- **Lint**: `pnpm lint`

## Common Tasks
- **Adding a Route**:
  1. Create component in appropriate directory (e.g., `src/(admin)/admin/NewPage.tsx`).
  2. Add route to `src/App.tsx` inside the correct Layout/ProtectedRoute wrapper.
- **Creating a UI Component**:
  1. Check `@/components/ui` first.
  2. If creating new, follow shadcn/ui patterns (Radix primitive + Tailwind).
