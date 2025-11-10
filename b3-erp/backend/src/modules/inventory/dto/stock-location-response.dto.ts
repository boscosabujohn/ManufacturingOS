import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LocationType, LocationStatus } from '../entities/stock-location.entity';

export class StockLocationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  warehouseId: string;

  @ApiProperty()
  locationCode: string;

  @ApiProperty()
  locationName: string;

  @ApiProperty({ enum: LocationType })
  locationType: LocationType;

  @ApiProperty({ enum: LocationStatus })
  status: LocationStatus;

  @ApiPropertyOptional()
  parentLocationId?: string;

  @ApiPropertyOptional()
  zone?: string;

  @ApiPropertyOptional()
  aisle?: string;

  @ApiPropertyOptional()
  rack?: string;

  @ApiPropertyOptional()
  shelf?: string;

  @ApiPropertyOptional()
  bin?: string;

  @ApiPropertyOptional()
  level?: number;

  @ApiPropertyOptional()
  maxCapacity?: number;

  @ApiPropertyOptional()
  currentCapacity?: number;

  @ApiPropertyOptional()
  utilizationPercentage?: number;

  @ApiProperty()
  isMixedItemAllowed: boolean;

  @ApiProperty()
  isMixedBatchAllowed: boolean;

  @ApiProperty()
  isFixedLocation: boolean;

  @ApiPropertyOptional()
  fixedItemId?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  remarks?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
