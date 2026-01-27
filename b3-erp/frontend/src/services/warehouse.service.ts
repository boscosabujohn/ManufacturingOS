import { apiClient } from './api/client';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export enum WarehouseStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

export enum WarehouseType {
  RAW_MATERIAL = 'RAW_MATERIAL',
  FINISHED_GOODS = 'FINISHED_GOODS',
  WIP = 'WIP',
  SPARE_PARTS = 'SPARE_PARTS',
  GENERAL = 'GENERAL',
  COLD_STORAGE = 'COLD_STORAGE',
}

export interface WarehouseLocation {
  id: string;
  warehouseId: string;
  code: string;
  name: string;
  zone: string;
  aisle?: string;
  rack?: string;
  shelf?: string;
  bin?: string;
  capacity: number;
  usedCapacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: WarehouseType;
  status: WarehouseStatus;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  totalCapacity: number;
  usedCapacity: number;
  capacityUom: string;
  isDefault: boolean;
  managerId?: string;
  managerName?: string;
  operatingHours?: {
    start: string;
    end: string;
    days: string[];
  };
  locations?: WarehouseLocation[];
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseStockSummary {
  warehouseId: string;
  warehouseName: string;
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  topCategories: {
    category: string;
    itemCount: number;
    value: number;
  }[];
  recentMovements: {
    type: 'IN' | 'OUT' | 'TRANSFER';
    count: number;
    date: string;
  }[];
}

export interface CapacityUtilization {
  warehouseId: string;
  warehouseName: string;
  totalCapacity: number;
  usedCapacity: number;
  availableCapacity: number;
  utilizationPercentage: number;
  trend: 'INCREASING' | 'DECREASING' | 'STABLE';
}

export interface CreateWarehouseDto {
  code: string;
  name: string;
  description?: string;
  type: WarehouseType;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  totalCapacity: number;
  capacityUom: string;
  isDefault?: boolean;
  managerId?: string;
  operatingHours?: {
    start: string;
    end: string;
    days: string[];
  };
}

export interface UpdateWarehouseDto extends Partial<CreateWarehouseDto> {}

export interface WarehouseFilters {
  status?: WarehouseStatus;
  type?: WarehouseType;
  search?: string;
  city?: string;
  managerId?: string;
}

// ============================================================================
// Mock Data
// ============================================================================

const USE_MOCK_DATA = true;

const MOCK_WAREHOUSE_LOCATIONS: WarehouseLocation[] = [
  {
    id: 'loc-1',
    warehouseId: 'wh-1',
    code: 'A-01-01',
    name: 'Zone A, Aisle 1, Rack 1',
    zone: 'A',
    aisle: '01',
    rack: '01',
    capacity: 500,
    usedCapacity: 320,
    isActive: true,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
  },
  {
    id: 'loc-2',
    warehouseId: 'wh-1',
    code: 'A-01-02',
    name: 'Zone A, Aisle 1, Rack 2',
    zone: 'A',
    aisle: '01',
    rack: '02',
    capacity: 500,
    usedCapacity: 450,
    isActive: true,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
  },
  {
    id: 'loc-3',
    warehouseId: 'wh-1',
    code: 'B-02-01',
    name: 'Zone B, Aisle 2, Rack 1',
    zone: 'B',
    aisle: '02',
    rack: '01',
    capacity: 750,
    usedCapacity: 200,
    isActive: true,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
  },
];

export const MOCK_WAREHOUSES: Warehouse[] = [
  {
    id: 'wh-1',
    code: 'WH-MAIN',
    name: 'Main Distribution Center',
    description: 'Primary warehouse for finished goods storage and distribution',
    type: WarehouseType.FINISHED_GOODS,
    status: WarehouseStatus.ACTIVE,
    address: {
      street: '123 Industrial Blvd',
      city: 'Houston',
      state: 'Texas',
      country: 'USA',
      postalCode: '77001',
    },
    contactPerson: 'John Smith',
    contactPhone: '+1-555-0101',
    contactEmail: 'john.smith@manufacturing.com',
    totalCapacity: 50000,
    usedCapacity: 35000,
    capacityUom: 'sqft',
    isDefault: true,
    managerId: 'emp-101',
    managerName: 'John Smith',
    operatingHours: {
      start: '06:00',
      end: '22:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    createdAt: '2023-01-10T08:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
  },
  {
    id: 'wh-2',
    code: 'WH-RAW',
    name: 'Raw Materials Warehouse',
    description: 'Storage facility for raw materials and components',
    type: WarehouseType.RAW_MATERIAL,
    status: WarehouseStatus.ACTIVE,
    address: {
      street: '456 Manufacturing Way',
      city: 'Houston',
      state: 'Texas',
      country: 'USA',
      postalCode: '77002',
    },
    contactPerson: 'Sarah Johnson',
    contactPhone: '+1-555-0102',
    contactEmail: 'sarah.johnson@manufacturing.com',
    totalCapacity: 30000,
    usedCapacity: 22500,
    capacityUom: 'sqft',
    isDefault: false,
    managerId: 'emp-102',
    managerName: 'Sarah Johnson',
    operatingHours: {
      start: '07:00',
      end: '19:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    createdAt: '2023-02-15T08:00:00Z',
    updatedAt: '2024-01-18T14:20:00Z',
  },
  {
    id: 'wh-3',
    code: 'WH-WIP',
    name: 'Work-in-Progress Storage',
    description: 'Temporary storage for items in production',
    type: WarehouseType.WIP,
    status: WarehouseStatus.ACTIVE,
    address: {
      street: '789 Production Lane',
      city: 'Houston',
      state: 'Texas',
      country: 'USA',
      postalCode: '77003',
    },
    contactPerson: 'Mike Brown',
    contactPhone: '+1-555-0103',
    contactEmail: 'mike.brown@manufacturing.com',
    totalCapacity: 15000,
    usedCapacity: 12000,
    capacityUom: 'sqft',
    isDefault: false,
    managerId: 'emp-103',
    managerName: 'Mike Brown',
    operatingHours: {
      start: '00:00',
      end: '23:59',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    createdAt: '2023-03-20T08:00:00Z',
    updatedAt: '2024-01-15T09:45:00Z',
  },
  {
    id: 'wh-4',
    code: 'WH-SPARE',
    name: 'Spare Parts Warehouse',
    description: 'Storage for maintenance and spare parts',
    type: WarehouseType.SPARE_PARTS,
    status: WarehouseStatus.ACTIVE,
    address: {
      street: '321 Maintenance Drive',
      city: 'Dallas',
      state: 'Texas',
      country: 'USA',
      postalCode: '75201',
    },
    contactPerson: 'Emily Davis',
    contactPhone: '+1-555-0104',
    contactEmail: 'emily.davis@manufacturing.com',
    totalCapacity: 10000,
    usedCapacity: 6500,
    capacityUom: 'sqft',
    isDefault: false,
    managerId: 'emp-104',
    managerName: 'Emily Davis',
    operatingHours: {
      start: '08:00',
      end: '18:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    createdAt: '2023-04-05T08:00:00Z',
    updatedAt: '2024-01-10T11:30:00Z',
  },
  {
    id: 'wh-5',
    code: 'WH-COLD',
    name: 'Cold Storage Facility',
    description: 'Temperature-controlled storage for sensitive materials',
    type: WarehouseType.COLD_STORAGE,
    status: WarehouseStatus.MAINTENANCE,
    address: {
      street: '555 Cold Chain Ave',
      city: 'Austin',
      state: 'Texas',
      country: 'USA',
      postalCode: '73301',
    },
    contactPerson: 'Robert Wilson',
    contactPhone: '+1-555-0105',
    contactEmail: 'robert.wilson@manufacturing.com',
    totalCapacity: 8000,
    usedCapacity: 0,
    capacityUom: 'sqft',
    isDefault: false,
    managerId: 'emp-105',
    managerName: 'Robert Wilson',
    operatingHours: {
      start: '00:00',
      end: '23:59',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    createdAt: '2023-05-12T08:00:00Z',
    updatedAt: '2024-01-22T08:00:00Z',
  },
  {
    id: 'wh-6',
    code: 'WH-GEN',
    name: 'General Storage Annex',
    description: 'General purpose overflow storage facility',
    type: WarehouseType.GENERAL,
    status: WarehouseStatus.INACTIVE,
    address: {
      street: '999 Storage Road',
      city: 'San Antonio',
      state: 'Texas',
      country: 'USA',
      postalCode: '78201',
    },
    contactPerson: 'Lisa Martinez',
    contactPhone: '+1-555-0106',
    contactEmail: 'lisa.martinez@manufacturing.com',
    totalCapacity: 20000,
    usedCapacity: 0,
    capacityUom: 'sqft',
    isDefault: false,
    managerId: 'emp-106',
    managerName: 'Lisa Martinez',
    operatingHours: {
      start: '08:00',
      end: '17:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    createdAt: '2023-06-01T08:00:00Z',
    updatedAt: '2024-01-05T16:15:00Z',
  },
];

// ============================================================================
// Warehouse Service
// ============================================================================

class WarehouseService {
  private simulateDelay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get all warehouses with optional filters
   */
  async getAllWarehouses(filters?: WarehouseFilters): Promise<Warehouse[]> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      let result = [...MOCK_WAREHOUSES];

      if (filters?.status) {
        result = result.filter((w) => w.status === filters.status);
      }
      if (filters?.type) {
        result = result.filter((w) => w.type === filters.type);
      }
      if (filters?.city) {
        result = result.filter((w) => w.address.city.toLowerCase() === filters.city!.toLowerCase());
      }
      if (filters?.managerId) {
        result = result.filter((w) => w.managerId === filters.managerId);
      }
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(
          (w) =>
            w.name.toLowerCase().includes(searchLower) ||
            w.code.toLowerCase().includes(searchLower) ||
            w.description?.toLowerCase().includes(searchLower)
        );
      }

      return result;
    }

    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.managerId) params.append('managerId', filters.managerId);

    const response = await apiClient.get<Warehouse[]>(`/inventory/warehouses?${params.toString()}`);
    return response.data || [];
  }

  /**
   * Get warehouse by ID
   */
  async getWarehouseById(id: string): Promise<Warehouse> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay(200);
      const warehouse = MOCK_WAREHOUSES.find((w) => w.id === id);
      if (!warehouse) {
        throw new Error('Warehouse not found');
      }
      return { ...warehouse };
    }

    const response = await apiClient.get<Warehouse>(`/inventory/warehouses/${id}`);
    return response.data;
  }

  /**
   * Get all active warehouses
   */
  async getActiveWarehouses(): Promise<Warehouse[]> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      return MOCK_WAREHOUSES.filter((w) => w.status === WarehouseStatus.ACTIVE);
    }

    const response = await apiClient.get<Warehouse[]>('/inventory/warehouses/active');
    return response.data || [];
  }

  /**
   * Get capacity utilization for all warehouses
   */
  async getCapacityUtilization(): Promise<CapacityUtilization[]> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      return MOCK_WAREHOUSES.map((w) => {
        const utilizationPercentage = (w.usedCapacity / w.totalCapacity) * 100;
        let trend: 'INCREASING' | 'DECREASING' | 'STABLE' = 'STABLE';
        if (utilizationPercentage > 70) trend = 'INCREASING';
        else if (utilizationPercentage < 30) trend = 'DECREASING';

        return {
          warehouseId: w.id,
          warehouseName: w.name,
          totalCapacity: w.totalCapacity,
          usedCapacity: w.usedCapacity,
          availableCapacity: w.totalCapacity - w.usedCapacity,
          utilizationPercentage: Math.round(utilizationPercentage * 100) / 100,
          trend,
        };
      });
    }

    const response = await apiClient.get<CapacityUtilization[]>('/inventory/warehouses/capacity-utilization');
    return response.data || [];
  }

  /**
   * Get locations for a specific warehouse
   */
  async getWarehouseLocations(warehouseId: string): Promise<WarehouseLocation[]> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      return MOCK_WAREHOUSE_LOCATIONS.filter((loc) => loc.warehouseId === warehouseId);
    }

    const response = await apiClient.get<WarehouseLocation[]>(`/inventory/warehouses/${warehouseId}/locations`);
    return response.data || [];
  }

  /**
   * Get stock summary for a specific warehouse
   */
  async getWarehouseStockSummary(warehouseId: string): Promise<WarehouseStockSummary> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      const warehouse = MOCK_WAREHOUSES.find((w) => w.id === warehouseId);
      if (!warehouse) {
        throw new Error('Warehouse not found');
      }

      return {
        warehouseId: warehouse.id,
        warehouseName: warehouse.name,
        totalItems: Math.floor(Math.random() * 500) + 100,
        totalValue: Math.floor(Math.random() * 500000) + 50000,
        lowStockItems: Math.floor(Math.random() * 20) + 5,
        outOfStockItems: Math.floor(Math.random() * 5),
        topCategories: [
          { category: 'Electronics', itemCount: 85, value: 125000 },
          { category: 'Mechanical Parts', itemCount: 120, value: 98000 },
          { category: 'Raw Materials', itemCount: 200, value: 75000 },
        ],
        recentMovements: [
          { type: 'IN', count: 45, date: new Date().toISOString() },
          { type: 'OUT', count: 38, date: new Date().toISOString() },
          { type: 'TRANSFER', count: 12, date: new Date().toISOString() },
        ],
      };
    }

    const response = await apiClient.get<WarehouseStockSummary>(`/inventory/warehouses/${warehouseId}/stock-summary`);
    return response.data;
  }

  /**
   * Create a new warehouse
   */
  async createWarehouse(data: CreateWarehouseDto): Promise<Warehouse> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay(500);
      const newWarehouse = {
        id: `wh-${Date.now()}`,
        ...data,
        status: WarehouseStatus.ACTIVE,
        usedCapacity: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Warehouse;
      MOCK_WAREHOUSES.push(newWarehouse);
      return newWarehouse;
    }

    const response = await apiClient.post<Warehouse>('/inventory/warehouses', data);
    return response.data;
  }

  /**
   * Update an existing warehouse
   */
  async updateWarehouse(id: string, data: UpdateWarehouseDto): Promise<Warehouse> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay(500);
      const index = MOCK_WAREHOUSES.findIndex((w) => w.id === id);
      if (index === -1) {
        throw new Error('Warehouse not found');
      }

      MOCK_WAREHOUSES[index] = {
        ...MOCK_WAREHOUSES[index],
        ...data,
        address: data.address ? { ...MOCK_WAREHOUSES[index].address, ...data.address } : MOCK_WAREHOUSES[index].address,
        updatedAt: new Date().toISOString(),
      };
      return MOCK_WAREHOUSES[index];
    }

    const response = await apiClient.put<Warehouse>(`/inventory/warehouses/${id}`, data);
    return response.data;
  }

  /**
   * Activate a warehouse
   */
  async activateWarehouse(id: string): Promise<Warehouse> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay(300);
      const index = MOCK_WAREHOUSES.findIndex((w) => w.id === id);
      if (index === -1) {
        throw new Error('Warehouse not found');
      }

      MOCK_WAREHOUSES[index] = {
        ...MOCK_WAREHOUSES[index],
        status: WarehouseStatus.ACTIVE,
        updatedAt: new Date().toISOString(),
      };
      return MOCK_WAREHOUSES[index];
    }

    const response = await apiClient.post<Warehouse>(`/inventory/warehouses/${id}/activate`, {});
    return response.data;
  }

  /**
   * Deactivate a warehouse
   */
  async deactivateWarehouse(id: string): Promise<Warehouse> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay(300);
      const index = MOCK_WAREHOUSES.findIndex((w) => w.id === id);
      if (index === -1) {
        throw new Error('Warehouse not found');
      }

      MOCK_WAREHOUSES[index] = {
        ...MOCK_WAREHOUSES[index],
        status: WarehouseStatus.INACTIVE,
        updatedAt: new Date().toISOString(),
      };
      return MOCK_WAREHOUSES[index];
    }

    const response = await apiClient.post<Warehouse>(`/inventory/warehouses/${id}/deactivate`, {});
    return response.data;
  }
}

export const warehouseService = new WarehouseService();
