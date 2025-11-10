import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsDateString,
  IsArray,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InvoiceType } from '../entities/purchase-invoice.entity';

export class CreatePurchaseInvoiceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vendorInvoiceNumber: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  invoiceDate: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @ApiProperty({ enum: InvoiceType })
  @IsEnum(InvoiceType)
  @IsNotEmpty()
  invoiceType: InvoiceType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  purchaseOrderId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  purchaseOrderNumber?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vendorName: string;

  @ApiProperty()
  @IsArray()
  items: any[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isReverseCharge?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdatePurchaseInvoiceDto extends CreatePurchaseInvoiceDto {}

export class PurchaseInvoiceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  internalInvoiceNumber: string;

  @ApiProperty()
  vendorInvoiceNumber: string;

  @ApiProperty()
  invoiceDate: Date;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  vendorName: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  paidAmount: number;

  @ApiProperty()
  balanceAmount: number;

  @ApiProperty()
  matchingStatus: string;

  @ApiProperty()
  isApproved: boolean;

  @ApiProperty()
  isPostedToAccounting: boolean;

  @ApiProperty()
  createdAt: Date;
}
