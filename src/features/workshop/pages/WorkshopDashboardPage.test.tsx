import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders } from '../../../test-utils';
import { WorkshopDashboardPage } from './WorkshopDashboardPage';

function WorkOrdersStub() {
  return <h1>Work Orders</h1>;
}

describe('WorkshopDashboardPage', () => {
  it('renders the three KPI cards with mock counts', () => {
    renderWithProviders(<WorkshopDashboardPage />);

    expect(screen.getByText(/pending jobs/i)).toBeInTheDocument();
    expect(screen.getByText(/in progress/i)).toBeInTheDocument();
    expect(screen.getByText(/completed today/i)).toBeInTheDocument();
  });

  it('navigates to /workshop/work-orders?status=PENDING when the Pending card is clicked', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Routes>
        <Route path="/" element={<WorkshopDashboardPage />} />
        <Route path="/workshop/work-orders" element={<WorkOrdersStub />} />
      </Routes>,
    );

    await user.click(
      screen.getByRole('button', { name: /pending jobs/i }),
    );

    expect(
      await screen.findByRole('heading', { name: /work orders/i }),
    ).toBeInTheDocument();
  });
});
