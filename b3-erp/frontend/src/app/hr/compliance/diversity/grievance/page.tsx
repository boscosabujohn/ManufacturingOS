'use client';

import { useState, useMemo } from 'react';
import { MessageSquare, Search, Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';

interface Grievance {
  id: string;
  grievanceNumber: string;
  employeeId: string;
  employeeName: string;
  department: string;
  category: 'discrimination' | 'harassment' | 'workConditions' | 'compensation' | 'promotion' | 'termination' | 'other';
  subcategory: string;
  filedDate: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'filed' | 'under_review' | 'investigating' | 'resolved' | 'closed' | 'escalated';
  assignedTo?: string;
  targetResolutionDate?: string;
  actualResolutionDate?: string;
  resolutionDetails?: string;
  employeeSatisfaction?: 'satisfied' | 'neutral' | 'dissatisfied';
  isAnonymous: boolean;
  witnesses?: string[];
  evidenceProvided: boolean;
  remarks?: string;
}

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const mockGrievances: Grievance[] = [
    {
      id: '1',
      grievanceNumber: 'GRV2025001',
      employeeId: 'EMP045',
      employeeName: 'Anjali Mehta',
      department: 'Manufacturing',
      category: 'workConditions',
      subcategory: 'Unsafe working environment',
      filedDate: '2025-01-20',
      description: 'Inadequate ventilation and safety measures in production area causing health concerns',
      priority: 'high',
      status: 'under_review',
      assignedTo: 'Safety Officer - Suresh Mehta',
      targetResolutionDate: '2025-02-05',
      isAnonymous: false,
      evidenceProvided: true,
      remarks: 'Safety inspection scheduled for Jan 25, 2025'
    },
    {
      id: '2',
      grievanceNumber: 'GRV2025002',
      employeeId: 'Anonymous',
      employeeName: 'Anonymous Employee',
      department: 'IT',
      category: 'harassment',
      subcategory: 'Workplace bullying',
      filedDate: '2025-01-18',
      description: 'Repeated instances of intimidation and aggressive behavior from team lead affecting work performance and mental health',
      priority: 'urgent',
      status: 'investigating',
      assignedTo: 'HR Investigation Team',
      targetResolutionDate: '2025-02-01',
      isAnonymous: true,
      witnesses: ['Colleague A', 'Colleague B'],
      evidenceProvided: true,
      remarks: 'Confidential investigation in progress. Witness statements being collected.'
    },
    {
      id: '3',
      grievanceNumber: 'GRV2025003',
      employeeId: 'EMP067',
      employeeName: 'Karthik Nair',
      department: 'Sales',
      category: 'compensation',
      subcategory: 'Salary disparity',
      filedDate: '2025-01-15',
      description: 'Unequal pay for same role and experience level compared to peers',
      priority: 'medium',
      status: 'resolved',
      assignedTo: 'HR Compensation Team',
      targetResolutionDate: '2025-01-30',
      actualResolutionDate: '2025-01-28',
      resolutionDetails: 'Salary review conducted. Adjustment approved and will be effective from February 2025 payroll.',
      employeeSatisfaction: 'satisfied',
      isAnonymous: false,
      evidenceProvided: true,
      remarks: 'Issue resolved. Salary adjusted to match market standards.'
    },
    {
      id: '4',
      grievanceNumber: 'GRV2025004',
      employeeId: 'EMP078',
      employeeName: 'Priya Desai',
      department: 'Finance',
      category: 'promotion',
      subcategory: 'Promotion denial',
      filedDate: '2025-01-12',
      description: 'Passed over for promotion despite meeting all criteria and having better performance than promoted colleague',
      priority: 'medium',
      status: 'resolved',
      assignedTo: 'HR Director - Priya Sharma',
      targetResolutionDate: '2025-01-27',
      actualResolutionDate: '2025-01-25',
      resolutionDetails: 'Performance review re-evaluated. Promotion approved effective February 2025. Apology issued for oversight.',
      employeeSatisfaction: 'satisfied',
      isAnonymous: false,
      evidenceProvided: true,
      remarks: 'Promotion criteria documentation updated to prevent future issues.'
    },
    {
      id: '5',
      grievanceNumber: 'GRV2025005',
      employeeId: 'EMP089',
      employeeName: 'Rohit Verma',
      department: 'Logistics',
      category: 'discrimination',
      subcategory: 'Age discrimination',
      filedDate: '2025-01-10',
      description: 'Being excluded from training opportunities and new projects due to age',
      priority: 'high',
      status: 'investigating',
      assignedTo: 'Ethics Committee',
      targetResolutionDate: '2025-02-10',
      isAnonymous: false,
      witnesses: ['Department colleagues'],
      evidenceProvided: false,
      remarks: 'Investigation ongoing. Interviewing department manager and team members.'
    },
    {
      id: '6',
      grievanceNumber: 'GRV2024088',
      employeeId: 'EMP034',
      employeeName: 'Neha Kapoor',
      department: 'HR',
      category: 'workConditions',
      subcategory: 'Excessive workload',
      filedDate: '2024-12-20',
      description: 'Consistently working 60+ hours per week with unrealistic deadlines causing burnout',
      priority: 'high',
      status: 'resolved',
      assignedTo: 'Department Head',
      targetResolutionDate: '2025-01-10',
      actualResolutionDate: '2025-01-08',
      resolutionDetails: 'Workload redistributed. Additional resource hired. Flexible work hours approved.',
      employeeSatisfaction: 'satisfied',
      isAnonymous: false,
      evidenceProvided: true,
      remarks: 'Workload monitoring system implemented.'
    }
  ];

  const filteredGrievances = useMemo(() => {
    return mockGrievances.filter(grievance => {
      const matchesSearch = grievance.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           grievance.grievanceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           grievance.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || grievance.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || grievance.status === selectedStatus;
      const matchesPriority = selectedPriority === 'all' || grievance.priority === selectedPriority;
      return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
    });
  }, [searchTerm, selectedCategory, selectedStatus, selectedPriority, mockGrievances]);

  const stats = {
    total: mockGrievances.length,
    pending: mockGrievances.filter(g => g.status === 'filed' || g.status === 'under_review' || g.status === 'investigating').length,
    resolved: mockGrievances.filter(g => g.status === 'resolved' || g.status === 'closed').length,
    urgent: mockGrievances.filter(g => g.priority === 'urgent').length
  };

  const categoryColors = {
    discrimination: 'bg-red-100 text-red-700 border-red-300',
    harassment: 'bg-orange-100 text-orange-700 border-orange-300',
    workConditions: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    compensation: 'bg-blue-100 text-blue-700 border-blue-300',
    promotion: 'bg-purple-100 text-purple-700 border-purple-300',
    termination: 'bg-gray-100 text-gray-700 border-gray-300',
    other: 'bg-gray-100 text-gray-700 border-gray-300'
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700'
  };

  const statusColors = {
    filed: 'bg-blue-100 text-blue-700',
    under_review: 'bg-yellow-100 text-yellow-700',
    investigating: 'bg-orange-100 text-orange-700',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-700',
    escalated: 'bg-red-100 text-red-700'
  };

  const satisfactionColors = {
    satisfied: 'bg-green-100 text-green-700',
    neutral: 'bg-yellow-100 text-yellow-700',
    dissatisfied: 'bg-red-100 text-red-700'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-orange-600" />
          Grievance Redressal System
        </h1>
        <p className="text-sm text-gray-600 mt-1">Employee grievance tracking and resolution management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Total Grievances</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <MessageSquare className="h-10 w-10 text-blue-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-sm border border-yellow-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">Pending</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Resolved</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{stats.resolved}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-sm border border-red-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Urgent</p>
              <p className="text-3xl font-bold text-red-900 mt-1">{stats.urgent}</p>
            </div>
            <AlertCircle className="h-10 w-10 text-red-600 opacity-60" />
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
                placeholder="Search grievance..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="all">All Categories</option>
              <option value="discrimination">Discrimination</option>
              <option value="harassment">Harassment</option>
              <option value="workConditions">Work Conditions</option>
              <option value="compensation">Compensation</option>
              <option value="promotion">Promotion</option>
              <option value="termination">Termination</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="all">All Status</option>
              <option value="filed">Filed</option>
              <option value="under_review">Under Review</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredGrievances.map((grievance) => (
          <div key={grievance.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{grievance.grievanceNumber}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border-2 ${categoryColors[grievance.category]}`}>
                    {grievance.category.replace(/([A-Z])/g, ' $1').toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${priorityColors[grievance.priority]}`}>
                    {grievance.priority.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${statusColors[grievance.status]}`}>
                    {grievance.status.replace('_', ' ').toUpperCase()}
                  </span>
                  {grievance.isAnonymous && (
                    <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                      ANONYMOUS
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 font-medium">{grievance.employeeName} {!grievance.isAnonymous && `(${grievance.employeeId})`}</p>
                <p className="text-xs text-gray-600">Department: {grievance.department} | {grievance.subcategory}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 uppercase font-medium mb-1">Filed Date</p>
                <p className="text-sm font-bold text-gray-900">
                  {new Date(grievance.filedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              {grievance.targetResolutionDate && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 uppercase font-medium mb-1">Target Resolution</p>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(grievance.targetResolutionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              )}
              {grievance.assignedTo && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 uppercase font-medium mb-1">Assigned To</p>
                  <p className="text-sm font-bold text-gray-900">{grievance.assignedTo}</p>
                </div>
              )}
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-orange-600 uppercase font-medium mb-1">Grievance Description</p>
              <p className="text-sm text-orange-900">{grievance.description}</p>
            </div>

            {grievance.witnesses && grievance.witnesses.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-600 uppercase font-medium mb-1">Witnesses</p>
                <p className="text-sm text-blue-900">{grievance.witnesses.join(', ')}</p>
              </div>
            )}

            {grievance.resolutionDetails && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-green-600 uppercase font-medium mb-1">Resolution Details</p>
                <p className="text-sm text-green-900">{grievance.resolutionDetails}</p>
                {grievance.actualResolutionDate && (
                  <p className="text-xs text-green-700 mt-2">
                    Resolved on: {new Date(grievance.actualResolutionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
            )}

            {grievance.employeeSatisfaction && (
              <div className={`border rounded-lg p-3 mb-4 ${satisfactionColors[grievance.employeeSatisfaction].replace('text', 'border').replace('100', '200')}`}>
                <p className={`text-xs uppercase font-medium mb-1 ${satisfactionColors[grievance.employeeSatisfaction].replace('bg-', 'text-').replace('-100', '-600')}`}>
                  Employee Satisfaction
                </p>
                <span className={`px-2 py-1 text-xs font-medium rounded ${satisfactionColors[grievance.employeeSatisfaction]}`}>
                  {grievance.employeeSatisfaction.toUpperCase()}
                </span>
              </div>
            )}

            {grievance.remarks && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-yellow-600 uppercase font-medium mb-1">Remarks</p>
                <p className="text-sm text-yellow-900">{grievance.remarks}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                View Full Details
              </button>
              {(grievance.status === 'filed' || grievance.status === 'under_review') && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                  Start Investigation
                </button>
              )}
              {grievance.status === 'investigating' && (
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                  Mark as Resolved
                </button>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <span className={`text-xs ${grievance.evidenceProvided ? 'text-green-600' : 'text-gray-500'}`}>
                  {grievance.evidenceProvided ? '✓ Evidence Provided' : 'No Evidence'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
