/**
 * Default Approval Chains Data for ManufacturingOS
 * Defines approval workflows for various business processes
 */

// ============================================
// INTERFACES
// ============================================

export interface DefaultApprovalLevel {
  sequence: number;
  approverType: 'user' | 'role' | 'dynamic';
  approverIds: string[];
  requiredCount: number;
  slaHours: number;
  conditions?: Record<string, any>;
  escalationRules?: Record<string, any>;
}

export interface DefaultApprovalChain {
  name: string;
  entityType: string;
  description: string;
  isActive: boolean;
  levels: DefaultApprovalLevel[];
}

// ============================================
// APPROVAL CHAINS
// ============================================

export const DEFAULT_APPROVAL_CHAINS: DefaultApprovalChain[] = [
  // ============================================
  // PURCHASE RELATED APPROVALS
  // ============================================
  {
    name: 'Purchase Requisition Approval',
    entityType: 'purchase_requisition',
    description: 'Approval workflow for purchase requisitions',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Department Head'],
        requiredCount: 1,
        slaHours: 24,
        conditions: {
          amount_threshold: 50000,
        },
        escalationRules: {
          escalateAfterHours: 48,
          escalateTo: 'role:Senior Manager',
        },
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['Purchase Manager'],
        requiredCount: 1,
        slaHours: 24,
        conditions: {
          amount_threshold: 50000,
        },
      },
      {
        sequence: 3,
        approverType: 'role',
        approverIds: ['Finance Manager'],
        requiredCount: 1,
        slaHours: 24,
        conditions: {
          amount_threshold: 200000,
        },
      },
      {
        sequence: 4,
        approverType: 'role',
        approverIds: ['Director', 'CFO'],
        requiredCount: 1,
        slaHours: 48,
        conditions: {
          amount_threshold: 500000,
        },
      },
    ],
  },
  {
    name: 'Purchase Order Approval',
    entityType: 'purchase_order',
    description: 'Approval workflow for purchase orders',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Purchase Manager'],
        requiredCount: 1,
        slaHours: 24,
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['Finance Manager'],
        requiredCount: 1,
        slaHours: 24,
        conditions: {
          amount_threshold: 100000,
        },
      },
      {
        sequence: 3,
        approverType: 'role',
        approverIds: ['CFO', 'COO'],
        requiredCount: 1,
        slaHours: 48,
        conditions: {
          amount_threshold: 500000,
        },
      },
    ],
  },
  {
    name: 'Vendor Approval',
    entityType: 'vendor',
    description: 'Approval workflow for new vendor registration',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Purchase Manager'],
        requiredCount: 1,
        slaHours: 48,
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['Quality Manager'],
        requiredCount: 1,
        slaHours: 48,
      },
      {
        sequence: 3,
        approverType: 'role',
        approverIds: ['Finance Manager'],
        requiredCount: 1,
        slaHours: 24,
      },
    ],
  },

  // ============================================
  // SALES RELATED APPROVALS
  // ============================================
  {
    name: 'Sales Quotation Approval',
    entityType: 'sales_quotation',
    description: 'Approval workflow for sales quotations',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Sales Manager'],
        requiredCount: 1,
        slaHours: 8,
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['Finance Manager'],
        requiredCount: 1,
        slaHours: 24,
        conditions: {
          discount_percentage_threshold: 10,
        },
      },
      {
        sequence: 3,
        approverType: 'role',
        approverIds: ['VP Sales', 'Director'],
        requiredCount: 1,
        slaHours: 24,
        conditions: {
          amount_threshold: 1000000,
        },
      },
    ],
  },
  {
    name: 'Sales Order Approval',
    entityType: 'sales_order',
    description: 'Approval workflow for sales orders',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Sales Manager'],
        requiredCount: 1,
        slaHours: 4,
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['Finance Manager'],
        requiredCount: 1,
        slaHours: 24,
        conditions: {
          credit_check_required: true,
        },
      },
    ],
  },
  {
    name: 'Sales Discount Approval',
    entityType: 'sales_discount',
    description: 'Approval workflow for special discounts',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Sales Manager'],
        requiredCount: 1,
        slaHours: 4,
        conditions: {
          discount_percentage: { min: 5, max: 15 },
        },
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['VP Sales'],
        requiredCount: 1,
        slaHours: 8,
        conditions: {
          discount_percentage: { min: 15, max: 25 },
        },
      },
      {
        sequence: 3,
        approverType: 'role',
        approverIds: ['Director', 'CEO'],
        requiredCount: 1,
        slaHours: 24,
        conditions: {
          discount_percentage: { min: 25 },
        },
      },
    ],
  },

  // ============================================
  // PRODUCTION RELATED APPROVALS
  // ============================================
  {
    name: 'BOM Approval',
    entityType: 'bom',
    description: 'Approval workflow for Bill of Materials',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Design Engineer Lead'],
        requiredCount: 1,
        slaHours: 24,
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['Quality Manager'],
        requiredCount: 1,
        slaHours: 24,
      },
      {
        sequence: 3,
        approverType: 'role',
        approverIds: ['Production Manager'],
        requiredCount: 1,
        slaHours: 24,
      },
    ],
  },
  {
    name: 'Routing Approval',
    entityType: 'routing',
    description: 'Approval workflow for production routings',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Process Engineer Lead'],
        requiredCount: 1,
        slaHours: 24,
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['Production Manager'],
        requiredCount: 1,
        slaHours: 24,
      },
    ],
  },
  {
    name: 'Work Order Approval',
    entityType: 'work_order',
    description: 'Approval workflow for work orders',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Production Planner', 'Production Manager'],
        requiredCount: 1,
        slaHours: 8,
      },
    ],
  },

  // ============================================
  // QUALITY RELATED APPROVALS
  // ============================================
  {
    name: 'NCR Approval',
    entityType: 'ncr',
    description: 'Approval workflow for Non-Conformance Reports',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Quality Engineer'],
        requiredCount: 1,
        slaHours: 8,
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['Quality Manager'],
        requiredCount: 1,
        slaHours: 24,
      },
      {
        sequence: 3,
        approverType: 'role',
        approverIds: ['Production Manager'],
        requiredCount: 1,
        slaHours: 24,
        conditions: {
          severity: ['Critical', 'Major'],
        },
      },
    ],
  },
  {
    name: 'CAPA Approval',
    entityType: 'capa',
    description: 'Approval workflow for Corrective/Preventive Actions',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Quality Manager'],
        requiredCount: 1,
        slaHours: 48,
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['Director Quality', 'COO'],
        requiredCount: 1,
        slaHours: 72,
        conditions: {
          severity: ['Critical'],
        },
      },
    ],
  },
  {
    name: 'Inspection Waiver',
    entityType: 'inspection_waiver',
    description: 'Approval workflow for inspection waivers',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Quality Manager'],
        requiredCount: 1,
        slaHours: 4,
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['Production Manager'],
        requiredCount: 1,
        slaHours: 4,
      },
    ],
  },

  // ============================================
  // FINANCE RELATED APPROVALS
  // ============================================
  {
    name: 'Invoice Approval',
    entityType: 'invoice',
    description: 'Approval workflow for invoices',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Accounts Manager'],
        requiredCount: 1,
        slaHours: 24,
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['Finance Manager'],
        requiredCount: 1,
        slaHours: 24,
        conditions: {
          amount_threshold: 500000,
        },
      },
    ],
  },
  {
    name: 'Payment Approval',
    entityType: 'payment',
    description: 'Approval workflow for payments',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Accounts Manager'],
        requiredCount: 1,
        slaHours: 24,
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['Finance Manager'],
        requiredCount: 1,
        slaHours: 24,
        conditions: {
          amount_threshold: 100000,
        },
      },
      {
        sequence: 3,
        approverType: 'role',
        approverIds: ['CFO'],
        requiredCount: 1,
        slaHours: 48,
        conditions: {
          amount_threshold: 500000,
        },
      },
    ],
  },
  {
    name: 'Expense Claim Approval',
    entityType: 'expense_claim',
    description: 'Approval workflow for employee expense claims',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'dynamic',
        approverIds: ['reporting_manager'],
        requiredCount: 1,
        slaHours: 48,
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['Finance Executive'],
        requiredCount: 1,
        slaHours: 24,
      },
      {
        sequence: 3,
        approverType: 'role',
        approverIds: ['Finance Manager'],
        requiredCount: 1,
        slaHours: 24,
        conditions: {
          amount_threshold: 50000,
        },
      },
    ],
  },
  {
    name: 'Credit Note Approval',
    entityType: 'credit_note',
    description: 'Approval workflow for credit notes',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Sales Manager'],
        requiredCount: 1,
        slaHours: 24,
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['Finance Manager'],
        requiredCount: 1,
        slaHours: 24,
      },
    ],
  },

  // ============================================
  // HR RELATED APPROVALS
  // ============================================
  {
    name: 'Leave Application Approval',
    entityType: 'leave_application',
    description: 'Approval workflow for leave applications',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'dynamic',
        approverIds: ['reporting_manager'],
        requiredCount: 1,
        slaHours: 24,
        escalationRules: {
          escalateAfterHours: 48,
          escalateTo: 'role:HR Manager',
        },
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['HR Manager'],
        requiredCount: 1,
        slaHours: 24,
        conditions: {
          leave_days_threshold: 5,
        },
      },
    ],
  },
  {
    name: 'Overtime Approval',
    entityType: 'overtime',
    description: 'Approval workflow for overtime requests',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'dynamic',
        approverIds: ['reporting_manager'],
        requiredCount: 1,
        slaHours: 8,
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['HR Manager'],
        requiredCount: 1,
        slaHours: 24,
      },
    ],
  },
  {
    name: 'Employee Transfer Approval',
    entityType: 'employee_transfer',
    description: 'Approval workflow for employee transfers',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Current Department Head'],
        requiredCount: 1,
        slaHours: 48,
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['New Department Head'],
        requiredCount: 1,
        slaHours: 48,
      },
      {
        sequence: 3,
        approverType: 'role',
        approverIds: ['HR Director'],
        requiredCount: 1,
        slaHours: 48,
      },
    ],
  },
  {
    name: 'Salary Revision Approval',
    entityType: 'salary_revision',
    description: 'Approval workflow for salary revisions',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Department Head'],
        requiredCount: 1,
        slaHours: 72,
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['HR Director'],
        requiredCount: 1,
        slaHours: 72,
      },
      {
        sequence: 3,
        approverType: 'role',
        approverIds: ['CFO'],
        requiredCount: 1,
        slaHours: 72,
      },
      {
        sequence: 4,
        approverType: 'role',
        approverIds: ['CEO'],
        requiredCount: 1,
        slaHours: 72,
        conditions: {
          revision_percentage_threshold: 20,
        },
      },
    ],
  },

  // ============================================
  // INVENTORY RELATED APPROVALS
  // ============================================
  {
    name: 'Stock Adjustment Approval',
    entityType: 'stock_adjustment',
    description: 'Approval workflow for stock adjustments',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Store Manager'],
        requiredCount: 1,
        slaHours: 8,
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['Finance Manager'],
        requiredCount: 1,
        slaHours: 24,
        conditions: {
          value_threshold: 50000,
        },
      },
    ],
  },
  {
    name: 'Stock Transfer Approval',
    entityType: 'stock_transfer',
    description: 'Approval workflow for inter-warehouse transfers',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Source Warehouse Manager'],
        requiredCount: 1,
        slaHours: 8,
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['Destination Warehouse Manager'],
        requiredCount: 1,
        slaHours: 8,
      },
    ],
  },
  {
    name: 'Material Scrap Approval',
    entityType: 'material_scrap',
    description: 'Approval workflow for scrapping materials',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Production Manager'],
        requiredCount: 1,
        slaHours: 24,
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['Quality Manager'],
        requiredCount: 1,
        slaHours: 24,
      },
      {
        sequence: 3,
        approverType: 'role',
        approverIds: ['Finance Manager'],
        requiredCount: 1,
        slaHours: 24,
        conditions: {
          value_threshold: 100000,
        },
      },
    ],
  },

  // ============================================
  // LOGISTICS RELATED APPROVALS
  // ============================================
  {
    name: 'Shipment Approval',
    entityType: 'shipment',
    description: 'Approval workflow for shipments',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Logistics Manager'],
        requiredCount: 1,
        slaHours: 4,
      },
      {
        sequence: 2,
        approverType: 'role',
        approverIds: ['Finance Executive'],
        requiredCount: 1,
        slaHours: 4,
        conditions: {
          payment_pending: true,
        },
      },
    ],
  },
  {
    name: 'Gate Pass Approval',
    entityType: 'gate_pass',
    description: 'Approval workflow for gate passes',
    isActive: true,
    levels: [
      {
        sequence: 1,
        approverType: 'role',
        approverIds: ['Department Head', 'Store Manager'],
        requiredCount: 1,
        slaHours: 2,
      },
    ],
  },
];
