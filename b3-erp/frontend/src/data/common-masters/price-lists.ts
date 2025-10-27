export interface PriceList {
  id: string;
  priceListCode: string;
  priceListName: string;
  description: string;

  // Pricing
  pricingMethod: 'fixed' | 'markup' | 'discount_from_mrp';
  basePrice: 'cost' | 'standard' | 'mrp';
  markupPercentage?: number;
  discountPercentage?: number;

  // Applicability
  applicableFor: 'sales' | 'purchase';
  customerCategory?: string;
  territory?: string;
  currency: string;

  // Validity
  effectiveFrom: string;
  effectiveTo: string | null;
  autoUpdate: boolean;

  // Items
  itemsCount: number;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;

  // Usage
  customersUsing: number;
  transactionsCount: number;
  totalAmount: number;
  lastUsedDate: string;

  isDefault: boolean;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
}

export const mockPriceLists: PriceList[] = [
  {
    id: 'PL001',
    priceListCode: 'DIST-2025',
    priceListName: 'Distributor Pricing 2025',
    description: 'Special pricing for authorized distributors',
    pricingMethod: 'discount_from_mrp',
    basePrice: 'mrp',
    discountPercentage: 25,
    applicableFor: 'sales',
    customerCategory: 'Distributors',
    currency: 'INR',
    effectiveFrom: '2025-01-01',
    effectiveTo: null,
    autoUpdate: true,
    itemsCount: 124,
    minPrice: 1200,
    maxPrice: 85000,
    avgPrice: 12400,
    customersUsing: 12,
    transactionsCount: 842,
    totalAmount: 85600000,
    lastUsedDate: '2025-01-24',
    isDefault: false,
    isActive: true,
    createdBy: 'Sales Manager',
    createdDate: '2024-12-15'
  },
  {
    id: 'PL002',
    priceListCode: 'DEAL-2025',
    priceListName: 'Dealer Pricing 2025',
    description: 'Standard dealer pricing',
    pricingMethod: 'discount_from_mrp',
    basePrice: 'mrp',
    discountPercentage: 18,
    applicableFor: 'sales',
    customerCategory: 'Dealers',
    currency: 'INR',
    effectiveFrom: '2025-01-01',
    effectiveTo: null,
    autoUpdate: true,
    itemsCount: 124,
    minPrice: 1500,
    maxPrice: 95000,
    avgPrice: 14200,
    customersUsing: 42,
    transactionsCount: 1586,
    totalAmount: 124800000,
    lastUsedDate: '2025-01-25',
    isDefault: false,
    isActive: true,
    createdBy: 'Sales Manager',
    createdDate: '2024-12-15'
  },
  {
    id: 'PL003',
    priceListCode: 'RET-2025',
    priceListName: 'Retail Pricing 2025',
    description: 'Retail store pricing with margin',
    pricingMethod: 'discount_from_mrp',
    basePrice: 'mrp',
    discountPercentage: 12,
    applicableFor: 'sales',
    customerCategory: 'Retailers',
    currency: 'INR',
    effectiveFrom: '2025-01-01',
    effectiveTo: null,
    autoUpdate: true,
    itemsCount: 124,
    minPrice: 1800,
    maxPrice: 105000,
    avgPrice: 15800,
    customersUsing: 86,
    transactionsCount: 2842,
    totalAmount: 64200000,
    lastUsedDate: '2025-01-25',
    isDefault: false,
    isActive: true,
    createdBy: 'Sales Manager',
    createdDate: '2024-12-15'
  },
  {
    id: 'PL004',
    priceListCode: 'INST-2025',
    priceListName: 'Institutional Pricing 2025',
    description: 'Special pricing for hotels and restaurants',
    pricingMethod: 'discount_from_mrp',
    basePrice: 'mrp',
    discountPercentage: 10,
    applicableFor: 'sales',
    customerCategory: 'Institutional',
    currency: 'INR',
    effectiveFrom: '2025-01-01',
    effectiveTo: null,
    autoUpdate: true,
    itemsCount: 98,
    minPrice: 2000,
    maxPrice: 110000,
    avgPrice: 16500,
    customersUsing: 28,
    transactionsCount: 642,
    totalAmount: 42600000,
    lastUsedDate: '2025-01-23',
    isDefault: false,
    isActive: true,
    createdBy: 'Sales Manager',
    createdDate: '2024-12-15'
  },
  {
    id: 'PL005',
    priceListCode: 'GOV-2025',
    priceListName: 'Government Pricing 2025',
    description: 'Government tender pricing',
    pricingMethod: 'discount_from_mrp',
    basePrice: 'mrp',
    discountPercentage: 8,
    applicableFor: 'sales',
    customerCategory: 'Government',
    currency: 'INR',
    effectiveFrom: '2025-01-01',
    effectiveTo: null,
    autoUpdate: false,
    itemsCount: 86,
    minPrice: 2200,
    maxPrice: 115000,
    avgPrice: 17200,
    customersUsing: 8,
    transactionsCount: 124,
    totalAmount: 18400000,
    lastUsedDate: '2025-01-20',
    isDefault: false,
    isActive: true,
    createdBy: 'Sales Manager',
    createdDate: '2024-12-15'
  },
  {
    id: 'PL006',
    priceListCode: 'MRP-2025',
    priceListName: 'Retail MRP 2025',
    description: 'Maximum Retail Price for end users',
    pricingMethod: 'fixed',
    basePrice: 'mrp',
    applicableFor: 'sales',
    customerCategory: 'End Users',
    currency: 'INR',
    effectiveFrom: '2025-01-01',
    effectiveTo: null,
    autoUpdate: false,
    itemsCount: 124,
    minPrice: 2500,
    maxPrice: 125000,
    avgPrice: 18500,
    customersUsing: 124,
    transactionsCount: 856,
    totalAmount: 12400000,
    lastUsedDate: '2025-01-25',
    isDefault: true,
    isActive: true,
    createdBy: 'Sales Manager',
    createdDate: '2024-12-01'
  }
];

export function getPriceListStats() {
  return {
    total: mockPriceLists.length,
    active: mockPriceLists.filter(p => p.isActive).length,
    forSales: mockPriceLists.filter(p => p.applicableFor === 'sales').length,
    totalCustomers: mockPriceLists.reduce((sum, p) => sum + p.customersUsing, 0),
    totalTransactions: mockPriceLists.reduce((sum, p) => sum + p.transactionsCount, 0),
    totalAmount: mockPriceLists.reduce((sum, p) => sum + p.totalAmount, 0),
    defaultList: mockPriceLists.find(p => p.isDefault)
  };
}
