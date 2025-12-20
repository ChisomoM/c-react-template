import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/context/useAuth';
import type { AccountType } from '@/types/auth';
import { type UserRole } from './constants';
import { hasPermission } from './permissions';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredAccountType?: AccountType | AccountType[]; // Legacy
  requiredRole?: UserRole | UserRole[];
  requiredPermission?: string;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requiredAccountType,
  requiredRole,
  requiredPermission,
  fallback,
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Still loading auth state - show fallback
  if (isLoading) {
    return fallback || <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required account type (Legacy)
  if (requiredAccountType) {
    const requiredTypes = Array.isArray(requiredAccountType)
      ? requiredAccountType
      : [requiredAccountType];

    const effectiveAccountType: AccountType = user.accountType ?? 'admin';

    if (!requiredTypes.includes(effectiveAccountType)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check if user has required role
  if (requiredRole) {
    const requiredRoles = Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole];
    
    if (!user.role || !requiredRoles.includes(user.role as UserRole)) {
       return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check if user has required permission
  if (requiredPermission) {
    if (!hasPermission(user, requiredPermission)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // All checks passed - render children
  return <>{children}</>;
}
