import { IsString, IsEnum, IsNotEmpty, IsDateString, IsNumber, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PayrollPeriod } from '../entities/payroll.entity';

export class CreatePayrollDto {
  @ApiProperty({ description: 'Payroll title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Payroll period', enum: PayrollPeriod })
  @IsEnum(PayrollPeriod)
  period: PayrollPeriod;

  @ApiProperty({ description: 'Month (1-12)' })
  @IsNumber()
  @Type(() => Number)
  month: number;

  @ApiProperty({ description: 'Year' })
  @IsNumber()
  @Type(() => Number)
  year: number;

  @ApiProperty({ description: 'Start date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ description: 'Payment date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  paymentDate: string;

  @ApiPropertyOptional({ description: 'Included departments', type: [String] })
  @IsArray()
  @IsOptional()
  includedDepartments?: string[];

  @ApiPropertyOptional({ description: 'Excluded employees', type: [String] })
  @IsArray()
  @IsOptional()
  excludedEmployees?: string[];

  @ApiPropertyOptional({ description: 'Remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;
}
