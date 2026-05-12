import { useState } from 'react';
import { InsurerClaimDetailModal } from '../components/InsurerClaimDetailModal';
import { InsurerClaimsTable } from '../components/InsurerClaimsTable';
import { InsurerKpiCards } from '../components/InsurerKpiCards';
import {
  mockInsurerClaimDetails,
  mockInsurerClaims,
  mockInsurerStats,
} from '../data/mockInsurerClaims';

export function InsurerDashboardPage() {
  const [openClaimId, setOpenClaimId] = useState<string | null>(null);

  const openClaim = openClaimId
    ? mockInsurerClaimDetails[openClaimId] ?? null
    : null;

  const handleExport = () => {
    // TODO: real backend export → CSV/XLSX download.
    window.alert('Export started — CSV will be emailed when ready.');
  };

  const handleApprove = (claimId: string) => {
    // TODO: real backend POST /claims/:id/approve
    // eslint-disable-next-line no-console
    console.info('[insurer] approved claim', claimId);
  };

  const handleRequestMoreInfo = (claimId: string, note: string) => {
    // TODO: real backend POST /claims/:id/request-info
    // eslint-disable-next-line no-console
    console.info('[insurer] requested info on', claimId, '— note:', note);
  };

  const handleAddNote = (claimId: string, note: string) => {
    // TODO: real backend POST /claims/:id/notes
    // eslint-disable-next-line no-console
    console.info('[insurer] note added to', claimId, '—', note);
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <InsurerKpiCards stats={mockInsurerStats} />
      <InsurerClaimsTable
        claims={mockInsurerClaims}
        onViewDetails={setOpenClaimId}
        onExport={handleExport}
      />

      <InsurerClaimDetailModal
        isOpen={openClaimId !== null}
        onClose={() => setOpenClaimId(null)}
        claim={openClaim}
        onApprove={handleApprove}
        onRequestMoreInfo={handleRequestMoreInfo}
        onAddNote={handleAddNote}
      />
    </div>
  );
}
