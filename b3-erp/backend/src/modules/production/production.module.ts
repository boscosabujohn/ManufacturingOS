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
import { WorkOrderStatusEntity } from './entities/work-order-status.entity';

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
  WorkCenterSeederService,
  OperationSeederService,
} from './services';
import { WorkOrderStatusSeederService } from './services/work-order-status-seeder.service';
import { EscalationManagementService } from './services/escalation-management.service';
import { MRPRequisitionService } from './services/mrp-requisition.service';
import { DemandForecastingService } from './services/demand-forecasting.service';
import { DiesToolsService } from './services/dies-tools.service';

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
import { DiesToolsController } from './controllers/dies-tools.controller';

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
      WorkOrderStatusEntity,
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
    DiesToolsController,
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
    EscalationManagementService,
    MRPRequisitionService,
    DemandForecastingService,
    DiesToolsService,
    WorkCenterSeederService,
    OperationSeederService,
    WorkOrderStatusSeederService,
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
    EscalationManagementService,
    MRPRequisitionService,
    DemandForecastingService,
    DiesToolsService,
  ],
})
export class ProductionModule { }
