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
import {
  AccountType,
  AccountSubType,
  BalanceType,
} from '../entities/chart-of-accounts.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChartOfAccountsDto {
  @ApiProperty({ description: 'Unique account code', maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  accountCode: string;

  @ApiProperty({ description: 'Account name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  accountName: string;

  @ApiProperty({ description: 'Type of account', enum: AccountType })
  @IsEnum(AccountType)
  @IsNotEmpty()
  accountType: AccountType;

  @ApiProperty({ description: 'Sub-type of account', enum: AccountSubType })
  @IsEnum(AccountSubType)
  @IsNotEmpty()
  accountSubType: AccountSubType;

  @ApiProperty({ description: 'Normal balance type', enum: BalanceType })
  @IsEnum(BalanceType)
  @IsNotEmpty()
  normalBalance: BalanceType;

  @ApiPropertyOptional({ description: 'Account description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Parent account ID for hierarchical structure' })
  @IsString()
  @IsOptional()
  parentAccountId?: string;

  @ApiPropertyOptional({ description: 'Level in account hierarchy', default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  level?: number;

  @ApiPropertyOptional({ description: 'Is account active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Can transactions be posted directly to this account',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  allowPosting?: boolean;

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

  @ApiPropertyOptional({ description: 'Location', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  location?: string;

  @ApiPropertyOptional({ description: 'Is this a tax account', default: false })
  @IsBoolean()
  @IsOptional()
  isTaxAccount?: boolean;

  @ApiPropertyOptional({ description: 'Tax type (GST, TDS, etc.)', maxLength: 50 })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  taxType?: string;

  @ApiPropertyOptional({ description: 'Currency code', default: 'INR' })
  @IsString()
  @IsOptional()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({
    description: 'Allow multi-currency transactions',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  allowMultiCurrency?: boolean;

  @ApiPropertyOptional({ description: 'Opening balance', default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  openingBalance?: number;

  @ApiPropertyOptional({
    description: 'Requires reconciliation',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  requiresReconciliation?: boolean;
}
