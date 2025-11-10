import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkOrderType, WorkOrderStatus, WorkOrderPriority } from '../entities/work-order.entity';

export class WorkOrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  workOrderNumber: string;

  @ApiProperty()
  workOrderName: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: WorkOrderType })
  workOrderType: WorkOrderType;

  @ApiProperty({ enum: WorkOrderStatus })
  status: WorkOrderStatus;

  @ApiProperty({ enum: WorkOrderPriority })
  priority: WorkOrderPriority;

  @ApiProperty()
  itemId: string;

  @ApiProperty()
  itemCode: string;

  @ApiProperty()
  itemName: string;

  @ApiProperty()
  uom: string;

  @ApiProperty()
  plannedQuantity: number;

  @ApiProperty()
  producedQuantity: number;

  @ApiProperty()
  acceptedQuantity: number;

  @ApiProperty()
  rejectedQuantity: number;

  @ApiProperty()
  scrapQuantity: number;

  @ApiProperty()
  pendingQuantity: number;

  @ApiPropertyOptional()
  bomId?: string;

  @ApiPropertyOptional()
  bomCode?: string;

  @ApiPropertyOptional()
  routingId?: string;

  @ApiPropertyOptional()
  routingCode?: string;

  @ApiProperty()
  plannedStartDate: Date;

  @ApiProperty()
  plannedEndDate: Date;

  @ApiPropertyOptional()
  actualStartDate?: Date;

  @ApiPropertyOptional()
  actualEndDate?: Date;

  @ApiPropertyOptional()
  requiredByDate?: Date;

  @ApiPropertyOptional()
  workCenterId?: string;

  @ApiPropertyOptional()
  workCenterCode?: string;

  @ApiProperty()
  estimatedTotalCost: number;

  @ApiProperty()
  actualTotalCost: number;

  @ApiProperty()
  progressPercentage: number;

  @ApiProperty()
  materialsIssued: boolean;

  @ApiProperty()
  productionCompleted: boolean;

  @ApiPropertyOptional()
  customerId?: string;

  @ApiPropertyOptional()
  customerName?: string;

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
