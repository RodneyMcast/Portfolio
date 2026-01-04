import { AboutCard } from '../components/about/AboutCard';
import { AboutHero } from '../components/about/AboutHero';
import { ProfileBlock } from '../components/about/ProfileBlock';
import { SkillsGrid } from '../components/about/SkillsGrid';

import type { Skill } from '../components/about/SkillTile';

const skills: Skill[] = [
  { name: 'HTML', iconText: 'HTML' },
  { name: 'CSS', iconText: 'CSS' },
  { name: 'JavaScript', iconText: 'JS' },
  { name: 'TypeScript', iconText: 'TS' },
  { name: 'React', iconText: 'RE' },
  { name: 'Vue', iconText: 'VU' },
  { name: 'Tailwind', iconText: 'TW' },
  { name: 'Python', iconText: 'PY' },
  { name: 'Firebase', iconText: 'FB' },
  { name: 'Git', iconText: 'GIT' },
  { name: 'GitHub', iconText: 'GH' },
  { name: 'Unity', iconText: 'U' },
  { name: 'Raspberry Pi', iconText: 'PI' },
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
    <SkillsGrid skills={skills} />
  </section>
);
