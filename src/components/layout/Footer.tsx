import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
  { label: 'Dev/Admin', to: '/admin' },
] as const;

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/RodneyMcast',
    icon: <GitHubIcon fontSize="small" aria-hidden="true" />,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/rodney-hili-7693b42b5/',
    icon: <LinkedInIcon fontSize="small" aria-hidden="true" />,
  },
  {
    label: 'Itch.io',
    href: 'https://rodneyhili.itch.io/',
    icon: <span aria-hidden="true">it</span>,
  },
] as const;

export const Footer = () => (
  <footer className="app-footer">
    <div className="site-footer">
      <div className="footer-brand">
        <span className="footer-name">
          Rodney <span className="footer-name-accent">Hili</span>
        </span>
        <span className="footer-subtitle">Portfolio</span>
      </div>

      <nav className="footer-nav" aria-label="Footer">
        {footerLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={link.to === '/admin' ? 'footer-admin-link' : undefined}
            aria-label={`Footer link to ${link.label}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="footer-socials" aria-label="Social links">
        {socialLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
          >
            {link.icon}
          </a>
        ))}
      </div>

      <div className="footer-contact">
        <a href="mailto:rodney.hili2005@gmail.com">
          <EmailOutlinedIcon fontSize="small" aria-hidden="true" />
          <span>rodney.hili2005@gmail.com</span>
        </a>
        <a href="tel:+35699551429">
          <LocalPhoneOutlinedIcon fontSize="small" aria-hidden="true" />
          <span>+356 99551429</span>
        </a>
      </div>

      <div className="footer-bottom">Designed and built by Rodney Hili</div>
    </div>
  </footer>
);
