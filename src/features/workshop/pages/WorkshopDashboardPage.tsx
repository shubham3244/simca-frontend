import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { KpiCard } from '../../../components/ui/KpiCard';
import { cn } from '../../../utils/cn';
import { mockWorkshopStats } from '../data/mockWorkOrders';

export function WorkshopDashboardPage() {
  const navigate = useNavigate();
  const stats = mockWorkshopStats;

  const goWithFilter = (status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') =>
    navigate(`/workshop/work-orders?status=${status}`);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <ClickableKpi
        title="Pending Jobs"
        icon={<ClockIcon className="text-amber-600" />}
        value={stats.pendingJobs}
        subtitle="Awaiting start"
        onClick={() => goWithFilter('PENDING')}
      />
      <ClickableKpi
        title="In Progress"
        icon={<WrenchIcon className="text-blue-600" />}
        value={stats.inProgressJobs}
        subtitle="Currently working"
        onClick={() => goWithFilter('IN_PROGRESS')}
      />
      <ClickableKpi
        title="Completed Today"
        icon={<CheckIcon className="text-emerald-600" />}
        value={stats.completedToday}
        subtitle="Finished jobs"
        onClick={() => goWithFilter('COMPLETED')}
      />
    </div>
  );
}

function ClickableKpi({
  title,
  icon,
  value,
  subtitle,
  onClick,
}: {
  title: string;
  icon: ReactNode;
  value: number;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${title}: ${value} — ${subtitle}. Click to view list.`}
      className={cn(
        'text-left transition-transform hover:-translate-y-0.5 hover:shadow-md',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'rounded-lg',
      )}
    >
      <KpiCard title={title} icon={icon}>
        <p className="text-4xl font-bold text-foreground">{value}</p>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </KpiCard>
    </button>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('size-5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('size-5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('size-5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}
