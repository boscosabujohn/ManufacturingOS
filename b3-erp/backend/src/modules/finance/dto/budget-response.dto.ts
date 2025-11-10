import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BudgetType, BudgetStatus } from '../entities/budget.entity';

export class BudgetLineResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  budgetId: string;

  @ApiProperty()
  accountId: string;

  @ApiProperty()
  accountName: string;

  @ApiProperty()
  accountCode: string;

  @ApiPropertyOptional()
  periodWiseBudget?: Array<{
    periodId: string;
    periodName: string;
    budgetedAmount: number;
    actualAmount: number;
    variance: number;
  }>;

  @ApiProperty()
  annualBudgetedAmount: number;

  @ApiProperty()
  annualActualAmount: number;

  @ApiProperty()
  annualVariance: number;

  @ApiProperty()
  utilizationPercentage: number;

  @ApiPropertyOptional()
  costCenter?: string;

  @ApiPropertyOptional()
  department?: string;

  @ApiPropertyOptional()
  project?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class BudgetResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  budgetCode: string;

  @ApiProperty()
  budgetName: string;

  @ApiProperty()
  financialYearId: string;

  @ApiProperty({ enum: BudgetType })
  budgetType: BudgetType;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({ enum: BudgetStatus })
  status: BudgetStatus;

  @ApiPropertyOptional()
  department?: string;

  @ApiPropertyOptional()
  costCenter?: string;

  @ApiPropertyOptional()
  project?: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiProperty()
  totalBudgetedAmount: number;

  @ApiProperty()
  totalActualAmount: number;

  @ApiProperty()
  totalVariance: number;

  @ApiProperty()
  utilizationPercentage: number;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  submittedBy?: string;

  @ApiPropertyOptional()
  submittedAt?: Date;

  @ApiPropertyOptional()
  approvedBy?: string;

  @ApiPropertyOptional()
  approvedAt?: Date;

  @ApiProperty()
  version: number;

  @ApiPropertyOptional()
  previousVersionId?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [BudgetLineResponseDto] })
  lines: BudgetLineResponseDto[];
}
