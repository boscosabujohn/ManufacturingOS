import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsArray,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeaveTypeStatus, LeaveAccrualType } from '../entities/leave-type.entity';

export class CreateLeaveTypeDto {
  @ApiProperty({ description: 'Leave type code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({ description: 'Leave type name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Is paid leave', default: true })
  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @ApiProperty({ description: 'Maximum days per year' })
  @IsNumber()
  @Type(() => Number)
  maxDaysPerYear: number;

  @ApiPropertyOptional({ description: 'Allow carry forward', default: false })
  @IsBoolean()
  @IsOptional()
  allowCarryForward?: boolean;

  @ApiPropertyOptional({ description: 'Max carry forward days', default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxCarryForward?: number;

  @ApiPropertyOptional({ description: 'Allow encashment', default: false })
  @IsBoolean()
  @IsOptional()
  allowEncashment?: boolean;

  @ApiPropertyOptional({ description: 'Requires approval', default: true })
  @IsBoolean()
  @IsOptional()
  requiresApproval?: boolean;

  @ApiPropertyOptional({ description: 'Requires document', default: false })
  @IsBoolean()
  @IsOptional()
  requiresDocument?: boolean;

  @ApiPropertyOptional({ description: 'Accrual type', enum: LeaveAccrualType })
  @IsEnum(LeaveAccrualType)
  @IsOptional()
  accrualType?: LeaveAccrualType;

  @ApiPropertyOptional({ description: 'Allow half day', default: false })
  @IsBoolean()
  @IsOptional()
  allowHalfDay?: boolean;

  @ApiPropertyOptional({ description: 'Status', enum: LeaveTypeStatus })
  @IsEnum(LeaveTypeStatus)
  @IsOptional()
  status?: LeaveTypeStatus;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}
