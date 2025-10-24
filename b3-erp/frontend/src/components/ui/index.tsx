// Shared UI Primitives
// Central export file for all reusable UI components

// ============================================================================
// Phase 1 Components - Core UI Primitives
// ============================================================================

export { KPICard } from './KPICard';
export type { KPICardProps } from './KPICard';

export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export {
  LoadingState,
  TableSkeleton,
  CardSkeleton,
  ChartSkeleton
} from './LoadingState';
export type { LoadingStateProps } from './LoadingState';

export { FilterPanel } from './FilterPanel';
export type { FilterPanelProps, FilterGroup, FilterOption } from './FilterPanel';

export { DataTable } from './DataTable';
export type { DataTableProps, Column } from './DataTable';

export { ChartWrapper } from './ChartWrapper';
export type { ChartWrapperProps } from './ChartWrapper';

export { PageToolbar } from './PageToolbar';
export type { PageToolbarProps, ToolbarAction } from './PageToolbar';

export { StatusBadge, NavItemWithStatus, isPlaceholderLink } from './StatusBadge';
export type { StatusBadgeProps, BadgeStatus, NavItemWithStatusProps } from './StatusBadge';

// ============================================================================
// Phase 2 Components - Form Components
// ============================================================================

export { FormWrapper } from './FormWrapper';
export type { FormWrapperProps, FormField } from './FormWrapper';

export { Input } from './Input';
export type { InputProps } from './Input';

export { Select } from './Select';
export type { SelectProps, SelectOption } from './Select';

export { Textarea } from './Textarea';
export type { TextareaProps } from './Textarea';

export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

export { Radio, RadioGroup } from './Radio';
export type { RadioProps, RadioGroupProps, RadioOption } from './Radio';

// ============================================================================
// Phase 2 Components - Modal & Dialog Components
// ============================================================================

export { ModalWrapper } from './ModalWrapper';
export type { ModalWrapperProps } from './ModalWrapper';

export { ConfirmDialog } from './ConfirmDialog';
export type { ConfirmDialogProps } from './ConfirmDialog';

export { DrawerPanel } from './DrawerPanel';
export type { DrawerPanelProps } from './DrawerPanel';

export { ToastProvider, useToast } from './Toast';
export type { Toast } from './Toast';

// ============================================================================
// Phase 2 Components - Navigation Components
// ============================================================================

export { TabPanel, TabContent } from './TabPanel';
export type { TabPanelProps, Tab, TabContentProps } from './TabPanel';

export { StepIndicator } from './StepIndicator';
export type { StepIndicatorProps, Step } from './StepIndicator';

export { BreadcrumbTrail } from './BreadcrumbTrail';
export type { BreadcrumbTrailProps, BreadcrumbItem } from './BreadcrumbTrail';

// ============================================================================
// Phase 2 Components - Omnichannel Components
// ============================================================================

export { ChannelSelector } from './ChannelSelector';
export type { ChannelSelectorProps, Channel, ChannelConfig } from './ChannelSelector';

export { QueueManager } from './QueueManager';
export type { QueueManagerProps, QueueItem, QueueStats } from './QueueManager';

export { UnifiedInbox } from './UnifiedInbox';
export type { UnifiedInboxProps, ConversationMessage } from './UnifiedInbox';

// ============================================================================
// Phase 2 Components - Data Visualization Components
// ============================================================================

export { ProgressBar, MultiProgressBar } from './ProgressBar';
export type { ProgressBarProps, MultiProgressBarProps } from './ProgressBar';

export { GaugeChart } from './GaugeChart';
export type { GaugeChartProps } from './GaugeChart';

export { SparklineChart } from './SparklineChart';
export type { SparklineChartProps } from './SparklineChart';

export { TimelineView } from './TimelineView';
export type { TimelineViewProps, TimelineEvent } from './TimelineView';
