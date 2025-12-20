import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./index";
import type { AdminProfile } from "../../types/admin";
import { USER_ROLES } from "../constants";
import { ROLE_PERMISSIONS } from "../permissions";

export const seedDefaultAdmin = async () => {
  const email = "admin@zute.com";
  const password = "Password123!"; // Default password
  const firstName = "Super";
  const lastName = "Admin";

  try {
    // 1. Create Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Update Auth Profile
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    // 3. Create Admin Profile in Firestore
    const adminProfile: AdminProfile = {
      id: user.uid,
      uid: user.uid,
      email: user.email || email,
      firstName,
      lastName,
      role: USER_ROLES.SUPER_ADMIN,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
      permissions: ROLE_PERMISSIONS[USER_ROLES.SUPER_ADMIN],
    };

    await setDoc(doc(db, "admins", user.uid), adminProfile);

    console.log("Default admin seeded successfully");
    return { success: true, message: "Admin created successfully. Email: admin@zute.com, Password: Password123!" };
  } catch (error) {
    console.error("Error seeding admin:", error);
    if (error && typeof error === 'object' && 'code' in error && error.code === "auth/email-already-in-use") {
      return { success: false, message: "Admin user already exists" };
    }
    return { success: false, message: error instanceof Error ? error.message : "Failed to seed admin" };
  }
};
