import { DataSource } from 'typeorm';
import { Item, ItemType, ItemStatus, ValuationMethod } from '../../src/modules/core/entities/item.entity';
export { ItemType, ItemStatus, ValuationMethod };


export class ItemFactory {
  private static counter = 0;

  static create(overrides: Partial<Item> = {}): Item {
    this.counter++;

    const item = new Item();
    item.itemCode = overrides.itemCode || `ITEM-${this.counter.toString().padStart(4, '0')}`;
    item.itemName = overrides.itemName || `Test Item ${this.counter}`;
    item.itemDescription = overrides.itemDescription || 'Test item description';
    item.itemType = overrides.itemType || ItemType.RAW_MATERIAL;
    item.status = overrides.status || ItemStatus.ACTIVE;
    item.baseUOM = overrides.baseUOM || 'PCS';
    item.maintainStock = overrides.maintainStock ?? true;
    item.valuationMethod = overrides.valuationMethod || ValuationMethod.WEIGHTED_AVERAGE;
    item.standardCost = overrides.standardCost ?? 10.0;
    item.standardSellingPrice = overrides.standardSellingPrice ?? 20.0;
    item.currentStock = overrides.currentStock ?? 0;

    return Object.assign(item, overrides);
  }

  static createDto(overrides: any = {}): any {
    this.counter++;
    return {
      itemCode: overrides.itemCode || `ITEM-DTO-${this.counter}`,
      itemName: overrides.itemName || `New Item ${this.counter}`,
      itemType: ItemType.RAW_MATERIAL,
      baseUOM: 'PCS',
      ...overrides,
    };
  }

  static createMany(count: number, overrides: Partial<Item> = {}): Item[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  static createLowStock(overrides: Partial<Item> = {}): Item {
    return this.create({
      currentStock: 5,
      reorderLevel: 10,
      maintainStock: true,
      ...overrides,
    });
  }

  static createOutOfStock(overrides: Partial<Item> = {}): Item {
    return this.create({
      currentStock: 0,
      reorderLevel: 10,
      maintainStock: true,
      ...overrides,
    });
  }

  static createService(overrides: Partial<Item> = {}): Item {
    return this.create({
      itemType: ItemType.SERVICE,
      maintainStock: false,
      ...overrides,
    });
  }

  static async persist(dataSource: DataSource, overrides: Partial<Item> = {}): Promise<Item> {
    const item = this.create(overrides);
    const repository = dataSource.getRepository(Item);
    return await repository.save(item);
  }

  static async persistMany(dataSource: DataSource, count: number, overrides: Partial<Item> = {}): Promise<Item[]> {
    const items = Array.from({ length: count }, () => this.create(overrides));
    const repository = dataSource.getRepository(Item);
    return await repository.save(items);
  }

  static resetCounter(): void {
    this.counter = 0;
  }
}
