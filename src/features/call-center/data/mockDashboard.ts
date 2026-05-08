import type { DashboardSnapshot } from '../types/dashboard.types';

export const mockDashboard: DashboardSnapshot = {
  sla: { percentage: 92.5, weeklyChange: 2.3 },
  responseTime: { hours: 2.4, targetHours: 3.0 },
  claimsAtRisk: [
    { controlNo: 'WC-2024-005', hoursRemaining: 2 },
    { controlNo: 'WC-2024-007', hoursRemaining: 4 },
    { controlNo: 'WC-2024-009', hoursRemaining: 5 },
  ],
  agentQueue: [
    { agentName: 'Sarah Johnson', assignedClaims: 12, pending: 3, avgProcessingHours: 2.3, slaCompliancePercent: 95 },
    { agentName: 'Michael Chen', assignedClaims: 15, pending: 7, avgProcessingHours: 3.1, slaCompliancePercent: 88 },
    { agentName: 'Emily Rodriguez', assignedClaims: 10, pending: 2, avgProcessingHours: 1.8, slaCompliancePercent: 98 },
    { agentName: 'David Kim', assignedClaims: 8, pending: 1, avgProcessingHours: 2.0, slaCompliancePercent: 92 },
  ],
};
