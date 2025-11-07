// Approval Workflow Configuration for Leave Encashment

export type ApprovalStepType = 'manager' | 'hr' | 'finance' | 'department_head' | 'ceo' | 'custom';
export type ApprovalAction = 'approve' | 'reject' | 'send_back' | 'forward';
export type WorkflowCondition = 'amount_threshold' | 'department' | 'designation' | 'employee_level' | 'leave_type' | 'always';

export interface ApprovalStep {
  id: string;
  stepNumber: number;
  stepName: string;
  stepType: ApprovalStepType;
  approverRole?: string; // E.g., "Manager", "HR Head", "Finance Manager"
  approverUserId?: string; // Specific user ID if fixed approver
  approverDepartment?: string;
  isParallel: boolean; // Multiple approvers at same step
  isOptional: boolean; // Can be skipped if criteria not met
  allowedActions: ApprovalAction[];
  autoApprove?: boolean; // Auto-approve if conditions met
  autoApproveConditions?: string[];
  escalationDays?: number; // Auto-escalate if not actioned
  escalateTo?: string; // Role/User to escalate to
  notificationEnabled: boolean;
  notificationTemplate?: string;
}

export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  conditionType: WorkflowCondition;
  conditionValue: any; // Amount for threshold, department name, etc.
  operator: 'equals' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  applicableSteps: string[]; // Step IDs this rule applies to
  action: 'require' | 'skip' | 'modify';
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  description: string;
  workflowType: 'leave_encashment' | 'leave_application' | 'overtime' | 'expense' | 'custom';
  isActive: boolean;
  isDefault: boolean;
  createdBy: string;
  createdOn: string;
  lastModifiedBy?: string;
  lastModifiedOn?: string;
  steps: ApprovalStep[];
  rules: WorkflowRule[];
  settings: {
    allowWithdrawal: boolean;
    allowDelegation: boolean;
    requireComments: boolean;
    notifyApplicant: boolean;
    maxDaysToComplete: number;
    autoRejectAfterDays?: number;
  };
}

// Default Workflows
export const defaultEncashmentWorkflows: ApprovalWorkflow[] = [
  {
    id: 'WF001',
    name: 'Standard Encashment Workflow',
    description: 'Default workflow: Manager → HR → Finance',
    workflowType: 'leave_encashment',
    isActive: true,
    isDefault: true,
    createdBy: 'System',
    createdOn: '2025-01-01',
    steps: [
      {
        id: 'STEP001',
        stepNumber: 1,
        stepName: 'Manager Approval',
        stepType: 'manager',
        approverRole: 'Direct Manager',
        isParallel: false,
        isOptional: false,
        allowedActions: ['approve', 'reject', 'send_back'],
        escalationDays: 3,
        escalateTo: 'Department Head',
        notificationEnabled: true
      },
      {
        id: 'STEP002',
        stepNumber: 2,
        stepName: 'HR Verification',
        stepType: 'hr',
        approverRole: 'HR Manager',
        approverDepartment: 'HR',
        isParallel: false,
        isOptional: false,
        allowedActions: ['approve', 'reject', 'send_back'],
        escalationDays: 2,
        notificationEnabled: true
      },
      {
        id: 'STEP003',
        stepNumber: 3,
        stepName: 'Finance Approval',
        stepType: 'finance',
        approverRole: 'Finance Manager',
        approverDepartment: 'Finance',
        isParallel: false,
        isOptional: false,
        allowedActions: ['approve', 'reject', 'send_back'],
        escalationDays: 2,
        notificationEnabled: true
      }
    ],
    rules: [
      {
        id: 'RULE001',
        name: 'High Amount Approval',
        description: 'Amounts above ₹15,000 require CEO approval',
        conditionType: 'amount_threshold',
        conditionValue: 15000,
        operator: 'greater_than',
        applicableSteps: ['STEP003'],
        action: 'require'
      }
    ],
    settings: {
      allowWithdrawal: true,
      allowDelegation: true,
      requireComments: false,
      notifyApplicant: true,
      maxDaysToComplete: 7,
      autoRejectAfterDays: 10
    }
  },
  {
    id: 'WF002',
    name: 'Fast Track Workflow (< ₹5000)',
    description: 'Simplified workflow for small amounts: Manager → HR only',
    workflowType: 'leave_encashment',
    isActive: true,
    isDefault: false,
    createdBy: 'Admin',
    createdOn: '2025-01-15',
    steps: [
      {
        id: 'STEP004',
        stepNumber: 1,
        stepName: 'Manager Approval',
        stepType: 'manager',
        approverRole: 'Direct Manager',
        isParallel: false,
        isOptional: false,
        allowedActions: ['approve', 'reject'],
        escalationDays: 2,
        notificationEnabled: true
      },
      {
        id: 'STEP005',
        stepNumber: 2,
        stepName: 'HR Quick Verification',
        stepType: 'hr',
        approverRole: 'HR Executive',
        approverDepartment: 'HR',
        isParallel: false,
        isOptional: false,
        allowedActions: ['approve', 'reject'],
        autoApprove: true,
        autoApproveConditions: ['balance_verified', 'eligibility_met'],
        escalationDays: 1,
        notificationEnabled: true
      }
    ],
    rules: [
      {
        id: 'RULE002',
        name: 'Amount Limit',
        description: 'Only applies to amounts less than ₹5,000',
        conditionType: 'amount_threshold',
        conditionValue: 5000,
        operator: 'less_than',
        applicableSteps: ['STEP004', 'STEP005'],
        action: 'require'
      }
    ],
    settings: {
      allowWithdrawal: true,
      allowDelegation: false,
      requireComments: false,
      notifyApplicant: true,
      maxDaysToComplete: 3,
      autoRejectAfterDays: 5
    }
  },
  {
    id: 'WF003',
    name: 'Department Head Workflow',
    description: 'For senior employees: Department Head → HR → Finance',
    workflowType: 'leave_encashment',
    isActive: true,
    isDefault: false,
    createdBy: 'Admin',
    createdOn: '2025-01-20',
    steps: [
      {
        id: 'STEP006',
        stepNumber: 1,
        stepName: 'Department Head Approval',
        stepType: 'department_head',
        approverRole: 'Department Head',
        isParallel: false,
        isOptional: false,
        allowedActions: ['approve', 'reject', 'send_back'],
        escalationDays: 3,
        notificationEnabled: true
      },
      {
        id: 'STEP007',
        stepNumber: 2,
        stepName: 'HR & Finance Parallel Approval',
        stepType: 'custom',
        approverRole: 'HR Manager & Finance Manager',
        isParallel: true,
        isOptional: false,
        allowedActions: ['approve', 'reject'],
        escalationDays: 2,
        notificationEnabled: true
      }
    ],
    rules: [
      {
        id: 'RULE003',
        name: 'Senior Employee Check',
        description: 'Applies to managers and above',
        conditionType: 'designation',
        conditionValue: ['Manager', 'Senior Manager', 'Head', 'Director'],
        operator: 'in',
        applicableSteps: ['STEP006', 'STEP007'],
        action: 'require'
      }
    ],
    settings: {
      allowWithdrawal: true,
      allowDelegation: true,
      requireComments: true,
      notifyApplicant: true,
      maxDaysToComplete: 7,
      autoRejectAfterDays: 14
    }
  }
];

// Workflow Templates for customization
export const workflowTemplates = [
  {
    id: 'TEMPLATE001',
    name: 'Single Approver',
    description: 'One-step approval process',
    steps: 1
  },
  {
    id: 'TEMPLATE002',
    name: 'Two-Step Approval',
    description: 'Manager → HR/Finance',
    steps: 2
  },
  {
    id: 'TEMPLATE003',
    name: 'Three-Step Approval',
    description: 'Manager → HR → Finance',
    steps: 3
  },
  {
    id: 'TEMPLATE004',
    name: 'Multi-Level Approval',
    description: 'Manager → Dept Head → HR → Finance',
    steps: 4
  },
  {
    id: 'TEMPLATE005',
    name: 'Parallel Approval',
    description: 'Multiple approvers at same level',
    steps: 2
  }
];

// Approver Roles
export const approverRoles = [
  { value: 'manager', label: 'Direct Manager', description: 'Employee\'s immediate supervisor' },
  { value: 'department_head', label: 'Department Head', description: 'Head of employee\'s department' },
  { value: 'hr', label: 'HR Manager/Executive', description: 'HR department representative' },
  { value: 'finance', label: 'Finance Manager', description: 'Finance department representative' },
  { value: 'ceo', label: 'CEO/MD', description: 'Top management approval' },
  { value: 'custom', label: 'Custom Approver', description: 'Specify a particular user or role' }
];

// Workflow Statistics
export interface WorkflowStats {
  workflowId: string;
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  avgApprovalTime: number; // in hours
  escalatedCount: number;
  autoApprovedCount: number;
}

export const mockWorkflowStats: WorkflowStats[] = [
  {
    workflowId: 'WF001',
    totalRequests: 156,
    pendingRequests: 12,
    approvedRequests: 128,
    rejectedRequests: 16,
    avgApprovalTime: 48,
    escalatedCount: 8,
    autoApprovedCount: 0
  },
  {
    workflowId: 'WF002',
    totalRequests: 89,
    pendingRequests: 5,
    approvedRequests: 82,
    rejectedRequests: 2,
    avgApprovalTime: 18,
    escalatedCount: 1,
    autoApprovedCount: 24
  },
  {
    workflowId: 'WF003',
    totalRequests: 34,
    pendingRequests: 3,
    approvedRequests: 29,
    rejectedRequests: 2,
    avgApprovalTime: 56,
    escalatedCount: 4,
    autoApprovedCount: 0
  }
];
