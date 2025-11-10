import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AttendanceStatus, AttendanceType } from '../entities/attendance.entity';

export class AttendanceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  employeeId: string;

  @ApiProperty()
  date: Date;

  @ApiPropertyOptional()
  shiftId?: string;

  @ApiPropertyOptional()
  checkInTime?: string;

  @ApiPropertyOptional()
  checkOutTime?: string;

  @ApiProperty()
  workingHours: number;

  @ApiProperty()
  overtimeHours: number;

  @ApiProperty({ enum: AttendanceStatus })
  status: AttendanceStatus;

  @ApiProperty({ enum: AttendanceType })
  type: AttendanceType;

  @ApiPropertyOptional()
  remarks?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
