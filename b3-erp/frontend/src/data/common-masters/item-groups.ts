export interface ItemGroup {
  id: string;
  groupCode: string;
  groupName: string;
  parentGroupId: string | null;
  parentGroupName?: string;
  level: number;
  category: 'raw_material' | 'semi_finished' | 'finished_goods' | 'consumables' | 'tools' | 'spare_parts';
  description: string;

  // Accounting Integration
  defaultPurchaseAccount?: string;
  defaultSalesAccount?: string;
  defaultInventoryAccount?: string;

  // Properties
  isAsset: boolean;
  isStockItem: boolean;
  allowNegativeStock: boolean;

  // Valuation
  valuationMethod: 'FIFO' | 'LIFO' | 'Weighted Average' | 'Standard Cost';

  // Attributes
  hasSerialNo: boolean;
  hasBatchNo: boolean;
  hasExpiryDate: boolean;
  shelfLife?: number; // in days

  // Manufacturing
  isManufactured: boolean;
  isPurchased: boolean;
  isSold: boolean;

  // Quality Control
  requiresQualityInspection: boolean;
  inspectionCriteria?: string[];

  // Tax
  defaultTaxCategory: string;
  hsnCode?: string;

  // Statistics
  totalItems: number;
  activeItems: number;

  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export const mockItemGroups: ItemGroup[] = [
  // Level 0 - Root Groups
  {
    id: '1',
    groupCode: 'RM',
    groupName: 'Raw Materials',
    parentGroupId: null,
    level: 0,
    category: 'raw_material',
    description: 'All raw materials used in kitchen manufacturing',
    defaultPurchaseAccount: '5000 - Raw Material Purchase',
    defaultInventoryAccount: '1400 - Raw Material Inventory',
    isAsset: true,
    isStockItem: true,
    allowNegativeStock: false,
    valuationMethod: 'Weighted Average',
    hasSerialNo: false,
    hasBatchNo: true,
    hasExpiryDate: false,
    isManufactured: false,
    isPurchased: true,
    isSold: false,
    requiresQualityInspection: true,
    inspectionCriteria: ['Chemical Composition', 'Physical Properties', 'Dimensions'],
    defaultTaxCategory: 'GST 18%',
    totalItems: 145,
    activeItems: 142,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    createdBy: 'SYSTEM'
  },
  {
    id: '2',
    groupCode: 'SF',
    groupName: 'Semi-Finished Goods',
    parentGroupId: null,
    level: 0,
    category: 'semi_finished',
    description: 'Work-in-progress and semi-finished components',
    defaultInventoryAccount: '1420 - WIP Inventory',
    isAsset: true,
    isStockItem: true,
    allowNegativeStock: false,
    valuationMethod: 'Standard Cost',
    hasSerialNo: false,
    hasBatchNo: true,
    hasExpiryDate: false,
    isManufactured: true,
    isPurchased: false,
    isSold: false,
    requiresQualityInspection: true,
    inspectionCriteria: ['Dimensions', 'Surface Finish', 'Welding Quality'],
    defaultTaxCategory: 'GST 18%',
    totalItems: 78,
    activeItems: 76,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    createdBy: 'SYSTEM'
  },
  {
    id: '3',
    groupCode: 'FG',
    groupName: 'Finished Goods',
    parentGroupId: null,
    level: 0,
    category: 'finished_goods',
    description: 'Completed kitchen products ready for sale',
    defaultSalesAccount: '4000 - Sales Revenue',
    defaultInventoryAccount: '1440 - Finished Goods Inventory',
    isAsset: true,
    isStockItem: true,
    allowNegativeStock: false,
    valuationMethod: 'Standard Cost',
    hasSerialNo: true,
    hasBatchNo: false,
    hasExpiryDate: false,
    isManufactured: true,
    isPurchased: false,
    isSold: true,
    requiresQualityInspection: true,
    inspectionCriteria: ['Final Quality Check', 'Functionality Test', 'Packaging'],
    defaultTaxCategory: 'GST 18%',
    totalItems: 234,
    activeItems: 228,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    createdBy: 'SYSTEM'
  },
  {
    id: '4',
    groupCode: 'CONS',
    groupName: 'Consumables',
    parentGroupId: null,
    level: 0,
    category: 'consumables',
    description: 'Consumable items used in production',
    defaultPurchaseAccount: '5200 - Consumables Purchase',
    isAsset: false,
    isStockItem: true,
    allowNegativeStock: true,
    valuationMethod: 'FIFO',
    hasSerialNo: false,
    hasBatchNo: false,
    hasExpiryDate: true,
    shelfLife: 365,
    isManufactured: false,
    isPurchased: true,
    isSold: false,
    requiresQualityInspection: false,
    defaultTaxCategory: 'GST 18%',
    totalItems: 56,
    activeItems: 54,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    createdBy: 'SYSTEM'
  },

  // Level 1 - Raw Material Sub-Groups
  {
    id: '11',
    groupCode: 'RM-MTL',
    groupName: 'Metals & Alloys',
    parentGroupId: '1',
    parentGroupName: 'Raw Materials',
    level: 1,
    category: 'raw_material',
    description: 'Stainless steel, aluminum, and other metals',
    defaultPurchaseAccount: '5000 - Raw Material Purchase',
    defaultInventoryAccount: '1400 - Raw Material Inventory',
    isAsset: true,
    isStockItem: true,
    allowNegativeStock: false,
    valuationMethod: 'Weighted Average',
    hasSerialNo: false,
    hasBatchNo: true,
    hasExpiryDate: false,
    isManufactured: false,
    isPurchased: true,
    isSold: false,
    requiresQualityInspection: true,
    inspectionCriteria: ['Grade Verification', 'Thickness Measurement', 'Surface Quality'],
    defaultTaxCategory: 'GST 18%',
    hsnCode: '7219',
    totalItems: 45,
    activeItems: 44,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    createdBy: 'SYSTEM'
  },
  {
    id: '12',
    groupCode: 'RM-GLS',
    groupName: 'Glass & Ceramics',
    parentGroupId: '1',
    parentGroupName: 'Raw Materials',
    level: 1,
    category: 'raw_material',
    description: 'Tempered glass, ceramic tiles, and glass sheets',
    defaultPurchaseAccount: '5000 - Raw Material Purchase',
    defaultInventoryAccount: '1400 - Raw Material Inventory',
    isAsset: true,
    isStockItem: true,
    allowNegativeStock: false,
    valuationMethod: 'FIFO',
    hasSerialNo: false,
    hasBatchNo: true,
    hasExpiryDate: false,
    isManufactured: false,
    isPurchased: true,
    isSold: false,
    requiresQualityInspection: true,
    inspectionCriteria: ['Thickness', 'Clarity', 'Breakage Check'],
    defaultTaxCategory: 'GST 18%',
    hsnCode: '7007',
    totalItems: 28,
    activeItems: 27,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    createdBy: 'SYSTEM'
  },
  {
    id: '13',
    groupCode: 'RM-HW',
    groupName: 'Hardware & Fittings',
    parentGroupId: '1',
    parentGroupName: 'Raw Materials',
    level: 1,
    category: 'raw_material',
    description: 'Hinges, handles, drawer channels, and other hardware',
    defaultPurchaseAccount: '5000 - Raw Material Purchase',
    defaultInventoryAccount: '1400 - Raw Material Inventory',
    isAsset: true,
    isStockItem: true,
    allowNegativeStock: false,
    valuationMethod: 'Weighted Average',
    hasSerialNo: false,
    hasBatchNo: true,
    hasExpiryDate: false,
    isManufactured: false,
    isPurchased: true,
    isSold: false,
    requiresQualityInspection: true,
    inspectionCriteria: ['Functionality', 'Finish Quality', 'Load Capacity'],
    defaultTaxCategory: 'GST 18%',
    hsnCode: '8302',
    totalItems: 72,
    activeItems: 71,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    createdBy: 'SYSTEM'
  },

  // Level 1 - Finished Goods Sub-Groups
  {
    id: '31',
    groupCode: 'FG-MOD',
    groupName: 'Modular Kitchens',
    parentGroupId: '3',
    parentGroupName: 'Finished Goods',
    level: 1,
    category: 'finished_goods',
    description: 'Complete modular kitchen systems',
    defaultSalesAccount: '4000 - Sales Revenue',
    defaultInventoryAccount: '1440 - Finished Goods Inventory',
    isAsset: true,
    isStockItem: true,
    allowNegativeStock: false,
    valuationMethod: 'Standard Cost',
    hasSerialNo: true,
    hasBatchNo: false,
    hasExpiryDate: false,
    isManufactured: true,
    isPurchased: false,
    isSold: true,
    requiresQualityInspection: true,
    inspectionCriteria: ['Complete Assembly Check', 'Finish Quality', 'Functionality'],
    defaultTaxCategory: 'GST 18%',
    hsnCode: '9403',
    totalItems: 48,
    activeItems: 46,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    createdBy: 'SYSTEM'
  },
  {
    id: '32',
    groupCode: 'FG-CAB',
    groupName: 'Cabinets & Storage',
    parentGroupId: '3',
    parentGroupName: 'Finished Goods',
    level: 1,
    category: 'finished_goods',
    description: 'Individual cabinets, drawers, and storage units',
    defaultSalesAccount: '4000 - Sales Revenue',
    defaultInventoryAccount: '1440 - Finished Goods Inventory',
    isAsset: true,
    isStockItem: true,
    allowNegativeStock: false,
    valuationMethod: 'Standard Cost',
    hasSerialNo: true,
    hasBatchNo: false,
    hasExpiryDate: false,
    isManufactured: true,
    isPurchased: false,
    isSold: true,
    requiresQualityInspection: true,
    inspectionCriteria: ['Door Alignment', 'Drawer Mechanism', 'Finish'],
    defaultTaxCategory: 'GST 18%',
    hsnCode: '9403',
    totalItems: 86,
    activeItems: 84,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    createdBy: 'SYSTEM'
  },
  {
    id: '33',
    groupCode: 'FG-CTP',
    groupName: 'Countertops & Worktops',
    parentGroupId: '3',
    parentGroupName: 'Finished Goods',
    level: 1,
    category: 'finished_goods',
    description: 'Granite, marble, and engineered stone countertops',
    defaultSalesAccount: '4000 - Sales Revenue',
    defaultInventoryAccount: '1440 - Finished Goods Inventory',
    isAsset: true,
    isStockItem: true,
    allowNegativeStock: false,
    valuationMethod: 'Standard Cost',
    hasSerialNo: true,
    hasBatchNo: false,
    hasExpiryDate: false,
    isManufactured: true,
    isPurchased: false,
    isSold: true,
    requiresQualityInspection: true,
    inspectionCriteria: ['Surface Finish', 'Edge Profile', 'Joint Quality'],
    defaultTaxCategory: 'GST 18%',
    hsnCode: '6810',
    totalItems: 34,
    activeItems: 33,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    createdBy: 'SYSTEM'
  },
  {
    id: '34',
    groupCode: 'FG-ACC',
    groupName: 'Kitchen Accessories',
    parentGroupId: '3',
    parentGroupName: 'Finished Goods',
    level: 1,
    category: 'finished_goods',
    description: 'Pull-out baskets, organizers, and accessories',
    defaultSalesAccount: '4000 - Sales Revenue',
    defaultInventoryAccount: '1440 - Finished Goods Inventory',
    isAsset: true,
    isStockItem: true,
    allowNegativeStock: false,
    valuationMethod: 'Weighted Average',
    hasSerialNo: false,
    hasBatchNo: true,
    hasExpiryDate: false,
    isManufactured: false,
    isPurchased: true,
    isSold: true,
    requiresQualityInspection: false,
    defaultTaxCategory: 'GST 18%',
    hsnCode: '8302',
    totalItems: 66,
    activeItems: 65,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    createdBy: 'SYSTEM'
  },

  // Level 2 - Detailed Sub-Categories
  {
    id: '111',
    groupCode: 'RM-MTL-SS',
    groupName: 'Stainless Steel',
    parentGroupId: '11',
    parentGroupName: 'Metals & Alloys',
    level: 2,
    category: 'raw_material',
    description: 'SS304, SS316 sheets and coils',
    defaultPurchaseAccount: '5000 - Raw Material Purchase',
    defaultInventoryAccount: '1400 - Raw Material Inventory',
    isAsset: true,
    isStockItem: true,
    allowNegativeStock: false,
    valuationMethod: 'Weighted Average',
    hasSerialNo: false,
    hasBatchNo: true,
    hasExpiryDate: false,
    isManufactured: false,
    isPurchased: true,
    isSold: false,
    requiresQualityInspection: true,
    inspectionCriteria: ['Grade Certificate', 'Thickness', 'Surface Finish'],
    defaultTaxCategory: 'GST 18%',
    hsnCode: '721930',
    totalItems: 28,
    activeItems: 28,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    createdBy: 'SYSTEM'
  },
  {
    id: '112',
    groupCode: 'RM-MTL-AL',
    groupName: 'Aluminum',
    parentGroupId: '11',
    parentGroupName: 'Metals & Alloys',
    level: 2,
    category: 'raw_material',
    description: 'Aluminum profiles, sheets, and extrusions',
    defaultPurchaseAccount: '5000 - Raw Material Purchase',
    defaultInventoryAccount: '1400 - Raw Material Inventory',
    isAsset: true,
    isStockItem: true,
    allowNegativeStock: false,
    valuationMethod: 'Weighted Average',
    hasSerialNo: false,
    hasBatchNo: true,
    hasExpiryDate: false,
    isManufactured: false,
    isPurchased: true,
    isSold: false,
    requiresQualityInspection: true,
    inspectionCriteria: ['Alloy Verification', 'Anodizing Quality', 'Dimensions'],
    defaultTaxCategory: 'GST 18%',
    hsnCode: '7604',
    totalItems: 17,
    activeItems: 16,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    createdBy: 'SYSTEM'
  },

  // Consumables Sub-Groups
  {
    id: '41',
    groupCode: 'CONS-CHM',
    groupName: 'Chemicals & Adhesives',
    parentGroupId: '4',
    parentGroupName: 'Consumables',
    level: 1,
    category: 'consumables',
    description: 'Adhesives, sealants, cleaning chemicals',
    defaultPurchaseAccount: '5200 - Consumables Purchase',
    isAsset: false,
    isStockItem: true,
    allowNegativeStock: true,
    valuationMethod: 'FIFO',
    hasSerialNo: false,
    hasBatchNo: true,
    hasExpiryDate: true,
    shelfLife: 180,
    isManufactured: false,
    isPurchased: true,
    isSold: false,
    requiresQualityInspection: false,
    defaultTaxCategory: 'GST 18%',
    hsnCode: '3506',
    totalItems: 23,
    activeItems: 22,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    createdBy: 'SYSTEM'
  },
  {
    id: '42',
    groupCode: 'CONS-PKG',
    groupName: 'Packaging Materials',
    parentGroupId: '4',
    parentGroupName: 'Consumables',
    level: 1,
    category: 'consumables',
    description: 'Cartons, bubble wrap, packing tape',
    defaultPurchaseAccount: '5200 - Consumables Purchase',
    isAsset: false,
    isStockItem: true,
    allowNegativeStock: true,
    valuationMethod: 'FIFO',
    hasSerialNo: false,
    hasBatchNo: false,
    hasExpiryDate: false,
    isManufactured: false,
    isPurchased: true,
    isSold: false,
    requiresQualityInspection: false,
    defaultTaxCategory: 'GST 18%',
    hsnCode: '4819',
    totalItems: 18,
    activeItems: 18,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    createdBy: 'SYSTEM'
  }
];

// Helper functions
export function getTopLevelGroups(): ItemGroup[] {
  return mockItemGroups.filter(group => group.level === 0);
}

export function getChildGroups(parentId: string): ItemGroup[] {
  return mockItemGroups.filter(group => group.parentGroupId === parentId);
}

export function getGroupsByCategory(category: string): ItemGroup[] {
  return mockItemGroups.filter(group => group.category === category);
}

export function getGroupHierarchy(groupId: string): ItemGroup[] {
  const hierarchy: ItemGroup[] = [];
  let currentGroup = mockItemGroups.find(g => g.id === groupId);

  while (currentGroup) {
    hierarchy.unshift(currentGroup);
    if (currentGroup.parentGroupId) {
      currentGroup = mockItemGroups.find(g => g.id === currentGroup!.parentGroupId);
    } else {
      break;
    }
  }

  return hierarchy;
}

export function getItemGroupStats() {
  return {
    total: mockItemGroups.length,
    active: mockItemGroups.filter(g => g.isActive).length,
    rawMaterial: mockItemGroups.filter(g => g.category === 'raw_material').length,
    semiFinished: mockItemGroups.filter(g => g.category === 'semi_finished').length,
    finishedGoods: mockItemGroups.filter(g => g.category === 'finished_goods').length,
    consumables: mockItemGroups.filter(g => g.category === 'consumables').length,
    totalItems: mockItemGroups.reduce((sum, g) => sum + g.totalItems, 0)
  };
}
