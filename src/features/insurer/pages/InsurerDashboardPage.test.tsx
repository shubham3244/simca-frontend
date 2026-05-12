import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils';
import { InsurerDashboardPage } from './InsurerDashboardPage';

describe('InsurerDashboardPage', () => {
  it('renders all 4 KPI cards', () => {
    renderWithProviders(<InsurerDashboardPage />);
    expect(screen.getByText('Total Claims')).toBeInTheDocument();
    expect(screen.getByText('Open Claims')).toBeInTheDocument();
    expect(screen.getByText('Total Amount')).toBeInTheDocument();
    expect(screen.getByText('Avg Processing Time')).toBeInTheDocument();
  });

  it('renders the claims table with all 5 mock claims', () => {
    renderWithProviders(<InsurerDashboardPage />);
    expect(screen.getByText('WC-2024-001')).toBeInTheDocument();
    expect(screen.getByText('WC-2024-005')).toBeInTheDocument();
  });

  it('filters to Pending Review claims', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InsurerDashboardPage />);

    await user.click(screen.getByRole('tab', { name: /pending/i }));

    // WC-2024-001 and WC-2024-004 are PENDING_REVIEW
    expect(screen.getByText('WC-2024-001')).toBeInTheDocument();
    expect(screen.getByText('WC-2024-004')).toBeInTheDocument();
    expect(screen.queryByText('WC-2024-003')).not.toBeInTheDocument();
  });

  it('opens the claim detail modal when View Details is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InsurerDashboardPage />);

    const row = screen.getByText('WC-2024-001').closest('tr')!;
    await user.click(within(row).getByRole('button', { name: /view details/i }));

    expect(
      await screen.findByText('Claim Details - WC-2024-001'),
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /customer info/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /financial/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /audit log/i })).toBeInTheDocument();
  });

  it('hides action buttons and shows approval banner for APPROVED claims', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InsurerDashboardPage />);

    const row = screen.getByText('WC-2024-003').closest('tr')!;
    await user.click(within(row).getByRole('button', { name: /view details/i }));

    expect(
      await screen.findByText(/claim approved — payment authorized/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /^approve claim$/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /request additional info/i }),
    ).not.toBeInTheDocument();
  });

  it('shows the correct customer for each claim (no hardcoded data)', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InsurerDashboardPage />);

    const row = screen.getByText('WC-2024-002').closest('tr')!;
    await user.click(within(row).getByRole('button', { name: /view details/i }));

    const dialog = await screen.findByRole('dialog');
    await user.click(
      within(dialog).getByRole('tab', { name: /customer info/i }),
    );

    // Customer name only appears in the modal (not in the row, which we already
    // matched separately). Phone is masked by default.
    expect(within(dialog).getByText('Emily Johnson')).toBeInTheDocument();
    // Ensure WC-2024-001's email doesn't leak through to this claim's modal
    expect(
      within(dialog).queryByText('john.smith@example.com'),
    ).not.toBeInTheDocument();
  });

  it('search filters claims by customer name', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InsurerDashboardPage />);

    const search = screen.getByPlaceholderText(/search by claim id/i);
    await user.type(search, 'Emily');

    await waitFor(() => {
      expect(screen.getByText('WC-2024-002')).toBeInTheDocument();
      expect(screen.queryByText('WC-2024-001')).not.toBeInTheDocument();
    });
  });
});
