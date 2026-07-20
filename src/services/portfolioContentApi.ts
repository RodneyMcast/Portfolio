import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import {
  defaultPortfolioContent,
  type PortfolioContent,
} from '../data/portfolioContent';
import { firestoreDb, isFirebaseConfigured, storageDb } from './firebase';

const contentDocPath = ['portfolioContent', 'site'] as const;

export type PortfolioContentSource = 'firestore' | 'local';

export type PortfolioContentResult = {
  content: PortfolioContent;
  source: PortfolioContentSource;
  message?: string;
};

export const clonePortfolioContent = (content: PortfolioContent = defaultPortfolioContent) =>
  JSON.parse(JSON.stringify(content)) as PortfolioContent;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const mergePortfolioContent = (value: unknown): PortfolioContent => {
  if (!isObject(value)) {
    return clonePortfolioContent();
  }

  return {
    projects: Array.isArray(value.projects)
      ? (value.projects as PortfolioContent['projects'])
      : clonePortfolioContent().projects,
    about: isObject(value.about)
      ? (value.about as PortfolioContent['about'])
      : clonePortfolioContent().about,
    skillGroups: Array.isArray(value.skillGroups)
      ? (value.skillGroups as PortfolioContent['skillGroups'])
      : clonePortfolioContent().skillGroups,
    workExperience: Array.isArray(value.workExperience)
      ? (value.workExperience as PortfolioContent['workExperience'])
      : clonePortfolioContent().workExperience,
    adminKey: typeof value.adminKey === 'string' ? value.adminKey : defaultPortfolioContent.adminKey,
  };
};

const getContentDocRef = () => {
  if (!firestoreDb) {
    return null;
  }

  return doc(firestoreDb, ...contentDocPath);
};

export const fetchPortfolioContent = async (): Promise<PortfolioContentResult> => {
  const docRef = getContentDocRef();

  if (!isFirebaseConfigured || !docRef) {
    return {
      content: clonePortfolioContent(),
      source: 'local',
      message: 'Firebase is not configured, using local portfolio content.',
    };
  }

  try {
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return {
        content: clonePortfolioContent(),
        source: 'local',
        message: 'No Firestore content found yet, using local portfolio content.',
      };
    }

    return {
      content: mergePortfolioContent(snapshot.data()),
      source: 'firestore',
    };
  } catch {
    return {
      content: clonePortfolioContent(),
      source: 'local',
      message: 'Firestore could not be reached, using local portfolio content.',
    };
  }
};

export const fetchAdminKey = async () => {
  const result = await fetchPortfolioContent();
  return result.content.adminKey || defaultPortfolioContent.adminKey;
};

export const savePortfolioContent = async (content: PortfolioContent) => {
  const docRef = getContentDocRef();

  if (!isFirebaseConfigured || !docRef) {
    throw new Error('Firebase is not configured. Add the Vite Firebase environment variables first.');
  }

  await setDoc(
    docRef,
    {
      ...content,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

export const resetPortfolioContentToDefaults = async () => {
  await savePortfolioContent(clonePortfolioContent());
};

const sanitizeFileName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '');

export const uploadPortfolioImage = async (file: File, folder: 'projects' | 'skills') => {
  if (!isFirebaseConfigured || !storageDb) {
    throw new Error('Firebase Storage is not configured. Check your Firebase environment variables.');
  }

  const timestamp = Date.now();
  const safeFileName = sanitizeFileName(file.name) || `upload-${timestamp}.png`;
  const fileRef = ref(storageDb, `portfolio/${folder}/${timestamp}-${safeFileName}`);

  await uploadBytes(fileRef, file, {
    contentType: file.type || 'application/octet-stream',
  });

  return getDownloadURL(fileRef);
};
