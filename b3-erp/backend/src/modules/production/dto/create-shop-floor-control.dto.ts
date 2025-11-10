import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShopFloorActivityType, DowntimeCategory } from '../entities/shop-floor-control.entity';

export class CreateShopFloorControlDto {
  @ApiProperty({ description: 'Entry number', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  entryNumber: string;

  @ApiProperty({ description: 'Activity type', enum: ShopFloorActivityType })
  @IsEnum(ShopFloorActivityType)
  @IsNotEmpty()
  activityType: ShopFloorActivityType;

  @ApiProperty({ description: 'Work order ID' })
  @IsString()
  @IsNotEmpty()
  workOrderId: string;

  @ApiProperty({ description: 'Work order number' })
  @IsString()
  @IsNotEmpty()
  workOrderNumber: string;

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

  @ApiPropertyOptional({ description: 'Operation ID' })
  @IsString()
  @IsOptional()
  operationId?: string;

  @ApiPropertyOptional({ description: 'Operation code' })
  @IsString()
  @IsOptional()
  operationCode?: string;

  @ApiPropertyOptional({ description: 'Work center ID' })
  @IsString()
  @IsOptional()
  workCenterId?: string;

  @ApiPropertyOptional({ description: 'Work center code' })
  @IsString()
  @IsOptional()
  workCenterCode?: string;

  @ApiPropertyOptional({ description: 'Operator ID' })
  @IsString()
  @IsOptional()
  operatorId?: string;

  @ApiPropertyOptional({ description: 'Operator name' })
  @IsString()
  @IsOptional()
  operatorName?: string;

  @ApiPropertyOptional({ description: 'Shift' })
  @IsString()
  @IsOptional()
  shift?: string;

  @ApiProperty({ description: 'Start time (ISO 8601)' })
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @ApiPropertyOptional({ description: 'End time (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  endTime?: string;

  @ApiPropertyOptional({ description: 'Target quantity' })
  @IsNumber()
  @IsOptional()
  targetQuantity?: number;

  @ApiPropertyOptional({ description: 'Completed quantity' })
  @IsNumber()
  @IsOptional()
  completedQuantity?: number;

  @ApiPropertyOptional({ description: 'Accepted quantity' })
  @IsNumber()
  @IsOptional()
  acceptedQuantity?: number;

  @ApiPropertyOptional({ description: 'Rejected quantity' })
  @IsNumber()
  @IsOptional()
  rejectedQuantity?: number;

  @ApiPropertyOptional({ description: 'Has downtime' })
  @IsOptional()
  hasDowntime?: boolean;

  @ApiPropertyOptional({ description: 'Downtime category', enum: DowntimeCategory })
  @IsEnum(DowntimeCategory)
  @IsOptional()
  downtimeCategory?: DowntimeCategory;

  @ApiPropertyOptional({ description: 'Downtime minutes' })
  @IsNumber()
  @IsOptional()
  downtimeMinutes?: number;

  @ApiPropertyOptional({ description: 'Downtime reason' })
  @IsString()
  @IsOptional()
  downtimeReason?: string;

  @ApiPropertyOptional({ description: 'Remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiPropertyOptional({ description: 'Custom fields' })
  @IsOptional()
  customFields?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Created by' })
  @IsString()
  @IsOptional()
  createdBy?: string;
}
