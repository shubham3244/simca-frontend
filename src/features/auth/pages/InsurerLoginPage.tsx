import { LoginShell } from '../components/LoginShell';

export function InsurerLoginPage() {
  return (
    <LoginShell
      portal="INSURER"
      portalLabel="Insurer Portal"
      portalTagline="Review claims, approve payments, and audit financial activity across the network."
      portalPathPrefix="/insurer"
    />
  );
}
