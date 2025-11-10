import { IsString, IsEnum, IsNotEmpty, IsDateString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AttendanceStatus, AttendanceType } from '../entities/attendance.entity';

export class CreateAttendanceDto {
  @ApiProperty({ description: 'Employee ID' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ description: 'Attendance date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({ description: 'Shift ID' })
  @IsString()
  @IsOptional()
  shiftId?: string;

  @ApiPropertyOptional({ description: 'Check-in time (HH:MM:SS)' })
  @IsString()
  @IsOptional()
  checkInTime?: string;

  @ApiPropertyOptional({ description: 'Check-out time (HH:MM:SS)' })
  @IsString()
  @IsOptional()
  checkOutTime?: string;

  @ApiPropertyOptional({ description: 'Working hours' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  workingHours?: number;

  @ApiPropertyOptional({ description: 'Overtime hours' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  overtimeHours?: number;

  @ApiPropertyOptional({ description: 'Status', enum: AttendanceStatus })
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;

  @ApiPropertyOptional({ description: 'Type', enum: AttendanceType })
  @IsEnum(AttendanceType)
  @IsOptional()
  type?: AttendanceType;

  @ApiPropertyOptional({ description: 'Remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;
}
