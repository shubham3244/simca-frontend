import { Field } from '../../../components/ui/Field';
import { formatCurrency } from '../../../utils/format';
import type { WorkOrderDetail } from '../types/workshop.types';

interface WorkshopPartsInvoiceTabProps {
  detail: WorkOrderDetail;
}

export function WorkshopPartsInvoiceTab({ detail }: WorkshopPartsInvoiceTabProps) {
  return (
    <div className="flex flex-col gap-6">
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
              {detail.parts.map((part) => (
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

      <section className="rounded-lg bg-secondary p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Labour &amp; Pricing Breakdown
        </h2>

        <ul className="mt-4 flex flex-col">
          {detail.labour.map((line) => (
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
            {formatCurrency(detail.totalEstimate)}
          </span>
        </div>
      </section>

      <section className="rounded-lg bg-secondary p-6">
        <h2 className="text-lg font-semibold text-foreground">Shop Invoice</h2>

        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-8 md:grid-cols-3">
          <Field label="Invoice Number">{detail.invoice.invoiceNumber}</Field>
          <Field label="Invoice Date">
            {detail.invoice.invoiceDate ?? 'dd-mm-yyyy'}
          </Field>
          <Field label="Shop Amount">
            {formatCurrency(detail.invoice.shopAmount)}
          </Field>

          <Field label="Pre-Tax Amount">
            {formatCurrency(detail.invoice.preTaxAmount)}
          </Field>
          <Field label="Tax %">{detail.invoice.taxPercent}</Field>
          <Field label="Tax Amount">
            {formatCurrency(detail.invoice.taxAmount)}
          </Field>

          <Field label="Shop Admin Fee">
            {formatCurrency(detail.invoice.shopAdminFee)}
          </Field>
          <Field label="Shop Admin Tax">
            {formatCurrency(detail.invoice.shopAdminTax)}
          </Field>
          <Field label="Deductible">
            {formatCurrency(detail.invoice.deductible)}
          </Field>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-1 flex-wrap gap-x-8 gap-y-4">
            <Field label="Total Sum">
              {formatCurrency(detail.invoice.totalSum)}
            </Field>
            <Field label="Variance">
              {formatCurrency(detail.invoice.variance)}
            </Field>
          </div>
        </div>
      </section>
    </div>
  );
}
