import { useState } from 'react';
import { logPiiReveal } from '../../lib/telemetry/securityLog';
import { cn } from '../../utils/cn';

interface MaskedFieldProps {
  /** Raw, unmasked value. */
  value: string;
  /** Mask function (e.g. maskPhone, maskEmail). */
  mask: (raw: string) => string;
  /**
   * Field name used in audit log + aria-label.
   * Should be short and human-readable: "phone", "email", "VIN".
   */
  fieldName: string;
  /**
   * Optional resource identifier for the audit log
   * (e.g. "claim WC-2024-001").
   */
  resourceId?: string;
  /** Set false to hide the reveal toggle entirely (e.g. card numbers). */
  revealable?: boolean;
  className?: string;
}

/**
 * Renders a PII value masked by default with a reveal toggle.
 *
 * Wired to `logPiiReveal` so every reveal is captured for the audit trail —
 * required by `security-pii.md §6.1` and `§11.1`.
 */
export function MaskedField({
  value,
  mask,
  fieldName,
  resourceId,
  revealable = true,
  className,
}: MaskedFieldProps) {
  const [revealed, setRevealed] = useState(false);

  const handleToggle = () => {
    if (!revealed) {
      logPiiReveal({ field: fieldName, resourceId });
    }
    setRevealed((r) => !r);
  };

  const display = revealed ? value : mask(value);
  const toggleLabel = revealed
    ? `Hide ${fieldName}${resourceId ? ` for ${resourceId}` : ''}`
    : `Show ${fieldName}${resourceId ? ` for ${resourceId}` : ''}`;

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span>{display}</span>
      {revealable && (
        <button
          type="button"
          onClick={handleToggle}
          aria-label={toggleLabel}
          aria-pressed={revealed}
          className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          {revealed ? (
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      )}
    </span>
  );
}
