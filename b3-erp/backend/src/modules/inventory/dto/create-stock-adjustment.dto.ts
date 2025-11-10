import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdjustmentType } from '../entities/stock-adjustment.entity';

export class StockAdjustmentLineDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lineNumber: number;

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
  locationId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  batchId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  serialNumberId?: string;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @Type(() => Number)
  systemQuantity: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  physicalQuantity: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uom: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  adjustmentReason?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  remarks?: string;
}

export class CreateStockAdjustmentDto {
  @ApiProperty({ enum: AdjustmentType })
  @IsEnum(AdjustmentType)
  @IsNotEmpty()
  adjustmentType: AdjustmentType;

  @ApiProperty({ description: 'Adjustment date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  adjustmentDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  warehouseId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  locationId?: string;

  @ApiProperty({ type: [StockAdjustmentLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockAdjustmentLineDto)
  lines: StockAdjustmentLineDto[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  justification?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  costCenterId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  remarks?: string;
}
