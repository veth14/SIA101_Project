// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration (maintenance project)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEZP_MBvKdW_M12bBs2h1XZoa5cMQL17s",
  authDomain: "maintenancesystem-b3146.firebaseapp.com",
  projectId: "maintenancesystem-b3146",
  storageBucket: "maintenancesystem-b3146.firebasestorage.app",
  messagingSenderId: "442020166531",
  appId: "1:442020166531:web:291c076b989c550292d4b6",
  measurementId: "G-VRSTWX5PQT"
};

// Initialize a named Firebase app for the maintenance feature to avoid
// duplicate default app errors when another file initializes a different
// default app (e.g. `src/config/firebase.ts`). Using a named app keeps
// both projects available in the same runtime.
const APP_NAME = 'maintenanceApp';
const app = getApps().some(a => a.name === APP_NAME) ? getApp(APP_NAME) : initializeApp(firebaseConfig, APP_NAME);

// Initialize Analytics only in browser environment and guard errors
let analytics;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Maintenance analytics init skipped or failed:', error);
  }
}

// Initialize Cloud Firestore and export as `db` so existing imports keep working
export const db = getFirestore(app);
