// Projects Advanced Features - Component Exports

export { default as ProjectHealthScoring } from './ProjectHealthScoring';
export { default as CrossProjectDependencies } from './CrossProjectDependencies';
export { default as FinancialRollup } from './FinancialRollup';
export { default as ResourceLeveling } from './ResourceLeveling';
export { default as ChangeControl } from './ChangeControl';
export { default as StakeholderCommunication } from './StakeholderCommunication';

// Type exports from ProjectHealthScoring
export type {
  HealthStatus,
  HealthCategory,
  HealthMetric,
  ProjectHealth
} from './ProjectHealthScoring';

// Type exports from CrossProjectDependencies
export type {
  DependencyType,
  DependencyStatus,
  ProjectDependency,
  DependencyChain
} from './CrossProjectDependencies';

// Type exports from FinancialRollup
export type {
  BudgetStatus,
  CostCategory,
  CostBreakdown,
  ProjectFinancials,
  PortfolioFinancials
} from './FinancialRollup';

// Type exports from ResourceLeveling
export type {
  AllocationStatus,
  ResourceType,
  ResourceAllocation,
  ResourceConflict,
  ResourceDemand
} from './ResourceLeveling';

// Type exports from ChangeControl
export type {
  ChangeStatus,
  ChangeType,
  ImpactLevel,
  ChangeRequest,
  ChangeImpactAnalysis
} from './ChangeControl';

// Type exports from StakeholderCommunication
export type {
  StakeholderRole,
  CommunicationType,
  Priority,
  Stakeholder,
  Communication,
  MeetingNote
} from './StakeholderCommunication';
