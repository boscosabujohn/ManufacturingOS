import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeaveApplicationStatus, LeavePeriod } from '../entities/leave-application.entity';

export class LeaveApplicationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  applicationNumber: string;

  @ApiProperty()
  employeeId: string;

  @ApiProperty()
  leaveTypeId: string;

  @ApiProperty()
  fromDate: Date;

  @ApiProperty()
  toDate: Date;

  @ApiProperty({ enum: LeavePeriod })
  fromDatePeriod: LeavePeriod;

  @ApiProperty({ enum: LeavePeriod })
  toDatePeriod: LeavePeriod;

  @ApiProperty()
  totalDays: number;

  @ApiProperty()
  reason: string;

  @ApiPropertyOptional()
  contactAddress?: string;

  @ApiPropertyOptional()
  contactPhone?: string;

  @ApiProperty()
  applicationDate: Date;

  @ApiProperty({ enum: LeaveApplicationStatus })
  status: LeaveApplicationStatus;

  @ApiPropertyOptional()
  approver1Id?: string;

  @ApiPropertyOptional()
  approver1Name?: string;

  @ApiPropertyOptional()
  approver1Remarks?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
