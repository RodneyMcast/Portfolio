import { useEffect } from 'react';

import { HomeHero } from '../components/home/HomeHero';
import { useAppSelector } from '../app/hooks';

export const HomePage = () => {
  const homeSettings = useAppSelector((state) => state.siteContent.content.siteSettings.home);
  const seoSettings = useAppSelector((state) => state.siteContent.content.siteSettings.seo);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.title = seoSettings.title;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) {
      meta.content = seoSettings.description;
    }
  }, [seoSettings.description, seoSettings.title]);

  return (
    <section className="page">
      <HomeHero content={homeSettings} />
    </section>
  );
};
