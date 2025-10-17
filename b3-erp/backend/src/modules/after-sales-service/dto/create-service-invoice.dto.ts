export class CreateServiceInvoiceDto {
  invoiceType: string; // 'service' | 'amc' | 'installation' | 'parts' | 'warranty'

  customerId: string;
  customerName: string;
  customerAddress?: string;
  customerGSTIN?: string;

  serviceJobId?: string;
  contractId?: string;
  installationJobId?: string;

  lineItems: Array<{
    itemType: string; // 'labor' | 'parts' | 'travel' | 'emergency_charge' | 'amc_fee' | 'installation_fee'
    description: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    taxRate?: number;
  }>;

  subtotal: number;
  discountAmount?: number;
  taxableAmount: number;

  cgst?: number;
  sgst?: number;
  igst?: number;
  totalTax: number;

  totalAmount: number;
  currency: string;

  paymentTerms: string;
  dueDate: Date;

  notes?: string;
  internalNotes?: string;

  createdBy: string;
}
