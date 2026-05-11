import { cn } from '../../utils/cn';

export interface StepDefinition {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: StepDefinition[];
  currentStep: number; // 0-based index
  onStepClick?: (index: number) => void;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  className,
}: StepperProps) {
  const safeIndex = Math.max(0, Math.min(currentStep, steps.length - 1));
  const progressPercent =
    steps.length <= 1 ? 100 : (safeIndex / (steps.length - 1)) * 100;

  return (
    <div className={cn('w-full', className)}>
      {/* Step header row */}
      <ol className="grid w-full" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((step, index) => {
          const status: 'complete' | 'current' | 'upcoming' =
            index < safeIndex
              ? 'complete'
              : index === safeIndex
                ? 'current'
                : 'upcoming';

          const canNavigate = onStepClick && index <= safeIndex;

          return (
            <li
              key={step.label}
              className="relative flex flex-col items-center text-center"
            >
              {/* Connecting line from the previous circle */}
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute top-[18px] h-0.5 -translate-y-1/2',
                    'left-[calc(-50%+18px)] right-[calc(50%+18px)]',
                    index <= safeIndex ? 'bg-primary' : 'bg-border',
                  )}
                />
              )}
              <button
                type="button"
                onClick={canNavigate ? () => onStepClick(index) : undefined}
                disabled={!canNavigate}
                aria-current={status === 'current' ? 'step' : undefined}
                aria-label={`Step ${index + 1}: ${step.label}`}
                className={cn(
                  'flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                  status === 'complete' &&
                    'border-primary bg-primary text-primary-foreground',
                  status === 'current' &&
                    'border-primary bg-primary text-primary-foreground shadow-md',
                  status === 'upcoming' &&
                    'border-border bg-background text-muted-foreground',
                  canNavigate
                    ? 'hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                    : 'cursor-default',
                )}
              >
                {status === 'complete' ? (
                  <svg
                    className="size-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </button>

              <div className="mt-2 px-1">
                <p
                  className={cn(
                    'text-sm font-semibold',
                    status === 'upcoming'
                      ? 'text-muted-foreground'
                      : 'text-foreground',
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
                    {step.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
