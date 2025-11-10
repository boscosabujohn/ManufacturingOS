import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkCenterType } from '../entities/work-center.entity';

export class CreateWorkCenterDto {
  @ApiProperty({ description: 'Work center code', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  workCenterCode: string;

  @ApiProperty({ description: 'Work center name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  workCenterName: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Work center type', enum: WorkCenterType })
  @IsEnum(WorkCenterType)
  @IsOptional()
  workCenterType?: WorkCenterType;

  @ApiPropertyOptional({ description: 'Department' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ description: 'Plant' })
  @IsString()
  @IsOptional()
  plant?: string;

  @ApiPropertyOptional({ description: 'Location' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: 'Number of stations' })
  @IsNumber()
  @IsOptional()
  numberOfStations?: number;

  @ApiPropertyOptional({ description: 'Working hours per day' })
  @IsNumber()
  @IsOptional()
  workingHoursPerDay?: number;

  @ApiPropertyOptional({ description: 'Working days per week' })
  @IsNumber()
  @IsOptional()
  workingDaysPerWeek?: number;

  @ApiPropertyOptional({ description: 'Hourly operating cost' })
  @IsNumber()
  @IsOptional()
  hourlyOperatingCost?: number;

  @ApiPropertyOptional({ description: 'Labor cost per hour' })
  @IsNumber()
  @IsOptional()
  laborCostPerHour?: number;

  @ApiPropertyOptional({ description: 'Overhead cost per hour' })
  @IsNumber()
  @IsOptional()
  overheadCostPerHour?: number;

  @ApiPropertyOptional({ description: 'Efficiency percentage' })
  @IsNumber()
  @IsOptional()
  efficiency?: number;

  @ApiPropertyOptional({ description: 'Machine number' })
  @IsString()
  @IsOptional()
  machineNumber?: string;

  @ApiPropertyOptional({ description: 'Manufacturer' })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiPropertyOptional({ description: 'Model' })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiPropertyOptional({ description: 'Serial number' })
  @IsString()
  @IsOptional()
  serialNumber?: string;

  @ApiPropertyOptional({ description: 'Required operators' })
  @IsNumber()
  @IsOptional()
  requiredOperators?: number;

  @ApiPropertyOptional({ description: 'Requires preventive maintenance' })
  @IsBoolean()
  @IsOptional()
  requiresPreventiveMaintenance?: boolean;

  @ApiPropertyOptional({ description: 'Maintenance interval days' })
  @IsNumber()
  @IsOptional()
  maintenanceIntervalDays?: number;

  @ApiPropertyOptional({ description: 'Supervisor ID' })
  @IsString()
  @IsOptional()
  supervisorId?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Custom fields' })
  @IsOptional()
  customFields?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Created by' })
  @IsString()
  @IsOptional()
  createdBy?: string;
}
