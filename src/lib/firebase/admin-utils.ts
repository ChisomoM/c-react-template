import { initializeApp, getApp, getApps, deleteApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import type { AdminProfile } from '@/types/admin';
import { type UserRole, type District } from '@/lib/constants';
import { ROLE_PERMISSIONS } from '@/lib/permissions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const createUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: UserRole,
  assignedRegions: District[] = []
) => {
  let secondaryApp: FirebaseApp | null = null;
  
  try {
    // Initialize a secondary app to create user without logging out the current user
    const appName = 'secondaryApp';
    const existingApps = getApps();
    const foundApp = existingApps.find(app => app.name === appName);
    
    if (foundApp) {
      secondaryApp = foundApp;
    } else {
      secondaryApp = initializeApp(firebaseConfig, appName);
    }

    const secondaryAuth = getAuth(secondaryApp);
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const user = userCredential.user;

    // Use the MAIN app's Firestore to save the profile (authenticated as the current admin)
    // We don't use secondaryApp's firestore because the new user might not have permission to write to 'admins' yet
    // But the current logged-in Super Admin DOES.
    const mainDb = getFirestore(getApp()); // Get default app's firestore

    const adminProfile: AdminProfile = {
      uid: user.uid,
      email: user.email || email,
      firstName,
      lastName,
      role,
      createdAt: new Date().toISOString(),
      lastLogin: '',
      isActive: true,
      permissions: ROLE_PERMISSIONS[role] || [],
      assignedRegions,
    };

    await setDoc(doc(mainDb, 'admins', user.uid), adminProfile);

    // Sign out the secondary auth so it doesn't interfere
    await signOut(secondaryAuth);
    
    // We should ideally delete the app to clean up, but sometimes that causes issues if called too quickly
    // await deleteApp(secondaryApp); 

    return { success: true, uid: user.uid };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message };
  }
};
