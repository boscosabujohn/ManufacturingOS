import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MobileController } from './controllers/mobile-api.controller';
import { ProjectFinancialsController } from './controllers/project-financials.controller';
import { TASettlementController } from './controllers/ta-settlement.controller';
import { EmergencySparesController } from './controllers/emergency-spares.controller';
import { Project } from './entities/project.entity';

import { ProjectFinancialsService } from './services/project-financials.service';
import { TASettlementService } from './services/ta-settlement.service';
import { EmergencySpareService } from './services/emergency-spare.service';

@Module({
    imports: [TypeOrmModule.forFeature([Project])],
    controllers: [ProjectController, MobileController, ProjectFinancialsController, TASettlementController, EmergencySparesController],
    providers: [ProjectService, ProjectFinancialsService, TASettlementService, EmergencySpareService],
    exports: [ProjectService, ProjectFinancialsService, TASettlementService, EmergencySpareService],
})
export class ProjectManagementModule { }
