import type { UserRole } from '../../features/auth/store/auth.types';

export function roleHomePath(role: UserRole): string {
  switch (role) {
    case 'CALL_CENTER_AGENT':
    case 'CSR':
    case 'MANAGER':
    case 'ADMIN':
      return '/call-center';
    case 'CUSTOMER':
      return '/customer';
    case 'WORKSHOP':
      return '/workshop';
    case 'TECHNICIAN':
      return '/technician';
    default:
      return '/';
  }
}

export const roleLabels: Record<UserRole, string> = {
  CALL_CENTER_AGENT: 'Call Center Agent',
  CUSTOMER: 'Customer',
  WORKSHOP: 'Workshop',
  TECHNICIAN: 'Technician',
  CSR: 'CSR',
  MANAGER: 'Manager',
  ADMIN: 'Administrator',
};

export const roleDescriptions: Partial<Record<UserRole, string>> = {
  CALL_CENTER_AGENT:
    'Manage customer claims, track SLA metrics, and coordinate between all parties',
  CUSTOMER: 'Submit windshield damage claims and track repair status',
  WORKSHOP: 'Receive work orders and update claim progress',
  TECHNICIAN: 'View assigned jobs and submit completion reports',
  CSR: 'Handle customer service requests and escalations',
  MANAGER: 'Oversee team performance and approve claims',
  ADMIN: 'Manage platform settings, users, and tenants',
};
