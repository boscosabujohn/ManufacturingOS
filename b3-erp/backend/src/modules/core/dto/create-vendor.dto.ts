import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsISO8601,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  VendorType,
  VendorStatus,
  VendorRating,
} from '../entities/vendor.entity';

class CertificationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  certificationNumber: string;

  @ApiProperty()
  @IsString()
  issuedBy: string;

  @ApiProperty()
  @IsISO8601()
  issueDate: Date;

  @ApiProperty()
  @IsISO8601()
  expiryDate: Date;
}

class VendorAttachmentDto {
  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsString()
  fileUrl: string;

  @ApiProperty()
  @IsString()
  uploadedBy: string;

  @ApiProperty()
  @IsISO8601()
  uploadedAt: Date;
}

export class CreateVendorDto {
  @ApiProperty({ description: 'Unique vendor code', maxLength: 50 })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  vendorCode: string;

  @ApiProperty({ description: 'Vendor name', maxLength: 255 })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  vendorName: string;

  @ApiPropertyOptional({ enum: VendorType, default: VendorType.MANUFACTURER })
  @IsEnum(VendorType)
  @IsOptional()
  vendorType?: VendorType;

  @ApiPropertyOptional({ enum: VendorStatus, default: VendorStatus.PROSPECTIVE })
  @IsEnum(VendorStatus)
  @IsOptional()
  status?: VendorStatus;

  // Contact Information
  @ApiPropertyOptional({ maxLength: 255 })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  contactPerson?: string;

  @ApiPropertyOptional({ maxLength: 255 })
  @IsEmail()
  @MaxLength(255)
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ maxLength: 50 })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ maxLength: 50 })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  mobile?: string;

  @ApiPropertyOptional({ maxLength: 50 })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  fax?: string;

  @ApiPropertyOptional({ maxLength: 255 })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  website?: string;

  // Address Information
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ maxLength: 255 })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ maxLength: 20 })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  zipCode?: string;

  // Tax Information
  @ApiPropertyOptional({ maxLength: 50 })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  taxId?: string;

  @ApiPropertyOptional({ maxLength: 50 })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  gstNumber?: string;

  @ApiPropertyOptional({ maxLength: 50 })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  panNumber?: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isTaxDeducted?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  tdsRate?: number;

  // Financial Information
  @ApiPropertyOptional({ default: 30 })
  @IsNumber()
  @Min(0)
  @Max(365)
  @IsOptional()
  paymentTermsDays?: number;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  paymentTerms?: string;

  @ApiPropertyOptional({ default: 'INR', maxLength: 3 })
  @IsString()
  @MaxLength(3)
  @IsOptional()
  currency?: string;

  // Banking Information
  @ApiPropertyOptional({ maxLength: 255 })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  bankName?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  bankAccountNumber?: string;

  @ApiPropertyOptional({ maxLength: 50 })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  ifscCode?: string;

  @ApiPropertyOptional({ maxLength: 50 })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  swiftCode?: string;

  @ApiPropertyOptional({ maxLength: 255 })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  beneficiaryName?: string;

  // Performance Metrics
  @ApiPropertyOptional({ enum: VendorRating, default: VendorRating.NO_RATING })
  @IsEnum(VendorRating)
  @IsOptional()
  qualityRating?: VendorRating;

  @ApiPropertyOptional({ enum: VendorRating, default: VendorRating.NO_RATING })
  @IsEnum(VendorRating)
  @IsOptional()
  deliveryRating?: VendorRating;

  @ApiPropertyOptional({ enum: VendorRating, default: VendorRating.NO_RATING })
  @IsEnum(VendorRating)
  @IsOptional()
  priceRating?: VendorRating;

  @ApiPropertyOptional({ enum: VendorRating, default: VendorRating.NO_RATING })
  @IsEnum(VendorRating)
  @IsOptional()
  overallRating?: VendorRating;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  onTimeDeliveryPercentage?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  defectRate?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  leadTimeDays?: number;

  // Business Classification
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  productsSupplied?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  servicesProvided?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  category?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  buyerId?: string;

  @ApiPropertyOptional({ maxLength: 255 })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  buyerName?: string;

  // Certifications
  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isISO9001Certified?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isISO14001Certified?: boolean;

  @ApiPropertyOptional({ type: [CertificationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationDto)
  @IsOptional()
  certifications?: CertificationDto[];

  // Approval Workflow
  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  approvedBy?: string;

  // Additional Information
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  customFields?: Record<string, any>;

  @ApiPropertyOptional({ type: [VendorAttachmentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VendorAttachmentDto)
  @IsOptional()
  attachments?: VendorAttachmentDto[];

  // Metadata
  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  createdBy?: string;
}
