export type Skill = {
  name: string;
  iconText: string;
  description: string;
};

type SkillTileProps = {
  skill: Skill;
};

export const SkillTile = ({ skill }: SkillTileProps) => (
  <li className="skill-tile" tabIndex={0} aria-label={`${skill.name}: ${skill.description}`}>
    <span className="skill-icon" aria-hidden="true">
      {skill.iconText}
    </span>
    <span className="skill-name">{skill.name}</span>
    <span className="skill-description" role="tooltip">
      {skill.description}
    </span>
  </li>
);
