export interface CustomerCategory {
  id: string;
  categoryCode: string;
  categoryName: string;
  description: string;

  // Pricing & Discounts
  defaultDiscount: number;
  maxDiscountAllowed: number;
  priceListId: string;
  priceListName: string;
  defaultPriceList?: string;

  // Credit & Payment
  defaultCreditLimit: number;
  defaultPaymentTerms: string;
  creditPeriod: number;
  requiresApproval: boolean;

  // Business Classification
  businessType: 'dealer' | 'distributor' | 'retailer' | 'end_user' | 'institutional' | 'government';
  priority: 'vip' | 'high' | 'medium' | 'low';
  tier?: 'platinum' | 'gold' | 'silver' | 'bronze';
  volumeDiscountApplicable?: boolean;
  creditDays?: number;
  specialPricingApplicable?: boolean;

  // Territory
  defaultTerritory?: string;
  shippingChargesApply: boolean;

  // Usage & Performance
  customersCount: number;
  totalSales: number;
  avgOrderValue: number;
  outstandingAmount: number;

  isActive: boolean;
  createdBy: string;
  createdDate: string;
}

export const mockCustomerCategories: CustomerCategory[] = [
  {
    id: 'CC001',
    categoryCode: 'DIST',
    categoryName: 'Distributors',
    description: 'Authorized distributors with bulk purchase agreements',
    defaultDiscount: 25,
    maxDiscountAllowed: 30,
    priceListId: 'PL001',
    priceListName: 'Distributor Pricing',
    defaultCreditLimit: 5000000,
    defaultPaymentTerms: 'Net 45',
    creditPeriod: 45,
    requiresApproval: false,
    businessType: 'distributor',
    priority: 'vip',
    shippingChargesApply: false,
    customersCount: 12,
    totalSales: 85600000,
    avgOrderValue: 1200000,
    outstandingAmount: 8500000,
    isActive: true,
    createdBy: 'Sales Manager',
    createdDate: '2024-01-01'
  },
  {
    id: 'CC002',
    categoryCode: 'DEAL',
    categoryName: 'Dealers',
    description: 'Authorized dealers in specific territories',
    defaultDiscount: 18,
    maxDiscountAllowed: 22,
    priceListId: 'PL002',
    priceListName: 'Dealer Pricing',
    defaultCreditLimit: 2000000,
    defaultPaymentTerms: 'Net 30',
    creditPeriod: 30,
    requiresApproval: false,
    businessType: 'dealer',
    priority: 'high',
    shippingChargesApply: true,
    customersCount: 42,
    totalSales: 124800000,
    avgOrderValue: 450000,
    outstandingAmount: 12400000,
    isActive: true,
    createdBy: 'Sales Manager',
    createdDate: '2024-01-01'
  },
  {
    id: 'CC003',
    categoryCode: 'RET',
    categoryName: 'Retailers',
    description: 'Retail stores and showrooms',
    defaultDiscount: 12,
    maxDiscountAllowed: 15,
    priceListId: 'PL003',
    priceListName: 'Retail Pricing',
    defaultCreditLimit: 500000,
    defaultPaymentTerms: 'Net 30',
    creditPeriod: 30,
    requiresApproval: true,
    businessType: 'retailer',
    priority: 'medium',
    shippingChargesApply: true,
    customersCount: 86,
    totalSales: 64200000,
    avgOrderValue: 180000,
    outstandingAmount: 5800000,
    isActive: true,
    createdBy: 'Sales Manager',
    createdDate: '2024-01-01'
  },
  {
    id: 'CC004',
    categoryCode: 'INST',
    categoryName: 'Institutional',
    description: 'Hotels, restaurants, corporate cafeterias',
    defaultDiscount: 10,
    maxDiscountAllowed: 15,
    priceListId: 'PL004',
    priceListName: 'Institutional Pricing',
    defaultCreditLimit: 1000000,
    defaultPaymentTerms: 'Net 45',
    creditPeriod: 45,
    requiresApproval: true,
    businessType: 'institutional',
    priority: 'high',
    shippingChargesApply: true,
    customersCount: 28,
    totalSales: 42600000,
    avgOrderValue: 320000,
    outstandingAmount: 4200000,
    isActive: true,
    createdBy: 'Sales Manager',
    createdDate: '2024-01-15'
  },
  {
    id: 'CC005',
    categoryCode: 'GOV',
    categoryName: 'Government',
    description: 'Government departments and PSUs',
    defaultDiscount: 8,
    maxDiscountAllowed: 10,
    priceListId: 'PL005',
    priceListName: 'Government Pricing',
    defaultCreditLimit: 3000000,
    defaultPaymentTerms: 'Net 60',
    creditPeriod: 60,
    requiresApproval: true,
    businessType: 'government',
    priority: 'medium',
    shippingChargesApply: false,
    customersCount: 8,
    totalSales: 18400000,
    avgOrderValue: 520000,
    outstandingAmount: 2800000,
    isActive: true,
    createdBy: 'Sales Manager',
    createdDate: '2024-02-01'
  },
  {
    id: 'CC006',
    categoryCode: 'ENDUSER',
    categoryName: 'End Users',
    description: 'Direct customers and homeowners',
    defaultDiscount: 5,
    maxDiscountAllowed: 8,
    priceListId: 'PL006',
    priceListName: 'Retail MRP',
    defaultCreditLimit: 0,
    defaultPaymentTerms: 'COD',
    creditPeriod: 0,
    requiresApproval: false,
    businessType: 'end_user',
    priority: 'low',
    shippingChargesApply: true,
    customersCount: 124,
    totalSales: 12400000,
    avgOrderValue: 45000,
    outstandingAmount: 0,
    isActive: true,
    createdBy: 'Sales Manager',
    createdDate: '2024-01-01'
  }
];

export function getCustomerCategoryStats() {
  return {
    total: mockCustomerCategories.length,
    active: mockCustomerCategories.filter(c => c.isActive).length,
    totalCustomers: mockCustomerCategories.reduce((sum, c) => sum + c.customersCount, 0),
    totalSales: mockCustomerCategories.reduce((sum, c) => sum + c.totalSales, 0),
    totalOutstanding: mockCustomerCategories.reduce((sum, c) => sum + c.outstandingAmount, 0),
    avgDiscount: Math.round(mockCustomerCategories.reduce((sum, c) => sum + c.defaultDiscount, 0) / mockCustomerCategories.length),
    avgOrderValue: Math.round(mockCustomerCategories.reduce((sum, c) => sum + c.avgOrderValue, 0) / mockCustomerCategories.length),
    vipCategories: mockCustomerCategories.filter(c => c.priority === 'vip').length
  };
}
