export interface NumberSeries {
  id: string;
  seriesCode: string;
  seriesName: string;
  documentType: string;
  module: 'sales' | 'purchase' | 'inventory' | 'finance' | 'hr' | 'production' | 'quality';

  // Format
  prefix: string;
  suffix: string;
  separator: string;
  paddingLength: number;
  includeYear: boolean;
  includeMonth: boolean;
  yearFormat: 'YYYY' | 'YY';
  monthFormat: 'MM' | 'MMM' | 'MMMM';

  // Sequence
  currentNumber: number;
  startingNumber: number;
  endingNumber: number;
  incrementBy: number;

  // Reset Options
  resetFrequency: 'never' | 'yearly' | 'monthly' | 'daily';
  lastResetDate: string;
  nextResetDate?: string;

  // Validation
  allowDuplicates: boolean;
  allowManualEntry: boolean;
  validateSequence: boolean;

  // Usage
  defaultSeries: boolean;
  applicableLocations: string[];
  applicableDepartments: string[];

  // Tracking
  documentsGenerated: number;
  lastGeneratedNumber: string;
  lastGeneratedDate: string;

  // Sample Format
  sampleFormat: string;

  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export const mockNumberSeries: NumberSeries[] = [
  {
    id: '1',
    seriesCode: 'SO-2025',
    seriesName: 'Sales Order 2025',
    documentType: 'Sales Order',
    module: 'sales',
    prefix: 'SO',
    suffix: '',
    separator: '-',
    paddingLength: 5,
    includeYear: true,
    includeMonth: false,
    yearFormat: 'YYYY',
    monthFormat: 'MM',
    currentNumber: 1248,
    startingNumber: 1000,
    endingNumber: 99999,
    incrementBy: 1,
    resetFrequency: 'yearly',
    lastResetDate: '2025-01-01',
    nextResetDate: '2026-01-01',
    allowDuplicates: false,
    allowManualEntry: true,
    validateSequence: true,
    defaultSeries: true,
    applicableLocations: ['Mumbai', 'Pune', 'Bangalore'],
    applicableDepartments: ['Sales & Marketing'],
    documentsGenerated: 248,
    lastGeneratedNumber: 'SO-2025-01248',
    lastGeneratedDate: '2025-01-20',
    sampleFormat: 'SO-2025-01248',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-20T15:30:00Z'
  },
  {
    id: '2',
    seriesCode: 'PO-2025',
    seriesName: 'Purchase Order 2025',
    documentType: 'Purchase Order',
    module: 'purchase',
    prefix: 'PO',
    suffix: '',
    separator: '-',
    paddingLength: 5,
    includeYear: true,
    includeMonth: false,
    yearFormat: 'YYYY',
    monthFormat: 'MM',
    currentNumber: 856,
    startingNumber: 500,
    endingNumber: 99999,
    incrementBy: 1,
    resetFrequency: 'yearly',
    lastResetDate: '2025-01-01',
    nextResetDate: '2026-01-01',
    allowDuplicates: false,
    allowManualEntry: false,
    validateSequence: true,
    defaultSeries: true,
    applicableLocations: ['Pune'],
    applicableDepartments: ['Purchase'],
    documentsGenerated: 356,
    lastGeneratedNumber: 'PO-2025-00856',
    lastGeneratedDate: '2025-01-19',
    sampleFormat: 'PO-2025-00856',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-19T11:45:00Z'
  },
  {
    id: '3',
    seriesCode: 'INV-2025',
    seriesName: 'Sales Invoice 2025',
    documentType: 'Sales Invoice',
    module: 'finance',
    prefix: 'INV',
    suffix: '',
    separator: '/',
    paddingLength: 4,
    includeYear: true,
    includeMonth: false,
    yearFormat: 'YY',
    monthFormat: 'MM',
    currentNumber: 2145,
    startingNumber: 2001,
    endingNumber: 9999,
    incrementBy: 1,
    resetFrequency: 'yearly',
    lastResetDate: '2025-01-01',
    nextResetDate: '2026-01-01',
    allowDuplicates: false,
    allowManualEntry: false,
    validateSequence: true,
    defaultSeries: true,
    applicableLocations: ['All'],
    applicableDepartments: ['Finance & Accounts'],
    documentsGenerated: 144,
    lastGeneratedNumber: 'INV/25/2145',
    lastGeneratedDate: '2025-01-20',
    sampleFormat: 'INV/25/2145',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-20T16:20:00Z'
  },
  {
    id: '4',
    seriesCode: 'WO-2025',
    seriesName: 'Work Order 2025',
    documentType: 'Work Order',
    module: 'production',
    prefix: 'WO',
    suffix: '',
    separator: '-',
    paddingLength: 6,
    includeYear: true,
    includeMonth: true,
    yearFormat: 'YY',
    monthFormat: 'MM',
    currentNumber: 456,
    startingNumber: 1,
    endingNumber: 999999,
    incrementBy: 1,
    resetFrequency: 'monthly',
    lastResetDate: '2025-01-01',
    nextResetDate: '2025-02-01',
    allowDuplicates: false,
    allowManualEntry: false,
    validateSequence: true,
    defaultSeries: true,
    applicableLocations: ['Pune'],
    applicableDepartments: ['Production'],
    documentsGenerated: 456,
    lastGeneratedNumber: 'WO-2501-000456',
    lastGeneratedDate: '2025-01-20',
    sampleFormat: 'WO-2501-000456',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-20T14:10:00Z'
  },
  {
    id: '5',
    seriesCode: 'GRN-2025',
    seriesName: 'Goods Receipt Note 2025',
    documentType: 'Goods Receipt Note',
    module: 'inventory',
    prefix: 'GRN',
    suffix: '',
    separator: '-',
    paddingLength: 5,
    includeYear: true,
    includeMonth: false,
    yearFormat: 'YYYY',
    monthFormat: 'MM',
    currentNumber: 723,
    startingNumber: 1,
    endingNumber: 99999,
    incrementBy: 1,
    resetFrequency: 'yearly',
    lastResetDate: '2025-01-01',
    nextResetDate: '2026-01-01',
    allowDuplicates: false,
    allowManualEntry: false,
    validateSequence: true,
    defaultSeries: true,
    applicableLocations: ['Pune'],
    applicableDepartments: ['Warehouse'],
    documentsGenerated: 723,
    lastGeneratedNumber: 'GRN-2025-00723',
    lastGeneratedDate: '2025-01-20',
    sampleFormat: 'GRN-2025-00723',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-20T13:55:00Z'
  },
  {
    id: '6',
    seriesCode: 'EMP-2025',
    seriesName: 'Employee Code',
    documentType: 'Employee Master',
    module: 'hr',
    prefix: 'EMP',
    suffix: '',
    separator: '',
    paddingLength: 4,
    includeYear: false,
    includeMonth: false,
    yearFormat: 'YYYY',
    monthFormat: 'MM',
    currentNumber: 913,
    startingNumber: 1,
    endingNumber: 9999,
    incrementBy: 1,
    resetFrequency: 'never',
    lastResetDate: '2015-01-01',
    allowDuplicates: false,
    allowManualEntry: true,
    validateSequence: true,
    defaultSeries: true,
    applicableLocations: ['All'],
    applicableDepartments: ['Human Resources'],
    documentsGenerated: 913,
    lastGeneratedNumber: 'EMP0913',
    lastGeneratedDate: '2025-01-15',
    sampleFormat: 'EMP0913',
    isActive: true,
    createdAt: '2015-01-01T00:00:00Z',
    updatedAt: '2025-01-15T09:30:00Z'
  },
  {
    id: '7',
    seriesCode: 'QC-2025',
    seriesName: 'Quality Check Report 2025',
    documentType: 'Quality Inspection',
    module: 'quality',
    prefix: 'QC',
    suffix: '',
    separator: '/',
    paddingLength: 4,
    includeYear: true,
    includeMonth: true,
    yearFormat: 'YY',
    monthFormat: 'MM',
    currentNumber: 1856,
    startingNumber: 1,
    endingNumber: 9999,
    incrementBy: 1,
    resetFrequency: 'monthly',
    lastResetDate: '2025-01-01',
    nextResetDate: '2025-02-01',
    allowDuplicates: false,
    allowManualEntry: false,
    validateSequence: true,
    defaultSeries: true,
    applicableLocations: ['Pune'],
    applicableDepartments: ['Quality Control'],
    documentsGenerated: 1856,
    lastGeneratedNumber: 'QC/25/01/1856',
    lastGeneratedDate: '2025-01-20',
    sampleFormat: 'QC/25/01/1856',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-20T17:40:00Z'
  },
  {
    id: '8',
    seriesCode: 'PAY-2025',
    seriesName: 'Payment Voucher 2025',
    documentType: 'Payment Voucher',
    module: 'finance',
    prefix: 'PAY',
    suffix: '',
    separator: '-',
    paddingLength: 5,
    includeYear: true,
    includeMonth: false,
    yearFormat: 'YYYY',
    monthFormat: 'MM',
    currentNumber: 445,
    startingNumber: 1,
    endingNumber: 99999,
    incrementBy: 1,
    resetFrequency: 'yearly',
    lastResetDate: '2025-01-01',
    nextResetDate: '2026-01-01',
    allowDuplicates: false,
    allowManualEntry: false,
    validateSequence: true,
    defaultSeries: true,
    applicableLocations: ['All'],
    applicableDepartments: ['Finance & Accounts'],
    documentsGenerated: 445,
    lastGeneratedNumber: 'PAY-2025-00445',
    lastGeneratedDate: '2025-01-19',
    sampleFormat: 'PAY-2025-00445',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-19T15:25:00Z'
  },
  {
    id: '9',
    seriesCode: 'QUOT-2025',
    seriesName: 'Sales Quotation 2025',
    documentType: 'Sales Quotation',
    module: 'sales',
    prefix: 'QUOT',
    suffix: '',
    separator: '/',
    paddingLength: 4,
    includeYear: true,
    includeMonth: false,
    yearFormat: 'YY',
    monthFormat: 'MM',
    currentNumber: 3456,
    startingNumber: 3001,
    endingNumber: 9999,
    incrementBy: 1,
    resetFrequency: 'yearly',
    lastResetDate: '2025-01-01',
    nextResetDate: '2026-01-01',
    allowDuplicates: false,
    allowManualEntry: true,
    validateSequence: false,
    defaultSeries: true,
    applicableLocations: ['All'],
    applicableDepartments: ['Sales & Marketing'],
    documentsGenerated: 455,
    lastGeneratedNumber: 'QUOT/25/3456',
    lastGeneratedDate: '2025-01-20',
    sampleFormat: 'QUOT/25/3456',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-20T12:15:00Z'
  },
  {
    id: '10',
    seriesCode: 'DN-2025',
    seriesName: 'Delivery Note 2025',
    documentType: 'Delivery Note',
    module: 'inventory',
    prefix: 'DN',
    suffix: '',
    separator: '-',
    paddingLength: 5,
    includeYear: true,
    includeMonth: false,
    yearFormat: 'YYYY',
    monthFormat: 'MM',
    currentNumber: 1567,
    startingNumber: 1000,
    endingNumber: 99999,
    incrementBy: 1,
    resetFrequency: 'yearly',
    lastResetDate: '2025-01-01',
    nextResetDate: '2026-01-01',
    allowDuplicates: false,
    allowManualEntry: false,
    validateSequence: true,
    defaultSeries: true,
    applicableLocations: ['All'],
    applicableDepartments: ['Warehouse'],
    documentsGenerated: 567,
    lastGeneratedNumber: 'DN-2025-01567',
    lastGeneratedDate: '2025-01-20',
    sampleFormat: 'DN-2025-01567',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-20T16:50:00Z'
  }
];

// Helper functions
export function getSeriesByModule(module: string): NumberSeries[] {
  return mockNumberSeries.filter(series => series.module === module);
}

export function getDefaultSeries(documentType: string): NumberSeries | undefined {
  return mockNumberSeries.find(series =>
    series.documentType === documentType && series.defaultSeries
  );
}

export function generateNextNumber(seriesId: string): string {
  const series = mockNumberSeries.find(s => s.id === seriesId);
  if (!series) return '';

  let format = series.prefix;

  if (series.includeYear) {
    const year = series.yearFormat === 'YYYY' ? '2025' : '25';
    format += series.separator + year;
  }

  if (series.includeMonth) {
    const month = new Date().getMonth() + 1;
    const monthStr = series.monthFormat === 'MM' ? month.toString().padStart(2, '0') : month.toString();
    format += series.separator + monthStr;
  }

  const paddedNumber = series.currentNumber.toString().padStart(series.paddingLength, '0');
  format += series.separator + paddedNumber;

  if (series.suffix) {
    format += series.separator + series.suffix;
  }

  return format;
}

export function getNumberSeriesStats() {
  const nearingLimit = mockNumberSeries.filter(s =>
    (s.currentNumber / s.endingNumber) > 0.8
  ).length;

  const needsReset = mockNumberSeries.filter(s => {
    if (!s.nextResetDate) return false;
    return new Date(s.nextResetDate) <= new Date();
  }).length;

  return {
    total: mockNumberSeries.length,
    active: mockNumberSeries.filter(s => s.isActive).length,
    sales: mockNumberSeries.filter(s => s.module === 'sales').length,
    production: mockNumberSeries.filter(s => s.module === 'production').length,
    finance: mockNumberSeries.filter(s => s.module === 'finance').length,
    nearingLimit,
    needsReset,
    totalGenerated: mockNumberSeries.reduce((sum, s) => sum + s.documentsGenerated, 0)
  };
}
