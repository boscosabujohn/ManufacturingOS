import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { ItemService } from '../../src/modules/core/services/item.service';
import { Item } from '../../src/modules/core/entities/item.entity';
import { createMockRepository } from '../utils/test-setup';
import { ItemFactory, ItemStatus, ItemType } from '../factories/item.factory';

describe('ItemService', () => {
  let service: ItemService;
  let mockRepository: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    mockRepository = createMockRepository<Item>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: getRepositoryToken(Item),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    ItemFactory.resetCounter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated items', async () => {
      const items = ItemFactory.createMany(5);
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([items, 5]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.findAll({}, { page: 1, limit: 10 });

      expect(result.data).toHaveLength(5);
      expect(result.total).toBe(5);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should filter items by status', async () => {
      const activeItems = ItemFactory.createMany(3, { status: ItemStatus.ACTIVE });
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([activeItems, 3]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.findAll({ status: ItemStatus.ACTIVE });

      expect(result.data).toHaveLength(3);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'item.status = :status',
        { status: ItemStatus.ACTIVE },
      );
    });

    it('should filter items by search term', async () => {
      const items = [ItemFactory.create({ itemName: 'Steel Rod' })];
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([items, 1]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.findAll({ search: 'Steel' });

      expect(result.data).toHaveLength(1);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should filter items by itemType', async () => {
      const rawMaterials = ItemFactory.createMany(2, { itemType: ItemType.RAW_MATERIAL });
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([rawMaterials, 2]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.findAll({ itemType: ItemType.RAW_MATERIAL });

      expect(result.data).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return an item by id', async () => {
      const item = ItemFactory.create();
      mockRepository.findOne.mockResolvedValue(item as any);

      const result = await service.findOne(item.id);

      expect(result.id).toBe(item.id);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: item.id },
      });
    });

    it('should throw NotFoundException if item not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should calculate stock status for returned item', async () => {
      const lowStockItem = ItemFactory.createLowStock();
      mockRepository.findOne.mockResolvedValue(lowStockItem as any);

      const result = await service.findOne(lowStockItem.id);

      expect(result.needsReorder).toBe(true);
    });
  });

  describe('findByCode', () => {
    it('should return an item by code', async () => {
      const item = ItemFactory.create({ itemCode: 'ITEM001' });
      mockRepository.findOne.mockResolvedValue(item as any);

      const result = await service.findByCode('ITEM001');

      expect(result?.itemCode).toBe('ITEM001');
    });

    it('should return null if item code not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByCode('NONEXISTENT');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new item successfully', async () => {
      const createDto = ItemFactory.createDto();
      const expectedItem = ItemFactory.create({
        itemCode: createDto.itemCode,
        itemName: createDto.itemName,
      });

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(expectedItem as any);
      mockRepository.save.mockResolvedValue(expectedItem as any);

      const result = await service.create(createDto as any);

      expect(result.itemCode).toBe(createDto.itemCode);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if item code already exists', async () => {
      const createDto = ItemFactory.createDto();
      const existingItem = ItemFactory.create({ itemCode: createDto.itemCode });

      mockRepository.findOne.mockResolvedValue(existingItem as any);

      await expect(service.create(createDto as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException if barcode already exists', async () => {
      const createDto = ItemFactory.createDto({ barcode: 'EXISTING123' });

      mockRepository.findOne
        .mockResolvedValueOnce(null) // itemCode check
        .mockResolvedValueOnce(ItemFactory.create() as any); // barcode check

      await expect(service.create(createDto as any)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should update an item successfully', async () => {
      const item = ItemFactory.create();
      const updateDto = { itemName: 'Updated Item Name' };
      const updatedItem = { ...item, ...updateDto };

      mockRepository.findOne
        .mockResolvedValueOnce(item as any)
        .mockResolvedValueOnce(null);
      mockRepository.save.mockResolvedValue(updatedItem as any);

      const result = await service.update(item.id, updateDto as any);

      expect(result.itemName).toBe('Updated Item Name');
    });

    it('should throw ConflictException if new item code already exists', async () => {
      const item = ItemFactory.create({ itemCode: 'ITEM001' });
      const existingItem = ItemFactory.create({ itemCode: 'ITEM002' });
      const updateDto = { itemCode: 'ITEM002' };

      mockRepository.findOne
        .mockResolvedValueOnce(item as any)
        .mockResolvedValueOnce(existingItem as any);

      await expect(service.update(item.id, updateDto as any)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an item with zero stock', async () => {
      const item = ItemFactory.create({ currentStock: 0 });
      mockRepository.findOne.mockResolvedValue(item as any);
      mockRepository.remove.mockResolvedValue(item as any);

      await service.remove(item.id);

      expect(mockRepository.remove).toHaveBeenCalledWith(item);
    });

    it('should throw BadRequestException if item has stock', async () => {
      const item = ItemFactory.create({ currentStock: 50 });
      mockRepository.findOne.mockResolvedValue(item as any);

      await expect(service.remove(item.id)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateStock', () => {
    it('should add stock to an item', async () => {
      const item = ItemFactory.create({ currentStock: 100, maintainStock: true });
      const updatedItem = { ...item, currentStock: 150 };

      mockRepository.findOne.mockResolvedValue(item as any);
      mockRepository.save.mockResolvedValue(updatedItem as any);

      const result = await service.updateStock(item.id, 50, 'add');

      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should subtract stock from an item', async () => {
      const item = ItemFactory.create({ currentStock: 100, maintainStock: true });
      const updatedItem = { ...item, currentStock: 80 };

      mockRepository.findOne.mockResolvedValue(item as any);
      mockRepository.save.mockResolvedValue(updatedItem as any);

      const result = await service.updateStock(item.id, 20, 'subtract');

      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException for insufficient stock', async () => {
      const item = ItemFactory.create({ currentStock: 10, maintainStock: true });
      mockRepository.findOne.mockResolvedValue(item as any);

      await expect(service.updateStock(item.id, 50, 'subtract')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if item does not maintain stock', async () => {
      const item = ItemFactory.createService();
      mockRepository.findOne.mockResolvedValue(item as any);

      await expect(service.updateStock(item.id, 10, 'add')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should set stock to exact value', async () => {
      const item = ItemFactory.create({ currentStock: 100, maintainStock: true });
      const updatedItem = { ...item, currentStock: 200 };

      mockRepository.findOne.mockResolvedValue(item as any);
      mockRepository.save.mockResolvedValue(updatedItem as any);

      await service.updateStock(item.id, 200, 'set');

      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('getItemsNeedingReorder', () => {
    it('should return items needing reorder', async () => {
      const lowStockItems = [
        ItemFactory.createLowStock(),
        ItemFactory.createOutOfStock(),
      ];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(lowStockItems),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.getItemsNeedingReorder();

      expect(result).toHaveLength(2);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('item.maintainStock = true');
    });
  });

  describe('getLowStockItems', () => {
    it('should return low stock items', async () => {
      const lowStockItems = [ItemFactory.createLowStock()];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(lowStockItems),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.getLowStockItems();

      expect(result).toHaveLength(1);
    });
  });

  describe('getOutOfStockItems', () => {
    it('should return out of stock items', async () => {
      const outOfStockItems = [ItemFactory.createOutOfStock()];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(outOfStockItems),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.getOutOfStockItems();

      expect(result).toHaveLength(1);
    });
  });

  describe('getTopSellingItems', () => {
    it('should return top selling items', async () => {
      const items = ItemFactory.createMany(10, { isSold: true });
      mockRepository.find.mockResolvedValue(items as any);

      const result = await service.getTopSellingItems(10);

      expect(result).toHaveLength(10);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { isSold: true },
        order: { ytdSalesValue: 'DESC' },
        take: 10,
      });
    });
  });

  describe('searchItemsByName', () => {
    it('should search items by name or code', async () => {
      const items = [ItemFactory.create({ itemName: 'Steel Rod' })];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(items),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.searchItemsByName('Steel');

      expect(result).toHaveLength(1);
    });
  });
});
