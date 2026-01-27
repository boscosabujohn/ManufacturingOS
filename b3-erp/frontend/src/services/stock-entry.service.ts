import { apiClient } from './api/client';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export enum StockEntryType {
  RECEIPT = 'RECEIPT',
  ISSUE = 'ISSUE',
  ADJUSTMENT = 'ADJUSTMENT',
  OPENING_BALANCE = 'OPENING_BALANCE',
  RETURN = 'RETURN',
  SCRAP = 'SCRAP',
}

export enum StockEntryStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  PENDING_POST = 'PENDING_POST',
  POSTED = 'POSTED',
  CANCELLED = 'CANCELLED',
}

export interface StockEntryItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  uom: string;
  unitCost: number;
  totalCost: number;
  batchNumber?: string;
  serialNumbers?: string[];
  expiryDate?: string;
  sourceLocationId?: string;
  sourceLocationName?: string;
  targetLocationId?: string;
  targetLocationName?: string;
  remarks?: string;
}

export interface StockEntry {
  id: string;
  entryNumber: string;
  entryType: StockEntryType;
  status: StockEntryStatus;
  warehouseId: string;
  warehouseName: string;
  entryDate: string;
  postingDate?: string;
  referenceType?: string;
  referenceNumber?: string;
  referenceId?: string;
  supplierId?: string;
  supplierName?: string;
  customerId?: string;
  customerName?: string;
  items: StockEntryItem[];
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  remarks?: string;
  attachments?: string[];
  createdBy: string;
  createdByName: string;
  submittedBy?: string;
  submittedByName?: string;
  submittedAt?: string;
  postedBy?: string;
  postedByName?: string;
  postedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockLedgerEntry {
  id: string;
  entryDate: string;
  entryType: StockEntryType;
  entryNumber: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  warehouseId: string;
  warehouseName: string;
  locationId?: string;
  locationName?: string;
  inQuantity: number;
  outQuantity: number;
  balanceQuantity: number;
  unitCost: number;
  totalValue: number;
  runningBalance: number;
  referenceType?: string;
  referenceNumber?: string;
}

export interface CreateStockEntryDto {
  entryType: StockEntryType;
  warehouseId: string;
  entryDate: string;
  referenceType?: string;
  referenceNumber?: string;
  referenceId?: string;
  supplierId?: string;
  customerId?: string;
  items: {
    itemId: string;
    quantity: number;
    unitCost?: number;
    batchNumber?: string;
    serialNumbers?: string[];
    expiryDate?: string;
    sourceLocationId?: string;
    targetLocationId?: string;
    remarks?: string;
  }[];
  remarks?: string;
}

export interface StockEntryFilters {
  entryType?: StockEntryType;
  status?: StockEntryStatus;
  warehouseId?: string;
  itemId?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

export interface StockLedgerFilters {
  itemId?: string;
  warehouseId?: string;
  locationId?: string;
  fromDate?: string;
  toDate?: string;
  entryType?: StockEntryType;
}

// ============================================================================
// Mock Data
// ============================================================================

const USE_MOCK_DATA = true;

export const MOCK_STOCK_ENTRIES: StockEntry[] = [
  {
    id: 'se-1',
    entryNumber: 'SE-2024-00001',
    entryType: StockEntryType.RECEIPT,
    status: StockEntryStatus.POSTED,
    warehouseId: 'wh-2',
    warehouseName: 'Raw Materials Warehouse',
    entryDate: '2024-01-20T08:00:00Z',
    postingDate: '2024-01-20T10:30:00Z',
    referenceType: 'PURCHASE_ORDER',
    referenceNumber: 'PO-2024-00125',
    referenceId: 'po-125',
    supplierId: 'sup-1',
    supplierName: 'ABC Steel Supplies',
    items: [
      {
        id: 'sei-1',
        itemId: 'item-1',
        itemCode: 'STL-001',
        itemName: 'Steel Sheet 4x8 - 16 Gauge',
        quantity: 100,
        uom: 'Sheet',
        unitCost: 45.00,
        totalCost: 4500.00,
        batchNumber: 'BATCH-2024-001',
        targetLocationId: 'loc-1',
        targetLocationName: 'Zone A, Aisle 1, Rack 1',
      },
      {
        id: 'sei-2',
        itemId: 'item-2',
        itemCode: 'STL-002',
        itemName: 'Steel Sheet 4x8 - 14 Gauge',
        quantity: 50,
        uom: 'Sheet',
        unitCost: 55.00,
        totalCost: 2750.00,
        batchNumber: 'BATCH-2024-002',
        targetLocationId: 'loc-2',
        targetLocationName: 'Zone A, Aisle 1, Rack 2',
      },
    ],
    totalItems: 2,
    totalQuantity: 150,
    totalValue: 7250.00,
    remarks: 'Received against PO-2024-00125',
    createdBy: 'emp-201',
    createdByName: 'David Lee',
    submittedBy: 'emp-201',
    submittedByName: 'David Lee',
    submittedAt: '2024-01-20T09:00:00Z',
    postedBy: 'emp-102',
    postedByName: 'Sarah Johnson',
    postedAt: '2024-01-20T10:30:00Z',
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
  },
  {
    id: 'se-2',
    entryNumber: 'SE-2024-00002',
    entryType: StockEntryType.ISSUE,
    status: StockEntryStatus.POSTED,
    warehouseId: 'wh-2',
    warehouseName: 'Raw Materials Warehouse',
    entryDate: '2024-01-21T09:00:00Z',
    postingDate: '2024-01-21T11:00:00Z',
    referenceType: 'WORK_ORDER',
    referenceNumber: 'WO-2024-00045',
    referenceId: 'wo-45',
    items: [
      {
        id: 'sei-3',
        itemId: 'item-1',
        itemCode: 'STL-001',
        itemName: 'Steel Sheet 4x8 - 16 Gauge',
        quantity: 25,
        uom: 'Sheet',
        unitCost: 45.00,
        totalCost: 1125.00,
        batchNumber: 'BATCH-2024-001',
        sourceLocationId: 'loc-1',
        sourceLocationName: 'Zone A, Aisle 1, Rack 1',
      },
    ],
    totalItems: 1,
    totalQuantity: 25,
    totalValue: 1125.00,
    remarks: 'Issued for production WO-2024-00045',
    createdBy: 'emp-202',
    createdByName: 'Maria Garcia',
    submittedBy: 'emp-202',
    submittedByName: 'Maria Garcia',
    submittedAt: '2024-01-21T09:30:00Z',
    postedBy: 'emp-102',
    postedByName: 'Sarah Johnson',
    postedAt: '2024-01-21T11:00:00Z',
    createdAt: '2024-01-21T09:00:00Z',
    updatedAt: '2024-01-21T11:00:00Z',
  },
  {
    id: 'se-3',
    entryNumber: 'SE-2024-00003',
    entryType: StockEntryType.ADJUSTMENT,
    status: StockEntryStatus.PENDING_POST,
    warehouseId: 'wh-1',
    warehouseName: 'Main Distribution Center',
    entryDate: '2024-01-22T14:00:00Z',
    items: [
      {
        id: 'sei-4',
        itemId: 'item-5',
        itemCode: 'ELC-001',
        itemName: 'Electric Motor 5HP',
        quantity: -2,
        uom: 'Unit',
        unitCost: 350.00,
        totalCost: -700.00,
        sourceLocationId: 'loc-3',
        sourceLocationName: 'Zone B, Aisle 2, Rack 1',
        remarks: 'Damaged during handling',
      },
    ],
    totalItems: 1,
    totalQuantity: -2,
    totalValue: -700.00,
    remarks: 'Inventory adjustment - damaged goods',
    createdBy: 'emp-203',
    createdByName: 'James Wilson',
    submittedBy: 'emp-203',
    submittedByName: 'James Wilson',
    submittedAt: '2024-01-22T14:30:00Z',
    createdAt: '2024-01-22T14:00:00Z',
    updatedAt: '2024-01-22T14:30:00Z',
  },
  {
    id: 'se-4',
    entryNumber: 'SE-2024-00004',
    entryType: StockEntryType.RETURN,
    status: StockEntryStatus.SUBMITTED,
    warehouseId: 'wh-2',
    warehouseName: 'Raw Materials Warehouse',
    entryDate: '2024-01-22T16:00:00Z',
    referenceType: 'PURCHASE_ORDER',
    referenceNumber: 'PO-2024-00120',
    supplierId: 'sup-2',
    supplierName: 'Quality Metals Inc',
    items: [
      {
        id: 'sei-5',
        itemId: 'item-3',
        itemCode: 'ALU-001',
        itemName: 'Aluminum Bar 2" x 12ft',
        quantity: 10,
        uom: 'Piece',
        unitCost: 85.00,
        totalCost: 850.00,
        batchNumber: 'BATCH-2024-010',
        remarks: 'Defective material - returning to supplier',
      },
    ],
    totalItems: 1,
    totalQuantity: 10,
    totalValue: 850.00,
    remarks: 'Return to supplier - quality issue',
    createdBy: 'emp-201',
    createdByName: 'David Lee',
    submittedBy: 'emp-201',
    submittedByName: 'David Lee',
    submittedAt: '2024-01-22T16:30:00Z',
    createdAt: '2024-01-22T16:00:00Z',
    updatedAt: '2024-01-22T16:30:00Z',
  },
  {
    id: 'se-5',
    entryNumber: 'SE-2024-00005',
    entryType: StockEntryType.RECEIPT,
    status: StockEntryStatus.DRAFT,
    warehouseId: 'wh-4',
    warehouseName: 'Spare Parts Warehouse',
    entryDate: '2024-01-23T10:00:00Z',
    referenceType: 'PURCHASE_ORDER',
    referenceNumber: 'PO-2024-00130',
    supplierId: 'sup-3',
    supplierName: 'Industrial Spares Co',
    items: [
      {
        id: 'sei-6',
        itemId: 'item-10',
        itemCode: 'SPR-001',
        itemName: 'Bearing SKF 6205',
        quantity: 50,
        uom: 'Piece',
        unitCost: 15.00,
        totalCost: 750.00,
      },
      {
        id: 'sei-7',
        itemId: 'item-11',
        itemCode: 'SPR-002',
        itemName: 'V-Belt A68',
        quantity: 25,
        uom: 'Piece',
        unitCost: 8.50,
        totalCost: 212.50,
      },
    ],
    totalItems: 2,
    totalQuantity: 75,
    totalValue: 962.50,
    remarks: 'Spare parts replenishment',
    createdBy: 'emp-204',
    createdByName: 'Anna Thompson',
    createdAt: '2024-01-23T10:00:00Z',
    updatedAt: '2024-01-23T10:00:00Z',
  },
  {
    id: 'se-6',
    entryNumber: 'SE-2024-00006',
    entryType: StockEntryType.SCRAP,
    status: StockEntryStatus.PENDING_POST,
    warehouseId: 'wh-3',
    warehouseName: 'Work-in-Progress Storage',
    entryDate: '2024-01-23T11:00:00Z',
    items: [
      {
        id: 'sei-8',
        itemId: 'item-20',
        itemCode: 'WIP-001',
        itemName: 'Semi-finished Assembly A',
        quantity: 5,
        uom: 'Unit',
        unitCost: 120.00,
        totalCost: 600.00,
        sourceLocationId: 'loc-5',
        sourceLocationName: 'WIP Zone 1',
        remarks: 'Failed QC inspection',
      },
    ],
    totalItems: 1,
    totalQuantity: 5,
    totalValue: 600.00,
    remarks: 'Scrap - QC rejection',
    createdBy: 'emp-103',
    createdByName: 'Mike Brown',
    submittedBy: 'emp-103',
    submittedByName: 'Mike Brown',
    submittedAt: '2024-01-23T11:30:00Z',
    createdAt: '2024-01-23T11:00:00Z',
    updatedAt: '2024-01-23T11:30:00Z',
  },
];

const MOCK_STOCK_LEDGER: StockLedgerEntry[] = [
  {
    id: 'sl-1',
    entryDate: '2024-01-20T10:30:00Z',
    entryType: StockEntryType.RECEIPT,
    entryNumber: 'SE-2024-00001',
    itemId: 'item-1',
    itemCode: 'STL-001',
    itemName: 'Steel Sheet 4x8 - 16 Gauge',
    warehouseId: 'wh-2',
    warehouseName: 'Raw Materials Warehouse',
    locationId: 'loc-1',
    locationName: 'Zone A, Aisle 1, Rack 1',
    inQuantity: 100,
    outQuantity: 0,
    balanceQuantity: 100,
    unitCost: 45.00,
    totalValue: 4500.00,
    runningBalance: 4500.00,
    referenceType: 'PURCHASE_ORDER',
    referenceNumber: 'PO-2024-00125',
  },
  {
    id: 'sl-2',
    entryDate: '2024-01-21T11:00:00Z',
    entryType: StockEntryType.ISSUE,
    entryNumber: 'SE-2024-00002',
    itemId: 'item-1',
    itemCode: 'STL-001',
    itemName: 'Steel Sheet 4x8 - 16 Gauge',
    warehouseId: 'wh-2',
    warehouseName: 'Raw Materials Warehouse',
    locationId: 'loc-1',
    locationName: 'Zone A, Aisle 1, Rack 1',
    inQuantity: 0,
    outQuantity: 25,
    balanceQuantity: 75,
    unitCost: 45.00,
    totalValue: -1125.00,
    runningBalance: 3375.00,
    referenceType: 'WORK_ORDER',
    referenceNumber: 'WO-2024-00045',
  },
];

// ============================================================================
// Stock Entry Service
// ============================================================================

class StockEntryService {
  private simulateDelay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get all stock entries with optional filters
   */
  async getAllStockEntries(filters?: StockEntryFilters): Promise<StockEntry[]> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      let result = [...MOCK_STOCK_ENTRIES];

      if (filters?.entryType) {
        result = result.filter((e) => e.entryType === filters.entryType);
      }
      if (filters?.status) {
        result = result.filter((e) => e.status === filters.status);
      }
      if (filters?.warehouseId) {
        result = result.filter((e) => e.warehouseId === filters.warehouseId);
      }
      if (filters?.itemId) {
        result = result.filter((e) => e.items.some((i) => i.itemId === filters.itemId));
      }
      if (filters?.fromDate) {
        result = result.filter((e) => new Date(e.entryDate) >= new Date(filters.fromDate!));
      }
      if (filters?.toDate) {
        result = result.filter((e) => new Date(e.entryDate) <= new Date(filters.toDate!));
      }
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(
          (e) =>
            e.entryNumber.toLowerCase().includes(searchLower) ||
            e.referenceNumber?.toLowerCase().includes(searchLower) ||
            e.supplierName?.toLowerCase().includes(searchLower) ||
            e.items.some((i) => i.itemName.toLowerCase().includes(searchLower))
        );
      }

      return result;
    }

    const params = new URLSearchParams();
    if (filters?.entryType) params.append('entryType', filters.entryType);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.warehouseId) params.append('warehouseId', filters.warehouseId);
    if (filters?.itemId) params.append('itemId', filters.itemId);
    if (filters?.fromDate) params.append('fromDate', filters.fromDate);
    if (filters?.toDate) params.append('toDate', filters.toDate);
    if (filters?.search) params.append('search', filters.search);

    const response = await apiClient.get<StockEntry[]>(`/inventory/stock-entries?${params.toString()}`);
    return response.data || [];
  }

  /**
   * Get stock entry by ID
   */
  async getStockEntryById(id: string): Promise<StockEntry> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay(200);
      const entry = MOCK_STOCK_ENTRIES.find((e) => e.id === id);
      if (!entry) {
        throw new Error('Stock entry not found');
      }
      return { ...entry };
    }

    const response = await apiClient.get<StockEntry>(`/inventory/stock-entries/${id}`);
    return response.data;
  }

  /**
   * Get entries pending posting
   */
  async getPendingEntries(): Promise<StockEntry[]> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      return MOCK_STOCK_ENTRIES.filter((e) => e.status === StockEntryStatus.PENDING_POST);
    }

    const response = await apiClient.get<StockEntry[]>('/inventory/stock-entries/pending-post');
    return response.data || [];
  }

  /**
   * Get stock ledger with filters
   */
  async getStockLedger(filters: StockLedgerFilters): Promise<StockLedgerEntry[]> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      let result = [...MOCK_STOCK_LEDGER];

      if (filters.itemId) {
        result = result.filter((e) => e.itemId === filters.itemId);
      }
      if (filters.warehouseId) {
        result = result.filter((e) => e.warehouseId === filters.warehouseId);
      }
      if (filters.locationId) {
        result = result.filter((e) => e.locationId === filters.locationId);
      }
      if (filters.fromDate) {
        result = result.filter((e) => new Date(e.entryDate) >= new Date(filters.fromDate!));
      }
      if (filters.toDate) {
        result = result.filter((e) => new Date(e.entryDate) <= new Date(filters.toDate!));
      }
      if (filters.entryType) {
        result = result.filter((e) => e.entryType === filters.entryType);
      }

      return result;
    }

    const params = new URLSearchParams();
    if (filters.itemId) params.append('itemId', filters.itemId);
    if (filters.warehouseId) params.append('warehouseId', filters.warehouseId);
    if (filters.locationId) params.append('locationId', filters.locationId);
    if (filters.fromDate) params.append('fromDate', filters.fromDate);
    if (filters.toDate) params.append('toDate', filters.toDate);
    if (filters.entryType) params.append('entryType', filters.entryType);

    const response = await apiClient.get<StockLedgerEntry[]>(`/inventory/stock-entries/stock-ledger?${params.toString()}`);
    return response.data || [];
  }

  /**
   * Create a new stock entry
   */
  async createStockEntry(data: CreateStockEntryDto): Promise<StockEntry> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay(500);

      const items: StockEntryItem[] = data.items.map((item, index) => ({
        id: `sei-${Date.now()}-${index}`,
        itemId: item.itemId,
        itemCode: `ITEM-${item.itemId}`,
        itemName: `Item ${item.itemId}`,
        quantity: item.quantity,
        uom: 'Unit',
        unitCost: item.unitCost || 0,
        totalCost: item.quantity * (item.unitCost || 0),
        batchNumber: item.batchNumber,
        serialNumbers: item.serialNumbers,
        expiryDate: item.expiryDate,
        sourceLocationId: item.sourceLocationId,
        targetLocationId: item.targetLocationId,
        remarks: item.remarks,
      }));

      const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
      const totalValue = items.reduce((sum, i) => sum + i.totalCost, 0);

      const newEntry: StockEntry = {
        id: `se-${Date.now()}`,
        entryNumber: `SE-2024-${String(MOCK_STOCK_ENTRIES.length + 1).padStart(5, '0')}`,
        entryType: data.entryType,
        status: StockEntryStatus.DRAFT,
        warehouseId: data.warehouseId,
        warehouseName: `Warehouse ${data.warehouseId}`,
        entryDate: data.entryDate,
        referenceType: data.referenceType,
        referenceNumber: data.referenceNumber,
        referenceId: data.referenceId,
        supplierId: data.supplierId,
        customerId: data.customerId,
        items,
        totalItems: items.length,
        totalQuantity,
        totalValue,
        remarks: data.remarks,
        createdBy: 'current-user',
        createdByName: 'Current User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      MOCK_STOCK_ENTRIES.push(newEntry);
      return newEntry;
    }

    const response = await apiClient.post<StockEntry>('/inventory/stock-entries', data);
    return response.data;
  }

  /**
   * Submit stock entry for approval
   */
  async submitStockEntry(id: string): Promise<StockEntry> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay(300);
      const index = MOCK_STOCK_ENTRIES.findIndex((e) => e.id === id);
      if (index === -1) {
        throw new Error('Stock entry not found');
      }

      if (MOCK_STOCK_ENTRIES[index].status !== StockEntryStatus.DRAFT) {
        throw new Error('Only draft entries can be submitted');
      }

      MOCK_STOCK_ENTRIES[index] = {
        ...MOCK_STOCK_ENTRIES[index],
        status: StockEntryStatus.SUBMITTED,
        submittedBy: 'current-user',
        submittedByName: 'Current User',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return MOCK_STOCK_ENTRIES[index];
    }

    const response = await apiClient.post<StockEntry>(`/inventory/stock-entries/${id}/submit`, {});
    return response.data;
  }

  /**
   * Post stock entry to update inventory
   */
  async postStockEntry(id: string): Promise<StockEntry> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay(500);
      const index = MOCK_STOCK_ENTRIES.findIndex((e) => e.id === id);
      if (index === -1) {
        throw new Error('Stock entry not found');
      }

      const currentStatus = MOCK_STOCK_ENTRIES[index].status;
      if (currentStatus !== StockEntryStatus.SUBMITTED && currentStatus !== StockEntryStatus.PENDING_POST) {
        throw new Error('Only submitted or pending entries can be posted');
      }

      MOCK_STOCK_ENTRIES[index] = {
        ...MOCK_STOCK_ENTRIES[index],
        status: StockEntryStatus.POSTED,
        postingDate: new Date().toISOString(),
        postedBy: 'current-user',
        postedByName: 'Current User',
        postedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return MOCK_STOCK_ENTRIES[index];
    }

    const response = await apiClient.post<StockEntry>(`/inventory/stock-entries/${id}/post`, {});
    return response.data;
  }
}

export const stockEntryService = new StockEntryService();
