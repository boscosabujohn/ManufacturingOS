import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  MaxLength,
  IsDateString,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ShipmentType,
  ShipmentMode,
  ShipmentPriority,
} from '../entities/shipment.entity';

export class CreateShipmentItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  itemCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  itemDescription?: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  orderedQuantity: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  shippedQuantity: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  batchNumber?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  serialNumbers?: string[];
}

export class CreateShipmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  shipmentNumber: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(100)
  referenceNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(100)
  trackingNumber?: string;

  @ApiProperty({ enum: ShipmentType })
  @IsEnum(ShipmentType)
  @IsOptional()
  shipmentType?: ShipmentType;

  @ApiProperty({ enum: ShipmentPriority })
  @IsEnum(ShipmentPriority)
  @IsOptional()
  priority?: ShipmentPriority;

  @ApiProperty({ enum: ShipmentMode })
  @IsEnum(ShipmentMode)
  @IsOptional()
  shipmentMode?: ShipmentMode;

  // Origin Information
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  originType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  originId?: string;

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

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  originState?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  originPostalCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  originCountry?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  originContactPerson?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  originContactPhone?: string;

  // Destination Information
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  destinationType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  destinationId?: string;

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

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  destinationState?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  destinationPostalCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  destinationCountry?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  destinationContactPerson?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  destinationContactPhone?: string;

  // References
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  salesOrderId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  purchaseOrderId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  transportCompanyId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  vehicleId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  driverId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  routeId?: string;

  // Package Details
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  totalPackages?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  totalWeight?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  weightUnit?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  declaredValue?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  currency?: string;

  // Dates
  @ApiPropertyOptional()
  @IsISO8601()
  @IsOptional()
  plannedPickupDate?: Date;

  @ApiPropertyOptional()
  @IsISO8601()
  @IsOptional()
  plannedDeliveryDate?: Date;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  estimatedDistance?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  estimatedDurationMinutes?: number;

  // Special Handling
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isFragile?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPerishable?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  requiresRefrigeration?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isHazardous?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  requiresInsurance?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  specialInstructions?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ type: [CreateShipmentItemDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateShipmentItemDto)
  items?: CreateShipmentItemDto[];
}
