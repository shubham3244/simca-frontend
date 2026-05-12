import { useMemo, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { cn } from '../../../utils/cn';
import { formatCurrency, formatDate } from '../../../utils/format';
import { InsurerStatusBadge } from './InsurerStatusBadge';
import type {
  InsurerClaimStatus,
  InsurerClaimSummary,
} from '../types/insurer-claim.types';

type FilterValue = 'ALL' | InsurerClaimStatus;

interface InsurerClaimsTableProps {
  claims: InsurerClaimSummary[];
  onViewDetails: (claimId: string) => void;
  onExport: () => void;
}

function matchesSearch(claim: InsurerClaimSummary, term: string): boolean {
  if (!term) return true;
  const haystack = [
    claim.claimId,
    claim.customerFullName,
    claim.vehicleLabel,
    claim.policyNumber,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(term);
}

export function InsurerClaimsTable({
  claims,
  onViewDetails,
  onExport,
}: InsurerClaimsTableProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterValue>('ALL');
  const debouncedSearch = useDebouncedValue(search, 300);

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return claims.filter((claim) => {
      if (filter !== 'ALL' && claim.status !== filter) return false;
      return matchesSearch(claim, term);
    });
  }, [claims, debouncedSearch, filter]);

  const counts = useMemo(() => {
    return {
      ALL: claims.length,
      PENDING_REVIEW: claims.filter((c) => c.status === 'PENDING_REVIEW').length,
      IN_PROGRESS: claims.filter((c) => c.status === 'IN_PROGRESS').length,
      APPROVED: claims.filter((c) => c.status === 'APPROVED').length,
    };
  }, [claims]);

  return (
    <section className="rounded-xl bg-card p-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Claims Overview
        </h2>
        <Button
          variant="outline"
          onClick={onExport}
          leftIcon={
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          }
        >
          Export
        </Button>
      </header>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="lg:flex-1">
          <Input
            type="search"
            placeholder="Search by claim ID, customer, vehicle, or policy number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            }
          />
        </div>

        <div
          role="tablist"
          aria-label="Filter claims by status"
          className="flex flex-wrap gap-2"
        >
          <FilterPill
            active={filter === 'ALL'}
            onClick={() => setFilter('ALL')}
            label="All"
            count={counts.ALL}
          />
          <FilterPill
            active={filter === 'PENDING_REVIEW'}
            onClick={() => setFilter('PENDING_REVIEW')}
            label="Pending"
            count={counts.PENDING_REVIEW}
          />
          <FilterPill
            active={filter === 'IN_PROGRESS'}
            onClick={() => setFilter('IN_PROGRESS')}
            label="In Progress"
            count={counts.IN_PROGRESS}
          />
          <FilterPill
            active={filter === 'APPROVED'}
            onClick={() => setFilter('APPROVED')}
            label="Approved"
            count={counts.APPROVED}
          />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-240 text-sm">
          <thead>
            <tr className="border-b border-border text-left text-foreground">
              <th className="py-3 pr-4 font-semibold">Claim ID</th>
              <th className="py-3 pr-4 font-semibold">Customer</th>
              <th className="py-3 pr-4 font-semibold">Vehicle</th>
              <th className="py-3 pr-4 font-semibold">Policy No.</th>
              <th className="py-3 pr-4 font-semibold">Date</th>
              <th className="py-3 pr-4 font-semibold">Amount</th>
              <th className="py-3 pr-4 font-semibold">Status</th>
              <th className="py-3 pr-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                  No claims match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((claim) => (
                <tr
                  key={claim.claimId}
                  className="border-b border-border/60 last:border-b-0"
                >
                  <td className="py-4 pr-4 font-medium text-foreground">
                    {claim.claimId}
                  </td>
                  <td className="py-4 pr-4 text-foreground">
                    {claim.customerFullName}
                  </td>
                  <td className="py-4 pr-4 text-foreground">
                    {claim.vehicleLabel}
                  </td>
                  <td className="py-4 pr-4 text-foreground">
                    {claim.policyNumber}
                  </td>
                  <td className="py-4 pr-4 text-foreground">
                    {formatDate(claim.dateOfLoss)}
                  </td>
                  <td className="py-4 pr-4 text-foreground">
                    {formatCurrency(claim.amount)}
                  </td>
                  <td className="py-4 pr-4">
                    <InsurerStatusBadge status={claim.status} />
                  </td>
                  <td className="py-4 pr-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(claim.claimId)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
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
        'rounded-md border px-3 py-1.5 text-sm transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        active
          ? 'border-primary bg-primary font-semibold text-primary-foreground'
          : 'border-border bg-background font-medium text-foreground hover:bg-accent',
      )}
    >
      {label}
      <span
        className={cn(
          'ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
          active
            ? 'bg-primary-foreground/20 text-primary-foreground'
            : 'bg-muted text-muted-foreground',
        )}
      >
        {count}
      </span>
    </button>
  );
}
