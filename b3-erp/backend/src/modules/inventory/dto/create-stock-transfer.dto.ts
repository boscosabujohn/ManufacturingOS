import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransferType } from '../entities/stock-transfer.entity';

export class StockTransferLineDto {
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

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  requestedQuantity: number;

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
  serialNumberId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  remarks?: string;
}

export class CreateStockTransferDto {
  @ApiProperty({ enum: TransferType })
  @IsEnum(TransferType)
  @IsNotEmpty()
  transferType: TransferType;

  @ApiProperty({ description: 'Transfer date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  transferDate: string;

  @ApiPropertyOptional({ description: 'Expected receipt date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  expectedReceiptDate?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fromWarehouseId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  toWarehouseId: string;

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
  referenceType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  referenceId?: string;

  @ApiProperty({ type: [StockTransferLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockTransferLineDto)
  lines: StockTransferLineDto[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  transporterName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  vehicleNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  purpose?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  remarks?: string;
}
