import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
const e = import.meta.env;
export const configured = Boolean(
  e.VITE_FIREBASE_API_KEY &&
  e.VITE_FIREBASE_PROJECT_ID &&
  e.VITE_FIREBASE_APP_ID,
);
const app = initializeApp({
  apiKey: e.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: e.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: e.VITE_FIREBASE_PROJECT_ID || "demo-entrelinhas",
  storageBucket: e.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: e.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: e.VITE_FIREBASE_APP_ID || "demo-app",
});
export const auth = getAuth(app);
export const db = getFirestore(app, e.VITE_FIREBASE_DATABASE_ID?.trim() || "(default)");
if (e.VITE_USE_EMULATORS === "true") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}
