import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import type { Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAnPd-oqi2Wxb9KAX8eg9hA231S82WCer8",
  authDomain: "hotel-management-d5827.firebaseapp.com",
  projectId: "hotel-management-d5827",
  storageBucket: "hotel-management-d5827.firebasestorage.app",
  messagingSenderId: "207200611187",
  appId: "1:207200611187:web:72d4a57e3e4abcbc44b306",
  measurementId: "G-KH6S7HLEK7"
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
