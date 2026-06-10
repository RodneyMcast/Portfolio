import styles from './HomeHero.module.css';

export const VideoBubble = () => (
  <div className={styles.bubble} aria-label="Rodney Hili profile">
    <svg className={styles.signatureSvg} viewBox="0 0 240 200" role="img" aria-label="Rodney Hili signature">
      <defs>
        <linearGradient
          id="homeSignatureGradient"
          x1="42"
          y1="176"
          x2="164"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--color-accent-strong)" />
          <stop offset="55%" stopColor="var(--color-accent)" />
          <stop offset="100%" stopColor="var(--color-accent-secondary)" />
        </linearGradient>
      </defs>
      <circle
        cx="120"
        cy="100"
        r="93"
        fill="var(--color-card)"
        stroke="var(--color-border)"
        strokeWidth="2"
      />
      <g className={styles.signatureMark}>
        <path
          className={styles.signatureMistLine}
          stroke="url(#homeSignatureGradient)"
          d="M77 125 C58 111 42 79 55 67 C68 56 99 64 126 55 C132 49 130 28 140 23 C151 17 164 44 147 58 C137 67 128 58 136 45 M126 55 C126 92 130 130 118 161 C112 176 98 187 75 181 C55 176 37 161 43 151 C53 137 104 153 158 158 C184 161 204 160 216 161 M126 55 C161 51 181 72 175 100 C169 130 139 145 111 122 M94 103 C122 121 152 149 176 170 C151 142 124 111 94 87 C85 80 82 93 94 103"
        />
        <path
          className={styles.signatureStroke}
          stroke="url(#homeSignatureGradient)"
          d="M77 125 C58 111 42 79 55 67 C68 56 99 64 126 55 C132 49 130 28 140 23 C151 17 164 44 147 58 C137 67 128 58 136 45 M126 55 C126 92 130 130 118 161 C112 176 98 187 75 181 C55 176 37 161 43 151 C53 137 104 153 158 158 C184 161 204 160 216 161 M126 55 C161 51 181 72 175 100 C169 130 139 145 111 122 M94 103 C122 121 152 149 176 170 C151 142 124 111 94 87 C85 80 82 93 94 103"
        />
      </g>
    </svg>
  </div>
);
