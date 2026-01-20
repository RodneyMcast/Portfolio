import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Project } from '../types';

type ProjectCardProps = {
  project: Project;
  disabled?: boolean;
};

// Card is a button so it is keyboard accessible by default.
const ProjectCardComponent = ({ project, disabled = false }: ProjectCardProps) => {
  const navigate = useNavigate();

  // Stable handler keeps memoized cards from re-rendering.
  const handleOpen = useCallback(() => {
    if (disabled) {
      return;
    }
    navigate(`/projects/${project.id}`);
  }, [disabled, navigate, project.id]);

  return (
    <button
      type="button"
      className="project-card"
      onClick={handleOpen}
      aria-label={`Open ${project.title}`}
      disabled={disabled}
    >
      <div className="project-media">
        {/* Lazy load images to keep the grid fast. */}
        <img src={project.imageUrl} alt={`${project.title} preview`} loading="lazy" />
      </div>
      <div className="project-body">
        <div className="project-top">
          <span className="project-category">{project.category}</span>
          <span className="project-year">{project.year}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <ul className="project-tags">
          {project.techStack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <div className="project-actions">
          <span className="button-link ghost" aria-hidden="true">
            Details
          </span>
        </div>
      </div>
    </button>
  );
};

// React.memo avoids re-rendering cards when props do not change.
export const ProjectCard = memo(ProjectCardComponent);
ProjectCard.displayName = 'ProjectCard';
