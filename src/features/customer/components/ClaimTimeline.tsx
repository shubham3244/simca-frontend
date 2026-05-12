import { cn } from '../../../utils/cn';
import type { CustomerClaimStatus } from '../types/customer-claim.types';

interface TimelineStep {
  key: CustomerClaimStatus;
  label: string;
  description: string;
}

const STEPS: TimelineStep[] = [
  {
    key: 'SUBMITTED',
    label: 'Submitted',
    description: 'We received your claim and will review it shortly.',
  },
  {
    key: 'IN_PROGRESS',
    label: 'In Progress',
    description: 'Your claim is being reviewed or repaired by a workshop.',
  },
  {
    key: 'COMPLETED',
    label: 'Completed',
    description: 'Repair finished. Your claim is closed.',
  },
];

const STATUS_INDEX: Record<CustomerClaimStatus, number> = {
  SUBMITTED: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
  CANCELLED: -1,
};

export function ClaimTimeline({ status }: { status: CustomerClaimStatus }) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-900">
        <svg
          className="mt-0.5 size-5 shrink-0 text-red-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <div>
          <p className="font-semibold">This claim was cancelled.</p>
          <p className="mt-0.5 text-red-800">
            If this was a mistake, please submit a new claim or contact support.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_INDEX[status];

  return (
    <ol className="flex flex-col">
      {STEPS.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === STEPS.length - 1;
        const filled = isComplete || isCurrent;

        return (
          <li key={step.key} className="flex gap-4">
            {/* Marker column */}
            <div className="flex flex-col items-center">
              <div
                aria-hidden="true"
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full border-2',
                  filled
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground',
                )}
              >
                {isComplete ? (
                  <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-xs font-semibold">{index + 1}</span>
                )}
              </div>
              {!isLast && (
                <div
                  aria-hidden="true"
                  className={cn(
                    'w-0.5 flex-1 min-h-8',
                    isComplete ? 'bg-primary' : 'bg-border',
                  )}
                />
              )}
            </div>

            {/* Text */}
            <div className={cn('flex-1 pb-6', isLast && 'pb-0')}>
              <p
                className={cn(
                  'text-base font-semibold',
                  isCurrent ? 'text-primary' : 'text-foreground',
                )}
              >
                {step.label}
                {isCurrent && (
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Current
                  </span>
                )}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
