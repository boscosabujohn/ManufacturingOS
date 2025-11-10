import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStockBalanceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  warehouseId: string;

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
  availableQuantity: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  uom: string;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  valuationRate?: number;
}
