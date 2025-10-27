export interface PaymentTerm {
  id: string;
  termCode: string;
  termName: string;
  description: string;

  // Payment Schedule
  daysAfterInvoice: number;
  daysAfterDelivery: number;
  creditPeriod: number; // in days
  paymentMethod: 'immediate' | 'advance' | 'partial' | 'on_delivery' | 'credit';

  // Advance & Partial Payment
  advancePercentage?: number;
  partialPayments?: {
    sequence: number;
    percentage: number;
    daysAfter: number;
    milestone?: string;
  }[];

  // Discounts
  earlyPaymentDiscount?: number;
  earlyPaymentDays?: number;
  cashDiscountPercentage?: number;

  // Penalties
  lateFeePercentage?: number;
  lateFeeStartsAfter?: number; // days
  interestRate?: number; // per annum

  // Applicability
  applicableFor: 'customers' | 'vendors' | 'both';
  isDefault: boolean;
  priority: number;

  // Usage
  customersUsing: number;
  vendorsUsing: number;
  transactionsCount: number;
  totalAmount: number;

  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export const mockPaymentTerms: PaymentTerm[] = [
  {
    id: 'PT001',
    termCode: 'NET30',
    termName: 'Net 30 Days',
    description: 'Payment due within 30 days from invoice date',
    daysAfterInvoice: 30,
    daysAfterDelivery: 0,
    creditPeriod: 30,
    paymentMethod: 'credit',
    earlyPaymentDiscount: 2,
    earlyPaymentDays: 10,
    lateFeePercentage: 1.5,
    lateFeeStartsAfter: 30,
    interestRate: 18,
    applicableFor: 'both',
    isDefault: true,
    priority: 1,
    customersUsing: 85,
    vendorsUsing: 42,
    transactionsCount: 2840,
    totalAmount: 124500000,
    isActive: true,
    createdBy: 'Admin',
    createdDate: '2024-01-01',
    modifiedBy: 'Finance Manager',
    modifiedDate: '2025-01-15'
  },
  {
    id: 'PT002',
    termCode: 'NET45',
    termName: 'Net 45 Days',
    description: 'Payment due within 45 days from invoice date',
    daysAfterInvoice: 45,
    daysAfterDelivery: 0,
    creditPeriod: 45,
    paymentMethod: 'credit',
    earlyPaymentDiscount: 3,
    earlyPaymentDays: 15,
    lateFeePercentage: 2,
    lateFeeStartsAfter: 45,
    interestRate: 18,
    applicableFor: 'customers',
    isDefault: false,
    priority: 2,
    customersUsing: 38,
    vendorsUsing: 0,
    transactionsCount: 1256,
    totalAmount: 68200000,
    isActive: true,
    createdBy: 'Admin',
    createdDate: '2024-01-01',
    modifiedBy: 'Sales Manager',
    modifiedDate: '2025-01-10'
  },
  {
    id: 'PT003',
    termCode: 'COD',
    termName: 'Cash on Delivery',
    description: 'Payment on delivery or before shipment',
    daysAfterInvoice: 0,
    daysAfterDelivery: 0,
    creditPeriod: 0,
    paymentMethod: 'on_delivery',
    cashDiscountPercentage: 0,
    applicableFor: 'customers',
    isDefault: false,
    priority: 3,
    customersUsing: 28,
    vendorsUsing: 0,
    transactionsCount: 842,
    totalAmount: 18400000,
    isActive: true,
    createdBy: 'Admin',
    createdDate: '2024-01-01',
    modifiedBy: 'Sales Manager',
    modifiedDate: '2025-01-08'
  },
  {
    id: 'PT004',
    termCode: 'ADV100',
    termName: '100% Advance',
    description: 'Full payment in advance before production',
    daysAfterInvoice: 0,
    daysAfterDelivery: 0,
    creditPeriod: 0,
    paymentMethod: 'advance',
    advancePercentage: 100,
    cashDiscountPercentage: 5,
    applicableFor: 'customers',
    isDefault: false,
    priority: 4,
    customersUsing: 15,
    vendorsUsing: 0,
    transactionsCount: 324,
    totalAmount: 24800000,
    isActive: true,
    createdBy: 'Sales Manager',
    createdDate: '2024-02-01',
    modifiedBy: 'Sales Manager',
    modifiedDate: '2025-01-12'
  },
  {
    id: 'PT005',
    termCode: 'ADV50BAL',
    termName: '50% Advance, Balance on Delivery',
    description: '50% advance payment, balance before/on delivery',
    daysAfterInvoice: 0,
    daysAfterDelivery: 0,
    creditPeriod: 0,
    paymentMethod: 'partial',
    advancePercentage: 50,
    partialPayments: [
      { sequence: 1, percentage: 50, daysAfter: 0, milestone: 'Order Confirmation' },
      { sequence: 2, percentage: 50, daysAfter: 0, milestone: 'Before Delivery' }
    ],
    applicableFor: 'customers',
    isDefault: false,
    priority: 5,
    customersUsing: 42,
    vendorsUsing: 0,
    transactionsCount: 986,
    totalAmount: 52600000,
    isActive: true,
    createdBy: 'Sales Manager',
    createdDate: '2024-01-15',
    modifiedBy: 'Sales Manager',
    modifiedDate: '2025-01-18'
  },
  {
    id: 'PT006',
    termCode: 'NET60',
    termName: 'Net 60 Days',
    description: 'Payment due within 60 days from invoice date - Approved customers only',
    daysAfterInvoice: 60,
    daysAfterDelivery: 0,
    creditPeriod: 60,
    paymentMethod: 'credit',
    earlyPaymentDiscount: 4,
    earlyPaymentDays: 20,
    lateFeePercentage: 2.5,
    lateFeeStartsAfter: 60,
    interestRate: 18,
    applicableFor: 'customers',
    isDefault: false,
    priority: 6,
    customersUsing: 12,
    vendorsUsing: 0,
    transactionsCount: 428,
    totalAmount: 38400000,
    isActive: true,
    createdBy: 'Admin',
    createdDate: '2024-01-01',
    modifiedBy: 'Finance Manager',
    modifiedDate: '2025-01-05'
  },
  {
    id: 'PT007',
    termCode: 'IMMED',
    termName: 'Immediate Payment',
    description: 'Payment within 24 hours of invoice',
    daysAfterInvoice: 1,
    daysAfterDelivery: 0,
    creditPeriod: 1,
    paymentMethod: 'immediate',
    cashDiscountPercentage: 3,
    applicableFor: 'vendors',
    isDefault: false,
    priority: 7,
    customersUsing: 0,
    vendorsUsing: 18,
    transactionsCount: 542,
    totalAmount: 12400000,
    isActive: true,
    createdBy: 'Purchase Manager',
    createdDate: '2024-03-01',
    modifiedBy: 'Purchase Manager',
    modifiedDate: '2025-01-20'
  },
  {
    id: 'PT008',
    termCode: '30-60-10',
    termName: '30-60-10 Milestone',
    description: '30% advance, 60% on delivery, 10% after 30 days',
    daysAfterInvoice: 0,
    daysAfterDelivery: 0,
    creditPeriod: 30,
    paymentMethod: 'partial',
    advancePercentage: 30,
    partialPayments: [
      { sequence: 1, percentage: 30, daysAfter: 0, milestone: 'Order Confirmation' },
      { sequence: 2, percentage: 60, daysAfter: 0, milestone: 'On Delivery' },
      { sequence: 3, percentage: 10, daysAfter: 30, milestone: 'After Installation' }
    ],
    applicableFor: 'customers',
    isDefault: false,
    priority: 8,
    customersUsing: 24,
    vendorsUsing: 0,
    transactionsCount: 586,
    totalAmount: 42800000,
    isActive: true,
    createdBy: 'Sales Manager',
    createdDate: '2024-02-15',
    modifiedBy: 'Sales Manager',
    modifiedDate: '2025-01-14'
  }
];

export function getPaymentTermStats() {
  const activeTerms = mockPaymentTerms.filter(t => t.isActive);

  return {
    total: mockPaymentTerms.length,
    active: activeTerms.length,
    forCustomers: activeTerms.filter(t => t.applicableFor === 'customers' || t.applicableFor === 'both').length,
    forVendors: activeTerms.filter(t => t.applicableFor === 'vendors' || t.applicableFor === 'both').length,
    withEarlyDiscount: activeTerms.filter(t => t.earlyPaymentDiscount && t.earlyPaymentDiscount > 0).length,
    totalTransactions: activeTerms.reduce((sum, t) => sum + t.transactionsCount, 0),
    totalAmount: activeTerms.reduce((sum, t) => sum + t.totalAmount, 0),
    avgCreditPeriod: Math.round(activeTerms.reduce((sum, t) => sum + t.creditPeriod, 0) / activeTerms.length),
    defaultTerm: activeTerms.find(t => t.isDefault)
  };
}
