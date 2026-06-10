import { AboutCard } from '../components/about/AboutCard';
import { AboutHero } from '../components/about/AboutHero';
import { ProfileBlock } from '../components/about/ProfileBlock';
import { SkillsGrid } from '../components/about/SkillsGrid';

import type { SkillGroup } from '../components/about/SkillsGrid';

const skillGroups: SkillGroup[] = [
  {
    title: 'Programming Languages',
    summary: 'Languages I use across web apps, Unity projects, mobile work, and coursework.',
    skills: [
      {
        name: 'JavaScript',
        iconText: 'JS',
        description: 'Used for interactive web features, Firebase projects, and browser-based tools.',
      },
      {
        name: 'TypeScript',
        iconText: 'TS',
        description: 'Adds type safety and structure to React apps and portfolio-level front-end work.',
      },
      {
        name: 'C#',
        iconText: 'C#',
        description: 'Main language for Unity gameplay systems, VR interactions, and game logic.',
      },
      {
        name: 'Python',
        iconText: 'PY',
        description: 'Useful for scripting, automation, data handling, and technical coursework.',
      },
      {
        name: 'Java',
        iconText: 'JV',
        description: 'General programming foundation for object-oriented development.',
      },
      {
        name: 'Dart',
        iconText: 'DT',
        description: 'Used with Flutter for mobile app development and cross-platform UI work.',
      },
    ],
  },
  {
    title: 'Frontend & App Interfaces',
    summary: 'Frameworks and styling tools for polished, responsive user interfaces.',
    skills: [
      {
        name: 'React',
        iconText: 'RE',
        description: 'Used for component-based portfolio pages, WebGL apps, and interactive UI flows.',
      },
      {
        name: 'Vue.js',
        iconText: 'VU',
        description: 'Used for structured web interfaces, including Firebase-backed projects.',
      },
      {
        name: 'Tailwind CSS',
        iconText: 'TW',
        description: 'Utility-first styling for fast responsive layouts and consistent spacing.',
      },
      {
        name: 'Bootstrap',
        iconText: 'BS',
        description: 'Reliable UI framework for quick responsive layouts and common components.',
      },
      {
        name: 'Flutter',
        iconText: 'FL',
        description: 'Cross-platform app framework for mobile-first screens and app prototypes.',
      },
      {
        name: 'UI/UX Prototyping',
        iconText: 'UX',
        description: 'Planning user flows, wireframes, and usable interfaces before implementation.',
      },
    ],
  },
  {
    title: 'Backend, Cloud & Data',
    summary: 'Services and APIs for authentication, persistence, hosting, and data-driven apps.',
    skills: [
      {
        name: 'Node.js',
        iconText: 'ND',
        description: 'Runtime for JavaScript tooling, APIs, and project build workflows.',
      },
      {
        name: 'REST APIs',
        iconText: 'API',
        description: 'Designing and testing endpoints, including Swagger-style API documentation.',
      },
      {
        name: 'Firebase',
        iconText: 'FB',
        description: 'Used for authentication, Firestore data, hosting, and real-time app features.',
      },
      {
        name: 'Firestore',
        iconText: 'FS',
        description: 'Cloud database used for saved game/app state and user-specific records.',
      },
      {
        name: 'MongoDB',
        iconText: 'MDB',
        description: 'Document database experience for flexible app data structures.',
      },
      {
        name: 'MySQL',
        iconText: 'SQL',
        description: 'Relational database experience for structured records and queries.',
      },
    ],
  },
  {
    title: 'Games, VR & Interactive 3D',
    summary: 'Tools and systems used for game jams, serious games, WebGL, and VR prototypes.',
    skills: [
      {
        name: 'Unity',
        iconText: 'U',
        description: 'Primary engine for 2D/3D games, serious games, VR projects, and prototypes.',
      },
      {
        name: 'XR Interaction Toolkit',
        iconText: 'XR',
        description: 'Unity package used for VR grabbing, sockets, hands, and headset interaction.',
      },
      {
        name: 'WebGL',
        iconText: 'WGL',
        description: 'Used to publish interactive browser-based 3D and Unity experiences.',
      },
      {
        name: 'Three.js',
        iconText: '3D',
        description: 'JavaScript 3D library used for browser-based scenes and virtual pet visuals.',
      },
      {
        name: 'A-Frame',
        iconText: 'AF',
        description: 'Web framework for VR and 3D scenes using familiar HTML-style structure.',
      },
      {
        name: 'Game Design',
        iconText: 'GD',
        description: 'Designing mechanics, progression, feedback, puzzles, and player goals.',
      },
    ],
  },
  {
    title: 'Testing, Tools & Workflow',
    summary: 'Quality, debugging, and collaboration tools I use to build and ship projects.',
    skills: [
      {
        name: 'Software Testing',
        iconText: 'QA',
        description: 'Testing forms, interactions, edge cases, and expected user flows.',
      },
      {
        name: 'Selenium',
        iconText: 'SE',
        description: 'Browser automation experience for validating web behavior.',
      },
      {
        name: 'Cucumber',
        iconText: 'CU',
        description: 'Behavior-driven testing with scenarios written in a readable format.',
      },
      {
        name: 'Postman',
        iconText: 'PM',
        description: 'API testing tool for checking endpoints, requests, and responses.',
      },
      {
        name: 'GitHub',
        iconText: 'GH',
        description: 'Repository hosting, version control workflow, issues, and project sharing.',
      },
      {
        name: 'Figma',
        iconText: 'FG',
        description: 'Design and prototyping tool for layouts, UI ideas, and presentation assets.',
      },
    ],
  },
];

export const AboutPage = () => (
  <section className="about-page">
    <AboutHero title="About" highlight="Me" />
    <div className="about-main">
      <div className="about-grid">
        <div className="about-left">
          <AboutCard title="Quick intro">
            <p>I am Rodney Hili, a 3rd year Creative Computing Level 6 student at MCAST.</p>
            <p>I enjoy turning ideas into practical projects and learning by building.</p>
            <p>Lately I have been mixing web apps, APIs, and small Unity game experiments.</p>
          </AboutCard>
          <AboutCard title="What I build">
            <p>I build APIs, websites for mobile and desktop, and a few Unity games.</p>
            <ul className="about-list">
              <li>Clean UI layouts with solid spacing</li>
              <li>Interactive front-end features</li>
              <li>Small tools that solve a real need</li>
              <li>Fun game ideas with playful mechanics</li>
            </ul>
          </AboutCard>
          <AboutCard title="Outside of coding">
            <p>
              When I am not coding, I am usually gaming, travelling, hitting the gym, or drawing.
            </p>
          </AboutCard>
        </div>
        <ProfileBlock />
      </div>
    </div>
    <SkillsGrid groups={skillGroups} />
  </section>
);
