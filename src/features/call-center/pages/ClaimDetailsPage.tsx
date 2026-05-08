import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { ClaimInfoTab } from '../components/ClaimInfoTab';
import { PartsAndInvoiceTab } from '../components/PartsAndInvoiceTab';
import { mockClaimDetail } from '../data/mockClaimDetail';

type TabValue = 'info' | 'parts';

export function ClaimDetailsPage() {
  const navigate = useNavigate();
  const params = useParams<{ controlNo: string }>();
  const [tab, setTab] = useState<TabValue>('info');

  const claim = {
    ...mockClaimDetail,
    controlNo: params.controlNo ?? mockClaimDetail.controlNo,
  };

  const handleApprove = () => {
    // TODO: wire to backend approval endpoint
    navigate('/call-center/claims');
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          to="/call-center/claims"
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
          Back to Claims
        </Link>
      </div>

      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Claim Details
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            {claim.controlNo}
          </h1>
        </div>
        <StatusBadge status={claim.status} className="self-start text-sm sm:self-auto" />
      </header>

      <Tabs<TabValue> value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="info">Claim Info</TabsTrigger>
          <TabsTrigger value="parts">Parts &amp; Invoice</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="info">
            <ClaimInfoTab
              claim={claim}
              onApproveRecommendations={handleApprove}
            />
          </TabsContent>
          <TabsContent value="parts">
            <PartsAndInvoiceTab claim={claim} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
