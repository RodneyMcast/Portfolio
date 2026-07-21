import { useEffect } from 'react';

import { useAppSelector } from '../app/hooks';
import { ContactForm } from '../features/contact/components/ContactForm';

// Page wrapper with a hero and the form card.
export const ContactPage = () => {
  const contactSettings = useAppSelector((state) => state.siteContent.content.siteSettings.contact);
  const seoSettings = useAppSelector((state) => state.siteContent.content.siteSettings.seo);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.title = `${contactSettings.heroTitle} | ${seoSettings.title}`;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) {
      meta.content = contactSettings.heroDescription;
    }
  }, [contactSettings.heroDescription, contactSettings.heroTitle, seoSettings.title]);

  return (
    <section className="contact-page">
      <header className="contact-hero">
        <span className="eyebrow">{contactSettings.heroTitle}</span>
        <h1>{contactSettings.heroTitle}</h1>
        <p>{contactSettings.heroDescription}</p>
      </header>
      <div className="contact-info">
        <div className="contact-info-item">
          <span className="contact-label">Name</span>
          <span>{contactSettings.name}</span>
        </div>
        <div className="contact-info-item">
          <span className="contact-label">Email</span>
          <a href={`mailto:${contactSettings.email}`}>{contactSettings.email}</a>
        </div>
        <div className="contact-info-item">
          <span className="contact-label">Phone</span>
          <a href={`tel:${contactSettings.phone.replace(/\s+/g, '')}`}>{contactSettings.phone}</a>
        </div>
        <div className="contact-info-item">
          <span className="contact-label">GitHub</span>
          <a className="contact-profile-link" href={contactSettings.githubUrl} target="_blank" rel="noopener noreferrer">
            {contactSettings.githubLabel}
          </a>
        </div>
        <div className="contact-info-item">
          <span className="contact-label">LinkedIn</span>
          <a className="contact-profile-link" href={contactSettings.linkedinUrl} target="_blank" rel="noopener noreferrer">
            {contactSettings.linkedinLabel}
          </a>
        </div>
        <div className="contact-info-item">
          <span className="contact-label">Itch.io</span>
          <a className="contact-profile-link" href={contactSettings.itchUrl} target="_blank" rel="noopener noreferrer">
            {contactSettings.itchLabel}
          </a>
        </div>
      </div>
      <ContactForm />
    </section>
  );
};
