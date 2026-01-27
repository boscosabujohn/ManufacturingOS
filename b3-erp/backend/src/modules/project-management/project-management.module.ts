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

import { ProjectTasksService } from './services/project-tasks.service';
import { ProjectResourcesService } from './services/project-resources.service';
import { ProjectBudgetsService } from './services/project-budgets.service';
import { ProjectMilestonesService } from './services/project-milestones.service';
import { TimeLogsService } from './services/time-logs.service';

import { ProjectFinancialsService } from './services/project-financials.service';
import { TASettlementService } from './services/ta-settlement.service';
import { EmergencySpareService } from './services/emergency-spare.service';

import { ProjectStatusSeederService } from './services/project-status-seeder.service';
import { ProjectTypeSeederService } from './services/project-type-seeder.service';

import { ProjectTasksController } from './controllers/project-tasks.controller';
import { ProjectResourcesController } from './controllers/project-resources.controller';
import { ProjectBudgetsController } from './controllers/project-budgets.controller';
import { ProjectMilestonesController } from './controllers/project-milestones.controller';
import { TimeLogsController } from './controllers/time-logs.controller';

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
        ProjectTypeEntity
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
        TimeLogsController
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
        ProjectStatusSeederService,
        ProjectTypeSeederService
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
