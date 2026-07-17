import { Link } from 'react-router-dom';

import type { ProfileFact } from '../../data/portfolioContent';

type ProfileBlockProps = {
  facts: ProfileFact[];
};

export const ProfileBlock = ({ facts }: ProfileBlockProps) => (
  <aside className="profile-block">
    <div className="profile-avatar">
      <span className="profile-avatar-ring" aria-hidden="true" />
      <span className="profile-signature" aria-hidden="true" />
    </div>
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
        href="/Rodney%20Hili%20CV.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        Resume
      </a>
    </div>
  </aside>
);
