import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsArray,
  MaxLength,
  IsISO8601,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TripType } from '../entities/trip.entity';

export class CreateTripDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tripNumber: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @ApiProperty({ enum: TripType })
  @IsEnum(TripType)
  @IsOptional()
  tripType?: TripType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  driverId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  coDriverId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  routeId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  originName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  originAddress: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  originCity?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  destinationName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  destinationAddress: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  destinationCity?: string;

  @ApiProperty()
  @IsISO8601()
  plannedStartTime: Date;

  @ApiProperty()
  @IsISO8601()
  plannedEndTime: Date;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  estimatedDurationMinutes: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  plannedDistance: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  distanceUnit?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  loadWeight?: number;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  stops?: any[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
