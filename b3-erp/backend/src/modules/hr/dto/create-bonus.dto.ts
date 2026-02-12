import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Bonus Type DTOs
export class CreateBonusTypeDto {
  @ApiProperty({ description: 'Bonus type code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Bonus type name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Calculation type', enum: ['Fixed', 'PercentageOfBasic', 'PercentageOfGross', 'PercentageOfCTC', 'Custom'] })
  @IsString()
  @IsNotEmpty()
  calculationType: string;

  @ApiPropertyOptional({ description: 'Default percentage' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  defaultPercent?: number;

  @ApiPropertyOptional({ description: 'Default amount' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  defaultAmount?: number;

  @ApiProperty({ description: 'Frequency', enum: ['Annual', 'Quarterly', 'Monthly', 'OneTime'] })
  @IsString()
  @IsNotEmpty()
  frequency: string;

  @ApiPropertyOptional({ description: 'Is taxable' })
  @IsBoolean()
  @IsOptional()
  taxable?: boolean;

  @ApiPropertyOptional({ description: 'Is statutory bonus' })
  @IsBoolean()
  @IsOptional()
  isStatutory?: boolean;

  @ApiPropertyOptional({ description: 'Minimum days worked' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minDaysWorked?: number;

  @ApiProperty({ description: 'Company ID' })
  @IsString()
  @IsNotEmpty()
  companyId: string;
}

export class UpdateBonusTypeDto {
  @ApiPropertyOptional({ description: 'Bonus type name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Calculation type' })
  @IsString()
  @IsOptional()
  calculationType?: string;

  @ApiPropertyOptional({ description: 'Default percentage' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  defaultPercent?: number;

  @ApiPropertyOptional({ description: 'Default amount' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  defaultAmount?: number;

  @ApiPropertyOptional({ description: 'Frequency' })
  @IsString()
  @IsOptional()
  frequency?: string;

  @ApiPropertyOptional({ description: 'Is taxable' })
  @IsBoolean()
  @IsOptional()
  taxable?: boolean;

  @ApiPropertyOptional({ description: 'Is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

// Bonus Calculation DTOs
export class CreateBonusCalculationDto {
  @ApiProperty({ description: 'Bonus type ID' })
  @IsString()
  @IsNotEmpty()
  bonusTypeId: string;

  @ApiProperty({ description: 'Employee ID' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ description: 'Financial year', example: '2024-25' })
  @IsString()
  @IsNotEmpty()
  financialYear: string;

  @ApiPropertyOptional({ description: 'Period for quarterly bonus', enum: ['Q1', 'Q2', 'Q3', 'Q4'] })
  @IsString()
  @IsOptional()
  period?: string;

  @ApiProperty({ description: 'Eligible days' })
  @IsNumber()
  @Type(() => Number)
  eligibleDays: number;

  @ApiProperty({ description: 'Bonusable amount (base for calculation)' })
  @IsNumber()
  @Type(() => Number)
  bonusableAmount: number;

  @ApiPropertyOptional({ description: 'Calculated amount (optional, will be auto-calculated)' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  calculatedAmount?: number;

  @ApiPropertyOptional({ description: 'Adjustments' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  adjustments?: number;

  @ApiPropertyOptional({ description: 'Tax deducted' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  taxDeducted?: number;

  @ApiPropertyOptional({ description: 'Remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiProperty({ description: 'Company ID' })
  @IsString()
  @IsNotEmpty()
  companyId: string;
}

export class UpdateBonusCalculationDto {
  @ApiPropertyOptional({ description: 'Eligible days' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  eligibleDays?: number;

  @ApiPropertyOptional({ description: 'Calculated amount' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  calculatedAmount?: number;

  @ApiPropertyOptional({ description: 'Adjustments' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  adjustments?: number;

  @ApiPropertyOptional({ description: 'Tax deducted' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  taxDeducted?: number;

  @ApiPropertyOptional({ description: 'Remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;
}

export class BonusTypeResponseDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  calculationType: string;
  defaultPercent?: number;
  defaultAmount?: number;
  frequency: string;
  taxable: boolean;
  isStatutory: boolean;
  minDaysWorked?: number;
  isActive: boolean;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class BonusCalculationResponseDto {
  id: string;
  bonusTypeId: string;
  bonusType?: BonusTypeResponseDto;
  employeeId: string;
  financialYear: string;
  period?: string;
  eligibleDays: number;
  bonusableAmount: number;
  calculatedAmount: number;
  adjustments: number;
  finalAmount: number;
  taxDeducted: number;
  netAmount: number;
  status: string;
  approvedBy?: string;
  approvedAt?: Date;
  paidOn?: Date;
  payslipId?: string;
  remarks?: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}
