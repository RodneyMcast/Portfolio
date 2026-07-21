import { Link } from 'react-router-dom';

import styles from './HomeHero.module.css';

type HeroButtonsProps = {
  primaryLabel: string;
  secondaryLabel: string;
};

export const HeroButtons = ({ primaryLabel, secondaryLabel }: HeroButtonsProps) => (
  <div className={styles.buttons}>
    <Link to="/projects" className={styles.primaryButton}>
      {primaryLabel}
    </Link>
    <Link to="/contact" className={styles.ghostButton}>
      {secondaryLabel}
    </Link>
  </div>
);
