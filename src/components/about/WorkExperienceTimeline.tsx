import { sortWorkExperienceEntries, type WorkExperienceEntry } from '../../data/portfolioContent';

type WorkExperienceTimelineProps = {
  isOpen: boolean;
  onToggle: () => void;
  entries: WorkExperienceEntry[];
};

const formatPeriod = ({ start, end, current }: WorkExperienceEntry) =>
  `${start}${current ? ' - Current' : end ? ` - ${end}` : ''}`;

export const WorkExperienceTimeline = ({ isOpen, onToggle, entries }: WorkExperienceTimelineProps) => (
  <section className={`experience-panel${isOpen ? ' is-open' : ''}`} aria-label="Work experience">
    <button
      type="button"
      className="experience-toggle"
      aria-expanded={isOpen}
      aria-controls="work-experience-content"
      onClick={onToggle}
    >
      <span className="experience-toggle-copy">
        <span className="experience-eyebrow">Career path</span>
        <span className="experience-title">Work Experience</span>
        <span className="experience-summary">
          {isOpen ? 'Explore each role and its responsibilities.' : '5 roles from 2021 to today.'}
        </span>
      </span>
      <span className="experience-toggle-action" aria-hidden="true">
        <span>{isOpen ? 'Close' : 'Open'}</span>
        <span className="experience-chevron" />
      </span>
    </button>
    {isOpen ? (
      <div className="experience-content" id="work-experience-content">
        <p className="experience-hint">Hover or focus a role to see more</p>
        <ol className="experience-timeline">
          {sortWorkExperienceEntries(entries).map((experience) => (
            <li className="experience-item" key={`${experience.start}-${experience.title}`}>
              <article className="experience-entry" tabIndex={0}>
                <span className="experience-dot" aria-hidden="true" />
                <time>{formatPeriod(experience)}</time>
                <div className="experience-entry-heading">
                  <h4>{experience.title}</h4>
                  {experience.current ? <span className="experience-current">Current</span> : null}
                </div>
                <p className="experience-organisation">
                  {experience.organisation}
                  {experience.location ? `, ${experience.location}` : ''}
                </p>
                <div className="experience-details">
                  <div className="experience-details-inner">
                    <p>{experience.summary}</p>
                    <ul>
                      {experience.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    ) : null}
  </section>
);
