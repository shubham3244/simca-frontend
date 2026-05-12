import { useState, type ChangeEvent } from 'react';
import { useForm, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { useConfirm } from '../../../components/ui/ConfirmDialog';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Stepper, type StepDefinition } from '../../../components/ui/Stepper';
import { Textarea } from '../../../components/ui/Textarea';
import {
  WORKSHOP_STEP_FIELDS,
  emptyWorkshopWizardValues,
  type WorkshopClaimWizardValues,
} from '../types/workshop-wizard.types';

const STEPS: StepDefinition[] = [
  { label: 'Incident', description: 'When and how the damage occurred' },
  { label: 'Customer', description: 'Walk-in / phone-in customer details' },
  { label: 'Vehicle', description: 'Vehicle being serviced' },
  { label: 'Upload', description: 'Photos & supporting documents' },
];

const CAUSES = [
  'Rock chip',
  'Accident',
  'Vandalism',
  'Weather damage',
  'Road debris',
  'Other',
];

interface WorkshopNewClaimWizardProps {
  onCancel?: () => void;
}

export function WorkshopNewClaimWizard({ onCancel }: WorkshopNewClaimWizardProps) {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [step, setStep] = useState(0);
  const [damagePhotos, setDamagePhotos] = useState<File[]>([]);
  const [photosError, setPhotosError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isDirty },
  } = useForm<WorkshopClaimWizardValues>({
    defaultValues: emptyWorkshopWizardValues(),
    mode: 'onTouched',
  });

  const isLastStep = step === STEPS.length - 1;

  const handleNext = async () => {
    const fields = WORKSHOP_STEP_FIELDS[step];
    if (fields.length > 0) {
      const valid = await trigger(fields, { shouldFocus: true });
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handlePrevious = () => setStep((s) => Math.max(s - 1, 0));

  const handleStepClick = (index: number) => {
    if (index < step) setStep(index);
  };

  const handleCancel = async () => {
    if (isDirty || damagePhotos.length) {
      const ok = await confirm({
        title: 'Discard this submission?',
        message: 'Your progress will be lost.',
        confirmLabel: 'Discard',
        cancelLabel: 'Keep editing',
        variant: 'destructive',
      });
      if (!ok) return;
    }
    if (onCancel) onCancel();
    else navigate('/workshop/work-orders');
  };

  const onSubmit = async (values: WorkshopClaimWizardValues) => {
    if (damagePhotos.length === 0) {
      setPhotosError('At least one damage photo is required');
      return;
    }
    setPhotosError(undefined);
    setSubmitting(true);
    try {
      // TODO: real backend POST /workshop/work-orders
      await new Promise((r) => setTimeout(r, 500));
      const workOrderNo = `WO-${new Date().getFullYear()}-${Math.floor(
        Math.random() * 900 + 100,
      )}`;
      // eslint-disable-next-line no-console
      console.info('[workshop] submitted on behalf of customer:', {
        workOrderNo,
        ...values,
        damagePhotos: damagePhotos.map((f) => f.name),
      });
      await confirm({
        title: 'Submission received',
        message: `Work order ${workOrderNo} has been queued for CSR audit.`,
        confirmLabel: 'View Work Orders',
        cancelLabel: 'Close',
      });
      navigate('/workshop/work-orders');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl bg-card p-6 sm:p-8">
      <Stepper
        steps={STEPS}
        currentStep={step}
        onStepClick={handleStepClick}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8" noValidate>
        {step === 0 && <IncidentStep register={register} errors={errors} />}
        {step === 1 && <CustomerStep register={register} errors={errors} />}
        {step === 2 && <VehicleStep register={register} errors={errors} />}
        {step === 3 && (
          <UploadStep
            files={damagePhotos}
            error={photosError}
            onFilesChange={(next) => {
              setDamagePhotos(next);
              if (next.length > 0) setPhotosError(undefined);
            }}
          />
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={step === 0 ? handleCancel : handlePrevious}
          >
            {step === 0 ? 'Cancel' : 'Previous'}
          </Button>
          {isLastStep ? (
            <Button type="submit" isLoading={submitting}>
              Submit on Behalf of Customer
            </Button>
          ) : (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

interface StepProps {
  register: UseFormRegister<WorkshopClaimWizardValues>;
  errors: FieldErrors<WorkshopClaimWizardValues>;
}

function IncidentStep({ register, errors }: StepProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground">Incident Details</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Captured at the shop based on the customer’s account of the damage.
      </p>
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
            placeholder="Describe the damage you observed during inspection..."
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
          {...register('policyNumber', {
            required: 'Policy number is required',
          })}
        />
        <Input
          label="Claim Number (if available)"
          placeholder="CLM-2024-67890"
          helperText="Optional — leave blank if the carrier hasn’t opened a claim yet"
          error={errors.claimNumber?.message}
          {...register('claimNumber')}
        />
      </div>
    </section>
  );
}

function CustomerStep({ register, errors }: StepProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground">Customer Information</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Confirm the customer’s details. They’ll receive status updates and the
        final invoice at the contact info entered here.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
        <Input
          label="First Name"
          required
          error={errors.firstName?.message}
          {...register('firstName', { required: 'First name is required' })}
        />
        <Input
          label="Last Name"
          required
          error={errors.lastName?.message}
          {...register('lastName', { required: 'Last name is required' })}
        />
        <Input
          label="Email"
          type="email"
          required
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
          label="Phone"
          type="tel"
          required
          placeholder="(555) 123-4567"
          error={errors.phone?.message}
          {...register('phone', { required: 'Phone is required' })}
        />
        <div className="md:col-span-2">
          <Input
            label="Street Address"
            required
            error={errors.streetAddress?.message}
            {...register('streetAddress', {
              required: 'Street address is required',
            })}
          />
        </div>
        <Input
          label="City"
          required
          error={errors.city?.message}
          {...register('city', { required: 'City is required' })}
        />
        <Input
          label="Province / State"
          required
          error={errors.provinceState?.message}
          {...register('provinceState', {
            required: 'Province/State is required',
          })}
        />
        <Input
          label="Postal Code"
          required
          error={errors.postalCode?.message}
          {...register('postalCode', { required: 'Postal code is required' })}
        />
      </div>
    </section>
  );
}

function VehicleStep({ register, errors }: StepProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground">Vehicle Details</h2>
      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
        <Input
          label="Year"
          required
          inputMode="numeric"
          placeholder="2023"
          error={errors.vehicleYear?.message}
          {...register('vehicleYear', { required: 'Year is required' })}
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
          required
          placeholder="Silver"
          error={errors.vehicleColor?.message}
          {...register('vehicleColor', { required: 'Color is required' })}
        />
        <Input
          label="VIN"
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
          label="Odometer (km)"
          required
          inputMode="numeric"
          placeholder="45000"
          error={errors.vehicleOdometer?.message}
          {...register('vehicleOdometer', {
            required: 'Odometer reading is required',
          })}
        />
      </div>
    </section>
  );
}

function UploadStep({
  files,
  error,
  onFilesChange,
}: {
  files: File[];
  error?: string;
  onFilesChange: (files: File[]) => void;
}) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    onFilesChange([...files, ...Array.from(list)]);
    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground">Upload Documents</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Attach photos of the damage. These are required by the carrier before
        the claim can move forward.
      </p>

      <label
        className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed bg-background px-6 py-10 text-center transition-colors hover:border-primary/40 ${
          error ? 'border-destructive' : 'border-border'
        }`}
      >
        <svg
          className="size-8 text-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="mt-3 text-sm font-medium text-foreground">
          Click to add photos of the damage
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Multiple angles preferred — chip, surround, and any pre-existing damage
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="hidden"
        />
      </label>

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

      {files.length > 0 && (
        <ul className="mt-4 flex flex-col gap-1.5">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <span className="truncate text-foreground">{file.name}</span>
              <button
                type="button"
                onClick={() => handleRemove(i)}
                aria-label={`Remove ${file.name}`}
                className="text-muted-foreground hover:text-destructive"
              >
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
