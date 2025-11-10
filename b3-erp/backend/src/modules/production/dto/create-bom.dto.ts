import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsBoolean,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BOMType, BOMStatus } from '../entities/bom.entity';

export class CreateBOMDto {
  @ApiProperty({ description: 'Unique BOM code', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  bomCode: string;

  @ApiProperty({ description: 'BOM name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  bomName: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Item ID' })
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({ description: 'Item code', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  itemCode: string;

  @ApiProperty({ description: 'Item name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiPropertyOptional({ description: 'BOM type', enum: BOMType })
  @IsEnum(BOMType)
  @IsOptional()
  bomType?: BOMType;

  @ApiPropertyOptional({ description: 'Version number' })
  @IsNumber()
  @IsOptional()
  version?: number;

  @ApiPropertyOptional({ description: 'Is default BOM' })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional({ description: 'Effective from date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  effectiveFrom?: string;

  @ApiPropertyOptional({ description: 'Effective to date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  effectiveTo?: string;

  @ApiPropertyOptional({ description: 'Quantity' })
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({ description: 'Unit of measure', maxLength: 50 })
  @IsString()
  @IsOptional()
  uom?: string;

  @ApiPropertyOptional({ description: 'Lead time in days' })
  @IsNumber()
  @IsOptional()
  leadTimeDays?: number;

  @ApiPropertyOptional({ description: 'Scrap percentage' })
  @IsNumber()
  @IsOptional()
  scrapPercentage?: number;

  @ApiPropertyOptional({ description: 'Batch size' })
  @IsNumber()
  @IsOptional()
  batchSize?: number;

  @ApiPropertyOptional({ description: 'Allow alternative items' })
  @IsBoolean()
  @IsOptional()
  allowAlternativeItems?: boolean;

  @ApiPropertyOptional({ description: 'Requires quality inspection' })
  @IsBoolean()
  @IsOptional()
  requiresQualityInspection?: boolean;

  @ApiPropertyOptional({ description: 'Default routing ID' })
  @IsString()
  @IsOptional()
  defaultRoutingId?: string;

  @ApiPropertyOptional({ description: 'Default routing code' })
  @IsString()
  @IsOptional()
  defaultRoutingCode?: string;

  @ApiPropertyOptional({ description: 'Drawing number' })
  @IsString()
  @IsOptional()
  drawingNumber?: string;

  @ApiPropertyOptional({ description: 'Revision' })
  @IsString()
  @IsOptional()
  revision?: string;

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
