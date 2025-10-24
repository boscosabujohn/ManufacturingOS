// Sales Advanced Features - Component Exports

export { default as QuoteToOrderAutomation } from './QuoteToOrderAutomation';
export { default as TerritoryManagement } from './TerritoryManagement';
export { default as IncentiveTracking } from './IncentiveTracking';
export { default as PredictiveForecasting } from './PredictiveForecasting';
export { default as CPQHandoff } from './CPQHandoff';
export { default as RevenueRecognition } from './RevenueRecognition';
export { default as PipelineAnalytics } from './PipelineAnalytics';

// Type exports
export type { QuoteStatus, AutomationRule, Quote, ConversionMetrics, AutomationLog } from './QuoteToOrderAutomation';
export type { TerritoryType, Territory } from './TerritoryManagement';
export type { SalesRep } from './IncentiveTracking';
export type { Forecast } from './PredictiveForecasting';
export type { CPQHandoff as CPQHandoffData } from './CPQHandoff';
export type { RevenueSchedule } from './RevenueRecognition';
export type { PipelineStage } from './PipelineAnalytics';
