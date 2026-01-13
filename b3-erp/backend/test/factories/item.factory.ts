import { generateTestId } from '../utils/test-setup';

export enum ItemStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued',
}

export enum ItemType {
  RAW_MATERIAL = 'raw_material',
  FINISHED_GOOD = 'finished_good',
  SEMI_FINISHED = 'semi_finished',
  CONSUMABLE = 'consumable',
  SERVICE = 'service',
  ASSET = 'asset',
}

export interface MockItem {
  id: string;
  itemCode: string;
  itemName: string;
  itemDescription?: string;
  barcode?: string;
  sku?: string;
  itemType: ItemType;
  category?: string;
  subCategory?: string;
  brand?: string;
  manufacturer?: string;
  uom: string;
  status: ItemStatus;
  maintainStock: boolean;
  isManufactured: boolean;
  isPurchased: boolean;
  isSold: boolean;
  allowSales: boolean;
  allowPurchase: boolean;
  currentStock: number;
  reorderLevel: number;
  safetyStock: number;
  maximumStock: number;
  minimumOrderQty: number;
  standardCost: number;
  averageCost: number;
  lastPurchasePrice: number;
  standardSellingPrice: number;
  minimumSellingPrice: number;
  maximumSellingPrice: number;
  totalStockValue: number;
  ytdSalesQuantity: number;
  ytdSalesValue: number;
  lastSaleDate?: Date;
  lastPurchaseDate?: Date;
  preferredVendorId?: string;
  leadTimeDays: number;
  shelfLifeDays?: number;
  weight?: number;
  volume?: number;
  hsnCode?: string;
  taxRate: number;
  stockStatus?: string;
  needsReorder?: boolean;
  availableStock?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateItemDtoMock {
  itemCode: string;
  itemName: string;
  itemDescription?: string;
  barcode?: string;
  itemType: ItemType;
  category?: string;
  uom: string;
  maintainStock?: boolean;
  isManufactured?: boolean;
  isPurchased?: boolean;
  isSold?: boolean;
  reorderLevel?: number;
  safetyStock?: number;
  standardCost?: number;
  standardSellingPrice?: number;
}

/**
 * Factory for creating mock Item objects
 */
export class ItemFactory {
  private static counter = 0;

  /**
   * Create a mock item with default values
   */
  static create(overrides: Partial<MockItem> = {}): MockItem {
    this.counter++;
    const id = overrides.id || generateTestId();

    return {
      id,
      itemCode: `ITEM${this.counter.toString().padStart(5, '0')}`,
      itemName: `Test Item ${this.counter}`,
      itemDescription: `Description for test item ${this.counter}`,
      barcode: `BAR${this.counter.toString().padStart(10, '0')}`,
      sku: `SKU${this.counter.toString().padStart(8, '0')}`,
      itemType: ItemType.RAW_MATERIAL,
      category: 'General',
      subCategory: 'Miscellaneous',
      brand: 'TestBrand',
      manufacturer: 'TestManufacturer',
      uom: 'PCS',
      status: ItemStatus.ACTIVE,
      maintainStock: true,
      isManufactured: false,
      isPurchased: true,
      isSold: true,
      allowSales: true,
      allowPurchase: true,
      currentStock: 100,
      reorderLevel: 20,
      safetyStock: 10,
      maximumStock: 500,
      minimumOrderQty: 1,
      standardCost: 10.0,
      averageCost: 10.5,
      lastPurchasePrice: 11.0,
      standardSellingPrice: 15.0,
      minimumSellingPrice: 12.0,
      maximumSellingPrice: 20.0,
      totalStockValue: 1050.0,
      ytdSalesQuantity: 50,
      ytdSalesValue: 750.0,
      leadTimeDays: 7,
      taxRate: 18,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  /**
   * Create a mock CreateItemDto
   */
  static createDto(overrides: Partial<CreateItemDtoMock> = {}): CreateItemDtoMock {
    this.counter++;
    return {
      itemCode: `NEW${this.counter.toString().padStart(5, '0')}`,
      itemName: `New Item ${this.counter}`,
      itemDescription: `New item description ${this.counter}`,
      itemType: ItemType.RAW_MATERIAL,
      category: 'General',
      uom: 'PCS',
      maintainStock: true,
      isPurchased: true,
      isSold: true,
      reorderLevel: 10,
      safetyStock: 5,
      standardCost: 10.0,
      standardSellingPrice: 15.0,
      ...overrides,
    };
  }

  /**
   * Create multiple mock items
   */
  static createMany(count: number, overrides: Partial<MockItem> = {}): MockItem[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  /**
   * Create an item with low stock
   */
  static createLowStock(overrides: Partial<MockItem> = {}): MockItem {
    return this.create({
      currentStock: 5,
      reorderLevel: 20,
      safetyStock: 10,
      stockStatus: 'Low Stock',
      needsReorder: true,
      ...overrides,
    });
  }

  /**
   * Create an out of stock item
   */
  static createOutOfStock(overrides: Partial<MockItem> = {}): MockItem {
    return this.create({
      currentStock: 0,
      stockStatus: 'Out of Stock',
      needsReorder: true,
      totalStockValue: 0,
      ...overrides,
    });
  }

  /**
   * Create a finished goods item
   */
  static createFinishedGood(overrides: Partial<MockItem> = {}): MockItem {
    return this.create({
      itemType: ItemType.FINISHED_GOOD,
      isManufactured: true,
      isPurchased: false,
      isSold: true,
      ...overrides,
    });
  }

  /**
   * Create a service item (no stock)
   */
  static createService(overrides: Partial<MockItem> = {}): MockItem {
    return this.create({
      itemType: ItemType.SERVICE,
      maintainStock: false,
      currentStock: 0,
      stockStatus: 'Not Tracked',
      ...overrides,
    });
  }

  /**
   * Reset the counter (useful for test isolation)
   */
  static resetCounter(): void {
    this.counter = 0;
  }
}
