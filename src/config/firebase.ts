import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  getFirestore, 
  Firestore 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC7XjObhFPNIb9lz7HjMT_JYoNu4yUlpCg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "coffee-6ef98.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "coffee-6ef98",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "coffee-6ef98.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "168593062496",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:168593062496:web:8c52d52d588c1b06116105"
};

// Initialize Firebase safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with offline persistence
let firestoreInstance: Firestore;
try {
  firestoreInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
} catch {
  // If already initialized (e.g. during HMR), fall back to getFirestore
  firestoreInstance = getFirestore(app);
}

export const db = firestoreInstance;
