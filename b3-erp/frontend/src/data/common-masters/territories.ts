export interface Territory {
  id: string;
  territoryCode: string;
  territoryName: string;
  territoryType: 'country' | 'region' | 'state' | 'zone' | 'city' | 'area';
  parentTerritoryId: string | null;
  parentTerritoryName: string | null;
  level: number;

  // Geographic Details
  country: string;
  state?: string;
  region?: string;
  zone?: string;

  // Coverage
  cities: string[];
  pincodes: string[];
  coverageArea: string; // in sq km

  // Sales Information
  salesManager: string;
  salesTeam: string[];
  totalCustomers: number;
  activeCustomers: number;

  // Performance Metrics
  currentMonthSales: number;
  currentYearSales: number;
  lastYearSales: number;
  salesTarget: number;
  targetAchievement: number; // percentage

  // Business Potential
  marketPotential: 'low' | 'medium' | 'high' | 'very_high';
  competitionLevel: 'low' | 'moderate' | 'high' | 'intense';
  growthRate: number; // YoY percentage

  // Logistics
  warehouseLocation?: string;
  distributionCenter?: string;
  avgDeliveryDays: number;
  transportCost: number; // per km

  // Contact
  regionalOffice?: string;
  officeAddress?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;

  // Settings
  currency: string;
  taxRegion: string;
  allowCreditSales: boolean;
  defaultPaymentTerms: string;

  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export const mockTerritories: Territory[] = [
  // Country Level (0)
  {
    id: 'T001',
    territoryCode: 'INDIA',
    territoryName: 'India',
    territoryType: 'country',
    parentTerritoryId: null,
    parentTerritoryName: null,
    level: 0,
    country: 'India',
    cities: [],
    pincodes: [],
    coverageArea: '3,287,263',
    salesManager: 'Rajesh Kumar',
    salesTeam: ['SM001', 'SM002', 'SM003', 'SM004'],
    totalCustomers: 245,
    activeCustomers: 198,
    currentMonthSales: 15500000,
    currentYearSales: 185000000,
    lastYearSales: 162000000,
    salesTarget: 200000000,
    targetAchievement: 92.5,
    marketPotential: 'very_high',
    competitionLevel: 'intense',
    growthRate: 14.2,
    avgDeliveryDays: 7,
    transportCost: 12,
    currency: 'INR',
    taxRegion: 'India',
    allowCreditSales: true,
    defaultPaymentTerms: 'Net 30',
    isActive: true,
    createdBy: 'Admin',
    createdDate: '2024-01-15',
    modifiedBy: 'Rajesh Kumar',
    modifiedDate: '2025-01-20'
  },

  // Region Level (1)
  {
    id: 'T002',
    territoryCode: 'NORTH',
    territoryName: 'North India',
    territoryType: 'region',
    parentTerritoryId: 'T001',
    parentTerritoryName: 'India',
    level: 1,
    country: 'India',
    region: 'North',
    cities: ['Delhi', 'Noida', 'Gurgaon', 'Chandigarh', 'Ludhiana'],
    pincodes: ['110001-110096', '201301-201310', '122001-122505', '160001-160103', '141001-141120'],
    coverageArea: '862,367',
    salesManager: 'Amit Sharma',
    salesTeam: ['SE001', 'SE002', 'SE003'],
    totalCustomers: 82,
    activeCustomers: 68,
    currentMonthSales: 6200000,
    currentYearSales: 74000000,
    lastYearSales: 65000000,
    salesTarget: 80000000,
    targetAchievement: 92.5,
    marketPotential: 'very_high',
    competitionLevel: 'intense',
    growthRate: 13.8,
    warehouseLocation: 'Noida',
    distributionCenter: 'Delhi Hub',
    avgDeliveryDays: 3,
    transportCost: 10,
    regionalOffice: 'Noida Office',
    officeAddress: 'Sector 62, Noida, UP - 201309',
    contactPerson: 'Amit Sharma',
    contactPhone: '+91-9876543210',
    contactEmail: 'amit.sharma@b3erp.com',
    currency: 'INR',
    taxRegion: 'North',
    allowCreditSales: true,
    defaultPaymentTerms: 'Net 30',
    isActive: true,
    createdBy: 'Admin',
    createdDate: '2024-01-15',
    modifiedBy: 'Amit Sharma',
    modifiedDate: '2025-01-18'
  },

  {
    id: 'T003',
    territoryCode: 'WEST',
    territoryName: 'West India',
    territoryType: 'region',
    parentTerritoryId: 'T001',
    parentTerritoryName: 'India',
    level: 1,
    country: 'India',
    region: 'West',
    cities: ['Mumbai', 'Pune', 'Ahmedabad', 'Surat', 'Nashik'],
    pincodes: ['400001-400104', '411001-411062', '380001-380061', '395001-395010', '422001-422213'],
    coverageArea: '508,052',
    salesManager: 'Priya Desai',
    salesTeam: ['SE004', 'SE005', 'SE006'],
    totalCustomers: 95,
    activeCustomers: 78,
    currentMonthSales: 7100000,
    currentYearSales: 85000000,
    lastYearSales: 72000000,
    salesTarget: 92000000,
    targetAchievement: 92.4,
    marketPotential: 'very_high',
    competitionLevel: 'intense',
    growthRate: 18.1,
    warehouseLocation: 'Pune',
    distributionCenter: 'Mumbai Hub',
    avgDeliveryDays: 4,
    transportCost: 11,
    regionalOffice: 'Pune Office',
    officeAddress: 'Hinjewadi Phase 2, Pune, MH - 411057',
    contactPerson: 'Priya Desai',
    contactPhone: '+91-9876543211',
    contactEmail: 'priya.desai@b3erp.com',
    currency: 'INR',
    taxRegion: 'West',
    allowCreditSales: true,
    defaultPaymentTerms: 'Net 30',
    isActive: true,
    createdBy: 'Admin',
    createdDate: '2024-01-15',
    modifiedBy: 'Priya Desai',
    modifiedDate: '2025-01-19'
  },

  {
    id: 'T004',
    territoryCode: 'SOUTH',
    territoryName: 'South India',
    territoryType: 'region',
    parentTerritoryId: 'T001',
    parentTerritoryName: 'India',
    level: 1,
    country: 'India',
    region: 'South',
    cities: ['Bangalore', 'Chennai', 'Hyderabad', 'Coimbatore', 'Kochi'],
    pincodes: ['560001-560103', '600001-600126', '500001-500100', '641001-641050', '682001-682041'],
    coverageArea: '635,780',
    salesManager: 'Venkat Reddy',
    salesTeam: ['SE007', 'SE008', 'SE009'],
    totalCustomers: 68,
    activeCustomers: 52,
    currentMonthSales: 2200000,
    currentYearSales: 26000000,
    lastYearSales: 25000000,
    salesTarget: 28000000,
    targetAchievement: 92.9,
    marketPotential: 'high',
    competitionLevel: 'high',
    growthRate: 4.0,
    warehouseLocation: 'Bangalore',
    distributionCenter: 'Bangalore Hub',
    avgDeliveryDays: 5,
    transportCost: 13,
    regionalOffice: 'Bangalore Office',
    officeAddress: 'Electronic City Phase 1, Bangalore, KA - 560100',
    contactPerson: 'Venkat Reddy',
    contactPhone: '+91-9876543212',
    contactEmail: 'venkat.reddy@b3erp.com',
    currency: 'INR',
    taxRegion: 'South',
    allowCreditSales: true,
    defaultPaymentTerms: 'Net 45',
    isActive: true,
    createdBy: 'Admin',
    createdDate: '2024-01-15',
    modifiedBy: 'Venkat Reddy',
    modifiedDate: '2025-01-17'
  },

  // State Level (2)
  {
    id: 'T005',
    territoryCode: 'MH',
    territoryName: 'Maharashtra',
    territoryType: 'state',
    parentTerritoryId: 'T003',
    parentTerritoryName: 'West India',
    level: 2,
    country: 'India',
    state: 'Maharashtra',
    region: 'West',
    cities: ['Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Aurangabad'],
    pincodes: ['400001-400104', '411001-411062', '422001-422213', '440001-440035', '431001-431010'],
    coverageArea: '307,713',
    salesManager: 'Suresh Patil',
    salesTeam: ['SE010', 'SE011'],
    totalCustomers: 58,
    activeCustomers: 48,
    currentMonthSales: 4500000,
    currentYearSales: 54000000,
    lastYearSales: 46000000,
    salesTarget: 58000000,
    targetAchievement: 93.1,
    marketPotential: 'very_high',
    competitionLevel: 'intense',
    growthRate: 17.4,
    warehouseLocation: 'Pune',
    distributionCenter: 'Mumbai Hub',
    avgDeliveryDays: 3,
    transportCost: 10,
    regionalOffice: 'Pune Office',
    officeAddress: 'Hinjewadi Phase 2, Pune, MH - 411057',
    contactPerson: 'Suresh Patil',
    contactPhone: '+91-9876543213',
    contactEmail: 'suresh.patil@b3erp.com',
    currency: 'INR',
    taxRegion: 'Maharashtra',
    allowCreditSales: true,
    defaultPaymentTerms: 'Net 30',
    isActive: true,
    createdBy: 'Priya Desai',
    createdDate: '2024-02-01',
    modifiedBy: 'Suresh Patil',
    modifiedDate: '2025-01-20'
  },

  {
    id: 'T006',
    territoryCode: 'GJ',
    territoryName: 'Gujarat',
    territoryType: 'state',
    parentTerritoryId: 'T003',
    parentTerritoryName: 'West India',
    level: 2,
    country: 'India',
    state: 'Gujarat',
    region: 'West',
    cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
    pincodes: ['380001-380061', '395001-395010', '390001-390025', '360001-360007', '382001-382481'],
    coverageArea: '196,244',
    salesManager: 'Kiran Shah',
    salesTeam: ['SE012', 'SE013'],
    totalCustomers: 37,
    activeCustomers: 30,
    currentMonthSales: 2600000,
    currentYearSales: 31000000,
    lastYearSales: 26000000,
    salesTarget: 34000000,
    targetAchievement: 91.2,
    marketPotential: 'high',
    competitionLevel: 'high',
    growthRate: 19.2,
    warehouseLocation: 'Ahmedabad',
    distributionCenter: 'Ahmedabad Hub',
    avgDeliveryDays: 4,
    transportCost: 11,
    regionalOffice: 'Ahmedabad Office',
    officeAddress: 'SG Highway, Ahmedabad, GJ - 380015',
    contactPerson: 'Kiran Shah',
    contactPhone: '+91-9876543214',
    contactEmail: 'kiran.shah@b3erp.com',
    currency: 'INR',
    taxRegion: 'Gujarat',
    allowCreditSales: true,
    defaultPaymentTerms: 'Net 30',
    isActive: true,
    createdBy: 'Priya Desai',
    createdDate: '2024-02-01',
    modifiedBy: 'Kiran Shah',
    modifiedDate: '2025-01-18'
  },

  {
    id: 'T007',
    territoryCode: 'DL',
    territoryName: 'Delhi NCR',
    territoryType: 'state',
    parentTerritoryId: 'T002',
    parentTerritoryName: 'North India',
    level: 2,
    country: 'India',
    state: 'Delhi',
    region: 'North',
    cities: ['Delhi', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad'],
    pincodes: ['110001-110096', '201301-201310', '122001-122505', '121001-121010', '201001-201015'],
    coverageArea: '1,484',
    salesManager: 'Neha Gupta',
    salesTeam: ['SE014', 'SE015'],
    totalCustomers: 52,
    activeCustomers: 44,
    currentMonthSales: 4100000,
    currentYearSales: 49000000,
    lastYearSales: 43000000,
    salesTarget: 52000000,
    targetAchievement: 94.2,
    marketPotential: 'very_high',
    competitionLevel: 'intense',
    growthRate: 14.0,
    warehouseLocation: 'Noida',
    distributionCenter: 'Delhi Hub',
    avgDeliveryDays: 2,
    transportCost: 9,
    regionalOffice: 'Noida Office',
    officeAddress: 'Sector 62, Noida, UP - 201309',
    contactPerson: 'Neha Gupta',
    contactPhone: '+91-9876543215',
    contactEmail: 'neha.gupta@b3erp.com',
    currency: 'INR',
    taxRegion: 'Delhi',
    allowCreditSales: true,
    defaultPaymentTerms: 'Net 30',
    isActive: true,
    createdBy: 'Amit Sharma',
    createdDate: '2024-02-01',
    modifiedBy: 'Neha Gupta',
    modifiedDate: '2025-01-21'
  },

  {
    id: 'T008',
    territoryCode: 'KA',
    territoryName: 'Karnataka',
    territoryType: 'state',
    parentTerritoryId: 'T004',
    parentTerritoryName: 'South India',
    level: 2,
    country: 'India',
    state: 'Karnataka',
    region: 'South',
    cities: ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum'],
    pincodes: ['560001-560103', '570001-570030', '575001-575030', '580001-580032', '590001-590019'],
    coverageArea: '191,791',
    salesManager: 'Prakash Rao',
    salesTeam: ['SE016', 'SE017'],
    totalCustomers: 42,
    activeCustomers: 35,
    currentMonthSales: 1400000,
    currentYearSales: 16500000,
    lastYearSales: 16000000,
    salesTarget: 18000000,
    targetAchievement: 91.7,
    marketPotential: 'high',
    competitionLevel: 'high',
    growthRate: 3.1,
    warehouseLocation: 'Bangalore',
    distributionCenter: 'Bangalore Hub',
    avgDeliveryDays: 4,
    transportCost: 12,
    regionalOffice: 'Bangalore Office',
    officeAddress: 'Electronic City Phase 1, Bangalore, KA - 560100',
    contactPerson: 'Prakash Rao',
    contactPhone: '+91-9876543216',
    contactEmail: 'prakash.rao@b3erp.com',
    currency: 'INR',
    taxRegion: 'Karnataka',
    allowCreditSales: true,
    defaultPaymentTerms: 'Net 45',
    isActive: true,
    createdBy: 'Venkat Reddy',
    createdDate: '2024-02-01',
    modifiedBy: 'Prakash Rao',
    modifiedDate: '2025-01-16'
  },

  // Zone Level (3) - Example for major cities
  {
    id: 'T009',
    territoryCode: 'PUNE-WEST',
    territoryName: 'Pune West Zone',
    territoryType: 'zone',
    parentTerritoryId: 'T005',
    parentTerritoryName: 'Maharashtra',
    level: 3,
    country: 'India',
    state: 'Maharashtra',
    region: 'West',
    zone: 'Pune West',
    cities: ['Pune'],
    pincodes: ['411001-411045'],
    coverageArea: '243',
    salesManager: 'Rahul Joshi',
    salesTeam: ['SE018'],
    totalCustomers: 28,
    activeCustomers: 24,
    currentMonthSales: 1800000,
    currentYearSales: 21500000,
    lastYearSales: 18000000,
    salesTarget: 24000000,
    targetAchievement: 89.6,
    marketPotential: 'very_high',
    competitionLevel: 'intense',
    growthRate: 19.4,
    warehouseLocation: 'Hinjewadi',
    avgDeliveryDays: 1,
    transportCost: 8,
    contactPerson: 'Rahul Joshi',
    contactPhone: '+91-9876543217',
    contactEmail: 'rahul.joshi@b3erp.com',
    currency: 'INR',
    taxRegion: 'Maharashtra',
    allowCreditSales: true,
    defaultPaymentTerms: 'Net 30',
    isActive: true,
    createdBy: 'Suresh Patil',
    createdDate: '2024-03-01',
    modifiedBy: 'Rahul Joshi',
    modifiedDate: '2025-01-22'
  },

  {
    id: 'T010',
    territoryCode: 'BLR-NORTH',
    territoryName: 'Bangalore North Zone',
    territoryType: 'zone',
    parentTerritoryId: 'T008',
    parentTerritoryName: 'Karnataka',
    level: 3,
    country: 'India',
    state: 'Karnataka',
    region: 'South',
    zone: 'Bangalore North',
    cities: ['Bangalore'],
    pincodes: ['560001-560054'],
    coverageArea: '217',
    salesManager: 'Lakshmi Iyer',
    salesTeam: ['SE019'],
    totalCustomers: 18,
    activeCustomers: 15,
    currentMonthSales: 650000,
    currentYearSales: 7800000,
    lastYearSales: 7500000,
    salesTarget: 8500000,
    targetAchievement: 91.8,
    marketPotential: 'high',
    competitionLevel: 'high',
    growthRate: 4.0,
    warehouseLocation: 'Yelahanka',
    avgDeliveryDays: 1,
    transportCost: 8,
    contactPerson: 'Lakshmi Iyer',
    contactPhone: '+91-9876543218',
    contactEmail: 'lakshmi.iyer@b3erp.com',
    currency: 'INR',
    taxRegion: 'Karnataka',
    allowCreditSales: true,
    defaultPaymentTerms: 'Net 45',
    isActive: true,
    createdBy: 'Prakash Rao',
    createdDate: '2024-03-01',
    modifiedBy: 'Lakshmi Iyer',
    modifiedDate: '2025-01-15'
  }
];

export function getTerritoryStats() {
  return {
    total: mockTerritories.length,
    active: mockTerritories.filter(t => t.isActive).length,
    totalCustomers: mockTerritories.reduce((sum, t) => sum + t.totalCustomers, 0),
    activeCustomers: mockTerritories.reduce((sum, t) => sum + t.activeCustomers, 0),
    totalSales: mockTerritories.reduce((sum, t) => sum + t.currentYearSales, 0),
    avgTargetAchievement: Math.round(
      mockTerritories.reduce((sum, t) => sum + t.targetAchievement, 0) / mockTerritories.length
    ),
    topPerformer: mockTerritories.reduce((max, t) =>
      t.targetAchievement > max.targetAchievement ? t : max
    ),
    countries: new Set(mockTerritories.map(t => t.country)).size,
    regions: mockTerritories.filter(t => t.territoryType === 'region').length,
    states: mockTerritories.filter(t => t.territoryType === 'state').length,
    zones: mockTerritories.filter(t => t.territoryType === 'zone').length
  };
}

export function getChildTerritories(parentId: string): Territory[] {
  return mockTerritories.filter(t => t.parentTerritoryId === parentId);
}

export function getTerritoryHierarchy(territoryId: string): Territory[] {
  const hierarchy: Territory[] = [];
  let current = mockTerritories.find(t => t.id === territoryId);

  while (current) {
    hierarchy.unshift(current);
    current = current.parentTerritoryId
      ? mockTerritories.find(t => t.id === current!.parentTerritoryId)
      : undefined;
  }

  return hierarchy;
}
