import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { WorkOrderService } from '../../src/modules/production/services/work-order.service';
import { WorkOrder, WorkOrderStatus } from '../../src/modules/production/entities/work-order.entity';
import { WorkOrderItem } from '../../src/modules/production/entities/work-order-item.entity';
import { EventBusService } from '../../src/modules/workflow/services/event-bus.service';
import { ProductionFactory } from '../factories/production.factory';
import { createMockRepository, createMockService } from '../utils/test-setup';

describe('WorkOrderService', () => {
    let service: WorkOrderService;
    let workOrderRepository: jest.Mocked<Repository<WorkOrder>>;
    let workOrderItemRepository: jest.Mocked<Repository<WorkOrderItem>>;
    let eventBus: jest.Mocked<EventBusService>;

    beforeEach(async () => {
        workOrderRepository = createMockRepository<WorkOrder>();
        workOrderItemRepository = createMockRepository<WorkOrderItem>();
        eventBus = createMockService<EventBusService>([
            'emitWorkOrderCreated',
            'emitWorkOrderReleased',
            'emitWorkOrderStarted',
            'emitWorkOrderCompleted',
        ]);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WorkOrderService,
                {
                    provide: getRepositoryToken(WorkOrder),
                    useValue: workOrderRepository,
                },
                {
                    provide: getRepositoryToken(WorkOrderItem),
                    useValue: workOrderItemRepository,
                },
                {
                    provide: EventBusService,
                    useValue: eventBus,
                },
            ],
        }).compile();

        service = module.get<WorkOrderService>(WorkOrderService);
        ProductionFactory.resetCounters();
    });

    describe('create', () => {
        it('should create a work order and emit created event', async () => {
            const createDto = {
                workOrderNumber: 'WO-001',
                workOrderName: 'Production Run 1',
                itemId: 'item-1',
                itemName: 'Item 1',
                plannedQuantity: 100,
                uom: 'PCS',
                plannedStartDate: new Date(),
                plannedEndDate: new Date(),
            };

            workOrderRepository.findOne.mockResolvedValue(null);
            const mockWO = ProductionFactory.createWorkOrder(createDto as any);
            workOrderRepository.create.mockReturnValue(mockWO as any);
            workOrderRepository.save.mockResolvedValue(mockWO as any);

            const result = await service.create(createDto as any);

            expect(workOrderRepository.save).toHaveBeenCalled();
            expect(eventBus.emitWorkOrderCreated).toHaveBeenCalled();
            expect(result.status).toBe(WorkOrderStatus.DRAFT);
        });

        it('should throw BadRequestException if work order number exists', async () => {
            workOrderRepository.findOne.mockResolvedValue({ id: 'existing' } as any);
            const createDto = { workOrderNumber: 'WO-001' };

            await expect(service.create(createDto as any)).rejects.toThrow(BadRequestException);
        });
    });

    describe('release', () => {
        it('should release work order from submitted status', async () => {
            const wo = ProductionFactory.createWorkOrder({ status: WorkOrderStatus.SUBMITTED });
            workOrderRepository.findOne.mockResolvedValue(wo as any);
            workOrderRepository.save.mockResolvedValue({ ...wo, status: WorkOrderStatus.RELEASED } as any);

            const result = await service.release(wo.id, 'user-1');

            expect(result.status).toBe(WorkOrderStatus.RELEASED);
            expect(eventBus.emitWorkOrderReleased).toHaveBeenCalled();
        });

        it('should throw if not in submitted status', async () => {
            const wo = ProductionFactory.createWorkOrder({ status: WorkOrderStatus.DRAFT });
            workOrderRepository.findOne.mockResolvedValue(wo as any);

            await expect(service.release(wo.id, 'user-1')).rejects.toThrow(BadRequestException);
        });
    });

    describe('updateProgress', () => {
        it('should calculate pending quantity and percentage correctly', async () => {
            const wo = ProductionFactory.createWorkOrder({ plannedQuantity: 100 });
            workOrderRepository.findOne.mockResolvedValue(wo as any);
            workOrderRepository.save.mockImplementation((data: any) => data);

            const result = await service.updateProgress(wo.id, 40);

            expect(result.producedQuantity).toBe(40);
            expect(result.pendingQuantity).toBe(60);
            expect(result.progressPercentage).toBe(40);
        });
    });

    describe('complete', () => {
        it('should complete work order from in-progress status', async () => {
            const wo = ProductionFactory.createWorkOrder({ status: WorkOrderStatus.IN_PROGRESS });
            workOrderRepository.findOne.mockResolvedValue(wo as any);
            workOrderRepository.save.mockResolvedValue({ ...wo, status: WorkOrderStatus.COMPLETED } as any);

            const result = await service.complete(wo.id, 'user-1');

            expect(result.status).toBe(WorkOrderStatus.COMPLETED);
            expect(eventBus.emitWorkOrderCompleted).toHaveBeenCalled();
        });
    });
});
