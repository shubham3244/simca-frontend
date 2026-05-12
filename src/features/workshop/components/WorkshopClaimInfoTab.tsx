import type { ReactNode } from 'react';
import { Button } from '../../../components/ui/Button';
import { MaskedField } from '../../../components/ui/MaskedField';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { maskEmail, maskPhone, maskVin } from '../../../lib/pii/mask';
import { cn } from '../../../utils/cn';
import { formatCurrency } from '../../../utils/format';
import type {
  ConfidenceBreakdown,
  RecommendedPartOption,
  WorkOrderDetail,
} from '../types/workshop.types';

interface WorkshopClaimInfoTabProps {
  detail: WorkOrderDetail;
  selectedPartNumber: string;
  onSelectPart: (partNumber: string) => void;
  onSubmitForCsrAudit: () => void;
  onRequestMoreInfo: () => void;
  submitting?: boolean;
}

export function WorkshopClaimInfoTab({
  detail,
  selectedPartNumber,
  onSelectPart,
  onSubmitForCsrAudit,
  onRequestMoreInfo,
  submitting,
}: WorkshopClaimInfoTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <ConfidenceCard
        title="Overall Match Confidence"
        breakdown={detail.overallConfidence}
        description="Aggregated confidence across VIN, year/make/model, and OEM specifications."
      />
      <CustomerSection detail={detail} />
      <VehicleSection detail={detail} />
      <WorkDetailsSection detail={detail} />
      <ConfidenceCard
        title="Selected Part Match"
        breakdown={detail.partMatchConfidence}
        description="How well the chosen part matches the vehicle’s recorded specs."
      />
      <RecommendedPartsSection
        parts={detail.recommendedParts}
        selectedPartNumber={selectedPartNumber}
        onSelectPart={onSelectPart}
        pendingAudit={detail.pendingCsrAudit}
        onSubmitForCsrAudit={onSubmitForCsrAudit}
        onRequestMoreInfo={onRequestMoreInfo}
        submitting={submitting}
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

function FieldGrid({ children }: { children: ReactNode }) {
  return (
    <dl className="grid grid-cols-1 gap-y-5 gap-x-8 md:grid-cols-2">
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

function ConfidenceCard({
  title,
  breakdown,
  description,
}: {
  title: string;
  breakdown: ConfidenceBreakdown;
  description: string;
}) {
  return (
    <Section
      title={title}
      rightSlot={
        <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
          <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {breakdown.percent}% match
        </span>
      }
    >
      <ProgressBar
        value={breakdown.percent}
        ariaLabel={`${title} ${breakdown.percent}%`}
      />
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ConfidenceChip label="VIN Match" value={breakdown.vinMatch} />
        <ConfidenceChip
          label="Year/Make/Model"
          value={breakdown.yearMakeModel}
        />
        <ConfidenceChip label="OEM Spec" value={breakdown.oemSpec} />
      </ul>
    </Section>
  );
}

function ConfidenceChip({ label, value }: { label: string; value: string }) {
  return (
    <li className="rounded-md border border-border bg-background px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
    </li>
  );
}

function CustomerSection({ detail }: { detail: WorkOrderDetail }) {
  return (
    <Section title="Customer Information">
      <FieldGrid>
        <FieldRow label="Full Name">{detail.customer.fullName}</FieldRow>
        <FieldRow label="Email">
          <MaskedField
            value={detail.customer.email}
            mask={maskEmail}
            fieldName="email"
            resourceId={detail.workOrderNo}
          />
        </FieldRow>
        <FieldRow label="Phone">
          <MaskedField
            value={detail.customer.phone}
            mask={maskPhone}
            fieldName="phone"
            resourceId={detail.workOrderNo}
          />
        </FieldRow>
        <FieldRow label="Carrier/Insurer">{detail.carrier}</FieldRow>
      </FieldGrid>
    </Section>
  );
}

function VehicleSection({ detail }: { detail: WorkOrderDetail }) {
  return (
    <Section title="Vehicle Information">
      <FieldGrid>
        <FieldRow label="Vehicle">{detail.vehicle.label}</FieldRow>
        <FieldRow label="License Plate">{detail.vehicle.licensePlate}</FieldRow>
        <FieldRow label="VIN">
          <MaskedField
            value={detail.vehicle.vin}
            mask={maskVin}
            fieldName="VIN"
            resourceId={detail.workOrderNo}
          />
        </FieldRow>
      </FieldGrid>
    </Section>
  );
}

function WorkDetailsSection({ detail }: { detail: WorkOrderDetail }) {
  return (
    <Section title="Work Details">
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-sm text-muted-foreground">Damage Description</p>
          <p className="mt-1 rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground">
            {detail.workDetails.damageDescription}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Required Service</p>
          <p className="mt-1 text-base font-semibold text-foreground">
            {detail.workDetails.requiredService}
          </p>
        </div>
      </div>
    </Section>
  );
}

function RecommendedPartsSection({
  parts,
  selectedPartNumber,
  onSelectPart,
  pendingAudit,
  onSubmitForCsrAudit,
  onRequestMoreInfo,
  submitting,
}: {
  parts: RecommendedPartOption[];
  selectedPartNumber: string;
  onSelectPart: (partNumber: string) => void;
  pendingAudit: boolean;
  onSubmitForCsrAudit: () => void;
  onRequestMoreInfo: () => void;
  submitting?: boolean;
}) {
  return (
    <Section title="Recommended Parts">
      <div className="flex flex-col gap-3">
        {parts.map((part) => {
          const selected = part.partNumber === selectedPartNumber;
          return (
            <button
              key={part.partNumber}
              type="button"
              onClick={() => onSelectPart(part.partNumber)}
              aria-pressed={selected}
              className={cn(
                'flex w-full items-start justify-between gap-4 rounded-md border bg-background p-4 text-left transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                selected
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-border hover:border-primary/40',
              )}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground">
                    {part.description}
                  </h3>
                  <RecommendedTag tag={part.tag} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Part #: {part.partNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Shop Price</p>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(part.price)}
                </p>
              </div>
            </button>
          );
        })}
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
            CSR audit is required before parts can be ordered. Submit your
            selection for review.
          </span>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button variant="outline" onClick={onRequestMoreInfo}>
          Request More Info
        </Button>
        <Button
          onClick={onSubmitForCsrAudit}
          isLoading={submitting}
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
          Submit for CSR Audit
        </Button>
      </div>
    </Section>
  );
}

function RecommendedTag({ tag }: { tag: RecommendedPartOption['tag'] }) {
  const map = {
    recommended: {
      label: 'Recommended',
      className: 'border-emerald-300 bg-emerald-50 text-emerald-700',
    },
    alternative: {
      label: 'Alternative',
      className: 'border-blue-300 bg-blue-50 text-blue-700',
    },
  } as const;
  const { label, className } = map[tag];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold',
        className,
      )}
    >
      {label}
    </span>
  );
}
