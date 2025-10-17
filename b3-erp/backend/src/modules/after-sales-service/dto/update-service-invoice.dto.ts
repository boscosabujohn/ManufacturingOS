export class UpdateServiceInvoiceDto {
  dueDate?: Date;
  paymentTerms?: string;

  notes?: string;
  internalNotes?: string;

  updatedBy: string;
}
