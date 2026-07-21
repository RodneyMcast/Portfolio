import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? undefined,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? undefined,
};

const isLikelyProjectId = (value: string | undefined) =>
  Boolean(value && /^[a-z0-9-]+$/.test(value));

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    isLikelyProjectId(firebaseConfig.projectId) &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId,
);

const firebaseApp = isFirebaseConfigured
  ? (getApps()[0] ?? initializeApp(firebaseConfig))
  : null;

export const firestoreDb = firebaseApp ? getFirestore(firebaseApp) : null;
export const authService = firebaseApp ? getAuth(firebaseApp) : null;
export const storageDb = firebaseApp ? getStorage(firebaseApp) : null;
