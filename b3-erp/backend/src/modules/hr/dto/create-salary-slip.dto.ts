import { IsString, IsNotEmpty, IsNumber, IsDateString, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSalarySlipDto {
  @ApiProperty({ description: 'Payroll ID' })
  @IsString()
  @IsNotEmpty()
  payrollId: string;

  @ApiProperty({ description: 'Employee ID' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ description: 'Month (1-12)' })
  @IsNumber()
  @Type(() => Number)
  month: number;

  @ApiProperty({ description: 'Year' })
  @IsNumber()
  @Type(() => Number)
  year: number;

  @ApiProperty({ description: 'Payment date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  paymentDate: string;

  @ApiProperty({ description: 'Working days' })
  @IsNumber()
  @Type(() => Number)
  workingDays: number;

  @ApiProperty({ description: 'Present days' })
  @IsNumber()
  @Type(() => Number)
  presentDays: number;

  @ApiProperty({ description: 'Earnings' })
  @IsArray()
  earnings: Array<{
    component: string;
    amount: number;
    isTaxable: boolean;
  }>;

  @ApiProperty({ description: 'Gross salary' })
  @IsNumber()
  @Type(() => Number)
  grossSalary: number;

  @ApiProperty({ description: 'Deductions' })
  @IsArray()
  deductions: Array<{
    component: string;
    amount: number;
  }>;

  @ApiProperty({ description: 'Total deductions' })
  @IsNumber()
  @Type(() => Number)
  totalDeductions: number;

  @ApiProperty({ description: 'Net salary' })
  @IsNumber()
  @Type(() => Number)
  netSalary: number;

  @ApiPropertyOptional({ description: 'Remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;
}
