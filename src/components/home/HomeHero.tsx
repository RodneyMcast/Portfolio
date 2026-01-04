import { HeroButtons } from './HeroButtons';
import styles from './HomeHero.module.css';
import { VideoBubble } from './VideoBubble';

export const HomeHero = () => (
  <>
    <section className={styles.hero}>
      <div className={styles.intro}>
        <span className="eyebrow">Portfolio</span>
        <h1 className={styles.title}>Hello, I am Rodney Hili</h1>
        <p className={styles.subtitle}>
          I am a 3rd year Creative Computing (Level 6) student at MCAST.
        </p>
        <p className={styles.subtitle}>
          I build APIs, web apps for mobile and desktop, and Unity projects.
        </p>
        <HeroButtons />
      </div>
      <VideoBubble />
    </section>
  </>
);
