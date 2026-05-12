export type WorkshopJobStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface WorkOrderSummary {
  workOrderNo: string;
  carrier: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleLabel: string;
  date: string; // ISO
  status: WorkshopJobStatus;
}

export interface ConfidenceBreakdown {
  vinMatch: 'Verified' | 'Unverified';
  yearMakeModel: 'Exact Match' | 'Approximate' | 'No Match';
  oemSpec: 'Certified' | 'Pending' | 'N/A';
  percent: number; // 0-100
}

export interface RecommendedPartOption {
  partNumber: string;
  description: string;
  price: number;
  tag: 'recommended' | 'alternative';
}

export interface WorkshopCustomerInfo {
  fullName: string;
  email: string;
  phone: string;
}

export interface WorkshopVehicleInfo {
  label: string;
  vin: string;
  licensePlate: string;
}

export interface WorkshopWorkDetails {
  damageDescription: string;
  requiredService: string;
}

export interface PartListLine {
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

export interface ShopInvoiceState {
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

export interface WorkOrderDetail extends WorkOrderSummary {
  overallConfidence: ConfidenceBreakdown;
  partMatchConfidence: ConfidenceBreakdown;
  customer: WorkshopCustomerInfo;
  vehicle: WorkshopVehicleInfo;
  workDetails: WorkshopWorkDetails;
  recommendedParts: RecommendedPartOption[];
  pendingCsrAudit: boolean;
  /** Filled in when invoice tab work has started */
  parts: PartListLine[];
  labour: LabourLine[];
  totalEstimate: number;
  invoice: ShopInvoiceState;
}

export interface WorkshopDashboardStats {
  pendingJobs: number;
  inProgressJobs: number;
  completedToday: number;
}
