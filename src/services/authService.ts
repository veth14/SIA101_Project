import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export type UserRole = 'guest' | 'admin' | 'staff';

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
}

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userData = await getUserData(userCredential.user.uid);
    
    if (!userData) {
      // If user auth exists but no user data, create a default user document
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: userCredential.user.email || email,
        role: 'guest',
        createdAt: new Date()
      });
      return getUserData(userCredential.user.uid);
    }
    
    return userData;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (email: string, password: string, role: UserRole = 'guest') => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    uid: userCredential.user.uid,
    email,
    role,
    createdAt: new Date()
  });
  return getUserData(userCredential.user.uid);
};

export const logoutUser = () => signOut(auth);

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.log('No user document found for uid:', uid);
      return null;
    }
    
    const data = userDoc.data() as UserData;
    return {
      ...data,
      uid: uid // Ensure UID is always included
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};
