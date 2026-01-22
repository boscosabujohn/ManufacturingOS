/**
 * Inventory Module API Services
 * Handles all inventory-related API calls including stock, warehouses, movements, transfers, and adjustments
 */

import { apiClient } from './client';

// ==================== TYPES ====================

export interface Stock {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  warehouseId: string;
  warehouseName: string;
  locationId?: string;
  locationName?: string;
  batchNumber?: string;
  serialNumber?: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  uomId: string;
  uomCode: string;
  unitCost: number;
  totalValue: number;
  lastMovementDate?: string;
  expiryDate?: string;
  status: 'AVAILABLE' | 'RESERVED' | 'BLOCKED' | 'QUARANTINE' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  movementNumber: string;
  movementType: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT' | 'PRODUCTION' | 'RETURN' | 'SCRAP';
  referenceType?: 'GRN' | 'DELIVERY' | 'TRANSFER' | 'ADJUSTMENT' | 'WORK_ORDER' | 'RETURN' | 'SCRAP';
  referenceId?: string;
  referenceNumber?: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  fromWarehouseId?: string;
  fromWarehouseName?: string;
  fromLocationId?: string;
  fromLocationName?: string;
  toWarehouseId?: string;
  toWarehouseName?: string;
  toLocationId?: string;
  toLocationName?: string;
  batchNumber?: string;
  serialNumber?: string;
  quantity: number;
  uomId: string;
  uomCode: string;
  unitCost: number;
  totalValue: number;
  movementDate: string;
  reason?: string;
  remarks?: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdBy: string;
  createdAt: string;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'RAW_MATERIAL' | 'FINISHED_GOODS' | 'WIP' | 'SPARE_PARTS' | 'SCRAP' | 'TRANSIT' | 'GENERAL';
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  managerId?: string;
  managerName?: string;
  capacity?: number;
  capacityUom?: string;
  currentUtilization?: number;
  isDefault: boolean;
  allowNegativeStock: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  code: string;
  name: string;
  description?: string;
  warehouseId: string;
  warehouseName: string;
  parentLocationId?: string;
  parentLocationName?: string;
  zone?: string;
  aisle?: string;
  rack?: string;
  shelf?: string;
  bin?: string;
  locationType: 'STORAGE' | 'RECEIVING' | 'SHIPPING' | 'STAGING' | 'PICKING' | 'QC' | 'QUARANTINE';
  capacity?: number;
  capacityUom?: string;
  currentUtilization?: number;
  isPickable: boolean;
  isReceivable: boolean;
  isShippable: boolean;
  barcode?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'FULL' | 'BLOCKED';
  createdAt: string;
  updatedAt: string;
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  transferDate: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  requestedBy: string;
  requestedByName: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  dispatchedBy?: string;
  dispatchedAt?: string;
  receivedBy?: string;
  receivedAt?: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'DISPATCHED' | 'IN_TRANSIT' | 'RECEIVED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  reason?: string;
  remarks?: string;
  items: StockTransferItem[];
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface StockTransferItem {
  id: string;
  transferId: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  fromLocationId?: string;
  fromLocationName?: string;
  toLocationId?: string;
  toLocationName?: string;
  batchNumber?: string;
  requestedQuantity: number;
  dispatchedQuantity?: number;
  receivedQuantity?: number;
  damagedQuantity?: number;
  uomId: string;
  uomCode: string;
  unitCost: number;
  totalValue: number;
  remarks?: string;
}

export interface StockAdjustment {
  id: string;
  adjustmentNumber: string;
  warehouseId: string;
  warehouseName: string;
  adjustmentDate: string;
  adjustmentType: 'INCREASE' | 'DECREASE' | 'WRITE_OFF' | 'REVALUATION' | 'CYCLE_COUNT' | 'DAMAGED' | 'EXPIRED';
  reason: string;
  reasonCode?: string;
  requestedBy: string;
  requestedByName: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'POSTED' | 'CANCELLED';
  remarks?: string;
  items: StockAdjustmentItem[];
  totalItems: number;
  totalValueChange: number;
  createdAt: string;
  updatedAt: string;
}

export interface StockAdjustmentItem {
  id: string;
  adjustmentId: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  locationId?: string;
  locationName?: string;
  batchNumber?: string;
  serialNumber?: string;
  systemQuantity: number;
  actualQuantity: number;
  adjustmentQuantity: number;
  uomId: string;
  uomCode: string;
  systemCost: number;
  newCost?: number;
  valueChange: number;
  remarks?: string;
}

export interface CycleCount {
  id: string;
  countNumber: string;
  warehouseId: string;
  warehouseName: string;
  countDate: string;
  countType: 'FULL' | 'ABC' | 'LOCATION' | 'CATEGORY' | 'RANDOM';
  countMethod: 'BLIND' | 'GUIDED';
  status: 'PLANNED' | 'IN_PROGRESS' | 'PENDING_REVIEW' | 'COMPLETED' | 'CANCELLED';
  assignedTo?: string;
  assignedToName?: string;
  startedAt?: string;
  completedAt?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  totalLocations: number;
  countedLocations: number;
  totalItems: number;
  countedItems: number;
  varianceItems: number;
  totalVarianceValue: number;
  remarks?: string;
  items: CycleCountItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CycleCountItem {
  id: string;
  cycleCountId: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  locationId: string;
  locationName: string;
  batchNumber?: string;
  serialNumber?: string;
  systemQuantity: number;
  countedQuantity?: number;
  variance?: number;
  variancePercentage?: number;
  uomId: string;
  uomCode: string;
  unitCost: number;
  varianceValue?: number;
  status: 'PENDING' | 'COUNTED' | 'RECOUNTED' | 'APPROVED' | 'REJECTED';
  countedBy?: string;
  countedAt?: string;
  remarks?: string;
}

export interface StockQuery {
  page?: number;
  limit?: number;
  search?: string;
  itemId?: string;
  warehouseId?: string;
  locationId?: string;
  status?: string;
  batchNumber?: string;
  belowReorderLevel?: boolean;
  expiringSoon?: boolean;
  expiryDays?: number;
}

export interface StockMovementQuery {
  page?: number;
  limit?: number;
  search?: string;
  movementType?: string;
  referenceType?: string;
  itemId?: string;
  warehouseId?: string;
  fromDate?: string;
  toDate?: string;
  status?: string;
}

export interface WarehouseQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
}

export interface LocationQuery {
  page?: number;
  limit?: number;
  search?: string;
  warehouseId?: string;
  locationType?: string;
  zone?: string;
  status?: string;
}

export interface TransferQuery {
  page?: number;
  limit?: number;
  search?: string;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  priority?: string;
}

export interface AdjustmentQuery {
  page?: number;
  limit?: number;
  search?: string;
  warehouseId?: string;
  adjustmentType?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export interface CycleCountQuery {
  page?: number;
  limit?: number;
  search?: string;
  warehouseId?: string;
  countType?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export interface CreateWarehouseDTO {
  code: string;
  name: string;
  description?: string;
  type: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  managerId?: string;
  capacity?: number;
  capacityUom?: string;
  isDefault?: boolean;
  allowNegativeStock?: boolean;
  status?: string;
}

export interface CreateLocationDTO {
  code: string;
  name: string;
  description?: string;
  warehouseId: string;
  parentLocationId?: string;
  zone?: string;
  aisle?: string;
  rack?: string;
  shelf?: string;
  bin?: string;
  locationType: string;
  capacity?: number;
  capacityUom?: string;
  isPickable?: boolean;
  isReceivable?: boolean;
  isShippable?: boolean;
  barcode?: string;
  status?: string;
}

export interface CreateStockTransferDTO {
  fromWarehouseId: string;
  toWarehouseId: string;
  transferDate: string;
  expectedDeliveryDate?: string;
  priority?: string;
  reason?: string;
  remarks?: string;
  items: {
    itemId: string;
    fromLocationId?: string;
    toLocationId?: string;
    batchNumber?: string;
    requestedQuantity: number;
    remarks?: string;
  }[];
}

export interface CreateStockAdjustmentDTO {
  warehouseId: string;
  adjustmentDate: string;
  adjustmentType: string;
  reason: string;
  reasonCode?: string;
  remarks?: string;
  items: {
    itemId: string;
    locationId?: string;
    batchNumber?: string;
    serialNumber?: string;
    actualQuantity: number;
    newCost?: number;
    remarks?: string;
  }[];
}

export interface CreateCycleCountDTO {
  warehouseId: string;
  countDate: string;
  countType: string;
  countMethod: string;
  assignedTo?: string;
  remarks?: string;
  locations?: string[];
  categories?: string[];
  items?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StockSummary {
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  belowReorderLevel: number;
  expiringSoon: number;
  expired: number;
  byWarehouse: {
    warehouseId: string;
    warehouseName: string;
    itemCount: number;
    totalValue: number;
  }[];
  byCategory: {
    categoryId: string;
    categoryName: string;
    itemCount: number;
    totalValue: number;
  }[];
}

export interface InventoryValuationReport {
  asOfDate: string;
  valuationMethod: 'FIFO' | 'LIFO' | 'WEIGHTED_AVG' | 'STANDARD';
  totalValue: number;
  items: {
    itemId: string;
    itemCode: string;
    itemName: string;
    quantity: number;
    unitCost: number;
    totalValue: number;
    warehouseBreakdown: {
      warehouseId: string;
      warehouseName: string;
      quantity: number;
      value: number;
    }[];
  }[];
}

export interface StockAgingReport {
  asOfDate: string;
  items: {
    itemId: string;
    itemCode: string;
    itemName: string;
    warehouseId: string;
    warehouseName: string;
    batchNumber?: string;
    receivedDate: string;
    ageDays: number;
    quantity: number;
    value: number;
    agingBucket: '0-30' | '31-60' | '61-90' | '91-180' | '181-365' | 'OVER_365';
  }[];
  summary: {
    bucket: string;
    itemCount: number;
    totalQuantity: number;
    totalValue: number;
  }[];
}

// ==================== STOCK SERVICE ====================

export const stockService = {
  getAll: async (query?: StockQuery): Promise<PaginatedResponse<Stock>> => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await apiClient.get(`/inventory/stock?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<Stock> => {
    const response = await apiClient.get(`/inventory/stock/${id}`);
    return response.data;
  },

  getByItem: async (itemId: string): Promise<Stock[]> => {
    const response = await apiClient.get(`/inventory/stock/item/${itemId}`);
    return response.data;
  },

  getByWarehouse: async (warehouseId: string): Promise<Stock[]> => {
    const response = await apiClient.get(`/inventory/stock/warehouse/${warehouseId}`);
    return response.data;
  },

  getByLocation: async (locationId: string): Promise<Stock[]> => {
    const response = await apiClient.get(`/inventory/stock/location/${locationId}`);
    return response.data;
  },

  getAvailableStock: async (itemId: string, warehouseId?: string): Promise<{ available: number; reserved: number; total: number }> => {
    const params = warehouseId ? `?warehouseId=${warehouseId}` : '';
    const response = await apiClient.get(`/inventory/stock/available/${itemId}${params}`);
    return response.data;
  },

  getSummary: async (warehouseId?: string): Promise<StockSummary> => {
    const params = warehouseId ? `?warehouseId=${warehouseId}` : '';
    const response = await apiClient.get(`/inventory/stock/summary${params}`);
    return response.data;
  },

  getBelowReorderLevel: async (warehouseId?: string): Promise<Stock[]> => {
    const params = warehouseId ? `?warehouseId=${warehouseId}` : '';
    const response = await apiClient.get(`/inventory/stock/below-reorder-level${params}`);
    return response.data;
  },

  getExpiringSoon: async (days: number = 30, warehouseId?: string): Promise<Stock[]> => {
    const params = new URLSearchParams({ days: String(days) });
    if (warehouseId) params.append('warehouseId', warehouseId);
    const response = await apiClient.get(`/inventory/stock/expiring-soon?${params.toString()}`);
    return response.data;
  },

  reserve: async (id: string, quantity: number, referenceType: string, referenceId: string): Promise<Stock> => {
    const response = await apiClient.post(`/inventory/stock/${id}/reserve`, { quantity, referenceType, referenceId });
    return response.data;
  },

  release: async (id: string, quantity: number, referenceType: string, referenceId: string): Promise<Stock> => {
    const response = await apiClient.post(`/inventory/stock/${id}/release`, { quantity, referenceType, referenceId });
    return response.data;
  },

  block: async (id: string, reason: string): Promise<Stock> => {
    const response = await apiClient.post(`/inventory/stock/${id}/block`, { reason });
    return response.data;
  },

  unblock: async (id: string): Promise<Stock> => {
    const response = await apiClient.post(`/inventory/stock/${id}/unblock`);
    return response.data;
  },
};

// ==================== STOCK MOVEMENT SERVICE ====================

export const stockMovementService = {
  getAll: async (query?: StockMovementQuery): Promise<PaginatedResponse<StockMovement>> => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await apiClient.get(`/inventory/movements?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<StockMovement> => {
    const response = await apiClient.get(`/inventory/movements/${id}`);
    return response.data;
  },

  getByItem: async (itemId: string, query?: { fromDate?: string; toDate?: string }): Promise<StockMovement[]> => {
    const params = new URLSearchParams();
    if (query?.fromDate) params.append('fromDate', query.fromDate);
    if (query?.toDate) params.append('toDate', query.toDate);
    const response = await apiClient.get(`/inventory/movements/item/${itemId}?${params.toString()}`);
    return response.data;
  },

  getByReference: async (referenceType: string, referenceId: string): Promise<StockMovement[]> => {
    const response = await apiClient.get(`/inventory/movements/reference/${referenceType}/${referenceId}`);
    return response.data;
  },

  getLedger: async (itemId: string, warehouseId?: string, fromDate?: string, toDate?: string): Promise<{
    openingBalance: number;
    closingBalance: number;
    movements: StockMovement[];
  }> => {
    const params = new URLSearchParams();
    if (warehouseId) params.append('warehouseId', warehouseId);
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    const response = await apiClient.get(`/inventory/movements/ledger/${itemId}?${params.toString()}`);
    return response.data;
  },
};

// ==================== WAREHOUSE SERVICE ====================

export const warehouseService = {
  getAll: async (query?: WarehouseQuery): Promise<PaginatedResponse<Warehouse>> => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await apiClient.get(`/inventory/warehouses?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<Warehouse> => {
    const response = await apiClient.get(`/inventory/warehouses/${id}`);
    return response.data;
  },

  getByCode: async (code: string): Promise<Warehouse> => {
    const response = await apiClient.get(`/inventory/warehouses/code/${code}`);
    return response.data;
  },

  create: async (data: CreateWarehouseDTO): Promise<Warehouse> => {
    const response = await apiClient.post('/inventory/warehouses', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateWarehouseDTO>): Promise<Warehouse> => {
    const response = await apiClient.patch(`/inventory/warehouses/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/inventory/warehouses/${id}`);
  },

  setDefault: async (id: string): Promise<Warehouse> => {
    const response = await apiClient.post(`/inventory/warehouses/${id}/set-default`);
    return response.data;
  },

  getUtilization: async (id: string): Promise<{
    capacity: number;
    used: number;
    available: number;
    utilizationPercentage: number;
  }> => {
    const response = await apiClient.get(`/inventory/warehouses/${id}/utilization`);
    return response.data;
  },

  getLocations: async (id: string): Promise<Location[]> => {
    const response = await apiClient.get(`/inventory/warehouses/${id}/locations`);
    return response.data;
  },
};

// ==================== LOCATION SERVICE ====================

export const locationService = {
  getAll: async (query?: LocationQuery): Promise<PaginatedResponse<Location>> => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await apiClient.get(`/inventory/locations?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<Location> => {
    const response = await apiClient.get(`/inventory/locations/${id}`);
    return response.data;
  },

  getByCode: async (code: string, warehouseId: string): Promise<Location> => {
    const response = await apiClient.get(`/inventory/locations/code/${code}?warehouseId=${warehouseId}`);
    return response.data;
  },

  getByBarcode: async (barcode: string): Promise<Location> => {
    const response = await apiClient.get(`/inventory/locations/barcode/${barcode}`);
    return response.data;
  },

  create: async (data: CreateLocationDTO): Promise<Location> => {
    const response = await apiClient.post('/inventory/locations', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateLocationDTO>): Promise<Location> => {
    const response = await apiClient.patch(`/inventory/locations/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/inventory/locations/${id}`);
  },

  getStock: async (id: string): Promise<Stock[]> => {
    const response = await apiClient.get(`/inventory/locations/${id}/stock`);
    return response.data;
  },

  getChildren: async (id: string): Promise<Location[]> => {
    const response = await apiClient.get(`/inventory/locations/${id}/children`);
    return response.data;
  },

  getUtilization: async (id: string): Promise<{
    capacity: number;
    used: number;
    available: number;
    utilizationPercentage: number;
  }> => {
    const response = await apiClient.get(`/inventory/locations/${id}/utilization`);
    return response.data;
  },
};

// ==================== STOCK TRANSFER SERVICE ====================

export const stockTransferService = {
  getAll: async (query?: TransferQuery): Promise<PaginatedResponse<StockTransfer>> => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await apiClient.get(`/inventory/transfers?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<StockTransfer> => {
    const response = await apiClient.get(`/inventory/transfers/${id}`);
    return response.data;
  },

  getByNumber: async (transferNumber: string): Promise<StockTransfer> => {
    const response = await apiClient.get(`/inventory/transfers/number/${transferNumber}`);
    return response.data;
  },

  create: async (data: CreateStockTransferDTO): Promise<StockTransfer> => {
    const response = await apiClient.post('/inventory/transfers', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateStockTransferDTO>): Promise<StockTransfer> => {
    const response = await apiClient.patch(`/inventory/transfers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/inventory/transfers/${id}`);
  },

  submit: async (id: string): Promise<StockTransfer> => {
    const response = await apiClient.post(`/inventory/transfers/${id}/submit`);
    return response.data;
  },

  approve: async (id: string, remarks?: string): Promise<StockTransfer> => {
    const response = await apiClient.post(`/inventory/transfers/${id}/approve`, { remarks });
    return response.data;
  },

  reject: async (id: string, reason: string): Promise<StockTransfer> => {
    const response = await apiClient.post(`/inventory/transfers/${id}/reject`, { reason });
    return response.data;
  },

  dispatch: async (id: string, dispatchData: { items: { itemId: string; dispatchedQuantity: number }[] }): Promise<StockTransfer> => {
    const response = await apiClient.post(`/inventory/transfers/${id}/dispatch`, dispatchData);
    return response.data;
  },

  receive: async (id: string, receiveData: { items: { itemId: string; receivedQuantity: number; damagedQuantity?: number; remarks?: string }[] }): Promise<StockTransfer> => {
    const response = await apiClient.post(`/inventory/transfers/${id}/receive`, receiveData);
    return response.data;
  },

  cancel: async (id: string, reason: string): Promise<StockTransfer> => {
    const response = await apiClient.post(`/inventory/transfers/${id}/cancel`, { reason });
    return response.data;
  },

  getPendingApprovals: async (): Promise<StockTransfer[]> => {
    const response = await apiClient.get('/inventory/transfers/pending-approvals');
    return response.data;
  },

  getInTransit: async (): Promise<StockTransfer[]> => {
    const response = await apiClient.get('/inventory/transfers/in-transit');
    return response.data;
  },
};

// ==================== STOCK ADJUSTMENT SERVICE ====================

export const stockAdjustmentService = {
  getAll: async (query?: AdjustmentQuery): Promise<PaginatedResponse<StockAdjustment>> => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await apiClient.get(`/inventory/adjustments?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<StockAdjustment> => {
    const response = await apiClient.get(`/inventory/adjustments/${id}`);
    return response.data;
  },

  getByNumber: async (adjustmentNumber: string): Promise<StockAdjustment> => {
    const response = await apiClient.get(`/inventory/adjustments/number/${adjustmentNumber}`);
    return response.data;
  },

  create: async (data: CreateStockAdjustmentDTO): Promise<StockAdjustment> => {
    const response = await apiClient.post('/inventory/adjustments', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateStockAdjustmentDTO>): Promise<StockAdjustment> => {
    const response = await apiClient.patch(`/inventory/adjustments/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/inventory/adjustments/${id}`);
  },

  submit: async (id: string): Promise<StockAdjustment> => {
    const response = await apiClient.post(`/inventory/adjustments/${id}/submit`);
    return response.data;
  },

  approve: async (id: string, remarks?: string): Promise<StockAdjustment> => {
    const response = await apiClient.post(`/inventory/adjustments/${id}/approve`, { remarks });
    return response.data;
  },

  reject: async (id: string, reason: string): Promise<StockAdjustment> => {
    const response = await apiClient.post(`/inventory/adjustments/${id}/reject`, { reason });
    return response.data;
  },

  post: async (id: string): Promise<StockAdjustment> => {
    const response = await apiClient.post(`/inventory/adjustments/${id}/post`);
    return response.data;
  },

  cancel: async (id: string, reason: string): Promise<StockAdjustment> => {
    const response = await apiClient.post(`/inventory/adjustments/${id}/cancel`, { reason });
    return response.data;
  },

  getPendingApprovals: async (): Promise<StockAdjustment[]> => {
    const response = await apiClient.get('/inventory/adjustments/pending-approvals');
    return response.data;
  },

  getReasonCodes: async (): Promise<{ code: string; description: string; adjustmentType: string }[]> => {
    const response = await apiClient.get('/inventory/adjustments/reason-codes');
    return response.data;
  },
};

// ==================== CYCLE COUNT SERVICE ====================

export const cycleCountService = {
  getAll: async (query?: CycleCountQuery): Promise<PaginatedResponse<CycleCount>> => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await apiClient.get(`/inventory/cycle-counts?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<CycleCount> => {
    const response = await apiClient.get(`/inventory/cycle-counts/${id}`);
    return response.data;
  },

  getByNumber: async (countNumber: string): Promise<CycleCount> => {
    const response = await apiClient.get(`/inventory/cycle-counts/number/${countNumber}`);
    return response.data;
  },

  create: async (data: CreateCycleCountDTO): Promise<CycleCount> => {
    const response = await apiClient.post('/inventory/cycle-counts', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateCycleCountDTO>): Promise<CycleCount> => {
    const response = await apiClient.patch(`/inventory/cycle-counts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/inventory/cycle-counts/${id}`);
  },

  start: async (id: string): Promise<CycleCount> => {
    const response = await apiClient.post(`/inventory/cycle-counts/${id}/start`);
    return response.data;
  },

  recordCount: async (id: string, itemId: string, countedQuantity: number, remarks?: string): Promise<CycleCountItem> => {
    const response = await apiClient.post(`/inventory/cycle-counts/${id}/items/${itemId}/count`, { countedQuantity, remarks });
    return response.data;
  },

  recordBatchCounts: async (id: string, counts: { itemId: string; countedQuantity: number; remarks?: string }[]): Promise<CycleCountItem[]> => {
    const response = await apiClient.post(`/inventory/cycle-counts/${id}/batch-count`, { counts });
    return response.data;
  },

  complete: async (id: string): Promise<CycleCount> => {
    const response = await apiClient.post(`/inventory/cycle-counts/${id}/complete`);
    return response.data;
  },

  review: async (id: string, items: { itemId: string; status: 'APPROVED' | 'REJECTED'; remarks?: string }[]): Promise<CycleCount> => {
    const response = await apiClient.post(`/inventory/cycle-counts/${id}/review`, { items });
    return response.data;
  },

  createAdjustment: async (id: string): Promise<StockAdjustment> => {
    const response = await apiClient.post(`/inventory/cycle-counts/${id}/create-adjustment`);
    return response.data;
  },

  cancel: async (id: string, reason: string): Promise<CycleCount> => {
    const response = await apiClient.post(`/inventory/cycle-counts/${id}/cancel`, { reason });
    return response.data;
  },

  getInProgress: async (): Promise<CycleCount[]> => {
    const response = await apiClient.get('/inventory/cycle-counts/in-progress');
    return response.data;
  },

  getPendingReview: async (): Promise<CycleCount[]> => {
    const response = await apiClient.get('/inventory/cycle-counts/pending-review');
    return response.data;
  },

  getVarianceReport: async (id: string): Promise<{
    cycleCount: CycleCount;
    totalVariance: number;
    totalVarianceValue: number;
    varianceByCategory: { categoryId: string; categoryName: string; variance: number; value: number }[];
  }> => {
    const response = await apiClient.get(`/inventory/cycle-counts/${id}/variance-report`);
    return response.data;
  },
};

// ==================== INVENTORY REPORTS SERVICE ====================

export const inventoryReportsService = {
  getValuationReport: async (asOfDate?: string, warehouseId?: string, valuationMethod?: string): Promise<InventoryValuationReport> => {
    const params = new URLSearchParams();
    if (asOfDate) params.append('asOfDate', asOfDate);
    if (warehouseId) params.append('warehouseId', warehouseId);
    if (valuationMethod) params.append('valuationMethod', valuationMethod);
    const response = await apiClient.get(`/inventory/reports/valuation?${params.toString()}`);
    return response.data;
  },

  getAgingReport: async (asOfDate?: string, warehouseId?: string): Promise<StockAgingReport> => {
    const params = new URLSearchParams();
    if (asOfDate) params.append('asOfDate', asOfDate);
    if (warehouseId) params.append('warehouseId', warehouseId);
    const response = await apiClient.get(`/inventory/reports/aging?${params.toString()}`);
    return response.data;
  },

  getMovementSummary: async (fromDate: string, toDate: string, warehouseId?: string): Promise<{
    period: { from: string; to: string };
    openingStock: number;
    openingValue: number;
    totalIn: number;
    totalInValue: number;
    totalOut: number;
    totalOutValue: number;
    closingStock: number;
    closingValue: number;
    movementBreakdown: {
      movementType: string;
      quantity: number;
      value: number;
    }[];
  }> => {
    const params = new URLSearchParams({ fromDate, toDate });
    if (warehouseId) params.append('warehouseId', warehouseId);
    const response = await apiClient.get(`/inventory/reports/movement-summary?${params.toString()}`);
    return response.data;
  },

  getSlowMovingItems: async (days: number = 90, warehouseId?: string): Promise<{
    items: {
      itemId: string;
      itemCode: string;
      itemName: string;
      lastMovementDate: string;
      daysSinceLastMovement: number;
      quantity: number;
      value: number;
    }[];
  }> => {
    const params = new URLSearchParams({ days: String(days) });
    if (warehouseId) params.append('warehouseId', warehouseId);
    const response = await apiClient.get(`/inventory/reports/slow-moving?${params.toString()}`);
    return response.data;
  },

  getDeadStock: async (days: number = 365, warehouseId?: string): Promise<{
    items: {
      itemId: string;
      itemCode: string;
      itemName: string;
      lastMovementDate: string;
      daysSinceLastMovement: number;
      quantity: number;
      value: number;
    }[];
    totalValue: number;
  }> => {
    const params = new URLSearchParams({ days: String(days) });
    if (warehouseId) params.append('warehouseId', warehouseId);
    const response = await apiClient.get(`/inventory/reports/dead-stock?${params.toString()}`);
    return response.data;
  },

  getReorderReport: async (warehouseId?: string): Promise<{
    items: {
      itemId: string;
      itemCode: string;
      itemName: string;
      currentStock: number;
      reorderLevel: number;
      reorderQuantity: number;
      maxStock: number;
      suggestedOrderQuantity: number;
      preferredVendorId?: string;
      preferredVendorName?: string;
      leadTimeDays?: number;
    }[];
  }> => {
    const params = warehouseId ? `?warehouseId=${warehouseId}` : '';
    const response = await apiClient.get(`/inventory/reports/reorder${params}`);
    return response.data;
  },

  getABCAnalysis: async (warehouseId?: string, criteriaType?: 'VALUE' | 'CONSUMPTION' | 'QUANTITY'): Promise<{
    criteriaType: string;
    items: {
      itemId: string;
      itemCode: string;
      itemName: string;
      category: 'A' | 'B' | 'C';
      value: number;
      percentage: number;
      cumulativePercentage: number;
    }[];
    summary: {
      category: string;
      itemCount: number;
      totalValue: number;
      percentage: number;
    }[];
  }> => {
    const params = new URLSearchParams();
    if (warehouseId) params.append('warehouseId', warehouseId);
    if (criteriaType) params.append('criteriaType', criteriaType);
    const response = await apiClient.get(`/inventory/reports/abc-analysis?${params.toString()}`);
    return response.data;
  },

  getStockLedger: async (itemId: string, fromDate: string, toDate: string, warehouseId?: string): Promise<{
    item: { id: string; code: string; name: string };
    period: { from: string; to: string };
    openingBalance: { quantity: number; value: number };
    closingBalance: { quantity: number; value: number };
    transactions: {
      date: string;
      movementNumber: string;
      movementType: string;
      referenceNumber?: string;
      inQuantity: number;
      outQuantity: number;
      balance: number;
      unitCost: number;
      value: number;
    }[];
  }> => {
    const params = new URLSearchParams({ fromDate, toDate });
    if (warehouseId) params.append('warehouseId', warehouseId);
    const response = await apiClient.get(`/inventory/reports/stock-ledger/${itemId}?${params.toString()}`);
    return response.data;
  },

  exportToExcel: async (reportType: string, params: Record<string, string>): Promise<Blob> => {
    const queryParams = new URLSearchParams(params);
    const response = await apiClient.get(`/inventory/reports/${reportType}/export?${queryParams.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
