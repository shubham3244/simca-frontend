import type { ClaimStatus } from './claim.types';

export type ClaimSource = 'CSR' | 'CUSTOMER' | 'WORKSHOP' | 'API';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  provinceState: string;
  postalCode: string;
  email: string;
  phone: string;
}

export interface VehicleInfo {
  year: number;
  make: string;
  model: string;
  bodyStyle: string;
  vin: string;
  licensePlate: string;
  odometerKm: number;
}

export interface WorkOrderNotes {
  externalNote: string;
  internalNotes: string;
}

export interface ConfidenceScoreInfo {
  percent: number;
  description: string;
}

export type RecommendedPartStatus = 'recommended' | 'alternative';

export interface RecommendedPart {
  partNumber: string;
  name: string;
  matchConfidencePercent: number;
  status: RecommendedPartStatus;
}

export interface ClaimPart {
  partNumber: string;
  description: string;
  taxable: boolean;
  listPrice: number;
  shopPrice: number;
  carrierPrice: number;
}

export interface LabourLine {
  label: string;
  amount: number;
}

export interface ShopInvoice {
  invoiceNumber: string;
  invoiceDate: string | null;
  shopAmount: number;
  preTaxAmount: number;
  taxPercent: number;
  taxAmount: number;
  shopAdminFee: number;
  shopAdminTax: number;
  deductible: number;
  totalSum: number;
  variance: number;
}

export interface ClaimDetail {
  controlNo: string;
  status: ClaimStatus;
  source: ClaimSource;
  carrier: string;
  workshopName: string;
  claimNumber: string;
  policyNumber: string;
  effectiveDate: string;
  expiryDate: string;
  lossDate: string;
  deductible: number;
  replacementCost: boolean;
  windshieldOnPolicy: boolean;
  causeOfClaim: string;
  description: string;

  customer: CustomerInfo;
  vehicle: VehicleInfo;
  workOrderNotes: WorkOrderNotes;
  confidenceScore: ConfidenceScoreInfo;
  recommendedParts: RecommendedPart[];
  pendingCsrAudit: boolean;

  parts: ClaimPart[];
  labour: LabourLine[];
  totalEstimate: number;
  invoice: ShopInvoice;
}
