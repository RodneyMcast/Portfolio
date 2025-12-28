import { Outlet } from "react-router-dom";
import { useApplyTheme } from "../../app/hooks";
import { Navbar } from "./Navbar";

const LeftSocialBar = () => (
  <aside className="left-social" aria-label="Social links">
    <span>Socials soon</span>
  </aside>
);

const Background = () => <div className="background" aria-hidden="true" />;

export const AppLayout = () => {
  useApplyTheme();

  return (
    <div className="app-shell">
      <Background />
      <header className="app-header">
        <Navbar />
      </header>
      <LeftSocialBar />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">Built with React + Redux</footer>
    </div>
  );
};
