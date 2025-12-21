'use client'

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/useAuth';
import type { AccountType } from '@/types/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredAccountType?: AccountType | AccountType[];
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requiredAccountType,
  fallback,
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user && requiredAccountType) {
      const requiredTypes = Array.isArray(requiredAccountType)
        ? requiredAccountType
        : [requiredAccountType];

      const effectiveAccountType: AccountType = user.accountType ?? 'admin';

      if (!requiredTypes.includes(effectiveAccountType)) {
        router.push('/unauthorized');
      }
    }
  }, [isLoading, isAuthenticated, user, requiredAccountType, router]);

  // Still loading auth state - show fallback
  if (isLoading) {
    return fallback || <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Not authenticated - show fallback (redirection handled in useEffect)
  if (!isAuthenticated || !user) {
    return fallback || <div className="flex items-center justify-center min-h-screen">Redirecting...</div>;
  }

  // Check if user has required account type
  if (requiredAccountType) {
    const requiredTypes = Array.isArray(requiredAccountType)
      ? requiredAccountType
      : [requiredAccountType];
    const effectiveAccountType: AccountType = user.accountType ?? 'admin';

    if (!requiredTypes.includes(effectiveAccountType)) {
       return fallback || <div className="flex items-center justify-center min-h-screen">Redirecting...</div>;
    }
  }

  // All checks passed - render children
  return <>{children}</>;
}
