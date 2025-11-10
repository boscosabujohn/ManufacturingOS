import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StockBalanceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  itemId: string;

  @ApiProperty()
  itemCode: string;

  @ApiProperty()
  itemName: string;

  @ApiProperty()
  warehouseId: string;

  @ApiProperty()
  warehouseName: string;

  @ApiPropertyOptional()
  locationId?: string;

  @ApiPropertyOptional()
  locationName?: string;

  @ApiProperty()
  availableQuantity: number;

  @ApiProperty()
  reservedQuantity: number;

  @ApiProperty()
  freeQuantity: number;

  @ApiProperty()
  totalQuantity: number;

  @ApiProperty()
  uom: string;

  @ApiProperty()
  valuationRate: number;

  @ApiProperty()
  stockValue: number;

  @ApiPropertyOptional()
  batchNumber?: string;

  @ApiPropertyOptional()
  serialNumber?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
