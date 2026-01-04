type AboutHeroProps = {
  title: string;
  highlight?: string;
  subtitle?: string;
};

export const AboutHero = ({ title, highlight, subtitle }: AboutHeroProps) => (
  <header className="about-hero">
    <span className="eyebrow">About</span>
    <h1>
      {title} {highlight ? <span className="accent">{highlight}</span> : null}
    </h1>
    {subtitle ? <p>{subtitle}</p> : null}
  </header>
);
