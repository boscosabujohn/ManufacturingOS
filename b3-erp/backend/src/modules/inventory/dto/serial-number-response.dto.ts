import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SerialNumberStatus } from '../entities/serial-number.entity';

export class SerialNumberResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  serialNumber: string;

  @ApiProperty()
  itemId: string;

  @ApiProperty()
  itemCode: string;

  @ApiProperty()
  itemName: string;

  @ApiPropertyOptional()
  warehouseId?: string;

  @ApiPropertyOptional()
  warehouseName?: string;

  @ApiPropertyOptional()
  locationId?: string;

  @ApiPropertyOptional()
  locationName?: string;

  @ApiProperty({ enum: SerialNumberStatus })
  status: SerialNumberStatus;

  @ApiPropertyOptional()
  batchNumber?: string;

  @ApiPropertyOptional()
  purchaseDate?: Date;

  @ApiPropertyOptional()
  purchasePrice?: number;

  @ApiPropertyOptional()
  manufacturingDate?: Date;

  @ApiPropertyOptional()
  warrantyStartDate?: Date;

  @ApiPropertyOptional()
  warrantyEndDate?: Date;

  @ApiProperty()
  isUnderWarranty: boolean;

  @ApiPropertyOptional()
  expiryDate?: Date;

  @ApiPropertyOptional()
  customerId?: string;

  @ApiPropertyOptional()
  customerName?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  remarks?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
