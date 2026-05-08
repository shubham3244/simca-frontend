import { useMemo, useState, type ReactNode } from 'react';
import { useForm, type UseFormRegister, type FieldErrors } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { useConfirm } from '../../../components/ui/ConfirmDialog';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { Textarea } from '../../../components/ui/Textarea';

type TabValue = 'info' | 'parts';
type ClaimSource = 'CSR' | 'CUSTOMER' | 'WORKSHOP' | 'API';
type YesNo = 'YES' | 'NO' | '';

interface NewClaimFormValues {
  source: ClaimSource;
  carrier: string;
  workshopName: string;
  claimNumber: string;
  policyNumber: string;
  effectiveDate: string;
  expiryDate: string;
  lossDate: string;
  deductible: string;
  replacementCost: YesNo;
  windshieldOnPolicy: YesNo;
  causeOfClaim: string;
  description: string;

  customerFirstName: string;
  customerLastName: string;
  customerAddress: string;
  customerCity: string;
  customerProvinceState: string;
  customerPostalCode: string;
  customerEmail: string;
  customerPhone: string;

  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleBodyStyle: string;
  vehicleVin: string;
  vehicleLicensePlate: string;
  vehicleOdometerKm: string;

  externalNote: string;
  internalNotes: string;
}

const CARRIERS = ['State Farm', 'Geico', 'Allstate', 'Progressive', 'Liberty Mutual'];
const CAUSES = [
  'Road Debris',
  'Vandalism',
  'Accident',
  'Weather Damage',
  'Other',
];

const NOTE_WORD_LIMIT = 200;

function countWords(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

function defaultValues(): NewClaimFormValues {
  // Mock auto-generated control number — real backend would assign
  return {
    source: 'CSR',
    carrier: '',
    workshopName: '',
    claimNumber: '',
    policyNumber: '',
    effectiveDate: '',
    expiryDate: '',
    lossDate: '',
    deductible: '',
    replacementCost: '',
    windshieldOnPolicy: '',
    causeOfClaim: '',
    description: '',

    customerFirstName: '',
    customerLastName: '',
    customerAddress: '',
    customerCity: '',
    customerProvinceState: '',
    customerPostalCode: '',
    customerEmail: '',
    customerPhone: '',

    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleBodyStyle: '',
    vehicleVin: '',
    vehicleLicensePlate: '',
    vehicleOdometerKm: '',

    externalNote: '',
    internalNotes: '',
  };
}

export function NewClaimPage() {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [tab, setTab] = useState<TabValue>('info');
  // Mock control number — backend would assign on save
  const controlNo = useMemo(
    () => `WC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
    [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    watch,
  } = useForm<NewClaimFormValues>({
    defaultValues: defaultValues(),
  });

  const externalNoteWords = countWords(watch('externalNote'));
  const internalNotesWords = countWords(watch('internalNotes'));

  const handleCancel = async () => {
    if (isDirty) {
      const ok = await confirm({
        title: 'Discard this claim?',
        message: 'Your unsaved changes will be lost.',
        confirmLabel: 'Discard',
        cancelLabel: 'Keep editing',
        variant: 'destructive',
      });
      if (!ok) return;
    }
    navigate('/call-center/claims');
  };

  const onSubmit = async (values: NewClaimFormValues) => {
    // TODO: wire to claims API. For now, log + navigate.
    // eslint-disable-next-line no-console
    console.info('New claim submitted:', { controlNo, ...values });
    navigate('/call-center/claims');
  };

  const placeholderAction = (label: string) => () => {
    window.alert(`${label} — coming soon (needs backend integration).`);
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Back link */}
      <div>
        <Link
          to="/call-center/claims"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Claims
        </Link>
      </div>

      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">New Claim</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            {controlNo}
          </h1>
        </div>
      </header>

      {/* Action bar */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={placeholderAction('Existing Client Search')}
          leftIcon={
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          }
        >
          Existing Client Search
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={placeholderAction('Send Work Order PDF')}
          leftIcon={
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          }
        >
          Send Work Order PDF
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={placeholderAction('View Logs')}
          leftIcon={
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
        >
          View Logs
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          leftIcon={
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
          }
        >
          Print Claim
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancel}
          leftIcon={
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          }
        >
          Cancel
        </Button>
      </div>

      {/* Tabs */}
      <Tabs<TabValue> value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="info">Claim Info</TabsTrigger>
          <TabsTrigger value="parts">Parts &amp; Invoice</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="info">
            <form
              id="new-claim-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
              noValidate
            >
              <ClaimInformationSection
                controlNo={controlNo}
                register={register}
                errors={errors}
              />
              <CustomerInformationSection register={register} errors={errors} />
              <VehicleInformationSection register={register} errors={errors} />
              <WorkOrderNotesSection
                register={register}
                errors={errors}
                externalNoteWords={externalNoteWords}
                internalNotesWords={internalNotesWords}
              />
            </form>
          </TabsContent>

          <TabsContent value="parts">
            <PartsEmptyState />
          </TabsContent>
        </div>
      </Tabs>

      {/* Sticky footer */}
      <FormFooter
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Sections
// ───────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg bg-secondary p-6">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-3">
        {children}
      </div>
    </section>
  );
}

interface RegisterProps {
  register: UseFormRegister<NewClaimFormValues>;
  errors: FieldErrors<NewClaimFormValues>;
}

function ClaimInformationSection({
  controlNo,
  register,
  errors,
}: RegisterProps & { controlNo: string }) {
  return (
    <Section title="Claim Information">
      <ReadOnlyField label="Control Number" value={controlNo} />
      <ReadOnlyField label="Status" value="Open" />
      <Select label="Source" required {...register('source')}>
        <option value="CSR">CSR</option>
        <option value="CUSTOMER">Customer</option>
        <option value="WORKSHOP">Workshop</option>
        <option value="API">API</option>
      </Select>

      <Select
        label="Carrier/Insurance Company"
        required
        error={errors.carrier?.message}
        {...register('carrier', { required: 'Carrier is required' })}
      >
        <option value="">Select carrier...</option>
        {CARRIERS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>
      <Input
        label="Workshop/Shop"
        placeholder="Search shop..."
        error={errors.workshopName?.message}
        {...register('workshopName')}
      />
      <Input
        label="Claim Number"
        placeholder="CLM-2024-12345"
        {...register('claimNumber')}
      />

      <Input
        label="Policy Number"
        placeholder="POL-2024-12345"
        {...register('policyNumber')}
      />
      <Input
        label="Effective Date"
        type="date"
        {...register('effectiveDate')}
      />
      <Input label="Expiry Date" type="date" {...register('expiryDate')} />

      <Input
        label="Loss Date"
        type="date"
        required
        error={errors.lossDate?.message}
        {...register('lossDate', { required: 'Loss date is required' })}
      />
      <Input
        label="Deductible"
        type="number"
        placeholder="500"
        leftIcon={<span className="text-muted-foreground">$</span>}
        {...register('deductible')}
      />
      <Select label="Replacement Cost?" {...register('replacementCost')}>
        <option value="">Select...</option>
        <option value="YES">Yes</option>
        <option value="NO">No</option>
      </Select>

      <Select label="Windshield on Policy?" {...register('windshieldOnPolicy')}>
        <option value="">Select...</option>
        <option value="YES">Yes</option>
        <option value="NO">No</option>
      </Select>
      <Select label="Cause of Claim" {...register('causeOfClaim')}>
        <option value="">Select cause...</option>
        {CAUSES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>

      <div className="md:col-span-3">
        <Textarea
          label="Claim Description"
          placeholder="Describe the damage and incident..."
          rows={4}
          {...register('description')}
        />
      </div>
    </Section>
  );
}

function CustomerInformationSection({ register, errors }: RegisterProps) {
  return (
    <Section title="Customer Information">
      <Input
        label="First Name"
        required
        error={errors.customerFirstName?.message}
        {...register('customerFirstName', { required: 'First name is required' })}
      />
      <Input
        label="Last Name"
        required
        error={errors.customerLastName?.message}
        {...register('customerLastName', { required: 'Last name is required' })}
      />
      <Input
        label="Address"
        placeholder="Street address"
        {...register('customerAddress')}
      />
      <Input label="City" placeholder="City" {...register('customerCity')} />
      <Input
        label="Province/State"
        placeholder="Province or State"
        {...register('customerProvinceState')}
      />
      <Input
        label="Postal Code"
        placeholder="Postal/ZIP code"
        {...register('customerPostalCode')}
      />
      <Input
        label="Email"
        type="email"
        placeholder="email@example.com"
        error={errors.customerEmail?.message}
        {...register('customerEmail', {
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Enter a valid email address',
          },
        })}
      />
      <Input
        label="Phone"
        type="tel"
        placeholder="(555) 123-4567"
        {...register('customerPhone')}
      />
    </Section>
  );
}

function VehicleInformationSection({ register, errors }: RegisterProps) {
  return (
    <Section title="Vehicle Information">
      <Input
        label="Year"
        type="number"
        placeholder="2024"
        error={errors.vehicleYear?.message}
        {...register('vehicleYear', {
          min: { value: 1900, message: 'Year must be 1900 or later' },
          max: { value: 2100, message: 'Year must be 2100 or earlier' },
        })}
      />
      <Input label="Make" placeholder="Toyota" {...register('vehicleMake')} />
      <Input label="Model" placeholder="Camry" {...register('vehicleModel')} />
      <Input
        label="Body Style"
        placeholder="Sedan"
        {...register('vehicleBodyStyle')}
      />
      <Input
        label="VIN"
        placeholder="1HGBH41JXMN109186"
        error={errors.vehicleVin?.message}
        {...register('vehicleVin', {
          minLength: { value: 17, message: 'VIN must be 17 characters' },
          maxLength: { value: 17, message: 'VIN must be 17 characters' },
        })}
      />
      <Input
        label="License Plate Number"
        placeholder="ABC-1234"
        {...register('vehicleLicensePlate')}
      />
      <Input
        label="Odometer Reading"
        type="number"
        placeholder="45000"
        rightIcon={<span className="text-xs text-muted-foreground">km</span>}
        {...register('vehicleOdometerKm')}
      />
    </Section>
  );
}

function WorkOrderNotesSection({
  register,
  errors,
  externalNoteWords,
  internalNotesWords,
}: RegisterProps & {
  externalNoteWords: number;
  internalNotesWords: number;
}) {
  return (
    <section className="rounded-lg bg-secondary p-6">
      <h2 className="text-lg font-semibold text-foreground">Work Order Notes</h2>

      <div className="mt-6 flex flex-col gap-5">
        <Textarea
          label="External Note"
          rows={4}
          placeholder="Enter external notes (visible to customer, max 200 words)..."
          rightLabelSlot={
            <WordCount count={externalNoteWords} limit={NOTE_WORD_LIMIT} />
          }
          error={errors.externalNote?.message}
          {...register('externalNote', {
            validate: (value) =>
              countWords(value) <= NOTE_WORD_LIMIT ||
              `Maximum ${NOTE_WORD_LIMIT} words`,
          })}
        />

        <Textarea
          label="Internal Notes"
          rows={4}
          placeholder="Enter internal notes (internal use only, max 200 words)..."
          rightLabelSlot={
            <WordCount count={internalNotesWords} limit={NOTE_WORD_LIMIT} />
          }
          error={errors.internalNotes?.message}
          {...register('internalNotes', {
            validate: (value) =>
              countWords(value) <= NOTE_WORD_LIMIT ||
              `Maximum ${NOTE_WORD_LIMIT} words`,
          })}
        />
      </div>
    </section>
  );
}

function WordCount({ count, limit }: { count: number; limit: number }) {
  const over = count > limit;
  return (
    <span className={over ? 'text-destructive' : 'text-muted-foreground'}>
      {count} / {limit} words
    </span>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex h-10 items-center rounded-md border border-border bg-muted px-3 text-sm text-foreground">
        {value}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Parts & Invoice tab — empty state with action buttons
// ───────────────────────────────────────────────────────────

function PartsEmptyState() {
  const PartIcon = (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" leftIcon={PartIcon}>
          Add from NAGS
        </Button>
        <Button variant="outline" size="sm" leftIcon={PartIcon}>
          Add Custom Part
        </Button>
        <Button variant="outline" size="sm" leftIcon={PartIcon}>
          Add Deductible Buy Back
        </Button>
        <Button variant="outline" size="sm" leftIcon={PartIcon}>
          Add Calibration
        </Button>
      </div>

      <section className="rounded-lg bg-secondary p-6">
        <h2 className="text-lg font-semibold text-foreground">Parts List</h2>
        <div className="mt-4 rounded-md border border-dashed border-border bg-background p-8 text-center text-sm text-muted-foreground">
          No parts added yet. Save the claim first, then add parts here.
        </div>
      </section>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Sticky footer
// ───────────────────────────────────────────────────────────

function FormFooter({
  onCancel,
  isSubmitting,
}: {
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div className="sticky bottom-0 -mx-6 mt-2 flex justify-end gap-3 border-t border-border bg-background px-6 py-4">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" form="new-claim-form" isLoading={isSubmitting}>
        Save &amp; Continue
      </Button>
    </div>
  );
}
