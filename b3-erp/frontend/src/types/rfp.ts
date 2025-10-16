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

export interface RFPStatistics {
  total: number;
  byStatus: Record<RFPStatus, number>;
  byPriority: Record<string, number>;
  byType: Record<string, number>;
  totalEstimatedValue: number;
  totalProposalValue: number;
  averageWinProbability: number;
  upcoming: number;
  overdue: number;
}

export interface RFPDashboard {
  statistics: RFPStatistics;
  recentRFPs: RFP[];
  highPriorityRFPs: RFP[];
  upcomingDeadlines: RFP[];
}

// ==================== RFP RESPONSE MANAGEMENT ====================

export enum RFPResponseStatus {
  NOT_STARTED = 'not_started',
  IN_PREPARATION = 'in_preparation',
  TECHNICAL_REVIEW = 'technical_review',
  COMMERCIAL_REVIEW = 'commercial_review',
  COMPLIANCE_CHECK = 'compliance_check',
  READY_FOR_SUBMISSION = 'ready_for_submission',
  SUBMITTED = 'submitted',
  WON = 'won',
  LOST = 'lost',
  WITHDRAWN = 'withdrawn',
}

export interface TechnicalResponse {
  id: string;
  // Product/Solution Specification
  proposedSolution: string;
  technicalApproach: string;
  specifications: {
    parameter: string;
    value: string;
    unit?: string;
    complianceStatus: 'compliant' | 'exceeds' | 'partial' | 'non_compliant';
    notes?: string;
  }[];

  // Deliverables
  detailedDeliverables: {
    id: string;
    name: string;
    description: string;
    quantity: number;
    specifications: string;
    standards: string[];
    leadTime: string;
  }[];

  // Technical Team
  technicalTeam: {
    role: string;
    name: string;
    qualifications: string;
    experience: string;
  }[];

  // Quality & Testing
  qualityAssurance: {
    standards: string[];
    testingProcedures: string;
    certifications: string[];
    inspectionPlan: string;
  };

  // Innovation & Value-Adds
  innovations?: string[];
  valueAdditions?: string[];

  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommercialResponse {
  id: string;
  // Pricing
  pricingBreakdown: {
    id: string;
    category: string;
    item: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    notes?: string;
  }[];

  totalPrice: number;
  currency: string;
  taxAmount?: number;
  grandTotal: number;

  // Payment Terms
  paymentTerms: {
    milestone: string;
    percentage: number;
    amount: number;
    dueDate: string;
    conditions?: string;
  }[];

  // Commercial Conditions
  validityPeriod: number; // days
  deliveryTerms: string; // Incoterms
  warrantyPeriod: string;
  maintenanceSupport?: string;
  penalties?: {
    type: string;
    condition: string;
    penalty: string;
  }[];

  // Banking Details
  bankingDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    swiftCode?: string;
    iban?: string;
  };

  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceResponse {
  id: string;
  // Regulatory Compliance
  regulatory: {
    requirement: string;
    status: 'compliant' | 'not_applicable' | 'partial';
    evidence: string;
    certificateNumber?: string;
    expiryDate?: string;
    attachmentId?: string;
  }[];

  // Standards & Certifications
  certifications: {
    name: string;
    issuingBody: string;
    certificateNumber: string;
    issueDate: string;
    expiryDate?: string;
    scope: string;
  }[];

  // HSE & Safety
  hseCompliance: {
    requirement: string;
    complianceStatement: string;
    safetyCertificates: string[];
  };

  // Environmental
  environmentalCompliance?: {
    standard: string;
    complianceLevel: string;
    carbonFootprint?: string;
    sustainabilityMeasures: string[];
  };

  // Legal
  legalCompliance: {
    licenses: string[];
    insurances: {
      type: string;
      provider: string;
      policyNumber: string;
      coverage: string;
      expiryDate: string;
    }[];
    contractTermsAcceptance: boolean;
  };

  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectExecutionPlan {
  id: string;
  // Timeline
  projectTimeline: {
    phase: string;
    description: string;
    startDate: string;
    endDate: string;
    duration: number; // days
    milestones: string[];
    dependencies?: string[];
  }[];

  // Resources
  resourcePlan: {
    resourceType: string;
    quantity: number;
    allocation: string;
    timeline: string;
  }[];

  // Risk Management
  riskAssessment: {
    risk: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigationStrategy: string;
  }[];

  // Quality Plan
  qualityPlan: {
    checkpoints: {
      stage: string;
      criteria: string;
      method: string;
    }[];
    documentation: string[];
  };

  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RFPResponse {
  id: string;
  rfpId: string;
  rfp?: RFP; // Reference to the original RFP

  // Response Metadata
  responseNumber: string;
  responseTitle: string;
  status: RFPResponseStatus;

  // Response Sections
  executiveSummary: string;
  technicalResponse?: TechnicalResponse;
  commercialResponse?: CommercialResponse;
  complianceResponse?: ComplianceResponse;
  executionPlan?: ProjectExecutionPlan;

  // Company Profile
  companyProfile?: {
    overview: string;
    experience: string;
    capabilities: string[];
    pastProjects: {
      name: string;
      client: string;
      scope: string;
      value: number;
      year: string;
    }[];
    references: {
      company: string;
      contactPerson: string;
      email: string;
      phone: string;
      projectDescription: string;
    }[];
  };

  // Response Team
  responseTeam: {
    proposalManager: string;
    technicalLead: string;
    commercialLead: string;
    complianceLead: string;
    reviewers: string[];
  };

  // Attachments
  attachments: RFPAttachment[];

  // Submission
  submissionDate?: string;
  submittedBy?: string;

  // Outcome
  outcome?: 'won' | 'lost' | 'pending';
  winReason?: string;
  lossReason?: string;
  lessonsLearned?: string;

  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
