import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShiftType, ShiftStatus } from '../entities/shift.entity';

export class ShiftResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: ShiftType })
  type: ShiftType;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty()
  workingHours: number;

  @ApiPropertyOptional()
  breakStartTime?: string;

  @ApiPropertyOptional()
  breakEndTime?: string;

  @ApiProperty()
  breakHours: number;

  @ApiProperty()
  graceMinutes: number;

  @ApiProperty()
  lateMarkAfterMinutes: number;

  @ApiProperty()
  halfDayAfterMinutes: number;

  @ApiProperty()
  absentAfterMinutes: number;

  @ApiProperty()
  workingDays: number[];

  @ApiProperty()
  allowOvertime: boolean;

  @ApiProperty()
  overtimeMultiplier: number;

  @ApiProperty()
  isNightShift: boolean;

  @ApiProperty()
  nightShiftAllowance: number;

  @ApiProperty({ enum: ShiftStatus })
  status: ShiftStatus;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
