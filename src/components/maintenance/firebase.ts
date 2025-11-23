import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import type { Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBEZP_MBvKdW_M12bBs2h1XZoa5cMQL17s",
  authDomain: "maintenancesystem-b3146.firebaseapp.com",
  projectId: "maintenancesystem-b3146",
  storageBucket: "maintenancesystem-b3146.firebasestorage.app",
  messagingSenderId: "442020166531",
  appId: "1:442020166531:web:291c076b989c550292d4b6",
  measurementId: "G-VRSTWX5PQT"
};

// Initialize Firebase with a specific name for maintenance module
const MAINTENANCE_APP_NAME = 'maintenance-app';
let app;

try {
  app = getApp(MAINTENANCE_APP_NAME);
} catch (e) {
  app = initializeApp(firebaseConfig, MAINTENANCE_APP_NAME);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

let analytics: Analytics | undefined;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}

export { analytics };
export default app;
