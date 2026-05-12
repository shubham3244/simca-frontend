import { cn } from '../../../utils/cn';
import type { CustomerClaimStatus } from '../types/customer-claim.types';

interface StatusStyle {
  label: string;
  className: string;
}

const STATUS_STYLES: Record<CustomerClaimStatus, StatusStyle> = {
  SUBMITTED: {
    label: 'Submitted',
    className: 'bg-blue-100 text-blue-800',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-amber-100 text-amber-800',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-emerald-100 text-emerald-800',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-800',
  },
};

export function CustomerStatusBadge({
  status,
  className,
}: {
  status: CustomerClaimStatus;
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

export function customerStatusLabel(status: CustomerClaimStatus): string {
  return STATUS_STYLES[status].label;
}
