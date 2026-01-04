import { SkillTile, type Skill } from './SkillTile';

type SkillsGridProps = {
  skills: Skill[];
};

export const SkillsGrid = ({ skills }: SkillsGridProps) => (
  <section className="skills-section">
    <div className="skills-header">
      <h2>Technical Skills</h2>
      <p>Technologies I am confident using</p>
    </div>
    <ul className="skills-grid">
      {skills.map((skill) => (
        <SkillTile key={skill.name} skill={skill} />
      ))}
    </ul>
  </section>
);
