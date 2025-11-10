import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AccountType,
  AccountSubType,
  BalanceType,
} from '../entities/chart-of-accounts.entity';

export class ChartOfAccountsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  accountCode: string;

  @ApiProperty()
  accountName: string;

  @ApiProperty({ enum: AccountType })
  accountType: AccountType;

  @ApiProperty({ enum: AccountSubType })
  accountSubType: AccountSubType;

  @ApiProperty({ enum: BalanceType })
  normalBalance: BalanceType;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  parentAccountId?: string;

  @ApiProperty()
  level: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  allowPosting: boolean;

  @ApiProperty()
  isSystemAccount: boolean;

  @ApiPropertyOptional()
  costCenter?: string;

  @ApiPropertyOptional()
  department?: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiProperty()
  isTaxAccount: boolean;

  @ApiPropertyOptional()
  taxType?: string;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  allowMultiCurrency: boolean;

  @ApiProperty()
  openingBalance: number;

  @ApiProperty()
  currentBalance: number;

  @ApiProperty()
  debitTotal: number;

  @ApiProperty()
  creditTotal: number;

  @ApiProperty()
  requiresReconciliation: boolean;

  @ApiPropertyOptional()
  lastReconciledDate?: Date;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  hasChildren?: boolean;
}
