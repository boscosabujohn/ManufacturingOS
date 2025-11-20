import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';

// Entities
import { OrderTracking } from './entities/order-tracking.entity';

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

// Controllers
import { OrderTrackingController } from './controllers/order-tracking.controller';

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
    TypeOrmModule.forFeature([OrderTracking]),

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
  controllers: [OrderTrackingController],
  providers: [
    // Core services
    EventBusService,
    NotificationService,
    OrderTrackingService,

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
    SalesProductionWorkflowService,
    ProcurementInventoryWorkflowService,
  ],
})
export class WorkflowModule {}
