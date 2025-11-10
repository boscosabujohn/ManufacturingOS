import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsArray,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentType, PaymentMethod } from '../entities/payment.entity';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Payment type', enum: PaymentType })
  @IsEnum(PaymentType)
  @IsNotEmpty()
  paymentType: PaymentType;

  @ApiProperty({ description: 'Payment date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  paymentDate: string;

  @ApiProperty({ description: 'Party ID (Customer/Vendor/Employee)' })
  @IsString()
  @IsNotEmpty()
  partyId: string;

  @ApiProperty({ description: 'Party name' })
  @IsString()
  @IsNotEmpty()
  partyName: string;

  @ApiProperty({ description: 'Party type' })
  @IsString()
  @IsNotEmpty()
  partyType: string;

  @ApiProperty({ description: 'Payment method', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @ApiProperty({ description: 'Payment amount' })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  amount: number;

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

  @ApiPropertyOptional({ description: 'Bank account ID' })
  @IsString()
  @IsOptional()
  bankAccountId?: string;

  @ApiPropertyOptional({ description: 'Bank name' })
  @IsString()
  @IsOptional()
  bankName?: string;

  @ApiPropertyOptional({ description: 'Cheque number' })
  @IsString()
  @IsOptional()
  chequeNumber?: string;

  @ApiPropertyOptional({ description: 'Cheque date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  chequeDate?: string;

  @ApiPropertyOptional({ description: 'Transaction reference (UTR, etc.)' })
  @IsString()
  @IsOptional()
  transactionReference?: string;

  @ApiPropertyOptional({
    description: 'Invoice allocations',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        invoiceId: { type: 'string' },
        invoiceNumber: { type: 'string' },
        invoiceAmount: { type: 'number' },
        allocatedAmount: { type: 'number' },
      },
    },
  })
  @IsArray()
  @IsOptional()
  invoiceAllocations?: Array<{
    invoiceId: string;
    invoiceNumber: string;
    invoiceAmount: number;
    allocatedAmount: number;
  }>;

  @ApiPropertyOptional({ description: 'Has TDS deduction', default: false })
  @IsBoolean()
  @IsOptional()
  hasTDS?: boolean;

  @ApiPropertyOptional({ description: 'TDS amount', default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  tdsAmount?: number;

  @ApiPropertyOptional({ description: 'TDS rate' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  tdsRate?: number;

  @ApiPropertyOptional({ description: 'TDS section' })
  @IsString()
  @IsOptional()
  tdsSection?: string;

  @ApiPropertyOptional({ description: 'Reference number' })
  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @ApiPropertyOptional({ description: 'Payment description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}
