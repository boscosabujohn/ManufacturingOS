import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  VendorType,
  VendorStatus,
  VendorRating,
} from '../entities/vendor.entity';

export class VendorResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  vendorCode: string;

  @ApiProperty()
  vendorName: string;

  @ApiProperty({ enum: VendorType })
  vendorType: VendorType;

  @ApiProperty({ enum: VendorStatus })
  status: VendorStatus;

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
  address?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  state?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiPropertyOptional()
  zipCode?: string;

  // Tax Information
  @ApiPropertyOptional()
  taxId?: string;

  @ApiPropertyOptional()
  gstNumber?: string;

  @ApiPropertyOptional()
  panNumber?: string;

  @ApiProperty()
  isTaxDeducted: boolean;

  @ApiProperty()
  tdsRate: number;

  // Financial Information
  @ApiProperty()
  paymentTermsDays: number;

  @ApiPropertyOptional()
  paymentTerms?: string;

  @ApiProperty()
  currency: string;

  // Banking Information
  @ApiPropertyOptional()
  bankName?: string;

  @ApiPropertyOptional()
  bankAccountNumber?: string;

  @ApiPropertyOptional()
  ifscCode?: string;

  @ApiPropertyOptional()
  swiftCode?: string;

  @ApiPropertyOptional()
  beneficiaryName?: string;

  // Performance Metrics
  @ApiProperty({ enum: VendorRating })
  qualityRating: VendorRating;

  @ApiProperty({ enum: VendorRating })
  deliveryRating: VendorRating;

  @ApiProperty({ enum: VendorRating })
  priceRating: VendorRating;

  @ApiProperty({ enum: VendorRating })
  overallRating: VendorRating;

  @ApiProperty()
  onTimeDeliveryPercentage: number;

  @ApiProperty()
  defectRate: number;

  @ApiProperty()
  leadTimeDays: number;

  // Business Classification
  @ApiPropertyOptional()
  productsSupplied?: string;

  @ApiPropertyOptional()
  servicesProvided?: string;

  @ApiPropertyOptional()
  category?: string;

  @ApiPropertyOptional()
  buyerId?: string;

  @ApiPropertyOptional()
  buyerName?: string;

  // Certifications
  @ApiProperty()
  isISO9001Certified: boolean;

  @ApiProperty()
  isISO14001Certified: boolean;

  @ApiPropertyOptional()
  certifications?: any[];

  // Balances
  @ApiProperty()
  outstandingPayables: number;

  @ApiProperty()
  totalPurchases: number;

  @ApiProperty()
  lastPurchaseAmount: number;

  @ApiPropertyOptional()
  lastPurchaseDate?: Date;

  // Approval Workflow
  @ApiProperty()
  isApproved: boolean;

  @ApiPropertyOptional()
  approvedBy?: string;

  @ApiPropertyOptional()
  approvedAt?: Date;

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
  averageRating?: number;

  @ApiPropertyOptional()
  paymentStatus?: string;
}
