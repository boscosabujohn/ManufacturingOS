import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InvoiceType } from '../entities/invoice.entity';

export class InvoiceLineDto {
  @ApiProperty({ description: 'Line number' })
  @IsNumber()
  @Type(() => Number)
  lineNumber: number;

  @ApiPropertyOptional({ description: 'Product ID' })
  @IsString()
  @IsOptional()
  productId?: string;

  @ApiProperty({ description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiPropertyOptional({ description: 'Product code' })
  @IsString()
  @IsOptional()
  productCode?: string;

  @ApiPropertyOptional({ description: 'Line description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Quantity' })
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ description: 'Unit of measure' })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({ description: 'Unit price' })
  @IsNumber()
  @Type(() => Number)
  unitPrice: number;

  @ApiPropertyOptional({ description: 'Discount percentage', default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  discountPercentage?: number;

  @ApiPropertyOptional({ description: 'Discount amount', default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  discountAmount?: number;

  @ApiPropertyOptional({ description: 'Tax rate', default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  taxRate?: number;

  @ApiPropertyOptional({ description: 'Tax amount', default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  taxAmount?: number;

  @ApiPropertyOptional({ description: 'GL account ID for revenue/expense' })
  @IsString()
  @IsOptional()
  glAccountId?: string;
}

export class CreateInvoiceDto {
  @ApiProperty({ description: 'Type of invoice', enum: InvoiceType })
  @IsEnum(InvoiceType)
  @IsNotEmpty()
  invoiceType: InvoiceType;

  @ApiProperty({ description: 'Invoice date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  invoiceDate: string;

  @ApiProperty({ description: 'Due date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @ApiProperty({ description: 'Customer/Vendor ID' })
  @IsString()
  @IsNotEmpty()
  partyId: string;

  @ApiProperty({ description: 'Customer/Vendor name' })
  @IsString()
  @IsNotEmpty()
  partyName: string;

  @ApiProperty({ description: 'Party type (Customer/Vendor)' })
  @IsString()
  @IsNotEmpty()
  partyType: string;

  @ApiPropertyOptional({ description: 'Billing address' })
  @IsString()
  @IsOptional()
  billingAddress?: string;

  @ApiPropertyOptional({ description: 'Shipping address' })
  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @ApiPropertyOptional({ description: 'Reference number (PO, SO, etc.)' })
  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @ApiPropertyOptional({ description: 'Reference document ID' })
  @IsString()
  @IsOptional()
  referenceId?: string;

  @ApiProperty({ description: 'Invoice lines', type: [InvoiceLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceLineDto)
  lines: InvoiceLineDto[];

  @ApiPropertyOptional({ description: 'Discount amount', default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  discountAmount?: number;

  @ApiPropertyOptional({ description: 'Shipping charges', default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  shippingCharges?: number;

  @ApiPropertyOptional({ description: 'Other charges', default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  otherCharges?: number;

  @ApiPropertyOptional({ description: 'Payment terms' })
  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @ApiPropertyOptional({ description: 'Credit days', default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  creditDays?: number;

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

  @ApiPropertyOptional({ description: 'Terms and conditions' })
  @IsString()
  @IsOptional()
  terms?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}
