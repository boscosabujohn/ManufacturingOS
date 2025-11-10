import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  StockEntryType,
  StockEntryStatus,
  MovementDirection,
} from '../entities/stock-entry.entity';

export class StockEntryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  entryNumber: string;

  @ApiProperty({ enum: StockEntryType })
  entryType: StockEntryType;

  @ApiProperty({ enum: MovementDirection })
  movementDirection: MovementDirection;

  @ApiProperty()
  postingDate: Date;

  @ApiProperty({ enum: StockEntryStatus })
  status: StockEntryStatus;

  @ApiPropertyOptional()
  referenceType?: string;

  @ApiPropertyOptional()
  referenceId?: string;

  @ApiPropertyOptional()
  referenceNumber?: string;

  @ApiPropertyOptional()
  fromWarehouseId?: string;

  @ApiPropertyOptional()
  toWarehouseId?: string;

  @ApiProperty()
  totalValue: number;

  @ApiProperty()
  isPosted: boolean;

  @ApiPropertyOptional()
  remarks?: string;

  @ApiProperty()
  lines: any[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
