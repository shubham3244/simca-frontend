/**
 * Security telemetry — emits structured events for security-sensitive actions
 * (PII reveals, auth events, authz failures, etc.).
 *
 * Required by `security-pii.md §11.1`:
 *   "All PII reveal actions (if implemented): which record, which field, which user"
 *
 * For now this logs to console in dev. When the backend audit-log endpoint is
 * ready, swap the implementation to POST to it.
 */

export interface PiiRevealEvent {
  field: string;
  resourceId?: string;
}

export function logPiiReveal(event: PiiRevealEvent): void {
  const payload = {
    type: 'pii_reveal',
    timestamp: new Date().toISOString(),
    ...event,
  };

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info('[security]', payload);
  }

  // TODO: POST to /security-events when backend endpoint exists.
  //  Per frontend.md §11: structured logs, no PII *values* in payload — we
  //  only log that a reveal happened, not the revealed value itself.
}
