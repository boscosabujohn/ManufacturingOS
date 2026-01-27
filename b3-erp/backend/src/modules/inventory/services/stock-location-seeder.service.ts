import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockLocation, LocationType, LocationStatus } from '../entities/stock-location.entity';
import { Warehouse } from '../entities/warehouse.entity';

interface LocationConfig {
  warehouseCode: string;
  zones: {
    zone: string;
    aisles: string[];
    racksPerAisle: number;
    binsPerRack: number;
    locationType: LocationType;
    maxCapacity: number;
  }[];
}

@Injectable()
export class StockLocationSeederService implements OnModuleInit {
  private readonly logger = new Logger(StockLocationSeederService.name);

  constructor(
    @InjectRepository(StockLocation)
    private readonly locationRepository: Repository<StockLocation>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {}

  async onModuleInit(): Promise<void> {
    // Delay to ensure warehouses are seeded first
    setTimeout(() => this.seedStockLocations(), 2000);
  }

  async seedStockLocations(): Promise<void> {
    this.logger.log('Seeding stock locations...');

    const locationConfigs: LocationConfig[] = [
      {
        warehouseCode: 'WH-MAIN',
        zones: [
          {
            zone: 'A',
            aisles: ['1', '2', '3'],
            racksPerAisle: 4,
            binsPerRack: 5,
            locationType: LocationType.BIN,
            maxCapacity: 100,
          },
          {
            zone: 'B',
            aisles: ['1', '2'],
            racksPerAisle: 3,
            binsPerRack: 4,
            locationType: LocationType.RACK,
            maxCapacity: 200,
          },
        ],
      },
      {
        warehouseCode: 'WH-RM',
        zones: [
          {
            zone: 'R',
            aisles: ['1', '2', '3', '4'],
            racksPerAisle: 5,
            binsPerRack: 6,
            locationType: LocationType.BIN,
            maxCapacity: 150,
          },
        ],
      },
      {
        warehouseCode: 'WH-FG',
        zones: [
          {
            zone: 'F',
            aisles: ['1', '2', '3'],
            racksPerAisle: 4,
            binsPerRack: 4,
            locationType: LocationType.PALLET,
            maxCapacity: 50,
          },
          {
            zone: 'G',
            aisles: ['1', '2'],
            racksPerAisle: 3,
            binsPerRack: 3,
            locationType: LocationType.SHELF,
            maxCapacity: 80,
          },
        ],
      },
      {
        warehouseCode: 'WH-WIP',
        zones: [
          {
            zone: 'W',
            aisles: ['1', '2'],
            racksPerAisle: 3,
            binsPerRack: 4,
            locationType: LocationType.STAGING,
            maxCapacity: 200,
          },
        ],
      },
      {
        warehouseCode: 'WH-QC',
        zones: [
          {
            zone: 'Q',
            aisles: ['1', '2'],
            racksPerAisle: 2,
            binsPerRack: 3,
            locationType: LocationType.QUARANTINE,
            maxCapacity: 100,
          },
        ],
      },
      {
        warehouseCode: 'WH-REJ',
        zones: [
          {
            zone: 'X',
            aisles: ['1'],
            racksPerAisle: 2,
            binsPerRack: 4,
            locationType: LocationType.FLOOR,
            maxCapacity: 300,
          },
        ],
      },
      {
        warehouseCode: 'WH-SPARE',
        zones: [
          {
            zone: 'S',
            aisles: ['1', '2', '3'],
            racksPerAisle: 6,
            binsPerRack: 8,
            locationType: LocationType.BIN,
            maxCapacity: 50,
          },
        ],
      },
    ];

    for (const config of locationConfigs) {
      await this.seedLocationsForWarehouse(config);
    }

    // Seed special locations for each warehouse
    await this.seedSpecialLocations();

    this.logger.log('Stock locations seeding completed');
  }

  private async seedLocationsForWarehouse(config: LocationConfig): Promise<void> {
    const warehouse = await this.warehouseRepository.findOne({
      where: { warehouseCode: config.warehouseCode },
    });

    if (!warehouse) {
      this.logger.warn(`Warehouse ${config.warehouseCode} not found, skipping locations`);
      return;
    }

    let sequence = 1;

    for (const zoneConfig of config.zones) {
      for (const aisle of zoneConfig.aisles) {
        for (let rack = 1; rack <= zoneConfig.racksPerAisle; rack++) {
          for (let bin = 1; bin <= zoneConfig.binsPerRack; bin++) {
            const locationCode = `${config.warehouseCode}-${zoneConfig.zone}${aisle}-${String(rack).padStart(2, '0')}-${String(bin).padStart(2, '0')}`;
            const locationName = `${warehouse.warehouseName} - Zone ${zoneConfig.zone}, Aisle ${aisle}, Rack ${rack}, Bin ${bin}`;

            try {
              const existing = await this.locationRepository.findOne({
                where: { locationCode },
              });

              if (!existing) {
                await this.locationRepository.save({
                  warehouseId: warehouse.id,
                  locationCode,
                  locationName,
                  locationType: zoneConfig.locationType,
                  status: LocationStatus.ACTIVE,
                  zone: zoneConfig.zone,
                  aisle: aisle,
                  rack: String(rack),
                  bin: String(bin).padStart(3, '0'),
                  level: 1,
                  maxCapacity: zoneConfig.maxCapacity,
                  currentCapacity: 0,
                  utilizationPercentage: 0,
                  pickingSequence: sequence,
                  putawaySequence: sequence,
                  isMixedItemAllowed: true,
                  isMixedBatchAllowed: false,
                  isFixedLocation: false,
                  isTemperatureControlled: false,
                  isHumidityControlled: false,
                  requiresCycleCount: true,
                  cycleCountFrequencyDays: 90,
                  createdBy: 'system',
                });
                sequence++;
              }
            } catch (error) {
              this.logger.error(`Failed to seed location ${locationCode}: ${error.message}`);
            }
          }
        }
      }
    }

    this.logger.log(`Created locations for warehouse: ${warehouse.warehouseName}`);
  }

  private async seedSpecialLocations(): Promise<void> {
    const warehouses = await this.warehouseRepository.find();

    const specialLocations = [
      { suffix: 'RECV', name: 'Receiving Area', type: LocationType.RECEIVING, capacity: 500 },
      { suffix: 'DISP', name: 'Dispatch Area', type: LocationType.DISPATCH, capacity: 500 },
      { suffix: 'STAGE', name: 'Staging Area', type: LocationType.STAGING, capacity: 300 },
    ];

    for (const warehouse of warehouses) {
      for (const special of specialLocations) {
        const locationCode = `${warehouse.warehouseCode}-${special.suffix}`;
        const locationName = `${warehouse.warehouseName} - ${special.name}`;

        try {
          const existing = await this.locationRepository.findOne({
            where: { locationCode },
          });

          if (!existing) {
            await this.locationRepository.save({
              warehouseId: warehouse.id,
              locationCode,
              locationName,
              locationType: special.type,
              status: LocationStatus.ACTIVE,
              maxCapacity: special.capacity,
              currentCapacity: 0,
              utilizationPercentage: 0,
              pickingSequence: 9999,
              putawaySequence: 9999,
              isMixedItemAllowed: true,
              isMixedBatchAllowed: true,
              isFixedLocation: false,
              isTemperatureControlled: false,
              isHumidityControlled: false,
              requiresCycleCount: false,
              createdBy: 'system',
            });
            this.logger.log(`Created special location: ${locationCode}`);
          }
        } catch (error) {
          this.logger.error(`Failed to seed special location ${locationCode}: ${error.message}`);
        }
      }
    }
  }
}
