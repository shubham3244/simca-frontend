import type { ClaimAtRisk } from '../types/dashboard.types';

interface ClaimsAtRiskCardProps {
  items: ClaimAtRisk[];
}

export function ClaimsAtRiskCard({ items }: ClaimsAtRiskCardProps) {
  return (
    <section className="rounded-lg bg-card p-6 shadow-sm">
      <header className="flex items-start justify-between gap-4">
        <h2 className="text-base font-medium text-foreground">Claims at Risk</h2>
        <svg
          className="size-5 text-destructive"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </header>

      <ul className="mt-4 flex flex-col gap-2">
        {items.map((claim) => (
          <li
            key={claim.controlNo}
            className="flex items-center justify-between rounded-md bg-red-50 px-3 py-2"
          >
            <span className="text-sm font-medium text-foreground">
              {claim.controlNo}
            </span>
            <span className="text-sm font-semibold text-red-700">
              {claim.hoursRemaining}h remaining
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs text-muted-foreground">
        Approaching SLA deadline
      </p>
    </section>
  );
}
