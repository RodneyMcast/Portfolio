import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import {
  defaultPortfolioContent,
  sortWorkExperienceEntries,
  type PortfolioContent,
} from '../data/portfolioContent';
import { firestoreDb, isFirebaseConfigured, storageDb } from './firebase';

const contentDocPath = ['portfolioContent', 'site'] as const;
const localContentStorageKey = 'portfolio.content.localDraft';
const contentSourceStorageKey = 'portfolio.content.sourceMode';

export type PortfolioContentSource = 'firestore' | 'local';

export type PortfolioContentResult = {
  content: PortfolioContent;
  source: PortfolioContentSource;
  message?: string;
};

export type PortfolioContentFetchOptions = {
  source?: PortfolioContentSource;
};

export const clonePortfolioContent = (content: PortfolioContent = defaultPortfolioContent) =>
  JSON.parse(JSON.stringify(content)) as PortfolioContent;

const getStorage = (): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const readStoredJson = (key: string): unknown | null => {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  const rawValue = storage.getItem(key);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as unknown;
  } catch {
    return null;
  }
};

const writeStoredJson = (key: string, value: unknown) => {
  const storage = getStorage();

  if (!storage) {
    throw new Error('Browser storage is not available in this environment.');
  }

  storage.setItem(key, JSON.stringify(value));
};

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
      ? sortWorkExperienceEntries(value.workExperience as PortfolioContent['workExperience'])
      : clonePortfolioContent().workExperience,
  };
};

const readLocalDraftContent = () => mergePortfolioContent(readStoredJson(localContentStorageKey));

export const readStoredPortfolioContentSource = (): PortfolioContentSource | null => {
  const stored = readStoredJson(contentSourceStorageKey);

  if (stored === 'firestore' || stored === 'local') {
    return stored;
  }

  return null;
};

export const persistPortfolioContentSource = (source: PortfolioContentSource) => {
  writeStoredJson(contentSourceStorageKey, source);
};

export const saveLocalPortfolioContent = (content: PortfolioContent) => {
  writeStoredJson(localContentStorageKey, {
    ...content,
    workExperience: sortWorkExperienceEntries(content.workExperience),
  });
};

export const resetLocalPortfolioContentToDefaults = () => {
  saveLocalPortfolioContent(clonePortfolioContent());
};

const getContentDocRef = () => {
  if (!firestoreDb) {
    return null;
  }

  return doc(firestoreDb, ...contentDocPath);
};

export const fetchPortfolioContent = async (
  options: PortfolioContentFetchOptions = {},
): Promise<PortfolioContentResult> => {
  const preferredSource = options.source ?? 'firestore';
  const docRef = getContentDocRef();

  if (preferredSource === 'local') {
    return {
      content: readLocalDraftContent(),
      source: 'local',
      message: 'Local portfolio draft loaded from browser storage.',
    };
  }

  if (!isFirebaseConfigured || !docRef) {
    return {
      content: readLocalDraftContent(),
      source: 'local',
      message: 'Firebase is not configured, using local portfolio content.',
    };
  }

  try {
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return {
        content: readLocalDraftContent(),
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
      content: readLocalDraftContent(),
      source: 'local',
      message: 'Firestore could not be reached, using local portfolio content.',
    };
  }
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
      workExperience: sortWorkExperienceEntries(content.workExperience),
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
