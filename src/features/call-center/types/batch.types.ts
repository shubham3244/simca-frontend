export interface BatchedInvoice {
  batchNo: string;
  totalAmount: number;
  dateCreated: string; // ISO date
  exported: boolean;
}
