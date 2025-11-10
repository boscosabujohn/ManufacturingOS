import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PeriodType,
  PeriodStatus,
} from '../entities/financial-period.entity';

export class FinancialPeriodResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  financialYearId: string;

  @ApiProperty()
  periodCode: string;

  @ApiProperty()
  periodName: string;

  @ApiProperty({ enum: PeriodType })
  periodType: PeriodType;

  @ApiProperty()
  periodNumber: number;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({ enum: PeriodStatus })
  status: PeriodStatus;

  @ApiProperty()
  isCurrent: boolean;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  closedBy?: string;

  @ApiPropertyOptional()
  closedAt?: Date;

  @ApiPropertyOptional()
  openedBy?: string;

  @ApiPropertyOptional()
  openedAt?: Date;

  @ApiPropertyOptional()
  closingChecklist?: Array<{
    taskName: string;
    completed: boolean;
    completedBy?: string;
    completedAt?: Date;
  }>;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class FinancialYearResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  yearCode: string;

  @ApiProperty()
  yearName: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({ enum: PeriodStatus })
  status: PeriodStatus;

  @ApiProperty()
  isCurrent: boolean;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  closedBy?: string;

  @ApiPropertyOptional()
  closedAt?: Date;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
