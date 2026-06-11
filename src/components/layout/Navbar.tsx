import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleTheme } from '../../features/ui/uiSlice';

// NavLink uses isActive to style the current route.
const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link is-active' : 'nav-link';

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.ui.themeMode);
  const [menuOpen, setMenuOpen] = useState(false);
  const nextThemeLabel =
    themeMode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';

  // Mobile menu toggle for small screens.
  const handleToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  // Close menu after clicking a link.
  const handleClose = () => {
    setMenuOpen(false);
  };

  return (
    // aria-label helps screen readers understand the nav area.
    <nav className="navbar" aria-label="Main">
      <NavLink to="/" className="nav-brand" aria-label="Rodney Hili home" onClick={handleClose}>
        <img
          src="/images/Portfolio_siganture_logo.png"
          alt=""
          className="nav-brand-logo"
          aria-hidden="true"
        />
        <span className="nav-brand-wordmark" aria-hidden="true">
          Rodney <span className="nav-brand-accent">Hili</span>
        </span>
      </NavLink>
      <button
        type="button"
        className="nav-toggle"
        onClick={handleToggle}
        aria-label="Toggle menu"
        aria-controls="primary-nav"
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>
      <div id="primary-nav" className={menuOpen ? 'nav-menu is-open' : 'nav-menu'}>
        <div className="nav-links">
          <NavLink to="/" end className={getNavLinkClass} onClick={handleClose}>
            Home
          </NavLink>
          <NavLink to="/about" className={getNavLinkClass} onClick={handleClose}>
            About
          </NavLink>
          <NavLink to="/projects" end={false} className={getNavLinkClass} onClick={handleClose}>
            Projects
          </NavLink>
          <NavLink to="/contact" className={getNavLinkClass} onClick={handleClose}>
            Contact
          </NavLink>
          <a
            className="nav-link"
            href="/Rodney%20Hili%20CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
          >
            <DownloadOutlinedIcon className="nav-link-icon" fontSize="small" aria-hidden="true" />
            <span>Resume</span>
          </a>
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => dispatch(toggleTheme())}
          aria-label={nextThemeLabel}
          aria-pressed={themeMode === 'light'}
        >
          <span className="theme-toggle-track" aria-hidden="true">
            <span className="theme-toggle-icon theme-toggle-icon-sun">
              <LightModeOutlinedIcon fontSize="inherit" />
            </span>
            <span className="theme-toggle-icon theme-toggle-icon-moon">
              <DarkModeOutlinedIcon fontSize="inherit" />
            </span>
            <span className="theme-toggle-thumb" />
          </span>
        </button>
      </div>
    </nav>
  );
};
