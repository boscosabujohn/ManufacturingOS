import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  MaxLength,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  TrackingEventType,
  EventSeverity,
} from '../entities/tracking-event.entity';

export class CreateTrackingEventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  eventNumber: string;

  @ApiProperty({ enum: TrackingEventType })
  @IsEnum(TrackingEventType)
  eventType: TrackingEventType;

  @ApiProperty({ enum: EventSeverity })
  @IsEnum(EventSeverity)
  @IsOptional()
  severity?: EventSeverity;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shipmentId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  tripId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  locationName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  locationAddress?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  longitude?: number;

  @ApiProperty()
  @IsISO8601()
  eventTimestamp: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  additionalDetails?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  vehicleId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  driverId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
