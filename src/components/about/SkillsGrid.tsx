import { SkillTile, type Skill } from './SkillTile';

export type SkillGroup = {
  title: string;
  summary: string;
  skills: Skill[];
};

type SkillsGridProps = {
  groups: SkillGroup[];
};

export const SkillsGrid = ({ groups }: SkillsGridProps) => (
  <section className="skills-section">
    <div className="skills-header">
      <span className="eyebrow">Toolkit</span>
      <h2>Skills & Expertise</h2>
      <p>Focused capabilities from my web, game, VR, and cloud projects.</p>
    </div>
    <div className="skills-groups">
      {groups.map((group) => (
        <article className="skill-group" key={group.title}>
          <div className="skill-group-copy">
            <h3>{group.title}</h3>
            <p>{group.summary}</p>
          </div>
          <ul className="skills-grid">
            {group.skills.map((skill) => (
              <SkillTile key={skill.name} skill={skill} />
            ))}
          </ul>
        </article>
      ))}
    </div>
  </section>
);
