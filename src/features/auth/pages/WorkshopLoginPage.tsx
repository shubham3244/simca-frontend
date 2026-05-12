import { LoginShell } from '../components/LoginShell';

export function WorkshopLoginPage() {
  return (
    <LoginShell
      portal="WORKSHOP"
      portalLabel="Workshop Portal"
      portalTagline="Receive assigned work orders, choose parts, and submit invoices from one place."
      portalPathPrefix="/workshop"
    />
  );
}
