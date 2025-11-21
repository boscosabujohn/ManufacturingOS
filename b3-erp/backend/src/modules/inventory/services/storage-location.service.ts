import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type StoreType =
  | 'raw_material'
  | 'wip'
  | 'finished_goods'
  | 'spare_parts'
  | 'consumables'
  | 'quarantine'
  | 'returns';

export type StorageCondition = 'ambient' | 'cold' | 'frozen' | 'hazmat' | 'controlled';
export type LocationStatus = 'active' | 'blocked' | 'reserved' | 'maintenance';

export interface StorageLocation {
  id: string;
  locationCode: string;
  name: string;
  warehouseId: string;
  warehouseName: string;
  storeType: StoreType;
  zone: string;
  aisle: string;
  rack: string;
  level: string;
  bin: string;
  storageCondition: StorageCondition;
  status: LocationStatus;
  capacity: {
    maxWeight: number;
    maxVolume: number;
    maxUnits: number;
    currentWeight: number;
    currentVolume: number;
    currentUnits: number;
  };
  restrictions: string[];
  allowedItemCategories: string[];
  pickingPriority: number;
  putawayPriority: number;
  isDefault: boolean;
  lastCountDate?: string;
  createdAt: string;
}

export interface StorageZone {
  id: string;
  zoneCode: string;
  name: string;
  warehouseId: string;
  storeType: StoreType;
  storageCondition: StorageCondition;
  locations: StorageLocation[];
  totalCapacity: number;
  usedCapacity: number;
  utilizationPercent: number;
}

export interface StoreTypeConfig {
  type: StoreType;
  name: string;
  description: string;
  defaultStorageCondition: StorageCondition;
  defaultRestrictions: string[];
  requiredApprovals: string[];
  autoReplenishment: boolean;
  fifoEnforced: boolean;
  lotTracking: boolean;
  serialTracking: boolean;
  qualityCheckRequired: boolean;
}

export interface LocationUtilization {
  locationId: string;
  locationCode: string;
  storeType: StoreType;
  weightUtilization: number;
  volumeUtilization: number;
  unitUtilization: number;
  overallUtilization: number;
  status: 'underutilized' | 'optimal' | 'near_capacity' | 'full';
}

export interface LocationSuggestion {
  locationId: string;
  locationCode: string;
  storeType: StoreType;
  score: number;
  reason: string;
  availableCapacity: {
    weight: number;
    volume: number;
    units: number;
  };
}

@Injectable()
export class StorageLocationService {
  private locations: StorageLocation[] = [];
  private zones: StorageZone[] = [];
  private storeTypeConfigs: StoreTypeConfig[] = [];

  constructor() {
    this.initializeStoreTypeConfigs();
    this.seedMockData();
  }

  private initializeStoreTypeConfigs(): void {
    this.storeTypeConfigs = [
      {
        type: 'raw_material',
        name: 'Raw Material Store',
        description: 'Storage for raw materials and components',
        defaultStorageCondition: 'ambient',
        defaultRestrictions: [],
        requiredApprovals: [],
        autoReplenishment: true,
        fifoEnforced: true,
        lotTracking: true,
        serialTracking: false,
        qualityCheckRequired: true,
      },
      {
        type: 'wip',
        name: 'Work-in-Progress Store',
        description: 'Storage for partially completed items',
        defaultStorageCondition: 'ambient',
        defaultRestrictions: ['production_only'],
        requiredApprovals: [],
        autoReplenishment: false,
        fifoEnforced: true,
        lotTracking: true,
        serialTracking: false,
        qualityCheckRequired: false,
      },
      {
        type: 'finished_goods',
        name: 'Finished Goods Store',
        description: 'Storage for completed products',
        defaultStorageCondition: 'ambient',
        defaultRestrictions: [],
        requiredApprovals: [],
        autoReplenishment: false,
        fifoEnforced: true,
        lotTracking: true,
        serialTracking: true,
        qualityCheckRequired: true,
      },
      {
        type: 'spare_parts',
        name: 'Spare Parts Store',
        description: 'Storage for maintenance spare parts',
        defaultStorageCondition: 'ambient',
        defaultRestrictions: ['maintenance_only'],
        requiredApprovals: [],
        autoReplenishment: true,
        fifoEnforced: false,
        lotTracking: false,
        serialTracking: true,
        qualityCheckRequired: false,
      },
      {
        type: 'consumables',
        name: 'Consumables Store',
        description: 'Storage for consumable items',
        defaultStorageCondition: 'ambient',
        defaultRestrictions: [],
        requiredApprovals: [],
        autoReplenishment: true,
        fifoEnforced: true,
        lotTracking: false,
        serialTracking: false,
        qualityCheckRequired: false,
      },
      {
        type: 'quarantine',
        name: 'Quarantine Store',
        description: 'Storage for items pending quality inspection',
        defaultStorageCondition: 'ambient',
        defaultRestrictions: ['quality_hold'],
        requiredApprovals: ['quality_manager'],
        autoReplenishment: false,
        fifoEnforced: false,
        lotTracking: true,
        serialTracking: true,
        qualityCheckRequired: true,
      },
      {
        type: 'returns',
        name: 'Returns Store',
        description: 'Storage for returned items',
        defaultStorageCondition: 'ambient',
        defaultRestrictions: ['inspection_required'],
        requiredApprovals: ['returns_manager'],
        autoReplenishment: false,
        fifoEnforced: false,
        lotTracking: true,
        serialTracking: true,
        qualityCheckRequired: true,
      },
    ];
  }

  async createLocation(location: Omit<StorageLocation, 'id' | 'createdAt'>): Promise<StorageLocation> {
    const newLocation: StorageLocation = {
      ...location,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    // Validate store type config
    const config = this.storeTypeConfigs.find(c => c.type === location.storeType);
    if (config) {
      newLocation.restrictions = [...new Set([...location.restrictions, ...config.defaultRestrictions])];
    }

    this.locations.push(newLocation);
    return newLocation;
  }

  async getLocationsByStoreType(storeType: StoreType): Promise<StorageLocation[]> {
    return this.locations.filter(l => l.storeType === storeType && l.status === 'active');
  }

  async getAvailableLocations(
    storeType: StoreType,
    requiredWeight: number,
    requiredVolume: number,
    requiredUnits: number
  ): Promise<LocationSuggestion[]> {
    const locations = this.locations.filter(l =>
      l.storeType === storeType &&
      l.status === 'active' &&
      (l.capacity.maxWeight - l.capacity.currentWeight) >= requiredWeight &&
      (l.capacity.maxVolume - l.capacity.currentVolume) >= requiredVolume &&
      (l.capacity.maxUnits - l.capacity.currentUnits) >= requiredUnits
    );

    const suggestions: LocationSuggestion[] = locations.map(loc => {
      // Calculate score based on utilization and priorities
      const utilization = this.calculateUtilization(loc);
      const score = (100 - utilization.overallUtilization) * 0.5 + loc.putawayPriority * 10;

      return {
        locationId: loc.id,
        locationCode: loc.locationCode,
        storeType: loc.storeType,
        score,
        reason: this.getSuggestionReason(loc, utilization),
        availableCapacity: {
          weight: loc.capacity.maxWeight - loc.capacity.currentWeight,
          volume: loc.capacity.maxVolume - loc.capacity.currentVolume,
          units: loc.capacity.maxUnits - loc.capacity.currentUnits,
        },
      };
    });

    return suggestions.sort((a, b) => b.score - a.score);
  }

  async getLocationUtilization(warehouseId?: string): Promise<LocationUtilization[]> {
    const filteredLocations = warehouseId
      ? this.locations.filter(l => l.warehouseId === warehouseId)
      : this.locations;

    return filteredLocations.map(loc => this.calculateUtilization(loc));
  }

  async getZoneUtilization(): Promise<StorageZone[]> {
    return this.zones.map(zone => {
      const zoneLocations = this.locations.filter(l => l.zone === zone.zoneCode);
      const totalCapacity = zoneLocations.reduce((sum, l) => sum + l.capacity.maxUnits, 0);
      const usedCapacity = zoneLocations.reduce((sum, l) => sum + l.capacity.currentUnits, 0);

      return {
        ...zone,
        locations: zoneLocations,
        totalCapacity,
        usedCapacity,
        utilizationPercent: totalCapacity > 0 ? Math.round((usedCapacity / totalCapacity) * 100) : 0,
      };
    });
  }

  async updateLocationCapacity(
    locationId: string,
    weight: number,
    volume: number,
    units: number,
    operation: 'add' | 'remove'
  ): Promise<StorageLocation> {
    const location = this.locations.find(l => l.id === locationId);
    if (!location) throw new Error(`Location ${locationId} not found`);

    if (operation === 'add') {
      location.capacity.currentWeight += weight;
      location.capacity.currentVolume += volume;
      location.capacity.currentUnits += units;
    } else {
      location.capacity.currentWeight = Math.max(0, location.capacity.currentWeight - weight);
      location.capacity.currentVolume = Math.max(0, location.capacity.currentVolume - volume);
      location.capacity.currentUnits = Math.max(0, location.capacity.currentUnits - units);
    }

    return location;
  }

  async blockLocation(locationId: string, reason: string): Promise<StorageLocation> {
    const location = this.locations.find(l => l.id === locationId);
    if (!location) throw new Error(`Location ${locationId} not found`);

    location.status = 'blocked';
    location.restrictions.push(`blocked:${reason}`);
    return location;
  }

  async unblockLocation(locationId: string): Promise<StorageLocation> {
    const location = this.locations.find(l => l.id === locationId);
    if (!location) throw new Error(`Location ${locationId} not found`);

    location.status = 'active';
    location.restrictions = location.restrictions.filter(r => !r.startsWith('blocked:'));
    return location;
  }

  async getStoreTypeConfig(storeType: StoreType): Promise<StoreTypeConfig | undefined> {
    return this.storeTypeConfigs.find(c => c.type === storeType);
  }

  async getStorageReport(): Promise<{
    totalLocations: number;
    byStoreType: Record<string, { count: number; utilization: number }>;
    byStatus: Record<string, number>;
    overallUtilization: number;
    nearCapacityLocations: number;
    emptyLocations: number;
  }> {
    const byStoreType: Record<string, { count: number; utilization: number }> = {};
    const byStatus: Record<string, number> = {};
    let totalUtilization = 0;
    let nearCapacity = 0;
    let empty = 0;

    for (const loc of this.locations) {
      if (!byStoreType[loc.storeType]) {
        byStoreType[loc.storeType] = { count: 0, utilization: 0 };
      }
      byStoreType[loc.storeType].count++;

      byStatus[loc.status] = (byStatus[loc.status] || 0) + 1;

      const utilization = this.calculateUtilization(loc);
      byStoreType[loc.storeType].utilization += utilization.overallUtilization;
      totalUtilization += utilization.overallUtilization;

      if (utilization.overallUtilization >= 80) nearCapacity++;
      if (utilization.overallUtilization === 0) empty++;
    }

    // Calculate averages
    for (const type of Object.keys(byStoreType)) {
      byStoreType[type].utilization = Math.round(byStoreType[type].utilization / byStoreType[type].count);
    }

    return {
      totalLocations: this.locations.length,
      byStoreType,
      byStatus,
      overallUtilization: this.locations.length > 0
        ? Math.round(totalUtilization / this.locations.length)
        : 0,
      nearCapacityLocations: nearCapacity,
      emptyLocations: empty,
    };
  }

  private calculateUtilization(location: StorageLocation): LocationUtilization {
    const weightUtil = location.capacity.maxWeight > 0
      ? (location.capacity.currentWeight / location.capacity.maxWeight) * 100
      : 0;
    const volumeUtil = location.capacity.maxVolume > 0
      ? (location.capacity.currentVolume / location.capacity.maxVolume) * 100
      : 0;
    const unitUtil = location.capacity.maxUnits > 0
      ? (location.capacity.currentUnits / location.capacity.maxUnits) * 100
      : 0;

    const overall = Math.max(weightUtil, volumeUtil, unitUtil);

    let status: LocationUtilization['status'];
    if (overall === 0) status = 'underutilized';
    else if (overall < 60) status = 'optimal';
    else if (overall < 90) status = 'near_capacity';
    else status = 'full';

    return {
      locationId: location.id,
      locationCode: location.locationCode,
      storeType: location.storeType,
      weightUtilization: Math.round(weightUtil),
      volumeUtilization: Math.round(volumeUtil),
      unitUtilization: Math.round(unitUtil),
      overallUtilization: Math.round(overall),
      status,
    };
  }

  private getSuggestionReason(location: StorageLocation, utilization: LocationUtilization): string {
    if (utilization.overallUtilization < 30) {
      return 'Low utilization - plenty of space available';
    }
    if (location.putawayPriority >= 8) {
      return 'High priority location for this store type';
    }
    if (location.isDefault) {
      return 'Default location for this item category';
    }
    return 'Available capacity within acceptable range';
  }

  private seedMockData(): void {
    const warehouseId = 'wh-001';

    // Create sample locations for each store type
    const storeTypes: StoreType[] = ['raw_material', 'wip', 'finished_goods', 'spare_parts', 'consumables', 'quarantine', 'returns'];

    storeTypes.forEach((storeType, typeIndex) => {
      for (let i = 1; i <= 3; i++) {
        const location: StorageLocation = {
          id: uuidv4(),
          locationCode: `${storeType.substring(0, 2).toUpperCase()}-${String(typeIndex + 1).padStart(2, '0')}-${String(i).padStart(3, '0')}`,
          name: `${this.storeTypeConfigs.find(c => c.type === storeType)?.name} Location ${i}`,
          warehouseId,
          warehouseName: 'Main Warehouse',
          storeType,
          zone: `ZONE-${String(typeIndex + 1).padStart(2, '0')}`,
          aisle: String.fromCharCode(65 + typeIndex),
          rack: String(i),
          level: '1',
          bin: '01',
          storageCondition: this.storeTypeConfigs.find(c => c.type === storeType)?.defaultStorageCondition || 'ambient',
          status: 'active',
          capacity: {
            maxWeight: 1000,
            maxVolume: 50,
            maxUnits: 500,
            currentWeight: Math.floor(Math.random() * 500),
            currentVolume: Math.floor(Math.random() * 25),
            currentUnits: Math.floor(Math.random() * 250),
          },
          restrictions: this.storeTypeConfigs.find(c => c.type === storeType)?.defaultRestrictions || [],
          allowedItemCategories: [],
          pickingPriority: 10 - i,
          putawayPriority: i,
          isDefault: i === 1,
          createdAt: new Date().toISOString(),
        };

        this.locations.push(location);
      }

      // Create zone
      this.zones.push({
        id: uuidv4(),
        zoneCode: `ZONE-${String(typeIndex + 1).padStart(2, '0')}`,
        name: `${this.storeTypeConfigs.find(c => c.type === storeType)?.name} Zone`,
        warehouseId,
        storeType,
        storageCondition: this.storeTypeConfigs.find(c => c.type === storeType)?.defaultStorageCondition || 'ambient',
        locations: [],
        totalCapacity: 0,
        usedCapacity: 0,
        utilizationPercent: 0,
      });
    });
  }
}
