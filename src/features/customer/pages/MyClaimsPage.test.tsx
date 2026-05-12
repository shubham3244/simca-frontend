import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils';
import { MyClaimsPage } from './MyClaimsPage';

describe('MyClaimsPage', () => {
  it('shows all 4 mock claims by default', () => {
    renderWithProviders(<MyClaimsPage />);
    expect(screen.getByText('WC-2024-507')).toBeInTheDocument();
    expect(screen.getByText('WC-2024-450')).toBeInTheDocument();
    expect(screen.getByText('WC-2024-401')).toBeInTheDocument();
    expect(screen.getByText('WC-2024-380')).toBeInTheDocument();
  });

  it('filters to Active when the Active pill is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MyClaimsPage />);

    await user.click(screen.getByRole('tab', { name: /active/i }));

    // WC-2024-507 (Submitted) and WC-2024-450 (In Progress) are active
    expect(screen.getByText('WC-2024-507')).toBeInTheDocument();
    expect(screen.getByText('WC-2024-450')).toBeInTheDocument();
    // Completed and Cancelled should be hidden
    expect(screen.queryByText('WC-2024-401')).not.toBeInTheDocument();
    expect(screen.queryByText('WC-2024-380')).not.toBeInTheDocument();
  });

  it('filters to Closed when the Closed pill is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MyClaimsPage />);

    await user.click(screen.getByRole('tab', { name: /closed/i }));

    expect(screen.getByText('WC-2024-401')).toBeInTheDocument();
    expect(screen.getByText('WC-2024-380')).toBeInTheDocument();
    expect(screen.queryByText('WC-2024-507')).not.toBeInTheDocument();
  });

  it('sorts claims by most recent submission first', () => {
    renderWithProviders(<MyClaimsPage />);

    const rows = screen.getAllByRole('row');
    // Skip the header row, then check the next 4 rows
    const dataRows = rows.slice(1);
    expect(dataRows[0]).toHaveTextContent('WC-2024-507'); // 2026-05-12
    expect(dataRows[1]).toHaveTextContent('WC-2024-450'); // 2026-04-28
    expect(dataRows[2]).toHaveTextContent('WC-2024-401'); // 2026-04-10
    expect(dataRows[3]).toHaveTextContent('WC-2024-380'); // 2026-03-15
  });
});
