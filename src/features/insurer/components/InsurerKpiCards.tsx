import type { ReactNode } from 'react';
import { KpiCard } from '../../../components/ui/KpiCard';
import { formatCurrency } from '../../../utils/format';
import type { InsurerDashboardStats } from '../types/insurer-claim.types';

interface InsurerKpiCardsProps {
  stats: InsurerDashboardStats;
}

export function InsurerKpiCards({ stats }: InsurerKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard title="Total Claims" icon={<DocumentIcon />}>
        <BigNumber>{stats.totalClaims.toLocaleString()}</BigNumber>
        <SubLabel>{stats.totalClaimsLabel}</SubLabel>
      </KpiCard>

      <KpiCard title="Open Claims" icon={<ClockIcon />}>
        <BigNumber>{stats.openClaims}</BigNumber>
        <SubLabel>{stats.openClaimsLabel}</SubLabel>
      </KpiCard>

      <KpiCard title="Total Amount" icon={<DollarIcon />}>
        <BigNumber>{formatCurrency(stats.totalAmount).replace('.00', '')}</BigNumber>
        <SubLabel>{stats.totalAmountLabel}</SubLabel>
      </KpiCard>

      <KpiCard title="Avg Processing Time" icon={<CheckIcon />}>
        <BigNumber>{stats.avgProcessingDays} days</BigNumber>
        <SubLabel>{stats.avgProcessingLabel}</SubLabel>
      </KpiCard>
    </div>
  );
}

function BigNumber({ children }: { children: ReactNode }) {
  return <p className="text-3xl font-bold text-foreground">{children}</p>;
}

function SubLabel({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-sm text-muted-foreground">{children}</p>;
}

function DocumentIcon() {
  return (
    <svg className="size-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="size-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg className="size-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="size-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}
