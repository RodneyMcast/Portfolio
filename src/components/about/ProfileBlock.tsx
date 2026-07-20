import { useState } from 'react';
import { Link } from 'react-router-dom';

import type { ProfileFact, WorkExperienceEntry } from '../../data/portfolioContent';
import { WorkExperienceTimeline } from './WorkExperienceTimeline';

type ProfileBlockProps = {
  facts: ProfileFact[];
  workExperience: WorkExperienceEntry[];
};

export const ProfileBlock = ({ facts, workExperience }: ProfileBlockProps) => {
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
        onToggle={() => setIsExperienceOpen((isOpen: boolean) => !isOpen)}
        entries={workExperience}
      />
      <div className="profile-card">
        <h3>Quick Facts</h3>
        <dl>
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
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
