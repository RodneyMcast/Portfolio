import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Project } from '../types';

type ProjectCardProps = {
  project: Project;
  disabled?: boolean;
};

const ProjectCardComponent = ({ project, disabled = false }: ProjectCardProps) => {
  const navigate = useNavigate();

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

export const ProjectCard = memo(ProjectCardComponent);
ProjectCard.displayName = 'ProjectCard';
