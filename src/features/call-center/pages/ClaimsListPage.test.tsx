import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils';
import { ClaimsListPage } from './ClaimsListPage';

function renderClaimsList() {
  return renderWithProviders(<ClaimsListPage />);
}

describe('ClaimsListPage', () => {
  it('renders all 7 mock claims by default', () => {
    renderClaimsList();
    expect(screen.getByText('WC-2024-001')).toBeInTheDocument();
    expect(screen.getByText('WC-2024-007')).toBeInTheDocument();
  });

  it('filters by carrier name (debounced)', async () => {
    const user = userEvent.setup();
    renderClaimsList();

    const search = screen.getByPlaceholderText(/search by shop name/i);
    await user.type(search, 'Geico');

    // Debounce is 300ms; waitFor handles the wait
    await waitFor(() => {
      expect(screen.getByText('WC-2024-002')).toBeInTheDocument();
      expect(screen.getByText('WC-2024-006')).toBeInTheDocument();
      // Non-Geico claims should be filtered out
      expect(screen.queryByText('WC-2024-001')).not.toBeInTheDocument();
    });
  });

  it('matches phone numbers with format-agnostic search', async () => {
    const user = userEvent.setup();
    renderClaimsList();

    const search = screen.getByPlaceholderText(/search by shop name/i);
    // "555-2" should find phones like "(555) 234-5678" via digit-only matching
    await user.type(search, '555-2');

    await waitFor(() => {
      // WC-2024-002 has phone (555) 234-5678 → digits 5552345678 contains "5552"
      expect(screen.getByText('WC-2024-002')).toBeInTheDocument();
    });
  });

  it('filters by status', async () => {
    const user = userEvent.setup();
    renderClaimsList();

    const statusFilter = screen.getByLabelText(/filter by status/i);
    await user.selectOptions(statusFilter, 'IN_PROCESS');

    expect(screen.getByText('WC-2024-002')).toBeInTheDocument();
    expect(screen.queryByText('WC-2024-001')).not.toBeInTheDocument();
  });

  it('shows empty state when no claims match', async () => {
    const user = userEvent.setup();
    renderClaimsList();

    const search = screen.getByPlaceholderText(/search by shop name/i);
    await user.type(search, 'NONEXISTENT_QUERY_XYZ');

    await waitFor(() => {
      expect(screen.getByText(/no claims match your filters/i)).toBeInTheDocument();
    });
  });
});
