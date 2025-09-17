import { auth, db } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import type { CreateUserCredentials, User } from '../types/auth.types';

export const initializeUserWithRole = async (
  userData: CreateUserCredentials
): Promise<User> => {
  const { email, password, displayName, role } = userData;

  try {
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user: firebaseUser } = userCredential;

    // Set display name if provided
    if (displayName) {
      await updateProfile(firebaseUser, { displayName });
    }

    // Create user document in Firestore
    const user: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: displayName || undefined,
      role,
      createdAt: new Date(),
      lastLogin: new Date(),
      isEnabled: true
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), user);

    // Send password reset email for the user to set their own password
    await sendPasswordResetEmail(auth, email);

    return user;
  } catch (error) {
    console.error('Error initializing user:', error);
    throw error;
  }
};

export const createInitialAdminUser = async (
  email: string,
  password: string,
  displayName?: string
): Promise<User> => {
  return initializeUserWithRole({
    email,
    password,
    displayName,
    role: 'admin'
  });
};