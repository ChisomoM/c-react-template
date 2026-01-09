'use client'

import type { ReactNode } from 'react';
import {
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SupabaseAuthService } from '@/services/SupabaseAuthService';
import { User } from '@/services/types';
import type {
  AuthUser,
  AuthTokens,
  AuthContextValue,
} from '@/types/auth';
import { STORAGE_KEYS } from '../../types/auth';
import { AuthContext } from './AuthContext';


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const authService = new SupabaseAuthService();

  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKENS);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (err) {
      console.error('Failed to clear storage:', err);
    }
  }, []);

  const convertUserToAuthUser = useCallback((user: User): AuthUser => {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      accountType: user.role === 'admin' ? 'admin' : 'admin', // adjust as needed
      isActive: true,
      isVerified: true,
    };
  }, []);

 
  const restoreSessionFromStorage = useCallback(async () => {
    try {
      const user = await authService.getUser();
      if (user) {
        const authUser = convertUserToAuthUser(user);
        setUser(authUser);
        // For Supabase, tokens are handled internally
        const authTokens: AuthTokens = { token: 'supabase_session' };
        setTokens(authTokens);
      }
    } catch (err) {
      console.error('Failed to restore session:', err);
      clearStorage();
    } finally {
      setIsLoading(false);
    }
  }, [authService, convertUserToAuthUser, clearStorage]);

  /**
   * Persist auth state to localStorage
   * Called after login to save tokens and user data
   */
  const saveToStorage = useCallback(
    (authUser: AuthUser, authTokens: AuthTokens) => {
      try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authUser));
        localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(authTokens));
      } catch (err) {
        console.error('Failed to save auth state to storage:', err);
        toast.error('Failed to save authentication state');
      }
    },
    []
  );
   
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const user = await authService.login({ email, password });
        const authUser = convertUserToAuthUser(user);

        // For Supabase, we don't have a separate token, but we can set a dummy token or handle differently
        // Since Supabase handles auth via cookies/sessions, we can set tokens to null or a placeholder
        const authTokens: AuthTokens = { token: 'supabase_session' };

        // Save to storage and update context
        saveToStorage(authUser, authTokens);
        setTokens(authTokens);
        setUser(authUser);

        // Show success message
        toast.success('Login successful!');

        // Auto-redirect based on role
        const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/';
        router.push(redirectPath);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Login failed';
        setError(errorMsg);
        toast.error(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [authService, convertUserToAuthUser, saveToStorage, router]
  );

  /**
    LOGOUT - Clear all auth state and redirect to login
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();

      // Clear storage and state
      clearStorage();
      setTokens(null);
      setUser(null);
      setError(null);

      // Redirect to login
      router.push('/login');
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Logout failed');
    }
  }, [authService, clearStorage, router]);


  useEffect(() => {
    restoreSessionFromStorage();
  }, [restoreSessionFromStorage]);



  const value: AuthContextValue = {
    // State
    user,
    tokens,
    isLoading,
    isAuthenticated: !!user && !!tokens,
    error,

    // Methods
    login,
    logout,
    setUser,
    setTokens,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
