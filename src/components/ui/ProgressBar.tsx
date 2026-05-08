import { cn } from '../../utils/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  fillClassName?: string;
  ariaLabel?: string;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  fillClassName,
  ariaLabel,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percent = max === 0 ? 0 : (clamped / max) * 100;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      aria-label={ariaLabel}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}
    >
      <div
        className={cn('h-full rounded-full bg-primary', fillClassName)}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
