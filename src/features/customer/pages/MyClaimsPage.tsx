import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';
import { formatDate } from '../../../utils/format';
import { CustomerStatusBadge } from '../components/CustomerStatusBadge';
import { mockCustomerClaims } from '../data/mockCustomerClaims';
import type {
  CustomerClaimStatus,
  CustomerClaimSummary,
} from '../types/customer-claim.types';

type FilterValue = 'ALL' | 'ACTIVE' | 'CLOSED';

const ACTIVE_STATUSES: CustomerClaimStatus[] = ['SUBMITTED', 'IN_PROGRESS'];
const CLOSED_STATUSES: CustomerClaimStatus[] = ['COMPLETED', 'CANCELLED'];

function matchesFilter(
  claim: CustomerClaimSummary,
  filter: FilterValue,
): boolean {
  if (filter === 'ALL') return true;
  if (filter === 'ACTIVE') return ACTIVE_STATUSES.includes(claim.status);
  return CLOSED_STATUSES.includes(claim.status);
}

export function MyClaimsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterValue>('ALL');

  // Sort newest-first, then apply filter
  const filtered = useMemo(() => {
    const sorted = [...mockCustomerClaims].sort((a, b) =>
      b.submittedAt.localeCompare(a.submittedAt),
    );
    return sorted.filter((c) => matchesFilter(c, filter));
  }, [filter]);

  const counts = useMemo(() => {
    const all = mockCustomerClaims.length;
    const active = mockCustomerClaims.filter((c) =>
      ACTIVE_STATUSES.includes(c.status),
    ).length;
    const closed = mockCustomerClaims.filter((c) =>
      CLOSED_STATUSES.includes(c.status),
    ).length;
    return { all, active, closed };
  }, []);

  const hasAnyClaims = mockCustomerClaims.length > 0;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="rounded-xl bg-card p-6 sm:p-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Claims</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review the status of your submitted windshield claims.
            </p>
          </div>
          <Button
            onClick={() => navigate('/customer/claims/new')}
            leftIcon={
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            }
          >
            Submit New Claim
          </Button>
        </header>

        {hasAnyClaims && (
          <div
            role="tablist"
            aria-label="Filter claims by status"
            className="mt-6 inline-flex rounded-lg bg-muted p-1"
          >
            <FilterPill
              active={filter === 'ALL'}
              onClick={() => setFilter('ALL')}
              label="All"
              count={counts.all}
            />
            <FilterPill
              active={filter === 'ACTIVE'}
              onClick={() => setFilter('ACTIVE')}
              label="Active"
              count={counts.active}
            />
            <FilterPill
              active={filter === 'CLOSED'}
              onClick={() => setFilter('CLOSED')}
              label="Closed"
              count={counts.closed}
            />
          </div>
        )}

        <div className="mt-4">
          {!hasAnyClaims ? (
            <EmptyState
              title="No claims yet"
              description="Submit your first windshield damage claim to get started."
              showCta
              onSubmit={() => navigate('/customer/claims/new')}
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              title={
                filter === 'ACTIVE'
                  ? 'No active claims'
                  : 'No closed claims'
              }
              description={
                filter === 'ACTIVE'
                  ? "You don't have any claims currently in progress."
                  : "You don't have any completed or cancelled claims yet."
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-160 text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-foreground">
                    <th className="py-3 pr-4 font-semibold">Reference No.</th>
                    <th className="py-3 pr-4 font-semibold">Submitted</th>
                    <th className="py-3 pr-4 font-semibold">Vehicle</th>
                    <th className="py-3 pr-4 font-semibold">Status</th>
                    <th className="py-3 pr-4 font-semibold sr-only">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((claim) => (
                    <tr
                      key={claim.referenceNo}
                      className="border-b border-border/60 last:border-b-0"
                    >
                      <td className="py-4 pr-4">
                        <Link
                          to={`/customer/claims/${claim.referenceNo}`}
                          className="font-medium text-foreground underline-offset-2 hover:underline"
                        >
                          {claim.referenceNo}
                        </Link>
                      </td>
                      <td className="py-4 pr-4 text-foreground">
                        {formatDate(claim.submittedAt)}
                      </td>
                      <td className="py-4 pr-4 text-foreground">
                        {claim.vehicleLabel}
                      </td>
                      <td className="py-4 pr-4">
                        <CustomerStatusBadge status={claim.status} />
                      </td>
                      <td className="py-4 pr-4 text-right">
                        <Link
                          to={`/customer/claims/${claim.referenceNo}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'rounded-md px-4 py-1.5 text-sm transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        active
          ? 'bg-primary font-semibold text-primary-foreground shadow-sm'
          : 'font-medium text-muted-foreground hover:bg-background hover:text-foreground',
      )}
    >
      {label}
      <span
        className={cn(
          'ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
          active
            ? 'bg-primary-foreground/20 text-primary-foreground'
            : 'bg-background text-muted-foreground',
        )}
      >
        {count}
      </span>
    </button>
  );
}

function EmptyState({
  title,
  description,
  showCta,
  onSubmit,
}: {
  title: string;
  description: string;
  showCta?: boolean;
  onSubmit?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border bg-background py-12 text-center">
      <svg
        className="size-10 text-muted-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
      <div>
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {showCta && onSubmit && (
        <Button onClick={onSubmit} className="mt-2">
          Submit New Claim
        </Button>
      )}
    </div>
  );
}
