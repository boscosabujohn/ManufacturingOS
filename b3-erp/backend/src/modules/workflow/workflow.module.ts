import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';

// Entities
import { OrderTracking } from './entities/order-tracking.entity';
import { WorkflowDefinition } from './entities/workflow-definition.entity';
import { WorkflowInstance } from './entities/workflow-instance.entity';
import { WorkflowStep } from './entities/workflow-step.entity';
import { WorkflowHistory } from './entities/workflow-history.entity';

// New workflow engine entities
import {
  ProjectPhase,
  PhaseTransition,
  WorkflowDocument,
  WorkflowApproval,
  ApprovalStep,
  QualityGate,
  QualityGateItem,
  Defect,
  WorkflowRule,
  NotificationTemplate,
  NotificationPreference,
} from './entities';

// Import other modules for processor dependencies
import { ProductionModule } from '../production/production.module';
import { InventoryModule } from '../inventory/inventory.module';

// Services
import {
  EventBusService,
  NotificationService,
  OrderTrackingService,
  SalesProductionWorkflowService,
  ProcurementInventoryWorkflowService,
  StateMachineService,
  RuleEngineService,
  DocumentService,
  ApprovalService,
  QualityGateService,
} from './services';
import { WorkflowRepositoryService } from './services/workflow-repository.service';
import { WorkflowSeederService } from './services/workflow-seeder.service';
import { EmailGatewayService } from './services/email-gateway.service';
import { ParallelApprovalService } from './services/parallel-approval.service';
import { IntelligentRoutingService } from './services/intelligent-routing.service';

// Controllers
import { OrderTrackingController } from './controllers/order-tracking.controller';
import { WorkflowRepositoryController } from './controllers/workflow-repository.controller';
import { WorkflowController } from './controllers/workflow.controller';
import { PhaseManagementController } from './controllers/phase-management.controller';
import { DocumentController } from './controllers/document.controller';
import { ApprovalController } from './controllers/approval.controller';
import { NotificationController } from './controllers/notification.controller';
import { QualityGateController } from './controllers/quality-gate.controller';
import { AnalyticsController } from './controllers/analytics.controller';
import { AnalyticsService } from './services/analytics.service';
import { Project } from '../project/entities/project.entity';
import { ProjectService } from '../project/services/project.service';
import { ProjectController } from '../project/controllers/project.controller';
import { BOQ } from '../project/entities/boq.entity';
import { BOQItem } from '../project/entities/boq-item.entity';
import { BOQService } from '../project/services/boq.service';
import { BOQController } from '../project/controllers/boq.controller';

// Processors
// Processors
import { WorkflowProcessor, NotificationProcessor } from './processors';

// Listeners
import { WorkflowEventListener } from './listeners/workflow-event.listener';
import { WorkflowGateway } from './gateways/workflow.gateway';

@Module({
  imports: [
    // Event Emitter for event-driven architecture
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 20,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),

    // Database entities
    TypeOrmModule.forFeature([
      OrderTracking,
      WorkflowDefinition,
      WorkflowInstance,
      WorkflowStep,
      WorkflowHistory,
      // New workflow engine entities
      ProjectPhase,
      PhaseTransition,
      WorkflowDocument,
      WorkflowApproval,
      ApprovalStep,
      QualityGate,
      QualityGateItem,
      Defect,
      WorkflowRule,
      NotificationTemplate,
      NotificationPreference,
      Project,
      BOQ,
      BOQItem,
    ]),

    // Bull queues for async job processing
    BullModule.registerQueue(
      {
        name: 'workflow',
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: false,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      },
      {
        name: 'notifications',
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: false,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      },
    ),

    // Import other modules with forwardRef to resolve circular dependencies
    forwardRef(() => ProductionModule),
    forwardRef(() => InventoryModule),
  ],
  controllers: [
    OrderTrackingController,
    WorkflowRepositoryController,
    WorkflowController,
    PhaseManagementController,
    DocumentController,
    ApprovalController,
    NotificationController,
    QualityGateController,
    AnalyticsController,
    ProjectController,
    BOQController,
  ],
  providers: [
    // Core services
    EventBusService,
    NotificationService,
    OrderTrackingService,
    WorkflowRepositoryService,
    WorkflowSeederService,

    // Workflow orchestration services
    SalesProductionWorkflowService,
    ProcurementInventoryWorkflowService,
    StateMachineService, // New state machine service
    RuleEngineService,
    DocumentService,
    ApprovalService,
    QualityGateService,
    AnalyticsService,
    ProjectService,
    BOQService,

    // Queue processors
    WorkflowProcessor,
    NotificationProcessor,

    // Additional services
    EmailGatewayService,
    ParallelApprovalService,
    IntelligentRoutingService,
    WorkflowEventListener,
    WorkflowGateway,
  ],
  exports: [
    EventBusService,
    NotificationService,
    OrderTrackingService,
    WorkflowRepositoryService,
    SalesProductionWorkflowService,
    ProcurementInventoryWorkflowService,
    StateMachineService,
    EmailGatewayService,
    ParallelApprovalService,
    IntelligentRoutingService,
  ],
})
export class WorkflowModule { }

