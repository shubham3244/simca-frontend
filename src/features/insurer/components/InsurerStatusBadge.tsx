import { cn } from '../../../utils/cn';
import type { InsurerClaimStatus } from '../types/insurer-claim.types';

interface StatusStyle {
  label: string;
  className: string;
}

const STATUS_STYLES: Record<InsurerClaimStatus, StatusStyle> = {
  PENDING_REVIEW: {
    label: 'Pending Review',
    className: 'bg-amber-100 text-amber-800',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-blue-100 text-blue-800',
  },
  APPROVED: {
    label: 'Approved',
    className: 'bg-emerald-100 text-emerald-800',
  },
};

export function InsurerStatusBadge({
  status,
  className,
}: {
  status: InsurerClaimStatus;
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

export function insurerStatusLabel(status: InsurerClaimStatus): string {
  return STATUS_STYLES[status].label;
}
