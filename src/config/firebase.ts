import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import type { Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyD9pcPxzhwFnEfZmWVyD1tdzM0-oqQr6Vo",
  authDomain: "hotelplanb-39e2a.firebaseapp.com",
  projectId: "hotelplanb-39e2a",
  storageBucket: "hotelplanb-39e2a.firebasestorage.app",
  messagingSenderId: "864251380224",
  appId: "1:864251380224:web:47ef0cbbf7873b7e260ee5",
  measurementId: "G-VNLJXNG3V6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics only in browser environment
let analytics: Analytics | undefined;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}

export { analytics };
