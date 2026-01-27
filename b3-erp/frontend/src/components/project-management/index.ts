export * from './AnalyticsModals';

// BudgetModals exports CostBreakdownModal - keep it from here
export * from './BudgetModals';

// ChangeOrderModals also exports ImpactAnalysisModal - exclude it to avoid conflict with IssueModals
export {
  CreateChangeOrderModal,
  EditChangeOrderModal,
  ApprovalModal,
  // ImpactAnalysisModal - excluded, using one from IssueModals
  ImplementationTrackingModal,
  ChangeOrderHistoryModal,
  BulkChangeOrderModal,
  AttachmentManagementModal,
  FinancialImpactDashboardModal,
  ScheduleImpactAnalysisModal,
  ExportChangeOrdersModal,
  StakeholderNotificationModal,
} from './ChangeOrderModals';

export * from './DeliverablesModals';
export * from './GanttChartModals';

// IssueModals exports ImpactAnalysisModal and BulkUpdateModal - keep them from here
export * from './IssueModals';

export * from './ProfitabilityModals';

// ProjectCostingModals also exports CostBreakdownModal - exclude it to avoid conflict with BudgetModals
export {
  // CostBreakdownModal - excluded, using one from BudgetModals
  AddCostEntryModal,
  CostVarianceModal,
  ProfitMarginModal,
  CostForecastModal,
  ResourceCostModal,
  CostComparisonModal,
  CostReportModal,
  ExportCostDataModal,
  CostHistoryModal,
  CostApprovalModal,
  CostAlertModal,
} from './ProjectCostingModals';

// ProjectListModals also exports BulkUpdateModal and AdvancedFilterModal - exclude them
export {
  // AdvancedFilterModal - excluded, using one from ReportsModals
  // BulkUpdateModal - excluded, using one from IssueModals
  CloneProjectModal,
  QuickViewModal,
  AssignManagerModal,
  ExportProjectsModal,
  ArchiveProjectModal,
  ProjectTimelineModal,
  TeamMembersModal,
  QuickNotesModal,
} from './ProjectListModals';

// ReportsModals exports AdvancedFilterModal - keep it from here
export * from './ReportsModals';

export * from './ResourceModals';
export * from './WBSModals';

// Enhanced Project Management UI Components
export { PhaseProgressVisualization } from './PhaseProgressVisualization';
export { CriticalPathHighlight } from './CriticalPathHighlight';
export { ResourceConflictAlerts } from './ResourceConflictAlerts';
export { MilestoneTimeline } from './MilestoneTimeline';
