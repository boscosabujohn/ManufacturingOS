import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BudgetType } from '../entities/budget.entity';

export class BudgetLineDto {
  @ApiProperty({ description: 'Account ID' })
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty({ description: 'Account name' })
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @ApiProperty({ description: 'Account code' })
  @IsString()
  @IsNotEmpty()
  accountCode: string;

  @ApiProperty({ description: 'Annual budgeted amount' })
  @IsNumber()
  @Type(() => Number)
  annualBudgetedAmount: number;

  @ApiPropertyOptional({ description: 'Cost center' })
  @IsString()
  @IsOptional()
  costCenter?: string;

  @ApiPropertyOptional({ description: 'Department' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ description: 'Project' })
  @IsString()
  @IsOptional()
  project?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateBudgetDto {
  @ApiProperty({ description: 'Budget code', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  budgetCode: string;

  @ApiProperty({ description: 'Budget name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  budgetName: string;

  @ApiProperty({ description: 'Financial year ID' })
  @IsString()
  @IsNotEmpty()
  financialYearId: string;

  @ApiProperty({ description: 'Budget type', enum: BudgetType })
  @IsEnum(BudgetType)
  @IsNotEmpty()
  budgetType: BudgetType;

  @ApiProperty({ description: 'Start date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiPropertyOptional({ description: 'Department' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ description: 'Cost center' })
  @IsString()
  @IsOptional()
  costCenter?: string;

  @ApiPropertyOptional({ description: 'Project' })
  @IsString()
  @IsOptional()
  project?: string;

  @ApiPropertyOptional({ description: 'Location' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Budget lines', type: [BudgetLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetLineDto)
  lines: BudgetLineDto[];

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}
