import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAzJaAvE6_KjaH8k57S0oDIlbfUYjZ7bog',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'sia101hotel.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'sia101hotel',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'sia101hotel.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1080592606767',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1080592606767:web:47867f6192e4ee6d1388da',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-W6VVQGKZ1C',
}

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  // @ts-expect-error Firebase error code typing
  if (error.code === 'app/duplicate-app') {
    // If an app already exists, get that instead
    app = getApps()[0];
  } else {
    throw error;
  }
}

// Initialize Analytics (only works in browsers)
let analytics: ReturnType<typeof getAnalytics> | undefined;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch {
    // No-op if analytics initialization fails
  }
}

// Initialize Firebase services
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
export { analytics }

export default app
