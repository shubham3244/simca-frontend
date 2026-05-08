export type UserRole =
  | 'CALL_CENTER_AGENT'
  | 'CUSTOMER'
  | 'WORKSHOP'
  | 'TECHNICIAN'
  | 'MANAGER'
  | 'CSR'
  | 'ADMIN';

export type Portal = 'CALL_CENTER' | 'CUSTOMER' | 'WORKSHOP' | 'TECHNICIAN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
