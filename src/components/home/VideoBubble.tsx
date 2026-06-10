import styles from './HomeHero.module.css';

export const VideoBubble = () => (
  <div className={styles.bubble} aria-label="Rodney Hili profile">
    <svg className={styles.signatureSvg} viewBox="0 0 160 160" role="img" aria-label="Rodney Hili signature">
      <defs>
        <linearGradient id="signatureGradient" x1="34" y1="126" x2="126" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--color-accent-strong)" />
          <stop offset="48%" stopColor="var(--color-accent)" />
          <stop offset="100%" stopColor="var(--color-accent-secondary)" />
        </linearGradient>
        <filter id="signatureMist" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.17 0 0 0 0 0.83 0 0 0 0 0.75 0 0 0 0.75 0"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        cx="80"
        cy="80"
        r="74"
        fill="var(--color-card)"
        stroke="var(--color-border)"
        strokeWidth="2.5"
      />
      <g className={styles.signatureMark} filter="url(#signatureMist)">
        <path
          className={styles.signatureMistLine}
          stroke="url(#signatureGradient)"
          d="M49 111 C61 128 81 132 88 112 C96 88 97 54 111 34 C118 24 128 38 121 49 C113 62 93 67 77 68 C57 69 55 77 60 91 C69 117 86 120 101 104 C114 90 121 74 111 62 C101 49 75 55 68 73 C58 100 69 130 76 136"
        />
        <path
          className={styles.signatureMistLine}
          stroke="url(#signatureGradient)"
          d="M72 92 C87 102 101 118 121 132 C109 119 94 98 78 82 C70 75 68 79 72 92 Z M44 112 C70 113 101 122 139 121"
        />
        <path
          className={styles.signatureStroke}
          stroke="url(#signatureGradient)"
          d="M49 111 C61 128 81 132 88 112 C96 88 97 54 111 34 C118 24 128 38 121 49 C113 62 93 67 77 68 C57 69 55 77 60 91 C69 117 86 120 101 104 C114 90 121 74 111 62 C101 49 75 55 68 73 C58 100 69 130 76 136"
        />
        <path
          className={styles.signatureStroke}
          stroke="url(#signatureGradient)"
          d="M72 92 C87 102 101 118 121 132 C109 119 94 98 78 82 C70 75 68 79 72 92 Z M44 112 C70 113 101 122 139 121"
        />
      </g>
    </svg>
  </div>
);
