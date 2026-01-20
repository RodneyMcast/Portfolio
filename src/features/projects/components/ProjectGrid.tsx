import { useEffect, useState } from 'react';

import { ProjectCard } from './ProjectCard';

import type { Project } from '../types';

type ProjectStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type ProjectGridProps = {
  projects: Project[];
  status: ProjectStatus;
  error: string | null;
  onRetry: () => void;
  animationKey: number;
};

// Lightweight skeletons for loading state.
const skeletonItems = Array.from({ length: 6 }, (_, index) => (
  <div key={`skeleton-${index}`} className="project-card skeleton">
    <div className="skeleton-media" />
    <div className="project-body">
      <div className="skeleton-line short" />
      <div className="skeleton-line" />
      <div className="skeleton-line wide" />
    </div>
  </div>
));

export const ProjectGrid = ({
  projects,
  status,
  error,
  onRetry,
  animationKey,
}: ProjectGridProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Toggle a class so CSS can animate filtered results.
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [animationKey]);

  // Show skeletons while loading.
  if (status === 'loading' || status === 'idle') {
    return <div className="project-grid">{skeletonItems}</div>;
  }

  // Error state with retry button.
  if (status === 'failed') {
    return (
      <div className="projects-error">
        <p>{error ?? 'Something went wrong.'}</p>
        <button type="button" className="button-link ghost" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  // Empty state when filters remove everything.
  if (projects.length === 0) {
    return <p className="projects-empty">No projects yet.</p>;
  }

  return (
    <div className={isAnimating ? 'project-grid is-animating' : 'project-grid'}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};
