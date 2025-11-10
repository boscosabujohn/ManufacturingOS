import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RouteStatus, RouteType } from '../entities/route.entity';

export class RouteResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  routeCode: string;

  @ApiProperty()
  routeName: string;

  @ApiProperty({ enum: RouteType })
  routeType: RouteType;

  @ApiProperty({ enum: RouteStatus })
  status: RouteStatus;

  @ApiProperty()
  originName: string;

  @ApiProperty()
  destinationName: string;

  @ApiProperty()
  totalDistance: number;

  @ApiPropertyOptional()
  distanceUnit?: string;

  @ApiProperty()
  estimatedDurationMinutes: number;

  @ApiPropertyOptional()
  numberOfStops?: number;

  @ApiPropertyOptional()
  totalTripsCompleted?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
