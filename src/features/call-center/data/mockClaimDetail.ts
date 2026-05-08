import type { ClaimDetail } from '../types/claim-detail.types';

export const mockClaimDetail: ClaimDetail = {
  controlNo: 'WC-2024-001',
  status: 'OPEN',
  source: 'CSR',
  carrier: 'State Farm',
  workshopName: 'AutoGlass Pro',
  claimNumber: 'CLM-2024-12345',
  policyNumber: 'POL-2024-12345',
  effectiveDate: '2026-04-13',
  expiryDate: '2027-04-13',
  lossDate: '2026-03-20',
  deductible: 500,
  replacementCost: true,
  windshieldOnPolicy: true,
  causeOfClaim: 'Road Debris',
  description:
    'Windshield damaged by road debris on highway. Large crack extending from bottom left corner approximately 12 inches.',

  customer: {
    firstName: 'John',
    lastName: 'Smith',
    address: '123 Main Street',
    city: 'Toronto',
    provinceState: 'ON',
    postalCode: 'M5H 2N2',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
  },

  vehicle: {
    year: 2024,
    make: 'Toyota',
    model: 'Camry',
    bodyStyle: 'Sedan',
    vin: '1HGBH41JXMN109186',
    licensePlate: 'ABC-1234',
    odometerKm: 45000,
  },

  workOrderNotes: {
    externalNote:
      'Customer has been notified of appointment schedule. Parts are in stock and ready for installation.',
    internalNotes:
      'Verified insurance coverage. No prior claims on this policy. Customer prefers morning appointment.',
  },

  confidenceScore: {
    percent: 95,
    description:
      'High confidence match based on VIN, year/make/model, and OEM specifications',
  },

  recommendedParts: [
    {
      partNumber: 'WS-2023-TY-CR',
      name: 'NAGS Windshield - Front',
      matchConfidencePercent: 95,
      status: 'recommended',
    },
    {
      partNumber: 'ADH-001',
      name: 'Adhesive Kit Pro',
      matchConfidencePercent: 88,
      status: 'alternative',
    },
  ],

  pendingCsrAudit: true,

  parts: [
    {
      partNumber: 'WS-2023-TY-CR',
      description: 'NAGS Windshield - Front',
      taxable: true,
      listPrice: 400.0,
      shopPrice: 350.0,
      carrierPrice: 320.0,
    },
    {
      partNumber: 'ADH-001',
      description: 'Adhesive Kit Pro',
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
};
