import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductionEntryType, ProductionEntryStatus } from '../entities/production-entry.entity';

export class ProductionEntryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  entryNumber: string;

  @ApiProperty({ enum: ProductionEntryType })
  entryType: ProductionEntryType;

  @ApiProperty({ enum: ProductionEntryStatus })
  status: ProductionEntryStatus;

  @ApiProperty()
  postingDate: Date;

  @ApiProperty()
  workOrderId: string;

  @ApiProperty()
  workOrderNumber: string;

  @ApiProperty()
  itemId: string;

  @ApiProperty()
  itemCode: string;

  @ApiProperty()
  itemName: string;

  @ApiPropertyOptional()
  operationId?: string;

  @ApiPropertyOptional()
  workCenterId?: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  acceptedQuantity: number;

  @ApiProperty()
  rejectedQuantity: number;

  @ApiProperty()
  scrapQuantity: number;

  @ApiProperty()
  uom: string;

  @ApiProperty()
  totalMaterialCost: number;

  @ApiProperty()
  totalLaborCost: number;

  @ApiProperty()
  overheadCost: number;

  @ApiProperty()
  totalCost: number;

  @ApiProperty()
  costPerUnit: number;

  @ApiProperty()
  inventoryPosted: boolean;

  @ApiProperty()
  glPosted: boolean;

  @ApiProperty()
  isReversed: boolean;

  @ApiPropertyOptional()
  operatorId?: string;

  @ApiPropertyOptional()
  operatorName?: string;

  @ApiPropertyOptional()
  remarks?: string;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
