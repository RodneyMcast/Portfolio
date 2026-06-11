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
        name: 'Kotlin',
        iconText: 'KT',
        description: 'Android-focused language experience for mobile development coursework.',
      },
      {
        name: 'Dart',
        iconText: 'DT',
        description: 'Used with Flutter for mobile app development and cross-platform UI work.',
      },
      {
        name: 'PHP',
        iconText: 'PHP',
        description: 'Server-side scripting experience, including web and WordPress-style workflows.',
      },
    ],
  },
  {
    title: 'Frontend, Design & App Interfaces',
    summary: 'Frameworks, styling tools, and design platforms for polished user interfaces.',
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
        name: 'Bulma',
        iconText: 'BU',
        description: 'CSS framework experience for clean responsive layouts and simple components.',
      },
      {
        name: 'Flutter',
        iconText: 'FL',
        description: 'Cross-platform app framework for mobile-first screens and app prototypes.',
      },
      {
        name: 'Figma',
        iconText: 'FG',
        description: 'Design and prototyping tool for layouts, UI ideas, and presentation assets.',
      },
      {
        name: 'WordPress',
        iconText: 'WP',
        description: 'CMS experience for editing, managing, and publishing website content.',
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
        name: 'Google Cloud',
        iconText: 'GCP',
        description: 'Cloud platform experience connected to hosting, services, and deployment workflows.',
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
    summary: 'Tools and systems used for game jams, WebGL, VR prototypes, and interactive learning projects.',
    skills: [
      {
        name: 'Unity',
        iconText: 'U',
        description: 'Primary engine for 2D/3D games, VR projects, and interactive prototypes.',
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
        name: 'Blender',
        iconText: 'BL',
        description: '3D asset and scene creation tool for models, visuals, and game-ready assets.',
      },
      {
        name: 'Game Design',
        iconText: 'GD',
        description: 'Designing mechanics, progression, feedback, puzzles, and player goals.',
      },
    ],
  },
  {
    title: 'Testing, Tools & Hardware',
    summary: 'Quality, debugging, collaboration, mobile tooling, and practical hardware experience.',
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
        name: 'Android Studio',
        iconText: 'AS',
        description: 'IDE experience for Android development, testing, and mobile app tooling.',
      },
      {
        name: 'Raspberry Pi',
        iconText: 'PI',
        description: 'Small hardware platform experience for practical computing experiments.',
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
            <p>Lately I have been mixing web apps, APIs, and small game experiments.</p>
          </AboutCard>
          <AboutCard title="Current focus">
            <p>
              My current focus is my dissertation project, an Agentic Browser Simulator built as
              a Unity WebGL sandbox game. It lets users learn how AI-powered browsers work through
              guided levels, practical tasks, and rewards for learning.
            </p>
            <p>
              The project explores how people can build trust and confidence with AI tools while
              understanding responsible use, limitations, and the risks that come with relying on
              emerging technology.
            </p>
          </AboutCard>
          <AboutCard title="What I build">
            <p>I build APIs, websites for mobile and desktop, and a few small games.</p>
            <ul className="about-list">
              <li>Clean UI layouts with solid spacing</li>
              <li>Interactive front-end features</li>
              <li>Small tools that solve a real need</li>
              <li>Fun game mechanics, player feedback, and playful interaction design</li>
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
