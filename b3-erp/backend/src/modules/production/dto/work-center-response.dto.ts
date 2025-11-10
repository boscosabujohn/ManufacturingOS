import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkCenterType, WorkCenterStatus } from '../entities/work-center.entity';

export class WorkCenterResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  workCenterCode: string;

  @ApiProperty()
  workCenterName: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: WorkCenterType })
  workCenterType: WorkCenterType;

  @ApiProperty({ enum: WorkCenterStatus })
  status: WorkCenterStatus;

  @ApiPropertyOptional()
  department?: string;

  @ApiPropertyOptional()
  plant?: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiProperty()
  numberOfStations: number;

  @ApiProperty()
  workingHoursPerDay: number;

  @ApiProperty()
  availableCapacityHoursPerDay: number;

  @ApiProperty()
  utilisedCapacityHoursPerDay: number;

  @ApiProperty()
  capacityUtilizationPercentage: number;

  @ApiProperty()
  efficiency: number;

  @ApiProperty()
  totalCostPerHour: number;

  @ApiProperty()
  uptimePercentage: number;

  @ApiProperty()
  oeePercentage: number;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
