import styles from "./HomeHero.module.css";

export const VideoBubble = () => (
  <div className={styles.bubble} aria-label="Rodney Hili profile">
    <svg viewBox="0 0 120 120" role="img" aria-label="Rodney Hili initials">
      <circle
        cx="60"
        cy="60"
        r="56"
        fill="var(--color-card)"
        stroke="var(--color-border)"
        strokeWidth="2"
      />
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="42"
        fontFamily="var(--font-sans)"
        fill="var(--color-accent)"
      >
        RH
      </text>
    </svg>
  </div>
);
