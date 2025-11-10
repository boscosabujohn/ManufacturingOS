import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsArray,
  MaxLength,
  IsDateString,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  VehicleType,
  OwnershipType,
  FuelType,
} from '../entities/vehicle.entity';

export class CreateVehicleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  vehicleCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  registrationNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vehicleName: string;

  @ApiProperty({ enum: VehicleType })
  @IsEnum(VehicleType)
  @IsOptional()
  vehicleType?: VehicleType;

  @ApiProperty({ enum: OwnershipType })
  @IsEnum(OwnershipType)
  @IsOptional()
  ownershipType?: OwnershipType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  make: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  year: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ enum: FuelType })
  @IsEnum(FuelType)
  @IsOptional()
  fuelType?: FuelType;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  loadCapacity: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  capacityUnit?: string;

  @ApiProperty()
  @IsDateString()
  registrationDate: Date;

  @ApiProperty()
  @IsDateString()
  registrationExpiryDate: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  insuranceCompany?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  insurancePolicyNumber?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  insuranceExpiryDate?: Date;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  hasGpsTracking?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  gpsDeviceId?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  currentOdometerReading?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  transportCompanyId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  currentDriverId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
