import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MobileController } from './controllers/mobile-api.controller';
import { ProjectFinancialsController } from './controllers/project-financials.controller';
import { TASettlementController } from './controllers/ta-settlement.controller';
import { EmergencySparesController } from './controllers/emergency-spares.controller';
import { Project } from '../project/entities/project.entity';
import { ProjectTask } from './entities/project-task.entity';
import { ProjectResource } from './entities/project-resource.entity';
import { ProjectBudget } from './entities/project-budget.entity';
import { ProjectMilestone } from './entities/project-milestone.entity';
import { ResourceCapacity } from './entities/resource-capacity.entity';
import { TimeLog } from './entities/time-log.entity';
import { ProjectStatusEntity } from './entities/project-status.entity';
import { ProjectTypeEntity } from './entities/project-type.entity';
import { ProjectAttachment } from '../project/entities/project-attachment.entity';
import { BOQ } from '../project/entities/boq.entity';
import { BOQItem } from '../project/entities/boq-item.entity';
import { Item } from '../core/entities/item.entity';
import { DiscrepancyLog } from '../project/entities/discrepancy-log.entity';
import { SiteSurvey } from '../project/entities/site-survey.entity';
import { ExternalApproval } from '../project/entities/external-approval.entity';
import { BOMHeader } from './entities/bom-header.entity';
import { BOMDetail } from './entities/bom-detail.entity';
import { InventoryReservation } from './entities/inventory-reservation.entity';
import { PurchaseRequisition } from './entities/purchase-requisition.entity';
import { GRN } from './entities/grn.entity';
import { NestingAsset } from './entities/nesting-asset.entity';
import { ProductionLog } from './entities/production-log.entity';
import { TrialReport } from './entities/trial-report.entity';
import { QCRecord } from './entities/qc-record.entity';
import { PackagingCrate } from './entities/packaging-crate.entity';
import { PackagingItem } from './entities/packaging-item.entity';
import { DispatchRecord } from './entities/dispatch-record.entity';
import { SiteReadiness } from './entities/site-readiness.entity';
import { InstallationTask } from './entities/installation-task.entity';
import { HandoverCertificate } from './entities/handover-certificate.entity';

import { ProjectTasksService } from './services/project-tasks.service';
import { ProjectResourcesService } from './services/project-resources.service';
import { ProjectBudgetsService } from './services/project-budgets.service';
import { ProjectMilestonesService } from './services/project-milestones.service';
import { TimeLogsService } from './services/time-logs.service';
import { BOQService } from './services/boq.service';

import { ProjectFinancialsService } from './services/project-financials.service';
import { TASettlementService } from './services/ta-settlement.service';
import { EmergencySpareService } from './services/emergency-spare.service';
import { DesignVerificationService } from './services/design-verification.service';
import { TechnicalDesignService } from './services/technical-design.service';
import { ProcurementService } from './services/procurement.service';
import { ProductionService } from './services/production.service';
import { QCPackagingService } from './services/qc-packaging.service';
import { LogisticsInstallationService } from './services/logistics-installation.service';
import { ProjectClosureService } from './services/project-closure.service';

import { ProjectStatusSeederService } from './services/project-status-seeder.service';
import { ProjectTypeSeederService } from './services/project-type-seeder.service';
import { ProjectSeederService } from './services/project-seeder.service';

import { ProjectTasksController } from './controllers/project-tasks.controller';
import { ProjectResourcesController } from './controllers/project-resources.controller';
import { ProjectBudgetsController } from './controllers/project-budgets.controller';
import { ProjectMilestonesController } from './controllers/project-milestones.controller';
import { TimeLogsController } from './controllers/time-logs.controller';
import { BOQController } from './controllers/boq.controller';
import { DesignVerificationController } from './controllers/design-verification.controller';
import { TechnicalDesignController } from './controllers/technical-design.controller';
import { ProcurementController } from './controllers/procurement.controller';
import { ProductionController } from './controllers/production.controller';
import { QCPackagingController } from './controllers/qc-packaging.controller';
import { LogisticsInstallationController } from './controllers/logistics-installation.controller';
import { ProjectClosureController } from './controllers/project-closure.controller';

@Module({
    imports: [TypeOrmModule.forFeature([
        Project,
        ProjectTask,
        ProjectResource,
        ProjectBudget,
        ProjectMilestone,
        ResourceCapacity,
        TimeLog,
        ProjectStatusEntity,
        ProjectTypeEntity,
        ProjectAttachment,
        BOQ,
        BOQItem,
        Item,
        DiscrepancyLog,
        SiteSurvey,
        ExternalApproval,
        BOMHeader,
        BOMDetail,
        InventoryReservation,
        PurchaseRequisition,
        GRN,
        NestingAsset,
        ProductionLog,
        TrialReport,
        QCRecord,
        PackagingCrate,
        PackagingItem,
        DispatchRecord,
        SiteReadiness,
        InstallationTask,
        HandoverCertificate
    ])],
    controllers: [
        ProjectController,
        MobileController,
        ProjectFinancialsController,
        TASettlementController,
        EmergencySparesController,
        ProjectTasksController,
        ProjectResourcesController,
        ProjectBudgetsController,
        ProjectMilestonesController,
        TimeLogsController,
        BOQController,
        DesignVerificationController,
        TechnicalDesignController,
        ProcurementController,
        ProductionController,
        QCPackagingController,
        LogisticsInstallationController,
        ProjectClosureController
    ],
    providers: [
        ProjectService,
        ProjectFinancialsService,
        TASettlementService,
        EmergencySpareService,
        ProjectTasksService,
        ProjectResourcesService,
        ProjectBudgetsService,
        ProjectMilestonesService,
        TimeLogsService,
        BOQService,
        DesignVerificationService,
        TechnicalDesignService,
        ProcurementService,
        ProductionService,
        QCPackagingService,
        LogisticsInstallationService,
        ProjectClosureService,
        ProjectStatusSeederService,
        ProjectTypeSeederService,
        ProjectSeederService
    ],
    exports: [
        ProjectService,
        ProjectFinancialsService,
        TASettlementService,
        EmergencySpareService,
        ProjectTasksService,
        ProjectResourcesService,
        ProjectBudgetsService,
        ProjectMilestonesService,
        TimeLogsService
    ],
})
export class ProjectManagementModule { }
