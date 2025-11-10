import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsOptional,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsArray,
  ValidateNested,
  IsObject,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ItemType,
  ItemStatus,
  ValuationMethod,
} from '../entities/item.entity';

class AlternateUOMDto {
  @ApiProperty()
  @IsString()
  uom: string;

  @ApiProperty()
  @IsNumber()
  conversionFactor: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  barcode?: string;
}

class ApprovedVendorDto {
  @ApiProperty()
  @IsString()
  vendorId: string;

  @ApiProperty()
  @IsString()
  vendorName: string;

  @ApiProperty()
  @IsString()
  vendorItemCode: string;

  @ApiProperty()
  @IsNumber()
  unitPrice: number;

  @ApiProperty()
  @IsNumber()
  leadTimeDays: number;

  @ApiProperty()
  @IsBoolean()
  isPrimary: boolean;
}

class ItemImageDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsBoolean()
  isPrimary: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  caption?: string;
}

class ItemAttachmentDto {
  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsString()
  fileUrl: string;

  @ApiProperty()
  @IsString()
  fileType: string;

  @ApiProperty()
  @IsString()
  uploadedBy: string;

  @ApiProperty()
  @IsISO8601()
  uploadedAt: Date;
}

class SpecificationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  unit?: string;
}

export class CreateItemDto {
  @ApiProperty({ description: 'Unique item code', maxLength: 50 })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  itemCode: string;

  @ApiProperty({ description: 'Item name', maxLength: 255 })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  itemName: string;

  @ApiPropertyOptional({ maxLength: 255 })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  itemDescription?: string;

  @ApiPropertyOptional({ enum: ItemType, default: ItemType.RAW_MATERIAL })
  @IsEnum(ItemType)
  @IsOptional()
  itemType?: ItemType;

  @ApiPropertyOptional({ enum: ItemStatus, default: ItemStatus.ACTIVE })
  @IsEnum(ItemStatus)
  @IsOptional()
  status?: ItemStatus;

  // Classification
  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  subCategory?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  manufacturer?: string;

  // Identification
  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  barcode?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  hsnCode?: string;

  // Unit of Measure
  @ApiPropertyOptional({ default: 'PCS', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  baseUOM?: string;

  @ApiPropertyOptional({ type: [AlternateUOMDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AlternateUOMDto)
  @IsOptional()
  alternateUOMs?: AlternateUOMDto[];

  // Inventory Settings
  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  maintainStock?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  trackSerialNumber?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  trackBatchNumber?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  trackExpiryDate?: boolean;

  // Stock Levels
  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  reorderLevel?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  reorderQuantity?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minimumOrderQuantity?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maximumStock?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  safetyStock?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  leadTimeDays?: number;

  // Pricing
  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  standardCost?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  standardSellingPrice?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minimumSellingPrice?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maximumSellingPrice?: number;

  @ApiPropertyOptional({ enum: ValuationMethod, default: ValuationMethod.WEIGHTED_AVERAGE })
  @IsEnum(ValuationMethod)
  @IsOptional()
  valuationMethod?: ValuationMethod;

  // Tax Information
  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isTaxable?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  taxRate?: number;

  @ApiPropertyOptional({ maxLength: 50 })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  taxCategory?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  gstSlabCode?: string;

  // Physical Attributes
  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ default: 'kg', maxLength: 20 })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  weightUOM?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  length?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  width?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  height?: number;

  @ApiPropertyOptional({ default: 'cm', maxLength: 20 })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  dimensionUOM?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  volume?: number;

  // Quality Control
  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  requiresQualityInspection?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  qcTemplateId?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  shelfLifeDays?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  warrantyDays?: number;

  // Suppliers
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  preferredVendorId?: string;

  @ApiPropertyOptional({ maxLength: 255 })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  preferredVendorName?: string;

  @ApiPropertyOptional({ type: [ApprovedVendorDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApprovedVendorDto)
  @IsOptional()
  approvedVendors?: ApprovedVendorDto[];

  // Manufacturing
  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isManufactured?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isPurchased?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isSold?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  defaultBOMId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  defaultRoutingId?: string;

  // GL Account Mapping
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  inventoryAccountId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cogsAccountId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  salesAccountId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  purchaseAccountId?: string;

  // Images and Documents
  @ApiPropertyOptional({ maxLength: 500 })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  primaryImageUrl?: string;

  @ApiPropertyOptional({ type: [ItemImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemImageDto)
  @IsOptional()
  images?: ItemImageDto[];

  @ApiPropertyOptional({ type: [ItemAttachmentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemAttachmentDto)
  @IsOptional()
  attachments?: ItemAttachmentDto[];

  // Sales & Purchase
  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  allowSales?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  allowPurchase?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isStockItem?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isFixedAsset?: boolean;

  // Additional Information
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  customFields?: Record<string, any>;

  @ApiPropertyOptional({ type: [SpecificationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecificationDto)
  @IsOptional()
  specifications?: SpecificationDto[];

  // Metadata
  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  createdBy?: string;
}
