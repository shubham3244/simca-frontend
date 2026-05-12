import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MaskedField } from './MaskedField';

// Stub the security log so we don't actually console.log in tests
vi.mock('../../lib/telemetry/securityLog', () => ({
  logPiiReveal: vi.fn(),
}));

import { logPiiReveal } from '../../lib/telemetry/securityLog';

const upperMask = (raw: string) => `***${raw.slice(-3)}`;

describe('MaskedField', () => {
  it('shows the masked value by default', () => {
    render(
      <MaskedField
        value="hello-world"
        mask={upperMask}
        fieldName="test"
      />,
    );
    expect(screen.getByText('***rld')).toBeInTheDocument();
    expect(screen.queryByText('hello-world')).not.toBeInTheDocument();
  });

  it('reveals the unmasked value when the eye icon is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MaskedField
        value="hello-world"
        mask={upperMask}
        fieldName="test"
      />,
    );

    await user.click(screen.getByRole('button', { name: /show test/i }));

    expect(screen.getByText('hello-world')).toBeInTheDocument();
    expect(screen.queryByText('***rld')).not.toBeInTheDocument();
  });

  it('logs a PII reveal event when revealed', async () => {
    const user = userEvent.setup();
    render(
      <MaskedField
        value="hello-world"
        mask={upperMask}
        fieldName="phone"
        resourceId="WC-2024-001"
      />,
    );

    await user.click(screen.getByRole('button', { name: /show phone/i }));

    expect(logPiiReveal).toHaveBeenCalledWith({
      field: 'phone',
      resourceId: 'WC-2024-001',
    });
  });

  it('does not log when re-masking (only initial reveal)', async () => {
    const user = userEvent.setup();
    vi.mocked(logPiiReveal).mockClear();
    render(
      <MaskedField value="hello-world" mask={upperMask} fieldName="vin" />,
    );

    await user.click(screen.getByRole('button', { name: /show vin/i }));
    await user.click(screen.getByRole('button', { name: /hide vin/i }));

    expect(logPiiReveal).toHaveBeenCalledTimes(1);
  });

  it('hides the reveal toggle when revealable is false', () => {
    render(
      <MaskedField
        value="4111111111111234"
        mask={upperMask}
        fieldName="card"
        revealable={false}
      />,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
