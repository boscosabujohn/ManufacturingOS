import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { StockEntryService } from '../../src/modules/inventory/services/stock-entry.service';
import { StockEntryStatus, StockEntryType } from '../../src/modules/inventory/entities/stock-entry.entity';
import { StockValuationService } from '../../src/modules/inventory/services/stock-valuation.service';
import { StockBalanceService } from '../../src/modules/inventory/services/stock-balance.service';
import { AuditLogger } from '../../src/common/logging/audit-logger.service';
import { PrismaService } from '../../src/modules/prisma/prisma.service';
import { InventoryFactory } from '../factories/inventory.factory';
import { createMockPrismaService } from '../mocks/service-mocks';
import { createMockService } from '../utils/test-setup';

describe('StockEntryService', () => {
    let service: StockEntryService;
    let prisma: any;
    let valuationService: jest.Mocked<StockValuationService>;
    let balanceService: jest.Mocked<StockBalanceService>;
    let auditLogger: jest.Mocked<AuditLogger>;

    beforeEach(async () => {
        prisma = createMockPrismaService();
        valuationService = createMockService<StockValuationService>(['calculateNewRate', 'calculateIssueValue']);
        balanceService = createMockService<StockBalanceService>(['adjustBalance']);
        auditLogger = createMockService<AuditLogger>(['logAction']);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StockEntryService,
                {
                    provide: PrismaService,
                    useValue: prisma,
                },
                {
                    provide: StockValuationService,
                    useValue: valuationService,
                },
                {
                    provide: StockBalanceService,
                    useValue: balanceService,
                },
                {
                    provide: AuditLogger,
                    useValue: auditLogger,
                },
            ],
        }).compile();

        service = module.get<StockEntryService>(StockEntryService);
        InventoryFactory.resetCounters();
    });

    describe('create', () => {
        it('should create a draft stock entry with lines in a transaction', async () => {
            const createDto = {
                entryType: StockEntryType.MATERIAL_RECEIPT,
                lines: [
                    { itemId: 'item-1', itemCode: 'I1', itemName: 'Item 1', quantity: 10, rate: 5, uom: 'PCS', toLocationId: 'wh-1' }
                ],
                additionalCosts: 0,
            };

            const mockEntry = InventoryFactory.createStockEntry({ id: 'new-id' });
            prisma.stockEntry.create.mockResolvedValue(mockEntry);

            // We need to mock findUnique because create returns this.findOne(saved.id)
            jest.spyOn(service, 'findOne').mockResolvedValue({ ...mockEntry, lines: [] } as any);

            const result = await service.create(createDto as any);

            expect(prisma.$transaction).toHaveBeenCalled();
            expect(prisma.stockEntry.create).toHaveBeenCalled();
            expect(result.id).toBe('new-id');
        });
    });

    describe('post', () => {
        it('should process receipt and update stock balance', async () => {
            const line = InventoryFactory.createStockEntryLine({ toLocationId: 'wh-1' });
            const entry = InventoryFactory.createStockEntry({ lines: [line], isPosted: false });

            prisma.stockEntry.findUnique.mockResolvedValue(entry as any);
            prisma.$queryRaw.mockResolvedValue([]); // No existing balance
            prisma.stockBalance.create.mockResolvedValue({});
            valuationService.calculateNewRate.mockResolvedValue({ valuationRate: 5, stockValue: 50 });
            prisma.stockEntry.update.mockResolvedValue({ ...entry, isPosted: true, lines: [line] });

            await service.post(entry.id);

            expect(prisma.$queryRaw).toHaveBeenCalled();
            expect(valuationService.calculateNewRate).toHaveBeenCalled();
            expect(prisma.stockBalance.create).toHaveBeenCalled();
            expect(prisma.stockEntry.update).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({ isPosted: true })
            }));
            expect(auditLogger.logAction).toHaveBeenCalledWith('STOCK_POST', expect.any(String), expect.any(Object));
        });

        it('should throw BadRequestException for insufficient stock on issue', async () => {
            const line = InventoryFactory.createStockEntryLine({ fromLocationId: 'wh-1', quantity: 100 });
            const entry = InventoryFactory.createStockEntry({ lines: [line], isPosted: false });

            prisma.stockEntry.findUnique.mockResolvedValue(entry as any);
            const balance = InventoryFactory.createStockBalance({ availableQuantity: 10 });
            prisma.$queryRaw.mockResolvedValue([balance]);

            await expect(service.post(entry.id)).rejects.toThrow(BadRequestException);
            await expect(service.post(entry.id)).rejects.toThrow('Insufficient stock');
        });

        it('should process issue correctly when stock is available', async () => {
            const line = InventoryFactory.createStockEntryLine({ fromLocationId: 'wh-1', quantity: 5 });
            const entry = InventoryFactory.createStockEntry({ lines: [line], isPosted: false });

            prisma.stockEntry.findUnique.mockResolvedValue(entry as any);
            const balance = InventoryFactory.createStockBalance({ availableQuantity: 20, valuationRate: 10 });
            prisma.$queryRaw.mockResolvedValue([balance]);
            valuationService.calculateIssueValue.mockResolvedValue({ averageRate: 10, totalValue: 50 });
            prisma.stockBalance.update.mockResolvedValue({});
            prisma.stockEntry.update.mockResolvedValue({ ...entry, isPosted: true, lines: [line] });

            await service.post(entry.id);

            expect(prisma.stockBalance.update).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({ availableQuantity: 15 })
            }));
            expect(prisma.stockEntry.update).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({ isPosted: true })
            }));
        });

        it('should throw BadRequestException if already posted', async () => {
            const entry = InventoryFactory.createStockEntry({ isPosted: true });
            prisma.stockEntry.findUnique.mockResolvedValue(entry as any);

            await expect(service.post(entry.id)).rejects.toThrow(BadRequestException);
        });
    });

    describe('findOne', () => {
        it('should return entry with lines', async () => {
            const entry = InventoryFactory.createStockEntry();
            prisma.stockEntry.findUnique.mockResolvedValue(entry as any);

            const result = await service.findOne(entry.id);

            expect(result.id).toBe(entry.id);
            expect(prisma.stockEntry.findUnique).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: entry.id },
                include: { lines: true }
            }));
        });

        it('should throw NotFoundException if not found', async () => {
            prisma.stockEntry.findUnique.mockResolvedValue(null);
            await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
        });
    });
});
