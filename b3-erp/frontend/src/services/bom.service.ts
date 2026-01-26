import { apiClient } from './api/client';

// ============================================================================
// INTERFACES
// ============================================================================

export type BOMStatus = 'Draft' | 'Submitted' | 'Approved' | 'Active' | 'Obsolete' | 'Rejected';

export type BOMType = 'Manufacturing' | 'Engineering' | 'Planning' | 'Sales';

export interface BOMComponent {
  id: string;
  lineNumber: number;
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  uom: string;
  scrapPercentage: number;
  effectiveDate: string;
  expiryDate?: string;
  isPhantom: boolean;
  childBOMId?: string; // Reference to child BOM for sub-assemblies
  operationNumber?: number;
  position?: string;
  notes?: string;
  unitCost: number;
  totalCost: number;
}

export interface BOMOperation {
  id: string;
  operationNumber: number;
  operationName: string;
  workCenterId: string;
  workCenterName: string;
  setupTime: number; // minutes
  runTime: number; // minutes per unit
  description?: string;
  instructions?: string;
  laborCost: number;
  overheadCost: number;
  sequence: number;
}

export interface BOM {
  id: string;
  bomCode: string;
  bomName: string;
  version: string;
  productId: string;
  productCode: string;
  productName: string;
  bomType: BOMType;
  status: BOMStatus;
  effectiveDate: string;
  expiryDate?: string;
  baseQuantity: number;
  uom: string;
  description?: string;
  components: BOMComponent[];
  operations: BOMOperation[];
  totalMaterialCost: number;
  totalLaborCost: number;
  totalOverheadCost: number;
  totalCost: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  submittedBy?: string;
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  approvalComments?: string;
}

export interface ExplodedBOMItem {
  level: number;
  itemId: string;
  itemCode: string;
  itemName: string;
  parentItemCode?: string;
  quantity: number;
  extendedQuantity: number; // quantity * parent quantities
  uom: string;
  unitCost: number;
  extendedCost: number;
  isPhantom: boolean;
  leadTime: number;
  bomId?: string;
}

export interface CostRollupResult {
  bomId: string;
  bomCode: string;
  productCode: string;
  productName: string;
  totalMaterialCost: number;
  totalLaborCost: number;
  totalOverheadCost: number;
  totalCost: number;
  costBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  componentCosts: {
    itemCode: string;
    itemName: string;
    quantity: number;
    unitCost: number;
    extendedCost: number;
  }[];
  calculatedAt: string;
}

export interface CreateBOMDto {
  productId: string;
  bomType: BOMType;
  baseQuantity: number;
  description?: string;
  effectiveDate: string;
  expiryDate?: string;
  components: Omit<BOMComponent, 'id' | 'totalCost'>[];
  operations?: Omit<BOMOperation, 'id'>[];
}

export interface UpdateBOMDto extends Partial<CreateBOMDto> {
  status?: BOMStatus;
}

export interface BOMFilters {
  status?: BOMStatus;
  bomType?: BOMType;
  productId?: string;
  search?: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const USE_MOCK_DATA = true;

export const MOCK_BOMS: BOM[] = [
  {
    id: 'bom-001',
    bomCode: 'BOM-MOTOR-001',
    bomName: 'Electric Motor Assembly 5HP BOM',
    version: '1.0',
    productId: 'prod-001',
    productCode: 'FG-MOTOR-001',
    productName: 'Electric Motor Assembly 5HP',
    bomType: 'Manufacturing',
    status: 'Active',
    effectiveDate: '2024-01-01',
    baseQuantity: 1,
    uom: 'Units',
    description: 'Standard BOM for 5HP electric motor assembly',
    components: [
      {
        id: 'comp-001',
        lineNumber: 10,
        itemId: 'item-001',
        itemCode: 'RM-COPPER-WIRE',
        itemName: 'Copper Magnet Wire 18AWG',
        quantity: 5,
        uom: 'Meters',
        scrapPercentage: 2,
        effectiveDate: '2024-01-01',
        isPhantom: false,
        operationNumber: 10,
        unitCost: 2.50,
        totalCost: 12.50,
      },
      {
        id: 'comp-002',
        lineNumber: 20,
        itemId: 'item-002',
        itemCode: 'RM-STEEL-CORE',
        itemName: 'Laminated Steel Core',
        quantity: 1,
        uom: 'Units',
        scrapPercentage: 1,
        effectiveDate: '2024-01-01',
        isPhantom: false,
        operationNumber: 10,
        unitCost: 45.00,
        totalCost: 45.00,
      },
      {
        id: 'comp-003',
        lineNumber: 30,
        itemId: 'item-003',
        itemCode: 'RM-ROTOR-SHAFT',
        itemName: 'Rotor Shaft Assembly',
        quantity: 1,
        uom: 'Units',
        scrapPercentage: 0,
        effectiveDate: '2024-01-01',
        isPhantom: true,
        childBOMId: 'bom-004',
        operationNumber: 20,
        unitCost: 35.00,
        totalCost: 35.00,
      },
      {
        id: 'comp-004',
        lineNumber: 40,
        itemId: 'item-004',
        itemCode: 'RM-BEARING-6205',
        itemName: 'Ball Bearing 6205-2RS',
        quantity: 2,
        uom: 'Units',
        scrapPercentage: 0,
        effectiveDate: '2024-01-01',
        isPhantom: false,
        operationNumber: 30,
        unitCost: 8.50,
        totalCost: 17.00,
      },
      {
        id: 'comp-005',
        lineNumber: 50,
        itemId: 'item-005',
        itemCode: 'RM-MOTOR-HOUSING',
        itemName: 'Motor Housing Cast Iron',
        quantity: 1,
        uom: 'Units',
        scrapPercentage: 0,
        effectiveDate: '2024-01-01',
        isPhantom: false,
        operationNumber: 30,
        unitCost: 28.00,
        totalCost: 28.00,
      },
    ],
    operations: [
      {
        id: 'op-001',
        operationNumber: 10,
        operationName: 'Stator Winding',
        workCenterId: 'wc-002',
        workCenterName: 'Winding Station',
        setupTime: 30,
        runTime: 15,
        description: 'Wind copper wire on stator core',
        instructions: '1. Mount stator core on winding machine\n2. Set wire tension\n3. Execute winding program',
        laborCost: 25.00,
        overheadCost: 10.00,
        sequence: 1,
      },
      {
        id: 'op-002',
        operationNumber: 20,
        operationName: 'Rotor Assembly',
        workCenterId: 'wc-003',
        workCenterName: 'Rotor Station',
        setupTime: 20,
        runTime: 12,
        description: 'Assemble rotor shaft with core',
        laborCost: 22.00,
        overheadCost: 8.00,
        sequence: 2,
      },
      {
        id: 'op-003',
        operationNumber: 30,
        operationName: 'Final Assembly',
        workCenterId: 'wc-001',
        workCenterName: 'Assembly Line A',
        setupTime: 45,
        runTime: 25,
        description: 'Complete motor assembly with housing and bearings',
        laborCost: 30.00,
        overheadCost: 15.00,
        sequence: 3,
      },
    ],
    totalMaterialCost: 137.50,
    totalLaborCost: 77.00,
    totalOverheadCost: 33.00,
    totalCost: 247.50,
    createdBy: 'engineer-001',
    createdAt: '2023-12-15T10:00:00Z',
    updatedAt: '2024-01-02T14:30:00Z',
    submittedBy: 'engineer-001',
    submittedAt: '2023-12-20T09:00:00Z',
    approvedBy: 'prod-manager',
    approvedAt: '2023-12-22T11:00:00Z',
  },
  {
    id: 'bom-002',
    bomCode: 'BOM-PUMP-001',
    bomName: 'Centrifugal Pump 10HP BOM',
    version: '2.1',
    productId: 'prod-002',
    productCode: 'FG-PUMP-001',
    productName: 'Centrifugal Pump 10HP',
    bomType: 'Manufacturing',
    status: 'Active',
    effectiveDate: '2024-01-01',
    baseQuantity: 1,
    uom: 'Units',
    description: 'Manufacturing BOM for 10HP centrifugal pump',
    components: [
      {
        id: 'comp-006',
        lineNumber: 10,
        itemId: 'item-006',
        itemCode: 'RM-SS-IMPELLER',
        itemName: 'Stainless Steel Impeller',
        quantity: 1,
        uom: 'Units',
        scrapPercentage: 0,
        effectiveDate: '2024-01-01',
        isPhantom: false,
        operationNumber: 10,
        unitCost: 125.00,
        totalCost: 125.00,
      },
      {
        id: 'comp-007',
        lineNumber: 20,
        itemId: 'item-007',
        itemCode: 'RM-PUMP-CASING',
        itemName: 'Pump Casing Cast Iron',
        quantity: 1,
        uom: 'Units',
        scrapPercentage: 0,
        effectiveDate: '2024-01-01',
        isPhantom: false,
        operationNumber: 20,
        unitCost: 180.00,
        totalCost: 180.00,
      },
      {
        id: 'comp-008',
        lineNumber: 30,
        itemId: 'item-008',
        itemCode: 'RM-MECH-SEAL',
        itemName: 'Mechanical Seal Assembly',
        quantity: 1,
        uom: 'Units',
        scrapPercentage: 0,
        effectiveDate: '2024-01-01',
        isPhantom: false,
        operationNumber: 20,
        unitCost: 85.00,
        totalCost: 85.00,
      },
      {
        id: 'comp-009',
        lineNumber: 40,
        itemId: 'item-009',
        itemCode: 'RM-PUMP-SHAFT',
        itemName: 'Pump Shaft SS316',
        quantity: 1,
        uom: 'Units',
        scrapPercentage: 0,
        effectiveDate: '2024-01-01',
        isPhantom: false,
        operationNumber: 10,
        unitCost: 65.00,
        totalCost: 65.00,
      },
    ],
    operations: [
      {
        id: 'op-004',
        operationNumber: 10,
        operationName: 'Impeller Machining',
        workCenterId: 'wc-005',
        workCenterName: 'CNC Machining Center',
        setupTime: 60,
        runTime: 30,
        description: 'Machine impeller to final dimensions',
        laborCost: 35.00,
        overheadCost: 20.00,
        sequence: 1,
      },
      {
        id: 'op-005',
        operationNumber: 20,
        operationName: 'Pump Housing Assembly',
        workCenterId: 'wc-004',
        workCenterName: 'Pump Assembly Line',
        setupTime: 30,
        runTime: 20,
        description: 'Assemble pump components in housing',
        laborCost: 28.00,
        overheadCost: 12.00,
        sequence: 2,
      },
    ],
    totalMaterialCost: 455.00,
    totalLaborCost: 63.00,
    totalOverheadCost: 32.00,
    totalCost: 550.00,
    createdBy: 'engineer-002',
    createdAt: '2023-11-10T09:00:00Z',
    updatedAt: '2024-01-05T16:00:00Z',
    submittedBy: 'engineer-002',
    submittedAt: '2023-11-15T10:00:00Z',
    approvedBy: 'prod-manager',
    approvedAt: '2023-11-18T14:00:00Z',
  },
  {
    id: 'bom-003',
    bomCode: 'BOM-GEARBOX-001',
    bomName: 'Industrial Gearbox 3:1 BOM',
    version: '1.0',
    productId: 'prod-003',
    productCode: 'FG-GEARBOX-001',
    productName: 'Industrial Gearbox 3:1',
    bomType: 'Manufacturing',
    status: 'Submitted',
    effectiveDate: '2024-02-01',
    baseQuantity: 1,
    uom: 'Units',
    description: 'Manufacturing BOM for 3:1 ratio industrial gearbox',
    components: [
      {
        id: 'comp-010',
        lineNumber: 10,
        itemId: 'item-010',
        itemCode: 'RM-PINION-GEAR',
        itemName: 'Pinion Gear 20T',
        quantity: 1,
        uom: 'Units',
        scrapPercentage: 0,
        effectiveDate: '2024-02-01',
        isPhantom: false,
        operationNumber: 10,
        unitCost: 220.00,
        totalCost: 220.00,
      },
      {
        id: 'comp-011',
        lineNumber: 20,
        itemId: 'item-011',
        itemCode: 'RM-SPUR-GEAR',
        itemName: 'Spur Gear 60T',
        quantity: 1,
        uom: 'Units',
        scrapPercentage: 0,
        effectiveDate: '2024-02-01',
        isPhantom: false,
        operationNumber: 10,
        unitCost: 350.00,
        totalCost: 350.00,
      },
      {
        id: 'comp-012',
        lineNumber: 30,
        itemId: 'item-012',
        itemCode: 'RM-GEARBOX-HOUSING',
        itemName: 'Gearbox Housing Cast',
        quantity: 1,
        uom: 'Units',
        scrapPercentage: 0,
        effectiveDate: '2024-02-01',
        isPhantom: false,
        operationNumber: 30,
        unitCost: 420.00,
        totalCost: 420.00,
      },
      {
        id: 'comp-013',
        lineNumber: 40,
        itemId: 'item-013',
        itemCode: 'RM-BEARING-SET',
        itemName: 'Taper Roller Bearing Set',
        quantity: 4,
        uom: 'Units',
        scrapPercentage: 0,
        effectiveDate: '2024-02-01',
        isPhantom: false,
        operationNumber: 30,
        unitCost: 45.00,
        totalCost: 180.00,
      },
    ],
    operations: [
      {
        id: 'op-006',
        operationNumber: 10,
        operationName: 'Gear Cutting',
        workCenterId: 'wc-007',
        workCenterName: 'Gear Cutting Station',
        setupTime: 120,
        runTime: 45,
        description: 'Cut gear teeth to specification',
        laborCost: 40.00,
        overheadCost: 25.00,
        sequence: 1,
      },
      {
        id: 'op-007',
        operationNumber: 20,
        operationName: 'Heat Treatment',
        workCenterId: 'wc-008',
        workCenterName: 'Heat Treatment Furnace',
        setupTime: 60,
        runTime: 120,
        description: 'Harden and temper gears',
        laborCost: 20.00,
        overheadCost: 50.00,
        sequence: 2,
      },
      {
        id: 'op-008',
        operationNumber: 30,
        operationName: 'Gearbox Assembly',
        workCenterId: 'wc-006',
        workCenterName: 'Gearbox Assembly',
        setupTime: 45,
        runTime: 60,
        description: 'Final assembly with housing and bearings',
        laborCost: 35.00,
        overheadCost: 18.00,
        sequence: 3,
      },
    ],
    totalMaterialCost: 1170.00,
    totalLaborCost: 95.00,
    totalOverheadCost: 93.00,
    totalCost: 1358.00,
    createdBy: 'engineer-001',
    createdAt: '2024-01-10T11:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    submittedBy: 'engineer-001',
    submittedAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'bom-004',
    bomCode: 'BOM-ROTOR-001',
    bomName: 'Rotor Shaft Assembly BOM',
    version: '1.2',
    productId: 'item-003',
    productCode: 'RM-ROTOR-SHAFT',
    productName: 'Rotor Shaft Assembly',
    bomType: 'Manufacturing',
    status: 'Active',
    effectiveDate: '2024-01-01',
    baseQuantity: 1,
    uom: 'Units',
    description: 'Sub-assembly BOM for rotor shaft (phantom BOM)',
    components: [
      {
        id: 'comp-014',
        lineNumber: 10,
        itemId: 'item-014',
        itemCode: 'RM-SHAFT-BLANK',
        itemName: 'Steel Shaft Blank 25mm',
        quantity: 1,
        uom: 'Units',
        scrapPercentage: 5,
        effectiveDate: '2024-01-01',
        isPhantom: false,
        unitCost: 15.00,
        totalCost: 15.00,
      },
      {
        id: 'comp-015',
        lineNumber: 20,
        itemId: 'item-015',
        itemCode: 'RM-ROTOR-CORE',
        itemName: 'Rotor Core Laminated',
        quantity: 1,
        uom: 'Units',
        scrapPercentage: 1,
        effectiveDate: '2024-01-01',
        isPhantom: false,
        unitCost: 18.00,
        totalCost: 18.00,
      },
    ],
    operations: [
      {
        id: 'op-009',
        operationNumber: 10,
        operationName: 'Shaft Turning',
        workCenterId: 'wc-005',
        workCenterName: 'CNC Machining Center',
        setupTime: 15,
        runTime: 8,
        description: 'Turn shaft to dimensions',
        laborCost: 12.00,
        overheadCost: 6.00,
        sequence: 1,
      },
    ],
    totalMaterialCost: 33.00,
    totalLaborCost: 12.00,
    totalOverheadCost: 6.00,
    totalCost: 51.00,
    createdBy: 'engineer-002',
    createdAt: '2023-10-05T14:00:00Z',
    updatedAt: '2024-01-02T10:00:00Z',
    submittedBy: 'engineer-002',
    submittedAt: '2023-10-10T09:00:00Z',
    approvedBy: 'prod-manager',
    approvedAt: '2023-10-12T16:00:00Z',
  },
  {
    id: 'bom-005',
    bomCode: 'BOM-BEARING-001',
    bomName: 'Precision Bearing Assembly BOM',
    version: '1.0',
    productId: 'prod-006',
    productCode: 'FG-BEARING-001',
    productName: 'Precision Bearing Assembly',
    bomType: 'Engineering',
    status: 'Draft',
    effectiveDate: '2024-03-01',
    baseQuantity: 1,
    uom: 'Units',
    description: 'Engineering BOM for precision bearing - pending cost finalization',
    components: [
      {
        id: 'comp-016',
        lineNumber: 10,
        itemId: 'item-016',
        itemCode: 'RM-INNER-RACE',
        itemName: 'Inner Race Blank 52100 Steel',
        quantity: 1,
        uom: 'Units',
        scrapPercentage: 3,
        effectiveDate: '2024-03-01',
        isPhantom: false,
        unitCost: 8.50,
        totalCost: 8.50,
      },
      {
        id: 'comp-017',
        lineNumber: 20,
        itemId: 'item-017',
        itemCode: 'RM-OUTER-RACE',
        itemName: 'Outer Race Blank 52100 Steel',
        quantity: 1,
        uom: 'Units',
        scrapPercentage: 3,
        effectiveDate: '2024-03-01',
        isPhantom: false,
        unitCost: 10.00,
        totalCost: 10.00,
      },
      {
        id: 'comp-018',
        lineNumber: 30,
        itemId: 'item-018',
        itemCode: 'RM-STEEL-BALLS',
        itemName: 'Precision Steel Balls Grade 10',
        quantity: 8,
        uom: 'Units',
        scrapPercentage: 0,
        effectiveDate: '2024-03-01',
        isPhantom: false,
        unitCost: 0.50,
        totalCost: 4.00,
      },
      {
        id: 'comp-019',
        lineNumber: 40,
        itemId: 'item-019',
        itemCode: 'RM-CAGE-BRASS',
        itemName: 'Brass Cage Retainer',
        quantity: 1,
        uom: 'Units',
        scrapPercentage: 0,
        effectiveDate: '2024-03-01',
        isPhantom: false,
        unitCost: 2.00,
        totalCost: 2.00,
      },
    ],
    operations: [
      {
        id: 'op-010',
        operationNumber: 10,
        operationName: 'Inner Race Grinding',
        workCenterId: 'wc-005',
        workCenterName: 'CNC Machining Center',
        setupTime: 30,
        runTime: 5,
        description: 'Precision grind inner race',
        laborCost: 18.00,
        overheadCost: 8.00,
        sequence: 1,
      },
      {
        id: 'op-011',
        operationNumber: 20,
        operationName: 'Outer Race Grinding',
        workCenterId: 'wc-005',
        workCenterName: 'CNC Machining Center',
        setupTime: 30,
        runTime: 6,
        description: 'Precision grind outer race',
        laborCost: 18.00,
        overheadCost: 8.00,
        sequence: 2,
      },
      {
        id: 'op-012',
        operationNumber: 30,
        operationName: 'Bearing Assembly',
        workCenterId: 'wc-001',
        workCenterName: 'Assembly Line A',
        setupTime: 10,
        runTime: 3,
        description: 'Assemble bearing components',
        laborCost: 8.00,
        overheadCost: 4.00,
        sequence: 3,
      },
    ],
    totalMaterialCost: 24.50,
    totalLaborCost: 44.00,
    totalOverheadCost: 20.00,
    totalCost: 88.50,
    createdBy: 'engineer-003',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },
];

// ============================================================================
// SERVICE CLASS
// ============================================================================

class BOMService {
  async getAllBOMs(filters?: BOMFilters): Promise<BOM[]> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      let filteredBOMs = [...MOCK_BOMS];

      if (filters) {
        if (filters.status) {
          filteredBOMs = filteredBOMs.filter((bom) => bom.status === filters.status);
        }
        if (filters.bomType) {
          filteredBOMs = filteredBOMs.filter((bom) => bom.bomType === filters.bomType);
        }
        if (filters.productId) {
          filteredBOMs = filteredBOMs.filter((bom) => bom.productId === filters.productId);
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredBOMs = filteredBOMs.filter(
            (bom) =>
              bom.bomCode.toLowerCase().includes(searchLower) ||
              bom.bomName.toLowerCase().includes(searchLower) ||
              bom.productCode.toLowerCase().includes(searchLower) ||
              bom.productName.toLowerCase().includes(searchLower)
          );
        }
      }

      return filteredBOMs;
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const response = await apiClient.get<BOM[]>(`/production/bom?${params.toString()}`);
    return response.data;
  }

  async getBOMById(id: string): Promise<BOM> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const bom = MOCK_BOMS.find((b) => b.id === id);
      if (!bom) {
        throw new Error('BOM not found');
      }
      return bom;
    }

    const response = await apiClient.get<BOM>(`/production/bom/${id}`);
    return response.data;
  }

  async createBOM(data: CreateBOMDto): Promise<BOM> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newBOM: BOM = {
        id: `bom-${Date.now()}`,
        bomCode: `BOM-NEW-${String(MOCK_BOMS.length + 1).padStart(3, '0')}`,
        bomName: `New BOM ${MOCK_BOMS.length + 1}`,
        version: '1.0',
        productId: data.productId,
        productCode: 'PROD-NEW',
        productName: 'New Product',
        bomType: data.bomType,
        status: 'Draft',
        effectiveDate: data.effectiveDate,
        expiryDate: data.expiryDate,
        baseQuantity: data.baseQuantity,
        uom: 'Units',
        description: data.description,
        components: data.components.map((c, idx) => ({
          ...c,
          id: `comp-${Date.now()}-${idx}`,
          totalCost: c.quantity * c.unitCost,
        })),
        operations: (data.operations || []).map((op, idx) => ({
          ...op,
          id: `op-${Date.now()}-${idx}`,
        })),
        totalMaterialCost: 0,
        totalLaborCost: 0,
        totalOverheadCost: 0,
        totalCost: 0,
        createdBy: 'current-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_BOMS.push(newBOM);
      return newBOM;
    }

    const response = await apiClient.post<BOM>('/production/bom', data);
    return response.data;
  }

  async updateBOM(id: string, data: UpdateBOMDto): Promise<BOM> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const index = MOCK_BOMS.findIndex((bom) => bom.id === id);
      if (index === -1) {
        throw new Error('BOM not found');
      }
      MOCK_BOMS[index] = {
        ...MOCK_BOMS[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return MOCK_BOMS[index];
    }

    const response = await apiClient.put<BOM>(`/production/bom/${id}`, data);
    return response.data;
  }

  async submitBOM(id: string): Promise<BOM> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const index = MOCK_BOMS.findIndex((bom) => bom.id === id);
      if (index === -1) {
        throw new Error('BOM not found');
      }
      if (MOCK_BOMS[index].status !== 'Draft') {
        throw new Error('Only draft BOMs can be submitted');
      }
      MOCK_BOMS[index] = {
        ...MOCK_BOMS[index],
        status: 'Submitted',
        submittedBy: 'current-user',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return MOCK_BOMS[index];
    }

    const response = await apiClient.post<BOM>(`/production/bom/${id}/submit`, {});
    return response.data;
  }

  async approveBOM(id: string, comments?: string): Promise<BOM> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const index = MOCK_BOMS.findIndex((bom) => bom.id === id);
      if (index === -1) {
        throw new Error('BOM not found');
      }
      if (MOCK_BOMS[index].status !== 'Submitted') {
        throw new Error('Only submitted BOMs can be approved');
      }
      MOCK_BOMS[index] = {
        ...MOCK_BOMS[index],
        status: 'Approved',
        approvedBy: 'current-user',
        approvedAt: new Date().toISOString(),
        approvalComments: comments,
        updatedAt: new Date().toISOString(),
      };
      return MOCK_BOMS[index];
    }

    const response = await apiClient.post<BOM>(`/production/bom/${id}/approve`, { comments });
    return response.data;
  }

  async explodeBOM(id: string): Promise<ExplodedBOMItem[]> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const bom = MOCK_BOMS.find((b) => b.id === id);
      if (!bom) {
        throw new Error('BOM not found');
      }

      const explodedItems: ExplodedBOMItem[] = [];

      // Add main product
      explodedItems.push({
        level: 0,
        itemId: bom.productId,
        itemCode: bom.productCode,
        itemName: bom.productName,
        quantity: bom.baseQuantity,
        extendedQuantity: bom.baseQuantity,
        uom: bom.uom,
        unitCost: bom.totalCost,
        extendedCost: bom.totalCost * bom.baseQuantity,
        isPhantom: false,
        leadTime: 0,
        bomId: bom.id,
      });

      // Add components
      bom.components.forEach((comp) => {
        const extendedQty = comp.quantity * bom.baseQuantity * (1 + comp.scrapPercentage / 100);
        explodedItems.push({
          level: 1,
          itemId: comp.itemId,
          itemCode: comp.itemCode,
          itemName: comp.itemName,
          parentItemCode: bom.productCode,
          quantity: comp.quantity,
          extendedQuantity: extendedQty,
          uom: comp.uom,
          unitCost: comp.unitCost,
          extendedCost: comp.totalCost * bom.baseQuantity,
          isPhantom: comp.isPhantom,
          leadTime: 5, // Default lead time
          bomId: comp.childBOMId,
        });

        // If phantom, explode child BOM
        if (comp.isPhantom && comp.childBOMId) {
          const childBOM = MOCK_BOMS.find((b) => b.id === comp.childBOMId);
          if (childBOM) {
            childBOM.components.forEach((childComp) => {
              const childExtendedQty = childComp.quantity * extendedQty * (1 + childComp.scrapPercentage / 100);
              explodedItems.push({
                level: 2,
                itemId: childComp.itemId,
                itemCode: childComp.itemCode,
                itemName: childComp.itemName,
                parentItemCode: comp.itemCode,
                quantity: childComp.quantity,
                extendedQuantity: childExtendedQty,
                uom: childComp.uom,
                unitCost: childComp.unitCost,
                extendedCost: childComp.totalCost * extendedQty,
                isPhantom: childComp.isPhantom,
                leadTime: 3,
              });
            });
          }
        }
      });

      return explodedItems;
    }

    const response = await apiClient.get<ExplodedBOMItem[]>(`/production/bom/${id}/explode`);
    return response.data;
  }

  async costRollup(id: string): Promise<CostRollupResult> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const bom = MOCK_BOMS.find((b) => b.id === id);
      if (!bom) {
        throw new Error('BOM not found');
      }

      const totalCost = bom.totalMaterialCost + bom.totalLaborCost + bom.totalOverheadCost;

      return {
        bomId: bom.id,
        bomCode: bom.bomCode,
        productCode: bom.productCode,
        productName: bom.productName,
        totalMaterialCost: bom.totalMaterialCost,
        totalLaborCost: bom.totalLaborCost,
        totalOverheadCost: bom.totalOverheadCost,
        totalCost: totalCost,
        costBreakdown: [
          {
            category: 'Materials',
            amount: bom.totalMaterialCost,
            percentage: (bom.totalMaterialCost / totalCost) * 100,
          },
          {
            category: 'Labor',
            amount: bom.totalLaborCost,
            percentage: (bom.totalLaborCost / totalCost) * 100,
          },
          {
            category: 'Overhead',
            amount: bom.totalOverheadCost,
            percentage: (bom.totalOverheadCost / totalCost) * 100,
          },
        ],
        componentCosts: bom.components.map((comp) => ({
          itemCode: comp.itemCode,
          itemName: comp.itemName,
          quantity: comp.quantity,
          unitCost: comp.unitCost,
          extendedCost: comp.totalCost,
        })),
        calculatedAt: new Date().toISOString(),
      };
    }

    const response = await apiClient.post<CostRollupResult>(`/production/bom/${id}/cost-rollup`, {});
    return response.data;
  }

  async getBOMStatistics(): Promise<{
    total: number;
    byStatus: Record<BOMStatus, number>;
    byType: Record<BOMType, number>;
    averageCost: number;
  }> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const byStatus: Record<string, number> = {};
      const byType: Record<string, number> = {};
      let totalCost = 0;

      MOCK_BOMS.forEach((bom) => {
        byStatus[bom.status] = (byStatus[bom.status] || 0) + 1;
        byType[bom.bomType] = (byType[bom.bomType] || 0) + 1;
        totalCost += bom.totalCost;
      });

      return {
        total: MOCK_BOMS.length,
        byStatus: byStatus as Record<BOMStatus, number>,
        byType: byType as Record<BOMType, number>,
        averageCost: totalCost / MOCK_BOMS.length,
      };
    }

    const response = await apiClient.get<any>('/production/bom/statistics');
    return response.data;
  }
}

export const bomService = new BOMService();
