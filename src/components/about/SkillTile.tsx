export type Skill = {
  name: string;
  iconText: string;
};

type SkillTileProps = {
  skill: Skill;
};

export const SkillTile = ({ skill }: SkillTileProps) => (
  <li className="skill-tile">
    <span className="skill-icon" aria-hidden="true">
      {skill.iconText}
    </span>
    <span className="skill-name">{skill.name}</span>
  </li>
);
