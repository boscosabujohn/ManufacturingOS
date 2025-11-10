import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PayrollStatus, PayrollPeriod } from '../entities/payroll.entity';

export class PayrollResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  payrollNumber: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: PayrollPeriod })
  period: PayrollPeriod;

  @ApiProperty()
  month: number;

  @ApiProperty()
  year: number;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  paymentDate: Date;

  @ApiProperty()
  totalEmployees: number;

  @ApiProperty()
  processedEmployees: number;

  @ApiProperty()
  totalGrossSalary: number;

  @ApiProperty()
  totalDeductions: number;

  @ApiProperty()
  totalNetSalary: number;

  @ApiProperty({ enum: PayrollStatus })
  status: PayrollStatus;

  @ApiProperty()
  isPosted: boolean;

  @ApiProperty()
  isPaid: boolean;

  @ApiPropertyOptional()
  remarks?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
