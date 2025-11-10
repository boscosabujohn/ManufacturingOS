import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JournalType, JournalStatus } from '../entities/journal-entry.entity';

export class JournalEntryLineResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  journalEntryId: string;

  @ApiProperty()
  lineNumber: number;

  @ApiProperty()
  accountId: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  debitAmount: number;

  @ApiProperty()
  creditAmount: number;

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

  @ApiPropertyOptional()
  generalLedgerId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class JournalEntryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  journalNumber: string;

  @ApiProperty({ enum: JournalType })
  journalType: JournalType;

  @ApiProperty()
  periodId: string;

  @ApiProperty()
  journalDate: Date;

  @ApiProperty()
  postingDate: Date;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  referenceNumber?: string;

  @ApiProperty({ enum: JournalStatus })
  status: JournalStatus;

  @ApiProperty()
  totalDebit: number;

  @ApiProperty()
  totalCredit: number;

  @ApiProperty()
  isBalanced: boolean;

  @ApiProperty()
  isRecurring: boolean;

  @ApiPropertyOptional()
  recurrencePattern?: string;

  @ApiPropertyOptional()
  recurrenceStartDate?: Date;

  @ApiPropertyOptional()
  recurrenceEndDate?: Date;

  @ApiPropertyOptional()
  recurrenceCount?: number;

  @ApiPropertyOptional()
  nextRecurrenceDate?: Date;

  @ApiProperty()
  isTemplate: boolean;

  @ApiPropertyOptional()
  templateName?: string;

  @ApiPropertyOptional()
  submittedBy?: string;

  @ApiPropertyOptional()
  submittedAt?: Date;

  @ApiPropertyOptional()
  approvedBy?: string;

  @ApiPropertyOptional()
  approvedAt?: Date;

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
  reversalJournalId?: string;

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

  @ApiProperty({ type: [JournalEntryLineResponseDto] })
  lines: JournalEntryLineResponseDto[];
}
