import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsArray,
  MaxLength,
  IsDateString,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeliveryNoteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  deliveryNoteNumber: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shipmentId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  salesOrderId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  customerAddress?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  customerCity?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contactPerson?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiProperty()
  @IsDateString()
  deliveryDate: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  warehouseId?: string;

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
  lrNumber?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  lrDate?: Date;

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

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  items: Array<{
    itemId: string;
    itemCode: string;
    itemName: string;
    quantity: number;
    unit: string;
  }>;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  termsAndConditions?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
