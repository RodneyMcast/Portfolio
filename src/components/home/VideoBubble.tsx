import styles from './HomeHero.module.css';

export const VideoBubble = () => (
  <div className={styles.bubble} aria-label="Rodney Hili profile">
    <span className={styles.innerRing} aria-hidden="true" />
    <span className={styles.signatureMask} aria-hidden="true" />
  </div>
);
