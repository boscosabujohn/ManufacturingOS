import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SalarySlipStatus } from '../entities/salary-slip.entity';

export class SalarySlipResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slipNumber: string;

  @ApiProperty()
  payrollId: string;

  @ApiProperty()
  employeeId: string;

  @ApiProperty()
  employeeCode: string;

  @ApiProperty()
  employeeName: string;

  @ApiPropertyOptional()
  designation?: string;

  @ApiPropertyOptional()
  department?: string;

  @ApiProperty()
  month: number;

  @ApiProperty()
  year: number;

  @ApiProperty()
  paymentDate: Date;

  @ApiProperty()
  workingDays: number;

  @ApiProperty()
  presentDays: number;

  @ApiProperty()
  earnings: any[];

  @ApiProperty()
  grossSalary: number;

  @ApiProperty()
  deductions: any[];

  @ApiProperty()
  totalDeductions: number;

  @ApiProperty()
  netSalary: number;

  @ApiProperty({ enum: SalarySlipStatus })
  status: SalarySlipStatus;

  @ApiProperty()
  isPaid: boolean;

  @ApiPropertyOptional()
  pdfUrl?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
