import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '../../../../components/ui/Input';
import type { ClaimWizardValues } from '../../types/claim-wizard.types';

interface YourInfoStepProps {
  register: UseFormRegister<ClaimWizardValues>;
  errors: FieldErrors<ClaimWizardValues>;
}

export function YourInfoStep({ register, errors }: YourInfoStepProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground">Your Information</h2>
      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
        <Input
          label="First Name"
          required
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register('firstName', { required: 'First name is required' })}
        />
        <Input
          label="Last Name"
          required
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register('lastName', { required: 'Last name is required' })}
        />
        <Input
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email',
            },
          })}
        />
        <Input
          label="Phone Number"
          type="tel"
          required
          autoComplete="tel"
          placeholder="(555) 123-4567"
          error={errors.phone?.message}
          {...register('phone', { required: 'Phone is required' })}
        />
        <Input
          label="Driver's License Number"
          required
          autoComplete="off"
          error={errors.driverLicense?.message}
          {...register('driverLicense', {
            required: "Driver's license is required",
          })}
        />
        <Input
          label="Street Address"
          required
          autoComplete="street-address"
          error={errors.streetAddress?.message}
          {...register('streetAddress', { required: 'Street address is required' })}
        />
        <Input
          label="City"
          required
          autoComplete="address-level2"
          error={errors.city?.message}
          {...register('city', { required: 'City is required' })}
        />
        <Input
          label="Province/State"
          required
          autoComplete="address-level1"
          error={errors.provinceState?.message}
          {...register('provinceState', { required: 'Province/State is required' })}
        />
        <Input
          label="Postal Code"
          required
          autoComplete="postal-code"
          error={errors.postalCode?.message}
          {...register('postalCode', { required: 'Postal code is required' })}
        />
      </div>
    </section>
  );
}
