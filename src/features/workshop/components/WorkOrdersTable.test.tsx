import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils';
import { WorkOrdersTable } from './WorkOrdersTable';

describe('WorkOrdersTable', () => {
  it('renders all mock work orders by default', () => {
    renderWithProviders(<WorkOrdersTable />);

    expect(screen.getByText('WO-2024-015')).toBeInTheDocument();
    expect(screen.getByText('WO-2024-016')).toBeInTheDocument();
    expect(screen.getByText('WO-2024-013')).toBeInTheDocument();
    expect(screen.getByText('WO-2024-014')).toBeInTheDocument();
    expect(screen.getByText('WO-2024-010')).toBeInTheDocument();
  });

  it('initializes filter from ?status= query param', () => {
    renderWithProviders(<WorkOrdersTable />, {
      initialEntries: ['/workshop/work-orders?status=PENDING'],
    });

    // Pending tab should be the active filter
    expect(screen.getByRole('tab', { name: /pending/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    // Only PENDING rows should appear
    expect(screen.getByText('WO-2024-015')).toBeInTheDocument();
    expect(screen.getByText('WO-2024-016')).toBeInTheDocument();
    expect(screen.queryByText('WO-2024-013')).not.toBeInTheDocument();
    expect(screen.queryByText('WO-2024-010')).not.toBeInTheDocument();
  });

  it('filters by status when a pill is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<WorkOrdersTable />);

    await user.click(screen.getByRole('tab', { name: /^completed/i }));

    expect(screen.getByText('WO-2024-010')).toBeInTheDocument();
    expect(screen.queryByText('WO-2024-015')).not.toBeInTheDocument();
  });

  it('shows the chat button per row and forwards onOpenChat', async () => {
    const user = userEvent.setup();
    const opens: string[] = [];
    renderWithProviders(
      <WorkOrdersTable onOpenChat={(no) => opens.push(no)} />,
    );

    // Find the chat button for the first work order
    const row = screen.getByText('WO-2024-015').closest('tr')!;
    const chatBtn = within(row).getByRole('button', {
      name: /open chat for WO-2024-015/i,
    });
    await user.click(chatBtn);

    expect(opens).toEqual(['WO-2024-015']);
  });
});
