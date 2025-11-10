import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CustomerType,
  CustomerStatus,
  CreditRating,
} from '../entities/customer.entity';

export class CustomerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customerCode: string;

  @ApiProperty()
  customerName: string;

  @ApiProperty({ enum: CustomerType })
  customerType: CustomerType;

  @ApiProperty({ enum: CustomerStatus })
  status: CustomerStatus;

  // Contact Information
  @ApiPropertyOptional()
  contactPerson?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  mobile?: string;

  @ApiPropertyOptional()
  fax?: string;

  @ApiPropertyOptional()
  website?: string;

  // Address Information
  @ApiPropertyOptional()
  billingAddress?: string;

  @ApiPropertyOptional()
  billingCity?: string;

  @ApiPropertyOptional()
  billingState?: string;

  @ApiPropertyOptional()
  billingCountry?: string;

  @ApiPropertyOptional()
  billingZipCode?: string;

  @ApiPropertyOptional()
  shippingAddress?: string;

  @ApiPropertyOptional()
  shippingCity?: string;

  @ApiPropertyOptional()
  shippingState?: string;

  @ApiPropertyOptional()
  shippingCountry?: string;

  @ApiPropertyOptional()
  shippingZipCode?: string;

  // Tax Information
  @ApiPropertyOptional()
  taxId?: string;

  @ApiPropertyOptional()
  gstNumber?: string;

  @ApiPropertyOptional()
  panNumber?: string;

  @ApiProperty()
  isTaxExempt: boolean;

  // Financial Information
  @ApiProperty()
  creditLimit: number;

  @ApiProperty()
  creditDays: number;

  @ApiProperty({ enum: CreditRating })
  creditRating: CreditRating;

  @ApiPropertyOptional()
  paymentTerms?: string;

  @ApiProperty()
  currency: string;

  @ApiPropertyOptional()
  priceList?: string;

  // Banking Information
  @ApiPropertyOptional()
  bankName?: string;

  @ApiPropertyOptional()
  bankAccountNumber?: string;

  @ApiPropertyOptional()
  ifscCode?: string;

  @ApiPropertyOptional()
  swiftCode?: string;

  // Business Classification
  @ApiPropertyOptional()
  industry?: string;

  @ApiPropertyOptional()
  territory?: string;

  @ApiPropertyOptional()
  salesPerson?: string;

  @ApiPropertyOptional()
  salesPersonId?: string;

  @ApiPropertyOptional()
  customerGroup?: string;

  // Balances
  @ApiProperty()
  outstandingBalance: number;

  @ApiProperty()
  totalSales: number;

  @ApiProperty()
  lastSaleAmount: number;

  @ApiPropertyOptional()
  lastSaleDate?: Date;

  // Loyalty & Discount
  @ApiProperty()
  loyaltyPoints: number;

  @ApiProperty()
  defaultDiscountPercentage: number;

  // Additional Information
  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  customFields?: Record<string, any>;

  @ApiPropertyOptional()
  attachments?: any[];

  // Metadata
  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  // Virtual fields
  @ApiPropertyOptional()
  isOverdue?: boolean;

  @ApiPropertyOptional()
  creditAvailable?: number;
}
