import type { ReactNode } from 'react';
import {
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
// import { post } from '../api/crud';
import { signInWithFirebase } from '../auth/firebaseAuth';
import { FirebaseFirestore } from '../firebase/firestore';
import type {
  AuthUser,
  AuthTokens,
  AuthContextValue,
} from '@/types/auth';
import { STORAGE_KEYS } from '../../types/auth';
import { AuthContext } from './AuthContext';
import { ROLE_PERMISSIONS } from '../permissions';
import { type UserRole, USER_ROLES } from '../constants';


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKENS);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (err) {
      console.error('Failed to clear storage:', err);
    }
  }, []);

 
  const restoreSessionFromStorage = useCallback(() => {
    try {
      const storedTokens = localStorage.getItem(STORAGE_KEYS.TOKENS);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (storedTokens && storedUser) {
        const parsedTokens = JSON.parse(storedTokens);
        const parsedUser = JSON.parse(storedUser);

        setTokens(parsedTokens);
        setUser(parsedUser);
      }
    } catch (err) {
      console.error('Failed to restore session from storage:', err);
      clearStorage();
    } finally {
      setIsLoading(false);
    }
  }, [clearStorage]);

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
   
  // New API only: response.data.user + response.data.token
  // const deriveUserFromResponse = useCallback(
  //   (user: LoginUser): AuthUser => {
  //     const baseUser: AuthUser = {
  //       id: String(user.id ?? ''),
  //       email: user.email ?? '',
  //       accountType: 'admin',
  //       isActive: !(user.blocked ?? false),
  //       isVerified: true,
  //       firstName: user.first_name ?? undefined,
  //       lastName: user.last_name ?? undefined,
  //     };

  //     // If user is a super user, role is already set via accountType
  //     if (user.is_superUser) baseUser.role = 'admin';

  //     return baseUser;
  //   },
  //   []
  // );



  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // Firebase Login
        const firebaseUser = await signInWithFirebase(email, password);
        const token = await firebaseUser.getIdToken();

        // Fetch user profile from Firestore to get Role and Permissions
        let userProfile: any = null;
        let role: UserRole = USER_ROLES.TEACHER; // Default
        let permissions: string[] = [];
        let assignedRegions: string[] = [];

        // Check 'admins' collection first
        try {
          const adminDoc = await FirebaseFirestore.getDocument('admins', firebaseUser.uid) as AdminProfile | null;
          if (adminDoc) {
            userProfile = adminDoc;
            role = (adminDoc.role as UserRole) || USER_ROLES.SUPER_ADMIN; // Fallback for legacy
            permissions = adminDoc.permissions || ROLE_PERMISSIONS[role] || [];
            assignedRegions = adminDoc.assignedRegions || [];
          } else {
            // Check 'users' collection (for teachers)
            const userDoc = await FirebaseFirestore.getDocument('users', firebaseUser.uid);
            if (userDoc) {
              userProfile = userDoc;
              role = (userDoc.role as UserRole) || USER_ROLES.TEACHER;
              permissions = userDoc.permissions || ROLE_PERMISSIONS[role] || [];
            }
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          // Fallback if profile fetch fails (e.g. new user not yet in DB)
          // In production, you might want to block login here
        }

        const authUser: AuthUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          accountType: 'admin', // Legacy field
          isActive: true,
          isVerified: firebaseUser.emailVerified,
          firstName: userProfile?.firstName || firebaseUser.displayName?.split(' ')[0] || '',
          lastName: userProfile?.lastName || firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
          role: role,
          permissions: permissions,
          assignedRegions: assignedRegions,
          myReferralCode: userProfile?.myReferralCode,
          // Map other fields as needed
          blocked: false,
          status: 1,
          username: firebaseUser.email || '',
          first_name: userProfile?.firstName || firebaseUser.displayName?.split(' ')[0] || '',
          last_name: userProfile?.lastName || firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
          is_superUser: role === USER_ROLES.SUPER_ADMIN
        };

        const authTokens: AuthTokens = { token };

        // Save to storage and update context
        saveToStorage(authUser, authTokens);
        setTokens(authTokens);
        setUser(authUser);

        // Show success message
        toast.success(`Welcome back, ${authUser.firstName}!`);

        // Auto-redirect based on role
        if (role === USER_ROLES.TEACHER) {
          navigate('/dashboard');
        } else {
          navigate('/admin/dashboard');
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Login failed';
        setError(errorMsg);
        toast.error(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [saveToStorage, navigate]
  );

  /**
    LOGOUT - Clear all auth state and redirect to login
   */
  const logout = useCallback(async () => {
    try {
      // Clear storage and state
      clearStorage();
      setTokens(null);
      setUser(null);
      setError(null);

      // Redirect to login
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Logout failed');
    }
  }, [clearStorage, navigate]);


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
