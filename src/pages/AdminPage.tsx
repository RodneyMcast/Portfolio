import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAppDispatch } from '../app/hooks';
import { defaultPortfolioContent, type PortfolioContent } from '../data/portfolioContent';
import type { SkillGroup } from '../components/about/SkillsGrid';
import { replaceProjects } from '../features/projects/projectsSlice';
import type { Project, ProjectCategory } from '../features/projects/types';
import { setSiteContent } from '../features/siteContent/siteContentSlice';
import {
  clonePortfolioContent,
  fetchAdminKey,
  fetchPortfolioContent,
  savePortfolioContent,
  uploadPortfolioImage,
} from '../services/portfolioContentApi';

import type { FormEvent } from 'react';

type AdminMessage = {
  tone: 'success' | 'error' | 'info';
  text: string;
};

type AdminTab = 'projects' | 'about' | 'skills' | 'settings';

const adminTabs: Array<{ id: AdminTab; label: string }> = [
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'settings', label: 'Admin' },
];

const sessionKey = 'portfolio.adminUnlocked';
const projectCategoryOptions: ProjectCategory[] = ['web', 'mobile', 'games', 'blender', 'api'];

const stringify = (value: unknown) => JSON.stringify(value, null, 2);

const parseEditorJson = <T,>(label: string, value: string): T => {
  try {
    return JSON.parse(value) as T;
  } catch {
    throw new Error(`${label} is not valid JSON.`);
  }
};

const createEmptyProject = (): Project => ({
  id: `project-${Date.now()}`,
  title: 'New project',
  description: '',
  longDescription: '',
  year: new Date().getFullYear(),
  category: 'web',
  techStack: [],
  imageUrl: '',
  liveUrl: '',
  repoUrl: '',
});

const createEmptySkill = () => ({
  name: 'New Skill',
  iconText: 'SK',
  iconUrl: '',
  description: '',
});

const createEmptySkillGroup = (): SkillGroup => ({
  title: 'New Skill Group',
  summary: '',
  skills: [createEmptySkill()],
});

const createAccordionState = (length: number, open = false) => Array.from({ length }, () => open);

export const AdminPage = () => {
  const dispatch = useAppDispatch();
  const [isUnlocked, setIsUnlocked] = useState(
    () => window.sessionStorage.getItem(sessionKey) === 'true',
  );
  const [keycode, setKeycode] = useState('');
  const [projects, setProjects] = useState<Project[]>(() => clonePortfolioContent().projects);
  const [projectOpenState, setProjectOpenState] = useState<boolean[]>(() =>
    createAccordionState(clonePortfolioContent().projects.length),
  );
  const [aboutJson, setAboutJson] = useState(() => stringify(defaultPortfolioContent.about));
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(() =>
    clonePortfolioContent().skillGroups,
  );
  const [skillGroupOpenState, setSkillGroupOpenState] = useState<boolean[]>(() =>
    createAccordionState(clonePortfolioContent().skillGroups.length),
  );
  const [skillOpenState, setSkillOpenState] = useState<boolean[][]>(() =>
    clonePortfolioContent().skillGroups.map((group) => createAccordionState(group.skills.length)),
  );
  const [adminKey, setAdminKey] = useState(defaultPortfolioContent.adminKey);
  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [source, setSource] = useState<'firestore' | 'local'>('local');
  const [isBusy, setIsBusy] = useState(false);
  const [message, setMessage] = useState<AdminMessage>({
    tone: 'info',
    text: 'Unlock the admin panel to edit portfolio content.',
  });

  const localDefaultText = useMemo(() => stringify(defaultPortfolioContent), []);

  const loadContentIntoEditors = useCallback((content: PortfolioContent) => {
    setProjects(content.projects);
    setProjectOpenState(createAccordionState(content.projects.length));
    setAboutJson(stringify(content.about));
    setSkillGroups(content.skillGroups);
    setSkillGroupOpenState(createAccordionState(content.skillGroups.length));
    setSkillOpenState(content.skillGroups.map((group) => createAccordionState(group.skills.length)));
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
      projects,
      about: parseEditorJson<PortfolioContent['about']>('About content', aboutJson),
      skillGroups,
      adminKey: adminKey.trim() || defaultPortfolioContent.adminKey,
    }),
    [aboutJson, adminKey, projects, skillGroups],
  );

  const updateProject = useCallback(
    <K extends keyof Project>(index: number, key: K, value: Project[K]) => {
      setProjects((current) =>
        current.map((project, i) => (i === index ? { ...project, [key]: value } : project)),
      );
    },
    [],
  );

  const updateProjectStack = useCallback((index: number, value: string) => {
    const techStack = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    updateProject(index, 'techStack', techStack);
  }, [updateProject]);

  const addProject = useCallback(() => {
    setProjects((current) => [...current, createEmptyProject()]);
    setProjectOpenState((current) => [...current, true]);
  }, []);

  const removeProject = useCallback((index: number) => {
    setProjects((current) => current.filter((_, i) => i !== index));
    setProjectOpenState((current) => current.filter((_, i) => i !== index));
  }, []);

  const toggleProject = useCallback((index: number) => {
    setProjectOpenState((current) => current.map((isOpen, i) => (i === index ? !isOpen : isOpen)));
  }, []);

  const updateSkillGroup = useCallback(
    <K extends keyof SkillGroup>(groupIndex: number, key: K, value: SkillGroup[K]) => {
      setSkillGroups((current) =>
        current.map((group, i) => (i === groupIndex ? { ...group, [key]: value } : group)),
      );
    },
    [],
  );

  const addSkillGroup = useCallback(() => {
    setSkillGroups((current) => [...current, createEmptySkillGroup()]);
    setSkillGroupOpenState((current) => [...current, true]);
    setSkillOpenState((current) => [...current, [true]]);
  }, []);

  const removeSkillGroup = useCallback((groupIndex: number) => {
    setSkillGroups((current) => current.filter((_, i) => i !== groupIndex));
    setSkillGroupOpenState((current) => current.filter((_, i) => i !== groupIndex));
    setSkillOpenState((current) => current.filter((_, i) => i !== groupIndex));
  }, []);

  const toggleSkillGroup = useCallback((groupIndex: number) => {
    setSkillGroupOpenState((current) =>
      current.map((isOpen, i) => (i === groupIndex ? !isOpen : isOpen)),
    );
  }, []);

  const updateSkill = useCallback(
    (
      groupIndex: number,
      skillIndex: number,
      key: 'name' | 'iconText' | 'iconUrl' | 'description',
      value: string,
    ) => {
      setSkillGroups((current) =>
        current.map((group, i) => {
          if (i !== groupIndex) {
            return group;
          }

          return {
            ...group,
            skills: group.skills.map((skill, j) =>
              j === skillIndex ? { ...skill, [key]: value } : skill,
            ),
          };
        }),
      );
    },
    [],
  );

  const addSkill = useCallback((groupIndex: number) => {
    setSkillGroups((current) =>
      current.map((group, i) =>
        i === groupIndex ? { ...group, skills: [...group.skills, createEmptySkill()] } : group,
      ),
    );
    setSkillOpenState((current) =>
      current.map((groupState, i) =>
        i === groupIndex ? [...groupState, true] : groupState,
      ),
    );
  }, []);

  const removeSkill = useCallback((groupIndex: number, skillIndex: number) => {
    setSkillGroups((current) =>
      current.map((group, i) => {
        if (i !== groupIndex) {
          return group;
        }

        return {
          ...group,
          skills: group.skills.filter((_, j) => j !== skillIndex),
        };
      }),
    );
    setSkillOpenState((current) =>
      current.map((groupState, i) =>
        i === groupIndex ? groupState.filter((_, j) => j !== skillIndex) : groupState,
      ),
    );
  }, []);

  const toggleSkill = useCallback((groupIndex: number, skillIndex: number) => {
    setSkillOpenState((current) =>
      current.map((groupState, i) =>
        i === groupIndex
          ? groupState.map((isOpen, j) => (j === skillIndex ? !isOpen : isOpen))
          : groupState,
      ),
    );
  }, []);

  const handleProjectImageUpload = async (projectIndex: number, file?: File) => {
    if (!file) {
      return;
    }

    setIsBusy(true);
    try {
      const imageUrl = await uploadPortfolioImage(file, 'projects');
      updateProject(projectIndex, 'imageUrl', imageUrl);
      setMessage({ tone: 'success', text: 'Project image uploaded.' });
    } catch (error) {
      setMessage({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Failed to upload project image.',
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleSkillImageUpload = async (groupIndex: number, skillIndex: number, file?: File) => {
    if (!file) {
      return;
    }

    setIsBusy(true);
    try {
      const imageUrl = await uploadPortfolioImage(file, 'skills');
      updateSkill(groupIndex, skillIndex, 'iconUrl', imageUrl);
      setMessage({ tone: 'success', text: 'Skill icon uploaded.' });
    } catch (error) {
      setMessage({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Failed to upload skill icon.',
      });
    } finally {
      setIsBusy(false);
    }
  };

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

      <div className="admin-tabs" role="tablist" aria-label="Admin sections">
        {adminTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className={`pill admin-tab${activeTab === tab.id ? ' is-active' : ''}`}
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'projects' ? (
        <section className="admin-panel">
          <div className="admin-editor">
            <div className="admin-editor-title-row">
              <span>Projects</span>
              <button className="button-link ghost" type="button" onClick={addProject} disabled={isBusy}>
                Add Project
              </button>
            </div>
            <div className="admin-list">
              {projects.map((project, projectIndex) => (
                <article className="admin-item" key={project.id || `project-${projectIndex}`}>
                  <button
                    type="button"
                    className="admin-item-summary"
                    aria-expanded={projectOpenState[projectIndex] ?? false}
                    onClick={() => toggleProject(projectIndex)}
                  >
                    <strong>{project.title || `Project ${projectIndex + 1}`}</strong>
                    <span>{project.category} · {project.year}</span>
                  </button>
                  {projectOpenState[projectIndex] ? (
                    <div className="admin-item-body">
                      <div className="admin-item-actions">
                        <span className="admin-muted">Edit project details</span>
                        <button
                          className="button-link ghost"
                          type="button"
                          onClick={() => removeProject(projectIndex)}
                          disabled={isBusy}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="admin-preview-row">
                        <img
                          className="admin-preview-image"
                          src={project.imageUrl || '/images/Park.png'}
                          alt={project.title}
                        />
                        <p className="admin-muted">
                          Upload a wide image for the best card and detail result. The preview updates from the
                          URL field or upload button.
                        </p>
                      </div>
                      <div className="admin-form-grid two">
                        <label>
                          <span>ID</span>
                          <input
                            value={project.id}
                            onChange={(event) => updateProject(projectIndex, 'id', event.target.value)}
                          />
                        </label>
                        <label>
                          <span>Category</span>
                          <select
                            value={project.category}
                            onChange={(event) =>
                              updateProject(projectIndex, 'category', event.target.value as ProjectCategory)
                            }
                          >
                            {projectCategoryOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          <span>Title</span>
                          <input
                            value={project.title}
                            onChange={(event) => updateProject(projectIndex, 'title', event.target.value)}
                          />
                        </label>
                        <label>
                          <span>Year</span>
                          <input
                            type="number"
                            value={project.year}
                            onChange={(event) =>
                              updateProject(projectIndex, 'year', Number(event.target.value) || project.year)
                            }
                          />
                        </label>
                        <label className="full">
                          <span>Description</span>
                          <input
                            value={project.description}
                            onChange={(event) =>
                              updateProject(projectIndex, 'description', event.target.value)
                            }
                          />
                        </label>
                        <label className="full">
                          <span>Long Description</span>
                          <textarea
                            value={project.longDescription}
                            onChange={(event) =>
                              updateProject(projectIndex, 'longDescription', event.target.value)
                            }
                          />
                        </label>
                        <label className="full">
                          <span>Tech Stack (comma-separated)</span>
                          <input
                            value={project.techStack.join(', ')}
                            onChange={(event) => updateProjectStack(projectIndex, event.target.value)}
                          />
                        </label>
                        <label className="full">
                          <span>Image URL</span>
                          <input
                            value={project.imageUrl}
                            onChange={(event) => updateProject(projectIndex, 'imageUrl', event.target.value)}
                          />
                        </label>
                        <label className="full">
                          <span>Upload Project Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                              void handleProjectImageUpload(projectIndex, event.target.files?.[0])
                            }
                          />
                        </label>
                        <label>
                          <span>Live URL</span>
                          <input
                            value={project.liveUrl}
                            onChange={(event) => updateProject(projectIndex, 'liveUrl', event.target.value)}
                          />
                        </label>
                        <label>
                          <span>Repo URL</span>
                          <input
                            value={project.repoUrl}
                            onChange={(event) => updateProject(projectIndex, 'repoUrl', event.target.value)}
                          />
                        </label>
                      </div>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'about' ? (
        <section className="admin-panel">
          <label className="admin-editor">
            <span>About + Quick Facts JSON</span>
            <textarea value={aboutJson} onChange={(event) => setAboutJson(event.target.value)} />
          </label>
        </section>
      ) : null}

      {activeTab === 'skills' ? (
        <section className="admin-panel">
          <div className="admin-editor">
            <div className="admin-editor-title-row">
              <span>Technical Skills</span>
              <button className="button-link ghost" type="button" onClick={addSkillGroup} disabled={isBusy}>
                Add Group
              </button>
            </div>
            <div className="admin-list">
              {skillGroups.map((group, groupIndex) => (
                <article className="admin-item" key={`${group.title}-${groupIndex}`}>
                  <button
                    type="button"
                    className="admin-item-summary"
                    aria-expanded={skillGroupOpenState[groupIndex] ?? false}
                    onClick={() => toggleSkillGroup(groupIndex)}
                  >
                    <strong>{group.title || `Group ${groupIndex + 1}`}</strong>
                    <span>{group.skills.length} skills</span>
                  </button>
                  {skillGroupOpenState[groupIndex] ? (
                    <div className="admin-item-body">
                      <div className="admin-item-actions">
                        <span className="admin-muted">Edit group and skills</span>
                        <button
                          className="button-link ghost"
                          type="button"
                          onClick={() => removeSkillGroup(groupIndex)}
                          disabled={isBusy}
                        >
                          Remove Group
                        </button>
                      </div>
                      <div className="admin-form-grid two">
                        <label>
                          <span>Group Title</span>
                          <input
                            value={group.title}
                            onChange={(event) => updateSkillGroup(groupIndex, 'title', event.target.value)}
                          />
                        </label>
                        <label>
                          <span>Summary</span>
                          <input
                            value={group.summary}
                            onChange={(event) => updateSkillGroup(groupIndex, 'summary', event.target.value)}
                          />
                        </label>
                      </div>

                      <div className="admin-sub-actions">
                        <button
                          className="button-link ghost"
                          type="button"
                          onClick={() => addSkill(groupIndex)}
                          disabled={isBusy}
                        >
                          Add Skill
                        </button>
                      </div>

                      {group.skills.map((skill, skillIndex) => (
                        <article className="admin-sub-item" key={`${skill.name}-${skillIndex}`}>
                          <button
                            type="button"
                            className="admin-item-summary admin-sub-summary"
                            aria-expanded={skillOpenState[groupIndex]?.[skillIndex] ?? false}
                            onClick={() => toggleSkill(groupIndex, skillIndex)}
                          >
                            <strong>{skill.name || `Skill ${skillIndex + 1}`}</strong>
                            <span>{skill.iconText}</span>
                          </button>
                          {skillOpenState[groupIndex]?.[skillIndex] ? (
                            <div className="admin-item-body">
                              <div className="admin-item-actions">
                                <span className="admin-muted">Edit skill</span>
                                <button
                                  className="button-link ghost"
                                  type="button"
                                  onClick={() => removeSkill(groupIndex, skillIndex)}
                                  disabled={isBusy}
                                >
                                  Remove Skill
                                </button>
                              </div>
                              <div className="admin-preview-row">
                                <div className="skill-icon admin-skill-preview" aria-hidden="true">
                                  {skill.iconUrl ? (
                                    <img className="skill-icon-image" src={skill.iconUrl} alt="" />
                                  ) : (
                                    skill.iconText
                                  )}
                                </div>
                                <p className="admin-muted">Use a square icon if possible. Text still works as fallback.</p>
                              </div>
                              <div className="admin-form-grid two">
                                <label>
                                  <span>Name</span>
                                  <input
                                    value={skill.name}
                                    onChange={(event) =>
                                      updateSkill(groupIndex, skillIndex, 'name', event.target.value)
                                    }
                                  />
                                </label>
                                <label>
                                  <span>Icon Text</span>
                                  <input
                                    value={skill.iconText}
                                    onChange={(event) =>
                                      updateSkill(groupIndex, skillIndex, 'iconText', event.target.value)
                                    }
                                  />
                                </label>
                                <label className="full">
                                  <span>Icon Image URL (optional)</span>
                                  <input
                                    value={skill.iconUrl ?? ''}
                                    onChange={(event) =>
                                      updateSkill(groupIndex, skillIndex, 'iconUrl', event.target.value)
                                    }
                                  />
                                </label>
                                <label className="full">
                                  <span>Upload Skill Icon</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) =>
                                      void handleSkillImageUpload(
                                        groupIndex,
                                        skillIndex,
                                        event.target.files?.[0],
                                      )
                                    }
                                  />
                                </label>
                                <label className="full">
                                  <span>Description</span>
                                  <textarea
                                    value={skill.description}
                                    onChange={(event) =>
                                      updateSkill(groupIndex, skillIndex, 'description', event.target.value)
                                    }
                                  />
                                </label>
                              </div>
                            </div>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'settings' ? (
        <section className="admin-panel admin-settings-panel">
          <label className="admin-editor admin-editor-small">
            <span>Admin keycode</span>
            <input value={adminKey} onChange={(event) => setAdminKey(event.target.value)} />
          </label>
          <details className="admin-defaults">
            <summary>View local fallback payload</summary>
            <pre>{localDefaultText}</pre>
          </details>
        </section>
      ) : null}

      <div className="admin-mobile-spacer" />
    </section>
  );
};

export default AdminPage;
