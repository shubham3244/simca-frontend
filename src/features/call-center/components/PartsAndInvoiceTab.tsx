import { Button } from '../../../components/ui/Button';
import { Field } from '../../../components/ui/Field';
import { formatCurrency } from '../../../utils/format';
import type { ClaimDetail } from '../types/claim-detail.types';

interface PartsAndInvoiceTabProps {
  claim: ClaimDetail;
  onCalculate?: () => void;
  onUploadInvoice?: () => void;
}

export function PartsAndInvoiceTab({
  claim,
  onCalculate,
  onUploadInvoice,
}: PartsAndInvoiceTabProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Parts List */}
      <section className="rounded-lg bg-secondary p-6">
        <h2 className="text-lg font-semibold text-foreground">Parts List</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-160 text-sm">
            <thead>
              <tr className="border-b border-border text-left text-foreground">
                <th className="py-3 pr-4 font-semibold">Part Number</th>
                <th className="py-3 pr-4 font-semibold">Description</th>
                <th className="py-3 pr-4 font-semibold">Taxable</th>
                <th className="py-3 pr-4 font-semibold">List Price</th>
                <th className="py-3 pr-4 font-semibold">Shop Price</th>
                <th className="py-3 pr-4 font-semibold">Carrier Price</th>
              </tr>
            </thead>
            <tbody>
              {claim.parts.map((part) => (
                <tr
                  key={part.partNumber}
                  className="border-b border-border/60 last:border-b-0"
                >
                  <td className="py-3 pr-4 text-foreground">{part.partNumber}</td>
                  <td className="py-3 pr-4 text-foreground">{part.description}</td>
                  <td className="py-3 pr-4 text-foreground">
                    {part.taxable ? 'Yes' : 'No'}
                  </td>
                  <td className="py-3 pr-4 text-foreground">
                    {formatCurrency(part.listPrice)}
                  </td>
                  <td className="py-3 pr-4 text-foreground">
                    {formatCurrency(part.shopPrice)}
                  </td>
                  <td className="py-3 pr-4 text-foreground">
                    {formatCurrency(part.carrierPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Labour & Pricing Breakdown */}
      <section className="rounded-lg bg-secondary p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Labour &amp; Pricing Breakdown
        </h2>

        <ul className="mt-4 flex flex-col">
          {claim.labour.map((line) => (
            <li
              key={line.label}
              className="flex items-center justify-between border-b border-border/60 py-3 last:border-b-0"
            >
              <span className="text-base text-foreground">{line.label}</span>
              <span className="text-base font-semibold text-foreground">
                {formatCurrency(line.amount)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between border-t-2 border-border pt-4">
          <span className="text-base font-bold text-foreground">Total Estimate</span>
          <span className="text-base font-bold text-foreground">
            {formatCurrency(claim.totalEstimate)}
          </span>
        </div>
      </section>

      {/* Shop Invoice */}
      <section className="rounded-lg bg-secondary p-6">
        <h2 className="text-lg font-semibold text-foreground">Shop Invoice</h2>

        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-8 md:grid-cols-3">
          <Field label="Invoice Number">{claim.invoice.invoiceNumber}</Field>
          <Field label="Invoice Date">
            {claim.invoice.invoiceDate ?? 'dd-mm-yyyy'}
          </Field>
          <Field label="Shop Amount">{formatCurrency(claim.invoice.shopAmount)}</Field>

          <Field label="Pre-Tax Amount">
            {formatCurrency(claim.invoice.preTaxAmount)}
          </Field>
          <Field label="Tax %">{claim.invoice.taxPercent}</Field>
          <Field label="Tax Amount">{formatCurrency(claim.invoice.taxAmount)}</Field>

          <Field label="Shop Admin Fee">
            {formatCurrency(claim.invoice.shopAdminFee)}
          </Field>
          <Field label="Shop Admin Tax">
            {formatCurrency(claim.invoice.shopAdminTax)}
          </Field>
          <Field label="Deductible">
            {formatCurrency(claim.invoice.deductible)}
          </Field>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-1 flex-wrap gap-x-8 gap-y-4">
            <Field label="Total Sum">{formatCurrency(claim.invoice.totalSum)}</Field>
            <Field label="Variance">{formatCurrency(claim.invoice.variance)}</Field>
          </div>
          <Button onClick={onCalculate}>Calculate</Button>
        </div>
      </section>

      <div>
        <Button
          variant="outline"
          onClick={onUploadInvoice}
          leftIcon={
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          }
        >
          Upload Invoice Copy
        </Button>
      </div>
    </div>
  );
}
