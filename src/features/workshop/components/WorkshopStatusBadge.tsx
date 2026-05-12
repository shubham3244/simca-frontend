import { cn } from '../../../utils/cn';
import type { WorkshopJobStatus } from '../types/workshop.types';

interface StatusStyle {
  label: string;
  className: string;
}

const STATUS_STYLES: Record<WorkshopJobStatus, StatusStyle> = {
  PENDING: { label: 'Pending', className: 'bg-amber-100 text-amber-800' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-blue-100 text-blue-800' },
  COMPLETED: { label: 'Completed', className: 'bg-emerald-100 text-emerald-800' },
};

export function WorkshopStatusBadge({
  status,
  className,
}: {
  status: WorkshopJobStatus;
  className?: string;
}) {
  const { label, className: variantClassName } = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        variantClassName,
        className,
      )}
    >
      {label}
    </span>
  );
}

export function workshopStatusLabel(status: WorkshopJobStatus): string {
  return STATUS_STYLES[status].label;
}
