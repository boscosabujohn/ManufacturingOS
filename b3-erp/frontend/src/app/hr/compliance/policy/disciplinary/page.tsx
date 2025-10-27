'use client';

import { useState, useMemo } from 'react';
import { Scale, Search, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface DisciplinaryAction {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  actionType: 'verbal_warning' | 'written_warning' | 'final_warning' | 'suspension' | 'demotion' | 'termination';
  violationCategory: 'attendance' | 'conduct' | 'performance' | 'safety' | 'security' | 'harassment' | 'other';
  incidentDate: string;
  actionDate: string;
  issuedBy: string;
  severity: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  justification: string;
  witnessList?: string[];
  evidenceDocuments?: string[];
  employeeStatement?: string;
  suspensionDuration?: string;
  suspensionStartDate?: string;
  suspensionEndDate?: string;
  isPaid?: boolean;
  appealStatus: 'not_filed' | 'filed' | 'under_review' | 'accepted' | 'rejected';
  appealDeadline?: string;
  appealFiledDate?: string;
  appealReviewedBy?: string;
  appealOutcome?: string;
  status: 'active' | 'served' | 'appealed' | 'overturned' | 'expired';
  effectiveUntil?: string;
  remarks?: string;
}

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActionType, setSelectedActionType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const mockDisciplinaryActions: DisciplinaryAction[] = [
    {
      id: '1',
      employeeId: 'EMP015',
      employeeName: 'Karan Malhotra',
      department: 'Manufacturing',
      designation: 'Machine Operator',
      actionType: 'written_warning',
      violationCategory: 'safety',
      incidentDate: '2025-01-18',
      actionDate: '2025-01-20',
      issuedBy: 'Rajesh Kumar (Plant Manager)',
      severity: 'serious',
      description: 'Failure to wear mandatory PPE (safety helmet) in high-risk manufacturing zone',
      justification: 'Violation of Workplace Safety Policy Section 4.2 - Personal Protective Equipment Requirements. Employee was found operating machinery without required safety helmet.',
      witnessList: ['Suresh Mehta (Safety Officer)', 'Amit Patel (Supervisor)'],
      evidenceDocuments: ['CCTV_Recording_20250118.mp4', 'Safety_Inspection_Report.pdf'],
      employeeStatement: 'I acknowledge the violation. It was an oversight on my part. I will ensure full compliance going forward.',
      appealStatus: 'not_filed',
      appealDeadline: '2025-02-03',
      status: 'active',
      effectiveUntil: '2025-07-20',
      remarks: 'First offense - counseling provided. Further violations may result in suspension.'
    },
    {
      id: '2',
      employeeId: 'EMP022',
      employeeName: 'Deepak Singh',
      department: 'IT',
      designation: 'System Administrator',
      actionType: 'suspension',
      violationCategory: 'security',
      incidentDate: '2025-01-14',
      actionDate: '2025-01-16',
      issuedBy: 'Priya Sharma (HR Director)',
      severity: 'critical',
      description: 'Unauthorized access to confidential employee database and salary information',
      justification: 'Severe violation of Information Security Policy and Data Privacy regulations. Employee accessed restricted database without authorization using compromised credentials.',
      witnessList: ['Amit Patel (IT Manager)', 'Security Team'],
      evidenceDocuments: ['Access_Logs_20250114.xlsx', 'Security_Incident_Report.pdf', 'Digital_Forensics_Report.pdf'],
      employeeStatement: 'I was troubleshooting a system issue and did not realize I was accessing restricted data.',
      suspensionDuration: '30 days',
      suspensionStartDate: '2025-01-17',
      suspensionEndDate: '2025-02-16',
      isPaid: false,
      appealStatus: 'filed',
      appealDeadline: '2025-01-31',
      appealFiledDate: '2025-01-23',
      appealReviewedBy: 'Appeals Committee',
      status: 'appealed',
      remarks: 'Under investigation. Pending final decision. Termination may be considered based on investigation findings.'
    },
    {
      id: '3',
      employeeId: 'EMP033',
      employeeName: 'Pooja Reddy',
      department: 'Sales',
      designation: 'Sales Executive',
      actionType: 'verbal_warning',
      violationCategory: 'attendance',
      incidentDate: '2025-01-08',
      actionDate: '2025-01-10',
      issuedBy: 'Neha Desai (Sales Manager)',
      severity: 'minor',
      description: 'Unauthorized absence from work without prior intimation',
      justification: 'Violation of Attendance Policy - employee absent for one day without prior leave application or intimation to supervisor.',
      employeeStatement: 'Due to a family emergency, I could not inform in advance. I apologize for the inconvenience.',
      appealStatus: 'not_filed',
      status: 'served',
      remarks: 'Employee apologized and acknowledged the policy. No further action required.'
    },
    {
      id: '4',
      employeeId: 'EMP044',
      employeeName: 'Sanjay Gupta',
      department: 'Finance',
      designation: 'Accounts Manager',
      actionType: 'final_warning',
      violationCategory: 'conduct',
      incidentDate: '2025-01-21',
      actionDate: '2025-01-24',
      issuedBy: 'Priya Sharma (HR Director)',
      severity: 'serious',
      description: 'Unprofessional and aggressive behavior towards colleagues during team meeting',
      justification: 'Violation of Code of Conduct Section 3.1 - Professional Behavior. Employee displayed aggressive behavior, used inappropriate language, and created hostile work environment.',
      witnessList: ['Team Members (5 witnesses)', 'Department Manager'],
      evidenceDocuments: ['Meeting_Recording_20250121.mp4', 'Witness_Statements.pdf'],
      employeeStatement: 'I was under stress and reacted inappropriately. I regret my behavior and apologize to affected colleagues.',
      appealStatus: 'not_filed',
      appealDeadline: '2025-02-07',
      status: 'active',
      effectiveUntil: '2026-01-24',
      remarks: 'Final warning issued. Any further misconduct will result in termination. Mandatory anger management counseling required.'
    },
    {
      id: '5',
      employeeId: 'EMP055',
      employeeName: 'Ravi Verma',
      department: 'Logistics',
      designation: 'Warehouse Supervisor',
      actionType: 'written_warning',
      violationCategory: 'performance',
      incidentDate: '2025-01-12',
      actionDate: '2025-01-15',
      issuedBy: 'Vikram Singh (Logistics Head)',
      severity: 'moderate',
      description: 'Repeated failure to meet inventory reconciliation deadlines causing operational delays',
      justification: 'Consistent non-compliance with Performance Standards - missed deadlines for 3 consecutive months affecting warehouse operations and audit readiness.',
      employeeStatement: 'I acknowledge the delays. I will improve my time management and meet all future deadlines.',
      appealStatus: 'not_filed',
      appealDeadline: '2025-01-29',
      status: 'active',
      effectiveUntil: '2025-07-15',
      remarks: 'Performance improvement plan initiated. Monthly review meetings scheduled.'
    },
    {
      id: '6',
      employeeId: 'EMP066',
      employeeName: 'Meena Iyer',
      department: 'HR',
      designation: 'HR Executive',
      actionType: 'suspension',
      violationCategory: 'conduct',
      incidentDate: '2024-12-10',
      actionDate: '2024-12-15',
      issuedBy: 'Priya Sharma (HR Director)',
      severity: 'serious',
      description: 'Breach of confidentiality - sharing sensitive employee information with unauthorized persons',
      justification: 'Violation of Confidentiality Agreement and HR Policy Section 5.3. Employee disclosed confidential salary and performance data to external party.',
      witnessList: ['Complainant', 'Investigation Team'],
      evidenceDocuments: ['Email_Evidence.pdf', 'Investigation_Report.pdf'],
      employeeStatement: 'I did not realize the information was confidential. I accept my mistake.',
      suspensionDuration: '7 days',
      suspensionStartDate: '2024-12-16',
      suspensionEndDate: '2024-12-22',
      isPaid: false,
      appealStatus: 'rejected',
      appealFiledDate: '2024-12-18',
      appealReviewedBy: 'Senior Management',
      appealOutcome: 'Appeal rejected. Suspension upheld. Employee must complete mandatory confidentiality training.',
      status: 'served',
      remarks: 'Suspension served. Employee completed confidentiality training. On probationary monitoring for 6 months.'
    }
  ];

  const filteredActions = useMemo(() => {
    return mockDisciplinaryActions.filter(action => {
      const matchesSearch = action.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           action.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           action.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesActionType = selectedActionType === 'all' || action.actionType === selectedActionType;
      const matchesStatus = selectedStatus === 'all' || action.status === selectedStatus;
      const matchesSeverity = selectedSeverity === 'all' || action.severity === selectedSeverity;
      return matchesSearch && matchesActionType && matchesStatus && matchesSeverity;
    });
  }, [searchTerm, selectedActionType, selectedStatus, selectedSeverity, mockDisciplinaryActions]);

  const stats = {
    total: mockDisciplinaryActions.length,
    active: mockDisciplinaryActions.filter(a => a.status === 'active').length,
    suspended: mockDisciplinaryActions.filter(a => a.actionType === 'suspension').length,
    appealed: mockDisciplinaryActions.filter(a => a.appealStatus === 'filed' || a.appealStatus === 'under_review').length
  };

  const actionTypeColors = {
    verbal_warning: 'bg-blue-100 text-blue-700 border-blue-300',
    written_warning: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    final_warning: 'bg-orange-100 text-orange-700 border-orange-300',
    suspension: 'bg-red-100 text-red-700 border-red-300',
    demotion: 'bg-purple-100 text-purple-700 border-purple-300',
    termination: 'bg-gray-900 text-white border-gray-900'
  };

  const statusColors = {
    active: 'bg-blue-100 text-blue-700',
    served: 'bg-green-100 text-green-700',
    appealed: 'bg-yellow-100 text-yellow-700',
    overturned: 'bg-purple-100 text-purple-700',
    expired: 'bg-gray-100 text-gray-700'
  };

  const severityColors = {
    minor: 'bg-blue-50 text-blue-700',
    moderate: 'bg-yellow-50 text-yellow-700',
    serious: 'bg-orange-50 text-orange-700',
    critical: 'bg-red-50 text-red-700'
  };

  const appealStatusColors = {
    not_filed: 'bg-gray-100 text-gray-700',
    filed: 'bg-blue-100 text-blue-700',
    under_review: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Scale className="h-6 w-6 text-red-600" />
          Disciplinary Actions Management
        </h1>
        <p className="text-sm text-gray-600 mt-1">Track and manage disciplinary actions, warnings, and appeals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Total Actions</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <FileText className="h-10 w-10 text-blue-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-sm border border-orange-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Active</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">{stats.active}</p>
            </div>
            <Clock className="h-10 w-10 text-orange-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-sm border border-red-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Suspended</p>
              <p className="text-3xl font-bold text-red-900 mt-1">{stats.suspended}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-red-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-sm border border-yellow-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">Under Appeal</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">{stats.appealed}</p>
            </div>
            <Scale className="h-10 w-10 text-yellow-600 opacity-60" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search employee..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
            <select value={selectedActionType} onChange={(e) => setSelectedActionType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="all">All Actions</option>
              <option value="verbal_warning">Verbal Warning</option>
              <option value="written_warning">Written Warning</option>
              <option value="final_warning">Final Warning</option>
              <option value="suspension">Suspension</option>
              <option value="demotion">Demotion</option>
              <option value="termination">Termination</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select value={selectedSeverity} onChange={(e) => setSelectedSeverity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="all">All Severity</option>
              <option value="minor">Minor</option>
              <option value="moderate">Moderate</option>
              <option value="serious">Serious</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="served">Served</option>
              <option value="appealed">Appealed</option>
              <option value="overturned">Overturned</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredActions.map((action) => (
          <div key={action.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{action.employeeName} ({action.employeeId})</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border-2 ${actionTypeColors[action.actionType]}`}>
                    {action.actionType.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${statusColors[action.status]}`}>
                    {action.status.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${severityColors[action.severity]}`}>
                    {action.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 font-medium">{action.designation} - {action.department}</p>
                <p className="text-xs text-gray-600">Violation: {action.violationCategory.replace('_', ' ').toUpperCase()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 uppercase font-medium mb-1">Incident Date</p>
                <p className="text-sm font-bold text-gray-900">
                  {new Date(action.incidentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 uppercase font-medium mb-1">Action Date</p>
                <p className="text-sm font-bold text-gray-900">
                  {new Date(action.actionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 uppercase font-medium mb-1">Issued By</p>
                <p className="text-sm font-bold text-gray-900">{action.issuedBy}</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-red-600 uppercase font-medium mb-1">Description</p>
              <p className="text-sm text-red-900 mb-2">{action.description}</p>
              <p className="text-xs text-red-600 uppercase font-medium mb-1 mt-3">Justification</p>
              <p className="text-sm text-red-900">{action.justification}</p>
            </div>

            {action.suspensionDuration && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-orange-600 uppercase font-medium mb-2">Suspension Details</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-orange-600 font-medium">Duration</p>
                    <p className="text-sm text-orange-900 font-bold">{action.suspensionDuration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-orange-600 font-medium">Period</p>
                    <p className="text-sm text-orange-900 font-bold">
                      {action.suspensionStartDate && new Date(action.suspensionStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {action.suspensionEndDate && new Date(action.suspensionEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-orange-600 font-medium">Type</p>
                    <p className="text-sm text-orange-900 font-bold">{action.isPaid ? 'Paid Suspension' : 'Unpaid Suspension'}</p>
                  </div>
                </div>
              </div>
            )}

            {action.witnessList && action.witnessList.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-600 uppercase font-medium mb-1">Witnesses</p>
                <p className="text-sm text-blue-900">{action.witnessList.join(', ')}</p>
              </div>
            )}

            {action.employeeStatement && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-purple-600 uppercase font-medium mb-1">Employee Statement</p>
                <p className="text-sm text-purple-900">{action.employeeStatement}</p>
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-medium mb-1">Appeal Status</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${appealStatusColors[action.appealStatus]}`}>
                    {action.appealStatus.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                {action.appealDeadline && action.appealStatus === 'not_filed' && (
                  <div className="text-right">
                    <p className="text-xs text-gray-600 uppercase font-medium mb-1">Appeal Deadline</p>
                    <p className="text-sm text-gray-900 font-bold">
                      {new Date(action.appealDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>
              {action.appealFiledDate && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600 uppercase font-medium mb-1">Appeal Filed</p>
                  <p className="text-sm text-gray-900">
                    {new Date(action.appealFiledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              )}
              {action.appealOutcome && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600 uppercase font-medium mb-1">Appeal Outcome</p>
                  <p className="text-sm text-gray-900">{action.appealOutcome}</p>
                </div>
              )}
            </div>

            {action.effectiveUntil && action.status === 'active' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-yellow-600 uppercase font-medium mb-1">Effective Until</p>
                <p className="text-sm text-yellow-900 font-bold">
                  {new Date(action.effectiveUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            )}

            {action.remarks && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-yellow-600 uppercase font-medium mb-1">Remarks</p>
                <p className="text-sm text-yellow-900">{action.remarks}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                View Full Record
              </button>
              {action.evidenceDocuments && action.evidenceDocuments.length > 0 && (
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  View Evidence ({action.evidenceDocuments.length})
                </button>
              )}
              {action.appealStatus === 'not_filed' && action.status === 'active' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                  File Appeal
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
