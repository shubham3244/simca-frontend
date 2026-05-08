import type { ReactNode } from 'react';
import { Button } from '../../../components/ui/Button';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { cn } from '../../../utils/cn';
import { formatCurrency, formatDate, formatYesNo } from '../../../utils/format';
import type {
  ClaimDetail,
  RecommendedPartStatus,
} from '../types/claim-detail.types';

interface ClaimInfoTabProps {
  claim: ClaimDetail;
  onRequestMoreInfo?: () => void;
  onApproveRecommendations?: () => void;
}

export function ClaimInfoTab({
  claim,
  onRequestMoreInfo,
  onApproveRecommendations,
}: ClaimInfoTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <ClaimInformationSection claim={claim} />
      <CustomerInformationSection customer={claim.customer} />
      <VehicleInformationSection vehicle={claim.vehicle} />
      <WorkOrderNotesSection notes={claim.workOrderNotes} />
      <ConfidenceScoreSection score={claim.confidenceScore} />
      <RecommendedPartsSection
        parts={claim.recommendedParts}
        pendingAudit={claim.pendingCsrAudit}
        onRequestMoreInfo={onRequestMoreInfo}
        onApproveRecommendations={onApproveRecommendations}
      />
    </div>
  );
}

function Section({
  title,
  rightSlot,
  children,
}: {
  title: string;
  rightSlot?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg bg-secondary p-6">
      <header className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {rightSlot}
      </header>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function FieldGrid({
  columns = 3,
  children,
}: {
  columns?: 2 | 3;
  children: ReactNode;
}) {
  return (
    <dl
      className={cn(
        'grid grid-cols-1 gap-y-5 gap-x-8',
        columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2',
      )}
    >
      {children}
    </dl>
  );
}

function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-base font-semibold text-foreground">{children}</dd>
    </div>
  );
}

function ClaimInformationSection({ claim }: { claim: ClaimDetail }) {
  return (
    <Section title="Claim Information">
      <FieldGrid>
        <FieldRow label="Control Number">{claim.controlNo}</FieldRow>
        <FieldRow label="Status">{claim.status.replace('_', ' ')}</FieldRow>
        <FieldRow label="Source">{claim.source}</FieldRow>

        <FieldRow label="Carrier/Insurance Company">{claim.carrier}</FieldRow>
        <FieldRow label="Workshop/Shop">{claim.workshopName}</FieldRow>
        <FieldRow label="Claim Number">{claim.claimNumber}</FieldRow>

        <FieldRow label="Policy Number">{claim.policyNumber}</FieldRow>
        <FieldRow label="Effective Date">{formatDate(claim.effectiveDate)}</FieldRow>
        <FieldRow label="Expiry Date">{formatDate(claim.expiryDate)}</FieldRow>

        <FieldRow label="Loss Date">{formatDate(claim.lossDate)}</FieldRow>
        <FieldRow label="Deductible">{formatCurrency(claim.deductible)}</FieldRow>
        <FieldRow label="Replacement Cost?">
          {formatYesNo(claim.replacementCost)}
        </FieldRow>

        <FieldRow label="Windshield on Policy?">
          {formatYesNo(claim.windshieldOnPolicy)}
        </FieldRow>
        <FieldRow label="Cause of Claim">{claim.causeOfClaim}</FieldRow>
      </FieldGrid>

      <div className="mt-8">
        <h3 className="text-sm text-muted-foreground">Claim Description</h3>
        <p className="mt-1 text-base font-semibold text-foreground">
          {claim.description}
        </p>
      </div>
    </Section>
  );
}

function CustomerInformationSection({
  customer,
}: {
  customer: ClaimDetail['customer'];
}) {
  return (
    <Section title="Customer Information">
      <FieldGrid columns={2}>
        <FieldRow label="First Name">{customer.firstName}</FieldRow>
        <FieldRow label="Last Name">{customer.lastName}</FieldRow>
        <FieldRow label="Address">{customer.address}</FieldRow>
        <FieldRow label="City">{customer.city}</FieldRow>
        <FieldRow label="Province/State">{customer.provinceState}</FieldRow>
        <FieldRow label="Postal Code">{customer.postalCode}</FieldRow>
        <FieldRow label="Email">{customer.email}</FieldRow>
        <FieldRow label="Phone">{customer.phone}</FieldRow>
      </FieldGrid>
    </Section>
  );
}

function VehicleInformationSection({
  vehicle,
}: {
  vehicle: ClaimDetail['vehicle'];
}) {
  return (
    <Section title="Vehicle Information">
      <FieldGrid columns={2}>
        <FieldRow label="Year">{vehicle.year}</FieldRow>
        <FieldRow label="Make">{vehicle.make}</FieldRow>
        <FieldRow label="Model">{vehicle.model}</FieldRow>
        <FieldRow label="Body Style">{vehicle.bodyStyle}</FieldRow>
        <FieldRow label="VIN">{vehicle.vin}</FieldRow>
        <FieldRow label="License Plate Number">{vehicle.licensePlate}</FieldRow>
        <FieldRow label="Odometer Reading">
          {vehicle.odometerKm.toLocaleString()} km
        </FieldRow>
      </FieldGrid>
    </Section>
  );
}

function WorkOrderNotesSection({
  notes,
}: {
  notes: ClaimDetail['workOrderNotes'];
}) {
  return (
    <Section title="Work Order Notes">
      <div className="flex flex-col gap-5">
        <NoteBlock label="External Note" value={notes.externalNote} />
        <NoteBlock label="Internal Notes" value={notes.internalNotes} />
      </div>
    </Section>
  );
}

function NoteBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <p className="rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground">
        {value || (
          <span className="italic text-muted-foreground">No notes</span>
        )}
      </p>
    </div>
  );
}

function ConfidenceScoreSection({
  score,
}: {
  score: ClaimDetail['confidenceScore'];
}) {
  return (
    <Section
      title="Confidence Score"
      rightSlot={
        <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
          <svg
            className="size-3.5"
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
          {score.percent}% match
        </span>
      }
    >
      <p className="text-sm text-muted-foreground">{score.description}</p>
    </Section>
  );
}

function RecommendedPartsSection({
  parts,
  pendingAudit,
  onRequestMoreInfo,
  onApproveRecommendations,
}: {
  parts: ClaimDetail['recommendedParts'];
  pendingAudit: boolean;
  onRequestMoreInfo?: () => void;
  onApproveRecommendations?: () => void;
}) {
  return (
    <Section title="Recommended Parts — Pending CSR Audit">
      <div className="flex flex-col gap-3">
        {parts.map((part) => (
          <article
            key={part.partNumber}
            className="rounded-md border border-border bg-background p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {part.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Part #: {part.partNumber}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">
                  Match Confidence
                </div>
                <div className="text-lg font-bold text-foreground">
                  {part.matchConfidencePercent}%
                </div>
              </div>
            </div>
            <ProgressBar
              value={part.matchConfidencePercent}
              className="mt-3"
              ariaLabel={`Match confidence ${part.matchConfidencePercent}%`}
            />
            <div className="mt-3">
              <RecommendedTag status={part.status} />
            </div>
          </article>
        ))}
      </div>

      {pendingAudit && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <svg
            className="mt-0.5 size-4 shrink-0 text-amber-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>
            This claim requires CSR audit approval before proceeding with the
            parts order.
          </span>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button variant="outline" onClick={onRequestMoreInfo}>
          Request Additional Info
        </Button>
        <Button
          onClick={onApproveRecommendations}
          className="bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:ring-emerald-600"
          leftIcon={
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
          }
        >
          Approve Recommendations
        </Button>
      </div>
    </Section>
  );
}

function RecommendedTag({ status }: { status: RecommendedPartStatus }) {
  const map = {
    recommended: {
      label: 'Recommended',
      className:
        'border-emerald-300 bg-emerald-50 text-emerald-700',
    },
    alternative: {
      label: 'Alternative',
      className: 'border-blue-300 bg-blue-50 text-blue-700',
    },
  } as const;
  const { label, className } = map[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold',
        className,
      )}
    >
      {label}
    </span>
  );
}
