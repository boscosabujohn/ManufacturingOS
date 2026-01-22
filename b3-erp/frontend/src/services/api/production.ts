/**
 * Production API Service
 * Wires frontend to backend Production module APIs
 */

import apiClient from '@/lib/api-client';

// ============================================
// TYPES
// ============================================

export interface WorkCenter {
  id: string;
  workCenterCode: string;
  workCenterName: string;
  description?: string;
  workCenterType: string;
  status: 'AVAILABLE' | 'BUSY' | 'MAINTENANCE' | 'BREAKDOWN' | 'IDLE' | 'INACTIVE';
  department?: string;
  plant?: string;
  building?: string;
  area?: string;
  numberOfStations: number;
  workingHoursPerDay: number;
  workingDaysPerWeek: number;
  hourlyOperatingCost: number;
  laborCostPerHour: number;
  overheadCostPerHour: number;
  totalCostPerHour: number;
  efficiency: number;
  requiredOperators: number;
  isActive: boolean;
  isCritical: boolean;
  currentWorkOrderId?: string;
  currentWorkOrderNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Operation {
  id: string;
  operationCode: string;
  operationName: string;
  description?: string;
  operationType: string;
  status: 'ACTIVE' | 'INACTIVE' | 'OBSOLETE';
  defaultWorkCenterId?: string;
  defaultWorkCenterCode?: string;
  defaultWorkCenterName?: string;
  setupTimeMinutes: number;
  runTimePerUnitMinutes: number;
  teardownTimeMinutes: number;
  totalTimePerUnitMinutes: number;
  batchSize: number;
  hourlyRate: number;
  overheadRate: number;
  costPerUnit: number;
  numberOfOperators: number;
  numberOfMachines: number;
  requiresQualityInspection: boolean;
  requiresSupervisorApproval: boolean;
  isActive: boolean;
  isCritical: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BOM {
  id: string;
  bomCode: string;
  bomName: string;
  description?: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  version: number;
  quantity: number;
  uom: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'ACTIVE' | 'INACTIVE' | 'OBSOLETE';
  effectiveFrom?: string;
  effectiveTo?: string;
  totalMaterialCost: number;
  totalLaborCost: number;
  totalOverheadCost: number;
  totalCost: number;
  components: BOMComponent[];
  createdAt: string;
  updatedAt: string;
}

export interface BOMComponent {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  uom: string;
  wastePercent: number;
  operationId?: string;
  operationCode?: string;
  unitCost: number;
  totalCost: number;
  isOptional: boolean;
  remarks?: string;
}

export interface Routing {
  id: string;
  routingCode: string;
  routingName: string;
  description?: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  bomId?: string;
  bomCode?: string;
  version: number;
  status: 'DRAFT' | 'SUBMITTED' | 'ACTIVE' | 'INACTIVE' | 'OBSOLETE';
  effectiveFrom?: string;
  effectiveTo?: string;
  totalSetupTime: number;
  totalRunTimePerUnit: number;
  totalTimePerUnit: number;
  totalCostPerUnit: number;
  operations: RoutingOperation[];
  createdAt: string;
  updatedAt: string;
}

export interface RoutingOperation {
  sequenceNumber: number;
  operationId: string;
  operationCode: string;
  operationName: string;
  workCenterId: string;
  workCenterCode: string;
  workCenterName: string;
  setupTimeMinutes: number;
  runTimePerUnitMinutes: number;
  teardownTimeMinutes: number;
  totalTimePerUnitMinutes: number;
  costPerUnit: number;
  requiresQualityInspection: boolean;
  workInstructions?: string;
}

export interface ProductionPlan {
  id: string;
  planNumber: string;
  planName: string;
  description?: string;
  planType: 'MRP' | 'MPS' | 'CAPACITY' | 'CUSTOM';
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  planningHorizonDays: number;
  items: ProductionPlanItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductionPlanItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  plannedQuantity: number;
  uom: string;
  startDate: string;
  endDate: string;
  priority: number;
  workOrderIds?: string[];
}

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  description?: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  bomId?: string;
  bomCode?: string;
  routingId?: string;
  routingCode?: string;
  salesOrderId?: string;
  salesOrderNumber?: string;
  plannedQuantity: number;
  completedQuantity: number;
  rejectedQuantity: number;
  uom: string;
  status: 'DRAFT' | 'RELEASED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  currentOperationId?: string;
  currentOperationName?: string;
  percentComplete: number;
  estimatedCost: number;
  actualCost: number;
  operations: WorkOrderOperation[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderOperation {
  id: string;
  sequenceNumber: number;
  operationId: string;
  operationCode: string;
  operationName: string;
  workCenterId: string;
  workCenterCode: string;
  workCenterName: string;
  plannedQuantity: number;
  completedQuantity: number;
  rejectedQuantity: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  plannedStartTime?: string;
  plannedEndTime?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  setupTimeMinutes: number;
  runTimeMinutes: number;
  operatorId?: string;
  operatorName?: string;
}

export interface ProductionEntry {
  id: string;
  entryNumber: string;
  workOrderId: string;
  workOrderNumber: string;
  operationId: string;
  operationCode: string;
  operationName: string;
  workCenterId: string;
  workCenterCode: string;
  entryDate: string;
  shiftId?: string;
  shiftName?: string;
  operatorId: string;
  operatorName: string;
  quantityProduced: number;
  quantityRejected: number;
  quantityGood: number;
  uom: string;
  startTime: string;
  endTime: string;
  setupTimeMinutes: number;
  runTimeMinutes: number;
  downtimeMinutes: number;
  downtimeReason?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'POSTED';
  qualityStatus?: 'PENDING' | 'PASSED' | 'FAILED' | 'PARTIAL';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// WORK CENTER API
// ============================================

export const workCenterApi = {
  async getAll(filters?: {
    status?: string;
    workCenterType?: string;
    department?: string;
    isActive?: boolean;
  }): Promise<WorkCenter[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/production/work-centers?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<WorkCenter> {
    const response = await apiClient.get(`/production/work-centers/${id}`);
    return response.data;
  },

  async create(data: Partial<WorkCenter>): Promise<WorkCenter> {
    const response = await apiClient.post('/production/work-centers', data);
    return response.data;
  },

  async update(id: string, data: Partial<WorkCenter>): Promise<WorkCenter> {
    const response = await apiClient.put(`/production/work-centers/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/production/work-centers/${id}`);
  },

  async getCapacity(id: string, fromDate: string, toDate: string): Promise<{
    workCenter: WorkCenter;
    availableHours: number;
    scheduledHours: number;
    utilizationPercent: number;
  }> {
    const response = await apiClient.get(
      `/production/work-centers/${id}/capacity?fromDate=${fromDate}&toDate=${toDate}`,
    );
    return response.data;
  },
};

// ============================================
// OPERATION API
// ============================================

export const operationApi = {
  async getAll(filters?: {
    status?: string;
    operationType?: string;
    workCenterId?: string;
  }): Promise<Operation[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/production/operations?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<Operation> {
    const response = await apiClient.get(`/production/operations/${id}`);
    return response.data;
  },

  async create(data: Partial<Operation>): Promise<Operation> {
    const response = await apiClient.post('/production/operations', data);
    return response.data;
  },

  async update(id: string, data: Partial<Operation>): Promise<Operation> {
    const response = await apiClient.put(`/production/operations/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/production/operations/${id}`);
  },
};

// ============================================
// BOM API
// ============================================

export const bomApi = {
  async getAll(filters?: {
    status?: string;
    itemId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: BOM[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/production/bom?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<BOM> {
    const response = await apiClient.get(`/production/bom/${id}`);
    return response.data;
  },

  async create(data: {
    bomCode: string;
    bomName: string;
    itemId: string;
    quantity: number;
    uom: string;
    components: {
      itemId: string;
      quantity: number;
      uom: string;
      wastePercent?: number;
      operationId?: string;
      isOptional?: boolean;
    }[];
  }): Promise<BOM> {
    const response = await apiClient.post('/production/bom', data);
    return response.data;
  },

  async update(id: string, data: Partial<BOM>): Promise<BOM> {
    const response = await apiClient.put(`/production/bom/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/production/bom/${id}`);
  },

  async submit(id: string): Promise<BOM> {
    const response = await apiClient.post(`/production/bom/${id}/submit`);
    return response.data;
  },

  async approve(id: string): Promise<BOM> {
    const response = await apiClient.post(`/production/bom/${id}/approve`);
    return response.data;
  },

  async explode(id: string, quantity?: number): Promise<{
    bom: BOM;
    explodedComponents: {
      level: number;
      itemId: string;
      itemCode: string;
      itemName: string;
      requiredQuantity: number;
      uom: string;
    }[];
  }> {
    const params = quantity ? `?quantity=${quantity}` : '';
    const response = await apiClient.get(`/production/bom/${id}/explode${params}`);
    return response.data;
  },

  async costRollup(id: string): Promise<{
    bom: BOM;
    materialCost: number;
    laborCost: number;
    overheadCost: number;
    totalCost: number;
  }> {
    const response = await apiClient.post(`/production/bom/${id}/cost-rollup`);
    return response.data;
  },

  async whereUsed(itemId: string): Promise<BOM[]> {
    const response = await apiClient.get(`/production/bom/item/${itemId}/where-used`);
    return response.data;
  },
};

// ============================================
// ROUTING API
// ============================================

export const routingApi = {
  async getAll(filters?: {
    status?: string;
    itemId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Routing[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/production/routings?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<Routing> {
    const response = await apiClient.get(`/production/routings/${id}`);
    return response.data;
  },

  async create(data: Partial<Routing>): Promise<Routing> {
    const response = await apiClient.post('/production/routings', data);
    return response.data;
  },

  async update(id: string, data: Partial<Routing>): Promise<Routing> {
    const response = await apiClient.put(`/production/routings/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/production/routings/${id}`);
  },

  async submit(id: string): Promise<Routing> {
    const response = await apiClient.post(`/production/routings/${id}/submit`);
    return response.data;
  },

  async approve(id: string): Promise<Routing> {
    const response = await apiClient.post(`/production/routings/${id}/approve`);
    return response.data;
  },
};

// ============================================
// PRODUCTION PLAN API
// ============================================

export const productionPlanApi = {
  async getAll(filters?: {
    status?: string;
    planType?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: ProductionPlan[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/production/production-plans?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<ProductionPlan> {
    const response = await apiClient.get(`/production/production-plans/${id}`);
    return response.data;
  },

  async create(data: Partial<ProductionPlan>): Promise<ProductionPlan> {
    const response = await apiClient.post('/production/production-plans', data);
    return response.data;
  },

  async update(id: string, data: Partial<ProductionPlan>): Promise<ProductionPlan> {
    const response = await apiClient.put(`/production/production-plans/${id}`, data);
    return response.data;
  },

  async submit(id: string): Promise<ProductionPlan> {
    const response = await apiClient.post(`/production/production-plans/${id}/submit`);
    return response.data;
  },

  async approve(id: string): Promise<ProductionPlan> {
    const response = await apiClient.post(`/production/production-plans/${id}/approve`);
    return response.data;
  },

  async generateWorkOrders(id: string): Promise<WorkOrder[]> {
    const response = await apiClient.post(`/production/production-plans/${id}/generate-work-orders`);
    return response.data;
  },
};

// ============================================
// WORK ORDER API
// ============================================

export const workOrderApi = {
  async getAll(filters?: {
    status?: string;
    itemId?: string;
    salesOrderId?: string;
    fromDate?: string;
    toDate?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: WorkOrder[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/production/work-orders?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<WorkOrder> {
    const response = await apiClient.get(`/production/work-orders/${id}`);
    return response.data;
  },

  async create(data: {
    itemId: string;
    bomId?: string;
    routingId?: string;
    salesOrderId?: string;
    plannedQuantity: number;
    plannedStartDate: string;
    plannedEndDate: string;
    priority?: string;
  }): Promise<WorkOrder> {
    const response = await apiClient.post('/production/work-orders', data);
    return response.data;
  },

  async update(id: string, data: Partial<WorkOrder>): Promise<WorkOrder> {
    const response = await apiClient.put(`/production/work-orders/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/production/work-orders/${id}`);
  },

  async release(id: string): Promise<WorkOrder> {
    const response = await apiClient.post(`/production/work-orders/${id}/release`);
    return response.data;
  },

  async start(id: string): Promise<WorkOrder> {
    const response = await apiClient.post(`/production/work-orders/${id}/start`);
    return response.data;
  },

  async complete(id: string): Promise<WorkOrder> {
    const response = await apiClient.post(`/production/work-orders/${id}/complete`);
    return response.data;
  },

  async cancel(id: string, reason: string): Promise<WorkOrder> {
    const response = await apiClient.post(`/production/work-orders/${id}/cancel`, { reason });
    return response.data;
  },

  async hold(id: string, reason: string): Promise<WorkOrder> {
    const response = await apiClient.post(`/production/work-orders/${id}/hold`, { reason });
    return response.data;
  },

  async resume(id: string): Promise<WorkOrder> {
    const response = await apiClient.post(`/production/work-orders/${id}/resume`);
    return response.data;
  },
};

// ============================================
// PRODUCTION ENTRY API
// ============================================

export const productionEntryApi = {
  async getAll(filters?: {
    workOrderId?: string;
    operationId?: string;
    workCenterId?: string;
    operatorId?: string;
    fromDate?: string;
    toDate?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: ProductionEntry[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/production/production-entries?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<ProductionEntry> {
    const response = await apiClient.get(`/production/production-entries/${id}`);
    return response.data;
  },

  async create(data: {
    workOrderId: string;
    operationId: string;
    workCenterId: string;
    entryDate: string;
    operatorId: string;
    quantityProduced: number;
    quantityRejected?: number;
    startTime: string;
    endTime: string;
    setupTimeMinutes?: number;
    downtimeMinutes?: number;
    downtimeReason?: string;
    remarks?: string;
  }): Promise<ProductionEntry> {
    const response = await apiClient.post('/production/production-entries', data);
    return response.data;
  },

  async submit(id: string): Promise<ProductionEntry> {
    const response = await apiClient.post(`/production/production-entries/${id}/submit`);
    return response.data;
  },

  async approve(id: string): Promise<ProductionEntry> {
    const response = await apiClient.post(`/production/production-entries/${id}/approve`);
    return response.data;
  },

  async post(id: string): Promise<ProductionEntry> {
    const response = await apiClient.post(`/production/production-entries/${id}/post`);
    return response.data;
  },
};

// ============================================
// SHOP FLOOR API
// ============================================

export const shopFloorApi = {
  async getDashboard(): Promise<{
    workCenters: {
      total: number;
      available: number;
      busy: number;
      maintenance: number;
      breakdown: number;
    };
    workOrders: {
      total: number;
      inProgress: number;
      onHold: number;
      completed: number;
    };
    todayProduction: {
      planned: number;
      actual: number;
      efficiency: number;
    };
    alerts: {
      type: string;
      message: string;
      severity: 'low' | 'medium' | 'high';
      workOrderId?: string;
      workCenterId?: string;
    }[];
  }> {
    const response = await apiClient.get('/production/shop-floor-control/dashboard');
    return response.data;
  },

  async getWorkCenterStatus(): Promise<
    {
      workCenterId: string;
      workCenterCode: string;
      workCenterName: string;
      status: string;
      currentWorkOrder?: {
        workOrderNumber: string;
        itemName: string;
        operationName: string;
        progress: number;
      };
      operator?: {
        operatorId: string;
        operatorName: string;
      };
    }[]
  > {
    const response = await apiClient.get('/production/shop-floor-control/work-center-status');
    return response.data;
  },

  async getProductionSchedule(date: string): Promise<
    {
      workCenterId: string;
      workCenterName: string;
      schedule: {
        startTime: string;
        endTime: string;
        workOrderId: string;
        workOrderNumber: string;
        operationName: string;
        plannedQuantity: number;
      }[];
    }[]
  > {
    const response = await apiClient.get(
      `/production/shop-floor-control/schedule?date=${date}`,
    );
    return response.data;
  },
};

// Export all APIs as a single object
export const productionService = {
  workCenters: workCenterApi,
  operations: operationApi,
  bom: bomApi,
  routings: routingApi,
  productionPlans: productionPlanApi,
  workOrders: workOrderApi,
  productionEntries: productionEntryApi,
  shopFloor: shopFloorApi,
};

export default productionService;
