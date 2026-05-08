export interface SlaComplianceMetric {
  percentage: number;
  weeklyChange: number;
}

export interface ResponseTimeMetric {
  hours: number;
  targetHours: number;
}

export interface ClaimAtRisk {
  controlNo: string;
  hoursRemaining: number;
}

export interface AgentQueueEntry {
  agentName: string;
  assignedClaims: number;
  pending: number;
  avgProcessingHours: number;
  slaCompliancePercent: number;
}

export interface DashboardSnapshot {
  sla: SlaComplianceMetric;
  responseTime: ResponseTimeMetric;
  claimsAtRisk: ClaimAtRisk[];
  agentQueue: AgentQueueEntry[];
}
