import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// We check if the app is already initialized to avoid "App already exists" errors in hot-reload
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // IMPORTANT: Netlify often turns newlines (\n) into literal strings ("\\n").
      // This .replace() fixes the key so Firebase can read it.
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
  console.log("✅ Firebase initialized successfully via Env Vars");
}

const db = admin.firestore();
const User = db.collection("Users");

export { db, User };