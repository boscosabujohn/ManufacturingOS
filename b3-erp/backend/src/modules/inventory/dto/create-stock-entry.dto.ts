import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsDateString,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StockEntryType } from '../entities/stock-entry.entity';

export class StockEntryLineDto {
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
  description?: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uom: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fromLocationId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  toLocationId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  batchId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  batchNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  serialNumberId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  serialNumber?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  rate?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  glAccountId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  remarks?: string;
}

export class CreateStockEntryDto {
  @ApiProperty({ enum: StockEntryType })
  @IsEnum(StockEntryType)
  @IsNotEmpty()
  entryType: StockEntryType;

  @ApiProperty({ description: 'Posting date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  postingDate: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  referenceType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  referenceId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fromWarehouseId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  toWarehouseId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  supplierId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  supplierName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiProperty({ type: [StockEntryLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockEntryLineDto)
  lines: StockEntryLineDto[];

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  additionalCosts?: number;

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
  vehicleNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lrNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  remarks?: string;
}
