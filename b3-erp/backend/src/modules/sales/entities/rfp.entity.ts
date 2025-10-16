export enum RFPStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  IN_PROGRESS = 'in_progress',
  AWAITING_APPROVAL = 'awaiting_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  WITHDRAWN = 'withdrawn',
}

export enum RFPPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum RFPType {
  NEW_PROJECT = 'new_project',
  SERVICE = 'service',
  PRODUCT = 'product',
  MAINTENANCE = 'maintenance',
  CONSULTING = 'consulting',
  CUSTOM = 'custom',
}

export interface RFPItem {
  id: string;
  itemName: string;
  description: string;
  quantity: number;
  unit: string;
  specifications?: string;
  estimatedCost?: number;
  notes?: string;
}

export interface RFPRequirement {
  id: string;
  category: string;
  requirement: string;
  priority: 'must_have' | 'should_have' | 'nice_to_have';
  details?: string;
}

export interface RFPTimeline {
  milestone: string;
  expectedDate: string;
  description?: string;
}

export interface RFPEvaluation {
  evaluatedBy: string;
  evaluationDate: string;
  score: number;
  comments: string;
  criteria: {
    technical: number;
    commercial: number;
    timeline: number;
    compliance: number;
  };
}

export interface RFPAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface RFP {
  id: string;
  rfpNumber: string;
  title: string;
  description: string;
  type: RFPType;
  status: RFPStatus;
  priority: RFPPriority;

  // Customer/Client Information
  customerId?: string;
  customerName: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;

  // RFP Details
  issueDate: string;
  submissionDeadline: string;
  expectedStartDate?: string;
  expectedCompletionDate?: string;

  // Project Details
  projectScope: string;
  deliverables: string[];
  items: RFPItem[];
  requirements: RFPRequirement[];
  timeline: RFPTimeline[];

  // Financial
  estimatedBudget?: number;
  currency: string;
  paymentTerms?: string;

  // Proposal Details
  proposalSubmittedDate?: string;
  proposalValue?: number;
  proposalValidityDays?: number;

  // Technical Requirements
  technicalSpecifications?: string;
  complianceRequirements?: string[];
  certifications?: string[];

  // Evaluation
  evaluationCriteria?: string[];
  evaluations?: RFPEvaluation[];

  // Attachments
  attachments: RFPAttachment[];

  // Team and Assignment
  assignedTo?: string;
  salesPerson?: string;
  estimator?: string;
  technicalLead?: string;

  // Tracking
  notes?: string;
  internalComments?: string;
  competitorAnalysis?: string;
  winProbability?: number;

  // Related Records
  relatedQuotationId?: string;
  relatedOrderId?: string;
  relatedOpportunityId?: string;

  // Audit Fields
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;

  // Tags and Categories
  tags?: string[];
  category?: string;

  // Workflow
  approvers?: string[];
  approvalHistory?: {
    approver: string;
    action: 'approved' | 'rejected' | 'pending';
    date: string;
    comments?: string;
  }[];
}
