type WorkExperience = {
  period: string;
  title: string;
  organisation: string;
  location?: string;
  current?: boolean;
  summary: string;
  highlights: string[];
};

type WorkExperienceTimelineProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const workExperience: WorkExperience[] = [
  {
    period: 'Aug 2025 - Current',
    title: 'Information Management Unit (IMU)',
    organisation: 'Ministry for Health and Active Ageing',
    location: "Saint Luke's",
    current: true,
    summary:
      'Student role supporting healthcare websites, system testing, and small database tasks.',
    highlights: [
      'Built and updated websites using Microsoft Power Pages.',
      'Prepared test cases for a clinical data-entry web system.',
      'Helped improve websites used by medical professionals.',
      'Assisted with database tasks in a virtual machine environment.',
      'Followed professional standards while working with sensitive systems.',
    ],
  },
  {
    period: 'Apr 2024 - Aug 2025',
    title: 'IT Software Support',
    organisation: 'Express Trailers (BI & MI)',
    summary:
      'Student apprenticeship focused on internal software support, reporting, and business data.',
    highlights: [
      'Resolved internal software support tickets from multiple departments.',
      'Prepared analytical and monthly business reports using Excel and internal systems.',
      'Managed database and interface data used for retrieval and reporting.',
      'Observed third-party website planning, scope, contract, and timeline meetings.',
      'Collaborated with the team to meet project deadlines and organisational objectives.',
    ],
  },
  {
    period: 'Apr 2024 - Current',
    title: 'Live Streaming Technician',
    organisation: 'Horse Racing Events',
    location: 'Gozo',
    current: true,
    summary:
      'Operate live broadcast equipment and keep Facebook streams running smoothly during race events.',
    highlights: [
      'Run stable Facebook live streams for horse racing events.',
      'Operate cameras, microphones, and video-streaming hardware.',
      'Update PowerPoint slides with event schedules and live race results.',
      'Troubleshoot audio-visual issues during live broadcasts.',
    ],
  },
  {
    period: 'Jun 2023 - Sep 2023',
    title: 'Information Management Unit Intern',
    organisation: 'Gozo Ministry / MITA',
    summary:
      'Student internship providing practical hardware, Windows, printer, and server support.',
    highlights: [
      'Assisted during a server relocation and learned how server resources are managed.',
      'Troubleshot printers, laptops, and Windows 11 issues.',
      'Worked with peers to resolve hardware and software problems.',
    ],
  },
  {
    period: 'Jul 2021 - Current',
    title: 'Crew Member / Student Summer Job',
    organisation: "Gozo McDonald's / Premier Restaurants Malta Ltd",
    current: true,
    summary:
      'Customer-facing summer work built around teamwork, reliability, and company procedures.',
    highlights: [
      'Work effectively in a fast-paced team environment.',
      'Follow company procedures and customer service standards.',
    ],
  },
];

export const WorkExperienceTimeline = ({ isOpen, onToggle }: WorkExperienceTimelineProps) => (
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
          {workExperience.map((experience) => (
            <li className="experience-item" key={`${experience.period}-${experience.title}`}>
              <article className="experience-entry" tabIndex={0}>
                <span className="experience-dot" aria-hidden="true" />
                <time>{experience.period}</time>
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
