type ProjectsHeroProps = {
  heading: string;
  accent: string;
  summary?: string;
};

// Simple hero with one highlighted word.
export const ProjectsHero = ({ heading, accent, summary }: ProjectsHeroProps) => (
  <header className="projects-hero">
    <span className="eyebrow">Projects</span>
    <h1>
      {heading} <span className="accent">{accent}</span>
    </h1>
    {summary ? <p className="projects-hero-copy">{summary}</p> : null}
  </header>
);
