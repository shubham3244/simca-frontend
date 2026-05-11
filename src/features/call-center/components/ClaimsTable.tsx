import { Link } from 'react-router-dom';
import { MaskedField } from '../../../components/ui/MaskedField';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { maskPhone } from '../../../lib/pii/mask';
import type { ClaimSummary } from '../types/claim.types';

interface ClaimsTableProps {
  claims: ClaimSummary[];
  onOpenChat?: (controlNo: string) => void;
}

const COLUMNS = [
  'Control No.',
  'Carrier/Insurer',
  'Shop Name',
  'Last Name',
  'First Name',
  'Phone No.',
  'Status',
  'Chat/Notes',
];

export function ClaimsTable({ claims, onOpenChat }: ClaimsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-240 text-sm">
        <thead>
          <tr className="border-b border-border text-left text-foreground">
            {COLUMNS.map((col) => (
              <th key={col} className="py-3 pr-4 font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {claims.length === 0 ? (
            <tr>
              <td
                colSpan={COLUMNS.length}
                className="py-12 text-center text-sm text-muted-foreground"
              >
                No claims match your filters.
              </td>
            </tr>
          ) : (
            claims.map((claim) => (
              <tr
                key={claim.controlNo}
                className="border-b border-border/60 last:border-b-0"
              >
                <td className="py-4 pr-4">
                  <Link
                    to={`/call-center/claims/${claim.controlNo}`}
                    className="font-medium text-foreground underline-offset-2 hover:underline"
                  >
                    {claim.controlNo}
                  </Link>
                </td>
                <td className="py-4 pr-4 text-foreground">{claim.carrier}</td>
                <td className="py-4 pr-4 text-foreground">{claim.shopName}</td>
                <td className="py-4 pr-4 text-foreground">{claim.customerLastName}</td>
                <td className="py-4 pr-4 text-foreground">{claim.customerFirstName}</td>
                <td className="py-4 pr-4 text-foreground">
                  <MaskedField
                    value={claim.phone}
                    mask={maskPhone}
                    fieldName="phone"
                    resourceId={claim.controlNo}
                  />
                </td>
                <td className="py-4 pr-4">
                  <StatusBadge status={claim.status} />
                </td>
                <td className="py-4 pr-4">
                  <button
                    type="button"
                    onClick={() => onOpenChat?.(claim.controlNo)}
                    aria-label={`Open chat for ${claim.controlNo}`}
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
  );
}
