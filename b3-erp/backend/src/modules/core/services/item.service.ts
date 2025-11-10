import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../entities/item.entity';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';

export interface ItemFilters {
  search?: string;
  status?: string;
  itemType?: string;
  category?: string;
  subCategory?: string;
  brand?: string;
  manufacturer?: string;
  maintainStock?: boolean;
  isManufactured?: boolean;
  isPurchased?: boolean;
  isSold?: boolean;
  allowSales?: boolean;
  allowPurchase?: boolean;
  preferredVendorId?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async findAll(
    filters: ItemFilters = {},
    pagination: PaginationParams = {},
  ): Promise<{ data: Item[]; total: number; page: number; limit: number }> {
    const {
      search,
      status,
      itemType,
      category,
      subCategory,
      brand,
      manufacturer,
      maintainStock,
      isManufactured,
      isPurchased,
      isSold,
      allowSales,
      allowPurchase,
      preferredVendorId,
    } = filters;

    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;

    const queryBuilder = this.itemRepository.createQueryBuilder('item');

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(item.itemCode ILIKE :search OR item.itemName ILIKE :search OR item.itemDescription ILIKE :search OR item.barcode ILIKE :search OR item.sku ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply status filter
    if (status) {
      queryBuilder.andWhere('item.status = :status', { status });
    }

    // Apply item type filter
    if (itemType) {
      queryBuilder.andWhere('item.itemType = :itemType', { itemType });
    }

    // Apply category filter
    if (category) {
      queryBuilder.andWhere('item.category = :category', { category });
    }

    // Apply sub-category filter
    if (subCategory) {
      queryBuilder.andWhere('item.subCategory = :subCategory', { subCategory });
    }

    // Apply brand filter
    if (brand) {
      queryBuilder.andWhere('item.brand = :brand', { brand });
    }

    // Apply manufacturer filter
    if (manufacturer) {
      queryBuilder.andWhere('item.manufacturer = :manufacturer', {
        manufacturer,
      });
    }

    // Apply maintain stock filter
    if (maintainStock !== undefined) {
      queryBuilder.andWhere('item.maintainStock = :maintainStock', {
        maintainStock,
      });
    }

    // Apply manufactured filter
    if (isManufactured !== undefined) {
      queryBuilder.andWhere('item.isManufactured = :isManufactured', {
        isManufactured,
      });
    }

    // Apply purchased filter
    if (isPurchased !== undefined) {
      queryBuilder.andWhere('item.isPurchased = :isPurchased', { isPurchased });
    }

    // Apply sold filter
    if (isSold !== undefined) {
      queryBuilder.andWhere('item.isSold = :isSold', { isSold });
    }

    // Apply allow sales filter
    if (allowSales !== undefined) {
      queryBuilder.andWhere('item.allowSales = :allowSales', { allowSales });
    }

    // Apply allow purchase filter
    if (allowPurchase !== undefined) {
      queryBuilder.andWhere('item.allowPurchase = :allowPurchase', {
        allowPurchase,
      });
    }

    // Apply preferred vendor filter
    if (preferredVendorId) {
      queryBuilder.andWhere('item.preferredVendorId = :preferredVendorId', {
        preferredVendorId,
      });
    }

    // Apply sorting
    queryBuilder.orderBy(`item.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const [data, total] = await queryBuilder.getManyAndCount();

    // Calculate virtual fields
    data.forEach((item) => {
      item.stockStatus = this.getStockStatus(item);
      item.needsReorder = item.currentStock <= item.reorderLevel;
      item.availableStock = item.currentStock; // Can be enhanced with reserved stock logic
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemRepository.findOne({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    // Calculate virtual fields
    item.stockStatus = this.getStockStatus(item);
    item.needsReorder = item.currentStock <= item.reorderLevel;
    item.availableStock = item.currentStock;

    return item;
  }

  async findByCode(itemCode: string): Promise<Item | null> {
    return this.itemRepository.findOne({
      where: { itemCode },
    });
  }

  async findByBarcode(barcode: string): Promise<Item | null> {
    return this.itemRepository.findOne({
      where: { barcode },
    });
  }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    // Check if item code already exists
    const existingItem = await this.findByCode(createItemDto.itemCode);
    if (existingItem) {
      throw new ConflictException(
        `Item with code ${createItemDto.itemCode} already exists`,
      );
    }

    // Check if barcode already exists (if provided)
    if (createItemDto.barcode) {
      const barcodeExists = await this.findByBarcode(createItemDto.barcode);
      if (barcodeExists) {
        throw new ConflictException(
          `Item with barcode ${createItemDto.barcode} already exists`,
        );
      }
    }

    const item = this.itemRepository.create(createItemDto);
    return this.itemRepository.save(item);
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.findOne(id);

    // Check if item code is being changed and if it already exists
    if (updateItemDto.itemCode && updateItemDto.itemCode !== item.itemCode) {
      const existingItem = await this.findByCode(updateItemDto.itemCode);
      if (existingItem) {
        throw new ConflictException(
          `Item with code ${updateItemDto.itemCode} already exists`,
        );
      }
    }

    // Check if barcode is being changed and if it already exists
    if (updateItemDto.barcode && updateItemDto.barcode !== item.barcode) {
      const barcodeExists = await this.findByBarcode(updateItemDto.barcode);
      if (barcodeExists) {
        throw new ConflictException(
          `Item with barcode ${updateItemDto.barcode} already exists`,
        );
      }
    }

    Object.assign(item, updateItemDto);
    return this.itemRepository.save(item);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);

    // Check if item has stock
    if (item.currentStock > 0) {
      throw new BadRequestException(
        `Cannot delete item with current stock of ${item.currentStock}`,
      );
    }

    await this.itemRepository.remove(item);
  }

  async updateStock(
    id: string,
    quantity: number,
    operation: 'add' | 'subtract' | 'set',
  ): Promise<Item> {
    const item = await this.findOne(id);

    if (!item.maintainStock) {
      throw new BadRequestException('This item does not maintain stock');
    }

    switch (operation) {
      case 'add':
        item.currentStock += quantity;
        break;
      case 'subtract':
        if (item.currentStock < quantity) {
          throw new BadRequestException('Insufficient stock');
        }
        item.currentStock -= quantity;
        break;
      case 'set':
        item.currentStock = quantity;
        break;
    }

    // Update total stock value
    item.totalStockValue = item.currentStock * item.averageCost;

    return this.itemRepository.save(item);
  }

  async updatePricing(
    id: string,
    pricing: {
      standardCost?: number;
      averageCost?: number;
      lastPurchasePrice?: number;
      standardSellingPrice?: number;
      minimumSellingPrice?: number;
      maximumSellingPrice?: number;
    },
  ): Promise<Item> {
    const item = await this.findOne(id);

    Object.assign(item, pricing);

    // Update total stock value if average cost changed
    if (pricing.averageCost !== undefined) {
      item.totalStockValue = item.currentStock * pricing.averageCost;
    }

    return this.itemRepository.save(item);
  }

  async updateSalesData(
    id: string,
    quantity: number,
    amount: number,
    saleDate: Date,
  ): Promise<Item> {
    const item = await this.findOne(id);

    item.ytdSalesQuantity += quantity;
    item.ytdSalesValue += amount;
    item.lastSaleDate = saleDate;

    return this.itemRepository.save(item);
  }

  async updatePurchaseData(
    id: string,
    price: number,
    purchaseDate: Date,
  ): Promise<Item> {
    const item = await this.findOne(id);

    item.lastPurchasePrice = price;
    item.lastPurchaseDate = purchaseDate;

    return this.itemRepository.save(item);
  }

  async getItemsByCategory(category: string): Promise<Item[]> {
    return this.itemRepository.find({
      where: { category },
      order: { itemName: 'ASC' },
    });
  }

  async getItemsNeedingReorder(): Promise<Item[]> {
    return this.itemRepository
      .createQueryBuilder('item')
      .where('item.maintainStock = true')
      .andWhere('item.currentStock <= item.reorderLevel')
      .orderBy('item.currentStock', 'ASC')
      .getMany();
  }

  async getLowStockItems(): Promise<Item[]> {
    return this.itemRepository
      .createQueryBuilder('item')
      .where('item.maintainStock = true')
      .andWhere('item.currentStock > 0')
      .andWhere('item.currentStock <= item.safetyStock')
      .orderBy('item.currentStock', 'ASC')
      .getMany();
  }

  async getOutOfStockItems(): Promise<Item[]> {
    return this.itemRepository
      .createQueryBuilder('item')
      .where('item.maintainStock = true')
      .andWhere('item.currentStock = 0')
      .orderBy('item.itemName', 'ASC')
      .getMany();
  }

  async getTopSellingItems(limit: number = 10): Promise<Item[]> {
    return this.itemRepository.find({
      where: { isSold: true },
      order: { ytdSalesValue: 'DESC' },
      take: limit,
    });
  }

  async getItemsByVendor(vendorId: string): Promise<Item[]> {
    return this.itemRepository.find({
      where: { preferredVendorId: vendorId },
      order: { itemName: 'ASC' },
    });
  }

  async searchItemsByName(searchTerm: string, limit: number = 20): Promise<Item[]> {
    return this.itemRepository
      .createQueryBuilder('item')
      .where('item.itemName ILIKE :search', { search: `%${searchTerm}%` })
      .orWhere('item.itemCode ILIKE :search', { search: `%${searchTerm}%` })
      .orderBy('item.itemName', 'ASC')
      .take(limit)
      .getMany();
  }

  // Private helper methods
  private getStockStatus(item: Item): string {
    if (!item.maintainStock) return 'Not Tracked';
    if (item.currentStock === 0) return 'Out of Stock';
    if (item.currentStock <= item.reorderLevel) return 'Reorder Required';
    if (item.currentStock <= item.safetyStock) return 'Low Stock';
    if (item.currentStock >= item.maximumStock && item.maximumStock > 0)
      return 'Overstock';
    return 'In Stock';
  }
}
