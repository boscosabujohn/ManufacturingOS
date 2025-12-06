// KPI Enhancements Components - Feature 18

// KPI Card with Sparklines
export {
  KPICard,
  KPIGrid,
  Sparkline,
  getStatusFromThreshold,
} from './KPICard';

export type {
  KPICardProps,
  KPIStatus,
  KPITrend,
  KPIThreshold,
  KPISparklineData,
  SparklineProps,
  KPIGridProps,
} from './KPICard';

// KPI Alerts
export {
  AlertBadge,
  AlertIndicator,
  KPIAlertList,
  AlertRulesManager,
  useKPIAlerts,
} from './KPIAlerts';

export type {
  KPIAlert,
  KPIAlertRule,
  AlertSeverity,
  AlertState,
  KPIAlertListProps,
  AlertRulesManagerProps,
  AlertIndicatorProps,
  AlertBadgeProps,
} from './KPIAlerts';

// KPI Drill-Through
export {
  KPIDrillThrough,
  useKPIDrillThrough,
} from './KPIDrillThrough';

export type {
  KPIDrillThroughProps,
  ContributingFactor,
} from './KPIDrillThrough';

// KPI Personalization
export {
  KPIPersonalization,
  useKPIPreferences,
} from './KPIPersonalization';

export type {
  KPIPersonalizationProps,
  KPIDefinition,
  KPIPreference,
  KPICategory,
} from './KPIPersonalization';
