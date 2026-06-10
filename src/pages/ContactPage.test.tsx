import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../test/testUtils';

import { ContactPage } from './ContactPage';

describe('ContactPage form', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  // Proves client validation blocks submit and success flow works.
  it('validates empty fields and submits with valid data', async () => {
    const user = userEvent.setup();
    let resolveFetch: (value: Response) => void = () => {};
    const fetchPromise = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    const fetchMock = vi.fn(() => fetchPromise);
    vi.stubGlobal('fetch', fetchMock);

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

    expect(await screen.findByRole('button', { name: /sending/i })).toBeDisabled();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [, request] = fetchMock.mock.calls[0];
    const body = JSON.parse(String((request as RequestInit).body));
    expect(body).toMatchObject({
      service_id: 'service_j5kk5lh',
      template_id: 'template_gup9ak9',
      user_id: '83Tlbc6F7UBvXU9mf',
      template_params: {
        name: 'Rodney',
        email: 'rodney@test.com',
        title: 'Hello',
        subject: 'Hello',
        message: 'This is a test message long enough.',
        to_email: 'rodney.hili2005@gmail.com',
        reply_to: 'rodney@test.com',
      },
    });

    resolveFetch({ ok: true } as Response);

    expect(
      await screen.findByText(/thanks for reaching out/i, {}, { timeout: 2000 }),
    ).toBeInTheDocument();
  });
});
