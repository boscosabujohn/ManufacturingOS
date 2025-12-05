// Industry 4.0 Smart Manufacturing Components
export { LiveOEEDashboard } from './LiveOEEDashboard';
export type { OEEData, OEEGaugeProps, LiveOEEDashboardProps } from './LiveOEEDashboard';

export { MachineStatusGrid } from './MachineStatusGrid';
export type { Machine, MachineStatus, MachineStatusGridProps } from './MachineStatusGrid';

export { IoTSensorCharts } from './IoTSensorCharts';
export type { SensorData, SensorReading, IoTSensorChartsProps } from './IoTSensorCharts';

export { ProductionLineFlow } from './ProductionLineFlow';
export type { Station, StationStatus, WorkItem, ProductionLineFlowProps } from './ProductionLineFlow';

export { RealTimeAlertsBanner } from './RealTimeAlertsBanner';
export type { ProductionAlert, AlertSeverity, AlertType, RealTimeAlertsBannerProps } from './RealTimeAlertsBanner';

// Digital Twin Components
export { FactoryFloor3D } from './FactoryFloor3D';
export type { FloorMachine, FloorZone, FactoryFloor3DProps } from './FactoryFloor3D';

export { EquipmentHealthCards } from './EquipmentHealthCards';
export type { Equipment, HealthStatus, HealthMetric, MaintenancePrediction, EquipmentHealthCardsProps } from './EquipmentHealthCards';

export { ProductionSimulation } from './ProductionSimulation';
export type { SimulationScenario, SimulationParameters, SimulationResults, ProductionSimulationProps } from './ProductionSimulation';

export { AssetTrackingMap } from './AssetTrackingMap';
export type { TrackedAsset, AssetType, TrackingMethod, AssetStatus, AssetTrackingMapProps } from './AssetTrackingMap';

// Smart Analytics & AI Components
export { AIInsightsPanel } from './AIInsightsPanel';
export type { MLPrediction, InsightCategory, InsightPriority, AIInsightsPanelProps } from './AIInsightsPanel';

export { AnomalyDetection } from './AnomalyDetection';
export type { Anomaly, AnomalyType, AnomalySeverity, MetricType, AnomalyDetectionProps } from './AnomalyDetection';

export { PredictiveQualityCharts } from './PredictiveQualityCharts';
export type { QualityDataPoint, QualityMetric, PredictiveQualityChartsProps } from './PredictiveQualityCharts';

export { SmartRecommendations } from './SmartRecommendations';
export type { Recommendation, RecommendationType, RecommendationImpact, SmartRecommendationsProps } from './SmartRecommendations';

export { NaturalLanguageQuery } from './NaturalLanguageQuery';
export type { QueryResult, SuggestedQuery, NaturalLanguageQueryProps } from './NaturalLanguageQuery';

// Connected Supply Chain Components
export { SupplyChainMap } from './SupplyChainMap';
export type { Shipment, SupplyNode, GeoLocation, ShipmentStatus, TransportMode, LocationType, SupplyChainMapProps } from './SupplyChainMap';

export { VendorRiskHeatmap } from './VendorRiskHeatmap';
export type { Vendor, RiskScore, RiskLevel, RiskCategory, VendorTier, VendorRiskHeatmapProps } from './VendorRiskHeatmap';

export { LeadTimeTimeline } from './LeadTimeTimeline';
export type { Order, Milestone, OrderStatus, MilestoneStatus, LeadTimeStats, LeadTimeTimelineProps } from './LeadTimeTimeline';

export { InventoryOptimization } from './InventoryOptimization';
export type { ReorderSuggestion, DemandForecast, CostImpact, ReorderUrgency, InventoryStatus, AIConfidence, InventoryMetrics, InventoryOptimizationProps } from './InventoryOptimization';

// Automation & Integration Components
export { MESIntegrationDashboard } from './MESIntegrationDashboard';
export type { DataEntity, SyncEvent, SyncMetrics, MESConnection, SyncStatus, DataFlow, EntityType, MESIntegrationDashboardProps } from './MESIntegrationDashboard';

export { AutomatedWorkflowStatus } from './AutomatedWorkflowStatus';
export type { AutomatedWorkflow, WorkflowExecution, WorkflowStep, WorkflowStatus, TriggerType, StepStatus, AutomatedWorkflowStatusProps } from './AutomatedWorkflowStatus';

export { IntegrationHealthMonitor } from './IntegrationHealthMonitor';
export type { ConnectedSystem, HealthCheck, SystemMetric, HealthEvent, HealthStatus as IntegrationHealthStatus, SystemType, IntegrationHealthMonitorProps } from './IntegrationHealthMonitor';

export { BarcodeScanner } from './BarcodeScanner';
export type { ScannedItem, ScanHistory, WIPStatus, ScanMode, ScanResult, BarcodeScannerProps } from './BarcodeScanner';
