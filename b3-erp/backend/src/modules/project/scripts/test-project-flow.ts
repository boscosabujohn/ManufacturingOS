
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from '../services/project.service';
import { BOQService } from '../services/boq.service';
import { SalesProductionWorkflowService } from '../../workflow/services/sales-production-workflow.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { BOQ } from '../entities/boq.entity';
import { BOQItem } from '../entities/boq-item.entity';
import { WorkflowEventType } from '../../workflow/events/event-types';
import { EventEmitter2 } from '@nestjs/event-emitter';

// Mock Repositories
const mockRepository = {
    create: jest.fn((dto) => dto),
    save: jest.fn((entity) => Promise.resolve({ ...entity, id: 'mock-id-' + Math.random() })),
    findOne: jest.fn(() => Promise.resolve(null)),
    find: jest.fn(() => Promise.resolve([])),
};

const mockEventBus = {
    emit: jest.fn(),
};

const mockNotificationService = {
    notifyTeam: jest.fn(),
};

const mockQueue = {
    add: jest.fn(),
};

const mockStateMachine = {
    initializeProject: jest.fn(),
};

async function runProjectFlowSimulation() {
    console.log('Starting Project Flow Simulation...');

    const module: TestingModule = await Test.createTestingModule({
        providers: [
            ProjectService,
            BOQService,
            SalesProductionWorkflowService,
            { provide: 'EventBusService', useValue: mockEventBus },
            { provide: 'NotificationService', useValue: mockNotificationService },
            { provide: 'BullQueue_workflow', useValue: mockQueue },
            { provide: 'StateMachineService', useValue: mockStateMachine },
            { provide: EventEmitter2, useValue: { emit: jest.fn() } },
            { provide: getRepositoryToken(Project), useValue: { ...mockRepository } },
            { provide: getRepositoryToken(BOQ), useValue: { ...mockRepository } },
            { provide: getRepositoryToken(BOQItem), useValue: { ...mockRepository } },
        ],
    }).compile();

    const projectService = module.get<ProjectService>(ProjectService);
    const boqService = module.get<BOQService>(BOQService);
    const workflowService = module.get<SalesProductionWorkflowService>(SalesProductionWorkflowService);

    // 1. Simulate Order Confirmation
    console.log('\n1. Simulating Order Confirmation...');
    const orderPayload = {
        orderId: 'order-123',
        orderNumber: 'SO-001',
        customerId: 'cust-1',
        customerName: 'Acme Corp',
        items: [],
        deliveryDate: new Date(),
        userId: 'user-1',
        totalAmount: 10000,
    };

    // Mock project creation to return a project
    const mockProject = { id: 'project-new-1', name: 'Project for Order SO-001' };
    jest.spyOn(projectService, 'createProject').mockResolvedValue(mockProject as any);

    await workflowService.handleOrderConfirmed(orderPayload);

    console.log('Order Confirmed handled.');
    expect(projectService.createProject).toHaveBeenCalled();
    console.log('Project creation triggered.');

    // 2. Create BOQ for Project
    console.log('\n2. Creating BOQ for Project...');
    const boq = await boqService.createBOQ({
        projectId: mockProject.id,
        name: 'Initial BOQ',
        createdBy: 'user-1',
    });
    console.log('BOQ Created:', boq.id);

    // 3. Add Items to BOQ
    console.log('\n3. Adding Items to BOQ...');
    const item = await boqService.addItem(boq.id, {
        description: 'Steel Sheets',
        quantity: 10,
        unit: 'pcs',
        rate: 100,
        amount: 1000,
    });
    console.log('Item Added:', item.description, 'Amount:', item.amount);

    // Mock getBOQ to return items for total calculation
    jest.spyOn(boqService, 'getBOQ').mockResolvedValue({
        ...boq,
        items: [item],
        totalAmount: 1000
    } as any);

    console.log('\nSimulation Completed Successfully!');
}

// Helper for simple assertion
function expect(actual: any) {
    return {
        toHaveBeenCalled: () => {
            if (actual.mock.calls.length > 0) {
                console.log('Assertion Passed: Function was called.');
            } else {
                console.error('Assertion Failed: Function was NOT called.');
            }
        }
    }
}

// runProjectFlowSimulation();
