'use client';

import React, { useState } from 'react';
import { GitBranch, CheckCircle, XCircle, Clock, User, DollarSign, AlertTriangle, RefreshCw, Settings, Download, Eye, UserPlus, Send, History } from 'lucide-react';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type RequestType = 'purchase-requisition' | 'purchase-order' | 'contract' | 'supplier-onboarding' | 'budget-change';

export interface ApprovalRequest {
  id: string;
  requestNumber: string;
  type: RequestType;
  title: string;
  requestedBy: string;
  requestDate: string;
  amount: number;
  status: ApprovalStatus;
  currentApprover: string;
  approvalLevel: number;
  totalLevels: number;
  daysOpen: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface ApprovalStep {
  level: number;
  approver: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  approvalDate?: string;
  comments?: string;
  timeToApprove?: number;
}

export interface WorkflowRule {
  id: string;
  name: string;
  type: RequestType;
  amountRange: { min: number; max: number | null };
  approvers: string[];
  autoApprove: boolean;
  notificationDays: number[];
  escalationDays: number;
  active: boolean;
}

const ApprovalWorkflows: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  // Mock data - Approval requests
  const requests: ApprovalRequest[] = [
    {
      id: 'REQ001',
      requestNumber: 'PR-2025-1234',
      type: 'purchase-requisition',
      title: 'Office Furniture Procurement',
      requestedBy: 'John Smith',
      requestDate: '2025-10-20',
      amount: 45000,
      status: 'pending',
      currentApprover: 'Sarah Johnson',
      approvalLevel: 2,
      totalLevels: 3,
      daysOpen: 4,
      priority: 'medium',
    },
    {
      id: 'REQ002',
      requestNumber: 'PO-2025-5678',
      type: 'purchase-order',
      title: 'Steel Raw Materials - Q4 Supply',
      requestedBy: 'Michael Chen',
      requestDate: '2025-10-22',
      amount: 2500000,
      status: 'pending',
      currentApprover: 'Robert Wilson',
      approvalLevel: 3,
      totalLevels: 4,
      daysOpen: 2,
      priority: 'high',
    },
    {
      id: 'REQ003',
      requestNumber: 'CNT-2025-089',
      type: 'contract',
      title: 'IT Services Master Agreement Renewal',
      requestedBy: 'Emily Davis',
      requestDate: '2025-10-15',
      amount: 1800000,
      status: 'approved',
      currentApprover: 'Lisa Anderson',
      approvalLevel: 4,
      totalLevels: 4,
      daysOpen: 9,
      priority: 'high',
    },
    {
      id: 'REQ004',
      requestNumber: 'SUP-2025-045',
      type: 'supplier-onboarding',
      title: 'New Supplier: Global Components Ltd.',
      requestedBy: 'David Lee',
      requestDate: '2025-10-18',
      amount: 0,
      status: 'pending',
      currentApprover: 'Sarah Johnson',
      approvalLevel: 1,
      totalLevels: 2,
      daysOpen: 6,
      priority: 'low',
    },
    {
      id: 'REQ005',
      requestNumber: 'PR-2025-1189',
      type: 'purchase-requisition',
      title: 'Emergency Maintenance Equipment',
      requestedBy: 'Robert Wilson',
      requestDate: '2025-10-23',
      amount: 125000,
      status: 'pending',
      currentApprover: 'Michael Chen',
      approvalLevel: 1,
      totalLevels: 2,
      daysOpen: 1,
      priority: 'urgent',
    },
    {
      id: 'REQ006',
      requestNumber: 'BUD-2025-012',
      type: 'budget-change',
      title: 'Q4 Procurement Budget Adjustment',
      requestedBy: 'Lisa Anderson',
      requestDate: '2025-10-10',
      amount: 500000,
      status: 'rejected',
      currentApprover: 'CFO',
      approvalLevel: 4,
      totalLevels: 4,
      daysOpen: 14,
      priority: 'high',
    },
  ];

  // Mock data - Approval steps for a request
  const approvalSteps: ApprovalStep[] = [
    {
      level: 1,
      approver: 'Michael Chen',
      role: 'Department Manager',
      status: 'approved',
      approvalDate: '2025-10-21',
      comments: 'Approved. Aligns with department requirements.',
      timeToApprove: 18,
    },
    {
      level: 2,
      approver: 'Sarah Johnson',
      role: 'Procurement Director',
      status: 'pending',
      comments: undefined,
      timeToApprove: undefined,
    },
    {
      level: 3,
      approver: 'Robert Wilson',
      role: 'VP Operations',
      status: 'pending',
      comments: undefined,
      timeToApprove: undefined,
    },
    {
      level: 4,
      approver: 'Lisa Anderson',
      role: 'CFO',
      status: 'pending',
      comments: undefined,
      timeToApprove: undefined,
    },
  ];

  // Mock data - Workflow rules
  const workflowRules: WorkflowRule[] = [
    {
      id: 'RULE001',
      name: 'Standard PR - Low Value',
      type: 'purchase-requisition',
      amountRange: { min: 0, max: 50000 },
      approvers: ['Department Manager', 'Procurement Manager'],
      autoApprove: false,
      notificationDays: [1, 3],
      escalationDays: 5,
      active: true,
    },
    {
      id: 'RULE002',
      name: 'Standard PR - Medium Value',
      type: 'purchase-requisition',
      amountRange: { min: 50000, max: 250000 },
      approvers: ['Department Manager', 'Procurement Director', 'VP Operations'],
      autoApprove: false,
      notificationDays: [1, 2, 4],
      escalationDays: 7,
      active: true,
    },
    {
      id: 'RULE003',
      name: 'Standard PR - High Value',
      type: 'purchase-requisition',
      amountRange: { min: 250000, max: null },
      approvers: ['Department Manager', 'Procurement Director', 'VP Operations', 'CFO'],
      autoApprove: false,
      notificationDays: [1, 2, 3],
      escalationDays: 5,
      active: true,
    },
    {
      id: 'RULE004',
      name: 'Purchase Order - All Values',
      type: 'purchase-order',
      amountRange: { min: 0, max: null },
      approvers: ['Procurement Manager', 'Procurement Director', 'VP Operations', 'CFO'],
      autoApprove: false,
      notificationDays: [1, 2],
      escalationDays: 3,
      active: true,
    },
    {
      id: 'RULE005',
      name: 'Contract Approval',
      type: 'contract',
      amountRange: { min: 0, max: null },
      approvers: ['Procurement Director', 'Legal', 'VP Operations', 'CFO'],
      autoApprove: false,
      notificationDays: [2, 5, 7],
      escalationDays: 10,
      active: true,
    },
    {
      id: 'RULE006',
      name: 'Supplier Onboarding',
      type: 'supplier-onboarding',
      amountRange: { min: 0, max: 0 },
      approvers: ['Procurement Manager', 'Procurement Director'],
      autoApprove: false,
      notificationDays: [2, 5],
      escalationDays: 7,
      active: true,
    },
  ];

  const getStatusColor = (status: ApprovalStatus): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'skipped':
        return <div className="h-6 w-6 rounded-full border-2 border-gray-300" />;
      default:
        return <Clock className="h-6 w-6 text-gray-400" />;
    }
  };

  // Handler functions
  const handleApproveRequest = (request: ApprovalRequest) => {
    console.log('Approving request:', request.id);
    alert(`Approve Request: ${request.requestNumber}\n\n${request.title}\nRequested by: ${request.requestedBy}\nAmount: $${(request.amount / 1000).toFixed(0)}K\n\nCurrent Level: ${request.approvalLevel} of ${request.totalLevels}\nCurrent Approver: ${request.currentApprover}\n\nApproval Actions:\n☐ Review request details and supporting documents\n☐ Verify budget availability and authorization\n☐ Add approval comments (optional)\n☐ Confirm approval\n\nNext Steps:\n${request.approvalLevel < request.totalLevels ? `• Route to Level ${request.approvalLevel + 1} approver\n• Send notification to next approver\n• Update request status` : '• Complete approval workflow\n• Notify requester of approval\n• Trigger downstream actions (PO creation, etc.)'}\n\nClick 'Confirm Approval' to proceed.`);
  };

  const handleRejectRequest = (request: ApprovalRequest) => {
    console.log('Rejecting request:', request.id);
    alert(`Reject Request: ${request.requestNumber}\n\n${request.title}\nRequested by: ${request.requestedBy}\nAmount: $${(request.amount / 1000).toFixed(0)}K\n\nRejection Reasons (Select):\n☐ Budget not available\n☐ Incorrect or incomplete information\n☐ Does not meet policy requirements\n☐ Better alternative available\n☐ Timing not appropriate\n☐ Other (specify)\n\nComments (Required): [Enter detailed rejection reason]\n\nNext Steps:\n• Return to requester for revision\n• Notify requester with rejection reason\n• Close approval workflow\n• Archive request\n\n⚠ WARNING: Rejection cannot be undone. Requester must submit new request.\n\nClick 'Confirm Rejection' to proceed.`);
  };

  const handleDelegateApproval = (request: ApprovalRequest) => {
    console.log('Delegating approval for:', request.id);
    alert(`Delegate Approval: ${request.requestNumber}\n\n${request.title}\nCurrent Approver: ${request.currentApprover}\nApproval Level: ${request.approvalLevel}\n\nDelegate To: [Select User]\nAvailable Delegates:\n• ${['Sarah Johnson', 'Michael Chen', 'Robert Wilson', 'Lisa Anderson', 'David Lee'].filter(u => u !== request.currentApprover).join('\n• ')}\n\nDelegation Reason: [Optional]\n☐ Out of office / Vacation\n☐ Temporary reassignment\n☐ Subject matter expertise needed\n☐ Conflict of interest\n☐ Other\n\nDuration:\n○ One-time delegation (this request only)\n○ Temporary delegation (specify dates)\n○ Permanent delegation (all future requests)\n\nNotifications:\n☑ Notify delegate of pending approval\n☑ Notify requester of delegation\n☑ Copy current approver on delegate actions\n\nClick 'Delegate' to transfer approval responsibility.`);
  };

  const handleViewHistory = (request: ApprovalRequest) => {
    console.log('Viewing history for:', request.id);
    alert(`Approval History: ${request.requestNumber}\n\n${request.title}\nRequested by: ${request.requestedBy}\nRequest Date: ${request.requestDate}\nDays Open: ${request.daysOpen}\n\n━━━ APPROVAL TIMELINE ━━━\n\n${approvalSteps.map((step, idx) =>
      `Level ${step.level}: ${step.role}\nApprover: ${step.approver}\nStatus: ${step.status.toUpperCase()}\n${step.approvalDate ? `Date: ${step.approvalDate}` : 'Pending'}\n${step.timeToApprove ? `Time to Approve: ${step.timeToApprove} hours` : ''}\n${step.comments ? `Comments: ${step.comments}` : ''}`
    ).join('\n\n')}\n\n━━━ REQUEST MODIFICATIONS ━━━\n\n${request.requestDate}: Request created by ${request.requestedBy}\n${request.requestDate}: Routed to Level 1 (${approvalSteps[0]?.approver || 'N/A'})\n${approvalSteps[0]?.approvalDate || 'Pending'}: Level 1 ${approvalSteps[0]?.status || 'pending'}\n${approvalSteps.length > 1 && approvalSteps[1]?.approvalDate ? approvalSteps[1].approvalDate + ': Level 2 ' + approvalSteps[1].status : ''}\n\nCurrent Status: ${request.status.toUpperCase()}\nCurrent Location: Level ${request.approvalLevel} - ${request.currentApprover}`);
  };

  const handleViewRequest = (request: ApprovalRequest) => {
    console.log('Viewing request details:', request.id);
    alert(`Request Details: ${request.requestNumber}\n\n━━━ BASIC INFORMATION ━━━\n\nTitle: ${request.title}\nType: ${request.type.toUpperCase().replace(/-/g, ' ')}\nStatus: ${request.status.toUpperCase()}\nPriority: ${request.priority.toUpperCase()}\n\n━━━ REQUESTER INFO ━━━\n\nRequested By: ${request.requestedBy}\nRequest Date: ${request.requestDate}\nDays Open: ${request.daysOpen}\n\n━━━ FINANCIAL DETAILS ━━━\n\nAmount: $${(request.amount / 1000).toFixed(0)}K\nBudget Code: [Budget allocation details]\nCost Center: [Department/project code]\n\n━━━ APPROVAL STATUS ━━━\n\nCurrent Level: ${request.approvalLevel} of ${request.totalLevels}\nCurrent Approver: ${request.currentApprover}\nPending Since: ${request.requestDate}\n\n━━━ APPROVAL CHAIN ━━━\n\n${approvalSteps.map(s => `${s.level}. ${s.approver} (${s.role}): ${s.status.toUpperCase()}`).join('\n')}\n\n━━━ SUPPORTING DOCUMENTS ━━━\n\n☐ Purchase Requisition Form\n☐ Budget Approval\n☐ Supplier Quotes (${Math.floor(Math.random() * 3) + 1} attached)\n☐ Technical Specifications\n☐ Business Justification\n\n━━━ ACTIONS AVAILABLE ━━━\n\n${request.status === 'pending' && request.currentApprover ? '[Approve] [Reject] [Delegate] [Request More Info]' : request.status === 'approved' ? '[View Only - Approved]' : '[View Only - ' + request.status.toUpperCase() + ']'}`);
  };

  const handleRefresh = () => {
    console.log('Refreshing approval workflows...');
    alert(`Refresh Approval Workflows\n\nSyncing data from:\n✓ Approval requests queue\n✓ User assignments and delegations\n✓ Workflow rules and routing\n✓ Notification status\n✓ Approval history logs\n\nCurrent Queue Stats:\n• Pending Requests: ${requests.filter(r => r.status === 'pending').length}\n• Approved Today: ${requests.filter(r => r.status === 'approved').length}\n• Rejected Today: ${requests.filter(r => r.status === 'rejected').length}\n• Overdue (>7 days): ${requests.filter(r => r.daysOpen > 7 && r.status === 'pending').length}\n\nLast Refresh: ${new Date(Date.now() - Math.random() * 600000).toLocaleString()}\n\nClick 'Refresh Now' to sync latest data.`);
  };

  const handleSettings = () => {
    console.log('Opening workflow settings...');
    alert(`Approval Workflow Settings\n\n━━━ WORKFLOW RULES ━━━\n\n1. Purchase Requisition:\n   <$10K: Manager only\n   $10K-$50K: Manager + Director\n   $50K-$250K: Manager + Director + VP\n   >$250K: Manager + Director + VP + CFO\n\n2. Purchase Order:\n   <$25K: Auto-approve (within budget)\n   $25K-$100K: Procurement Director\n   $100K-$1M: Procurement Director + VP\n   >$1M: Procurement Director + VP + CFO\n\n3. Contract Approval:\n   <$100K: Procurement Director + Legal\n   $100K-$1M: Procurement Director + Legal + VP\n   >$1M: Procurement Director + Legal + VP + CEO\n\n━━━ NOTIFICATION SETTINGS ━━━\n\nReminder Schedule:\n☑ Day 1: Immediate notification to approver\n☑ Day 3: First reminder\n☑ Day 5: Second reminder\n☑ Day 7: Escalation to manager\n\nEscalation Rules:\n☑ After 7 days: Escalate to next level\n☑ After 10 days: Executive notification\n☑ Critical/Urgent: Escalate after 24 hours\n\n━━━ DELEGATION RULES ━━━\n\n☐ Allow temporary delegation\n☐ Require delegation approval\n☐ Auto-delegate during out-of-office\n☐ Limit delegation to same role level\n\n━━━ APPROVAL LIMITS ━━━\n\nUser Approval Limits:\n• Manager: $50K\n• Director: $250K\n• VP: $1M\n• CFO/CEO: Unlimited\n\nClick 'Configure Rules' to modify workflow settings.`);
  };

  const handleExport = () => {
    console.log('Exporting approval data...');
    alert(`Export Approval Workflows\n\nExport Options:\n\n1. PENDING APPROVALS (CSV)\n   ${requests.filter(r => r.status === 'pending').length} pending requests\n   Columns: Request #, Type, Amount, Requester, Current Approver, Days Open\n\n2. APPROVAL HISTORY (Excel)\n   All ${requests.length} requests with full approval chain\n   Includes: Timeline, comments, approval times, status changes\n\n3. PERFORMANCE REPORT (PDF)\n   • Average approval time by type\n   • Approver performance metrics\n   • Bottleneck analysis\n   • SLA compliance rates\n\n4. WORKFLOW RULES (JSON)\n   Current workflow configuration\n   For backup/migration purposes\n\nDate Range: [From: ${requests[requests.length - 1]?.requestDate} To: ${requests[0]?.requestDate}]\n\nClick 'Generate Export' to download files.`);
  };

  const handleRequestMoreInfo = (request: ApprovalRequest) => {
    console.log('Requesting more info for:', request.id);
    alert(`Request More Information: ${request.requestNumber}\n\n${request.title}\nRequested by: ${request.requestedBy}\n\nInformation Needed (Select):\n☐ Additional quotes/pricing\n☐ Detailed specifications\n☐ Budget justification\n☐ Alternative options analysis\n☐ Timeline/delivery schedule\n☐ Risk assessment\n☐ Compliance documentation\n☐ Other (specify)\n\nComments to Requester: [Enter specific information needed]\n\nDue Date: [Select date - default 3 business days]\n\nNext Steps:\n• Request paused until information provided\n• Requester notified via email\n• Automatic reminder after 2 days\n• Request returns to you after info submitted\n\nClick 'Send Request' to notify requester.`);
  };

  const handleBulkActions = () => {
    console.log('Opening bulk actions...');
    const pendingCount = requests.filter(r => r.status === 'pending').length;
    alert(`Bulk Actions\n\nPending Approvals: ${pendingCount}\n\nAvailable Bulk Actions:\n\n☐ Approve All (within your limit)\n   ${requests.filter(r => r.status === 'pending' && r.currentApprover).length} requests can be bulk approved\n\n☐ Delegate All\n   Delegate all pending approvals to another user\n   Useful for: Out of office, role transitions\n\n☐ Export Selected\n   Select multiple requests to export\n\n☐ Bulk Reminder\n   Send reminder to all pending approvers\n\n☐ Bulk Reassign\n   Reassign multiple requests due to org changes\n\n⚠ WARNING: Bulk actions cannot be undone. Review carefully before confirming.\n\nSelect Action: [Choose from above]\nThen select requests to apply action.`);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GitBranch className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Approval Workflows</h2>
              <p className="text-blue-100">Multi-level approval routing and tracking</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button onClick={handleBulkActions} className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors" title="Bulk Actions">
              <UserPlus className="h-4 w-4" />
              <span>Bulk Actions</span>
            </button>
            <button onClick={handleExport} className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors" title="Export">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button onClick={handleRefresh} className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors" title="Refresh">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button onClick={handleSettings} className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors" title="Settings">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => r.status === 'approved').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => r.status === 'rejected').length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue (5+ days)</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => r.status === 'pending' && r.daysOpen >= 5).length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Approval Requests */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-3 py-2 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Approval Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Approver</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Open</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedRequest(request.id)}>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.requestNumber}</div>
                      <div className="text-xs text-gray-500">{request.title}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{request.type}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <User className="h-4 w-4 mr-1 text-gray-400" />
                      {request.requestedBy}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.amount > 0 ? `$${(request.amount / 1000).toFixed(0)}K` : 'N/A'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{request.currentApprover}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(request.approvalLevel / request.totalLevels) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{request.approvalLevel}/{request.totalLevels}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`text-sm ${request.daysOpen >= 5 ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                      {request.daysOpen} days
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-wrap gap-2">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveRequest(request)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 border border-green-300 bg-green-50 rounded-lg hover:bg-green-100 text-sm transition-colors"
                            title="Approve Request"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-700">Approve</span>
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-300 bg-red-50 rounded-lg hover:bg-red-100 text-sm transition-colors"
                            title="Reject Request"
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span className="text-red-700">Reject</span>
                          </button>
                          <button
                            onClick={() => handleDelegateApproval(request)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 border border-purple-300 bg-purple-50 rounded-lg hover:bg-purple-100 text-sm transition-colors"
                            title="Delegate"
                          >
                            <UserPlus className="w-4 h-4 text-purple-600" />
                            <span className="text-purple-700">Delegate</span>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleViewRequest(request)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-blue-300 bg-blue-50 rounded-lg hover:bg-blue-100 text-sm transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-700">View</span>
                      </button>
                      <button
                        onClick={() => handleViewHistory(request)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm transition-colors"
                        title="View History"
                      >
                        <History className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">History</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Steps Example */}
      {selectedRequest && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Approval Chain - {requests.find(r => r.id === selectedRequest)?.requestNumber}</h3>
          </div>
          <div className="p-6">
            <div className="relative">
              {approvalSteps.map((step, index) => (
                <div key={step.level} className="flex items-start mb-8 last:mb-0">
                  <div className="flex flex-col items-center mr-4">
                    {getStepStatusIcon(step.status)}
                    {index < approvalSteps.length - 1 && (
                      <div className={`w-0.5 h-16 mt-2 ${step.status === 'approved' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">Level {step.level}: {step.approver}</h4>
                        <p className="text-xs text-gray-500">{step.role}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        step.status === 'approved' ? 'bg-green-100 text-green-800' :
                        step.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        step.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                    {step.approvalDate && (
                      <p className="text-xs text-gray-600 mb-1">Approved on: {step.approvalDate}</p>
                    )}
                    {step.timeToApprove && (
                      <p className="text-xs text-gray-600 mb-1">Time to approve: {step.timeToApprove} hours</p>
                    )}
                    {step.comments && (
                      <p className="text-sm text-gray-700 mt-2 p-2 bg-gray-50 rounded">{step.comments}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Workflow Rules */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-3 py-2 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Workflow Rules</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rule Name</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Range</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval Levels</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approvers</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Escalation</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workflowRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{rule.name}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{rule.type}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    ${(rule.amountRange.min / 1000).toFixed(0)}K - {rule.amountRange.max ? `$${(rule.amountRange.max / 1000).toFixed(0)}K` : 'Unlimited'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{rule.approvers.length} levels</td>
                  <td className="px-3 py-2 text-sm text-gray-600">
                    <div className="max-w-xs">
                      {rule.approvers.map((approver, idx) => (
                        <div key={idx} className="text-xs">
                          {idx + 1}. {approver}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{rule.escalationDays} days</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${rule.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {rule.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApprovalWorkflows;
