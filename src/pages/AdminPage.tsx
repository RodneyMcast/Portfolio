import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, type User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../app/hooks';
import {
  defaultPortfolioContent,
  sortWorkExperienceEntries,
  type PortfolioContent,
} from '../data/portfolioContent';
import type { SkillGroup } from '../components/about/SkillsGrid';
import { replaceProjects } from '../features/projects/projectsSlice';
import type { Project, ProjectCategory } from '../features/projects/types';
import type { WorkExperienceEntry } from '../data/portfolioContent';
import { setSiteContent } from '../features/siteContent/siteContentSlice';
import {
  clonePortfolioContent,
  fetchPortfolioContent,
  persistPortfolioContentSource,
  readStoredPortfolioContentSource,
  savePortfolioContent,
  saveLocalPortfolioContent,
  uploadPortfolioImage,
  type PortfolioContentSource,
} from '../services/portfolioContentApi';
import { authService } from '../services/firebase';

import type { FormEvent } from 'react';

type AdminMessage = {
  tone: 'success' | 'error' | 'info';
  text: string;
};

type AdminTab = 'projects' | 'about' | 'skills' | 'jobs' | 'settings';

const adminTabs: Array<{ id: AdminTab; label: string }> = [
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'jobs', label: 'Jobs' },
  { id: 'settings', label: 'Admin' },
];

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

const createEmptyWorkExperience = (): WorkExperienceEntry => ({
  start: 'Jan 2026',
  end: '',
  current: true,
  title: 'New Role',
  organisation: 'Organisation',
  location: '',
  summary: '',
  highlights: [''],
});

const parseListText = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const listToText = (items: string[]) => items.join(', ');

const linesToList = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const listToLines = (items: string[]) => items.join('\n');

const createAccordionState = (length: number, open = false) => Array.from({ length }, () => open);
const createStableId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const moveItem = <T,>(items: T[], fromIndex: number, toIndex: number) => {
  if (toIndex < 0 || toIndex >= items.length || fromIndex === toIndex) {
    return items;
  }

  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
};

const includesQuery = (values: Array<string | number | boolean | undefined>, query: string) => {
  if (!query) {
    return true;
  }

  const normalizedQuery = query.toLowerCase();
  return values.some((value) => String(value ?? '').toLowerCase().includes(normalizedQuery));
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

type FocusTarget =
  | { kind: 'project'; index: number }
  | { kind: 'skillGroup'; index: number }
  | { kind: 'work'; index: number }
  | null;

export const AdminPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const autosaveTimerRef = useRef<number | null>(null);
  const loginRedirectTimerRef = useRef<number | null>(null);
  const projectIdInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const skillGroupTitleRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const workTitleRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const pendingFocusRef = useRef<FocusTarget>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [projects, setProjects] = useState<Project[]>(() => clonePortfolioContent().projects);
  const [projectUiIds, setProjectUiIds] = useState<string[]>(() =>
    clonePortfolioContent().projects.map((_, index) => createStableId(`project-${index}`)),
  );
  const [projectTechStackDrafts, setProjectTechStackDrafts] = useState<string[]>(() =>
    clonePortfolioContent().projects.map((project) => listToText(project.techStack)),
  );
  const [projectOpenState, setProjectOpenState] = useState<boolean[]>(() =>
    createAccordionState(clonePortfolioContent().projects.length),
  );
  const [aboutJson, setAboutJson] = useState(() => stringify(defaultPortfolioContent.about));
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(() =>
    clonePortfolioContent().skillGroups,
  );
  const [skillGroupUiIds, setSkillGroupUiIds] = useState<string[]>(() =>
    clonePortfolioContent().skillGroups.map((_, index) => createStableId(`skill-group-${index}`)),
  );
  const [skillUiIds, setSkillUiIds] = useState<string[][]>(() =>
    clonePortfolioContent().skillGroups.map((group, groupIndex) =>
      group.skills.map((_, skillIndex) => createStableId(`skill-${groupIndex}-${skillIndex}`)),
    ),
  );
  const [skillGroupOpenState, setSkillGroupOpenState] = useState<boolean[]>(() =>
    createAccordionState(clonePortfolioContent().skillGroups.length),
  );
  const [skillOpenState, setSkillOpenState] = useState<boolean[][]>(() =>
    clonePortfolioContent().skillGroups.map((group) => createAccordionState(group.skills.length)),
  );
  const [workExperience, setWorkExperience] = useState<WorkExperienceEntry[]>(() =>
    clonePortfolioContent().workExperience,
  );
  const [workHighlightsDrafts, setWorkHighlightsDrafts] = useState<string[]>(() =>
    clonePortfolioContent().workExperience.map((entry) => listToLines(entry.highlights)),
  );
  const [workExperienceUiIds, setWorkExperienceUiIds] = useState<string[]>(() =>
    clonePortfolioContent().workExperience.map((_, index) => createStableId(`work-${index}`)),
  );
  const [workExperienceOpenState, setWorkExperienceOpenState] = useState<boolean[]>(() =>
    createAccordionState(clonePortfolioContent().workExperience.length),
  );
  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [contentSourceMode, setContentSourceMode] = useState<PortfolioContentSource>(
    () => readStoredPortfolioContentSource() ?? 'firestore',
  );
  const [source, setSource] = useState<PortfolioContentSource>('local');
  const [isBusy, setIsBusy] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [lastSavedSignature, setLastSavedSignature] = useState('');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<PortfolioContent | null>(null);
  const [pendingFocus, setPendingFocus] = useState<FocusTarget>(null);
  const [message, setMessage] = useState<AdminMessage>({
    tone: 'info',
    text: 'Admin and dev access only. Sign in with your Firebase email account.',
  });

  const localDefaultText = useMemo(() => stringify(defaultPortfolioContent), []);

  const loadContentIntoEditors = useCallback((content: PortfolioContent) => {
    setProjects(content.projects);
    setProjectUiIds(content.projects.map((_, index) => createStableId(`project-${index}`)));
    setProjectTechStackDrafts(content.projects.map((project) => listToText(project.techStack)));
    setProjectOpenState(createAccordionState(content.projects.length));
    setAboutJson(stringify(content.about));
    setSkillGroups(content.skillGroups);
    setSkillGroupUiIds(content.skillGroups.map((_, index) => createStableId(`skill-group-${index}`)));
    setSkillUiIds(
      content.skillGroups.map((group, groupIndex) =>
        group.skills.map((_, skillIndex) => createStableId(`skill-${groupIndex}-${skillIndex}`)),
      ),
    );
    setSkillGroupOpenState(createAccordionState(content.skillGroups.length));
    setSkillOpenState(content.skillGroups.map((group) => createAccordionState(group.skills.length)));
    setWorkExperience(content.workExperience);
    setWorkHighlightsDrafts(content.workExperience.map((entry) => listToLines(entry.highlights)));
    setWorkExperienceUiIds(content.workExperience.map((_, index) => createStableId(`work-${index}`)));
    setWorkExperienceOpenState(createAccordionState(content.workExperience.length));
    setSavedSnapshot(clonePortfolioContent(content));
    setLastSavedSignature(stringify(content));
    setIsHydrated(true);
  }, []);

  const loadContentForMode = useCallback(
    async (mode: PortfolioContentSource) => {
      setIsBusy(true);

      try {
        const result = await fetchPortfolioContent({ source: mode });
        loadContentIntoEditors(result.content);
        setSource(result.source);
        setMessage({
          tone: result.source === 'firestore' ? 'success' : 'info',
          text:
            result.message ??
            (mode === 'local' ? 'Local content loaded.' : 'Firestore content loaded.'),
        });
      } finally {
        setIsBusy(false);
      }
    },
    [loadContentIntoEditors],
  );

  useEffect(() => {
    if (authUser) {
      void loadContentForMode(contentSourceMode);
    }
  }, [authUser, contentSourceMode, loadContentForMode]);

  useEffect(() => {
    persistPortfolioContentSource(contentSourceMode);
  }, [contentSourceMode]);

  useEffect(() => {
    if (!authService) {
      setAuthReady(true);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(authService, (user: User | null) => {
      setAuthUser(user);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const buildContentFromEditors = useCallback(
    (): PortfolioContent => ({
      projects: projects.map((project: Project, index: number) => ({
        ...project,
        techStack: parseListText(projectTechStackDrafts[index] ?? listToText(project.techStack)),
      })),
      about: parseEditorJson<PortfolioContent['about']>('About content', aboutJson),
      skillGroups,
      workExperience: sortWorkExperienceEntries(
        workExperience.map((entry: WorkExperienceEntry, index: number) => ({
          ...entry,
          highlights: linesToList(workHighlightsDrafts[index] ?? listToLines(entry.highlights)),
        })),
      ),
    }),
    [aboutJson, projectTechStackDrafts, projects, skillGroups, workExperience, workHighlightsDrafts],
  );

  const currentContent = useMemo(() => {
    try {
      return buildContentFromEditors();
    } catch {
      return null;
    }
  }, [buildContentFromEditors]);

  const currentSignature = useMemo(
    () => (currentContent ? stringify(currentContent) : ''),
    [currentContent],
  );

  const isDirty = isHydrated && (currentContent ? currentSignature !== lastSavedSignature : true);
  const currentTimeLabel = lastSavedAt ?? 'Not saved yet';

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredProjects = useMemo(
    () =>
      projects
        .map((project, projectIndex) => ({ project, projectIndex }))
        .filter(({ project }) =>
          includesQuery(
            [
              project.id,
              project.title,
              project.description,
              project.longDescription,
              project.year,
              project.category,
              project.liveUrl,
              project.repoUrl,
              ...project.techStack,
            ],
            normalizedQuery,
          ),
        ),
    [normalizedQuery, projects],
  );

  const filteredSkillGroups = useMemo(
    () =>
      skillGroups
        .map((group, groupIndex) => {
          const skills = group.skills
            .map((skill, skillIndex) => ({ skill, skillIndex }))
            .filter(({ skill }) =>
              includesQuery(
                [skill.name, skill.iconText, skill.iconUrl, skill.description, group.title, group.summary],
                normalizedQuery,
              ),
            );

          const groupMatches = includesQuery([group.title, group.summary], normalizedQuery);
          if (!groupMatches && skills.length === 0) {
            return null;
          }

          return { group, groupIndex, skills: groupMatches ? group.skills.map((skill, skillIndex) => ({ skill, skillIndex })) : skills };
        })
        .filter((group): group is { group: SkillGroup; groupIndex: number; skills: Array<{ skill: SkillGroup['skills'][number]; skillIndex: number }> } => Boolean(group)),
    [normalizedQuery, skillGroups],
  );

  const filteredWorkExperience = useMemo(
    () =>
      workExperience
        .map((entry, entryIndex) => ({ entry, entryIndex }))
        .filter(({ entry }) =>
          includesQuery(
            [
              entry.start,
              entry.end,
              entry.current,
              entry.title,
              entry.organisation,
              entry.location,
              entry.summary,
              ...entry.highlights,
            ],
            normalizedQuery,
          ),
        ),
    [normalizedQuery, workExperience],
  );

  const saveContent = useCallback(
    async (
      content: PortfolioContent,
      successMessage: string,
      options?: { silent?: boolean; source?: PortfolioContentSource },
    ) => {
      setIsSaving(true);

      try {
        const normalizedContent = {
          ...content,
          workExperience: sortWorkExperienceEntries(content.workExperience),
        };
        const targetSource = options?.source ?? contentSourceMode;

        if (targetSource === 'local') {
          saveLocalPortfolioContent(normalizedContent);
        } else {
          await savePortfolioContent(normalizedContent);
        }

        dispatch(setSiteContent({ content: normalizedContent, source: targetSource }));
        dispatch(replaceProjects(normalizedContent.projects));
        setSource(targetSource);
        setSavedSnapshot(clonePortfolioContent(normalizedContent));
        setLastSavedSignature(stringify(normalizedContent));
        setLastSavedAt(formatTime(new Date()));

        if (!options?.silent) {
          setMessage({ tone: 'success', text: successMessage });
        }
      } catch (error) {
        setMessage({
          tone: 'error',
          text:
            error instanceof Error
              ? error.message
              : contentSourceMode === 'local'
                ? 'Unable to save local content.'
                : 'Unable to save Firestore content.',
        });
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [contentSourceMode, dispatch],
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
    setProjectTechStackDrafts((current) =>
      current.map((draft, i) => (i === index ? value : draft)),
    );
  }, [updateProject]);

  const addProject = useCallback(() => {
    setProjects((current) => {
      const nextIndex = current.length;
      setPendingFocus({ kind: 'project', index: nextIndex });
      return [...current, createEmptyProject()];
    });
    setProjectUiIds((current) => [...current, createStableId('project')]);
    setProjectTechStackDrafts((current) => [...current, '']);
    setProjectOpenState((current) => [...current, true]);
  }, []);

  const removeProject = useCallback((index: number) => {
    setProjects((current) => current.filter((_, i) => i !== index));
    setProjectUiIds((current) => current.filter((_, i) => i !== index));
    setProjectTechStackDrafts((current) => current.filter((_, i) => i !== index));
    setProjectOpenState((current) => current.filter((_, i) => i !== index));
  }, []);

  const confirmRemoveProject = useCallback(
    (index: number) => {
      const project = projects[index];
      const label = project
        ? `Delete project "${project.title || 'Untitled project'}" (${project.id || 'no id'})?`
        : 'Delete this project?';

      if (window.confirm(label)) {
        removeProject(index);
      }
    },
    [projects, removeProject],
  );

  const moveProject = useCallback((index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    setProjects((current) => moveItem(current, index, targetIndex));
    setProjectUiIds((current) => moveItem(current, index, targetIndex));
    setProjectTechStackDrafts((current) => moveItem(current, index, targetIndex));
    setProjectOpenState((current) => moveItem(current, index, targetIndex));
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
    setSkillGroups((current) => {
      const nextIndex = current.length;
      setPendingFocus({ kind: 'skillGroup', index: nextIndex });
      return [...current, createEmptySkillGroup()];
    });
    setSkillGroupUiIds((current) => [...current, createStableId('skill-group')]);
    setSkillUiIds((current) => [...current, [createStableId('skill')]]);
    setSkillGroupOpenState((current) => [...current, true]);
    setSkillOpenState((current) => [...current, [true]]);
  }, []);

  const removeSkillGroup = useCallback((groupIndex: number) => {
    setSkillGroups((current) => current.filter((_, i) => i !== groupIndex));
    setSkillGroupUiIds((current) => current.filter((_, i) => i !== groupIndex));
    setSkillUiIds((current) => current.filter((_, i) => i !== groupIndex));
    setSkillGroupOpenState((current) => current.filter((_, i) => i !== groupIndex));
    setSkillOpenState((current) => current.filter((_, i) => i !== groupIndex));
  }, []);

  const confirmRemoveSkillGroup = useCallback(
    (groupIndex: number) => {
      const group = skillGroups[groupIndex];
      const label = group
        ? `Delete skill group "${group.title || 'Untitled group'}"?`
        : 'Delete this skill group?';

      if (window.confirm(label)) {
        removeSkillGroup(groupIndex);
      }
    },
    [removeSkillGroup, skillGroups],
  );

  const moveSkillGroup = useCallback((groupIndex: number, direction: -1 | 1) => {
    const targetIndex = groupIndex + direction;
    setSkillGroups((current) => moveItem(current, groupIndex, targetIndex));
    setSkillGroupUiIds((current) => moveItem(current, groupIndex, targetIndex));
    setSkillUiIds((current) => moveItem(current, groupIndex, targetIndex));
    setSkillGroupOpenState((current) => moveItem(current, groupIndex, targetIndex));
    setSkillOpenState((current) => moveItem(current, groupIndex, targetIndex));
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
    setSkillUiIds((current) =>
      current.map((groupIds, i) =>
        i === groupIndex ? [...groupIds, createStableId('skill')] : groupIds,
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
    setSkillUiIds((current) =>
      current.map((groupIds, i) =>
        i === groupIndex ? groupIds.filter((_, j) => j !== skillIndex) : groupIds,
      ),
    );
  }, []);

  const moveSkill = useCallback((groupIndex: number, skillIndex: number, direction: -1 | 1) => {
    const targetIndex = skillIndex + direction;

    setSkillGroups((current) =>
      current.map((group, i) => {
        if (i !== groupIndex) {
          return group;
        }

        return {
          ...group,
          skills: moveItem(group.skills, skillIndex, targetIndex),
        };
      }),
    );
    setSkillOpenState((current) =>
      current.map((groupState, i) =>
        i === groupIndex ? moveItem(groupState, skillIndex, targetIndex) : groupState,
      ),
    );
    setSkillUiIds((current) =>
      current.map((groupIds, i) =>
        i === groupIndex ? moveItem(groupIds, skillIndex, targetIndex) : groupIds,
      ),
    );
  }, []);

  const addWorkExperience = useCallback(() => {
    setWorkExperience((current) => {
      const nextIndex = current.length;
      setPendingFocus({ kind: 'work', index: nextIndex });
      return [...current, createEmptyWorkExperience()];
    });
    setWorkHighlightsDrafts((current) => [...current, '']);
    setWorkExperienceUiIds((current) => [...current, createStableId('work')]);
    setWorkExperienceOpenState((current) => [...current, true]);
  }, []);

  const removeWorkExperience = useCallback((index: number) => {
    setWorkExperience((current) => current.filter((_, i) => i !== index));
    setWorkHighlightsDrafts((current) => current.filter((_, i) => i !== index));
    setWorkExperienceUiIds((current) => current.filter((_, i) => i !== index));
    setWorkExperienceOpenState((current) => current.filter((_, i) => i !== index));
  }, []);

  const confirmRemoveWorkExperience = useCallback(
    (index: number) => {
      const entry = workExperience[index];
      const label = entry
        ? `Delete role "${entry.title || 'Untitled role'}" (${entry.start || 'no start date'})?`
        : 'Delete this role?';

      if (window.confirm(label)) {
        removeWorkExperience(index);
      }
    },
    [removeWorkExperience, workExperience],
  );

  const toggleWorkExperience = useCallback((index: number) => {
    setWorkExperienceOpenState((current) =>
      current.map((isOpen, i) => (i === index ? !isOpen : isOpen)),
    );
  }, []);

  const updateWorkExperience = useCallback(
    <K extends keyof WorkExperienceEntry>(index: number, key: K, value: WorkExperienceEntry[K]) => {
      setWorkExperience((current) =>
        current.map((entry, i) => (i === index ? { ...entry, [key]: value } : entry)),
      );
    },
    [],
  );

  const updateWorkHighlights = useCallback((index: number, value: string) => {
    setWorkHighlightsDrafts((current) => current.map((draft, i) => (i === index ? value : draft)));
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

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsBusy(true);

    if (!authService) {
      setMessage({
        tone: 'error',
        text: 'Firebase Auth is not configured. Check your Firebase environment variables.',
      });
      setIsBusy(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(authService, loginEmail.trim(), loginPassword);
      setMessage({ tone: 'success', text: 'Admin access granted.' });
    } catch (error) {
      setMessage({
        tone: 'error',
        text: 'Wrong email or password. Redirecting to the home page.',
      });
      if (loginRedirectTimerRef.current) {
        window.clearTimeout(loginRedirectTimerRef.current);
      }
      loginRedirectTimerRef.current = window.setTimeout(() => {
        navigate('/');
      }, 2500);
      return;
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    return () => {
      if (loginRedirectTimerRef.current) {
        window.clearTimeout(loginRedirectTimerRef.current);
      }
    };
  }, []);

  const handleSave = async () => {
    try {
      if (!currentContent) {
        throw new Error('One of the editor panels contains invalid data. Fix it before saving.');
      }

      await saveContent(
        currentContent,
        contentSourceMode === 'local' ? 'Saved to local browser draft.' : 'Saved to Firestore.',
        { source: contentSourceMode },
      );
    } catch (error) {
      setMessage({
        tone: 'error',
        text:
          error instanceof Error
            ? error.message
            : contentSourceMode === 'local'
              ? 'Unable to save local content.'
              : 'Unable to save Firestore content.',
      });
    }
  };

  const handleResetDefaults = async () => {
    const confirmed = window.confirm(
      contentSourceMode === 'local'
        ? 'Reset the local browser draft to the current website defaults? This only affects this browser.'
        : 'Reset Firestore to the current local website content? This overwrites the remote portfolio content.',
    );

    if (!confirmed) {
      return;
    }

    try {
      const defaults = clonePortfolioContent();
      await saveContent(
        defaults,
        contentSourceMode === 'local'
          ? 'Local draft reset to local defaults.'
          : 'Firestore reset to local defaults.',
        { source: contentSourceMode },
      );
      loadContentIntoEditors(defaults);
    } catch (error) {
      setMessage({
        tone: 'error',
        text:
          error instanceof Error
            ? error.message
            : contentSourceMode === 'local'
              ? 'Unable to reset local content.'
              : 'Unable to reset Firestore content.',
      });
    }
  };

  const handleSaveProject = useCallback(async (projectIndex: number) => {
    try {
      if (!currentContent) {
        throw new Error('Fix the invalid editor content before saving this project.');
      }

      const updatedProjects = [...currentContent.projects];
      updatedProjects[projectIndex] = currentContent.projects[projectIndex];
      await saveContent({ ...currentContent, projects: updatedProjects }, 'Project saved.');
    } catch (error) {
      setMessage({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Unable to save this project.',
      });
    }
  }, [currentContent, saveContent]);

  const handleSaveSkillGroup = useCallback(async () => {
    try {
      if (!currentContent) {
        throw new Error('Fix the invalid editor content before saving this skill group.');
      }

      await saveContent(currentContent, 'Skill group saved.');
    } catch (error) {
      setMessage({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Unable to save this skill group.',
      });
    }
  }, [currentContent, saveContent]);

  const handleSaveWorkExperience = useCallback(async () => {
    try {
      if (!currentContent) {
        throw new Error('Fix the invalid editor content before saving this role.');
      }

      await saveContent(currentContent, 'Job saved.');
    } catch (error) {
      setMessage({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Unable to save this job.',
      });
    }
  }, [currentContent, saveContent]);

  const handleUndoLastSave = useCallback(() => {
    if (!savedSnapshot) {
      setMessage({ tone: 'info', text: 'Nothing to undo yet.' });
      return;
    }

    loadContentIntoEditors(savedSnapshot);
    setMessage({ tone: 'success', text: 'Reverted to the last saved version.' });
  }, [loadContentIntoEditors, savedSnapshot]);

  const collapseAllPanels = useCallback(() => {
    setProjectOpenState(createAccordionState(projects.length));
    setSkillGroupOpenState(createAccordionState(skillGroups.length));
    setSkillOpenState(skillGroups.map((group) => createAccordionState(group.skills.length)));
    setWorkExperienceOpenState(createAccordionState(workExperience.length));
  }, [projects.length, skillGroups, workExperience.length]);

  useEffect(() => {
    pendingFocusRef.current = pendingFocus;
  }, [pendingFocus]);

  useEffect(() => {
    const target = pendingFocusRef.current;
    if (!target) {
      return;
    }

    const focusTarget = (() => {
      if (target.kind === 'project') {
        return projectIdInputRefs.current[target.index];
      }

      if (target.kind === 'skillGroup') {
        return skillGroupTitleRefs.current[target.index];
      }

      return workTitleRefs.current[target.index];
    })();

    if (!focusTarget) {
      return;
    }

    window.requestAnimationFrame(() => {
      focusTarget.focus();
      focusTarget.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
    setPendingFocus(null);
  }, [pendingFocus, projectUiIds.length, skillGroupUiIds.length, workExperienceUiIds.length]);

  useEffect(() => {
    if (!authUser || !isHydrated || isBusy || isSaving || !currentContent || !isDirty) {
      return undefined;
    }

    autosaveTimerRef.current = window.setTimeout(() => {
      void saveContent(currentContent, 'Autosaved.', { silent: true, source: contentSourceMode });
    }, 1200);

    return () => {
      if (autosaveTimerRef.current) {
        window.clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [authUser, contentSourceMode, currentContent, isBusy, isDirty, isHydrated, isSaving, saveContent]);

  const handleContentSourceToggle = useCallback((useLocalContent: boolean) => {
    setContentSourceMode(useLocalContent ? 'local' : 'firestore');
  }, []);

  useEffect(() => {
    const handleKeyboardShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        void handleSave();
      }

      if (event.key === 'Escape') {
        collapseAllPanels();
      }
    };

    window.addEventListener('keydown', handleKeyboardShortcut);
    return () => window.removeEventListener('keydown', handleKeyboardShortcut);
  }, [collapseAllPanels, handleSave]);

  if (!authReady) {
    return (
      <section className="admin-page">
        <div className="admin-card admin-login">
          <span className="eyebrow">Admin / Dev Access Only</span>
          <h1>Checking access</h1>
          <p>Loading Firebase Auth...</p>
        </div>
      </section>
    );
  }

  if (!authUser) {
    return (
      <section className="admin-page">
        <div className="admin-card admin-login">
          <span className="eyebrow">Admin / Dev Access Only</span>
          <h1>Portfolio Admin</h1>
          <p>
            Sign in with your admin email and password to edit projects, about content, quick facts,
            and technical skills.
          </p>
          <form className="admin-login-form" onSubmit={handleLogin}>
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              autoComplete="username"
              placeholder="you@example.com"
            />
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Your Firebase password"
            />
            <button className="button-link primary" type="submit" disabled={isBusy}>
              Sign In
            </button>
          </form>
          <p className={`admin-message is-${message.tone}`}>{message.text}</p>
          <p className="admin-muted">If sign in fails, you will be sent back to the home page.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-header">
        <div>
          <span className="eyebrow">Admin / Dev Access Only</span>
          <h1>Portfolio Admin</h1>
        </div>
        <div className="admin-status-stack">
          <span className={`admin-source${isDirty ? ' is-dirty' : ''}`}>
            {isDirty ? 'Unsaved changes' : `Saved ${currentTimeLabel}`}
          </span>
          <span className="admin-source">Mode: {contentSourceMode}</span>
          <span className="admin-source">Loaded: {source}</span>
        </div>
      </div>

      <div className="admin-actions admin-actions-sticky">
        <button className="button-link primary" type="button" onClick={handleSave} disabled={isBusy || isSaving}>
          Save Content
        </button>
        <button
          className="button-link ghost"
          type="button"
          onClick={handleUndoLastSave}
          disabled={!savedSnapshot || isBusy || isSaving}
        >
          Undo Last Save
        </button>
        <button
          className="button-link ghost"
          type="button"
          onClick={() => void loadContentForMode(contentSourceMode)}
          disabled={isBusy || isSaving}
        >
          Reload Current Source
        </button>
        <button
          className="button-link ghost"
          type="button"
          onClick={handleResetDefaults}
          disabled={isBusy || isSaving}
        >
          Reset Current Source
        </button>
        <button
          className="button-link ghost"
          type="button"
          onClick={() => setShowPreview((current) => !current)}
          disabled={isBusy || isSaving}
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>

      <div className="admin-tools">
        <label className="admin-search">
          <span>Search dashboard</span>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search projects, jobs, skills, URLs..."
          />
        </label>
        <div className="admin-quick-jump" aria-label="Quick jump to sections">
          <button className="pill" type="button" onClick={() => setActiveTab('projects')}>
            Projects {filteredProjects.length}/{projects.length}
          </button>
          <button className="pill" type="button" onClick={() => setActiveTab('skills')}>
            Skills {filteredSkillGroups.length}/{skillGroups.length}
          </button>
          <button className="pill" type="button" onClick={() => setActiveTab('jobs')}>
            Jobs {filteredWorkExperience.length}/{workExperience.length}
          </button>
          <button className="pill" type="button" onClick={() => setActiveTab('about')}>
            About JSON
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="admin-preview-dashboard">
          <div className="admin-preview-card">
            <span className="eyebrow">Live Preview</span>
            <h2>{(currentContent ?? savedSnapshot ?? clonePortfolioContent()).about.profileFacts[0]?.value ?? 'Preview'}</h2>
            <p>
              {(currentContent ?? savedSnapshot ?? clonePortfolioContent()).about.quickIntro.paragraphs[0] ??
                'Your live content preview appears here.'}
            </p>
          </div>
          <div className="admin-preview-card">
            <span className="eyebrow">Top Project</span>
            <h3>{(currentContent ?? savedSnapshot ?? clonePortfolioContent()).projects[0]?.title ?? 'No project yet'}</h3>
            <p>{(currentContent ?? savedSnapshot ?? clonePortfolioContent()).projects[0]?.description ?? 'Add a project to preview it here.'}</p>
          </div>
          <div className="admin-preview-card">
            <span className="eyebrow">Work Snapshot</span>
            <h3>{sortWorkExperienceEntries((currentContent ?? savedSnapshot ?? clonePortfolioContent()).workExperience)[0]?.title ?? 'No roles yet'}</h3>
            <p>{sortWorkExperienceEntries((currentContent ?? savedSnapshot ?? clonePortfolioContent()).workExperience)[0]?.organisation ?? 'Your current role preview will appear here.'}</p>
          </div>
        </div>
      ) : null}

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
              <span>Projects ({filteredProjects.length})</span>
              <button className="button-link ghost" type="button" onClick={addProject} disabled={isBusy}>
                Add Project
              </button>
            </div>
            <div className="admin-list">
              {filteredProjects.map(({ project, projectIndex }) => (
                <article className="admin-item" key={projectUiIds[projectIndex] || `project-${projectIndex}`}>
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
                        <div className="admin-inline-actions">
                          <button
                            className="button-link ghost"
                            type="button"
                            onClick={() => moveProject(projectIndex, -1)}
                            disabled={isBusy || isSaving || projectIndex === 0}
                          >
                            Move Up
                          </button>
                          <button
                            className="button-link ghost"
                            type="button"
                            onClick={() => moveProject(projectIndex, 1)}
                            disabled={isBusy || isSaving || projectIndex === projects.length - 1}
                          >
                            Move Down
                          </button>
                          <button
                            className="button-link ghost"
                            type="button"
                            onClick={() => handleSaveProject(projectIndex)}
                            disabled={isBusy || isSaving}
                          >
                            Save This Project
                          </button>
                          <button
                            className="button-link ghost"
                            type="button"
                            onClick={() => confirmRemoveProject(projectIndex)}
                            disabled={isBusy || isSaving}
                          >
                            Remove
                          </button>
                        </div>
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
                            ref={(element) => {
                              projectIdInputRefs.current[projectIndex] = element;
                            }}
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
                            value={projectTechStackDrafts[projectIndex] ?? project.techStack.join(', ')}
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
              <span>Technical Skills ({filteredSkillGroups.length})</span>
              <button className="button-link ghost" type="button" onClick={addSkillGroup} disabled={isBusy || isSaving}>
                Add Group
              </button>
            </div>
            <div className="admin-list">
              {filteredSkillGroups.map(({ group, groupIndex, skills }) => (
                <article className="admin-item" key={skillGroupUiIds[groupIndex] || `${group.title}-${groupIndex}`}>
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
                        <div className="admin-inline-actions">
                          <button
                            className="button-link ghost"
                            type="button"
                            onClick={() => moveSkillGroup(groupIndex, -1)}
                            disabled={isBusy || isSaving || groupIndex === 0}
                          >
                            Move Up
                          </button>
                          <button
                            className="button-link ghost"
                            type="button"
                            onClick={() => moveSkillGroup(groupIndex, 1)}
                            disabled={isBusy || isSaving || groupIndex === skillGroups.length - 1}
                          >
                            Move Down
                          </button>
                          <button
                            className="button-link ghost"
                            type="button"
                            onClick={handleSaveSkillGroup}
                            disabled={isBusy || isSaving}
                          >
                            Save This Group
                          </button>
                          <button
                            className="button-link ghost"
                            type="button"
                            onClick={() => confirmRemoveSkillGroup(groupIndex)}
                            disabled={isBusy || isSaving}
                          >
                            Remove Group
                          </button>
                        </div>
                      </div>
                      <div className="admin-form-grid two">
                        <label>
                          <span>Group Title</span>
                          <input
                            ref={(element) => {
                              skillGroupTitleRefs.current[groupIndex] = element;
                            }}
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
                          disabled={isBusy || isSaving}
                        >
                          Add Skill
                        </button>
                      </div>

                      {skills.map(({ skill, skillIndex }) => (
                        <article className="admin-sub-item" key={skillUiIds[groupIndex]?.[skillIndex] || `${skill.name}-${skillIndex}`}>
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
                                <div className="admin-inline-actions">
                                  <button
                                    className="button-link ghost"
                                    type="button"
                                    onClick={() => moveSkill(groupIndex, skillIndex, -1)}
                                    disabled={isBusy || isSaving || skillIndex === 0}
                                  >
                                    Move Up
                                  </button>
                                  <button
                                    className="button-link ghost"
                                    type="button"
                                    onClick={() => moveSkill(groupIndex, skillIndex, 1)}
                                    disabled={isBusy || isSaving || skillIndex === group.skills.length - 1}
                                  >
                                    Move Down
                                  </button>
                                  <button
                                    className="button-link ghost"
                                    type="button"
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          `Delete skill "${skill.name || 'Untitled skill'}" from "${group.title || 'Untitled group'}"?`,
                                        )
                                      ) {
                                        removeSkill(groupIndex, skillIndex);
                                      }
                                    }}
                                    disabled={isBusy || isSaving}
                                  >
                                    Remove Skill
                                  </button>
                                </div>
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

      {activeTab === 'jobs' ? (
        <section className="admin-panel">
          <div className="admin-editor">
            <div className="admin-editor-title-row">
              <span>Work History ({filteredWorkExperience.length})</span>
              <button className="button-link ghost" type="button" onClick={addWorkExperience} disabled={isBusy || isSaving}>
                Add Role
              </button>
            </div>
            <p className="admin-muted admin-work-note">
              Jobs are sorted automatically with current roles first, then newest to oldest by start date.
            </p>
            <div className="admin-list">
              {filteredWorkExperience.map(({ entry, entryIndex }) => (
                <article className="admin-item" key={workExperienceUiIds[entryIndex] || `${entry.start}-${entry.title}-${entryIndex}`}>
                  <button
                    type="button"
                    className="admin-item-summary"
                    aria-expanded={workExperienceOpenState[entryIndex] ?? false}
                    onClick={() => toggleWorkExperience(entryIndex)}
                  >
                    <strong>{entry.title || `Role ${entryIndex + 1}`}</strong>
                    <span>{entry.start}{entry.current ? ' - Current' : entry.end ? ` - ${entry.end}` : ''}</span>
                  </button>
                  {workExperienceOpenState[entryIndex] ? (
                    <div className="admin-item-body">
                      <div className="admin-item-actions">
                        <span className="admin-muted">Edit role details</span>
                        <div className="admin-inline-actions">
                          <button
                            className="button-link ghost"
                            type="button"
                            onClick={handleSaveWorkExperience}
                            disabled={isBusy || isSaving}
                          >
                            Save This Role
                          </button>
                          <button
                            className="button-link ghost"
                            type="button"
                            onClick={() => confirmRemoveWorkExperience(entryIndex)}
                            disabled={isBusy || isSaving}
                          >
                            Remove Role
                          </button>
                        </div>
                      </div>
                      <div className="admin-form-grid two">
                        <label>
                          <span>Started</span>
                          <input
                            value={entry.start}
                            onChange={(event) => updateWorkExperience(entryIndex, 'start', event.target.value)}
                          />
                        </label>
                        <label>
                          <span>Ended</span>
                          <input
                            value={entry.end}
                            onChange={(event) => updateWorkExperience(entryIndex, 'end', event.target.value)}
                            disabled={entry.current}
                          />
                        </label>
                        <label>
                          <span>Role</span>
                          <input
                            ref={(element) => {
                              workTitleRefs.current[entryIndex] = element;
                            }}
                            value={entry.title}
                            onChange={(event) => updateWorkExperience(entryIndex, 'title', event.target.value)}
                          />
                        </label>
                        <label>
                          <span>Organisation</span>
                          <input
                            value={entry.organisation}
                            onChange={(event) => updateWorkExperience(entryIndex, 'organisation', event.target.value)}
                          />
                        </label>
                        <label>
                          <span>Location</span>
                          <input
                            value={entry.location ?? ''}
                            onChange={(event) => updateWorkExperience(entryIndex, 'location', event.target.value)}
                          />
                        </label>
                        <label>
                          <span>Still working there</span>
                          <select
                            value={entry.current ? 'yes' : 'no'}
                            onChange={(event) =>
                              updateWorkExperience(entryIndex, 'current', event.target.value === 'yes')
                            }
                          >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </label>
                        <label className="full">
                          <span>Description</span>
                          <textarea
                            value={entry.summary}
                            onChange={(event) => updateWorkExperience(entryIndex, 'summary', event.target.value)}
                          />
                        </label>
                        <label className="full">
                          <span>Highlights, one per line</span>
                          <textarea
                            value={workHighlightsDrafts[entryIndex] ?? listToLines(entry.highlights)}
                            onChange={(event) => updateWorkHighlights(entryIndex, event.target.value)}
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

      {activeTab === 'settings' ? (
        <section className="admin-panel admin-settings-panel">
          <label className="admin-source-toggle">
            <input
              type="checkbox"
              checked={contentSourceMode === 'local'}
              onChange={(event) => handleContentSourceToggle(event.target.checked)}
            />
            <span>
              Use local content only
              <small>
                When enabled, the dashboard saves to browser storage and skips Firestore. When disabled,
                it loads and saves Firestore content, but still falls back to local data if Firebase is unavailable.
              </small>
            </span>
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
