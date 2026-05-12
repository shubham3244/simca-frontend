import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { useConfirm } from '../../../components/ui/ConfirmDialog';
import { Field } from '../../../components/ui/Field';
import { MaskedField } from '../../../components/ui/MaskedField';
import { Modal } from '../../../components/ui/Modal';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { Textarea } from '../../../components/ui/Textarea';
import { maskEmail, maskLicence, maskPhone, maskVin } from '../../../lib/pii/mask';
import { cn } from '../../../utils/cn';
import { formatChatTimestamp, formatCurrency, formatDate } from '../../../utils/format';
import { insurerStatusLabel } from './InsurerStatusBadge';
import type {
  AuditActor,
  AuditEntry,
  InsurerClaimDetail,
} from '../types/insurer-claim.types';

type TabValue = 'details' | 'customer' | 'financial' | 'audit';

interface InsurerClaimDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim: InsurerClaimDetail | null;
  onApprove: (claimId: string) => void;
  onRequestMoreInfo: (claimId: string, note: string) => void;
  onAddNote: (claimId: string, note: string) => void;
}

export function InsurerClaimDetailModal({
  isOpen,
  onClose,
  claim,
  onApprove,
  onRequestMoreInfo,
  onAddNote,
}: InsurerClaimDetailModalProps) {
  const [tab, setTab] = useState<TabValue>('details');
  const confirm = useConfirm();

  if (!claim) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Claim Details" maxWidth="xl">
        <div className="p-6 text-sm text-muted-foreground">Loading…</div>
      </Modal>
    );
  }

  const handleApprove = async () => {
    const ok = await confirm({
      title: 'Approve this claim?',
      message: (
        <>
          You are about to approve <strong>{formatCurrency(claim.totalAmount)}</strong> for
          claim <strong>{claim.claimId}</strong> ({claim.customerFullName}). The
          workshop will be notified for payment.
        </>
      ),
      confirmLabel: 'Approve Claim',
      cancelLabel: 'Cancel',
    });
    if (!ok) return;
    onApprove(claim.claimId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Claim Details - ${claim.claimId}`}
      maxWidth="xl"
    >
      <div className="flex flex-col overflow-hidden">
        <div className="border-b border-border px-5 pb-4 pt-4">
          <Tabs<TabValue> value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="customer">Customer Info</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="audit">Audit Log</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-5">
          {tab === 'details' && (
            <DetailsTab
              claim={claim}
              onApprove={handleApprove}
              onRequestMoreInfo={(note) => {
                onRequestMoreInfo(claim.claimId, note);
                onClose();
              }}
            />
          )}
          {tab === 'customer' && <CustomerTab claim={claim} />}
          {tab === 'financial' && <FinancialTab claim={claim} />}
          {tab === 'audit' && (
            <AuditTab
              claim={claim}
              onAddNote={(note) => onAddNote(claim.claimId, note)}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Tabs
// ────────────────────────────────────────────────────────────────────────────

function DetailsTab({
  claim,
  onApprove,
  onRequestMoreInfo,
}: {
  claim: InsurerClaimDetail;
  onApprove: () => void;
  onRequestMoreInfo: (note: string) => void;
}) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [note, setNote] = useState('');

  const isApproved = claim.status === 'APPROVED';

  return (
    <div className="flex flex-col gap-5">
      <Section title="Claim Information">
        <FieldGrid>
          <Field label="Claim ID">{claim.claimId}</Field>
          <Field label="Policy Number">{claim.policyNumber}</Field>
          <Field label="Date of Loss">{formatDate(claim.dateOfLoss)}</Field>
          <Field label="Status">{insurerStatusLabel(claim.status)}</Field>
        </FieldGrid>
      </Section>

      <Section title="Vehicle Information">
        <FieldGrid>
          <Field label="Vehicle">{claim.vehicle.label}</Field>
          <Field label="VIN">
            <MaskedField
              value={claim.vehicle.vin}
              mask={maskVin}
              fieldName="VIN"
              resourceId={claim.claimId}
            />
          </Field>
          <Field label="Odometer">{claim.vehicle.odometerKm.toLocaleString()} km</Field>
          <Field label="Color">{claim.vehicle.color}</Field>
        </FieldGrid>
      </Section>

      <Section title="Damage Description">
        <p className="text-sm leading-relaxed text-foreground">
          {claim.damageDescription}
        </p>
      </Section>

      {isApproved ? (
        <ApprovedBanner
          approvedAt={claim.approvedAt}
          approvedBy={claim.approvedBy}
        />
      ) : !showRequestForm ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button variant="outline" onClick={() => setShowRequestForm(true)}>
            Request Additional Info
          </Button>
          <Button
            onClick={onApprove}
            className="bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:ring-emerald-600"
            leftIcon={
              <svg className="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            }
          >
            Approve Claim
          </Button>
        </div>
      ) : (
        <div className="rounded-md border border-border bg-background p-4">
          <h3 className="text-sm font-semibold text-foreground">
            Request Additional Information
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            This note will be sent to the Call Center agent for follow-up.
          </p>
          <div className="mt-3">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What additional information do you need?"
              rows={3}
            />
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowRequestForm(false);
                setNote('');
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={note.trim().length === 0}
              onClick={() => onRequestMoreInfo(note.trim())}
            >
              Send Request
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ApprovedBanner({
  approvedAt,
  approvedBy,
}: {
  approvedAt?: string;
  approvedBy?: string;
}) {
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-md border border-emerald-300 bg-emerald-50 p-4"
    >
      <svg
        className="mt-0.5 size-5 shrink-0 text-emerald-700"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      <div>
        <p className="text-sm font-semibold text-emerald-900">
          Claim approved — payment authorized
        </p>
        <p className="mt-1 text-xs text-emerald-800">
          {approvedBy && (
            <>
              Approved by <strong>{approvedBy}</strong>
            </>
          )}
          {approvedBy && approvedAt && ' on '}
          {approvedAt && formatChatTimestamp(approvedAt)}
          {!approvedBy && !approvedAt && 'This claim has been approved.'}
        </p>
      </div>
    </div>
  );
}

function CustomerTab({ claim }: { claim: InsurerClaimDetail }) {
  return (
    <Section title="Customer Information">
      <FieldGrid>
        <Field label="Full Name">{claim.customer.fullName}</Field>
        <Field label="Email">
          <MaskedField
            value={claim.customer.email}
            mask={maskEmail}
            fieldName="email"
            resourceId={claim.claimId}
          />
        </Field>
        <Field label="Phone">
          <MaskedField
            value={claim.customer.phone}
            mask={maskPhone}
            fieldName="phone"
            resourceId={claim.claimId}
          />
        </Field>
        <Field label="Driver's License">
          <MaskedField
            value={claim.customer.driverLicense}
            mask={maskLicence}
            fieldName="driver's license"
            resourceId={claim.claimId}
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Address">{claim.customer.address}</Field>
        </div>
      </FieldGrid>
    </Section>
  );
}

function FinancialTab({ claim }: { claim: InsurerClaimDetail }) {
  return (
    <div className="flex flex-col gap-5">
      <Section title="Financial Breakdown">
        <ul className="flex flex-col">
          {claim.lines.map((line) => (
            <li
              key={line.label}
              className="flex items-center justify-between border-b border-border/60 py-3 last:border-b-0"
            >
              <span className="text-sm text-foreground">{line.label}</span>
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(line.amount)}
              </span>
            </li>
          ))}
          <li className="flex items-center justify-between border-b border-border py-3">
            <span className="text-sm font-semibold text-foreground">Subtotal</span>
            <span className="text-sm font-bold text-foreground">
              {formatCurrency(claim.subtotal)}
            </span>
          </li>
          <li className="flex items-center justify-between border-b border-border py-3">
            <span className="text-sm font-semibold text-foreground">Deductible</span>
            <span className="text-sm font-bold text-destructive">
              -{formatCurrency(claim.deductible)}
            </span>
          </li>
          <li className="flex items-center justify-between py-3">
            <span className="text-base font-bold text-foreground">Total Claim Amount</span>
            <span className="text-base font-bold text-foreground">
              {formatCurrency(claim.totalAmount)}
            </span>
          </li>
        </ul>
      </Section>

      <Section title="Payment Information">
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Payment Method</dt>
            <dd className="font-medium text-foreground">{claim.paymentMethod}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Workshop</dt>
            <dd className="font-medium text-foreground">{claim.workshop}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Payment Status</dt>
            <dd>
              <PaymentStatusBadge status={claim.paymentStatus} />
            </dd>
          </div>
        </dl>
      </Section>
    </div>
  );
}

function AuditTab({
  claim,
  onAddNote,
}: {
  claim: InsurerClaimDetail;
  onAddNote: (note: string) => void;
}) {
  const [note, setNote] = useState('');

  const handleAdd = () => {
    const trimmed = note.trim();
    if (!trimmed) return;
    onAddNote(trimmed);
    setNote('');
  };

  return (
    <div className="flex flex-col gap-5">
      <Section title="Audit Trail">
        {claim.auditLog.length === 0 ? (
          <p className="text-sm text-muted-foreground">No audit entries yet.</p>
        ) : (
          <ol className="flex flex-col gap-3">
            {claim.auditLog.map((entry) => (
              <li
                key={entry.id}
                className="grid grid-cols-1 gap-1 border-b border-border/60 pb-3 last:border-b-0 last:pb-0 sm:grid-cols-[180px_1fr] sm:gap-4"
              >
                <time
                  dateTime={entry.timestamp}
                  className="text-xs text-muted-foreground sm:text-sm"
                >
                  {formatChatTimestamp(entry.timestamp)}
                </time>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {entry.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatActor(entry.actor)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Section>

      <Section title="Add Note">
        <p className="text-xs text-muted-foreground">
          Internal note — visible to TAG Network only.
        </p>
        <div className="mt-3">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note to the claim audit log…"
            rows={3}
          />
        </div>
        <div className="mt-3 flex justify-end">
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={note.trim().length === 0}
          >
            Add Note
          </Button>
        </div>
      </Section>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md bg-secondary p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return (
    <dl className="grid grid-cols-1 gap-y-4 gap-x-8 md:grid-cols-2">{children}</dl>
  );
}

function PaymentStatusBadge({
  status,
}: {
  status: InsurerClaimDetail['paymentStatus'];
}) {
  const map = {
    PENDING_APPROVAL: {
      label: 'Pending Approval',
      className: 'bg-amber-100 text-amber-800',
    },
    APPROVED: {
      label: 'Approved',
      className: 'bg-emerald-100 text-emerald-800',
    },
    PAID: {
      label: 'Paid',
      className: 'bg-emerald-100 text-emerald-800',
    },
  } as const;
  const { label, className } = map[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        className,
      )}
    >
      {label}
    </span>
  );
}

function formatActor(actor: AuditActor): string {
  switch (actor.kind) {
    case 'SYSTEM':
      return 'System';
    case 'AGENT':
      return `Agent: ${actor.name}`;
    case 'WORKSHOP':
      return `Workshop: ${actor.name}`;
    case 'INSURER':
      return `Insurer: ${actor.name}`;
  }
}

// Re-export so AuditEntry consumers don't lint-error on unused symbol
export type { AuditEntry };
