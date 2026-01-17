import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { useAppDispatch } from '../../app/hooks';
import { toggleTheme } from '../../features/ui/uiSlice';

const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link is-active' : 'nav-link';

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleClose = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar" aria-label="Main">
      <div className="nav-brand">Portfolio</div>
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
            Resume
          </a>
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => dispatch(toggleTheme())}
          aria-label="Toggle theme"
        >
          Theme
        </button>
      </div>
    </nav>
  );
};
