import { Outlet } from 'react-router-dom';

import { useApplyTheme } from '../../app/hooks';

import { Navbar } from './Navbar';

// Decorative background layer for the whole app.
const Background = () => <div className="background" aria-hidden="true" />;

export const AppLayout = () => {
  // Applies data-theme on <html> based on Redux state.
  useApplyTheme();

  return (
    <div className="app-shell">
      <Background />
      <header className="app-header">
        <Navbar />
      </header>
      <main className="app-main">
        {/* Outlet renders the active route page. */}
        <Outlet />
      </main>
      <footer className="app-footer" />
    </div>
  );
};
