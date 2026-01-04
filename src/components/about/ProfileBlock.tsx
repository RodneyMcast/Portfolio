import { Link } from 'react-router-dom';

export const ProfileBlock = () => (
  <aside className="profile-block">
    <div className="profile-avatar">
      <svg viewBox="0 0 120 120" role="img" aria-label="Rodney Hili portrait placeholder">
        <circle
          cx="60"
          cy="60"
          r="56"
          fill="var(--color-card)"
          stroke="var(--color-border)"
          strokeWidth="2"
        />
        <text
          x="50%"
          y="54%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="42"
          fontFamily="var(--font-sans)"
          fill="var(--color-accent)"
        >
          RH
        </text>
      </svg>
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
          <dd>Front-end, APIs, Unity</dd>
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
      <Link className="button-link ghost" to="/resume">
        Resume
      </Link>
    </div>
  </aside>
);
