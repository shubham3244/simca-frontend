import type { BatchedInvoice } from '../types/batch.types';

export const mockBatches: BatchedInvoice[] = [
  { batchNo: 'BATCH-2024-001', totalAmount: 3450.0, dateCreated: '2024-04-10', exported: true },
  { batchNo: 'BATCH-2024-002', totalAmount: 5280.0, dateCreated: '2024-04-11', exported: true },
  { batchNo: 'BATCH-2024-003', totalAmount: 2890.0, dateCreated: '2024-04-12', exported: false },
  { batchNo: 'BATCH-2024-004', totalAmount: 4125.0, dateCreated: '2024-04-13', exported: false },
];
