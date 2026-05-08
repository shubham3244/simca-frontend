import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';

interface LocationState {
  referenceNo?: string;
}

export function ClaimSubmittedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? null) as LocationState | null;
  const referenceNo = state?.referenceNo;

  // If user lands here without a reference number, send them back to the wizard
  useEffect(() => {
    if (!referenceNo) {
      navigate('/customer', { replace: true });
    }
  }, [referenceNo, navigate]);

  if (!referenceNo) return null;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-xl bg-card p-8 text-center sm:p-12">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100">
          <svg
            className="size-8 text-emerald-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-foreground sm:text-3xl">
          Claim Submitted Successfully!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your windshield damage claim has been received and is being processed.
        </p>

        <div className="mt-6 rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-muted-foreground">
            Your Claim Reference Number
          </p>
          <p className="mt-1 text-2xl font-bold text-primary">{referenceNo}</p>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          You will receive an email confirmation shortly. Our team will review
          your claim and contact you within 24-48 hours.
        </p>

        <div className="mt-8 flex justify-center">
          <Button onClick={() => navigate('/customer', { replace: true })}>
            Submit Another Claim
          </Button>
        </div>
      </div>
    </div>
  );
}
