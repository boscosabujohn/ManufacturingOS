import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsArray,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LocationType } from '../entities/stock-location.entity';

export class CreateStockLocationDto {
  @ApiProperty({ description: 'Warehouse ID' })
  @IsString()
  @IsNotEmpty()
  warehouseId: string;

  @ApiProperty({ description: 'Unique location code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  locationCode: string;

  @ApiProperty({ description: 'Location name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  locationName: string;

  @ApiProperty({
    description: 'Type of location',
    enum: LocationType,
    default: LocationType.BIN,
  })
  @IsEnum(LocationType)
  @IsOptional()
  locationType?: LocationType;

  @ApiPropertyOptional({ description: 'Parent location ID' })
  @IsString()
  @IsOptional()
  parentLocationId?: string;

  @ApiPropertyOptional({ description: 'Zone' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  zone?: string;

  @ApiPropertyOptional({ description: 'Aisle' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  aisle?: string;

  @ApiPropertyOptional({ description: 'Rack' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  rack?: string;

  @ApiPropertyOptional({ description: 'Shelf' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  shelf?: string;

  @ApiPropertyOptional({ description: 'Bin' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  bin?: string;

  @ApiPropertyOptional({ description: 'Floor level' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  level?: number;

  @ApiPropertyOptional({ description: 'Length' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  length?: number;

  @ApiPropertyOptional({ description: 'Width' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  width?: number;

  @ApiPropertyOptional({ description: 'Height' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  height?: number;

  @ApiPropertyOptional({ description: 'Dimension unit' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  dimensionUnit?: string;

  @ApiPropertyOptional({ description: 'Maximum capacity' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxCapacity?: number;

  @ApiPropertyOptional({ description: 'Maximum weight' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxWeight?: number;

  @ApiPropertyOptional({ description: 'Weight unit' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  weightUnit?: string;

  @ApiPropertyOptional({ description: 'Picking sequence' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pickingSequence?: number;

  @ApiPropertyOptional({ description: 'Putaway sequence' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  putawaySequence?: number;

  @ApiPropertyOptional({ description: 'Allow mixed items', default: false })
  @IsBoolean()
  @IsOptional()
  isMixedItemAllowed?: boolean;

  @ApiPropertyOptional({ description: 'Allow mixed batches', default: false })
  @IsBoolean()
  @IsOptional()
  isMixedBatchAllowed?: boolean;

  @ApiPropertyOptional({ description: 'Is fixed location', default: false })
  @IsBoolean()
  @IsOptional()
  isFixedLocation?: boolean;

  @ApiPropertyOptional({ description: 'Fixed item ID' })
  @IsString()
  @IsOptional()
  fixedItemId?: string;

  @ApiPropertyOptional({ description: 'Fixed item name' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  fixedItemName?: string;

  @ApiPropertyOptional({
    description: 'Temperature controlled',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isTemperatureControlled?: boolean;

  @ApiPropertyOptional({ description: 'Minimum temperature' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  temperatureMin?: number;

  @ApiPropertyOptional({ description: 'Maximum temperature' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  temperatureMax?: number;

  @ApiPropertyOptional({ description: 'Humidity controlled', default: false })
  @IsBoolean()
  @IsOptional()
  isHumidityControlled?: boolean;

  @ApiPropertyOptional({ description: 'Minimum humidity' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  humidityMin?: number;

  @ApiPropertyOptional({ description: 'Maximum humidity' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  humidityMax?: number;

  @ApiPropertyOptional({
    description: 'Allowed item categories',
    type: [String],
  })
  @IsArray()
  @IsOptional()
  allowedItemCategories?: string[];

  @ApiPropertyOptional({
    description: 'Blocked item categories',
    type: [String],
  })
  @IsArray()
  @IsOptional()
  blockedItemCategories?: string[];

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiPropertyOptional({ description: 'Requires cycle count', default: false })
  @IsBoolean()
  @IsOptional()
  requiresCycleCount?: boolean;

  @ApiPropertyOptional({ description: 'Cycle count frequency in days' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  cycleCountFrequencyDays?: number;
}
