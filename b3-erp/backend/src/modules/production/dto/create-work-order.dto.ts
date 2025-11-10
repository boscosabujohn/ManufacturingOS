import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkOrderType, WorkOrderPriority } from '../entities/work-order.entity';

export class CreateWorkOrderDto {
  @ApiProperty({ description: 'Work order number', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  workOrderNumber: string;

  @ApiProperty({ description: 'Work order name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  workOrderName: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Work order type', enum: WorkOrderType })
  @IsEnum(WorkOrderType)
  @IsOptional()
  workOrderType?: WorkOrderType;

  @ApiPropertyOptional({ description: 'Priority', enum: WorkOrderPriority })
  @IsEnum(WorkOrderPriority)
  @IsOptional()
  priority?: WorkOrderPriority;

  @ApiProperty({ description: 'Item ID' })
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({ description: 'Item code' })
  @IsString()
  @IsNotEmpty()
  itemCode: string;

  @ApiProperty({ description: 'Item name' })
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiPropertyOptional({ description: 'Unit of measure' })
  @IsString()
  @IsOptional()
  uom?: string;

  @ApiProperty({ description: 'Planned quantity' })
  @IsNumber()
  @IsNotEmpty()
  plannedQuantity: number;

  @ApiPropertyOptional({ description: 'BOM ID' })
  @IsString()
  @IsOptional()
  bomId?: string;

  @ApiPropertyOptional({ description: 'BOM code' })
  @IsString()
  @IsOptional()
  bomCode?: string;

  @ApiPropertyOptional({ description: 'Routing ID' })
  @IsString()
  @IsOptional()
  routingId?: string;

  @ApiPropertyOptional({ description: 'Routing code' })
  @IsString()
  @IsOptional()
  routingCode?: string;

  @ApiProperty({ description: 'Planned start date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  plannedStartDate: string;

  @ApiProperty({ description: 'Planned end date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  plannedEndDate: string;

  @ApiPropertyOptional({ description: 'Required by date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  requiredByDate?: string;

  @ApiPropertyOptional({ description: 'Work center ID' })
  @IsString()
  @IsOptional()
  workCenterId?: string;

  @ApiPropertyOptional({ description: 'Work center code' })
  @IsString()
  @IsOptional()
  workCenterCode?: string;

  @ApiPropertyOptional({ description: 'Sales order ID' })
  @IsString()
  @IsOptional()
  salesOrderId?: string;

  @ApiPropertyOptional({ description: 'Sales order number' })
  @IsString()
  @IsOptional()
  salesOrderNumber?: string;

  @ApiPropertyOptional({ description: 'Production plan ID' })
  @IsString()
  @IsOptional()
  productionPlanId?: string;

  @ApiPropertyOptional({ description: 'Customer ID' })
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiPropertyOptional({ description: 'Customer name' })
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiPropertyOptional({ description: 'Customer PO' })
  @IsString()
  @IsOptional()
  customerPO?: string;

  @ApiPropertyOptional({ description: 'Job number' })
  @IsString()
  @IsOptional()
  jobNumber?: string;

  @ApiPropertyOptional({ description: 'Track serial numbers' })
  @IsBoolean()
  @IsOptional()
  trackSerialNumbers?: boolean;

  @ApiPropertyOptional({ description: 'Track batch numbers' })
  @IsBoolean()
  @IsOptional()
  trackBatchNumbers?: boolean;

  @ApiPropertyOptional({ description: 'Source warehouse ID' })
  @IsString()
  @IsOptional()
  sourceWarehouseId?: string;

  @ApiPropertyOptional({ description: 'Target warehouse ID' })
  @IsString()
  @IsOptional()
  targetWarehouseId?: string;

  @ApiPropertyOptional({ description: 'Requires inspection' })
  @IsBoolean()
  @IsOptional()
  requiresInspection?: boolean;

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
