import type {
  WorkOrderDetail,
  WorkOrderSummary,
  WorkshopDashboardStats,
} from '../types/workshop.types';

export const mockWorkshopStats: WorkshopDashboardStats = {
  pendingJobs: 2,
  inProgressJobs: 2,
  completedToday: 1,
};

export const mockWorkOrders: WorkOrderSummary[] = [
  {
    workOrderNo: 'WO-2024-015',
    carrier: 'State Farm',
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    customerPhone: '(555) 123-4567',
    vehicleLabel: '2023 Toyota Camry',
    date: '2024-03-22',
    status: 'PENDING',
  },
  {
    workOrderNo: 'WO-2024-016',
    carrier: 'Geico',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@example.com',
    customerPhone: '(555) 234-5678',
    vehicleLabel: '2022 Honda Accord',
    date: '2024-03-22',
    status: 'PENDING',
  },
  {
    workOrderNo: 'WO-2024-013',
    carrier: 'Allstate',
    customerName: 'Michael Chen',
    customerEmail: 'michael.chen@example.com',
    customerPhone: '(555) 345-6789',
    vehicleLabel: '2024 Ford F-150',
    date: '2024-03-21',
    status: 'IN_PROGRESS',
  },
  {
    workOrderNo: 'WO-2024-014',
    carrier: 'Progressive',
    customerName: 'Emily Davis',
    customerEmail: 'emily.davis@example.com',
    customerPhone: '(555) 456-7890',
    vehicleLabel: '2023 Chevrolet Silverado',
    date: '2024-03-21',
    status: 'IN_PROGRESS',
  },
  {
    workOrderNo: 'WO-2024-010',
    carrier: 'State Farm',
    customerName: 'Robert Williams',
    customerEmail: 'robert.williams@example.com',
    customerPhone: '(555) 567-8901',
    vehicleLabel: '2022 Tesla Model 3',
    date: '2024-03-20',
    status: 'COMPLETED',
  },
];

function detailFrom(
  summary: WorkOrderSummary,
  overrides: Partial<WorkOrderDetail> = {},
): WorkOrderDetail {
  return {
    ...summary,
    overallConfidence: {
      vinMatch: 'Verified',
      yearMakeModel: 'Exact Match',
      oemSpec: 'Pending',
      percent: 85,
    },
    partMatchConfidence: {
      vinMatch: 'Verified',
      yearMakeModel: 'Approximate',
      oemSpec: 'Pending',
      percent: 78,
    },
    customer: {
      fullName: summary.customerName,
      email: summary.customerEmail,
      phone: summary.customerPhone,
    },
    vehicle: {
      label: summary.vehicleLabel,
      vin: '1HGBH41JXMN' + Math.floor(Math.random() * 900000 + 100000),
      licensePlate: 'XYZ-0000',
    },
    workDetails: {
      damageDescription:
        'Customer reports a chip on the driver-side windshield. No visible cracks on perimeter.',
      requiredService: 'Windshield replacement and ADAS calibration',
    },
    recommendedParts: [
      {
        partNumber: 'GEN-WS-001',
        description: 'OEM Replacement Windshield',
        price: 320,
        tag: 'recommended',
      },
      {
        partNumber: 'GEN-WS-002-ALT',
        description: 'Aftermarket Premium Windshield',
        price: 260,
        tag: 'alternative',
      },
    ],
    pendingCsrAudit: summary.status === 'PENDING',
    parts: [
      {
        partNumber: 'GEN-WS-001',
        description: 'OEM Replacement Windshield',
        taxable: true,
        listPrice: 380,
        shopPrice: 320,
        carrierPrice: 290,
      },
    ],
    labour: [
      { label: 'Windshield Part', amount: 320 },
      { label: 'Removal & Installation Labor (2 hrs)', amount: 160 },
      { label: 'Adhesive Kit & Materials', amount: 45 },
    ],
    totalEstimate: 525,
    invoice: {
      invoiceNumber: `INV-${summary.workOrderNo}`,
      invoiceDate: null,
      shopAmount: 525,
      preTaxAmount: 464.6,
      taxPercent: 13,
      taxAmount: 60.4,
      shopAdminFee: 0,
      shopAdminTax: 0,
      deductible: 0,
      totalSum: 525,
      variance: 0,
    },
    ...overrides,
  };
}

const FALLBACK_DETAILS: Record<string, WorkOrderDetail> = mockWorkOrders.reduce(
  (acc, summary) => {
    acc[summary.workOrderNo] = detailFrom(summary);
    return acc;
  },
  {} as Record<string, WorkOrderDetail>,
);

export const mockWorkOrderDetails: Record<string, WorkOrderDetail> = {
  ...FALLBACK_DETAILS,
  'WO-2024-015': {
    workOrderNo: 'WO-2024-015',
    carrier: 'State Farm',
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    customerPhone: '(555) 123-4567',
    vehicleLabel: '2023 Toyota Camry',
    date: '2024-03-22',
    status: 'PENDING',
    overallConfidence: {
      vinMatch: 'Verified',
      yearMakeModel: 'Exact Match',
      oemSpec: 'Certified',
      percent: 92,
    },
    partMatchConfidence: {
      vinMatch: 'Verified',
      yearMakeModel: 'Exact Match',
      oemSpec: 'Certified',
      percent: 95,
    },
    customer: {
      fullName: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
    },
    vehicle: {
      label: '2023 Toyota Camry',
      vin: '1HGBH41JXMN109186',
      licensePlate: 'ABC-1234',
    },
    workDetails: {
      damageDescription:
        "Large crack on driver's side windshield caused by rock impact. Crack extends approximately 12 inches from bottom left corner.",
      requiredService: 'Complete windshield replacement',
    },
    recommendedParts: [
      {
        partNumber: 'WS-TY-CAM-23',
        description: 'OEM Windshield - Toyota Camry 2023',
        price: 350.0,
        tag: 'recommended',
      },
      {
        partNumber: 'WS-TY-CAM-22',
        description: 'OEM Windshield - Toyota Camry 2022-2024',
        price: 345.0,
        tag: 'alternative',
      },
      {
        partNumber: 'AM-TY-CAM-23P',
        description: 'Aftermarket Premium - Toyota Camry 2023',
        price: 280.0,
        tag: 'alternative',
      },
    ],
    pendingCsrAudit: true,
    parts: [
      {
        partNumber: 'WS-TY-CAM-23',
        description: 'OEM Windshield - Toyota Camry 2023',
        taxable: true,
        listPrice: 400.0,
        shopPrice: 350.0,
        carrierPrice: 320.0,
      },
      {
        partNumber: 'ADH-001',
        description: 'Adhesive Kit & Materials',
        taxable: true,
        listPrice: 50.0,
        shopPrice: 45.0,
        carrierPrice: 40.0,
      },
    ],
    labour: [
      { label: 'Windshield Part', amount: 350.0 },
      { label: 'Removal & Installation Labor (2.5 hrs)', amount: 200.0 },
      { label: 'Adhesive Kit & Materials', amount: 45.0 },
      { label: 'Calibration (ADAS)', amount: 125.0 },
    ],
    totalEstimate: 720.0,
    invoice: {
      invoiceNumber: 'INV-2024-001',
      invoiceDate: null,
      shopAmount: 720.0,
      preTaxAmount: 637.17,
      taxPercent: 13,
      taxAmount: 82.83,
      shopAdminFee: 0,
      shopAdminTax: 0,
      deductible: 0,
      totalSum: 720.0,
      variance: 0,
    },
  },
};
