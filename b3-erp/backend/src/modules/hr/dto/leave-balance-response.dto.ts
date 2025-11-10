import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LeaveBalanceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  employeeId: string;

  @ApiProperty()
  leaveTypeId: string;

  @ApiProperty()
  year: number;

  @ApiProperty()
  openingBalance: number;

  @ApiProperty()
  allocated: number;

  @ApiProperty()
  earned: number;

  @ApiProperty()
  used: number;

  @ApiProperty()
  pending: number;

  @ApiProperty()
  available: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
