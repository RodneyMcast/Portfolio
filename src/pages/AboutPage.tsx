import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { AboutCard } from '../components/about/AboutCard';
import { AboutHero } from '../components/about/AboutHero';
import { ProfileBlock } from '../components/about/ProfileBlock';
import { SkillsGrid } from '../components/about/SkillsGrid';
import { fetchSiteContent } from '../features/siteContent/siteContentSlice';

export const AboutPage = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.siteContent.status);
  const about = useAppSelector((state) => state.siteContent.content.about);
  const skillGroups = useAppSelector((state) => state.siteContent.content.skillGroups);
  const workExperience = useAppSelector((state) => state.siteContent.content.workExperience);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSiteContent());
    }
  }, [dispatch, status]);

  return (
    <section className="about-page">
      <AboutHero title="About" highlight="Me" />
      <div className="about-main">
        <div className="about-grid">
          <div className="about-left">
            <AboutCard title="Quick intro">
              {about.quickIntro.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <ul className="about-list">
                {about.quickIntro.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </AboutCard>
            <AboutCard title="Current focus">
              {about.currentFocus.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </AboutCard>
            <AboutCard title="Outside of coding">
              {about.outsideCoding.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </AboutCard>
          </div>
          <ProfileBlock facts={about.profileFacts} workExperience={workExperience} />
        </div>
      </div>
      <SkillsGrid groups={skillGroups} />
    </section>
  );
};
