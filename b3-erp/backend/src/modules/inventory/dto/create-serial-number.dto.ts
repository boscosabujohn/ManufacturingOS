import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSerialNumberDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  serialNumber: string;

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
  warehouseId?: string;

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
  purchaseOrderId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  supplierId?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  purchaseDate?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  purchasePrice?: number;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  manufacturingDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  manufacturerName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  modelNumber?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  warrantyStartDate?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  warrantyEndDate?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  remarks?: string;
}
