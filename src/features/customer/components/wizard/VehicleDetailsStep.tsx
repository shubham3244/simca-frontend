import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '../../../../components/ui/Input';
import type { ClaimWizardValues } from '../../types/claim-wizard.types';

interface VehicleDetailsStepProps {
  register: UseFormRegister<ClaimWizardValues>;
  errors: FieldErrors<ClaimWizardValues>;
}

export function VehicleDetailsStep({ register, errors }: VehicleDetailsStepProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground">Vehicle Details</h2>
      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
        <Input
          label="Year"
          type="number"
          required
          placeholder="2024"
          error={errors.vehicleYear?.message}
          {...register('vehicleYear', {
            required: 'Year is required',
            min: { value: 1900, message: 'Year must be 1900 or later' },
            max: { value: 2100, message: 'Year must be 2100 or earlier' },
          })}
        />
        <Input
          label="Make"
          required
          placeholder="Toyota"
          error={errors.vehicleMake?.message}
          {...register('vehicleMake', { required: 'Make is required' })}
        />
        <Input
          label="Model"
          required
          placeholder="Camry"
          error={errors.vehicleModel?.message}
          {...register('vehicleModel', { required: 'Model is required' })}
        />
        <Input
          label="Color"
          placeholder="Silver"
          error={errors.vehicleColor?.message}
          {...register('vehicleColor')}
        />
        <Input
          label="VIN (Vehicle Identification Number)"
          required
          placeholder="1HGBH41JXMN109186"
          error={errors.vehicleVin?.message}
          {...register('vehicleVin', {
            required: 'VIN is required',
            minLength: { value: 17, message: 'VIN must be 17 characters' },
            maxLength: { value: 17, message: 'VIN must be 17 characters' },
          })}
        />
        <Input
          label="Odometer Reading"
          type="number"
          required
          placeholder="45000"
          rightIcon={<span className="text-xs text-muted-foreground">km</span>}
          error={errors.vehicleOdometer?.message}
          {...register('vehicleOdometer', {
            required: 'Odometer reading is required',
          })}
        />
      </div>
    </section>
  );
}
