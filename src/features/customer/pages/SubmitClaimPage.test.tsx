import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils';
import { SubmitClaimPage } from './SubmitClaimPage';

describe('SubmitClaimPage', () => {
  it('renders step 1 (Your Information) first', () => {
    renderWithProviders(<SubmitClaimPage />);
    expect(
      screen.getByRole('heading', { name: /your information/i }),
    ).toBeInTheDocument();
  });

  it('blocks step advance when required fields are empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SubmitClaimPage />);

    await user.click(screen.getByRole('button', { name: /^next$/i }));

    // Errors should appear inline
    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();

    // Should still be on step 1
    expect(
      screen.getByRole('heading', { name: /your information/i }),
    ).toBeInTheDocument();
  });

  it('rejects an invalid email format', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SubmitClaimPage />);

    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /^next$/i }));

    expect(
      await screen.findByText(/enter a valid email/i),
    ).toBeInTheDocument();
  });

  it('advances to step 2 when all step-1 fields are valid', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SubmitClaimPage />);

    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Smith');
    await user.type(screen.getByLabelText(/^email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone number/i), '(555) 123-4567');
    await user.type(screen.getByLabelText(/driver's license/i), 'DL123456');
    await user.type(screen.getByLabelText(/street address/i), '123 Main St');
    await user.type(screen.getByLabelText(/^city/i), 'Toronto');
    await user.type(screen.getByLabelText(/province\/state/i), 'ON');
    await user.type(screen.getByLabelText(/postal code/i), 'M5H 2N2');

    await user.click(screen.getByRole('button', { name: /^next$/i }));

    expect(
      await screen.findByRole('heading', { name: /vehicle details/i }),
    ).toBeInTheDocument();
  });
});
