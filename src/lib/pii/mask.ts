export function maskPhone(phone: string): string {
  return phone.replace(/(\d{3})\d{3}(\d{4})/, '($1) ***-$2');
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