import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType, EntryStatus } from '../entities/general-ledger.entity';

export class GeneralLedgerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  accountId: string;

  @ApiProperty()
  periodId: string;

  @ApiProperty()
  transactionNumber: string;

  @ApiProperty({ enum: TransactionType })
  transactionType: TransactionType;

  @ApiProperty()
  postingDate: Date;

  @ApiProperty()
  transactionDate: Date;

  @ApiProperty()
  debitAmount: number;

  @ApiProperty()
  creditAmount: number;

  @ApiProperty()
  netAmount: number;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  referenceNumber?: string;

  @ApiPropertyOptional()
  referenceType?: string;

  @ApiPropertyOptional()
  referenceId?: string;

  @ApiPropertyOptional()
  costCenter?: string;

  @ApiPropertyOptional()
  department?: string;

  @ApiPropertyOptional()
  project?: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional()
  partyId?: string;

  @ApiPropertyOptional()
  partyName?: string;

  @ApiPropertyOptional()
  partyType?: string;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  exchangeRate: number;

  @ApiPropertyOptional()
  baseCurrencyAmount?: number;

  @ApiProperty({ enum: EntryStatus })
  status: EntryStatus;

  @ApiPropertyOptional()
  postedBy?: string;

  @ApiPropertyOptional()
  postedAt?: Date;

  @ApiProperty()
  isReversed: boolean;

  @ApiPropertyOptional()
  reversedBy?: string;

  @ApiPropertyOptional()
  reversedAt?: Date;

  @ApiPropertyOptional()
  reversalEntryId?: string;

  @ApiPropertyOptional()
  journalEntryId?: string;

  @ApiPropertyOptional()
  lineNumber?: number;

  @ApiProperty()
  isReconciled: boolean;

  @ApiPropertyOptional()
  reconciledDate?: Date;

  @ApiPropertyOptional()
  reconciledBy?: string;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  runningBalance?: number;
}
