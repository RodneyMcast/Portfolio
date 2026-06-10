import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { useApplyTheme } from '../../app/hooks';

import { Footer } from './Footer';
import { Navbar } from './Navbar';

// Decorative background layer for the whole app.
const Background = () => <div className="background" aria-hidden="true" />;

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

export const AppLayout = () => {
  // Applies data-theme on <html> based on Redux state.
  useApplyTheme();

  return (
    <div className="app-shell">
      <ScrollToTop />
      <Background />
      <header className="app-header">
        <Navbar />
      </header>
      <main className="app-main">
        {/* Outlet renders the active route page. */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
