import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PurchaseOrderService } from '../../src/modules/procurement/services/purchase-order.service';
import { PurchaseOrder, POStatus } from '../../src/modules/procurement/entities/purchase-order.entity';
import { PurchaseOrderItem } from '../../src/modules/procurement/entities/purchase-order-item.entity';
import { ProcurementFactory } from '../factories/procurement.factory';
import { createMockRepository } from '../utils/test-setup';

describe('PurchaseOrderService', () => {
    let service: PurchaseOrderService;
    let poRepository: jest.Mocked<Repository<PurchaseOrder>>;
    let poItemRepository: jest.Mocked<Repository<PurchaseOrderItem>>;

    beforeEach(async () => {
        poRepository = createMockRepository<PurchaseOrder>();
        poItemRepository = createMockRepository<PurchaseOrderItem>();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PurchaseOrderService,
                {
                    provide: getRepositoryToken(PurchaseOrder),
                    useValue: poRepository,
                },
                {
                    provide: getRepositoryToken(PurchaseOrderItem),
                    useValue: poItemRepository,
                },
            ],
        }).compile();

        service = module.get<PurchaseOrderService>(PurchaseOrderService);
        ProcurementFactory.resetCounters();
    });

    describe('create', () => {
        it('should create a PO and its items with correct financial calculations', async () => {
            const createDto = {
                vendorId: 'v1',
                vendorName: 'Vendor 1',
                items: [
                    {
                        lineNumber: 1,
                        itemId: 'i1',
                        itemCode: 'IC1',
                        itemName: 'Item 1',
                        uom: 'PCS',
                        orderedQuantity: 10,
                        unitPrice: 100,
                        taxRate: 18,
                        discountPercentage: 10,
                    }
                ],
                buyerId: 'b1',
                buyerName: 'Buyer 1',
                deliveryAddress: 'Address 1',
            };

            // Financials:
            // lineTotal = 10 * 100 = 1000
            // discount = 1000 * 0.10 = 100
            // netAmount = 900
            // tax = 900 * 0.18 = 162
            // totalAmount = 900 + 162 = 1062

            const mockPO = ProcurementFactory.createPurchaseOrder({ id: 'po-1' });
            poRepository.create.mockReturnValue(mockPO as any);
            poRepository.save.mockResolvedValue(mockPO as any);
            poItemRepository.create.mockImplementation((data: any) => data);
            poItemRepository.save.mockResolvedValue([] as any);


            const result = await service.create(createDto as any);

            expect(poRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                subtotal: 900,
                taxAmount: 162,
                totalAmount: 1062
            }));
            expect(poItemRepository.create).toHaveBeenCalled();
            expect(poRepository.save).toHaveBeenCalled();
            expect(result.id).toBe('po-1');
        });
    });

    describe('submit', () => {
        it('should change status to SUBMITTED', async () => {
            const po = ProcurementFactory.createPurchaseOrder({ status: POStatus.DRAFT });
            poRepository.findOne.mockResolvedValue(po as any);
            poRepository.save.mockResolvedValue({ ...po, status: POStatus.SUBMITTED } as any);

            const result = await service.submit(po.id);

            expect(result.status).toBe(POStatus.SUBMITTED);
            expect(poRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                status: POStatus.SUBMITTED
            }));
        });
    });

    describe('approve', () => {
        it('should approve a PO and set approval details', async () => {
            const po = ProcurementFactory.createPurchaseOrder({ status: POStatus.SUBMITTED });
            poRepository.findOne.mockResolvedValue(po as any);
            const approverData = {
                approvedBy: 'admin-1',
                approverName: 'Admin Use',
                notes: 'Looks good',
            };

            poRepository.save.mockResolvedValue({ ...po, status: POStatus.APPROVED, isApproved: true } as any);

            const result = await service.approve(po.id, approverData);

            expect(result.status).toBe(POStatus.APPROVED);
            expect(poRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                isApproved: true,
                approvedBy: 'admin-1',
                approvalNotes: 'Looks good'
            }));
        });
    });

    describe('update', () => {
        it('should allow update only if status is DRAFT', async () => {
            const po = ProcurementFactory.createPurchaseOrder({ status: POStatus.SUBMITTED });
            poRepository.findOne.mockResolvedValue(po as any);

            await expect(service.update(po.id, {})).rejects.toThrow(BadRequestException);
            await expect(service.update(po.id, {})).rejects.toThrow('Only draft POs can be updated');
        });

        it('should update if status is DRAFT', async () => {
            const po = ProcurementFactory.createPurchaseOrder({ status: POStatus.DRAFT });
            poRepository.findOne.mockResolvedValue(po as any);
            poRepository.save.mockResolvedValue({ ...po, notes: 'Updated' } as any);

            const result = await service.update(po.id, { notes: 'Updated' });

            expect(poRepository.save).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return PO with items if found', async () => {
            const po = ProcurementFactory.createPurchaseOrder();
            poRepository.findOne.mockResolvedValue(po as any);

            const result = await service.findOne(po.id);

            expect(result.id).toBe(po.id);
            expect(poRepository.findOne).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: po.id },
                relations: ['items']
            }));
        });
    });
});
