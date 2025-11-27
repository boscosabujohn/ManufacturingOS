
import { Test, TestingModule } from '@nestjs/testing';
import { StateMachineService } from '../services/state-machine.service';
import { DocumentService } from '../services/document.service';
import { ApprovalService } from '../services/approval.service';
import { QualityGateService } from '../services/quality-gate.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectPhase } from '../entities/project-phase.entity';
import { PhaseTransition } from '../entities/phase-transition.entity';
import { WorkflowDocument } from '../entities/workflow-document.entity';
import { WorkflowApproval } from '../entities/workflow-approval.entity';
import { ApprovalStep } from '../entities/approval-step.entity';
import { QualityGate } from '../entities/quality-gate.entity';
import { QualityGateItem } from '../entities/quality-gate-item.entity';
import { Defect } from '../entities/defect.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventBusService } from '../services/event-bus.service';
import { NotificationService } from '../services/notification.service';

// Mock Repositories
const mockRepository = {
    create: jest.fn((dto) => dto),
    save: jest.fn((entity) => Promise.resolve({ ...entity, id: 'mock-id-' + Math.random() })),
    findOne: jest.fn(() => Promise.resolve(null)),
    find: jest.fn(() => Promise.resolve([])),
    count: jest.fn(() => Promise.resolve(0)),
};

const mockEventBus = {
    emit: jest.fn(),
};

const mockEventEmitter = {
    emit: jest.fn(),
};

async function runWorkflowSimulation() {
    console.log('Starting Workflow Simulation...');

    const module: TestingModule = await Test.createTestingModule({
        providers: [
            StateMachineService,
            DocumentService,
            ApprovalService,
            QualityGateService,
            { provide: EventBusService, useValue: mockEventBus },
            { provide: EventEmitter2, useValue: mockEventEmitter },
            { provide: getRepositoryToken(ProjectPhase), useValue: { ...mockRepository } },
            { provide: getRepositoryToken(PhaseTransition), useValue: { ...mockRepository } },
            { provide: getRepositoryToken(WorkflowDocument), useValue: { ...mockRepository } },
            { provide: getRepositoryToken(WorkflowApproval), useValue: { ...mockRepository } },
            { provide: getRepositoryToken(ApprovalStep), useValue: { ...mockRepository } },
            { provide: getRepositoryToken(QualityGate), useValue: { ...mockRepository } },
            { provide: getRepositoryToken(QualityGateItem), useValue: { ...mockRepository } },
            { provide: getRepositoryToken(Defect), useValue: { ...mockRepository } },
            { provide: 'ParallelApprovalService', useValue: {} }, // Mock if needed
        ],
    }).compile();

    const stateMachine = module.get<StateMachineService>(StateMachineService);
    const documentService = module.get<DocumentService>(DocumentService);
    const approvalService = module.get<ApprovalService>(ApprovalService);
    const qualityGateService = module.get<QualityGateService>(QualityGateService);

    const projectId = 'project-123';
    const userId = 'user-admin';

    // 1. Initialize Project
    console.log('\n1. Initializing Project...');
    const phase = await stateMachine.initializeProject(projectId);
    console.log('Project initialized in phase:', phase.currentPhase);

    // 2. Transition to Phase 2 (Site & Design)
    console.log('\n2. Transitioning to Phase 2...');
    await stateMachine.transitionPhase(projectId, 2, userId);
    console.log('Transitioned to Phase 2');

    // 3. Upload Document (Site Measurements)
    console.log('\n3. Uploading Site Measurements Document...');
    const doc = await documentService.uploadDocument(
        { originalname: 'measurements.pdf', size: 1024, mimetype: 'application/pdf' },
        projectId,
        'site_measurements',
        userId,
    );
    console.log('Document uploaded:', doc.fileName);

    // 4. Submit for Approval
    console.log('\n4. Submitting Document for Approval...');
    const approval = await approvalService.createApproval(
        projectId,
        'document',
        doc.id,
        'sequential',
        [{ approverId: 'manager-1', stepNumber: 1 }],
        userId,
    );
    console.log('Approval created:', approval.id);

    // 5. Approve Document
    console.log('\n5. Approving Document...');
    await approvalService.processAction(approval.id, 'manager-1', 'approve', 'Looks good');
    console.log('Document approved');

    // 6. Transition to Phase 3 (Technical)
    console.log('\n6. Transitioning to Phase 3...');
    await stateMachine.transitionPhase(projectId, 3, userId);
    console.log('Transitioned to Phase 3');

    // ... Skip to Production Phase (Phase 5)
    console.log('\n... Skipping to Phase 5 (Production)...');

    // Mock current phase as 4 for transition
    jest.spyOn(stateMachine, 'getCurrentPhase').mockResolvedValue({ currentPhase: 4 } as any);

    // Create Material QA Gate
    console.log('\n7. Creating Material QA Gate...');
    const gate = await qualityGateService.createQualityGate(
        projectId,
        4,
        'material_qa',
        [{ description: 'Check raw materials' }],
    );
    console.log('Quality Gate created:', gate.id);

    // Pass Quality Gate
    console.log('\n8. Passing Quality Gate...');
    const item = gate.items[0]; // In real run, this would be fetched
    // Mock item retrieval since save returns mock
    jest.spyOn(qualityGateService['itemRepository'], 'findOne').mockResolvedValue({ ...item, id: 'item-1' } as any);

    await qualityGateService.updateChecklistItem('item-1', true);

    // Mock gate retrieval with items
    jest.spyOn(qualityGateService, 'getQualityGate').mockResolvedValue({
        ...gate,
        items: [{ ...item, passed: true }],
    } as any);

    await qualityGateService.finalizeInspection(gate.id, true, 'All good');
    console.log('Quality Gate passed');

    // Mock getProjectQualityGates for transition check
    jest.spyOn(qualityGateService, 'getProjectQualityGates').mockResolvedValue([
        { phase: 4, gateType: 'material_qa', status: 'passed' } as any
    ]);

    // Transition to Phase 5
    console.log('\n9. Transitioning to Phase 5...');
    await stateMachine.transitionPhase(projectId, 5, userId);
    console.log('Transitioned to Phase 5');

    console.log('\nSimulation Completed Successfully!');
}

// runWorkflowSimulation();
