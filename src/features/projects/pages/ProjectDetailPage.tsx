import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { FullPageLoader } from '../../../components/common/FullPageLoader';
import { fetchProjects } from '../projectsSlice';
import { selectProjectById } from '../selectors';

const ProjectDetailPage = () => {
  // Read project id from the URL.
  const { projectId } = useParams();
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.projects.status);
  // Selector keeps lookup logic in one place.
  const project = useAppSelector((state) =>
    projectId ? selectProjectById(projectId)(state) : undefined,
  );
  const previousScroll = useRef(0);

  // Ensure data exists when someone lands directly on a detail route.
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProjects());
    }
  }, [dispatch, status]);

  // Basic scroll restore: top on entry, back on exit.
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    previousScroll.current = window.scrollY;
    window.scrollTo(0, 0);

    return () => {
      window.scrollTo(0, previousScroll.current);
    };
  }, []);

  if (status === 'loading' || status === 'idle') {
    return <FullPageLoader />;
  }

  // Handle missing or invalid ids gracefully.
  if (!project) {
    return (
      <section className="project-detail">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/projects">Projects</Link>
            </li>
            <li aria-current="page">Not found</li>
          </ol>
        </nav>
        <h1>Project not found</h1>
        <p>Try picking a project from the gallery.</p>
        <Link className="button-link" to="/projects">
          Back to projects
        </Link>
      </section>
    );
  }

  return (
    <section className="project-detail">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link to="/projects">Projects</Link>
          </li>
          <li aria-current="page">{project.title}</li>
        </ol>
      </nav>
      <Link className="text-link" to="/projects">
        Back to projects
      </Link>
      <div className="detail-banner">
        <img src={project.imageUrl} alt={`${project.title} banner`} loading="lazy" />
      </div>
      <div className="detail-header">
        <h1>{project.title}</h1>
        <div className="detail-chips">
          <span className="chip">{project.category}</span>
          <span className="chip">{project.year}</span>
        </div>
      </div>
      <p className="detail-description">{project.longDescription}</p>
      <div className="detail-section">
        <h2>Tech stack</h2>
        <ul className="detail-tags">
          {project.techStack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </div>
      <div className="detail-actions">
        {project.liveUrl ? (
          <a
            className="button-link primary"
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
          >
            Live
          </a>
        ) : null}
        {project.repoUrl ? (
          <a className="button-link ghost" href={project.repoUrl} target="_blank" rel="noreferrer">
            Code
          </a>
        ) : null}
      </div>
    </section>
  );
};

export default ProjectDetailPage;
