import { ContactForm } from '../features/contact/components/ContactForm';

// Page wrapper with a hero and the form card.
export const ContactPage = () => (
  <section className="contact-page">
    <header className="contact-hero">
      <span className="eyebrow">Contact</span>
      <h1>Contact</h1>
      <p>Send me a message and I will get back to you.</p>
    </header>
    <div className="contact-info">
      <div className="contact-info-item">
        <span className="contact-label">Name</span>
        <span>Rodney Hili</span>
      </div>
      <div className="contact-info-item">
        <span className="contact-label">Email</span>
        <a href="mailto:rodney.hili2005@gmail.com">rodney.hili2005@gmail.com</a>
      </div>
      <div className="contact-info-item">
        <span className="contact-label">Phone</span>
        <a href="tel:+35699551429">+356 99551429</a>
      </div>
    </div>
    <ContactForm />
  </section>
);
