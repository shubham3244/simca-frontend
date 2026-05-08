import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';
import { formatCurrency } from '../../../utils/format';
import { mockBatches } from '../data/mockBatches';

export function BatchedInvoicesPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <div>
        <Link
          to="/call-center/claims"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Claims
        </Link>
      </div>

      <div className="rounded-lg bg-card p-6 shadow-sm">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-xl font-semibold text-foreground">Batched Invoices</h1>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/call-center/claims')}
              leftIcon={
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              }
            >
              View Claims
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
              leftIcon={
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
              }
            >
              Print
            </Button>
          </div>
        </header>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-160 text-sm">
            <thead>
              <tr className="border-b border-border text-left text-foreground">
                <th className="py-3 pr-4 font-semibold">No.</th>
                <th className="py-3 pr-4 font-semibold">Total</th>
                <th className="py-3 pr-4 font-semibold">Date Created</th>
                <th className="py-3 pr-4 font-semibold">Exported</th>
              </tr>
            </thead>
            <tbody>
              {mockBatches.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    No batched invoices yet.
                  </td>
                </tr>
              ) : (
                mockBatches.map((batch) => (
                  <tr
                    key={batch.batchNo}
                    className="border-b border-border/60 last:border-b-0"
                  >
                    <td className="py-4 pr-4">
                      <Link
                        to={`/call-center/batched-invoices/${batch.batchNo}`}
                        className="font-medium text-foreground underline-offset-2 hover:underline"
                      >
                        {batch.batchNo}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 text-foreground">
                      {formatCurrency(batch.totalAmount)}
                    </td>
                    <td className="py-4 pr-4 text-foreground">
                      {batch.dateCreated}
                    </td>
                    <td className="py-4 pr-4">
                      <ExportedBadge exported={batch.exported} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ExportedBadge({ exported }: { exported: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        exported
          ? 'bg-emerald-100 text-emerald-800'
          : 'bg-amber-100 text-amber-800',
      )}
    >
      {exported ? 'Yes' : 'No'}
    </span>
  );
}
