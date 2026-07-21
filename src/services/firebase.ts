import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
};

const isLikelyProjectId = (value: string | undefined) =>
  Boolean(value && /^[a-z0-9-]+$/.test(value));

const normalizeEmail = (value: string | undefined) => value?.trim().toLowerCase() ?? '';

// This hides the editor for anyone except the configured owner. Firestore and
// Storage rules below remain the actual security boundary for write access.
export const isConfiguredAdminEmail = (email: string | null | undefined) => {
  const configuredEmail = normalizeEmail(import.meta.env.VITE_ADMIN_EMAIL as string | undefined);
  return Boolean(configuredEmail && normalizeEmail(email) === configuredEmail);
};

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
