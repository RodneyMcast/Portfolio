import { Link } from 'react-router-dom';

export const ProfileBlock = () => (
  <aside className="profile-block">
    <div className="profile-avatar">
      <span className="profile-avatar-ring" aria-hidden="true" />
      <span className="profile-signature" aria-hidden="true" />
    </div>
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
        href="/Rodney%20Hili%20CV.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        Resume
      </a>
    </div>
  </aside>
);
