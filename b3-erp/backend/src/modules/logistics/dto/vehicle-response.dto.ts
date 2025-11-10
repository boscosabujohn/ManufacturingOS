import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  VehicleStatus,
  VehicleType,
  OwnershipType,
  FuelType,
} from '../entities/vehicle.entity';

export class VehicleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  vehicleCode: string;

  @ApiProperty()
  registrationNumber: string;

  @ApiProperty()
  vehicleName: string;

  @ApiProperty({ enum: VehicleType })
  vehicleType: VehicleType;

  @ApiProperty({ enum: VehicleStatus })
  status: VehicleStatus;

  @ApiProperty({ enum: OwnershipType })
  ownershipType: OwnershipType;

  @ApiProperty()
  make: string;

  @ApiProperty()
  model: string;

  @ApiProperty()
  year: number;

  @ApiProperty({ enum: FuelType })
  fuelType: FuelType;

  @ApiProperty()
  loadCapacity: number;

  @ApiPropertyOptional()
  capacityUnit?: string;

  @ApiPropertyOptional()
  hasGpsTracking?: boolean;

  @ApiPropertyOptional()
  currentOdometerReading?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
