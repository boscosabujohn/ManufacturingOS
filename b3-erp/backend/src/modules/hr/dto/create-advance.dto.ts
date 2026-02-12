import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Salary Advance DTOs
export class CreateSalaryAdvanceDto {
  @ApiProperty({ description: 'Employee ID' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ description: 'Requested amount' })
  @IsNumber()
  @Type(() => Number)
  requestedAmount: number;

  @ApiPropertyOptional({ description: 'Purpose/reason' })
  @IsString()
  @IsOptional()
  purpose?: string;

  @ApiPropertyOptional({ description: 'Repayment months', default: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  repaymentMonths?: number;

  @ApiPropertyOptional({ description: 'Remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiProperty({ description: 'Company ID' })
  @IsString()
  @IsNotEmpty()
  companyId: string;
}

export class UpdateSalaryAdvanceDto {
  @ApiPropertyOptional({ description: 'Requested amount' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  requestedAmount?: number;

  @ApiPropertyOptional({ description: 'Purpose/reason' })
  @IsString()
  @IsOptional()
  purpose?: string;

  @ApiPropertyOptional({ description: 'Repayment months' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  repaymentMonths?: number;

  @ApiPropertyOptional({ description: 'Remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;
}

export class ApproveAdvanceDto {
  @ApiProperty({ description: 'Approved by (user ID)' })
  @IsString()
  @IsNotEmpty()
  approvedBy: string;

  @ApiPropertyOptional({ description: 'Approved amount (optional, uses requested amount)' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  approvedAmount?: number;
}

export class RejectAdvanceDto {
  @ApiProperty({ description: 'Rejection reason' })
  @IsString()
  @IsNotEmpty()
  rejectionReason: string;
}

export class SalaryAdvanceResponseDto {
  id: string;
  advanceNumber: string;
  employeeId: string;
  requestDate: Date;
  requestedAmount: number;
  approvedAmount?: number;
  purpose?: string;
  repaymentMonths: number;
  monthlyDeduction?: number;
  disbursementDate?: Date;
  status: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  paidAmount: number;
  balanceAmount?: number;
  remarks?: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AdvanceRecoveryResponseDto {
  id: string;
  advanceId: string;
  installmentNumber: number;
  dueDate: Date;
  amount: number;
  paidAmount: number;
  balanceAfter: number;
  status: string;
  deductionDate?: Date;
  payslipId?: string;
  remarks?: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}
