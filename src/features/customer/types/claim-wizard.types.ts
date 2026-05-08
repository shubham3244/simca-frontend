export interface ClaimWizardValues {
  // Step 1: Your Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  driverLicense: string;
  streetAddress: string;
  city: string;
  provinceState: string;
  postalCode: string;

  // Step 2: Vehicle Details
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleColor: string;
  vehicleVin: string;
  vehicleOdometer: string;

  // Step 3: Incident Details
  dateOfLoss: string;
  causeOfDamage: string;
  damageDescription: string;
  insuranceCompany: string;
  policyNumber: string;
  claimNumber: string;
}

export type ClaimWizardField = keyof ClaimWizardValues;

export const STEP_FIELDS: Record<number, ClaimWizardField[]> = {
  0: [
    'firstName',
    'lastName',
    'email',
    'phone',
    'driverLicense',
    'streetAddress',
    'city',
    'provinceState',
    'postalCode',
  ],
  1: [
    'vehicleYear',
    'vehicleMake',
    'vehicleModel',
    'vehicleColor',
    'vehicleVin',
    'vehicleOdometer',
  ],
  2: [
    'dateOfLoss',
    'causeOfDamage',
    'damageDescription',
    'insuranceCompany',
    'policyNumber',
    'claimNumber',
  ],
  3: [],
};

export function emptyClaimWizardValues(): ClaimWizardValues {
  return {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    driverLicense: '',
    streetAddress: '',
    city: '',
    provinceState: '',
    postalCode: '',

    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleColor: '',
    vehicleVin: '',
    vehicleOdometer: '',

    dateOfLoss: '',
    causeOfDamage: '',
    damageDescription: '',
    insuranceCompany: '',
    policyNumber: '',
    claimNumber: '',
  };
}
