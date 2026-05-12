export type CustomerClaimStatus =
  | 'SUBMITTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface CustomerClaimDocument {
  name: string;
  sizeBytes: number;
}

export interface CustomerClaimSummary {
  referenceNo: string;
  submittedAt: string; // ISO date
  vehicleLabel: string; // e.g. "2024 Toyota Camry"
  status: CustomerClaimStatus;
}

export interface CustomerClaimDetail extends CustomerClaimSummary {
  incidentDate: string;
  causeOfDamage: string;
  damageDescription: string;
  insuranceCompany: string;
  policyNumber: string;
  claimNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleVin: string;
  documents: CustomerClaimDocument[];
}
