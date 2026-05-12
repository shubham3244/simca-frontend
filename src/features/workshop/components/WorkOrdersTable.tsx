import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Input } from '../../../components/ui/Input';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { cn } from '../../../utils/cn';
import { formatDate } from '../../../utils/format';
import { mockWorkOrders } from '../data/mockWorkOrders';
import { WorkshopStatusBadge } from './WorkshopStatusBadge';
import type {
  WorkOrderSummary,
  WorkshopJobStatus,
} from '../types/workshop.types';

type FilterValue = 'ALL' | WorkshopJobStatus;

function isFilterValue(s: string | null): s is FilterValue {
  return s === 'ALL' || s === 'PENDING' || s === 'IN_PROGRESS' || s === 'COMPLETED';
}

function matchesSearch(wo: WorkOrderSummary, term: string): boolean {
  if (!term) return true;
  const haystack = [
    wo.workOrderNo,
    wo.carrier,
    wo.customerName,
    wo.vehicleLabel,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(term);
}

interface WorkOrdersTableProps {
  onOpenChat?: (workOrderNo: string) => void;
}

export function WorkOrdersTable({ onOpenChat }: WorkOrdersTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = isFilterValue(searchParams.get('status'))
    ? (searchParams.get('status') as FilterValue)
    : 'ALL';

  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [filter, setFilter] = useState<FilterValue>(initialStatus);
  const debouncedSearch = useDebouncedValue(search, 300);

  // Keep URL in sync with filter selection (so dashboard deep-links work)
  useEffect(() => {
    if (filter === 'ALL') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', filter);
    }
    setSearchParams(searchParams, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const counts = useMemo(() => {
    return {
      ALL: mockWorkOrders.length,
      PENDING: mockWorkOrders.filter((w) => w.status === 'PENDING').length,
      IN_PROGRESS: mockWorkOrders.filter((w) => w.status === 'IN_PROGRESS').length,
      COMPLETED: mockWorkOrders.filter((w) => w.status === 'COMPLETED').length,
    };
  }, []);

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return mockWorkOrders.filter((wo) => {
      if (filter !== 'ALL' && wo.status !== filter) return false;
      if (date && wo.date !== date) return false;
      return matchesSearch(wo, term);
    });
  }, [debouncedSearch, date, filter]);

  return (
    <section className="rounded-xl bg-card p-6">
      <header>
        <h2 className="text-lg font-semibold text-foreground">Work Orders</h2>
      </header>

      <div className="mt-4">
        <Input
          type="search"
          placeholder="Search by Work Order #, Carrier, Customer, or Vehicle..."
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

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-9 rounded-md border border-border bg-input-background px-3 text-sm"
          />
        </label>

        <div
          role="tablist"
          aria-label="Filter by status"
          className="flex flex-wrap gap-2"
        >
          <FilterPill
            active={filter === 'ALL'}
            onClick={() => setFilter('ALL')}
            label="All"
            count={counts.ALL}
          />
          <FilterPill
            active={filter === 'PENDING'}
            onClick={() => setFilter('PENDING')}
            label="Pending"
            count={counts.PENDING}
          />
          <FilterPill
            active={filter === 'IN_PROGRESS'}
            onClick={() => setFilter('IN_PROGRESS')}
            label="In Progress"
            count={counts.IN_PROGRESS}
          />
          <FilterPill
            active={filter === 'COMPLETED'}
            onClick={() => setFilter('COMPLETED')}
            label="Completed"
            count={counts.COMPLETED}
          />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-240 text-sm">
          <thead>
            <tr className="border-b border-border text-left text-foreground">
              <th className="py-3 pr-4 font-semibold">Work Order #</th>
              <th className="py-3 pr-4 font-semibold">Carrier/Insurer</th>
              <th className="py-3 pr-4 font-semibold">Customer</th>
              <th className="py-3 pr-4 font-semibold">Vehicle</th>
              <th className="py-3 pr-4 font-semibold">Date</th>
              <th className="py-3 pr-4 font-semibold">Status</th>
              <th className="py-3 pr-4 font-semibold">Chat/Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                  No work orders match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((wo) => (
                <tr
                  key={wo.workOrderNo}
                  className="border-b border-border/60 last:border-b-0"
                >
                  <td className="py-4 pr-4">
                    <Link
                      to={`/workshop/work-orders/${wo.workOrderNo}`}
                      className="font-medium text-foreground underline-offset-2 hover:underline"
                    >
                      {wo.workOrderNo}
                    </Link>
                  </td>
                  <td className="py-4 pr-4 text-foreground">{wo.carrier}</td>
                  <td className="py-4 pr-4 text-foreground">{wo.customerName}</td>
                  <td className="py-4 pr-4 text-foreground">{wo.vehicleLabel}</td>
                  <td className="py-4 pr-4 text-foreground">{formatDate(wo.date)}</td>
                  <td className="py-4 pr-4">
                    <WorkshopStatusBadge status={wo.status} />
                  </td>
                  <td className="py-4 pr-4">
                    <button
                      type="button"
                      onClick={() => onOpenChat?.(wo.workOrderNo)}
                      aria-label={`Open chat for ${wo.workOrderNo}`}
                      className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
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
