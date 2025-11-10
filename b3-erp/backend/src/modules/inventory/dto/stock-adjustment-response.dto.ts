import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AdjustmentType,
  AdjustmentStatus,
} from '../entities/stock-adjustment.entity';

export class StockAdjustmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  adjustmentNumber: string;

  @ApiProperty({ enum: AdjustmentType })
  adjustmentType: AdjustmentType;

  @ApiProperty({ enum: AdjustmentStatus })
  status: AdjustmentStatus;

  @ApiProperty()
  adjustmentDate: Date;

  @ApiProperty()
  warehouseId: string;

  @ApiProperty()
  warehouseName: string;

  @ApiProperty()
  totalAdjustmentValue: number;

  @ApiProperty()
  positiveAdjustmentValue: number;

  @ApiProperty()
  negativeAdjustmentValue: number;

  @ApiProperty()
  isPosted: boolean;

  @ApiPropertyOptional()
  approvedBy?: string;

  @ApiPropertyOptional()
  approvedAt?: Date;

  @ApiPropertyOptional()
  reason?: string;

  @ApiPropertyOptional()
  remarks?: string;

  @ApiProperty()
  lines: any[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
