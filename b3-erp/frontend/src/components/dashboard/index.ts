// Dashboard Customization Components - Feature 16

// Dashboard Widget
export {
  DashboardWidget,
  WidgetContent,
  WidgetStat,
} from './DashboardWidget';

export type {
  WidgetConfig,
  WidgetSize,
  DashboardWidgetProps,
  WidgetContentProps,
  WidgetStatProps,
} from './DashboardWidget';

// Widget Library
export {
  WidgetLibrary,
  useWidgetLibrary,
  defaultWidgets,
  categories,
} from './WidgetLibrary';

export type {
  WidgetDefinition,
  WidgetSettingDefinition,
  WidgetCategory,
  WidgetLibraryProps,
} from './WidgetLibrary';

// Dashboard Grid
export {
  DashboardGrid,
  DashboardLayout,
  useDashboard,
} from './DashboardGrid';

export type {
  DashboardConfig,
  DashboardGridProps,
  DashboardLayoutProps,
  DashboardContextValue,
} from './DashboardGrid';

// Dashboard Templates
export {
  DashboardTemplates,
  useDashboardTemplates,
  dashboardTemplates,
  roleInfo,
} from './DashboardTemplates';

export type {
  DashboardTemplate,
  UserRole,
  DashboardTemplatesProps,
} from './DashboardTemplates';

// Dashboard Sharing
export {
  DashboardSharing,
  useDashboardSharing,
} from './DashboardSharing';

export type {
  SharePermission,
  ShareVisibility,
  ShareRecipient,
  ShareSettings,
  DashboardSharingProps,
} from './DashboardSharing';
