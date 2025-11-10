import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductionEntryType } from '../entities/production-entry.entity';

export class CreateProductionEntryDto {
  @ApiProperty({ description: 'Entry number', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  entryNumber: string;

  @ApiPropertyOptional({ description: 'Entry type', enum: ProductionEntryType })
  @IsEnum(ProductionEntryType)
  @IsOptional()
  entryType?: ProductionEntryType;

  @ApiProperty({ description: 'Posting date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  postingDate: string;

  @ApiProperty({ description: 'Work order ID' })
  @IsString()
  @IsNotEmpty()
  workOrderId: string;

  @ApiProperty({ description: 'Work order number' })
  @IsString()
  @IsNotEmpty()
  workOrderNumber: string;

  @ApiProperty({ description: 'Item ID' })
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({ description: 'Item code' })
  @IsString()
  @IsNotEmpty()
  itemCode: string;

  @ApiProperty({ description: 'Item name' })
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiPropertyOptional({ description: 'Operation ID' })
  @IsString()
  @IsOptional()
  operationId?: string;

  @ApiPropertyOptional({ description: 'Work center ID' })
  @IsString()
  @IsOptional()
  workCenterId?: string;

  @ApiProperty({ description: 'Quantity' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiPropertyOptional({ description: 'Accepted quantity' })
  @IsNumber()
  @IsOptional()
  acceptedQuantity?: number;

  @ApiPropertyOptional({ description: 'Rejected quantity' })
  @IsNumber()
  @IsOptional()
  rejectedQuantity?: number;

  @ApiPropertyOptional({ description: 'Scrap quantity' })
  @IsNumber()
  @IsOptional()
  scrapQuantity?: number;

  @ApiPropertyOptional({ description: 'Unit of measure' })
  @IsString()
  @IsOptional()
  uom?: string;

  @ApiPropertyOptional({ description: 'Target warehouse ID' })
  @IsString()
  @IsOptional()
  targetWarehouseId?: string;

  @ApiPropertyOptional({ description: 'Batch number' })
  @IsString()
  @IsOptional()
  batchNumber?: string;

  @ApiPropertyOptional({ description: 'Track serial numbers' })
  @IsBoolean()
  @IsOptional()
  trackSerialNumbers?: boolean;

  @ApiPropertyOptional({ description: 'Track batch numbers' })
  @IsBoolean()
  @IsOptional()
  trackBatchNumbers?: boolean;

  @ApiPropertyOptional({ description: 'Quality inspection required' })
  @IsBoolean()
  @IsOptional()
  qualityInspectionRequired?: boolean;

  @ApiPropertyOptional({ description: 'Operator ID' })
  @IsString()
  @IsOptional()
  operatorId?: string;

  @ApiPropertyOptional({ description: 'Operator name' })
  @IsString()
  @IsOptional()
  operatorName?: string;

  @ApiPropertyOptional({ description: 'Shift' })
  @IsString()
  @IsOptional()
  shift?: string;

  @ApiPropertyOptional({ description: 'Remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Custom fields' })
  @IsOptional()
  customFields?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Created by' })
  @IsString()
  @IsOptional()
  createdBy?: string;
}
