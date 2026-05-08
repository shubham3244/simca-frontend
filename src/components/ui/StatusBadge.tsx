import { cn } from '../../utils/cn';
import type { ClaimStatus } from '../../features/call-center/types/claim.types';

interface StatusStyle {
  label: string;
  className: string;
}

const STATUS_STYLES: Record<ClaimStatus, StatusStyle> = {
  OPEN: {
    label: 'Open',
    className: 'bg-blue-100 text-blue-800',
  },
  IN_PROCESS: {
    label: 'In Process',
    className: 'bg-amber-100 text-amber-800',
  },
  INVOICED: {
    label: 'Invoiced',
    className: 'bg-purple-100 text-purple-800',
  },
  EXPORTED: {
    label: 'Exported',
    className: 'bg-emerald-100 text-emerald-800',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-800',
  },
  CREDITED: {
    label: 'Credited',
    className: 'bg-orange-100 text-orange-800',
  },
  CREDITED_EXPORTED: {
    label: 'Credited+Exported',
    className: 'bg-teal-100 text-teal-800',
  },
};

interface StatusBadgeProps {
  status: ClaimStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
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

export const STATUS_ORDER: ClaimStatus[] = [
  'OPEN',
  'IN_PROCESS',
  'INVOICED',
  'EXPORTED',
  'CANCELLED',
  'CREDITED',
  'CREDITED_EXPORTED',
];

export function statusLabel(status: ClaimStatus): string {
  return STATUS_STYLES[status].label;
}
