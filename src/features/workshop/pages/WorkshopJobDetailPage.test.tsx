import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders } from '../../../test-utils';
import { WorkshopJobDetailPage } from './WorkshopJobDetailPage';

function renderDetail(workOrderNo: string) {
  return renderWithProviders(
    <Routes>
      <Route
        path="/workshop/work-orders/:workOrderNo"
        element={<WorkshopJobDetailPage />}
      />
    </Routes>,
    { initialEntries: [`/workshop/work-orders/${workOrderNo}`] },
  );
}

describe('WorkshopJobDetailPage', () => {
  it('renders the job header with the work order number', () => {
    renderDetail('WO-2024-015');
    expect(
      screen.getByRole('heading', { level: 1, name: 'WO-2024-015' }),
    ).toBeInTheDocument();
  });

  it('masks customer email and phone by default', () => {
    renderDetail('WO-2024-015');

    // Real email/phone should not be visible until reveal
    expect(screen.queryByText('john.smith@example.com')).not.toBeInTheDocument();
    expect(screen.queryByText('(555) 123-4567')).not.toBeInTheDocument();

    // Masked forms are shown
    expect(screen.getByText('j***@example.com')).toBeInTheDocument();
    expect(screen.getByText(/\(555\) \*\*\*-4567/)).toBeInTheDocument();
  });

  it('reveals customer phone after clicking the reveal toggle', async () => {
    const user = userEvent.setup();
    renderDetail('WO-2024-015');

    await user.click(
      screen.getByRole('button', { name: /show phone for WO-2024-015/i }),
    );

    expect(screen.getByText('(555) 123-4567')).toBeInTheDocument();
  });

  it('shows Start Work button for PENDING jobs and confirms before transitioning', async () => {
    const user = userEvent.setup();
    renderDetail('WO-2024-015');

    const startBtn = screen.getByRole('button', { name: /start work/i });
    await user.click(startBtn);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText(/start this job\?/i)).toBeInTheDocument();
  });

  it('switches to Parts & Invoice tab', async () => {
    const user = userEvent.setup();
    renderDetail('WO-2024-015');

    await user.click(screen.getByRole('tab', { name: /parts & invoice/i }));

    expect(
      screen.getByRole('heading', { name: /parts list/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /labour & pricing breakdown/i }),
    ).toBeInTheDocument();
  });

  it('shows a not-found message for unknown work orders', () => {
    renderDetail('WO-MISSING-999');
    expect(
      screen.getByRole('heading', { name: /work order not found/i }),
    ).toBeInTheDocument();
  });
});
