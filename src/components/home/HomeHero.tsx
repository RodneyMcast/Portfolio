import { useEffect, useState } from 'react';

import { defaultSiteSettings, type HomeContent } from '../../data/portfolioContent';
import { HeroButtons } from './HeroButtons';
import styles from './HomeHero.module.css';
import { VideoBubble } from './VideoBubble';

const phrases = [
  'Creative Computing Graduate.',
  'Software Developer.',
  'Full-Stack Web Developer.',
  'Game Developer.',
  'Exploring emerging technologies.',
  'Turning ideas into reality.',
] as const;

const finalPhraseIndex = phrases.length - 1;
const typeSpeedMs = 60;
const deleteSpeedMs = 35;
const pauseMs = 1700;
const finalAfterCycles = 2;

type TypewriterPhase = 'typing' | 'pausing' | 'deleting' | 'final';

type HomeHeroProps = {
  content?: HomeContent;
};

const TypewriterText = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [phase, setPhase] = useState<TypewriterPhase>('typing');
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (!window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotionPreference = () => setReduceMotion(mediaQuery.matches);

    syncMotionPreference();
    mediaQuery.addEventListener('change', syncMotionPreference);

    return () => {
      mediaQuery.removeEventListener('change', syncMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion || phase === 'final') {
      setDisplayedText(phrases[finalPhraseIndex]);
      return;
    }

    const activePhrase = phrases[phraseIndex];
    const timeoutId = window.setTimeout(
      () => {
        if (phase === 'typing') {
          if (displayedText.length < activePhrase.length) {
            setDisplayedText(activePhrase.slice(0, displayedText.length + 1));
            return;
          }

          if (
            phraseIndex === finalPhraseIndex &&
            completedCycles >= finalAfterCycles - 1
          ) {
            setPhase('final');
            return;
          }

          setPhase('pausing');
          return;
        }

        if (phase === 'pausing') {
          setPhase('deleting');
          return;
        }

        if (displayedText.length > 0) {
          setDisplayedText(displayedText.slice(0, -1));
          return;
        }

        const nextPhraseIndex = (phraseIndex + 1) % phrases.length;
        const nextCompletedCycles =
          nextPhraseIndex === 0 ? completedCycles + 1 : completedCycles;

        setPhraseIndex(nextPhraseIndex);
        setCompletedCycles(nextCompletedCycles);
        setPhase('typing');
      },
      phase === 'pausing'
        ? pauseMs
        : phase === 'deleting'
          ? deleteSpeedMs
          : typeSpeedMs,
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [completedCycles, displayedText, phraseIndex, phase, reduceMotion]);

  return (
    <p className={styles.typewriterLine}>
      <span className={styles.typewriterText} aria-hidden="true">
        {displayedText}
      </span>
      {phase !== 'final' && !reduceMotion ? (
        <span className={styles.typewriterCursor} aria-hidden="true" />
      ) : null}
      <span className="sr-only">
        Creative Computing Graduate. Software Developer. Full-Stack Web
        Developer. Game Developer. Exploring emerging technologies. Turning
        ideas into reality.
      </span>
    </p>
  );
};

export const HomeHero = ({ content = defaultSiteSettings.home }: HomeHeroProps) => (
  <section className={styles.hero}>
    <div className={styles.intro}>
      <span className="eyebrow">{content.eyebrow}</span>
      <h1 className={styles.title}>{content.title}</h1>
      <TypewriterText />
      <HeroButtons primaryLabel={content.primaryCtaLabel} secondaryLabel={content.secondaryCtaLabel} />
    </div>
    <VideoBubble />
  </section>
);
