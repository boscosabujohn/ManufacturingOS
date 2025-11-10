import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TripStatus, TripType } from '../entities/trip.entity';

export class TripResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tripNumber: string;

  @ApiProperty({ enum: TripType })
  tripType: TripType;

  @ApiProperty({ enum: TripStatus })
  status: TripStatus;

  @ApiProperty()
  vehicleId: string;

  @ApiProperty()
  driverId: string;

  @ApiProperty()
  originName: string;

  @ApiProperty()
  destinationName: string;

  @ApiProperty()
  plannedStartTime: Date;

  @ApiProperty()
  plannedEndTime: Date;

  @ApiPropertyOptional()
  actualStartTime?: Date;

  @ApiPropertyOptional()
  actualEndTime?: Date;

  @ApiProperty()
  plannedDistance: number;

  @ApiPropertyOptional()
  actualDistance?: number;

  @ApiPropertyOptional()
  numberOfShipments?: number;

  @ApiPropertyOptional()
  completionPercentage?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
