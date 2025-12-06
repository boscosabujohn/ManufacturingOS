// Procurement Advanced Features - Component Exports

export { default as SupplierPortal } from './SupplierPortal';
export { default as ContractCompliance } from './ContractCompliance';
export { default as SourcingEvents } from './SourcingEvents';
export { default as ApprovalWorkflows } from './ApprovalWorkflows';
export { default as SupplierRiskScoring } from './SupplierRiskScoring';
export { default as SavingsTracking } from './SavingsTracking';
export { default as SpendAnalytics } from './SpendAnalytics';

// Type exports
export type { SupplierStatus, CollaborationType, MessageStatus, SupplierProfile, CollaborationMessage, SupplierDocument } from './SupplierPortal';
export type { ContractStatus, ComplianceStatus, ContractType, Contract, ComplianceMetric, ContractObligation } from './ContractCompliance';
export type { EventType, EventStatus, BidStatus, SourcingEvent, BidResponse, AuctionEvent } from './SourcingEvents';
export type { ApprovalStatus, RequestType, ApprovalRequest, ApprovalStep, WorkflowRule } from './ApprovalWorkflows';
export type { RiskLevel, SupplierRisk, RiskFactor } from './SupplierRiskScoring';
export type { SavingsType, SavingsStatus, SavingsInitiative } from './SavingsTracking';
export type { CategorySpend, SupplierSpend, MonthlySpend } from './SpendAnalytics';

// Enhanced Procurement UI Components
export { VendorComparisonMatrix } from './VendorComparisonMatrix';
export { POApprovalWorkflowUI } from './POApprovalWorkflowUI';
export { GoodsReceiptMatching } from './GoodsReceiptMatching';

// Enhanced types
export type { ComparisonVendor, VendorMetrics } from './VendorComparisonMatrix';
export type { PurchaseOrderApproval, ApprovalStep as POApprovalStep, Approver } from './POApprovalWorkflowUI';
export type { ThreeWayMatch, MatchingResult, MatchStatus } from './GoodsReceiptMatching';
