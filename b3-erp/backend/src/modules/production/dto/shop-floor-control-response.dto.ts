import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShopFloorActivityType, ShopFloorStatus } from '../entities/shop-floor-control.entity';

export class ShopFloorControlResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  entryNumber: string;

  @ApiProperty({ enum: ShopFloorActivityType })
  activityType: ShopFloorActivityType;

  @ApiProperty({ enum: ShopFloorStatus })
  status: ShopFloorStatus;

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
  operationCode?: string;

  @ApiPropertyOptional()
  workCenterId?: string;

  @ApiPropertyOptional()
  workCenterCode?: string;

  @ApiPropertyOptional()
  operatorId?: string;

  @ApiPropertyOptional()
  operatorName?: string;

  @ApiProperty()
  startTime: Date;

  @ApiPropertyOptional()
  endTime?: Date;

  @ApiProperty()
  durationMinutes: number;

  @ApiProperty()
  targetQuantity: number;

  @ApiProperty()
  completedQuantity: number;

  @ApiProperty()
  acceptedQuantity: number;

  @ApiProperty()
  rejectedQuantity: number;

  @ApiProperty()
  efficiencyPercentage: number;

  @ApiProperty()
  hasDowntime: boolean;

  @ApiPropertyOptional()
  downtimeMinutes?: number;

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
