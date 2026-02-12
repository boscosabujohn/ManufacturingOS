import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import {
  // Product Configuration
  CPQProduct,
  ProductOption,
  ProductBundle,
  BundleItem,
  ConfigurationRule,
  CompatibilityRule,
  ProductConfiguration,
  // Pricing Engine
  PricingRule,
  VolumeDiscount,
  CustomerPricing,
  ContractPricing,
  PromotionalPricing,
  DynamicPricingRule,
  // Quote
  Quote,
  QuoteItem,
  QuoteTemplate,
  QuoteVersion,
  // Guided Selling
  SalesPlaybook,
  RecommendationRule,
  SalesQuestionnaire,
  QuestionnaireResponse,
  RecommendationEvent,
  // Proposal & Contract
  Proposal,
  ProposalTemplate,
  ContentLibraryItem,
  Contract,
  ContractTemplate,
  ContractClause,
  // Analytics
  QuoteAnalytics,
  CPQWinLossRecord,
  PricingAnalytics,
  SalesCycleAnalytics,
  DiscountAnalytics,
  ProductPerformance,
  // Settings
  CPQSettings,
  CPQUserPermission,
  CPQApprovalWorkflow,
  CPQApprovalRequest,
  CPQNotificationSetting,
  CPQIntegration,
} from './entities';

// Services
import {
  ProductConfigurationService,
  PricingEngineService,
  QuoteService,
  GuidedSellingService,
  ProposalContractService,
  CPQAnalyticsService,
  CPQSettingsService,
} from './services';

// Controllers
import {
  ProductConfigurationController,
  PricingEngineController,
  QuoteController,
  GuidedSellingController,
  ProposalContractController,
  CPQAnalyticsController,
  CPQSettingsController,
} from './controllers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Product Configuration
      CPQProduct,
      ProductOption,
      ProductBundle,
      BundleItem,
      ConfigurationRule,
      CompatibilityRule,
      ProductConfiguration,
      // Pricing Engine
      PricingRule,
      VolumeDiscount,
      CustomerPricing,
      ContractPricing,
      PromotionalPricing,
      DynamicPricingRule,
      // Quote
      Quote,
      QuoteItem,
      QuoteTemplate,
      QuoteVersion,
      // Guided Selling
      SalesPlaybook,
      RecommendationRule,
      SalesQuestionnaire,
      QuestionnaireResponse,
      RecommendationEvent,
      // Proposal & Contract
      Proposal,
      ProposalTemplate,
      ContentLibraryItem,
      Contract,
      ContractTemplate,
      ContractClause,
      // Analytics
      QuoteAnalytics,
      CPQWinLossRecord,
      PricingAnalytics,
      SalesCycleAnalytics,
      DiscountAnalytics,
      ProductPerformance,
      // Settings
      CPQSettings,
      CPQUserPermission,
      CPQApprovalWorkflow,
      CPQApprovalRequest,
      CPQNotificationSetting,
      CPQIntegration,
    ]),
  ],
  controllers: [
    ProductConfigurationController,
    PricingEngineController,
    QuoteController,
    GuidedSellingController,
    ProposalContractController,
    CPQAnalyticsController,
    CPQSettingsController,
  ],
  providers: [
    ProductConfigurationService,
    PricingEngineService,
    QuoteService,
    GuidedSellingService,
    ProposalContractService,
    CPQAnalyticsService,
    CPQSettingsService,
  ],
  exports: [
    ProductConfigurationService,
    PricingEngineService,
    QuoteService,
    GuidedSellingService,
    ProposalContractService,
    CPQAnalyticsService,
    CPQSettingsService,
  ],
})
export class CPQModule {}
