import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  getContactErrors,
  resetForm,
  setField,
  submitContactForm,
  validateForm,
  type ContactField,
} from '../contactSlice';

import { FormField } from './FormField';
import { StatusBanner } from './StatusBanner';

import type { FormEvent } from 'react';

export const ContactForm = () => {
  const dispatch = useAppDispatch();
  const { fields, errors, status, errorMessage } = useAppSelector((state) => state.contact);

  const handleChange = (field: ContactField, value: string) => {
    dispatch(setField({ field, value }));
  };

  const submitForm = () => {
    if (status === 'loading') {
      return;
    }
    const validationErrors = getContactErrors(fields);
    const hasErrors = Object.values(validationErrors).some(Boolean);
    dispatch(validateForm());
    if (hasErrors) {
      return;
    }
    dispatch(submitContactForm(fields));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitForm();
  };

  if (status === 'succeeded') {
    return (
      <div className="contact-card">
        <StatusBanner tone="success" message="Thanks for reaching out. I'll reply soon." />
        <button type="button" className="button-link primary" onClick={() => dispatch(resetForm())}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="contact-card" onSubmit={handleSubmit} noValidate>
      <h2>Send a message</h2>
      <p className="contact-muted">Fill out the form and I will get back to you.</p>
      {status === 'failed' ? (
        <StatusBanner
          tone="error"
          message={errorMessage ?? 'Something went wrong. Please try again.'}
          actionLabel="Try again"
          onAction={submitForm}
        />
      ) : null}
      <div className="contact-fields">
        <FormField
          id="name"
          label="Name"
          value={fields.name}
          error={errors.name}
          onChange={handleChange}
        />
        <FormField
          id="email"
          label="Email"
          value={fields.email}
          error={errors.email}
          type="email"
          onChange={handleChange}
        />
        <FormField
          id="subject"
          label="Subject"
          value={fields.subject}
          error={errors.subject}
          onChange={handleChange}
        />
        <FormField
          id="message"
          label="Message"
          value={fields.message}
          error={errors.message}
          multiline
          rows={5}
          onChange={handleChange}
        />
      </div>
      <div className="contact-actions">
        <button type="submit" className="button-link primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending...' : 'Send message'}
        </button>
      </div>
    </form>
  );
};
