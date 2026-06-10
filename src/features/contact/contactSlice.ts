import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

export type ContactField = 'name' | 'email' | 'subject' | 'message';

export type ContactFields = Record<ContactField, string>;
export type ContactErrors = Record<ContactField, string | null>;

type ContactState = {
  fields: ContactFields;
  errors: ContactErrors;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  errorMessage: string | null;
};

// Base empty values for a clean reset.
const initialFields: ContactFields = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

// Keep errors aligned with fields for easy mapping in the UI.
const initialErrors: ContactErrors = {
  name: null,
  email: null,
  subject: null,
  message: null,
};

// Simple email check for client-side validation.
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emailJsConfig = {
  endpoint: 'https://api.emailjs.com/api/v1.0/email/send',
  serviceId: 'service_j5kk5lh',
  templateId: 'template_gup9ak9',
  publicKey: '83Tlbc6F7UBvXU9mf',
} as const;

// Central validation so UI and tests use the same rules.
export const getContactErrors = (fields: ContactFields): ContactErrors => {
  const errors: ContactErrors = { ...initialErrors };

  if (fields.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!emailRegex.test(fields.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (fields.subject.trim().length < 3) {
    errors.subject = 'Subject must be at least 3 characters.';
  }

  if (fields.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  }

  return errors;
};

const getEmailJsTemplateParams = (fields: ContactFields) => ({
  name: fields.name.trim(),
  email: fields.email.trim(),
  title: fields.subject.trim(),
  subject: fields.subject.trim(),
  message: fields.message.trim(),
  time: new Date().toLocaleString(),
  to_email: 'rodney.hili2005@gmail.com',
  reply_to: fields.email.trim(),
});

// Send the validated form through EmailJS.
export const submitContactForm = createAsyncThunk<string, ContactFields, { rejectValue: string }>(
  'contact/submitContactForm',
  async (fields, { rejectWithValue }) => {
    try {
      const response = await fetch(emailJsConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: emailJsConfig.serviceId,
          template_id: emailJsConfig.templateId,
          user_id: emailJsConfig.publicKey,
          template_params: getEmailJsTemplateParams(fields),
        }),
      });

      if (!response.ok) {
        throw new Error('EmailJS request failed.');
      }

      return 'Message sent.';
    } catch {
      return rejectWithValue('Unable to send the message right now.');
    }
  },
);

// Start in idle so the form is ready on first load.
const initialState: ContactState = {
  fields: { ...initialFields },
  errors: { ...initialErrors },
  status: 'idle',
  errorMessage: null,
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    // Update a single field and clear its error for nicer UX.
    setField(state, action: PayloadAction<{ field: ContactField; value: string }>) {
      const { field, value } = action.payload;
      state.fields[field] = value;
      state.errors[field] = null;
      if (state.status !== 'idle') {
        state.status = 'idle';
        state.errorMessage = null;
      }
    },
    // Run validation and store errors in Redux.
    validateForm(state) {
      state.errors = getContactErrors(state.fields);
    },
    // Reset clears fields, errors, and status after success.
    resetForm(state) {
      state.fields = { ...initialFields };
      state.errors = { ...initialErrors };
      state.status = 'idle';
      state.errorMessage = null;
    },
    // Used after showing a banner so UI can go back to normal.
    clearStatus(state) {
      state.status = 'idle';
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Async status drives loader + success/error banners.
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = null;
      })
      .addCase(submitContactForm.fulfilled, (state) => {
        state.status = 'succeeded';
        state.errorMessage = null;
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.payload ?? 'Unable to send the message right now.';
      });
  },
});

export const { setField, validateForm, resetForm, clearStatus } = contactSlice.actions;
export default contactSlice.reducer;
