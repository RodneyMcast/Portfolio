import { Link } from 'react-router-dom';

import styles from './HomeHero.module.css';

export const HeroButtons = () => (
  <div className={styles.buttons}>
    <Link to="/projects" className={styles.primaryButton}>
      View Projects
    </Link>
    <Link to="/about" className={styles.ghostButton}>
      About Me
    </Link>
  </div>
);
