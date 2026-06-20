import { useState } from 'react';
import { Link } from 'react-router-dom';

import { WorkExperienceTimeline } from './WorkExperienceTimeline';

export const ProfileBlock = () => {
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);

  return (
    <aside className={`profile-block${isExperienceOpen ? ' is-experience-open' : ''}`}>
      {!isExperienceOpen ? (
        <div className="profile-avatar">
          <span className="profile-avatar-ring" aria-hidden="true" />
          <span className="profile-signature" aria-hidden="true" />
        </div>
      ) : null}
      <WorkExperienceTimeline
        isOpen={isExperienceOpen}
        onToggle={() => setIsExperienceOpen((isOpen) => !isOpen)}
      />
      <div className="profile-card">
        <h3>Quick Facts</h3>
        <dl>
          <div>
            <dt>Study</dt>
            <dd>MCAST - Creative Computing Level 6</dd>
          </div>
          <div>
            <dt>Current</dt>
            <dd>3rd year</dd>
          </div>
          <div>
            <dt>Focus</dt>
            <dd>Front-end, APIs, Games</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>Malta</dd>
          </div>
        </dl>
      </div>
      <div className="profile-actions">
        <Link className="button-link primary" to="/projects">
          View Projects
        </Link>
        <a
          className="button-link ghost"
          href="/Rodney_Hili_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume
        </a>
      </div>
    </aside>
  );
};
