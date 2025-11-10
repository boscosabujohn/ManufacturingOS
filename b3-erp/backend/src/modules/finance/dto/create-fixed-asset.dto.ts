import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DepreciationMethod } from '../entities/fixed-asset.entity';

export class CreateFixedAssetDto {
  @ApiProperty({ description: 'Unique asset code', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  assetCode: string;

  @ApiProperty({ description: 'Asset name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  assetName: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Asset category', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  assetCategory: string;

  @ApiPropertyOptional({ description: 'Asset sub-category', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  assetSubCategory?: string;

  @ApiPropertyOptional({ description: 'GL account ID' })
  @IsString()
  @IsOptional()
  glAccountId?: string;

  @ApiProperty({ description: 'Acquisition date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  acquisitionDate: string;

  @ApiProperty({ description: 'Acquisition cost' })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  acquisitionCost: number;

  @ApiPropertyOptional({ description: 'Supplier', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  supplier?: string;

  @ApiPropertyOptional({ description: 'Invoice number' })
  @IsString()
  @IsOptional()
  invoiceNumber?: string;

  @ApiPropertyOptional({ description: 'PO number' })
  @IsString()
  @IsOptional()
  poNumber?: string;

  @ApiProperty({
    description: 'Depreciation method',
    enum: DepreciationMethod,
  })
  @IsEnum(DepreciationMethod)
  @IsNotEmpty()
  depreciationMethod: DepreciationMethod;

  @ApiProperty({ description: 'Useful life in years' })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  usefulLifeYears: number;

  @ApiPropertyOptional({ description: 'Useful life in months', default: 12 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  usefulLifeMonths?: number;

  @ApiPropertyOptional({ description: 'Depreciation rate (%)' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  depreciationRate?: number;

  @ApiPropertyOptional({ description: 'Salvage value', default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  salvageValue?: number;

  @ApiProperty({ description: 'Depreciation start date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  depreciationStartDate: string;

  @ApiPropertyOptional({ description: 'Location' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: 'Department' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ description: 'Cost center' })
  @IsString()
  @IsOptional()
  costCenter?: string;

  @ApiPropertyOptional({ description: 'Assigned to employee ID' })
  @IsString()
  @IsOptional()
  assignedToEmployeeId?: string;

  @ApiPropertyOptional({ description: 'Assigned to employee name' })
  @IsString()
  @IsOptional()
  assignedToEmployeeName?: string;

  @ApiPropertyOptional({ description: 'Manufacturer' })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiPropertyOptional({ description: 'Model' })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiPropertyOptional({ description: 'Serial number' })
  @IsString()
  @IsOptional()
  serialNumber?: string;

  @ApiPropertyOptional({ description: 'Barcode' })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiPropertyOptional({ description: 'Is depreciable', default: true })
  @IsBoolean()
  @IsOptional()
  isDepreciable?: boolean;

  @ApiPropertyOptional({ description: 'Warranty start date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  warrantyStartDate?: string;

  @ApiPropertyOptional({ description: 'Warranty end date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  warrantyEndDate?: string;

  @ApiPropertyOptional({ description: 'Warranty provider' })
  @IsString()
  @IsOptional()
  warrantyProvider?: string;

  @ApiPropertyOptional({ description: 'Is insured', default: false })
  @IsBoolean()
  @IsOptional()
  isInsured?: boolean;

  @ApiPropertyOptional({ description: 'Insurance provider' })
  @IsString()
  @IsOptional()
  insuranceProvider?: string;

  @ApiPropertyOptional({ description: 'Insurance policy number' })
  @IsString()
  @IsOptional()
  insurancePolicyNumber?: string;

  @ApiPropertyOptional({ description: 'Insurance expiry date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  insuranceExpiryDate?: string;

  @ApiPropertyOptional({ description: 'Insured value' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  insuredValue?: number;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}
