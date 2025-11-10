import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PaymentType,
  PaymentMethod,
  PaymentStatus,
} from '../entities/payment.entity';

export class PaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  paymentNumber: string;

  @ApiProperty({ enum: PaymentType })
  paymentType: PaymentType;

  @ApiProperty()
  paymentDate: Date;

  @ApiProperty()
  partyId: string;

  @ApiProperty()
  partyName: string;

  @ApiProperty()
  partyType: string;

  @ApiProperty({ enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  exchangeRate: number;

  @ApiPropertyOptional()
  baseCurrencyAmount?: number;

  @ApiPropertyOptional()
  bankAccountId?: string;

  @ApiPropertyOptional()
  bankName?: string;

  @ApiPropertyOptional()
  chequeNumber?: string;

  @ApiPropertyOptional()
  chequeDate?: Date;

  @ApiPropertyOptional()
  transactionReference?: string;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiPropertyOptional()
  invoiceAllocations?: Array<{
    invoiceId: string;
    invoiceNumber: string;
    invoiceAmount: number;
    allocatedAmount: number;
  }>;

  @ApiProperty()
  isPosted: boolean;

  @ApiPropertyOptional()
  journalEntryId?: string;

  @ApiPropertyOptional()
  postedAt?: Date;

  @ApiPropertyOptional()
  postedBy?: string;

  @ApiProperty()
  isReconciled: boolean;

  @ApiPropertyOptional()
  reconciledDate?: Date;

  @ApiPropertyOptional()
  reconciledBy?: string;

  @ApiProperty()
  isBounced: boolean;

  @ApiPropertyOptional()
  bouncedDate?: Date;

  @ApiPropertyOptional()
  bounceReason?: string;

  @ApiProperty()
  hasTDS: boolean;

  @ApiProperty()
  tdsAmount: number;

  @ApiPropertyOptional()
  tdsRate?: number;

  @ApiPropertyOptional()
  tdsSection?: string;

  @ApiPropertyOptional()
  referenceNumber?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  approvedBy?: string;

  @ApiPropertyOptional()
  approvedAt?: Date;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
