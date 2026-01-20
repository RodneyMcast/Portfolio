import { Outlet } from 'react-router-dom';

// Wrapper keeps the nested projects pages under one section.
export const ProjectsLayout = () => (
  <section className="page">
    <Outlet />
  </section>
);
