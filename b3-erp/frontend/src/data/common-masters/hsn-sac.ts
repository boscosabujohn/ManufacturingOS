export interface HSNSAC {
  id: string;
  code: string;
  codeType: 'HSN' | 'SAC';
  description: string;
  category: string;

  // Tax Rates (GST)
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  cessRate?: number;
  totalGST: number;

  // Applicability
  applicableFor: 'goods' | 'services';
  itemGroup?: string;

  // Usage
  itemsCount: number;
  transactionsCount: number;
  totalTaxable Amount: number;
  totalTaxCollected: number;
  lastUsedDate: string;

  isActive: boolean;
  createdBy: string;
  createdDate: string;
}

export const mockHSNSAC: HSNSAC[] = [
  {
    id: 'HS001',
    code: '73211100',
    codeType: 'HSN',
    description: 'Cooking appliances and plate warmers, for gas fuel',
    category: 'Kitchen Equipment',
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    totalGST: 18,
    applicableFor: 'goods',
    itemGroup: 'Finished Goods',
    itemsCount: 45,
    transactionsCount: 1842,
    totalTaxableAmount: 125000000,
    totalTaxCollected: 22500000,
    lastUsedDate: '2025-01-25',
    isActive: true,
    createdBy: 'Admin',
    createdDate: '2024-01-01'
  },
  {
    id: 'HS002',
    code: '73211900',
    codeType: 'HSN',
    description: 'Cooking appliances and plate warmers, for other fuel',
    category: 'Kitchen Equipment',
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    totalGST: 18,
    applicableFor: 'goods',
    itemGroup: 'Finished Goods',
    itemsCount: 28,
    transactionsCount: 986,
    totalTaxableAmount: 68000000,
    totalTaxCollected: 12240000,
    lastUsedDate: '2025-01-24',
    isActive: true,
    createdBy: 'Admin',
    createdDate: '2024-01-01'
  },
  {
    id: 'HS003',
    code: '73218100',
    codeType: 'HSN',
    description: 'Other appliances: for gas fuel',
    category: 'Kitchen Equipment',
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    totalGST: 18,
    applicableFor: 'goods',
    itemGroup: 'Finished Goods',
    itemsCount: 32,
    transactionsCount: 1124,
    totalTaxableAmount: 84000000,
    totalTaxCollected: 15120000,
    lastUsedDate: '2025-01-23',
    isActive: true,
    createdBy: 'Admin',
    createdDate: '2024-01-01'
  },
  {
    id: 'HS004',
    code: '72193200',
    codeType: 'HSN',
    description: 'Flat-rolled products of stainless steel, of a thickness of 3 mm or more but less than 4.75 mm',
    category: 'Raw Materials',
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    totalGST: 18,
    applicableFor: 'goods',
    itemGroup: 'Raw Materials',
    itemsCount: 12,
    transactionsCount: 542,
    totalTaxableAmount: 45000000,
    totalTaxCollected: 8100000,
    lastUsedDate: '2025-01-22',
    isActive: true,
    createdBy: 'Purchase Manager',
    createdDate: '2024-01-01'
  },
  {
    id: 'HS005',
    code: '73269099',
    codeType: 'HSN',
    description: 'Other articles of iron or steel',
    category: 'Components',
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    totalGST: 18,
    applicableFor: 'goods',
    itemGroup: 'Components',
    itemsCount: 86,
    transactionsCount: 2456,
    totalTaxableAmount: 18400000,
    totalTaxCollected: 3312000,
    lastUsedDate: '2025-01-25',
    isActive: true,
    createdBy: 'Purchase Manager',
    createdDate: '2024-01-01'
  },
  {
    id: 'HS006',
    code: '48191000',
    codeType: 'HSN',
    description: 'Cartons, boxes and cases, of corrugated paper or paperboard',
    category: 'Packaging',
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    totalGST: 18,
    applicableFor: 'goods',
    itemGroup: 'Packaging Materials',
    itemsCount: 8,
    transactionsCount: 856,
    totalTaxableAmount: 5600000,
    totalTaxCollected: 1008000,
    lastUsedDate: '2025-01-24',
    isActive: true,
    createdBy: 'Purchase Manager',
    createdDate: '2024-01-01'
  },
  {
    id: 'SA001',
    code: '998599',
    codeType: 'SAC',
    description: 'Installation services',
    category: 'Services',
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    totalGST: 18,
    applicableFor: 'services',
    itemsCount: 0,
    transactionsCount: 342,
    totalTaxableAmount: 12400000,
    totalTaxCollected: 2232000,
    lastUsedDate: '2025-01-23',
    isActive: true,
    createdBy: 'Service Manager',
    createdDate: '2024-01-01'
  },
  {
    id: 'SA002',
    code: '998516',
    codeType: 'SAC',
    description: 'Maintenance and repair services of fabricated metal products',
    category: 'Services',
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    totalGST: 18,
    applicableFor: 'services',
    itemsCount: 0,
    transactionsCount: 156,
    totalTaxableAmount: 4200000,
    totalTaxCollected: 756000,
    lastUsedDate: '2025-01-20',
    isActive: true,
    createdBy: 'Service Manager',
    createdDate: '2024-02-01'
  }
];

export function getHSNSACStats() {
  const activeRecords = mockHSNSAC.filter(h => h.isActive);

  return {
    total: mockHSNSAC.length,
    active: activeRecords.length,
    hsnCount: activeRecords.filter(h => h.codeType === 'HSN').length,
    sacCount: activeRecords.filter(h => h.codeType === 'SAC').length,
    totalItems: activeRecords.reduce((sum, h) => sum + h.itemsCount, 0),
    totalTransactions: activeRecords.reduce((sum, h) => sum + h.transactionsCount, 0),
    totalTaxableAmount: activeRecords.reduce((sum, h) => sum + h.totalTaxableAmount, 0),
    totalTaxCollected: activeRecords.reduce((sum, h) => sum + h.totalTaxCollected, 0),
    taxRates: {
      rate5: activeRecords.filter(h => h.totalGST === 5).length,
      rate12: activeRecords.filter(h => h.totalGST === 12).length,
      rate18: activeRecords.filter(h => h.totalGST === 18).length,
      rate28: activeRecords.filter(h => h.totalGST === 28).length
    }
  };
}
