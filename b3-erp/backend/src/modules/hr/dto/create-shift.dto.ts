import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShiftType, ShiftStatus } from '../entities/shift.entity';

export class CreateShiftDto {
  @ApiProperty({ description: 'Shift code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({ description: 'Shift name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Shift type', enum: ShiftType })
  @IsEnum(ShiftType)
  type: ShiftType;

  @ApiProperty({ description: 'Start time (HH:MM:SS)' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ description: 'End time (HH:MM:SS)' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({ description: 'Working hours' })
  @IsNumber()
  @Type(() => Number)
  workingHours: number;

  @ApiPropertyOptional({ description: 'Break start time (HH:MM:SS)' })
  @IsString()
  @IsOptional()
  breakStartTime?: string;

  @ApiPropertyOptional({ description: 'Break end time (HH:MM:SS)' })
  @IsString()
  @IsOptional()
  breakEndTime?: string;

  @ApiPropertyOptional({ description: 'Break hours', default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  breakHours?: number;

  @ApiPropertyOptional({ description: 'Grace minutes', default: 15 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  graceMinutes?: number;

  @ApiPropertyOptional({ description: 'Late mark after minutes', default: 30 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  lateMarkAfterMinutes?: number;

  @ApiPropertyOptional({ description: 'Half day after minutes', default: 60 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  halfDayAfterMinutes?: number;

  @ApiPropertyOptional({ description: 'Absent after minutes', default: 240 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  absentAfterMinutes?: number;

  @ApiPropertyOptional({ description: 'Working days (0=Sunday, 1=Monday, etc.)', type: [Number] })
  @IsArray()
  @IsOptional()
  workingDays?: number[];

  @ApiPropertyOptional({ description: 'Allow overtime', default: true })
  @IsBoolean()
  @IsOptional()
  allowOvertime?: boolean;

  @ApiPropertyOptional({ description: 'Overtime multiplier', default: 1.5 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  overtimeMultiplier?: number;

  @ApiPropertyOptional({ description: 'Is night shift', default: false })
  @IsBoolean()
  @IsOptional()
  isNightShift?: boolean;

  @ApiPropertyOptional({ description: 'Night shift allowance', default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  nightShiftAllowance?: number;

  @ApiPropertyOptional({ description: 'Status', enum: ShiftStatus })
  @IsEnum(ShiftStatus)
  @IsOptional()
  status?: ShiftStatus;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}
