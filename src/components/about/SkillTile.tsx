export type Skill = {
  name: string;
  iconText: string;
  iconUrl?: string;
  description: string;
};

type SkillTileProps = {
  skill: Skill;
};

export const SkillTile = ({ skill }: SkillTileProps) => (
  <li className="skill-tile" tabIndex={0} aria-label={`${skill.name}: ${skill.description}`}>
    <span className="skill-icon" aria-hidden="true">
      {skill.iconUrl ? (
        <img className="skill-icon-image" src={skill.iconUrl} alt="" loading="lazy" />
      ) : (
        skill.iconText
      )}
    </span>
    <span className="skill-name">{skill.name}</span>
    <span className="skill-description" role="tooltip">
      {skill.description}
    </span>
  </li>
);
