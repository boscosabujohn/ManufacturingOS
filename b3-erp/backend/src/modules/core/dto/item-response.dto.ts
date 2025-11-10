import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ItemType,
  ItemStatus,
  ValuationMethod,
} from '../entities/item.entity';

export class ItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  itemCode: string;

  @ApiProperty()
  itemName: string;

  @ApiPropertyOptional()
  itemDescription?: string;

  @ApiProperty({ enum: ItemType })
  itemType: ItemType;

  @ApiProperty({ enum: ItemStatus })
  status: ItemStatus;

  // Classification
  @ApiPropertyOptional()
  category?: string;

  @ApiPropertyOptional()
  subCategory?: string;

  @ApiPropertyOptional()
  brand?: string;

  @ApiPropertyOptional()
  manufacturer?: string;

  // Identification
  @ApiPropertyOptional()
  barcode?: string;

  @ApiPropertyOptional()
  sku?: string;

  @ApiPropertyOptional()
  hsnCode?: string;

  // Unit of Measure
  @ApiProperty()
  baseUOM: string;

  @ApiPropertyOptional()
  alternateUOMs?: any[];

  // Inventory Settings
  @ApiProperty()
  maintainStock: boolean;

  @ApiProperty()
  trackSerialNumber: boolean;

  @ApiProperty()
  trackBatchNumber: boolean;

  @ApiProperty()
  trackExpiryDate: boolean;

  // Stock Levels
  @ApiProperty()
  currentStock: number;

  @ApiProperty()
  reorderLevel: number;

  @ApiProperty()
  reorderQuantity: number;

  @ApiProperty()
  minimumOrderQuantity: number;

  @ApiProperty()
  maximumStock: number;

  @ApiProperty()
  safetyStock: number;

  @ApiProperty()
  leadTimeDays: number;

  // Pricing
  @ApiProperty()
  standardCost: number;

  @ApiProperty()
  averageCost: number;

  @ApiProperty()
  lastPurchasePrice: number;

  @ApiProperty()
  standardSellingPrice: number;

  @ApiProperty()
  minimumSellingPrice: number;

  @ApiProperty()
  maximumSellingPrice: number;

  @ApiProperty({ enum: ValuationMethod })
  valuationMethod: ValuationMethod;

  // Tax Information
  @ApiProperty()
  isTaxable: boolean;

  @ApiProperty()
  taxRate: number;

  @ApiPropertyOptional()
  taxCategory?: string;

  @ApiPropertyOptional()
  gstSlabCode?: string;

  // Physical Attributes
  @ApiProperty()
  weight: number;

  @ApiProperty()
  weightUOM: string;

  @ApiProperty()
  length: number;

  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;

  @ApiProperty()
  dimensionUOM: string;

  @ApiProperty()
  volume: number;

  // Quality Control
  @ApiProperty()
  requiresQualityInspection: boolean;

  @ApiPropertyOptional()
  qcTemplateId?: string;

  @ApiProperty()
  shelfLifeDays: number;

  @ApiProperty()
  warrantyDays: number;

  // Suppliers
  @ApiPropertyOptional()
  preferredVendorId?: string;

  @ApiPropertyOptional()
  preferredVendorName?: string;

  @ApiPropertyOptional()
  approvedVendors?: any[];

  // Manufacturing
  @ApiProperty()
  isManufactured: boolean;

  @ApiProperty()
  isPurchased: boolean;

  @ApiProperty()
  isSold: boolean;

  @ApiPropertyOptional()
  defaultBOMId?: string;

  @ApiPropertyOptional()
  defaultRoutingId?: string;

  // GL Account Mapping
  @ApiPropertyOptional()
  inventoryAccountId?: string;

  @ApiPropertyOptional()
  cogsAccountId?: string;

  @ApiPropertyOptional()
  salesAccountId?: string;

  @ApiPropertyOptional()
  purchaseAccountId?: string;

  // Images and Documents
  @ApiPropertyOptional()
  primaryImageUrl?: string;

  @ApiPropertyOptional()
  images?: any[];

  @ApiPropertyOptional()
  attachments?: any[];

  // Sales & Purchase
  @ApiProperty()
  allowSales: boolean;

  @ApiProperty()
  allowPurchase: boolean;

  @ApiProperty()
  isStockItem: boolean;

  @ApiProperty()
  isFixedAsset: boolean;

  // Additional Information
  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  customFields?: Record<string, any>;

  @ApiPropertyOptional()
  specifications?: any[];

  // Statistics
  @ApiProperty()
  totalStockValue: number;

  @ApiProperty()
  ytdSalesQuantity: number;

  @ApiProperty()
  ytdSalesValue: number;

  @ApiPropertyOptional()
  lastSaleDate?: Date;

  @ApiPropertyOptional()
  lastPurchaseDate?: Date;

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
  stockStatus?: string;

  @ApiPropertyOptional()
  needsReorder?: boolean;

  @ApiPropertyOptional()
  availableStock?: number;
}
