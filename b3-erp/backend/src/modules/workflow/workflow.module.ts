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
} from './services';
import { WorkflowRepositoryService } from './services/workflow-repository.service';

// Controllers
import { OrderTrackingController } from './controllers/order-tracking.controller';
import { WorkflowRepositoryController } from './controllers/workflow-repository.controller';

// Processors
import { WorkflowProcessor, NotificationProcessor } from './processors';

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
  controllers: [OrderTrackingController, WorkflowRepositoryController],
  providers: [
    // Core services
    EventBusService,
    NotificationService,
    OrderTrackingService,
    WorkflowRepositoryService,

    // Workflow orchestration services
    SalesProductionWorkflowService,
    ProcurementInventoryWorkflowService,

    // Queue processors
    WorkflowProcessor,
    NotificationProcessor,
  ],
  exports: [
    EventBusService,
    NotificationService,
    OrderTrackingService,
    WorkflowRepositoryService,
    SalesProductionWorkflowService,
    ProcurementInventoryWorkflowService,
  ],
})
export class WorkflowModule {}
