import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  BankAccountType,
  AccountStatus,
} from '../entities/bank-account.entity';

export class BankAccountResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  accountCode: string;

  @ApiProperty()
  accountName: string;

  @ApiProperty()
  bankName: string;

  @ApiProperty()
  branchName: string;

  @ApiPropertyOptional()
  branchCode?: string;

  @ApiProperty()
  accountNumber: string;

  @ApiPropertyOptional()
  ifscCode?: string;

  @ApiPropertyOptional()
  swiftCode?: string;

  @ApiProperty({ enum: BankAccountType })
  accountType: BankAccountType;

  @ApiProperty()
  currency: string;

  @ApiProperty({ enum: AccountStatus })
  status: AccountStatus;

  @ApiPropertyOptional()
  glAccountId?: string;

  @ApiProperty()
  openingBalance: number;

  @ApiProperty()
  currentBalance: number;

  @ApiPropertyOptional()
  balanceAsOfDate?: Date;

  @ApiPropertyOptional()
  overdraftLimit?: number;

  @ApiPropertyOptional()
  minimumBalance?: number;

  @ApiProperty()
  isReconciledUptoDate: boolean;

  @ApiPropertyOptional()
  lastReconciledDate?: Date;

  @ApiPropertyOptional()
  lastReconciledBalance?: number;

  @ApiPropertyOptional()
  contactPerson?: string;

  @ApiPropertyOptional()
  contactPhone?: string;

  @ApiPropertyOptional()
  contactEmail?: string;

  @ApiPropertyOptional()
  address?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  state?: string;

  @ApiPropertyOptional()
  pincode?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiProperty()
  hasOnlineBanking: boolean;

  @ApiPropertyOptional()
  onlineBankingUrl?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  isDefault: boolean;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
