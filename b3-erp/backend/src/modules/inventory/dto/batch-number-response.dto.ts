import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BatchStatus } from '../entities/batch-number.entity';

export class BatchNumberResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  batchNumber: string;

  @ApiProperty()
  itemId: string;

  @ApiProperty()
  itemCode: string;

  @ApiProperty()
  itemName: string;

  @ApiProperty({ enum: BatchStatus })
  status: BatchStatus;

  @ApiPropertyOptional()
  manufacturingDate?: Date;

  @ApiPropertyOptional()
  manufacturerName?: string;

  @ApiPropertyOptional()
  expiryDate?: Date;

  @ApiProperty()
  isExpired: boolean;

  @ApiPropertyOptional()
  daysToExpiry?: number;

  @ApiProperty()
  initialQuantity: number;

  @ApiProperty()
  availableQuantity: number;

  @ApiProperty()
  reservedQuantity: number;

  @ApiProperty()
  issuedQuantity: number;

  @ApiProperty()
  uom: string;

  @ApiPropertyOptional()
  purchasePrice?: number;

  @ApiPropertyOptional()
  currentValue?: number;

  @ApiPropertyOptional()
  supplierId?: string;

  @ApiPropertyOptional()
  supplierName?: string;

  @ApiPropertyOptional()
  qualityStatus?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  remarks?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
