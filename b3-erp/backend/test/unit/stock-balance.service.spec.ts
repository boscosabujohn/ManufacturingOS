import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { StockBalanceService } from '../../src/modules/inventory/services/stock-balance.service';
import { PrismaService } from '../../src/modules/prisma/prisma.service';
import { EventBusService } from '../../src/modules/workflow/services/event-bus.service';
import { InventoryFactory } from '../factories/inventory.factory';
import { createMockPrismaService } from '../mocks/service-mocks';
import { createMockService } from '../utils/test-setup';

describe('StockBalanceService', () => {
    let service: StockBalanceService;
    let prisma: any;
    let eventBus: jest.Mocked<EventBusService>;

    beforeEach(async () => {
        prisma = createMockPrismaService();
        eventBus = createMockService<EventBusService>(['emitStockOut', 'emitStockLow']);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StockBalanceService,
                {
                    provide: PrismaService,
                    useValue: prisma,
                },
                {
                    provide: EventBusService,
                    useValue: eventBus,
                },
            ],
        }).compile();

        service = module.get<StockBalanceService>(StockBalanceService);
    });

    describe('create', () => {
        it('should create and save a new stock balance', async () => {
            const createDto = {
                itemId: 'item-1',
                itemCode: 'ITEM-1',
                itemName: 'Item 1',
                warehouseId: 'wh-1',
                availableQuantity: 100,
                valuationRate: 10,
                uom: 'PCS',
            };

            const mockBalance = InventoryFactory.createStockBalance(createDto);
            prisma.stockBalance.create.mockResolvedValue(mockBalance as any);

            const result = await service.create(createDto as any);

            expect(prisma.stockBalance.create).toHaveBeenCalled();
            expect(result.availableQuantity).toBe(100);
            expect(result.stockValue).toBe(1000);
        });
    });

    describe('adjustBalance', () => {
        it('should add to current balance and check events', async () => {
            const balance = InventoryFactory.createStockBalance({
                itemId: 'i1',
                warehouseId: 'w1',
                availableQuantity: 50,
                reorderLevel: 20
            });

            prisma.$queryRaw.mockResolvedValue([balance]);
            prisma.stockBalance.update.mockResolvedValue({ ...balance, availableQuantity: 60 } as any);

            await service.adjustBalance('i1', 'w1', 10, 'user1');

            expect(prisma.stockBalance.update).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({ availableQuantity: 60 })
            }));
            expect(eventBus.emitStockOut).not.toHaveBeenCalled();
            expect(eventBus.emitStockLow).not.toHaveBeenCalled();
        });

        it('should emit STOCK_LOW if balance falls below reorder level', async () => {
            const balance = InventoryFactory.createStockBalance({
                itemId: 'i1',
                warehouseId: 'w1',
                availableQuantity: 25,
                reorderLevel: 20
            });

            prisma.$queryRaw.mockResolvedValue([balance]);
            const updatedBalance = { ...balance, availableQuantity: 15 };
            prisma.stockBalance.update.mockResolvedValue(updatedBalance as any);

            await service.adjustBalance('i1', 'w1', -10, 'user1');

            expect(eventBus.emitStockLow).toHaveBeenCalledWith(expect.objectContaining({
                itemId: 'i1',
                quantity: 15,
                reorderLevel: 20
            }));
        });

        it('should emit STOCK_OUT if balance hits zero', async () => {
            const balance = InventoryFactory.createStockBalance({
                itemId: 'i1',
                warehouseId: 'w1',
                availableQuantity: 10,
                reorderLevel: 20
            });

            prisma.$queryRaw.mockResolvedValue([balance]);
            const updatedBalance = { ...balance, availableQuantity: 0 };
            prisma.stockBalance.update.mockResolvedValue(updatedBalance as any);

            await service.adjustBalance('i1', 'w1', -10, 'user1');

            expect(eventBus.emitStockOut).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return balance if found', async () => {
            const balance = InventoryFactory.createStockBalance();
            prisma.stockBalance.findUnique.mockResolvedValue(balance as any);

            const result = await service.findOne(balance.id);

            expect(result.id).toBe(balance.id);
        });

        it('should throw NotFoundException if not found', async () => {
            prisma.stockBalance.findUnique.mockResolvedValue(null);
            await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
        });
    });
});
