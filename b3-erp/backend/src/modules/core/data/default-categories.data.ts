/**
 * Default Categories Data for ManufacturingOS
 * Categories are hierarchical and support multiple types
 */

export enum CategoryType {
  ITEM = 'ITEM',
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  ASSET = 'ASSET',
  EXPENSE = 'EXPENSE',
}

export interface DefaultCategory {
  categoryCode: string;
  categoryName: string;
  categoryType: CategoryType;
  parentCategoryCode?: string;
  level: number;
  description?: string;
  sortOrder: number;
}

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  // ============================================
  // ITEM CATEGORIES (For Inventory/Products)
  // ============================================

  // Root Item Categories
  {
    categoryCode: 'ITEM-RAW',
    categoryName: 'Raw Materials',
    categoryType: CategoryType.ITEM,
    level: 1,
    description: 'Raw materials used in manufacturing',
    sortOrder: 1,
  },
  {
    categoryCode: 'ITEM-COMP',
    categoryName: 'Components',
    categoryType: CategoryType.ITEM,
    level: 1,
    description: 'Components and sub-assemblies',
    sortOrder: 2,
  },
  {
    categoryCode: 'ITEM-FG',
    categoryName: 'Finished Goods',
    categoryType: CategoryType.ITEM,
    level: 1,
    description: 'Finished products ready for sale',
    sortOrder: 3,
  },
  {
    categoryCode: 'ITEM-CONS',
    categoryName: 'Consumables',
    categoryType: CategoryType.ITEM,
    level: 1,
    description: 'Consumable items and supplies',
    sortOrder: 4,
  },
  {
    categoryCode: 'ITEM-SPARE',
    categoryName: 'Spare Parts',
    categoryType: CategoryType.ITEM,
    level: 1,
    description: 'Spare parts and maintenance items',
    sortOrder: 5,
  },
  {
    categoryCode: 'ITEM-PKG',
    categoryName: 'Packaging Materials',
    categoryType: CategoryType.ITEM,
    level: 1,
    description: 'Packaging and shipping materials',
    sortOrder: 6,
  },

  // Raw Materials Sub-categories
  {
    categoryCode: 'ITEM-RAW-METAL',
    categoryName: 'Metals & Alloys',
    categoryType: CategoryType.ITEM,
    parentCategoryCode: 'ITEM-RAW',
    level: 2,
    description: 'Metal raw materials including steel, aluminum, copper',
    sortOrder: 1,
  },
  {
    categoryCode: 'ITEM-RAW-PLASTIC',
    categoryName: 'Plastics & Polymers',
    categoryType: CategoryType.ITEM,
    parentCategoryCode: 'ITEM-RAW',
    level: 2,
    description: 'Plastic materials and polymers',
    sortOrder: 2,
  },
  {
    categoryCode: 'ITEM-RAW-CHEM',
    categoryName: 'Chemicals',
    categoryType: CategoryType.ITEM,
    parentCategoryCode: 'ITEM-RAW',
    level: 2,
    description: 'Chemical raw materials',
    sortOrder: 3,
  },
  {
    categoryCode: 'ITEM-RAW-ELEC',
    categoryName: 'Electronic Components',
    categoryType: CategoryType.ITEM,
    parentCategoryCode: 'ITEM-RAW',
    level: 2,
    description: 'Electronic components and ICs',
    sortOrder: 4,
  },
  {
    categoryCode: 'ITEM-RAW-RUBBER',
    categoryName: 'Rubber & Elastomers',
    categoryType: CategoryType.ITEM,
    parentCategoryCode: 'ITEM-RAW',
    level: 2,
    description: 'Rubber and elastomer materials',
    sortOrder: 5,
  },

  // Components Sub-categories
  {
    categoryCode: 'ITEM-COMP-MECH',
    categoryName: 'Mechanical Components',
    categoryType: CategoryType.ITEM,
    parentCategoryCode: 'ITEM-COMP',
    level: 2,
    description: 'Mechanical parts and assemblies',
    sortOrder: 1,
  },
  {
    categoryCode: 'ITEM-COMP-ELEC',
    categoryName: 'Electrical Components',
    categoryType: CategoryType.ITEM,
    parentCategoryCode: 'ITEM-COMP',
    level: 2,
    description: 'Electrical parts and assemblies',
    sortOrder: 2,
  },
  {
    categoryCode: 'ITEM-COMP-HYDR',
    categoryName: 'Hydraulic Components',
    categoryType: CategoryType.ITEM,
    parentCategoryCode: 'ITEM-COMP',
    level: 2,
    description: 'Hydraulic systems and parts',
    sortOrder: 3,
  },
  {
    categoryCode: 'ITEM-COMP-PNEU',
    categoryName: 'Pneumatic Components',
    categoryType: CategoryType.ITEM,
    parentCategoryCode: 'ITEM-COMP',
    level: 2,
    description: 'Pneumatic systems and parts',
    sortOrder: 4,
  },

  // Finished Goods Sub-categories
  {
    categoryCode: 'ITEM-FG-MACH',
    categoryName: 'Machinery',
    categoryType: CategoryType.ITEM,
    parentCategoryCode: 'ITEM-FG',
    level: 2,
    description: 'Industrial machinery',
    sortOrder: 1,
  },
  {
    categoryCode: 'ITEM-FG-EQUIP',
    categoryName: 'Equipment',
    categoryType: CategoryType.ITEM,
    parentCategoryCode: 'ITEM-FG',
    level: 2,
    description: 'Industrial equipment',
    sortOrder: 2,
  },
  {
    categoryCode: 'ITEM-FG-TOOL',
    categoryName: 'Tools',
    categoryType: CategoryType.ITEM,
    parentCategoryCode: 'ITEM-FG',
    level: 2,
    description: 'Industrial tools',
    sortOrder: 3,
  },

  // ============================================
  // CUSTOMER CATEGORIES
  // ============================================
  {
    categoryCode: 'CUST-IND',
    categoryName: 'Industrial',
    categoryType: CategoryType.CUSTOMER,
    level: 1,
    description: 'Industrial customers',
    sortOrder: 1,
  },
  {
    categoryCode: 'CUST-COMM',
    categoryName: 'Commercial',
    categoryType: CategoryType.CUSTOMER,
    level: 1,
    description: 'Commercial customers',
    sortOrder: 2,
  },
  {
    categoryCode: 'CUST-GOV',
    categoryName: 'Government',
    categoryType: CategoryType.CUSTOMER,
    level: 1,
    description: 'Government entities',
    sortOrder: 3,
  },
  {
    categoryCode: 'CUST-DIST',
    categoryName: 'Distributors',
    categoryType: CategoryType.CUSTOMER,
    level: 1,
    description: 'Distribution partners',
    sortOrder: 4,
  },
  {
    categoryCode: 'CUST-OEM',
    categoryName: 'OEM Customers',
    categoryType: CategoryType.CUSTOMER,
    level: 1,
    description: 'Original Equipment Manufacturers',
    sortOrder: 5,
  },
  {
    categoryCode: 'CUST-EXPORT',
    categoryName: 'Export Customers',
    categoryType: CategoryType.CUSTOMER,
    level: 1,
    description: 'International export customers',
    sortOrder: 6,
  },

  // Industrial Sub-categories
  {
    categoryCode: 'CUST-IND-MFG',
    categoryName: 'Manufacturing',
    categoryType: CategoryType.CUSTOMER,
    parentCategoryCode: 'CUST-IND',
    level: 2,
    description: 'Manufacturing companies',
    sortOrder: 1,
  },
  {
    categoryCode: 'CUST-IND-AUTO',
    categoryName: 'Automotive',
    categoryType: CategoryType.CUSTOMER,
    parentCategoryCode: 'CUST-IND',
    level: 2,
    description: 'Automotive industry',
    sortOrder: 2,
  },
  {
    categoryCode: 'CUST-IND-AERO',
    categoryName: 'Aerospace',
    categoryType: CategoryType.CUSTOMER,
    parentCategoryCode: 'CUST-IND',
    level: 2,
    description: 'Aerospace industry',
    sortOrder: 3,
  },
  {
    categoryCode: 'CUST-IND-ENERGY',
    categoryName: 'Energy & Power',
    categoryType: CategoryType.CUSTOMER,
    parentCategoryCode: 'CUST-IND',
    level: 2,
    description: 'Energy and power sector',
    sortOrder: 4,
  },

  // ============================================
  // VENDOR CATEGORIES
  // ============================================
  {
    categoryCode: 'VEND-RAW',
    categoryName: 'Raw Material Suppliers',
    categoryType: CategoryType.VENDOR,
    level: 1,
    description: 'Suppliers of raw materials',
    sortOrder: 1,
  },
  {
    categoryCode: 'VEND-COMP',
    categoryName: 'Component Suppliers',
    categoryType: CategoryType.VENDOR,
    level: 1,
    description: 'Suppliers of components and parts',
    sortOrder: 2,
  },
  {
    categoryCode: 'VEND-SERV',
    categoryName: 'Service Providers',
    categoryType: CategoryType.VENDOR,
    level: 1,
    description: 'Service providers',
    sortOrder: 3,
  },
  {
    categoryCode: 'VEND-EQUIP',
    categoryName: 'Equipment Suppliers',
    categoryType: CategoryType.VENDOR,
    level: 1,
    description: 'Suppliers of equipment and machinery',
    sortOrder: 4,
  },
  {
    categoryCode: 'VEND-CONS',
    categoryName: 'Consumable Suppliers',
    categoryType: CategoryType.VENDOR,
    level: 1,
    description: 'Suppliers of consumables',
    sortOrder: 5,
  },
  {
    categoryCode: 'VEND-LOG',
    categoryName: 'Logistics Partners',
    categoryType: CategoryType.VENDOR,
    level: 1,
    description: 'Transportation and logistics',
    sortOrder: 6,
  },

  // Service Providers Sub-categories
  {
    categoryCode: 'VEND-SERV-MAINT',
    categoryName: 'Maintenance Services',
    categoryType: CategoryType.VENDOR,
    parentCategoryCode: 'VEND-SERV',
    level: 2,
    description: 'Maintenance and repair services',
    sortOrder: 1,
  },
  {
    categoryCode: 'VEND-SERV-CALIB',
    categoryName: 'Calibration Services',
    categoryType: CategoryType.VENDOR,
    parentCategoryCode: 'VEND-SERV',
    level: 2,
    description: 'Calibration and testing services',
    sortOrder: 2,
  },
  {
    categoryCode: 'VEND-SERV-IT',
    categoryName: 'IT Services',
    categoryType: CategoryType.VENDOR,
    parentCategoryCode: 'VEND-SERV',
    level: 2,
    description: 'IT and software services',
    sortOrder: 3,
  },
  {
    categoryCode: 'VEND-SERV-CONSULT',
    categoryName: 'Consulting Services',
    categoryType: CategoryType.VENDOR,
    parentCategoryCode: 'VEND-SERV',
    level: 2,
    description: 'Consulting and advisory services',
    sortOrder: 4,
  },

  // ============================================
  // ASSET CATEGORIES
  // ============================================
  {
    categoryCode: 'ASSET-MACH',
    categoryName: 'Machinery & Equipment',
    categoryType: CategoryType.ASSET,
    level: 1,
    description: 'Production machinery and equipment',
    sortOrder: 1,
  },
  {
    categoryCode: 'ASSET-VEH',
    categoryName: 'Vehicles',
    categoryType: CategoryType.ASSET,
    level: 1,
    description: 'Company vehicles',
    sortOrder: 2,
  },
  {
    categoryCode: 'ASSET-FURN',
    categoryName: 'Furniture & Fixtures',
    categoryType: CategoryType.ASSET,
    level: 1,
    description: 'Office furniture and fixtures',
    sortOrder: 3,
  },
  {
    categoryCode: 'ASSET-IT',
    categoryName: 'IT Equipment',
    categoryType: CategoryType.ASSET,
    level: 1,
    description: 'Computers and IT infrastructure',
    sortOrder: 4,
  },
  {
    categoryCode: 'ASSET-TOOL',
    categoryName: 'Tools & Instruments',
    categoryType: CategoryType.ASSET,
    level: 1,
    description: 'Measuring instruments and tools',
    sortOrder: 5,
  },
  {
    categoryCode: 'ASSET-LAND',
    categoryName: 'Land & Buildings',
    categoryType: CategoryType.ASSET,
    level: 1,
    description: 'Real estate assets',
    sortOrder: 6,
  },

  // ============================================
  // EXPENSE CATEGORIES
  // ============================================
  {
    categoryCode: 'EXP-ADMIN',
    categoryName: 'Administrative Expenses',
    categoryType: CategoryType.EXPENSE,
    level: 1,
    description: 'General administrative expenses',
    sortOrder: 1,
  },
  {
    categoryCode: 'EXP-MFG',
    categoryName: 'Manufacturing Expenses',
    categoryType: CategoryType.EXPENSE,
    level: 1,
    description: 'Direct manufacturing costs',
    sortOrder: 2,
  },
  {
    categoryCode: 'EXP-SELL',
    categoryName: 'Selling & Distribution',
    categoryType: CategoryType.EXPENSE,
    level: 1,
    description: 'Sales and distribution expenses',
    sortOrder: 3,
  },
  {
    categoryCode: 'EXP-FIN',
    categoryName: 'Financial Expenses',
    categoryType: CategoryType.EXPENSE,
    level: 1,
    description: 'Interest and financial charges',
    sortOrder: 4,
  },
  {
    categoryCode: 'EXP-HR',
    categoryName: 'HR & Employee Expenses',
    categoryType: CategoryType.EXPENSE,
    level: 1,
    description: 'Employee related expenses',
    sortOrder: 5,
  },
  {
    categoryCode: 'EXP-MAINT',
    categoryName: 'Maintenance & Repairs',
    categoryType: CategoryType.EXPENSE,
    level: 1,
    description: 'Maintenance and repair expenses',
    sortOrder: 6,
  },

  // Administrative Sub-categories
  {
    categoryCode: 'EXP-ADMIN-OFFICE',
    categoryName: 'Office Supplies',
    categoryType: CategoryType.EXPENSE,
    parentCategoryCode: 'EXP-ADMIN',
    level: 2,
    description: 'Office supplies and stationery',
    sortOrder: 1,
  },
  {
    categoryCode: 'EXP-ADMIN-UTIL',
    categoryName: 'Utilities',
    categoryType: CategoryType.EXPENSE,
    parentCategoryCode: 'EXP-ADMIN',
    level: 2,
    description: 'Electricity, water, gas',
    sortOrder: 2,
  },
  {
    categoryCode: 'EXP-ADMIN-RENT',
    categoryName: 'Rent & Lease',
    categoryType: CategoryType.EXPENSE,
    parentCategoryCode: 'EXP-ADMIN',
    level: 2,
    description: 'Rent and lease payments',
    sortOrder: 3,
  },
  {
    categoryCode: 'EXP-ADMIN-COMM',
    categoryName: 'Communication',
    categoryType: CategoryType.EXPENSE,
    parentCategoryCode: 'EXP-ADMIN',
    level: 2,
    description: 'Phone, internet, postage',
    sortOrder: 4,
  },
];
