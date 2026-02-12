import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsArray, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Loan Type DTOs
export class CreateLoanTypeDto {
  @ApiProperty({ description: 'Loan type code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Loan type name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Maximum loan amount' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxAmount?: number;

  @ApiPropertyOptional({ description: 'Maximum tenure in months' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxTenureMonths?: number;

  @ApiProperty({ description: 'Interest type', enum: ['None', 'Simple', 'Compound'] })
  @IsString()
  @IsNotEmpty()
  interestType: string;

  @ApiPropertyOptional({ description: 'Default interest rate' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  defaultInterestRate?: number;

  @ApiPropertyOptional({ description: 'Processing fee percentage' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  processingFeePercent?: number;

  @ApiPropertyOptional({ description: 'Minimum service months to be eligible' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minServiceMonths?: number;

  @ApiPropertyOptional({ description: 'Maximum loan as multiple of salary' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxLoanMultiplier?: number;

  @ApiPropertyOptional({ description: 'Requires guarantor' })
  @IsBoolean()
  @IsOptional()
  requiresGuarantor?: boolean;

  @ApiProperty({ description: 'Company ID' })
  @IsString()
  @IsNotEmpty()
  companyId: string;
}

export class UpdateLoanTypeDto {
  @ApiPropertyOptional({ description: 'Loan type name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Maximum loan amount' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxAmount?: number;

  @ApiPropertyOptional({ description: 'Maximum tenure in months' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxTenureMonths?: number;

  @ApiPropertyOptional({ description: 'Default interest rate' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  defaultInterestRate?: number;

  @ApiPropertyOptional({ description: 'Is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

// Employee Loan DTOs
export class CreateEmployeeLoanDto {
  @ApiProperty({ description: 'Loan type ID' })
  @IsString()
  @IsNotEmpty()
  loanTypeId: string;

  @ApiProperty({ description: 'Employee ID' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ description: 'Requested amount' })
  @IsNumber()
  @Type(() => Number)
  requestedAmount: number;

  @ApiPropertyOptional({ description: 'Interest rate (optional, uses loan type default)' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  interestRate?: number;

  @ApiProperty({ description: 'Tenure in months' })
  @IsNumber()
  @Type(() => Number)
  tenureMonths: number;

  @ApiPropertyOptional({ description: 'Guarantor employee ID' })
  @IsString()
  @IsOptional()
  guarantorId?: string;

  @ApiPropertyOptional({ description: 'Remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiProperty({ description: 'Company ID' })
  @IsString()
  @IsNotEmpty()
  companyId: string;
}

export class ApproveLoanDto {
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

export class RejectLoanDto {
  @ApiProperty({ description: 'Rejection reason' })
  @IsString()
  @IsNotEmpty()
  rejectionReason: string;
}

export class LoanTypeResponseDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  maxAmount?: number;
  maxTenureMonths?: number;
  interestType: string;
  defaultInterestRate: number;
  processingFeePercent: number;
  minServiceMonths: number;
  maxLoanMultiplier?: number;
  requiresGuarantor: boolean;
  isActive: boolean;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class EmployeeLoanResponseDto {
  id: string;
  loanNumber: string;
  loanTypeId: string;
  loanType?: LoanTypeResponseDto;
  employeeId: string;
  requestDate: Date;
  requestedAmount: number;
  approvedAmount?: number;
  interestRate: number;
  tenureMonths: number;
  emiAmount?: number;
  processingFee: number;
  totalRepayable?: number;
  disbursementDate?: Date;
  repaymentStartDate?: Date;
  repaymentEndDate?: Date;
  outstandingBalance?: number;
  paidEMIs: number;
  remainingEMIs?: number;
  status: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  guarantorId?: string;
  remarks?: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class LoanRepaymentResponseDto {
  id: string;
  loanId: string;
  emiNumber: number;
  dueDate: Date;
  principalAmount: number;
  interestAmount: number;
  emiAmount: number;
  paidAmount: number;
  balanceAfterEMI: number;
  status: string;
  deductionDate?: Date;
  payslipId?: string;
  paymentMode?: string;
  remarks?: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}
