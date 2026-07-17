import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAppDispatch } from '../app/hooks';
import { defaultPortfolioContent, type PortfolioContent } from '../data/portfolioContent';
import { replaceProjects } from '../features/projects/projectsSlice';
import { setSiteContent } from '../features/siteContent/siteContentSlice';
import {
  clonePortfolioContent,
  fetchAdminKey,
  fetchPortfolioContent,
  savePortfolioContent,
} from '../services/portfolioContentApi';

import type { FormEvent } from 'react';

type AdminMessage = {
  tone: 'success' | 'error' | 'info';
  text: string;
};

const sessionKey = 'portfolio.adminUnlocked';

const stringify = (value: unknown) => JSON.stringify(value, null, 2);

const parseEditorJson = <T,>(label: string, value: string): T => {
  try {
    return JSON.parse(value) as T;
  } catch {
    throw new Error(`${label} is not valid JSON.`);
  }
};

export const AdminPage = () => {
  const dispatch = useAppDispatch();
  const [isUnlocked, setIsUnlocked] = useState(
    () => window.sessionStorage.getItem(sessionKey) === 'true',
  );
  const [keycode, setKeycode] = useState('');
  const [projectsJson, setProjectsJson] = useState(() =>
    stringify(defaultPortfolioContent.projects),
  );
  const [aboutJson, setAboutJson] = useState(() => stringify(defaultPortfolioContent.about));
  const [skillsJson, setSkillsJson] = useState(() =>
    stringify(defaultPortfolioContent.skillGroups),
  );
  const [adminKey, setAdminKey] = useState(defaultPortfolioContent.adminKey);
  const [source, setSource] = useState<'firestore' | 'local'>('local');
  const [isBusy, setIsBusy] = useState(false);
  const [message, setMessage] = useState<AdminMessage>({
    tone: 'info',
    text: 'Unlock the admin panel to edit portfolio content.',
  });

  const localDefaultText = useMemo(() => stringify(defaultPortfolioContent), []);

  const loadContentIntoEditors = useCallback((content: PortfolioContent) => {
    setProjectsJson(stringify(content.projects));
    setAboutJson(stringify(content.about));
    setSkillsJson(stringify(content.skillGroups));
    setAdminKey(content.adminKey || defaultPortfolioContent.adminKey);
  }, []);

  const loadRemoteContent = useCallback(async () => {
    setIsBusy(true);
    const result = await fetchPortfolioContent();
    loadContentIntoEditors(result.content);
    setSource(result.source);
    setMessage({
      tone: result.source === 'firestore' ? 'success' : 'info',
      text: result.message ?? 'Firestore content loaded.',
    });
    setIsBusy(false);
  }, [loadContentIntoEditors]);

  useEffect(() => {
    if (isUnlocked) {
      void loadRemoteContent();
    }
  }, [isUnlocked, loadRemoteContent]);

  const buildContentFromEditors = useCallback(
    (): PortfolioContent => ({
      projects: parseEditorJson<PortfolioContent['projects']>('Projects', projectsJson),
      about: parseEditorJson<PortfolioContent['about']>('About content', aboutJson),
      skillGroups: parseEditorJson<PortfolioContent['skillGroups']>('Skills', skillsJson),
      adminKey: adminKey.trim() || defaultPortfolioContent.adminKey,
    }),
    [aboutJson, adminKey, projectsJson, skillsJson],
  );

  const handleUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsBusy(true);

    try {
      const storedKey = await fetchAdminKey();
      if (keycode.trim() !== storedKey) {
        setMessage({ tone: 'error', text: 'Incorrect keycode.' });
        return;
      }

      window.sessionStorage.setItem(sessionKey, 'true');
      setIsUnlocked(true);
      setMessage({ tone: 'success', text: 'Admin panel unlocked.' });
    } catch (error) {
      setMessage({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Unable to unlock admin panel.',
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleSave = async () => {
    setIsBusy(true);

    try {
      const content = buildContentFromEditors();
      await savePortfolioContent(content);
      dispatch(setSiteContent(content));
      dispatch(replaceProjects(content.projects));
      setSource('firestore');
      setMessage({ tone: 'success', text: 'Saved to Firestore.' });
    } catch (error) {
      setMessage({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Unable to save Firestore content.',
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleResetDefaults = async () => {
    const confirmed = window.confirm(
      'Reset Firestore to the current local website content? This overwrites the remote portfolio content.',
    );

    if (!confirmed) {
      return;
    }

    setIsBusy(true);

    try {
      const defaults = clonePortfolioContent();
      await savePortfolioContent(defaults);
      loadContentIntoEditors(defaults);
      dispatch(setSiteContent(defaults));
      dispatch(replaceProjects(defaults.projects));
      setSource('firestore');
      setMessage({ tone: 'success', text: 'Firestore reset to local defaults.' });
    } catch (error) {
      setMessage({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Unable to reset Firestore content.',
      });
    } finally {
      setIsBusy(false);
    }
  };

  if (!isUnlocked) {
    return (
      <section className="admin-page">
        <div className="admin-card admin-login">
          <span className="eyebrow">Dev Admin</span>
          <h1>Portfolio Admin</h1>
          <p>
            Enter the keycode to edit projects, about content, quick facts, and technical skills.
          </p>
          <form className="admin-login-form" onSubmit={handleUnlock}>
            <label htmlFor="admin-keycode">Keycode</label>
            <input
              id="admin-keycode"
              type="password"
              value={keycode}
              onChange={(event) => setKeycode(event.target.value)}
              autoComplete="current-password"
            />
            <button className="button-link primary" type="submit" disabled={isBusy}>
              Unlock
            </button>
          </form>
          <p className={`admin-message is-${message.tone}`}>{message.text}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-header">
        <div>
          <span className="eyebrow">Dev Admin</span>
          <h1>Portfolio Admin</h1>
          <p>Edit Firestore content while keeping the current local site as the fallback.</p>
        </div>
        <span className="admin-source">Source: {source}</span>
      </div>

      <div className="admin-actions">
        <button className="button-link primary" type="button" onClick={handleSave} disabled={isBusy}>
          Save to Firestore
        </button>
        <button
          className="button-link ghost"
          type="button"
          onClick={loadRemoteContent}
          disabled={isBusy}
        >
          Reload Firestore
        </button>
        <button
          className="button-link ghost"
          type="button"
          onClick={handleResetDefaults}
          disabled={isBusy}
        >
          Reset Firebase to Local Defaults
        </button>
      </div>

      <p className={`admin-message is-${message.tone}`}>{message.text}</p>

      <div className="admin-editor-grid">
        <label className="admin-editor">
          <span>Projects JSON</span>
          <textarea value={projectsJson} onChange={(event) => setProjectsJson(event.target.value)} />
        </label>
        <label className="admin-editor">
          <span>About + Quick Facts JSON</span>
          <textarea value={aboutJson} onChange={(event) => setAboutJson(event.target.value)} />
        </label>
        <label className="admin-editor">
          <span>Technical Skills JSON</span>
          <textarea value={skillsJson} onChange={(event) => setSkillsJson(event.target.value)} />
        </label>
        <label className="admin-editor admin-editor-small">
          <span>Admin keycode</span>
          <input value={adminKey} onChange={(event) => setAdminKey(event.target.value)} />
        </label>
      </div>

      <details className="admin-defaults">
        <summary>View local fallback payload</summary>
        <pre>{localDefaultText}</pre>
      </details>
    </section>
  );
};

export default AdminPage;
