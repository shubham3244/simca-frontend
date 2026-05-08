import { LoginShell } from '../components/LoginShell';

export function CallCenterLoginPage() {
  return (
    <LoginShell
      portal="CALL_CENTER"
      portalLabel="Call Center Portal"
      portalTagline="Manage customer claims, track SLA metrics, and coordinate between workshops, customers, and carriers."
      portalPathPrefix="/call-center"
    />
  );
}
