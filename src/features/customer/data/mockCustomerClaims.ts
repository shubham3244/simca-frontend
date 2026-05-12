import type {
  CustomerClaimDetail,
  CustomerClaimSummary,
} from '../types/customer-claim.types';

export const mockCustomerClaims: CustomerClaimSummary[] = [
  {
    referenceNo: 'WC-2024-507',
    submittedAt: '2026-05-12',
    vehicleLabel: '2024 Toyota Camry',
    status: 'SUBMITTED',
  },
  {
    referenceNo: 'WC-2024-450',
    submittedAt: '2026-04-28',
    vehicleLabel: '2024 Toyota Camry',
    status: 'IN_PROGRESS',
  },
  {
    referenceNo: 'WC-2024-401',
    submittedAt: '2026-04-10',
    vehicleLabel: '2022 Honda Accord',
    status: 'COMPLETED',
  },
  {
    referenceNo: 'WC-2024-380',
    submittedAt: '2026-03-15',
    vehicleLabel: '2024 Toyota Camry',
    status: 'CANCELLED',
  },
];

export const mockCustomerClaimDetails: Record<string, CustomerClaimDetail> = {
  'WC-2024-507': {
    referenceNo: 'WC-2024-507',
    submittedAt: '2026-05-12',
    vehicleLabel: '2024 Toyota Camry',
    status: 'SUBMITTED',
    incidentDate: '2026-05-10',
    causeOfDamage: 'Road debris',
    damageDescription:
      'Crack on driver side, approximately 10 inches, while driving on highway.',
    insuranceCompany: 'State Farm',
    policyNumber: 'POL-2024-12345',
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    customerPhone: '(555) 123-4567',
    vehicleVin: '1HGBH41JXMN109186',
    documents: [
      { name: 'damage-driver-side.jpg', sizeBytes: 2_400_000 },
      { name: 'damage-close-up.jpg', sizeBytes: 1_800_000 },
    ],
  },
  'WC-2024-450': {
    referenceNo: 'WC-2024-450',
    submittedAt: '2026-04-28',
    vehicleLabel: '2024 Toyota Camry',
    status: 'IN_PROGRESS',
    incidentDate: '2026-04-25',
    causeOfDamage: 'Rock chip',
    damageDescription:
      'Small chip in lower right corner, no crack but visible from inside.',
    insuranceCompany: 'State Farm',
    policyNumber: 'POL-2024-12345',
    claimNumber: 'CLM-2024-78521',
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    customerPhone: '(555) 123-4567',
    vehicleVin: '1HGBH41JXMN109186',
    documents: [{ name: 'rock-chip-photo.jpg', sizeBytes: 1_200_000 }],
  },
  'WC-2024-401': {
    referenceNo: 'WC-2024-401',
    submittedAt: '2026-04-10',
    vehicleLabel: '2022 Honda Accord',
    status: 'COMPLETED',
    incidentDate: '2026-04-08',
    causeOfDamage: 'Vandalism',
    damageDescription:
      'Windshield smashed overnight while parked at a public lot.',
    insuranceCompany: 'Geico',
    policyNumber: 'POL-2022-55890',
    claimNumber: 'CLM-2024-66200',
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    customerPhone: '(555) 123-4567',
    vehicleVin: '1HGCM82633A123456',
    documents: [
      { name: 'damage-overview.jpg', sizeBytes: 3_100_000 },
      { name: 'police-report.pdf', sizeBytes: 540_000 },
    ],
  },
  'WC-2024-380': {
    referenceNo: 'WC-2024-380',
    submittedAt: '2026-03-15',
    vehicleLabel: '2024 Toyota Camry',
    status: 'CANCELLED',
    incidentDate: '2026-03-14',
    causeOfDamage: 'Accident',
    damageDescription:
      'Damage from minor collision — submitted in error, will refile under collision policy.',
    insuranceCompany: 'State Farm',
    policyNumber: 'POL-2024-12345',
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    customerPhone: '(555) 123-4567',
    vehicleVin: '1HGBH41JXMN109186',
    documents: [],
  },
};
