import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  TrackingEventType,
  EventSeverity,
} from '../entities/tracking-event.entity';

export class TrackingEventResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  eventNumber: string;

  @ApiProperty({ enum: TrackingEventType })
  eventType: TrackingEventType;

  @ApiProperty({ enum: EventSeverity })
  severity: EventSeverity;

  @ApiPropertyOptional()
  shipmentId?: string;

  @ApiPropertyOptional()
  tripId?: string;

  @ApiPropertyOptional()
  locationName?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiProperty()
  eventTimestamp: Date;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  latitude?: number;

  @ApiPropertyOptional()
  longitude?: number;

  @ApiProperty()
  createdAt: Date;
}
