import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Field } from '../../../components/ui/Field';
import { MaskedField } from '../../../components/ui/MaskedField';
import { maskEmail, maskPhone, maskVin } from '../../../lib/pii/mask';
import { formatDate } from '../../../utils/format';
import { ClaimTimeline } from '../components/ClaimTimeline';
import { CustomerStatusBadge } from '../components/CustomerStatusBadge';
import { mockCustomerClaimDetails } from '../data/mockCustomerClaims';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CustomerClaimDetailPage() {
  const navigate = useNavigate();
  const { referenceNo } = useParams<{ referenceNo: string }>();
  const claim = referenceNo ? mockCustomerClaimDetails[referenceNo] : undefined;

  // If reference is unknown, send back to the list
  useEffect(() => {
    if (!claim) {
      navigate('/customer/claims', { replace: true });
    }
  }, [claim, navigate]);

  if (!claim) return null;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      {/* Back link */}
      <div>
        <Link
          to="/customer/claims"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to My Claims
        </Link>
      </div>

      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Claim Reference
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            {claim.referenceNo}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Submitted on {formatDate(claim.submittedAt)}
          </p>
        </div>
        <CustomerStatusBadge status={claim.status} className="self-start text-sm sm:self-auto" />
      </header>

      {/* Timeline */}
      <section className="rounded-xl bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Claim Status</h2>
        <div className="mt-4">
          <ClaimTimeline status={claim.status} />
        </div>
      </section>

      {/* Incident */}
      <section className="rounded-xl bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Incident</h2>
        <dl className="mt-4 grid grid-cols-1 gap-y-5 gap-x-8 md:grid-cols-2">
          <Field label="Date of Loss">{formatDate(claim.incidentDate)}</Field>
          <Field label="Cause of Damage">{claim.causeOfDamage}</Field>
          <div className="md:col-span-2">
            <Field label="Damage Description">{claim.damageDescription}</Field>
          </div>
          <Field label="Insurance Company">{claim.insuranceCompany}</Field>
          <Field label="Policy Number">{claim.policyNumber}</Field>
          {claim.claimNumber && (
            <Field label="Claim Number">{claim.claimNumber}</Field>
          )}
        </dl>
      </section>

      {/* Vehicle */}
      <section className="rounded-xl bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Vehicle</h2>
        <dl className="mt-4 grid grid-cols-1 gap-y-5 gap-x-8 md:grid-cols-2">
          <Field label="Vehicle">{claim.vehicleLabel}</Field>
          <Field label="VIN">
            <MaskedField
              value={claim.vehicleVin}
              mask={maskVin}
              fieldName="VIN"
              resourceId={claim.referenceNo}
            />
          </Field>
        </dl>
      </section>

      {/* Contact */}
      <section className="rounded-xl bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Your Contact Info</h2>
        <dl className="mt-4 grid grid-cols-1 gap-y-5 gap-x-8 md:grid-cols-2">
          <Field label="Name">{claim.customerName}</Field>
          <Field label="Email">
            <MaskedField
              value={claim.customerEmail}
              mask={maskEmail}
              fieldName="email"
              resourceId={claim.referenceNo}
            />
          </Field>
          <Field label="Phone">
            <MaskedField
              value={claim.customerPhone}
              mask={maskPhone}
              fieldName="phone"
              resourceId={claim.referenceNo}
            />
          </Field>
        </dl>
      </section>

      {/* Documents */}
      <section className="rounded-xl bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Documents</h2>
        {claim.documents.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No documents uploaded.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {claim.documents.map((doc) => (
              <li
                key={doc.name}
                className="flex items-center justify-between rounded-md border border-border bg-background px-4 py-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="size-4 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="text-foreground">{doc.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatBytes(doc.sizeBytes)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
