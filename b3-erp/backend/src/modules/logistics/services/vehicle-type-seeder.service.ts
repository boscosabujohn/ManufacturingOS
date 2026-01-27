import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Vehicle,
  VehicleType,
  VehicleStatus,
  OwnershipType,
  FuelType,
} from '../entities/vehicle.entity';

export interface VehicleTypeSeedData {
  vehicleCode: string;
  vehicleName: string;
  vehicleType: VehicleType;
  loadCapacity: number;
  capacityUnit: string;
  make: string;
  model: string;
  description?: string;
  fuelType: FuelType;
  averageFuelConsumption?: number;
}

@Injectable()
export class VehicleTypeSeederService implements OnModuleInit {
  private readonly logger = new Logger(VehicleTypeSeederService.name);

  // Vehicle type reference data with standard capacities
  private readonly vehicleTypes: VehicleTypeSeedData[] = [
    {
      vehicleCode: 'VT-BIKE',
      vehicleName: 'Delivery Bike',
      vehicleType: VehicleType.MOTORCYCLE,
      loadCapacity: 20,
      capacityUnit: 'KG',
      make: 'Standard',
      model: 'Delivery Motorcycle',
      description: 'Two-wheeler for small package and document deliveries in urban areas',
      fuelType: FuelType.PETROL,
      averageFuelConsumption: 45, // km per liter
    },
    {
      vehicleCode: 'VT-VAN',
      vehicleName: 'Delivery Van',
      vehicleType: VehicleType.VAN,
      loadCapacity: 500,
      capacityUnit: 'KG',
      make: 'Maruti',
      model: 'Eeco Cargo',
      description: 'Small cargo van for local deliveries and urban distribution',
      fuelType: FuelType.PETROL,
      averageFuelConsumption: 15,
    },
    {
      vehicleCode: 'VT-TATA407',
      vehicleName: 'Tata 407',
      vehicleType: VehicleType.TRUCK,
      loadCapacity: 2500,
      capacityUnit: 'KG',
      make: 'Tata',
      model: '407 SFC',
      description: 'Light commercial vehicle for medium-distance goods transportation',
      fuelType: FuelType.DIESEL,
      averageFuelConsumption: 12,
    },
    {
      vehicleCode: 'VT-14FT',
      vehicleName: '14ft Container',
      vehicleType: VehicleType.CONTAINER,
      loadCapacity: 7000,
      capacityUnit: 'KG',
      make: 'Tata',
      model: '14ft Container Truck',
      description: '14-foot containerized truck for regional freight transportation',
      fuelType: FuelType.DIESEL,
      averageFuelConsumption: 8,
    },
    {
      vehicleCode: 'VT-20FT',
      vehicleName: '20ft Container',
      vehicleType: VehicleType.CONTAINER,
      loadCapacity: 20000,
      capacityUnit: 'KG',
      make: 'Ashok Leyland',
      model: '20ft Container Truck',
      description: '20-foot containerized truck for long-haul freight and full-truck loads',
      fuelType: FuelType.DIESEL,
      averageFuelConsumption: 5,
    },
    {
      vehicleCode: 'VT-TRAILER',
      vehicleName: 'Trailer',
      vehicleType: VehicleType.TRAILER,
      loadCapacity: 30000,
      capacityUnit: 'KG',
      make: 'Bharat Benz',
      model: 'Heavy Duty Trailer',
      description: 'Heavy-duty trailer for bulk cargo and long-distance transportation',
      fuelType: FuelType.DIESEL,
      averageFuelConsumption: 3.5,
    },
  ];

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seed();
  }

  async seed(): Promise<void> {
    this.logger.log('Starting vehicle type reference seeding...');

    for (const vehicleTypeData of this.vehicleTypes) {
      try {
        const existingVehicle = await this.vehicleRepository.findOne({
          where: { vehicleCode: vehicleTypeData.vehicleCode },
        });

        if (existingVehicle) {
          this.logger.debug(
            `Vehicle type ${vehicleTypeData.vehicleCode} already exists, skipping...`,
          );
          continue;
        }

        // Create reference vehicle entry for this vehicle type
        const now = new Date();
        const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

        const vehicle = this.vehicleRepository.create({
          ...vehicleTypeData,
          registrationNumber: `REF-${vehicleTypeData.vehicleCode}`,
          status: VehicleStatus.ACTIVE,
          ownershipType: OwnershipType.OWN,
          year: now.getFullYear(),
          color: 'White',
          // Registration and insurance (reference dates)
          registrationDate: now,
          registrationExpiryDate: nextYear,
          // Default dimensions based on vehicle type
          ...this.getDefaultDimensions(vehicleTypeData.vehicleType),
          dimensionUnit: 'meters',
          // Tracking capabilities
          hasGpsTracking: true,
          // Features based on vehicle type
          hasRefrigeration: false,
          hasTailLift: vehicleTypeData.vehicleType === VehicleType.CONTAINER ||
                       vehicleTypeData.vehicleType === VehicleType.TRAILER,
          hasSecuritySystem: vehicleTypeData.loadCapacity >= 7000,
          // Financial (reference values)
          currency: 'INR',
          // Maintenance defaults
          currentOdometerReading: 0,
          serviceIntervalKm: this.getServiceInterval(vehicleTypeData.vehicleType),
          // Audit
          createdBy: 'system',
        });

        await this.vehicleRepository.save(vehicle);
        this.logger.log(
          `Created vehicle type reference: ${vehicleTypeData.vehicleCode} - ${vehicleTypeData.vehicleName} (${vehicleTypeData.loadCapacity} ${vehicleTypeData.capacityUnit})`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to seed vehicle type ${vehicleTypeData.vehicleCode}: ${error.message}`,
        );
      }
    }

    this.logger.log('Vehicle type reference seeding completed.');
  }

  private getDefaultDimensions(vehicleType: VehicleType): { length?: number; width?: number; height?: number } {
    switch (vehicleType) {
      case VehicleType.MOTORCYCLE:
        return { length: 2.0, width: 0.8, height: 1.2 };
      case VehicleType.VAN:
        return { length: 4.0, width: 1.7, height: 1.8 };
      case VehicleType.TRUCK:
        return { length: 5.5, width: 2.2, height: 2.2 };
      case VehicleType.CONTAINER:
        return { length: 6.1, width: 2.4, height: 2.6 }; // 20ft standard
      case VehicleType.TRAILER:
        return { length: 12.2, width: 2.4, height: 2.9 };
      default:
        return { length: 5.0, width: 2.0, height: 2.0 };
    }
  }

  private getServiceInterval(vehicleType: VehicleType): number {
    switch (vehicleType) {
      case VehicleType.MOTORCYCLE:
        return 3000;
      case VehicleType.VAN:
        return 10000;
      case VehicleType.TRUCK:
      case VehicleType.CONTAINER:
        return 15000;
      case VehicleType.TRAILER:
        return 20000;
      default:
        return 10000;
    }
  }

  async getVehicleTypeByCode(code: string): Promise<Vehicle | null> {
    return this.vehicleRepository.findOne({
      where: { vehicleCode: code },
    });
  }

  async getAllVehicleTypes(): Promise<Vehicle[]> {
    const codes = this.vehicleTypes.map((v) => v.vehicleCode);
    return this.vehicleRepository
      .createQueryBuilder('v')
      .where('v.vehicleCode IN (:...codes)', { codes })
      .orderBy('v.loadCapacity', 'ASC')
      .getMany();
  }

  // Get reference data without database lookup
  getVehicleTypeDefinitions(): VehicleTypeSeedData[] {
    return [...this.vehicleTypes];
  }

  // Get capacity for a specific vehicle type code
  getCapacityByCode(code: string): number | null {
    const vehicleType = this.vehicleTypes.find((v) => v.vehicleCode === code);
    return vehicleType?.loadCapacity ?? null;
  }

  // Find appropriate vehicle type for a given weight
  findVehicleTypeForWeight(weightKg: number): VehicleTypeSeedData | null {
    // Sort by capacity ascending and find the smallest that can handle the weight
    const sorted = [...this.vehicleTypes].sort((a, b) => a.loadCapacity - b.loadCapacity);
    return sorted.find((v) => v.loadCapacity >= weightKg) ?? null;
  }
}
