export function maskPhone(phone: string): string {
  // Accept any common format — strip non-digits, then re-format the masked output.
  // Handles "5551234567", "555-123-4567", "(555) 123-4567", "+1 (555) 123-4567"...
  const digits = phone.replace(/\D/g, '').slice(-10);
  if (digits.length !== 10) return phone;
  return `(${digits.slice(0, 3)}) ***-${digits.slice(6)}`;
}

export function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  return `${user.slice(0, 1)}***@${domain}`;
}

export function maskVin(vin: string): string {
  return `${vin.slice(0, 3)}****${vin.slice(-4)}`;
}

export function maskCardNumber(card: string): string {
  return `**** **** **** ${card.slice(-4)}`;
}

export function maskLicence(licence: string): string {
  return `${licence.slice(0, 3)}${'*'.repeat(licence.length - 3)}`;
}

export function maskDob(dob: string): string {
  return `** / ** / ${dob.slice(0, 4)}`;
}