import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsDateString,
  IsArray,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBatchNumberDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  batchNumber: string;

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
  @IsDateString()
  @IsOptional()
  manufacturingDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  manufacturerName?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  shelfLifeDays?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  purchaseOrderId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  supplierId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  supplierName?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  purchaseDate?: string;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @Type(() => Number)
  initialQuantity: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  uom: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  purchasePrice?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  storageInstructions?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  countryOfOrigin?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  remarks?: string;
}
