import { LoginShell } from '../components/LoginShell';

export function CustomerLoginPage() {
  return (
    <LoginShell
      portal="CUSTOMER"
      portalLabel="Customer Portal"
      portalTagline="Submit your windshield damage claim and track repair status — all in one place."
      portalPathPrefix="/customer"
    />
  );
}
