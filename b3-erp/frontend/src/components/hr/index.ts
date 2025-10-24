// HR Advanced Features Components
export { default as EmployeeSelfService } from './EmployeeSelfService';
export { default as AdvancedPayroll } from './AdvancedPayroll';
export { default as ComplianceTracking } from './ComplianceTracking';
export { default as TalentAnalytics } from './TalentAnalytics';
export { default as OnboardingWorkflow } from './OnboardingWorkflow';
export { default as PerformanceReview } from './PerformanceReview';
export { default as PolicyManagement } from './PolicyManagement';

// Type exports from EmployeeSelfService
export type {
  LeaveType,
  LeaveStatus,
  DocumentCategory,
  RequestType,
  RequestStatus,
  EmployeeProfile,
  LeaveBalance,
  LeaveRequest,
  PayslipRecord,
  Document,
  ServiceRequest,
  BenefitEnrollment,
  TrainingRecord,
} from './EmployeeSelfService';

// Type exports from AdvancedPayroll
export type {
  PayrollStatus,
  PayrollCycle,
  SalaryComponent,
  DeductionType,
  TaxRegime,
  PayrollRun,
  EarningComponent,
  DeductionComponent,
  EmployeePayslip,
  TaxCalculation,
  PayrollCompliance,
  PayrollAudit,
} from './AdvancedPayroll';

// Type exports from ComplianceTracking
export type {
  ComplianceStatus,
  ComplianceCategory,
  ComplianceRequirement,
  ComplianceAlert,
} from './ComplianceTracking';

// Type exports from OnboardingWorkflow
export type {
  OnboardingStage,
  TaskStatus,
  OnboardingTask,
  OnboardingEmployee,
} from './OnboardingWorkflow';

// Type exports from PerformanceReview
export type {
  ReviewStatus,
  Rating,
  PerformanceGoal,
  PerformanceReviewData,
} from './PerformanceReview';

// Type exports from PolicyManagement
export type {
  PolicyStatus,
  PolicyCategory,
  AcknowledgmentStatus,
  Policy,
  PolicyAcknowledgment,
} from './PolicyManagement';
