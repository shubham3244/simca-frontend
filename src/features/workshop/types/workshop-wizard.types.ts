export interface WorkshopClaimWizardValues {
  // Step 1: Incident
  dateOfLoss: string;
  causeOfDamage: string;
  damageDescription: string;
  insuranceCompany: string;
  policyNumber: string;
  claimNumber: string;

  // Step 2: Customer (collected on customer's behalf at the workshop)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  provinceState: string;
  postalCode: string;

  // Step 3: Vehicle
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleLicensePlate: string;
  vehicleVin: string;
  vehicleOdometer: string;
}

export type WorkshopClaimWizardField = keyof WorkshopClaimWizardValues;

export const WORKSHOP_STEP_FIELDS: Record<number, WorkshopClaimWizardField[]> = {
  0: [
    'dateOfLoss',
    'causeOfDamage',
    'damageDescription',
    'insuranceCompany',
    'policyNumber',
    'claimNumber',
  ],
  1: [
    'firstName',
    'lastName',
    'email',
    'phone',
    'streetAddress',
    'city',
    'provinceState',
    'postalCode',
  ],
  2: [
    'vehicleYear',
    'vehicleMake',
    'vehicleModel',
    'vehicleLicensePlate',
    'vehicleVin',
    'vehicleOdometer',
  ],
  3: [],
};

export function emptyWorkshopWizardValues(): WorkshopClaimWizardValues {
  return {
    dateOfLoss: '',
    causeOfDamage: '',
    damageDescription: '',
    insuranceCompany: '',
    policyNumber: '',
    claimNumber: '',

    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    provinceState: '',
    postalCode: '',

    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleLicensePlate: '',
    vehicleVin: '',
    vehicleOdometer: '',
  };
}
