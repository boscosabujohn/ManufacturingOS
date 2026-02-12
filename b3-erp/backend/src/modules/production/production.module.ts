import { Module, forwardRef } from '@nestjs/common';
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
  MachineMaintenanceLog,
  // Production Planning Entities
  CapacityPlan,
  DemandPlan,
  AggregatePlan,
  MasterSchedule,
  // MRP Entities
  MRPRun,
  PlannedOrder,
  MaterialRequirement,
  ShortageRecord,
  // Production Scheduling Entities
  ProductionSchedule,
  ResourceAllocation,
  JobSequence,
  // Downtime Entities
  DowntimeRecord,
  RootCauseAnalysis,
  // Production Analytics Entities
  OEERecord,
  ProductivityMetric,
  // Production Settings Entities
  ProductionLine,
  Shift,
  ShiftAssignment,
  // Industry 4.0 Entities
  DigitalTwin,
  EquipmentHealth,
  SimulationScenario,
  AssetTracker,
  // Smart AI Entities
  AIInsight,
  AnomalyRecord,
  QualityForecast,
  // Automation Entities
  AutomationWorkflow,
  MESIntegration,
  SystemHealthCheck,
  // Human-Centric Entities
  OperatorWorkstation,
  SkillMatrix,
  WorkloadAssignment,
  ErgonomicAlert,
  // Sustainability Entities
  CarbonFootprint,
  EnergyConsumption,
  WasteRecord,
  WaterUsage,
  ESGScore,
  GreenSupplier,
  // Resilience & Flexibility Entities
  SupplyChainRisk,
  ScenarioPlanning,
  CapacityFlexibility,
  BusinessContinuity,
  // Collaboration Entities
  TeamActivity,
  TeamMessage,
  ShiftHandoff,
  CustomerPortalAccess,
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
  MaintenanceLogService,
  // Production Planning Services
  CapacityPlanService,
  DemandPlanService,
  AggregatePlanService,
  MasterScheduleService,
  // MRP Services
  MRPRunService,
  PlannedOrderService,
  MaterialRequirementService,
  ShortageRecordService,
  // Production Scheduling Services
  ProductionScheduleService,
  ResourceAllocationService,
  JobSequenceService,
  // Downtime Services
  DowntimeRecordService,
  RootCauseAnalysisService,
  // Production Analytics Services
  OEERecordService,
  ProductivityMetricService,
  // Production Settings Services
  ProductionLineService,
  ShiftService,
  ShiftAssignmentService,
  // Industry 4.0 Services
  DigitalTwinService,
  EquipmentHealthService,
  SimulationScenarioService,
  AssetTrackerService,
  // Smart AI Services
  AIInsightService,
  AnomalyRecordService,
  QualityForecastService,
  // Automation Services
  AutomationWorkflowService,
  MESIntegrationService,
  SystemHealthCheckService,
  // Human-Centric Services
  OperatorWorkstationService,
  SkillMatrixService,
  WorkloadAssignmentService,
  ErgonomicAlertService,
  // Sustainability Services
  CarbonFootprintService,
  EnergyConsumptionService,
  WasteRecordService,
  WaterUsageService,
  ESGScoreService,
  GreenSupplierService,
  // Resilience & Flexibility Services
  SupplyChainRiskService,
  ScenarioPlanningService,
  CapacityFlexibilityService,
  BusinessContinuityService,
  // Collaboration Services
  TeamActivityService,
  TeamMessageService,
  ShiftHandoffService,
  CustomerPortalAccessService,
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
  MaintenanceLogController,
  DiesToolsController,
  // Production Planning Controllers
  CapacityPlanController,
  DemandPlanController,
  AggregatePlanController,
  MasterScheduleController,
  // MRP Controllers
  MRPRunController,
  PlannedOrderController,
  MaterialRequirementController,
  ShortageRecordController,
  // Production Scheduling Controllers
  ProductionScheduleController,
  ResourceAllocationController,
  JobSequenceController,
  // Downtime Controllers
  DowntimeRecordController,
  RootCauseAnalysisController,
  // Production Analytics Controllers
  OEERecordController,
  ProductivityMetricController,
  // Production Settings Controllers
  ProductionLineController,
  ShiftController,
  ShiftAssignmentController,
  // Industry 4.0 Controllers
  DigitalTwinController,
  EquipmentHealthController,
  SimulationScenarioController,
  AssetTrackerController,
  // Smart AI Controllers
  AIInsightController,
  AnomalyRecordController,
  QualityForecastController,
  // Automation Controllers
  AutomationWorkflowController,
  MESIntegrationController,
  SystemHealthCheckController,
  // Human-Centric Controllers
  OperatorWorkstationController,
  SkillMatrixController,
  WorkloadAssignmentController,
  ErgonomicAlertController,
  // Sustainability Controllers
  CarbonFootprintController,
  EnergyConsumptionController,
  WasteRecordController,
  WaterUsageController,
  ESGScoreController,
  GreenSupplierController,
  // Resilience & Flexibility Controllers
  SupplyChainRiskController,
  ScenarioPlanningController,
  CapacityFlexibilityController,
  BusinessContinuityController,
  // Collaboration Controllers
  TeamActivityController,
  TeamMessageController,
  ShiftHandoffController,
  CustomerPortalAccessController,
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
      WorkOrderStatusEntity,
      MachineMaintenanceLog,
      // Production Planning Entities
      CapacityPlan,
      DemandPlan,
      AggregatePlan,
      MasterSchedule,
      // MRP Entities
      MRPRun,
      PlannedOrder,
      MaterialRequirement,
      ShortageRecord,
      // Production Scheduling Entities
      ProductionSchedule,
      ResourceAllocation,
      JobSequence,
      // Downtime Entities
      DowntimeRecord,
      RootCauseAnalysis,
      // Production Analytics Entities
      OEERecord,
      ProductivityMetric,
      // Production Settings Entities
      ProductionLine,
      Shift,
      ShiftAssignment,
      // Industry 4.0 Entities
      DigitalTwin,
      EquipmentHealth,
      SimulationScenario,
      AssetTracker,
      // Smart AI Entities
      AIInsight,
      AnomalyRecord,
      QualityForecast,
      // Automation Entities
      AutomationWorkflow,
      MESIntegration,
      SystemHealthCheck,
      // Human-Centric Entities
      OperatorWorkstation,
      SkillMatrix,
      WorkloadAssignment,
      ErgonomicAlert,
      // Sustainability Entities
      CarbonFootprint,
      EnergyConsumption,
      WasteRecord,
      WaterUsage,
      ESGScore,
      GreenSupplier,
      // Resilience & Flexibility Entities
      SupplyChainRisk,
      ScenarioPlanning,
      CapacityFlexibility,
      BusinessContinuity,
      // Collaboration Entities
      TeamActivity,
      TeamMessage,
      ShiftHandoff,
      CustomerPortalAccess,
    ]),
    forwardRef(() => WorkflowModule),
  ],
  controllers: [
    // Core Controllers
    BOMController,
    WorkOrderController,
    ProductionPlanController,
    ShopFloorControlController,
    OperationController,
    WorkCenterController,
    RoutingController,
    ProductionEntryController,
    MaintenanceLogController,
    DiesToolsController,
    // Production Planning Controllers
    CapacityPlanController,
    DemandPlanController,
    AggregatePlanController,
    MasterScheduleController,
    // MRP Controllers
    MRPRunController,
    PlannedOrderController,
    MaterialRequirementController,
    ShortageRecordController,
    // Production Scheduling Controllers
    ProductionScheduleController,
    ResourceAllocationController,
    JobSequenceController,
    // Downtime Controllers
    DowntimeRecordController,
    RootCauseAnalysisController,
    // Production Analytics Controllers
    OEERecordController,
    ProductivityMetricController,
    // Production Settings Controllers
    ProductionLineController,
    ShiftController,
    ShiftAssignmentController,
    // Industry 4.0 Controllers
    DigitalTwinController,
    EquipmentHealthController,
    SimulationScenarioController,
    AssetTrackerController,
    // Smart AI Controllers
    AIInsightController,
    AnomalyRecordController,
    QualityForecastController,
    // Automation Controllers
    AutomationWorkflowController,
    MESIntegrationController,
    SystemHealthCheckController,
    // Human-Centric Controllers
    OperatorWorkstationController,
    SkillMatrixController,
    WorkloadAssignmentController,
    ErgonomicAlertController,
    // Sustainability Controllers
    CarbonFootprintController,
    EnergyConsumptionController,
    WasteRecordController,
    WaterUsageController,
    ESGScoreController,
    GreenSupplierController,
    // Resilience & Flexibility Controllers
    SupplyChainRiskController,
    ScenarioPlanningController,
    CapacityFlexibilityController,
    BusinessContinuityController,
    // Collaboration Controllers
    TeamActivityController,
    TeamMessageController,
    ShiftHandoffController,
    CustomerPortalAccessController,
  ],
  providers: [
    // Core Services
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
    MaintenanceLogService,
    // Production Planning Services
    CapacityPlanService,
    DemandPlanService,
    AggregatePlanService,
    MasterScheduleService,
    // MRP Services
    MRPRunService,
    PlannedOrderService,
    MaterialRequirementService,
    ShortageRecordService,
    // Production Scheduling Services
    ProductionScheduleService,
    ResourceAllocationService,
    JobSequenceService,
    // Downtime Services
    DowntimeRecordService,
    RootCauseAnalysisService,
    // Production Analytics Services
    OEERecordService,
    ProductivityMetricService,
    // Production Settings Services
    ProductionLineService,
    ShiftService,
    ShiftAssignmentService,
    // Industry 4.0 Services
    DigitalTwinService,
    EquipmentHealthService,
    SimulationScenarioService,
    AssetTrackerService,
    // Smart AI Services
    AIInsightService,
    AnomalyRecordService,
    QualityForecastService,
    // Automation Services
    AutomationWorkflowService,
    MESIntegrationService,
    SystemHealthCheckService,
    // Human-Centric Services
    OperatorWorkstationService,
    SkillMatrixService,
    WorkloadAssignmentService,
    ErgonomicAlertService,
    // Sustainability Services
    CarbonFootprintService,
    EnergyConsumptionService,
    WasteRecordService,
    WaterUsageService,
    ESGScoreService,
    GreenSupplierService,
    // Resilience & Flexibility Services
    SupplyChainRiskService,
    ScenarioPlanningService,
    CapacityFlexibilityService,
    BusinessContinuityService,
    // Collaboration Services
    TeamActivityService,
    TeamMessageService,
    ShiftHandoffService,
    CustomerPortalAccessService,
  ],
  exports: [
    // Core Services
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
    MaintenanceLogService,
    // Production Planning Services
    CapacityPlanService,
    DemandPlanService,
    AggregatePlanService,
    MasterScheduleService,
    // MRP Services
    MRPRunService,
    PlannedOrderService,
    MaterialRequirementService,
    ShortageRecordService,
    // Production Scheduling Services
    ProductionScheduleService,
    ResourceAllocationService,
    JobSequenceService,
    // Downtime Services
    DowntimeRecordService,
    RootCauseAnalysisService,
    // Production Analytics Services
    OEERecordService,
    ProductivityMetricService,
    // Production Settings Services
    ProductionLineService,
    ShiftService,
    ShiftAssignmentService,
    // Industry 4.0 Services
    DigitalTwinService,
    EquipmentHealthService,
    SimulationScenarioService,
    AssetTrackerService,
    // Smart AI Services
    AIInsightService,
    AnomalyRecordService,
    QualityForecastService,
    // Automation Services
    AutomationWorkflowService,
    MESIntegrationService,
    SystemHealthCheckService,
    // Human-Centric Services
    OperatorWorkstationService,
    SkillMatrixService,
    WorkloadAssignmentService,
    ErgonomicAlertService,
    // Sustainability Services
    CarbonFootprintService,
    EnergyConsumptionService,
    WasteRecordService,
    WaterUsageService,
    ESGScoreService,
    GreenSupplierService,
    // Resilience & Flexibility Services
    SupplyChainRiskService,
    ScenarioPlanningService,
    CapacityFlexibilityService,
    BusinessContinuityService,
    // Collaboration Services
    TeamActivityService,
    TeamMessageService,
    ShiftHandoffService,
    CustomerPortalAccessService,
  ],
})
export class ProductionModule { }
