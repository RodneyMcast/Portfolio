import type { ReactNode } from "react";

type AboutCardProps = {
  title: string;
  children: ReactNode;
};

export const AboutCard = ({ title, children }: AboutCardProps) => (
  <article className="about-card">
    <h3>{title}</h3>
    <div className="about-card-body">{children}</div>
  </article>
);
