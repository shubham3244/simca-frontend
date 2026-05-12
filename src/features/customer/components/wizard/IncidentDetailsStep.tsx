import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Textarea } from '../../../../components/ui/Textarea';
import type { ClaimWizardValues } from '../../types/claim-wizard.types';

const CAUSES = [
  'Rock chip',
  'Accident',
  'Vandalism',
  'Weather damage',
  'Road debris',
  'Other',
];

interface IncidentDetailsStepProps {
  register: UseFormRegister<ClaimWizardValues>;
  errors: FieldErrors<ClaimWizardValues>;
}

export function IncidentDetailsStep({
  register,
  errors,
}: IncidentDetailsStepProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground">Incident Details</h2>
      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
        <Input
          label="Date of Loss"
          type="date"
          required
          error={errors.dateOfLoss?.message}
          {...register('dateOfLoss', { required: 'Date of loss is required' })}
        />
        <Select
          label="Cause of Damage"
          required
          error={errors.causeOfDamage?.message}
          {...register('causeOfDamage', { required: 'Cause is required' })}
        >
          <option value="">Select cause...</option>
          {CAUSES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        <div className="md:col-span-2">
          <Textarea
            label="Damage Description"
            required
            rows={4}
            placeholder="Please describe the damage in detail..."
            error={errors.damageDescription?.message}
            {...register('damageDescription', {
              required: 'Description is required',
              minLength: {
                value: 10,
                message: 'Please describe in at least 10 characters',
              },
            })}
          />
        </div>

        <Input
          label="Insurance Company"
          required
          placeholder="e.g., State Farm, Geico"
          error={errors.insuranceCompany?.message}
          {...register('insuranceCompany', {
            required: 'Insurance company is required',
          })}
        />
        <Input
          label="Policy Number"
          required
          placeholder="POL-2024-12345"
          error={errors.policyNumber?.message}
          {...register('policyNumber', { required: 'Policy number is required' })}
        />
        <Input
          label="Claim Number"
          placeholder="CLM-2024-67890"
          helperText="Leave blank if you haven't filed with your carrier yet"
          error={errors.claimNumber?.message}
          {...register('claimNumber')}
        />
      </div>
    </section>
  );
}
