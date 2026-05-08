export type ClaimStatus =
  | 'OPEN'
  | 'IN_PROCESS'
  | 'INVOICED'
  | 'EXPORTED'
  | 'CANCELLED'
  | 'CREDITED'
  | 'CREDITED_EXPORTED';

export interface ClaimSummary {
  controlNo: string;
  carrier: string;
  shopName: string;
  customerFirstName: string;
  customerLastName: string;
  phone: string;
  status: ClaimStatus;
  unreadMessages?: number;
}
