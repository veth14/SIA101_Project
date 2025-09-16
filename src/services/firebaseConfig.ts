import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAzJaAvE6_KjaH8k57S0oDIlbfUYjZ7bog',
  authDomain: 'sia101hotel.firebaseapp.com',
  projectId: 'sia101hotel',
  storageBucket: 'sia101hotel.firebasestorage.app',
  messagingSenderId: '1080592606767',
  appId: '1:1080592606767:web:47867f6192e4ee6d1388da',
  measurementId: 'G-W6VVQGKZ1C',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Analytics (only works in browsers)
let analytics: ReturnType<typeof getAnalytics> | undefined
try {
  analytics = getAnalytics(app)
} catch {
  // No-op if not in a browser environment
}

// Initialize Firebase services
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
export { analytics }

export default app
