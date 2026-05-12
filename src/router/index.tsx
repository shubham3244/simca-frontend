import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { FullPageSpinner } from '../components/ui/FullPageSpinner';
import { CallCenterLoginPage } from '../features/auth/pages/CallCenterLoginPage';
import { CustomerLoginPage } from '../features/auth/pages/CustomerLoginPage';
import { InsurerLoginPage } from '../features/auth/pages/InsurerLoginPage';
import { WorkshopLoginPage } from '../features/auth/pages/WorkshopLoginPage';
import { RequireAnon } from './guards/RequireAnon';
import { RequireAuth } from './guards/RequireAuth';
import { RequireRole } from './guards/RequireRole';

// ─── Lazy-loaded portal bundles ────────────────────────────────────────────

// Call Center
const CallCenterLayout = lazy(() =>
  import('../features/call-center/layouts/CallCenterLayout').then((m) => ({
    default: m.CallCenterLayout,
  })),
);
const DashboardPage = lazy(() =>
  import('../features/call-center/pages/DashboardPage').then((m) => ({
    default: m.DashboardPage,
  })),
);
const ClaimsListPage = lazy(() =>
  import('../features/call-center/pages/ClaimsListPage').then((m) => ({
    default: m.ClaimsListPage,
  })),
);
const ClaimDetailsPage = lazy(() =>
  import('../features/call-center/pages/ClaimDetailsPage').then((m) => ({
    default: m.ClaimDetailsPage,
  })),
);
const NewClaimPage = lazy(() =>
  import('../features/call-center/pages/NewClaimPage').then((m) => ({
    default: m.NewClaimPage,
  })),
);
const BatchedInvoicesPage = lazy(() =>
  import('../features/call-center/pages/BatchedInvoicesPage').then((m) => ({
    default: m.BatchedInvoicesPage,
  })),
);

// Insurer
const InsurerLayout = lazy(() =>
  import('../features/insurer/layouts/InsurerLayout').then((m) => ({
    default: m.InsurerLayout,
  })),
);
const InsurerDashboardPage = lazy(() =>
  import('../features/insurer/pages/InsurerDashboardPage').then((m) => ({
    default: m.InsurerDashboardPage,
  })),
);

// Workshop
const WorkshopLayout = lazy(() =>
  import('../features/workshop/layouts/WorkshopLayout').then((m) => ({
    default: m.WorkshopLayout,
  })),
);
const WorkshopDashboardPage = lazy(() =>
  import('../features/workshop/pages/WorkshopDashboardPage').then((m) => ({
    default: m.WorkshopDashboardPage,
  })),
);
const WorkshopWorkOrdersPage = lazy(() =>
  import('../features/workshop/pages/WorkshopWorkOrdersPage').then((m) => ({
    default: m.WorkshopWorkOrdersPage,
  })),
);
const WorkshopJobDetailPage = lazy(() =>
  import('../features/workshop/pages/WorkshopJobDetailPage').then((m) => ({
    default: m.WorkshopJobDetailPage,
  })),
);

// Customer
const CustomerLayout = lazy(() =>
  import('../features/customer/layouts/CustomerLayout').then((m) => ({
    default: m.CustomerLayout,
  })),
);
const MyClaimsPage = lazy(() =>
  import('../features/customer/pages/MyClaimsPage').then((m) => ({
    default: m.MyClaimsPage,
  })),
);
const CustomerClaimDetailPage = lazy(() =>
  import('../features/customer/pages/CustomerClaimDetailPage').then((m) => ({
    default: m.CustomerClaimDetailPage,
  })),
);
const SubmitClaimPage = lazy(() =>
  import('../features/customer/pages/SubmitClaimPage').then((m) => ({
    default: m.SubmitClaimPage,
  })),
);
const ClaimSubmittedPage = lazy(() =>
  import('../features/customer/pages/ClaimSubmittedPage').then((m) => ({
    default: m.ClaimSubmittedPage,
  })),
);

const lazyEl = (Component: React.ComponentType) => (
  <Suspense fallback={<FullPageSpinner />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  // Default → Call Center login
  { path: '/', element: <Navigate to="/call-center/login" replace /> },

  // Public per-portal login pages
  {
    element: <RequireAnon />,
    children: [
      { path: '/call-center/login', element: <CallCenterLoginPage /> },
      { path: '/customer/login', element: <CustomerLoginPage /> },
      { path: '/insurer/login', element: <InsurerLoginPage /> },
      { path: '/workshop/login', element: <WorkshopLoginPage /> },
    ],
  },

  // Protected — Call Center
  {
    element: <RequireAuth loginPath="/call-center/login" />,
    children: [
      {
        element: (
          <RequireRole
            allowed={['CALL_CENTER_AGENT', 'CSR', 'MANAGER', 'ADMIN']}
          />
        ),
        children: [
          {
            path: '/call-center',
            element: lazyEl(CallCenterLayout),
            children: [
              { index: true, element: lazyEl(DashboardPage) },
              { path: 'claims', element: lazyEl(ClaimsListPage) },
              { path: 'claims/new', element: lazyEl(NewClaimPage) },
              { path: 'claims/:controlNo', element: lazyEl(ClaimDetailsPage) },
              { path: 'batched-invoices', element: lazyEl(BatchedInvoicesPage) },
              {
                path: 'settings',
                element: (
                  <div className="rounded-lg bg-card p-6">
                    <h1 className="text-xl font-semibold text-foreground">Settings</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Settings configuration coming soon...
                    </p>
                  </div>
                ),
              },
            ],
          },
        ],
      },
    ],
  },

  // Protected — Customer
  {
    element: <RequireAuth loginPath="/customer/login" />,
    children: [
      {
        element: <RequireRole allowed={['CUSTOMER']} />,
        children: [
          {
            path: '/customer',
            element: lazyEl(CustomerLayout),
            children: [
              { index: true, element: <Navigate to="claims" replace /> },
              { path: 'claims', element: lazyEl(MyClaimsPage) },
              { path: 'claims/new', element: lazyEl(SubmitClaimPage) },
              {
                path: 'claims/:referenceNo',
                element: lazyEl(CustomerClaimDetailPage),
              },
              { path: 'submitted', element: lazyEl(ClaimSubmittedPage) },
            ],
          },
        ],
      },
    ],
  },

  // Protected — Insurer
  {
    element: <RequireAuth loginPath="/insurer/login" />,
    children: [
      {
        element: <RequireRole allowed={['INSURER']} />,
        children: [
          {
            path: '/insurer',
            element: lazyEl(InsurerLayout),
            children: [
              { index: true, element: lazyEl(InsurerDashboardPage) },
            ],
          },
        ],
      },
    ],
  },

  // Protected — Workshop
  {
    element: <RequireAuth loginPath="/workshop/login" />,
    children: [
      {
        element: <RequireRole allowed={['WORKSHOP']} />,
        children: [
          {
            path: '/workshop',
            element: lazyEl(WorkshopLayout),
            children: [
              { index: true, element: lazyEl(WorkshopDashboardPage) },
              { path: 'work-orders', element: lazyEl(WorkshopWorkOrdersPage) },
              {
                path: 'work-orders/:workOrderNo',
                element: lazyEl(WorkshopJobDetailPage),
              },
              {
                path: 'settings',
                element: (
                  <div className="rounded-lg bg-card p-6">
                    <h1 className="text-xl font-semibold text-foreground">Settings</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Settings configuration coming soon...
                    </p>
                  </div>
                ),
              },
            ],
          },
        ],
      },
    ],
  },

  { path: '*', element: <div className="p-8">404 — Page not found</div> },
]);
