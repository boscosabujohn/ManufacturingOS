import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../entities/general-ledger.entity';

export class CreateGeneralLedgerDto {
  @ApiProperty({ description: 'Account ID from Chart of Accounts' })
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty({ description: 'Financial period ID' })
  @IsString()
  @IsNotEmpty()
  periodId: string;

  @ApiProperty({ description: 'Type of transaction', enum: TransactionType })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  transactionType: TransactionType;

  @ApiProperty({ description: 'Posting date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  postingDate: string;

  @ApiProperty({ description: 'Transaction date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  transactionDate: string;

  @ApiProperty({ description: 'Debit amount', default: 0 })
  @IsNumber()
  @Type(() => Number)
  debitAmount: number;

  @ApiProperty({ description: 'Credit amount', default: 0 })
  @IsNumber()
  @Type(() => Number)
  creditAmount: number;

  @ApiProperty({ description: 'Transaction description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Reference number', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  referenceNumber?: string;

  @ApiPropertyOptional({ description: 'Reference type', maxLength: 50 })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  referenceType?: string;

  @ApiPropertyOptional({ description: 'Reference document ID' })
  @IsString()
  @IsOptional()
  referenceId?: string;

  @ApiPropertyOptional({ description: 'Cost center', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  costCenter?: string;

  @ApiPropertyOptional({ description: 'Department', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  department?: string;

  @ApiPropertyOptional({ description: 'Project', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  project?: string;

  @ApiPropertyOptional({ description: 'Location', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  location?: string;

  @ApiPropertyOptional({ description: 'Party ID' })
  @IsString()
  @IsOptional()
  partyId?: string;

  @ApiPropertyOptional({ description: 'Party name', maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  partyName?: string;

  @ApiPropertyOptional({ description: 'Party type', maxLength: 50 })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  partyType?: string;

  @ApiPropertyOptional({ description: 'Currency code', default: 'INR' })
  @IsString()
  @IsOptional()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ description: 'Exchange rate', default: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  exchangeRate?: number;

  @ApiPropertyOptional({ description: 'Journal entry ID for grouping' })
  @IsString()
  @IsOptional()
  journalEntryId?: string;

  @ApiPropertyOptional({ description: 'Line number within journal entry' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  lineNumber?: number;
}
