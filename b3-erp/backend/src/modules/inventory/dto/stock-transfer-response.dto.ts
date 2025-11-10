import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  TransferType,
  TransferStatus,
} from '../entities/stock-transfer.entity';

export class StockTransferResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  transferNumber: string;

  @ApiProperty({ enum: TransferType })
  transferType: TransferType;

  @ApiProperty({ enum: TransferStatus })
  status: TransferStatus;

  @ApiProperty()
  transferDate: Date;

  @ApiPropertyOptional()
  expectedReceiptDate?: Date;

  @ApiProperty()
  fromWarehouseId: string;

  @ApiProperty()
  fromWarehouseName: string;

  @ApiProperty()
  toWarehouseId: string;

  @ApiProperty()
  toWarehouseName: string;

  @ApiProperty()
  totalValue: number;

  @ApiPropertyOptional()
  dispatchedAt?: Date;

  @ApiPropertyOptional()
  receivedAt?: Date;

  @ApiPropertyOptional()
  remarks?: string;

  @ApiProperty()
  lines: any[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
