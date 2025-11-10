import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BOMType, BOMStatus } from '../entities/bom.entity';

export class BOMResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  bomCode: string;

  @ApiProperty()
  bomName: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  itemId: string;

  @ApiProperty()
  itemCode: string;

  @ApiProperty()
  itemName: string;

  @ApiProperty({ enum: BOMType })
  bomType: BOMType;

  @ApiProperty({ enum: BOMStatus })
  status: BOMStatus;

  @ApiProperty()
  version: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isDefault: boolean;

  @ApiPropertyOptional()
  effectiveFrom?: Date;

  @ApiPropertyOptional()
  effectiveTo?: Date;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  uom: string;

  @ApiProperty()
  materialCost: number;

  @ApiProperty()
  operationCost: number;

  @ApiProperty()
  overheadCost: number;

  @ApiProperty()
  totalCost: number;

  @ApiProperty()
  costPerUnit: number;

  @ApiPropertyOptional()
  lastCostRollupDate?: Date;

  @ApiProperty()
  leadTimeDays: number;

  @ApiProperty()
  scrapPercentage: number;

  @ApiProperty()
  batchSize: number;

  @ApiProperty()
  allowAlternativeItems: boolean;

  @ApiProperty()
  requiresQualityInspection: boolean;

  @ApiPropertyOptional()
  defaultRoutingId?: string;

  @ApiPropertyOptional()
  defaultRoutingCode?: string;

  @ApiPropertyOptional()
  drawingNumber?: string;

  @ApiPropertyOptional()
  revision?: string;

  @ApiPropertyOptional()
  submittedBy?: string;

  @ApiPropertyOptional()
  submittedAt?: Date;

  @ApiPropertyOptional()
  approvedBy?: string;

  @ApiPropertyOptional()
  approvedAt?: Date;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  customFields?: Record<string, any>;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
