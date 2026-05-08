import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { STATUS_ORDER, statusLabel } from '../../../components/ui/StatusBadge';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { ClaimsTable } from '../components/ClaimsTable';
import { CommunicationModal } from '../components/CommunicationModal';
import { mockClaims } from '../data/mockClaims';
import type { ClaimStatus } from '../types/claim.types';

type FilterValue = 'ALL' | ClaimStatus;

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function ClaimsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterValue>('ALL');
  const [chatControlNo, setChatControlNo] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search, 300);

  const chatClaim = chatControlNo
    ? mockClaims.find((c) => c.controlNo === chatControlNo) ?? null
    : null;

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    const digitTerm = digitsOnly(term);

    return mockClaims.filter((claim) => {
      if (filter !== 'ALL' && claim.status !== filter) return false;
      if (!term) return true;

      const haystack = [
        claim.shopName,
        claim.customerFirstName,
        claim.customerLastName,
        claim.phone,
        statusLabel(claim.status),
        claim.controlNo,
        claim.carrier,
      ]
        .join(' ')
        .toLowerCase();

      if (haystack.includes(term)) return true;

      // Phone-format-agnostic match: "555-2" → "5552" matches "(555) 234-5678"
      if (digitTerm.length >= 2) {
        const phoneDigits = digitsOnly(claim.phone);
        if (phoneDigits.includes(digitTerm)) return true;
      }

      return false;
    });
  }, [debouncedSearch, filter]);

  return (
    <div className="rounded-lg bg-card p-6 shadow-sm">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-xl font-semibold text-foreground">
          Claims Management
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            leftIcon={
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            }
            onClick={() => navigate('/call-center/batched-invoices')}
          >
            Batched Invoices
          </Button>
          <Button
            leftIcon={
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            }
            onClick={() => navigate('/call-center/claims/new')}
          >
            New Claim
          </Button>
        </div>
      </header>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search by Shop Name, Customer Name, Phone Number, or Status..."
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
        <div className="lg:w-48">
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterValue)}
            aria-label="Filter by status"
          >
            <option value="ALL">All</option>
            {STATUS_ORDER.map((status) => (
              <option key={status} value={status}>
                {statusLabel(status)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-6">
        <ClaimsTable claims={filtered} onOpenChat={setChatControlNo} />
      </div>

      <CommunicationModal
        isOpen={chatControlNo !== null}
        onClose={() => setChatControlNo(null)}
        controlNo={chatClaim?.controlNo ?? null}
        workshopName={chatClaim?.shopName ?? null}
      />
    </div>
  );
}
