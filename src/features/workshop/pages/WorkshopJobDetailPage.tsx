import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { useConfirm } from '../../../components/ui/ConfirmDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { WorkshopChatModal } from '../components/WorkshopChatModal';
import { WorkshopClaimInfoTab } from '../components/WorkshopClaimInfoTab';
import { WorkshopPartsInvoiceTab } from '../components/WorkshopPartsInvoiceTab';
import {
  WorkshopStatusBadge,
  workshopStatusLabel,
} from '../components/WorkshopStatusBadge';
import { mockWorkOrderDetails } from '../data/mockWorkOrders';
import type {
  WorkOrderDetail,
  WorkshopJobStatus,
} from '../types/workshop.types';

type TabValue = 'info' | 'parts';

export function WorkshopJobDetailPage() {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const params = useParams<{ workOrderNo: string }>();
  const [tab, setTab] = useState<TabValue>('info');

  const initialDetail: WorkOrderDetail | null = useMemo(() => {
    if (!params.workOrderNo) return null;
    return mockWorkOrderDetails[params.workOrderNo] ?? null;
  }, [params.workOrderNo]);

  const [detail, setDetail] = useState<WorkOrderDetail | null>(initialDetail);
  const [selectedPartNumber, setSelectedPartNumber] = useState<string>(
    () => initialDetail?.recommendedParts.find((p) => p.tag === 'recommended')?.partNumber
      ?? initialDetail?.recommendedParts[0]?.partNumber
      ?? '',
  );
  const [submittingAudit, setSubmittingAudit] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  if (!detail) {
    return (
      <div className="rounded-xl bg-card p-8 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          Work order not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {params.workOrderNo
            ? `We couldn’t find a job for ${params.workOrderNo}.`
            : 'No work order specified.'}
        </p>
        <div className="mt-6">
          <Link
            to="/workshop/work-orders"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Back to Work Orders
          </Link>
        </div>
      </div>
    );
  }

  const handleStartWork = async () => {
    const ok = await confirm({
      title: 'Start this job?',
      message:
        'The customer and CSR will be notified that work has started on this windshield.',
      confirmLabel: 'Start Work',
      cancelLabel: 'Cancel',
    });
    if (!ok) return;
    await runTransition('IN_PROGRESS');
  };

  const handleMarkComplete = async () => {
    const ok = await confirm({
      title: 'Mark this job complete?',
      message:
        'Confirm the windshield replacement and any post-install calibration are finished. The CSR will be prompted to close out the claim.',
      confirmLabel: 'Mark Complete',
      cancelLabel: 'Cancel',
    });
    if (!ok) return;
    await runTransition('COMPLETED');
  };

  const runTransition = async (next: WorkshopJobStatus) => {
    setTransitioning(true);
    try {
      // TODO: real backend PATCH /workshop/work-orders/:no/status
      await new Promise((r) => setTimeout(r, 350));
      setDetail((d) => (d ? { ...d, status: next } : d));
      // eslint-disable-next-line no-console
      console.info('[workshop] status →', next, 'for', detail.workOrderNo);
    } finally {
      setTransitioning(false);
    }
  };

  const handleSubmitForCsrAudit = async () => {
    if (!selectedPartNumber) return;
    const part = detail.recommendedParts.find(
      (p) => p.partNumber === selectedPartNumber,
    );
    const ok = await confirm({
      title: 'Submit for CSR audit?',
      message: (
        <span>
          The CSR team will review your selected part
          {part ? ` (${part.description})` : ''} before it can be ordered. You
          can&apos;t edit the recommendation while review is in progress.
        </span>
      ),
      confirmLabel: 'Submit',
      cancelLabel: 'Cancel',
    });
    if (!ok) return;
    setSubmittingAudit(true);
    try {
      // TODO: real backend POST /workshop/work-orders/:no/csr-audit
      await new Promise((r) => setTimeout(r, 400));
      setDetail((d) => (d ? { ...d, pendingCsrAudit: false } : d));
      // eslint-disable-next-line no-console
      console.info(
        '[workshop] submitted for CSR audit',
        detail.workOrderNo,
        '— part',
        selectedPartNumber,
      );
    } finally {
      setSubmittingAudit(false);
    }
  };

  const handleRequestMoreInfo = async () => {
    await confirm({
      title: 'Request more info from CSR?',
      message:
        'A note will be sent to the Call Center agent asking for clarification on parts or coverage.',
      confirmLabel: 'Send Request',
      cancelLabel: 'Cancel',
    });
    // TODO: wire actual workflow once chat API is ready
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          to="/workshop/work-orders"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Work Orders
        </Link>
      </div>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Job Details
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            {detail.workOrderNo}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {detail.vehicle.label} · {detail.carrier}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <WorkshopStatusBadge status={detail.status} className="text-sm" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setChatOpen(true)}
            leftIcon={
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            }
          >
            Chat with CSR
          </Button>
          <StatusActions
            status={detail.status}
            disabled={transitioning}
            onStart={handleStartWork}
            onComplete={handleMarkComplete}
            onReopen={() => navigate(0)}
          />
        </div>
      </header>

      <WorkshopChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        workOrderNo={detail.workOrderNo}
        carrier={detail.carrier}
      />

      <Tabs<TabValue> value={tab} onValueChange={setTab}>
        <TabsList className="max-w-md">
          <TabsTrigger value="info">Claim Info</TabsTrigger>
          <TabsTrigger value="parts">Parts &amp; Invoice</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="info">
            <WorkshopClaimInfoTab
              detail={detail}
              selectedPartNumber={selectedPartNumber}
              onSelectPart={setSelectedPartNumber}
              onSubmitForCsrAudit={handleSubmitForCsrAudit}
              onRequestMoreInfo={handleRequestMoreInfo}
              submitting={submittingAudit}
            />
          </TabsContent>
          <TabsContent value="parts">
            <WorkshopPartsInvoiceTab detail={detail} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function StatusActions({
  status,
  disabled,
  onStart,
  onComplete,
}: {
  status: WorkshopJobStatus;
  disabled?: boolean;
  onStart: () => void;
  onComplete: () => void;
  onReopen: () => void;
}) {
  if (status === 'PENDING') {
    return (
      <Button onClick={onStart} isLoading={disabled}>
        Start Work
      </Button>
    );
  }
  if (status === 'IN_PROGRESS') {
    return (
      <Button onClick={onComplete} isLoading={disabled}>
        Mark Complete
      </Button>
    );
  }
  return (
    <span className="text-xs font-medium text-muted-foreground">
      {workshopStatusLabel(status)} — read-only
    </span>
  );
}
