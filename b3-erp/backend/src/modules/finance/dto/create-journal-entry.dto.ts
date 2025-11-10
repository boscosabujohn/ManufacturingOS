import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JournalType } from '../entities/journal-entry.entity';

export class JournalEntryLineDto {
  @ApiProperty({ description: 'Line number' })
  @IsNumber()
  @Type(() => Number)
  lineNumber: number;

  @ApiProperty({ description: 'Account ID from Chart of Accounts' })
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty({ description: 'Line description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Debit amount', default: 0 })
  @IsNumber()
  @Type(() => Number)
  debitAmount: number;

  @ApiProperty({ description: 'Credit amount', default: 0 })
  @IsNumber()
  @Type(() => Number)
  creditAmount: number;

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

  @ApiPropertyOptional({ description: 'Location' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: 'Party ID' })
  @IsString()
  @IsOptional()
  partyId?: string;

  @ApiPropertyOptional({ description: 'Party name' })
  @IsString()
  @IsOptional()
  partyName?: string;

  @ApiPropertyOptional({ description: 'Party type' })
  @IsString()
  @IsOptional()
  partyType?: string;
}

export class CreateJournalEntryDto {
  @ApiProperty({ description: 'Journal type', enum: JournalType })
  @IsEnum(JournalType)
  @IsNotEmpty()
  journalType: JournalType;

  @ApiProperty({ description: 'Financial period ID' })
  @IsString()
  @IsNotEmpty()
  periodId: string;

  @ApiProperty({ description: 'Journal date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  journalDate: string;

  @ApiProperty({ description: 'Posting date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  postingDate: string;

  @ApiProperty({ description: 'Journal entry description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Reference number' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  referenceNumber?: string;

  @ApiProperty({
    description: 'Journal entry lines',
    type: [JournalEntryLineDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JournalEntryLineDto)
  lines: JournalEntryLineDto[];

  @ApiPropertyOptional({ description: 'Is this a recurring journal', default: false })
  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @ApiPropertyOptional({ description: 'Recurrence pattern' })
  @IsString()
  @IsOptional()
  recurrencePattern?: string;

  @ApiPropertyOptional({ description: 'Recurrence start date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  recurrenceStartDate?: string;

  @ApiPropertyOptional({ description: 'Recurrence end date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  recurrenceEndDate?: string;

  @ApiPropertyOptional({ description: 'Is this a template', default: false })
  @IsBoolean()
  @IsOptional()
  isTemplate?: boolean;

  @ApiPropertyOptional({ description: 'Template name' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  templateName?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}
