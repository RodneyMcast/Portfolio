import { NavLink } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { toggleTheme } from "../../features/ui/uiSlice";

const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav-link is-active" : "nav-link";

export const Navbar = () => {
  const dispatch = useAppDispatch();

  return (
    <nav className="navbar" aria-label="Main">
      <div className="nav-brand">Portfolio</div>
      <div className="nav-links">
        <NavLink to="/" end className={getNavLinkClass}>
          Home
        </NavLink>
        <NavLink to="/about" className={getNavLinkClass}>
          About
        </NavLink>
        <NavLink to="/projects" end={false} className={getNavLinkClass}>
          Projects
        </NavLink>
        <a className="nav-link" href="#resume">
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
    </nav>
  );
};
