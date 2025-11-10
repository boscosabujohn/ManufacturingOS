import { IsString, IsEnum, IsNotEmpty, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeavePeriod } from '../entities/leave-application.entity';

export class CreateLeaveApplicationDto {
  @ApiProperty({ description: 'Employee ID' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ description: 'Leave type ID' })
  @IsString()
  @IsNotEmpty()
  leaveTypeId: string;

  @ApiProperty({ description: 'From date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  fromDate: string;

  @ApiProperty({ description: 'To date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  toDate: string;

  @ApiPropertyOptional({ description: 'From date period', enum: LeavePeriod })
  @IsEnum(LeavePeriod)
  @IsOptional()
  fromDatePeriod?: LeavePeriod;

  @ApiPropertyOptional({ description: 'To date period', enum: LeavePeriod })
  @IsEnum(LeavePeriod)
  @IsOptional()
  toDatePeriod?: LeavePeriod;

  @ApiProperty({ description: 'Total days' })
  @IsNumber()
  @Type(() => Number)
  totalDays: number;

  @ApiProperty({ description: 'Reason' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional({ description: 'Contact address' })
  @IsString()
  @IsOptional()
  contactAddress?: string;

  @ApiPropertyOptional({ description: 'Contact phone' })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'Handover to' })
  @IsString()
  @IsOptional()
  handoverTo?: string;
}
