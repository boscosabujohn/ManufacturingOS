import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse, WarehouseType, WarehouseStatus } from '../entities/warehouse.entity';

@Injectable()
export class WarehouseSeederService implements OnModuleInit {
  private readonly logger = new Logger(WarehouseSeederService.name);

  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedWarehouses();
  }

  async seedWarehouses(): Promise<void> {
    this.logger.log('Seeding warehouses...');

    const warehouses = [
      {
        warehouseCode: 'WH-MAIN',
        warehouseName: 'Main Warehouse',
        warehouseType: WarehouseType.MAIN,
        status: WarehouseStatus.ACTIVE,
        description: 'Primary storage warehouse for general inventory',
        addressLine1: 'Building A, Industrial Area',
        city: 'Manufacturing City',
        state: 'State',
        country: 'India',
        postalCode: '400001',
        allowNegativeStock: false,
        requiresBatchTracking: true,
        requiresSerialTracking: false,
        autoReplenishment: true,
        totalArea: 5000,
        areaUnit: 'sqm',
        storageCapacity: 10000,
        capacityUnit: 'units',
        currentUtilization: 0,
        facilities: ['Loading Dock', 'Forklift', 'CCTV', 'Fire Safety'],
        createdBy: 'system',
      },
      {
        warehouseCode: 'WH-RM',
        warehouseName: 'Raw Material Store',
        warehouseType: WarehouseType.BRANCH,
        status: WarehouseStatus.ACTIVE,
        description: 'Storage for raw materials and components',
        addressLine1: 'Building B, Industrial Area',
        city: 'Manufacturing City',
        state: 'State',
        country: 'India',
        postalCode: '400001',
        allowNegativeStock: false,
        requiresBatchTracking: true,
        requiresSerialTracking: false,
        autoReplenishment: true,
        totalArea: 3000,
        areaUnit: 'sqm',
        storageCapacity: 8000,
        capacityUnit: 'units',
        currentUtilization: 0,
        facilities: ['Loading Dock', 'Forklift', 'CCTV'],
        createdBy: 'system',
      },
      {
        warehouseCode: 'WH-FG',
        warehouseName: 'Finished Goods Store',
        warehouseType: WarehouseType.BRANCH,
        status: WarehouseStatus.ACTIVE,
        description: 'Storage for finished products ready for dispatch',
        addressLine1: 'Building C, Industrial Area',
        city: 'Manufacturing City',
        state: 'State',
        country: 'India',
        postalCode: '400001',
        allowNegativeStock: false,
        requiresBatchTracking: true,
        requiresSerialTracking: true,
        autoReplenishment: false,
        totalArea: 4000,
        areaUnit: 'sqm',
        storageCapacity: 6000,
        capacityUnit: 'units',
        currentUtilization: 0,
        facilities: ['Loading Dock', 'Forklift', 'CCTV', 'Climate Control'],
        createdBy: 'system',
      },
      {
        warehouseCode: 'WH-WIP',
        warehouseName: 'Work in Progress',
        warehouseType: WarehouseType.TRANSIT,
        status: WarehouseStatus.ACTIVE,
        description: 'Temporary storage for work-in-progress materials on production floor',
        addressLine1: 'Production Floor, Building D',
        city: 'Manufacturing City',
        state: 'State',
        country: 'India',
        postalCode: '400001',
        allowNegativeStock: true,
        requiresBatchTracking: true,
        requiresSerialTracking: false,
        autoReplenishment: false,
        totalArea: 2000,
        areaUnit: 'sqm',
        storageCapacity: 3000,
        capacityUnit: 'units',
        currentUtilization: 0,
        facilities: ['Forklift', 'CCTV'],
        createdBy: 'system',
      },
      {
        warehouseCode: 'WH-QC',
        warehouseName: 'QC Hold Area',
        warehouseType: WarehouseType.QUARANTINE,
        status: WarehouseStatus.ACTIVE,
        description: 'Quarantine area for materials pending quality inspection',
        addressLine1: 'QC Department, Building E',
        city: 'Manufacturing City',
        state: 'State',
        country: 'India',
        postalCode: '400001',
        allowNegativeStock: false,
        requiresBatchTracking: true,
        requiresSerialTracking: true,
        autoReplenishment: false,
        totalArea: 1000,
        areaUnit: 'sqm',
        storageCapacity: 2000,
        capacityUnit: 'units',
        currentUtilization: 0,
        facilities: ['Climate Control', 'CCTV', 'Lab Access'],
        createdBy: 'system',
      },
      {
        warehouseCode: 'WH-REJ',
        warehouseName: 'Rejection Store',
        warehouseType: WarehouseType.SCRAP,
        status: WarehouseStatus.ACTIVE,
        description: 'Storage for rejected and defective materials pending disposal',
        addressLine1: 'Scrap Yard, Building F',
        city: 'Manufacturing City',
        state: 'State',
        country: 'India',
        postalCode: '400001',
        allowNegativeStock: false,
        requiresBatchTracking: true,
        requiresSerialTracking: true,
        autoReplenishment: false,
        totalArea: 500,
        areaUnit: 'sqm',
        storageCapacity: 1000,
        capacityUnit: 'units',
        currentUtilization: 0,
        facilities: ['CCTV', 'Safety Equipment'],
        createdBy: 'system',
      },
      {
        warehouseCode: 'WH-SPARE',
        warehouseName: 'Spare Parts Store',
        warehouseType: WarehouseType.BRANCH,
        status: WarehouseStatus.ACTIVE,
        description: 'Storage for maintenance spare parts and consumables',
        addressLine1: 'Maintenance Building, Building G',
        city: 'Manufacturing City',
        state: 'State',
        country: 'India',
        postalCode: '400001',
        allowNegativeStock: false,
        requiresBatchTracking: false,
        requiresSerialTracking: true,
        autoReplenishment: true,
        totalArea: 800,
        areaUnit: 'sqm',
        storageCapacity: 5000,
        capacityUnit: 'units',
        currentUtilization: 0,
        facilities: ['CCTV', 'Tool Room'],
        createdBy: 'system',
      },
    ];

    for (const warehouse of warehouses) {
      try {
        const existing = await this.warehouseRepository.findOne({
          where: { warehouseCode: warehouse.warehouseCode },
        });
        if (!existing) {
          await this.warehouseRepository.save(warehouse);
          this.logger.log(`Created warehouse: ${warehouse.warehouseName}`);
        } else {
          this.logger.log(`Warehouse already exists: ${warehouse.warehouseName}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed warehouse ${warehouse.warehouseName}: ${error.message}`);
      }
    }

    this.logger.log('Warehouses seeding completed');
  }

  async getWarehouseByCode(code: string): Promise<Warehouse | null> {
    return this.warehouseRepository.findOne({
      where: { warehouseCode: code },
    });
  }
}
