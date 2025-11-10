import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeaveTypeStatus, LeaveAccrualType } from '../entities/leave-type.entity';

export class LeaveTypeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  isPaid: boolean;

  @ApiProperty()
  maxDaysPerYear: number;

  @ApiProperty()
  allowCarryForward: boolean;

  @ApiProperty()
  maxCarryForward: number;

  @ApiProperty()
  allowEncashment: boolean;

  @ApiProperty()
  requiresApproval: boolean;

  @ApiProperty()
  requiresDocument: boolean;

  @ApiProperty({ enum: LeaveAccrualType })
  accrualType: LeaveAccrualType;

  @ApiProperty()
  allowHalfDay: boolean;

  @ApiProperty({ enum: LeaveTypeStatus })
  status: LeaveTypeStatus;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
