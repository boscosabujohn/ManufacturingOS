import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AssetStatus,
  DepreciationMethod,
} from '../entities/fixed-asset.entity';

export class FixedAssetResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  assetCode: string;

  @ApiProperty()
  assetName: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  assetCategory: string;

  @ApiPropertyOptional()
  assetSubCategory?: string;

  @ApiPropertyOptional()
  glAccountId?: string;

  @ApiProperty()
  acquisitionDate: Date;

  @ApiProperty()
  acquisitionCost: number;

  @ApiPropertyOptional()
  supplier?: string;

  @ApiPropertyOptional()
  invoiceNumber?: string;

  @ApiPropertyOptional()
  poNumber?: string;

  @ApiProperty({ enum: DepreciationMethod })
  depreciationMethod: DepreciationMethod;

  @ApiProperty()
  usefulLifeYears: number;

  @ApiProperty()
  usefulLifeMonths: number;

  @ApiPropertyOptional()
  depreciationRate?: number;

  @ApiProperty()
  salvageValue: number;

  @ApiProperty()
  depreciationStartDate: Date;

  @ApiProperty()
  accumulatedDepreciation: number;

  @ApiProperty()
  netBookValue: number;

  @ApiPropertyOptional()
  lastDepreciationDate?: Date;

  @ApiPropertyOptional()
  nextDepreciationDate?: Date;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional()
  department?: string;

  @ApiPropertyOptional()
  costCenter?: string;

  @ApiPropertyOptional()
  assignedToEmployeeId?: string;

  @ApiPropertyOptional()
  assignedToEmployeeName?: string;

  @ApiPropertyOptional()
  manufacturer?: string;

  @ApiPropertyOptional()
  model?: string;

  @ApiPropertyOptional()
  serialNumber?: string;

  @ApiPropertyOptional()
  barcode?: string;

  @ApiProperty({ enum: AssetStatus })
  status: AssetStatus;

  @ApiProperty()
  isDepreciable: boolean;

  @ApiPropertyOptional()
  warrantyStartDate?: Date;

  @ApiPropertyOptional()
  warrantyEndDate?: Date;

  @ApiPropertyOptional()
  warrantyProvider?: string;

  @ApiProperty()
  isInsured: boolean;

  @ApiPropertyOptional()
  insuranceProvider?: string;

  @ApiPropertyOptional()
  insurancePolicyNumber?: string;

  @ApiPropertyOptional()
  insuranceExpiryDate?: Date;

  @ApiPropertyOptional()
  insuredValue?: number;

  @ApiPropertyOptional()
  disposalDate?: Date;

  @ApiPropertyOptional()
  disposalAmount?: number;

  @ApiPropertyOptional()
  gainLossOnDisposal?: number;

  @ApiPropertyOptional()
  disposalReason?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
