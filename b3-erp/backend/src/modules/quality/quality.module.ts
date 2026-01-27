import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowModule } from '../workflow/workflow.module';

// Entities
import {
  QCTemplate,
  QCParameter,
  Inspection,
  InspectionResultEntity,
  NonConformance,
  CorrectiveAction,
  PreventiveAction,
  CAPA,
  QualityAlert,
  AuditPlan,
  AuditFindings,
  NCR,
  DefectCode,
} from './entities';

// Services
import {
  QCTemplateService,
  QCParameterService,
  InspectionService,
  InspectionResultService,
  NonConformanceService,
  CorrectiveActionService,
  PreventiveActionService,
  CAPAService,
  QualityAlertService,
  AuditPlanService,
  AuditFindingsService,
  NCRService,
  QCTemplateSeederService,
  QCParameterSeederService,
  DefectCodeSeederService,
} from './services';
import { CAPAManagementService } from './services/capa-management.service';

// Controllers
import {
  QCTemplateController,
  QCParameterController,
  InspectionController,
  InspectionResultController,
  NonConformanceController,
  CorrectiveActionController,
  PreventiveActionController,
  CAPAController,
  QualityAlertController,
  AuditPlanController,
  AuditFindingsController,
  NCRController, // Added NCRController
} from './controllers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Main entities
      QCTemplate,
      QCParameter,
      Inspection,
      InspectionResultEntity,
      NonConformance,
      CorrectiveAction,
      PreventiveAction,
      CAPA,
      QualityAlert,
      AuditPlan,
      AuditFindings,
      NCR,
      DefectCode,
    ]),
    WorkflowModule,
  ],
  controllers: [
    QCTemplateController,
    QCParameterController,
    InspectionController,
    InspectionResultController,
    NonConformanceController,
    CorrectiveActionController,
    PreventiveActionController,
    CAPAController,
    QualityAlertController,
    AuditPlanController,
    AuditFindingsController,
    NCRController, // Added NCRController
  ],
  providers: [
    QCTemplateService,
    QCParameterService,
    InspectionService,
    InspectionResultService,
    NonConformanceService,
    CorrectiveActionService,
    PreventiveActionService,
    CAPAService,
    QualityAlertService,
    AuditPlanService,
    AuditFindingsService,
    CAPAManagementService,
    NCRService,
    // Seeders
    QCTemplateSeederService,
    QCParameterSeederService,
    DefectCodeSeederService,
  ],
  exports: [
    QCTemplateService,
    QCParameterService,
    InspectionService,
    InspectionResultService,
    NonConformanceService,
    CorrectiveActionService,
    PreventiveActionService,
    CAPAService,
    QualityAlertService,
    AuditPlanService,
    AuditFindingsService,
    CAPAManagementService,
    NCRService,
    // Seeders
    QCTemplateSeederService,
    QCParameterSeederService,
    DefectCodeSeederService,
  ],
})
export class QualityModule { }
