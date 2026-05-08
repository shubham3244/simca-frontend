import { KpiCard } from '../../../components/ui/KpiCard';
import { AgentQueueTable } from '../components/AgentQueueTable';
import { ClaimsAtRiskCard } from '../components/ClaimsAtRiskCard';
import { mockDashboard } from '../data/mockDashboard';

export function DashboardPage() {
  const { sla, responseTime, claimsAtRisk, agentQueue } = mockDashboard;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <KpiCard
          title="SLA Compliance"
          icon={
            <svg className="size-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
        >
          <p className="text-4xl font-bold text-foreground">
            {sla.percentage.toFixed(1)}%
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {sla.weeklyChange >= 0 ? '+' : ''}
            {sla.weeklyChange.toFixed(1)}% from last week
          </p>
        </KpiCard>

        <KpiCard
          title="Average Response Time"
          icon={
            <svg className="size-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        >
          <p className="text-4xl font-bold text-foreground">
            {responseTime.hours.toFixed(1)}h
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Target: {responseTime.targetHours.toFixed(1)}h
          </p>
        </KpiCard>

        <ClaimsAtRiskCard items={claimsAtRisk} />
      </div>

      <AgentQueueTable agents={agentQueue} />
    </div>
  );
}
