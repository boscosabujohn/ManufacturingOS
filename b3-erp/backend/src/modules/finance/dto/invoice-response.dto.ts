import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InvoiceType, InvoiceStatus } from '../entities/invoice.entity';

export class InvoiceLineResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  invoiceId: string;

  @ApiProperty()
  lineNumber: number;

  @ApiPropertyOptional()
  productId?: string;

  @ApiProperty()
  productName: string;

  @ApiPropertyOptional()
  productCode?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unit: string;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  discountPercentage: number;

  @ApiProperty()
  discountAmount: number;

  @ApiProperty()
  taxRate: number;

  @ApiProperty()
  taxAmount: number;

  @ApiProperty()
  totalAmount: number;

  @ApiPropertyOptional()
  glAccountId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class InvoiceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  invoiceNumber: string;

  @ApiProperty({ enum: InvoiceType })
  invoiceType: InvoiceType;

  @ApiProperty()
  invoiceDate: Date;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty()
  partyId: string;

  @ApiProperty()
  partyName: string;

  @ApiProperty()
  partyType: string;

  @ApiPropertyOptional()
  billingAddress?: string;

  @ApiPropertyOptional()
  shippingAddress?: string;

  @ApiPropertyOptional()
  referenceNumber?: string;

  @ApiPropertyOptional()
  referenceId?: string;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  taxAmount: number;

  @ApiProperty()
  discountAmount: number;

  @ApiProperty()
  shippingCharges: number;

  @ApiProperty()
  otherCharges: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  paidAmount: number;

  @ApiProperty()
  balanceAmount: number;

  @ApiPropertyOptional()
  paymentTerms?: string;

  @ApiProperty()
  creditDays: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  exchangeRate: number;

  @ApiProperty({ enum: InvoiceStatus })
  status: InvoiceStatus;

  @ApiProperty()
  isPosted: boolean;

  @ApiPropertyOptional()
  journalEntryId?: string;

  @ApiPropertyOptional()
  postedAt?: Date;

  @ApiPropertyOptional()
  postedBy?: string;

  @ApiPropertyOptional()
  terms?: string;

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

  @ApiProperty({ type: [InvoiceLineResponseDto] })
  lines: InvoiceLineResponseDto[];
}
