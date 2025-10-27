export interface VendorCategory {
  id: string;
  categoryCode: string;
  categoryName: string;
  description: string;

  // Payment & Credit
  defaultPaymentTerms: string;
  defaultDeliveryTerms?: string;
  creditPeriod: number;
  paymentDays?: number;
  advancePaymentPercentage?: number;
  advancePaymentRequired?: boolean;
  advancePercentage?: number;

  // Material Type
  materialType: 'raw_material' | 'components' | 'consumables' | 'services' | 'packaging' | 'tools' | 'others';
  vendorType?: string;
  isPreferred?: boolean;

  // Performance & Quality
  qualityRating: 'A' | 'B' | 'C';
  minOrderValue: number;
  leadTimeDays: number;
  onTimeDeliveryRate?: number;

  // Evaluation
  evaluationRequired: boolean;
  inspectionRequired: boolean;
  requiresQualityInspection?: boolean;
  certificationRequired: boolean;
  certifications?: string[];
  defectRate?: number;
  complianceScore?: number;

  // Usage & Performance
  vendorsCount: number;
  totalPurchases: number;
  avgOrderValue: number;
  averagePOValue?: number;
  outstandingAmount: number;
  pendingPayments?: number;

  isActive: boolean;
  createdBy: string;
  createdDate: string;
}

export const mockVendorCategories: VendorCategory[] = [
  {
    id: 'VC001',
    categoryCode: 'RAW-SS',
    categoryName: 'Stainless Steel Suppliers',
    description: 'Suppliers of stainless steel sheets and coils',
    defaultPaymentTerms: 'Net 30',
    creditPeriod: 30,
    materialType: 'raw_material',
    qualityRating: 'A',
    minOrderValue: 500000,
    leadTimeDays: 7,
    evaluationRequired: true,
    inspectionRequired: true,
    certificationRequired: true,
    vendorsCount: 5,
    totalPurchases: 45600000,
    avgOrderValue: 1200000,
    outstandingAmount: 3800000,
    isActive: true,
    createdBy: 'Purchase Manager',
    createdDate: '2024-01-01'
  },
  {
    id: 'VC002',
    categoryCode: 'COMP-HW',
    categoryName: 'Hardware Components',
    description: 'Hinges, handles, locks, and fittings',
    defaultPaymentTerms: 'Net 30',
    creditPeriod: 30,
    materialType: 'components',
    qualityRating: 'A',
    minOrderValue: 100000,
    leadTimeDays: 10,
    evaluationRequired: true,
    inspectionRequired: true,
    certificationRequired: false,
    vendorsCount: 8,
    totalPurchases: 18400000,
    avgOrderValue: 320000,
    outstandingAmount: 1500000,
    isActive: true,
    createdBy: 'Purchase Manager',
    createdDate: '2024-01-01'
  },
  {
    id: 'VC003',
    categoryCode: 'PACK',
    categoryName: 'Packaging Materials',
    description: 'Carton boxes, bubble wrap, packaging tape',
    defaultPaymentTerms: 'Net 45',
    creditPeriod: 45,
    materialType: 'packaging',
    qualityRating: 'B',
    minOrderValue: 50000,
    leadTimeDays: 5,
    evaluationRequired: false,
    inspectionRequired: false,
    certificationRequired: false,
    vendorsCount: 12,
    totalPurchases: 5600000,
    avgOrderValue: 85000,
    outstandingAmount: 420000,
    isActive: true,
    createdBy: 'Purchase Manager',
    createdDate: '2024-01-01'
  },
  {
    id: 'VC004',
    categoryCode: 'CONS',
    categoryName: 'Consumables',
    description: 'Cutting discs, welding electrodes, grinding wheels',
    defaultPaymentTerms: 'COD',
    creditPeriod: 0,
    materialType: 'consumables',
    qualityRating: 'B',
    minOrderValue: 25000,
    leadTimeDays: 3,
    evaluationRequired: false,
    inspectionRequired: false,
    certificationRequired: false,
    vendorsCount: 15,
    totalPurchases: 8200000,
    avgOrderValue: 120000,
    outstandingAmount: 0,
    isActive: true,
    createdBy: 'Purchase Manager',
    createdDate: '2024-01-15'
  },
  {
    id: 'VC005',
    categoryCode: 'SERV-MT',
    categoryName: 'Maintenance Services',
    description: 'Machine maintenance and repair services',
    defaultPaymentTerms: 'Net 15',
    creditPeriod: 15,
    advancePaymentPercentage: 50,
    materialType: 'services',
    qualityRating: 'A',
    minOrderValue: 10000,
    leadTimeDays: 2,
    evaluationRequired: true,
    inspectionRequired: false,
    certificationRequired: true,
    vendorsCount: 6,
    totalPurchases: 4200000,
    avgOrderValue: 65000,
    outstandingAmount: 280000,
    isActive: true,
    createdBy: 'Production Manager',
    createdDate: '2024-02-01'
  },
  {
    id: 'VC006',
    categoryCode: 'TOOL',
    categoryName: 'Tools & Equipment',
    description: 'Hand tools, power tools, measuring instruments',
    defaultPaymentTerms: 'Net 30',
    creditPeriod: 30,
    materialType: 'tools',
    qualityRating: 'A',
    minOrderValue: 50000,
    leadTimeDays: 7,
    evaluationRequired: true,
    inspectionRequired: true,
    certificationRequired: false,
    vendorsCount: 7,
    totalPurchases: 6800000,
    avgOrderValue: 180000,
    outstandingAmount: 560000,
    isActive: true,
    createdBy: 'Purchase Manager',
    createdDate: '2024-01-01'
  }
];

export function getVendorCategoryStats() {
  return {
    total: mockVendorCategories.length,
    active: mockVendorCategories.filter(v => v.isActive).length,
    totalVendors: mockVendorCategories.reduce((sum, v) => sum + v.vendorsCount, 0),
    totalPurchases: mockVendorCategories.reduce((sum, v) => sum + v.totalPurchases, 0),
    totalOutstanding: mockVendorCategories.reduce((sum, v) => sum + v.outstandingAmount, 0),
    totalPending: mockVendorCategories.reduce((sum, v) => sum + (v.pendingPayments || 0), 0),
    gradeA: mockVendorCategories.filter(v => v.qualityRating === 'A').length,
    requiresQC: mockVendorCategories.filter(v => v.inspectionRequired).length,
    avgQuality: mockVendorCategories.reduce((sum, v) => sum + (v.defectRate || 0), 0) / mockVendorCategories.length,
    avgOnTime: mockVendorCategories.reduce((sum, v) => sum + (v.onTimeDeliveryRate || 0), 0) / mockVendorCategories.length
  };
}
