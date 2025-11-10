import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BankAccountType } from '../entities/bank-account.entity';

export class CreateBankAccountDto {
  @ApiProperty({ description: 'Unique account code', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  accountCode: string;

  @ApiProperty({ description: 'Account name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  accountName: string;

  @ApiProperty({ description: 'Bank name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  bankName: string;

  @ApiProperty({ description: 'Branch name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  branchName: string;

  @ApiPropertyOptional({ description: 'Branch code', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  branchCode?: string;

  @ApiProperty({ description: 'Account number', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  accountNumber: string;

  @ApiPropertyOptional({ description: 'IFSC code', maxLength: 50 })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  ifscCode?: string;

  @ApiPropertyOptional({ description: 'SWIFT code', maxLength: 50 })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  swiftCode?: string;

  @ApiProperty({ description: 'Account type', enum: BankAccountType })
  @IsEnum(BankAccountType)
  @IsNotEmpty()
  accountType: BankAccountType;

  @ApiPropertyOptional({ description: 'Currency code', default: 'INR' })
  @IsString()
  @IsOptional()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ description: 'GL account ID for linking' })
  @IsString()
  @IsOptional()
  glAccountId?: string;

  @ApiPropertyOptional({ description: 'Opening balance', default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  openingBalance?: number;

  @ApiPropertyOptional({ description: 'Overdraft limit' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  overdraftLimit?: number;

  @ApiPropertyOptional({ description: 'Minimum balance' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minimumBalance?: number;

  @ApiPropertyOptional({ description: 'Contact person', maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  contactPerson?: string;

  @ApiPropertyOptional({ description: 'Contact phone', maxLength: 50 })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'Contact email', maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'City', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ description: 'State', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({ description: 'Pincode', maxLength: 20 })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  pincode?: string;

  @ApiPropertyOptional({ description: 'Country', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ description: 'Has online banking', default: false })
  @IsBoolean()
  @IsOptional()
  hasOnlineBanking?: boolean;

  @ApiPropertyOptional({ description: 'Online banking URL' })
  @IsString()
  @IsOptional()
  onlineBankingUrl?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Is default account', default: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
