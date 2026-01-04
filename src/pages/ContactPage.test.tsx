import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../test/testUtils';

import { ContactPage } from './ContactPage';

describe('ContactPage form', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('validates empty fields and submits with valid data', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const user = userEvent.setup();

    renderWithProviders(<ContactPage />, { route: '/contact' });

    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/subject must be at least 3 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/name/i), 'Rodney');
    await user.type(screen.getByLabelText(/email/i), 'rodney@test.com');
    await user.type(screen.getByLabelText(/subject/i), 'Hello');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message long enough.');

    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();
    });

    expect(
      await screen.findByText(/thanks for reaching out/i, {}, { timeout: 2000 }),
    ).toBeInTheDocument();
  });
});
