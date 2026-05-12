export type InsurerClaimStatus = 'PENDING_REVIEW' | 'IN_PROGRESS' | 'APPROVED';

export interface InsurerCustomer {
  fullName: string;
  email: string;
  phone: string;
  driverLicense: string;
  address: string;
}

export interface InsurerVehicle {
  label: string; // e.g. "2023 Toyota Camry"
  vin: string;
  odometerKm: number;
  color: string;
}

export interface FinancialLine {
  label: string;
  amount: number;
}

export type AuditActor =
  | { kind: 'SYSTEM' }
  | { kind: 'AGENT'; name: string }
  | { kind: 'WORKSHOP'; name: string }
  | { kind: 'INSURER'; name: string };

export interface AuditEntry {
  id: string;
  timestamp: string; // ISO
  title: string;
  actor: AuditActor;
}

export interface InsurerClaimSummary {
  claimId: string;
  customerFullName: string;
  vehicleLabel: string;
  policyNumber: string;
  dateOfLoss: string; // ISO
  amount: number;
  status: InsurerClaimStatus;
}

export interface InsurerClaimDetail extends InsurerClaimSummary {
  customer: InsurerCustomer;
  vehicle: InsurerVehicle;
  damageDescription: string;
  lines: FinancialLine[];
  subtotal: number;
  deductible: number;
  totalAmount: number;
  paymentMethod: string;
  workshop: string;
  paymentStatus: 'PENDING_APPROVAL' | 'APPROVED' | 'PAID';
  /** Set when status === 'APPROVED' */
  approvedAt?: string;
  approvedBy?: string;
  auditLog: AuditEntry[];
}

export interface InsurerDashboardStats {
  totalClaims: number;
  totalClaimsLabel: string; // e.g. "All time"
  openClaims: number;
  openClaimsLabel: string;
  totalAmount: number;
  totalAmountLabel: string;
  avgProcessingDays: number;
  avgProcessingLabel: string;
}
