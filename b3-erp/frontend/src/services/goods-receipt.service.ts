import { apiClient } from './api/client';

// ==================== TypeScript Interfaces ====================

export type GRStatus = 'Pending' | 'Quality Check' | 'Passed' | 'Partially Passed' | 'Failed' | 'Posted to Inventory' | 'Returned';
export type QualityCheckResult = 'Passed' | 'Failed' | 'Conditional Pass';

export interface GoodsReceiptItem {
  id: string;
  poItemId: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  description?: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  batchNumber?: string;
  serialNumbers?: string[];
  expiryDate?: string;
  warehouseId: string;
  warehouseName: string;
  locationId?: string;
  locationName?: string;
  qualityCheckStatus?: QualityCheckResult;
  qualityCheckDate?: string;
  qualityCheckBy?: string;
  qualityCheckNotes?: string;
}

export interface GoodsReceipt {
  id: string;
  grNumber: string;
  poId: string;
  poNumber: string;
  vendorId: string;
  vendorCode: string;
  vendorName: string;
  receiptDate: string;
  deliveryNoteNumber?: string;
  deliveryDate: string;
  status: GRStatus;
  warehouseId: string;
  warehouseName: string;
  items: GoodsReceiptItem[];
  totalItems: number;
  totalQuantityOrdered: number;
  totalQuantityReceived: number;
  totalQuantityAccepted: number;
  totalQuantityRejected: number;
  totalAmount: number;
  notes?: string;
  receivedBy: string;
  receivedByName: string;
  qualityInspector?: string;
  qualityInspectorName?: string;
  postedToInventoryAt?: string;
  postedBy?: string;
  postedByName?: string;
  attachments?: {
    id: string;
    fileName: string;
    fileType: string;
    fileUrl: string;
    uploadedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoodsReceiptDto {
  poId: string;
  deliveryNoteNumber?: string;
  deliveryDate: string;
  warehouseId: string;
  notes?: string;
  items: {
    poItemId: string;
    receivedQuantity: number;
    batchNumber?: string;
    serialNumbers?: string[];
    expiryDate?: string;
    locationId?: string;
  }[];
}

export interface UpdateGoodsReceiptDto {
  deliveryNoteNumber?: string;
  notes?: string;
  items?: {
    id: string;
    receivedQuantity?: number;
    batchNumber?: string;
    serialNumbers?: string[];
    expiryDate?: string;
    locationId?: string;
  }[];
}

export interface QualityCheckDto {
  items: {
    itemId: string;
    result: QualityCheckResult;
    acceptedQuantity: number;
    rejectedQuantity: number;
    notes?: string;
  }[];
  overallNotes?: string;
}

export interface GoodsReceiptFilters {
  status?: GRStatus;
  vendorId?: string;
  warehouseId?: string;
  poNumber?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ==================== Mock Data ====================

const USE_MOCK_DATA = true;

const MOCK_GOODS_RECEIPTS: GoodsReceipt[] = [
  {
    id: 'gr-001',
    grNumber: 'GR-2026-001',
    poId: 'po-005',
    poNumber: 'PO-2026-005',
    vendorId: 'vendor-005',
    vendorCode: 'V-005',
    vendorName: 'FastenerWorld LLC',
    receiptDate: '2026-01-20',
    deliveryNoteNumber: 'DN-FW-2026-0125',
    deliveryDate: '2026-01-20',
    status: 'Posted to Inventory',
    warehouseId: 'wh-002',
    warehouseName: 'Parts Warehouse',
    items: [
      {
        id: 'gri-001-1',
        poItemId: 'poi-005-1',
        itemId: 'item-009',
        itemCode: 'FAST-001',
        itemName: 'Hex Bolts M10',
        orderedQuantity: 5000,
        receivedQuantity: 5000,
        acceptedQuantity: 5000,
        rejectedQuantity: 0,
        unit: 'PCS',
        unitPrice: 1.5,
        totalAmount: 7500,
        batchNumber: 'FW-HB-20260120',
        warehouseId: 'wh-002',
        warehouseName: 'Parts Warehouse',
        locationId: 'loc-A1-01',
        locationName: 'Rack A1, Shelf 01',
        qualityCheckStatus: 'Passed',
        qualityCheckDate: '2026-01-20T14:30:00Z',
        qualityCheckBy: 'Quality Inspector 1',
        qualityCheckNotes: 'All bolts meet specifications'
      },
      {
        id: 'gri-001-2',
        poItemId: 'poi-005-2',
        itemId: 'item-010',
        itemCode: 'FAST-002',
        itemName: 'Hex Nuts M10',
        orderedQuantity: 5000,
        receivedQuantity: 5000,
        acceptedQuantity: 5000,
        rejectedQuantity: 0,
        unit: 'PCS',
        unitPrice: 0.8,
        totalAmount: 4000,
        batchNumber: 'FW-HN-20260120',
        warehouseId: 'wh-002',
        warehouseName: 'Parts Warehouse',
        locationId: 'loc-A1-02',
        locationName: 'Rack A1, Shelf 02',
        qualityCheckStatus: 'Passed',
        qualityCheckDate: '2026-01-20T14:30:00Z',
        qualityCheckBy: 'Quality Inspector 1'
      },
      {
        id: 'gri-001-3',
        poItemId: 'poi-005-3',
        itemId: 'item-011',
        itemCode: 'FAST-003',
        itemName: 'Washers M10',
        orderedQuantity: 10000,
        receivedQuantity: 10000,
        acceptedQuantity: 10000,
        rejectedQuantity: 0,
        unit: 'PCS',
        unitPrice: 0.35,
        totalAmount: 3500,
        batchNumber: 'FW-WS-20260120',
        warehouseId: 'wh-002',
        warehouseName: 'Parts Warehouse',
        locationId: 'loc-A1-03',
        locationName: 'Rack A1, Shelf 03',
        qualityCheckStatus: 'Passed',
        qualityCheckDate: '2026-01-20T14:30:00Z',
        qualityCheckBy: 'Quality Inspector 1'
      }
    ],
    totalItems: 3,
    totalQuantityOrdered: 20000,
    totalQuantityReceived: 20000,
    totalQuantityAccepted: 20000,
    totalQuantityRejected: 0,
    totalAmount: 15000,
    notes: 'Complete delivery received in good condition',
    receivedBy: 'user-010',
    receivedByName: 'David Miller',
    qualityInspector: 'user-011',
    qualityInspectorName: 'Quality Inspector 1',
    postedToInventoryAt: '2026-01-20T16:00:00Z',
    postedBy: 'user-010',
    postedByName: 'David Miller',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-20T16:00:00Z'
  },
  {
    id: 'gr-002',
    grNumber: 'GR-2026-002',
    poId: 'po-003',
    poNumber: 'PO-2026-003',
    vendorId: 'vendor-003',
    vendorCode: 'V-003',
    vendorName: 'Chemical Solutions Corp.',
    receiptDate: '2026-01-22',
    deliveryNoteNumber: 'DN-CS-2026-0089',
    deliveryDate: '2026-01-22',
    status: 'Partially Passed',
    warehouseId: 'wh-003',
    warehouseName: 'Chemical Storage',
    items: [
      {
        id: 'gri-002-1',
        poItemId: 'poi-003-1',
        itemId: 'item-005',
        itemCode: 'CHEM-001',
        itemName: 'Industrial Lubricant',
        orderedQuantity: 200,
        receivedQuantity: 150,
        acceptedQuantity: 145,
        rejectedQuantity: 5,
        unit: 'LTR',
        unitPrice: 125,
        totalAmount: 18125,
        batchNumber: 'CS-LUB-20260122',
        expiryDate: '2027-06-30',
        warehouseId: 'wh-003',
        warehouseName: 'Chemical Storage',
        locationId: 'loc-C1-01',
        locationName: 'Chemical Bay C1',
        qualityCheckStatus: 'Conditional Pass',
        qualityCheckDate: '2026-01-22T15:00:00Z',
        qualityCheckBy: 'Quality Inspector 2',
        qualityCheckNotes: '5 containers damaged during transport, rejected'
      },
      {
        id: 'gri-002-2',
        poItemId: 'poi-003-2',
        itemId: 'item-006',
        itemCode: 'CHEM-002',
        itemName: 'Coolant Fluid',
        orderedQuantity: 100,
        receivedQuantity: 100,
        acceptedQuantity: 100,
        rejectedQuantity: 0,
        unit: 'LTR',
        unitPrice: 200,
        totalAmount: 20000,
        batchNumber: 'CS-COL-20260122',
        expiryDate: '2027-12-31',
        warehouseId: 'wh-003',
        warehouseName: 'Chemical Storage',
        locationId: 'loc-C1-02',
        locationName: 'Chemical Bay C1',
        qualityCheckStatus: 'Passed',
        qualityCheckDate: '2026-01-22T15:00:00Z',
        qualityCheckBy: 'Quality Inspector 2'
      }
    ],
    totalItems: 2,
    totalQuantityOrdered: 300,
    totalQuantityReceived: 250,
    totalQuantityAccepted: 245,
    totalQuantityRejected: 5,
    totalAmount: 38125,
    notes: 'Partial delivery - remaining 50L lubricant expected next week. 5 containers rejected due to damage.',
    receivedBy: 'user-012',
    receivedByName: 'Jennifer Lopez',
    qualityInspector: 'user-013',
    qualityInspectorName: 'Quality Inspector 2',
    createdAt: '2026-01-22T11:00:00Z',
    updatedAt: '2026-01-22T15:30:00Z'
  },
  {
    id: 'gr-003',
    grNumber: 'GR-2026-003',
    poId: 'po-007',
    poNumber: 'PO-2026-007',
    vendorId: 'vendor-007',
    vendorCode: 'V-007',
    vendorName: 'ToolMaster Co.',
    receiptDate: '2026-01-30',
    deliveryNoteNumber: 'DN-TM-2026-0456',
    deliveryDate: '2026-01-30',
    status: 'Posted to Inventory',
    warehouseId: 'wh-006',
    warehouseName: 'Tool Crib',
    items: [
      {
        id: 'gri-003-1',
        poItemId: 'poi-007-1',
        itemId: 'item-014',
        itemCode: 'TOOL-001',
        itemName: 'CNC End Mills Set',
        orderedQuantity: 25,
        receivedQuantity: 25,
        acceptedQuantity: 25,
        rejectedQuantity: 0,
        unit: 'SET',
        unitPrice: 1500,
        totalAmount: 37500,
        batchNumber: 'TM-EM-20260130',
        warehouseId: 'wh-006',
        warehouseName: 'Tool Crib',
        locationId: 'loc-T1-01',
        locationName: 'Tool Cabinet T1',
        qualityCheckStatus: 'Passed',
        qualityCheckDate: '2026-01-30T14:00:00Z',
        qualityCheckBy: 'Quality Inspector 1',
        qualityCheckNotes: 'All sets verified against specifications'
      },
      {
        id: 'gri-003-2',
        poItemId: 'poi-007-2',
        itemId: 'item-015',
        itemCode: 'TOOL-002',
        itemName: 'Drill Bits Industrial',
        orderedQuantity: 50,
        receivedQuantity: 50,
        acceptedQuantity: 50,
        rejectedQuantity: 0,
        unit: 'SET',
        unitPrice: 600,
        totalAmount: 30000,
        batchNumber: 'TM-DB-20260130',
        warehouseId: 'wh-006',
        warehouseName: 'Tool Crib',
        locationId: 'loc-T1-02',
        locationName: 'Tool Cabinet T1',
        qualityCheckStatus: 'Passed',
        qualityCheckDate: '2026-01-30T14:00:00Z',
        qualityCheckBy: 'Quality Inspector 1'
      }
    ],
    totalItems: 2,
    totalQuantityOrdered: 75,
    totalQuantityReceived: 75,
    totalQuantityAccepted: 75,
    totalQuantityRejected: 0,
    totalAmount: 67500,
    notes: 'Complete delivery in excellent condition',
    receivedBy: 'user-010',
    receivedByName: 'David Miller',
    qualityInspector: 'user-011',
    qualityInspectorName: 'Quality Inspector 1',
    postedToInventoryAt: '2026-01-30T17:00:00Z',
    postedBy: 'user-010',
    postedByName: 'David Miller',
    createdAt: '2026-01-30T10:00:00Z',
    updatedAt: '2026-01-30T17:00:00Z'
  },
  {
    id: 'gr-004',
    grNumber: 'GR-2026-004',
    poId: 'po-002',
    poNumber: 'PO-2026-002',
    vendorId: 'vendor-002',
    vendorCode: 'V-002',
    vendorName: 'Precision Parts Ltd.',
    receiptDate: '2026-01-25',
    deliveryNoteNumber: 'DN-PP-2026-0234',
    deliveryDate: '2026-01-25',
    status: 'Quality Check',
    warehouseId: 'wh-002',
    warehouseName: 'Parts Warehouse',
    items: [
      {
        id: 'gri-004-1',
        poItemId: 'poi-002-1',
        itemId: 'item-003',
        itemCode: 'BEAR-001',
        itemName: 'Industrial Bearings',
        orderedQuantity: 1000,
        receivedQuantity: 1000,
        acceptedQuantity: 0,
        rejectedQuantity: 0,
        unit: 'PCS',
        unitPrice: 45,
        totalAmount: 45000,
        batchNumber: 'PP-BRG-20260125',
        warehouseId: 'wh-002',
        warehouseName: 'Parts Warehouse',
        locationId: 'loc-B2-01',
        locationName: 'Rack B2, Shelf 01'
      },
      {
        id: 'gri-004-2',
        poItemId: 'poi-002-2',
        itemId: 'item-004',
        itemCode: 'GEAR-001',
        itemName: 'Precision Gears',
        orderedQuantity: 500,
        receivedQuantity: 500,
        acceptedQuantity: 0,
        rejectedQuantity: 0,
        unit: 'PCS',
        unitPrice: 62,
        totalAmount: 31000,
        batchNumber: 'PP-GR-20260125',
        warehouseId: 'wh-002',
        warehouseName: 'Parts Warehouse',
        locationId: 'loc-B2-02',
        locationName: 'Rack B2, Shelf 02'
      }
    ],
    totalItems: 2,
    totalQuantityOrdered: 1500,
    totalQuantityReceived: 1500,
    totalQuantityAccepted: 0,
    totalQuantityRejected: 0,
    totalAmount: 76000,
    notes: 'Awaiting quality inspection',
    receivedBy: 'user-012',
    receivedByName: 'Jennifer Lopez',
    createdAt: '2026-01-25T09:00:00Z',
    updatedAt: '2026-01-25T09:30:00Z'
  },
  {
    id: 'gr-005',
    grNumber: 'GR-2026-005',
    poId: 'po-009',
    poNumber: 'PO-2026-009',
    vendorId: 'vendor-008',
    vendorCode: 'V-008',
    vendorName: 'SafetyFirst Equipment',
    receiptDate: '2026-01-26',
    deliveryNoteNumber: 'DN-SF-2026-0178',
    deliveryDate: '2026-01-26',
    status: 'Pending',
    warehouseId: 'wh-007',
    warehouseName: 'Safety Stock',
    items: [
      {
        id: 'gri-005-1',
        poItemId: 'poi-009-1',
        itemId: 'item-018',
        itemCode: 'SAFE-001',
        itemName: 'Safety Helmets',
        orderedQuantity: 200,
        receivedQuantity: 200,
        acceptedQuantity: 0,
        rejectedQuantity: 0,
        unit: 'PCS',
        unitPrice: 35,
        totalAmount: 7000,
        warehouseId: 'wh-007',
        warehouseName: 'Safety Stock'
      },
      {
        id: 'gri-005-2',
        poItemId: 'poi-009-2',
        itemId: 'item-019',
        itemCode: 'SAFE-002',
        itemName: 'Safety Goggles',
        orderedQuantity: 300,
        receivedQuantity: 300,
        acceptedQuantity: 0,
        rejectedQuantity: 0,
        unit: 'PCS',
        unitPrice: 25,
        totalAmount: 7500,
        warehouseId: 'wh-007',
        warehouseName: 'Safety Stock'
      },
      {
        id: 'gri-005-3',
        poItemId: 'poi-009-3',
        itemId: 'item-020',
        itemCode: 'SAFE-003',
        itemName: 'Work Gloves',
        orderedQuantity: 500,
        receivedQuantity: 500,
        acceptedQuantity: 0,
        rejectedQuantity: 0,
        unit: 'PAIR',
        unitPrice: 18,
        totalAmount: 9000,
        warehouseId: 'wh-007',
        warehouseName: 'Safety Stock'
      }
    ],
    totalItems: 3,
    totalQuantityOrdered: 1000,
    totalQuantityReceived: 1000,
    totalQuantityAccepted: 0,
    totalQuantityRejected: 0,
    totalAmount: 23500,
    notes: 'Just received, pending inspection',
    receivedBy: 'user-010',
    receivedByName: 'David Miller',
    createdAt: '2026-01-26T08:30:00Z',
    updatedAt: '2026-01-26T08:30:00Z'
  },
  {
    id: 'gr-006',
    grNumber: 'GR-2026-006',
    poId: 'po-001',
    poNumber: 'PO-2026-001',
    vendorId: 'vendor-001',
    vendorCode: 'V-001',
    vendorName: 'Steel Dynamics Inc.',
    receiptDate: '2026-01-24',
    deliveryNoteNumber: 'DN-SD-2026-0567',
    deliveryDate: '2026-01-24',
    status: 'Failed',
    warehouseId: 'wh-001',
    warehouseName: 'Main Warehouse',
    items: [
      {
        id: 'gri-006-1',
        poItemId: 'poi-001-1',
        itemId: 'item-001',
        itemCode: 'STL-001',
        itemName: 'Steel Plates 10mm',
        orderedQuantity: 500,
        receivedQuantity: 100,
        acceptedQuantity: 0,
        rejectedQuantity: 100,
        unit: 'KG',
        unitPrice: 150,
        totalAmount: 15000,
        batchNumber: 'SD-SP-20260124-1',
        warehouseId: 'wh-001',
        warehouseName: 'Main Warehouse',
        qualityCheckStatus: 'Failed',
        qualityCheckDate: '2026-01-24T16:00:00Z',
        qualityCheckBy: 'Quality Inspector 2',
        qualityCheckNotes: 'Material thickness out of specification (9.2mm instead of 10mm). Entire batch rejected.'
      }
    ],
    totalItems: 1,
    totalQuantityOrdered: 500,
    totalQuantityReceived: 100,
    totalQuantityAccepted: 0,
    totalQuantityRejected: 100,
    totalAmount: 15000,
    notes: 'Partial shipment failed quality inspection - material returned to vendor',
    receivedBy: 'user-012',
    receivedByName: 'Jennifer Lopez',
    qualityInspector: 'user-013',
    qualityInspectorName: 'Quality Inspector 2',
    createdAt: '2026-01-24T10:00:00Z',
    updatedAt: '2026-01-24T17:00:00Z'
  },
  {
    id: 'gr-007',
    grNumber: 'GR-2026-007',
    poId: 'po-006',
    poNumber: 'PO-2026-006',
    vendorId: 'vendor-006',
    vendorCode: 'V-006',
    vendorName: 'PackPro Materials',
    receiptDate: '2026-01-26',
    deliveryDate: '2026-01-26',
    status: 'Passed',
    warehouseId: 'wh-005',
    warehouseName: 'Packaging Warehouse',
    items: [
      {
        id: 'gri-007-1',
        poItemId: 'poi-006-1',
        itemId: 'item-012',
        itemCode: 'PACK-001',
        itemName: 'Corrugated Boxes Large',
        orderedQuantity: 2000,
        receivedQuantity: 2000,
        acceptedQuantity: 2000,
        rejectedQuantity: 0,
        unit: 'PCS',
        unitPrice: 8,
        totalAmount: 16000,
        batchNumber: 'PP-BOX-20260126',
        warehouseId: 'wh-005',
        warehouseName: 'Packaging Warehouse',
        locationId: 'loc-P1-01',
        locationName: 'Packaging Area P1',
        qualityCheckStatus: 'Passed',
        qualityCheckDate: '2026-01-26T14:00:00Z',
        qualityCheckBy: 'Quality Inspector 1'
      },
      {
        id: 'gri-007-2',
        poItemId: 'poi-006-2',
        itemId: 'item-013',
        itemCode: 'PACK-002',
        itemName: 'Pallet Wrap',
        orderedQuantity: 100,
        receivedQuantity: 100,
        acceptedQuantity: 100,
        rejectedQuantity: 0,
        unit: 'ROLL',
        unitPrice: 160,
        totalAmount: 16000,
        batchNumber: 'PP-WRAP-20260126',
        warehouseId: 'wh-005',
        warehouseName: 'Packaging Warehouse',
        locationId: 'loc-P1-02',
        locationName: 'Packaging Area P1',
        qualityCheckStatus: 'Passed',
        qualityCheckDate: '2026-01-26T14:00:00Z',
        qualityCheckBy: 'Quality Inspector 1'
      }
    ],
    totalItems: 2,
    totalQuantityOrdered: 2100,
    totalQuantityReceived: 2100,
    totalQuantityAccepted: 2100,
    totalQuantityRejected: 0,
    totalAmount: 32000,
    notes: 'Full delivery received and passed QC',
    receivedBy: 'user-010',
    receivedByName: 'David Miller',
    qualityInspector: 'user-011',
    qualityInspectorName: 'Quality Inspector 1',
    createdAt: '2026-01-26T11:00:00Z',
    updatedAt: '2026-01-26T14:30:00Z'
  },
  {
    id: 'gr-008',
    grNumber: 'GR-2026-008',
    poId: 'po-004',
    poNumber: 'PO-2026-004',
    vendorId: 'vendor-004',
    vendorCode: 'V-004',
    vendorName: 'ElectroTech Industries',
    receiptDate: '2026-01-25',
    deliveryNoteNumber: 'DN-ET-2026-0089',
    deliveryDate: '2026-01-25',
    status: 'Returned',
    warehouseId: 'wh-004',
    warehouseName: 'Equipment Warehouse',
    items: [
      {
        id: 'gri-008-1',
        poItemId: 'poi-004-1',
        itemId: 'item-007',
        itemCode: 'ELEC-001',
        itemName: 'Industrial Motors 5HP',
        orderedQuantity: 50,
        receivedQuantity: 10,
        acceptedQuantity: 0,
        rejectedQuantity: 10,
        unit: 'PCS',
        unitPrice: 1200,
        totalAmount: 12000,
        warehouseId: 'wh-004',
        warehouseName: 'Equipment Warehouse',
        qualityCheckStatus: 'Failed',
        qualityCheckDate: '2026-01-25T15:00:00Z',
        qualityCheckBy: 'Quality Inspector 2',
        qualityCheckNotes: 'Wrong model delivered - 3HP motors instead of 5HP. Entire shipment returned.'
      }
    ],
    totalItems: 1,
    totalQuantityOrdered: 50,
    totalQuantityReceived: 10,
    totalQuantityAccepted: 0,
    totalQuantityRejected: 10,
    totalAmount: 12000,
    notes: 'Wrong items delivered - returned to vendor for correct shipment',
    receivedBy: 'user-012',
    receivedByName: 'Jennifer Lopez',
    qualityInspector: 'user-013',
    qualityInspectorName: 'Quality Inspector 2',
    createdAt: '2026-01-25T10:00:00Z',
    updatedAt: '2026-01-25T17:00:00Z'
  }
];

// ==================== Service Class ====================

class GoodsReceiptService {
  private async simulateDelay(ms: number = 300): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAllGoodsReceipts(filters?: GoodsReceiptFilters): Promise<{ data: GoodsReceipt[]; total: number }> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();

      let filteredData = [...MOCK_GOODS_RECEIPTS];

      if (filters) {
        if (filters.status) {
          filteredData = filteredData.filter(gr => gr.status === filters.status);
        }
        if (filters.vendorId) {
          filteredData = filteredData.filter(gr => gr.vendorId === filters.vendorId);
        }
        if (filters.warehouseId) {
          filteredData = filteredData.filter(gr => gr.warehouseId === filters.warehouseId);
        }
        if (filters.poNumber) {
          filteredData = filteredData.filter(gr => gr.poNumber === filters.poNumber);
        }
        if (filters.fromDate) {
          filteredData = filteredData.filter(gr => gr.receiptDate >= filters.fromDate!);
        }
        if (filters.toDate) {
          filteredData = filteredData.filter(gr => gr.receiptDate <= filters.toDate!);
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(gr =>
            gr.grNumber.toLowerCase().includes(searchLower) ||
            gr.poNumber.toLowerCase().includes(searchLower) ||
            gr.vendorName.toLowerCase().includes(searchLower) ||
            gr.deliveryNoteNumber?.toLowerCase().includes(searchLower)
          );
        }
      }

      return { data: filteredData, total: filteredData.length };
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }

    const response = await apiClient.get<{ data: GoodsReceipt[]; total: number }>(
      `/procurement/goods-receipts?${params.toString()}`
    );
    return response.data;
  }

  async getGoodsReceiptById(id: string): Promise<GoodsReceipt> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      const gr = MOCK_GOODS_RECEIPTS.find(g => g.id === id);
      if (!gr) {
        throw new Error('Goods Receipt not found');
      }
      return gr;
    }

    const response = await apiClient.get<GoodsReceipt>(`/procurement/goods-receipts/${id}`);
    return response.data;
  }

  async getPendingReceipts(): Promise<GoodsReceipt[]> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      return MOCK_GOODS_RECEIPTS.filter(gr =>
        ['Pending', 'Quality Check', 'Passed', 'Partially Passed'].includes(gr.status)
      );
    }

    const response = await apiClient.get<GoodsReceipt[]>('/procurement/goods-receipts/pending');
    return response.data;
  }

  async createGoodsReceipt(data: CreateGoodsReceiptDto): Promise<GoodsReceipt> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay(500);
      const newGR: GoodsReceipt = {
        id: `gr-${Date.now()}`,
        grNumber: `GR-2026-${String(MOCK_GOODS_RECEIPTS.length + 1).padStart(3, '0')}`,
        poId: data.poId,
        poNumber: `PO-2026-${data.poId.slice(-3)}`,
        vendorId: 'vendor-001',
        vendorCode: 'V-001',
        vendorName: 'Vendor Name',
        receiptDate: new Date().toISOString().split('T')[0],
        deliveryNoteNumber: data.deliveryNoteNumber,
        deliveryDate: data.deliveryDate,
        status: 'Pending',
        warehouseId: data.warehouseId,
        warehouseName: 'Warehouse',
        items: [],
        totalItems: data.items.length,
        totalQuantityOrdered: 0,
        totalQuantityReceived: data.items.reduce((sum, item) => sum + item.receivedQuantity, 0),
        totalQuantityAccepted: 0,
        totalQuantityRejected: 0,
        totalAmount: 0,
        notes: data.notes,
        receivedBy: 'user-current',
        receivedByName: 'Current User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      MOCK_GOODS_RECEIPTS.push(newGR);
      return newGR;
    }

    const response = await apiClient.post<GoodsReceipt>('/procurement/goods-receipts', data);
    return response.data;
  }

  async updateGoodsReceipt(id: string, data: UpdateGoodsReceiptDto): Promise<GoodsReceipt> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay(500);
      const index = MOCK_GOODS_RECEIPTS.findIndex(g => g.id === id);
      if (index === -1) {
        throw new Error('Goods Receipt not found');
      }
      MOCK_GOODS_RECEIPTS[index] = {
        ...MOCK_GOODS_RECEIPTS[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      return MOCK_GOODS_RECEIPTS[index];
    }

    const response = await apiClient.put<GoodsReceipt>(`/procurement/goods-receipts/${id}`, data);
    return response.data;
  }

  async qualityCheck(id: string, data: QualityCheckDto): Promise<GoodsReceipt> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay(600);
      const index = MOCK_GOODS_RECEIPTS.findIndex(g => g.id === id);
      if (index === -1) {
        throw new Error('Goods Receipt not found');
      }

      // Determine overall status based on item results
      const allPassed = data.items.every(item => item.result === 'Passed');
      const allFailed = data.items.every(item => item.result === 'Failed');
      const hasConditional = data.items.some(item => item.result === 'Conditional Pass');

      let newStatus: GRStatus;
      if (allFailed) {
        newStatus = 'Failed';
      } else if (allPassed) {
        newStatus = 'Passed';
      } else {
        newStatus = 'Partially Passed';
      }

      // Update items with QC results
      const updatedItems = MOCK_GOODS_RECEIPTS[index].items.map(item => {
        const qcItem = data.items.find(qi => qi.itemId === item.id);
        if (qcItem) {
          return {
            ...item,
            acceptedQuantity: qcItem.acceptedQuantity,
            rejectedQuantity: qcItem.rejectedQuantity,
            qualityCheckStatus: qcItem.result,
            qualityCheckDate: new Date().toISOString(),
            qualityCheckBy: 'Current User',
            qualityCheckNotes: qcItem.notes
          };
        }
        return item;
      });

      const totalAccepted = updatedItems.reduce((sum, item) => sum + item.acceptedQuantity, 0);
      const totalRejected = updatedItems.reduce((sum, item) => sum + item.rejectedQuantity, 0);

      MOCK_GOODS_RECEIPTS[index] = {
        ...MOCK_GOODS_RECEIPTS[index],
        status: newStatus,
        items: updatedItems,
        totalQuantityAccepted: totalAccepted,
        totalQuantityRejected: totalRejected,
        qualityInspector: 'user-current',
        qualityInspectorName: 'Current User',
        updatedAt: new Date().toISOString()
      };

      return MOCK_GOODS_RECEIPTS[index];
    }

    const response = await apiClient.post<GoodsReceipt>(`/procurement/goods-receipts/${id}/quality-check`, data);
    return response.data;
  }

  async postToInventory(id: string): Promise<GoodsReceipt> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay(800);
      const index = MOCK_GOODS_RECEIPTS.findIndex(g => g.id === id);
      if (index === -1) {
        throw new Error('Goods Receipt not found');
      }

      if (!['Passed', 'Partially Passed'].includes(MOCK_GOODS_RECEIPTS[index].status)) {
        throw new Error('Goods Receipt must be passed quality check before posting to inventory');
      }

      MOCK_GOODS_RECEIPTS[index] = {
        ...MOCK_GOODS_RECEIPTS[index],
        status: 'Posted to Inventory',
        postedToInventoryAt: new Date().toISOString(),
        postedBy: 'user-current',
        postedByName: 'Current User',
        updatedAt: new Date().toISOString()
      };

      return MOCK_GOODS_RECEIPTS[index];
    }

    const response = await apiClient.post<GoodsReceipt>(`/procurement/goods-receipts/${id}/post-to-inventory`, {});
    return response.data;
  }

  async returnToVendor(id: string, reason: string): Promise<GoodsReceipt> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay(500);
      const index = MOCK_GOODS_RECEIPTS.findIndex(g => g.id === id);
      if (index === -1) {
        throw new Error('Goods Receipt not found');
      }

      MOCK_GOODS_RECEIPTS[index] = {
        ...MOCK_GOODS_RECEIPTS[index],
        status: 'Returned',
        notes: `${MOCK_GOODS_RECEIPTS[index].notes || ''}\nReturn reason: ${reason}`.trim(),
        updatedAt: new Date().toISOString()
      };

      return MOCK_GOODS_RECEIPTS[index];
    }

    const response = await apiClient.post<GoodsReceipt>(`/procurement/goods-receipts/${id}/return`, { reason });
    return response.data;
  }

  async getReceiptsByPO(poId: string): Promise<GoodsReceipt[]> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      return MOCK_GOODS_RECEIPTS.filter(gr => gr.poId === poId);
    }

    const response = await apiClient.get<GoodsReceipt[]>(`/procurement/goods-receipts/by-po/${poId}`);
    return response.data;
  }

  async getReceiptStats(): Promise<{
    totalReceipts: number;
    pendingCount: number;
    qualityCheckCount: number;
    postedCount: number;
    failedCount: number;
  }> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      return {
        totalReceipts: MOCK_GOODS_RECEIPTS.length,
        pendingCount: MOCK_GOODS_RECEIPTS.filter(gr => gr.status === 'Pending').length,
        qualityCheckCount: MOCK_GOODS_RECEIPTS.filter(gr => gr.status === 'Quality Check').length,
        postedCount: MOCK_GOODS_RECEIPTS.filter(gr => gr.status === 'Posted to Inventory').length,
        failedCount: MOCK_GOODS_RECEIPTS.filter(gr => ['Failed', 'Returned'].includes(gr.status)).length
      };
    }

    const response = await apiClient.get<{
      totalReceipts: number;
      pendingCount: number;
      qualityCheckCount: number;
      postedCount: number;
      failedCount: number;
    }>('/procurement/goods-receipts/stats');
    return response.data;
  }
}

export const goodsReceiptService = new GoodsReceiptService();
