import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { useConfirm } from '../../../components/ui/ConfirmDialog';
import { Stepper, type StepDefinition } from '../../../components/ui/Stepper';
import { IncidentDetailsStep } from '../components/wizard/IncidentDetailsStep';
import { UploadDocumentsStep } from '../components/wizard/UploadDocumentsStep';
import { VehicleDetailsStep } from '../components/wizard/VehicleDetailsStep';
import { YourInfoStep } from '../components/wizard/YourInfoStep';
import {
  STEP_FIELDS,
  emptyClaimWizardValues,
  type ClaimWizardValues,
} from '../types/claim-wizard.types';

const STEPS: StepDefinition[] = [
  { label: 'Your Information', description: 'Personal and contact details' },
  { label: 'Vehicle Details', description: 'Information about your vehicle' },
  { label: 'Incident Details', description: 'Damage and insurance information' },
  { label: 'Upload Documents', description: 'Photos and supporting documents' },
];

export function SubmitClaimPage() {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [step, setStep] = useState(0);
  const [damagePhotos, setDamagePhotos] = useState<File[]>([]);
  const [supportingDocs, setSupportingDocs] = useState<File[]>([]);
  const [photosError, setPhotosError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isDirty },
  } = useForm<ClaimWizardValues>({
    defaultValues: emptyClaimWizardValues(),
    mode: 'onTouched',
  });

  const isLastStep = step === STEPS.length - 1;

  const handleNext = async () => {
    const fields = STEP_FIELDS[step];
    if (fields.length > 0) {
      const valid = await trigger(fields, { shouldFocus: true });
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handlePrevious = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleStepClick = (index: number) => {
    // Only allow navigating backwards
    if (index < step) setStep(index);
  };

  const handleCancel = async () => {
    if (isDirty || damagePhotos.length || supportingDocs.length) {
      const ok = await confirm({
        title: 'Discard this claim?',
        message: 'Your progress will be lost.',
        confirmLabel: 'Discard',
        cancelLabel: 'Keep editing',
        variant: 'destructive',
      });
      if (!ok) return;
    }
    navigate('/customer');
  };

  const onSubmit = async (values: ClaimWizardValues) => {
    if (damagePhotos.length === 0) {
      setPhotosError('Please upload at least one damage photo');
      return;
    }
    setPhotosError(undefined);
    setSubmitting(true);
    try {
      // TODO: Wire to claims API. For now, mock a small delay then navigate.
      await new Promise((resolve) => setTimeout(resolve, 600));
      const referenceNo = `WC-${new Date().getFullYear()}-${Math.floor(
        Math.random() * 900 + 100,
      )}`;
      // eslint-disable-next-line no-console
      console.info('Claim submitted:', {
        referenceNo,
        ...values,
        damagePhotos: damagePhotos.map((f) => f.name),
        supportingDocs: supportingDocs.map((f) => f.name),
      });
      navigate('/customer/submitted', {
        replace: true,
        state: { referenceNo },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="rounded-xl bg-card p-6 sm:p-8">
        <Stepper
          steps={STEPS}
          currentStep={step}
          onStepClick={handleStepClick}
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8"
          noValidate
        >
          {step === 0 && <YourInfoStep register={register} errors={errors} />}
          {step === 1 && (
            <VehicleDetailsStep register={register} errors={errors} />
          )}
          {step === 2 && (
            <IncidentDetailsStep register={register} errors={errors} />
          )}
          {step === 3 && (
            <UploadDocumentsStep
              damagePhotos={damagePhotos}
              supportingDocs={supportingDocs}
              onDamagePhotosChange={(files) => {
                setDamagePhotos(files);
                if (files.length > 0) setPhotosError(undefined);
              }}
              onSupportingDocsChange={setSupportingDocs}
              damagePhotosError={photosError}
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
                Submit Claim
              </Button>
            ) : (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
