import { Outlet } from "react-router-dom";
import { useApplyTheme } from "../../app/hooks";
import { Navbar } from "./Navbar";

const Background = () => <div className="background" aria-hidden="true" />;

export const AppLayout = () => {
  useApplyTheme();

  return (
    <div className="app-shell">
      <Background />
      <header className="app-header">
        <Navbar />
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer" />
    </div>
  );
};
