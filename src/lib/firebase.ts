import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// @ts-ignore
const env = import.meta.env;

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyCme2vZrQ_Albfz2OOWh5S1Gkt7B9p0IAo",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "pipohydroindonesia-3b153.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "pipohydroindonesia-3b153",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "pipohydroindonesia-3b153.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "37326267714",
  appId: env.VITE_FIREBASE_APP_ID || "1:37326267714:web:f12b12f09b25df44c5d4db",
  measurementId: "G-H74VSTF5DK"
};

let app;
try {
  // Inisialisasi Firebase
  app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Inisialisasi layanan Firebase yang akan digunakan
export const auth = app ? getAuth(app) : ({} as any);
export const db = app ? getFirestore(app) : ({} as any);
export const googleProvider = new GoogleAuthProvider();
