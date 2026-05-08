import { ProgressBar } from '../../../components/ui/ProgressBar';
import { cn } from '../../../utils/cn';
import type { AgentQueueEntry } from '../types/dashboard.types';

interface AgentQueueTableProps {
  agents: AgentQueueEntry[];
}

function pendingColor(pending: number): string {
  if (pending >= 6) return 'text-red-600';
  if (pending >= 3) return 'text-orange-600';
  return 'text-emerald-600';
}

export function AgentQueueTable({ agents }: AgentQueueTableProps) {
  return (
    <section className="rounded-lg bg-card p-6 shadow-sm">
      <h2 className="text-base font-medium text-foreground">
        Agent Queue Management
      </h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-160 text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="py-3 pr-4 font-medium">Agent Name</th>
              <th className="py-3 pr-4 font-medium">Assigned Claims</th>
              <th className="py-3 pr-4 font-medium">Pending</th>
              <th className="py-3 pr-4 font-medium">Avg Processing Time</th>
              <th className="py-3 pr-4 font-medium">SLA Compliance</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr
                key={agent.agentName}
                className="border-b border-border/60 last:border-b-0"
              >
                <td className="py-4 pr-4 font-medium text-foreground">
                  {agent.agentName}
                </td>
                <td className="py-4 pr-4 text-foreground">
                  {agent.assignedClaims}
                </td>
                <td
                  className={cn(
                    'py-4 pr-4 font-semibold',
                    pendingColor(agent.pending),
                  )}
                >
                  {agent.pending}
                </td>
                <td className="py-4 pr-4 text-foreground">
                  {agent.avgProcessingHours}h
                </td>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <ProgressBar
                      value={agent.slaCompliancePercent}
                      className="max-w-40"
                      ariaLabel={`SLA compliance ${agent.slaCompliancePercent}%`}
                    />
                    <span className="w-10 shrink-0 text-right text-foreground">
                      {agent.slaCompliancePercent}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
