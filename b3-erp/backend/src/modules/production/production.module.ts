import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowModule } from '../workflow/workflow.module';

// Entities
import {
  BOM,
  BOMItem,
  WorkOrder,
  WorkOrderItem,
  ProductionPlan,
  ShopFloorControl,
  Operation,
  WorkCenter,
  Routing,
  ProductionEntry,
} from './entities';

// Services
import {
  BOMService,
  WorkOrderService,
  ProductionPlanService,
  ShopFloorControlService,
  OperationService,
  WorkCenterService,
  RoutingService,
  ProductionEntryService,
} from './services';

// Controllers
import {
  BOMController,
  WorkOrderController,
  ProductionPlanController,
  ShopFloorControlController,
  OperationController,
  WorkCenterController,
  RoutingController,
  ProductionEntryController,
} from './controllers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Main entities
      BOM,
      BOMItem,
      WorkOrder,
      WorkOrderItem,
      ProductionPlan,
      ShopFloorControl,
      Operation,
      WorkCenter,
      Routing,
      ProductionEntry,
    ]),
    WorkflowModule,
  ],
  controllers: [
    BOMController,
    WorkOrderController,
    ProductionPlanController,
    ShopFloorControlController,
    OperationController,
    WorkCenterController,
    RoutingController,
    ProductionEntryController,
  ],
  providers: [
    BOMService,
    WorkOrderService,
    ProductionPlanService,
    ShopFloorControlService,
    OperationService,
    WorkCenterService,
    RoutingService,
    ProductionEntryService,
  ],
  exports: [
    BOMService,
    WorkOrderService,
    ProductionPlanService,
    ShopFloorControlService,
    OperationService,
    WorkCenterService,
    RoutingService,
    ProductionEntryService,
  ],
})
export class ProductionModule {}
