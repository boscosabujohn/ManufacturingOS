import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BOQController,
  CostEstimateController,
  EstimateAnalyticsController,
  EstimateTemplateController,
  PricingController,
  ResourceRateController,
} from './controllers';
import {
  BOQ,
  BOQItem,
  BOQTemplate,
  CostCategory,
  CostEstimate,
  CostEstimateItem,
  EquipmentRate,
  EstimateAccuracyRecord,
  EstimateApprovalWorkflow,
  EstimateTemplate,
  EstimateVersion,
  EstimatorPerformance,
  HistoricalBenchmark,
  LaborRateCard,
  MarkupRule,
  MaterialRateCard,
  Pricing,
  ResourceRate,
  RiskAnalysis,
  SubcontractorRate,
  WinLossRecord,
} from './entities';
import {
  BOQService,
  CostEstimateService,
  EstimateAnalyticsService,
  EstimateTemplateService,
  PricingService,
  ResourceRateService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // BOQ
      BOQ,
      BOQItem,
      BOQTemplate,
      // Cost Estimate
      CostEstimate,
      CostEstimateItem,
      // Pricing
      Pricing,
      MarkupRule,
      // Resource Rates
      ResourceRate,
      MaterialRateCard,
      LaborRateCard,
      EquipmentRate,
      SubcontractorRate,
      // Templates & Settings
      EstimateTemplate,
      CostCategory,
      EstimateApprovalWorkflow,
      EstimateVersion,
      // Analytics
      WinLossRecord,
      EstimateAccuracyRecord,
      RiskAnalysis,
      EstimatorPerformance,
      HistoricalBenchmark,
    ]),
  ],
  controllers: [
    BOQController,
    CostEstimateController,
    EstimateAnalyticsController,
    EstimateTemplateController,
    PricingController,
    ResourceRateController,
  ],
  providers: [
    BOQService,
    CostEstimateService,
    EstimateAnalyticsService,
    EstimateTemplateService,
    PricingService,
    ResourceRateService,
  ],
  exports: [
    BOQService,
    CostEstimateService,
    EstimateAnalyticsService,
    EstimateTemplateService,
    PricingService,
    ResourceRateService,
  ],
})
export class EstimationModule {}
