'use client';

import { useState, useMemo } from 'react';
import { UserCheck, Search, Edit, CheckCircle, Clock, AlertTriangle, Users, FileText } from 'lucide-react';

interface EmployeeAssignment {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  grade: string;
  employmentType: 'permanent' | 'contract' | 'temporary';
  joiningDate: string;
  templateCode: string;
  templateName: string;
  ctcAmount: number;
  effectiveFrom: string;
  assignedBy: string;
  assignedOn: string;
  status: 'active' | 'pending' | 'revised';
  previousCTC?: number;
  revisionDate?: string;
}

export default function PayrollAssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockAssignments: EmployeeAssignment[] = [
    {
      id: 'ASN-001',
      employeeId: 'EMP001',
      employeeName: 'Rajesh Kumar',
      designation: 'Senior Production Manager',
      department: 'Production',
      grade: 'A',
      employmentType: 'permanent',
      joiningDate: '2020-01-15',
      templateCode: 'TPL-MFG-A',
      templateName: 'Manufacturing - Grade A',
      ctcAmount: 750000,
      effectiveFrom: '2025-01-01',
      assignedBy: 'HR Admin',
      assignedOn: '2024-12-15',
      status: 'active'
    },
    {
      id: 'ASN-002',
      employeeId: 'EMP002',
      employeeName: 'Priya Sharma',
      designation: 'Quality Control Supervisor',
      department: 'Quality',
      grade: 'B',
      employmentType: 'permanent',
      joiningDate: '2021-03-20',
      templateCode: 'TPL-MFG-B',
      templateName: 'Manufacturing - Grade B',
      ctcAmount: 550000,
      effectiveFrom: '2025-01-01',
      assignedBy: 'HR Admin',
      assignedOn: '2024-12-15',
      status: 'active'
    },
    {
      id: 'ASN-003',
      employeeId: 'EMP003',
      employeeName: 'Amit Patel',
      designation: 'Production Operator',
      department: 'Production',
      grade: 'C',
      employmentType: 'permanent',
      joiningDate: '2022-06-10',
      templateCode: 'TPL-MFG-C',
      templateName: 'Manufacturing - Grade C',
      ctcAmount: 350000,
      effectiveFrom: '2025-01-01',
      assignedBy: 'HR Admin',
      assignedOn: '2024-12-15',
      status: 'active'
    },
    {
      id: 'ASN-004',
      employeeId: 'EMP004',
      employeeName: 'Neha Singh',
      designation: 'Maintenance Engineer',
      department: 'Maintenance',
      grade: 'B',
      employmentType: 'permanent',
      joiningDate: '2021-08-15',
      templateCode: 'TPL-MFG-B',
      templateName: 'Manufacturing - Grade B',
      ctcAmount: 520000,
      effectiveFrom: '2025-01-01',
      assignedBy: 'HR Admin',
      assignedOn: '2024-12-15',
      status: 'active'
    },
    {
      id: 'ASN-005',
      employeeId: 'EMP005',
      employeeName: 'Vikram Desai',
      designation: 'Logistics Coordinator',
      department: 'Logistics',
      grade: 'B',
      employmentType: 'contract',
      joiningDate: '2024-01-10',
      templateCode: 'TPL-MFG-B',
      templateName: 'Manufacturing - Grade B',
      ctcAmount: 480000,
      effectiveFrom: '2024-01-10',
      assignedBy: 'HR Admin',
      assignedOn: '2024-01-08',
      status: 'active'
    },
    {
      id: 'ASN-006',
      employeeId: 'EMP006',
      employeeName: 'Sanjay Reddy',
      designation: 'Production Manager',
      department: 'Production',
      grade: 'A',
      employmentType: 'permanent',
      joiningDate: '2019-05-20',
      templateCode: 'TPL-MFG-A',
      templateName: 'Manufacturing - Grade A',
      ctcAmount: 720000,
      effectiveFrom: '2025-04-01',
      assignedBy: 'HR Admin',
      assignedOn: '2025-03-15',
      status: 'revised',
      previousCTC: 680000,
      revisionDate: '2025-04-01'
    },
    {
      id: 'ASN-007',
      employeeId: 'EMP007',
      employeeName: 'Kavita Mehta',
      designation: 'HR Executive',
      department: 'HR',
      grade: 'B',
      employmentType: 'permanent',
      joiningDate: '2023-02-01',
      templateCode: 'TPL-MFG-B',
      templateName: 'Manufacturing - Grade B',
      ctcAmount: 500000,
      effectiveFrom: '2025-02-01',
      assignedBy: 'HR Manager',
      assignedOn: '2025-01-20',
      status: 'pending'
    }
  ];

  const filteredAssignments = useMemo(() => {
    return mockAssignments.filter(assignment => {
      const matchesSearch =
        assignment.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.designation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || assignment.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'all' || assignment.status === selectedStatus;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [searchTerm, selectedDepartment, selectedStatus]);

  const stats = {
    total: mockAssignments.length,
    active: mockAssignments.filter(a => a.status === 'active').length,
    pending: mockAssignments.filter(a => a.status === 'pending').length,
    revised: mockAssignments.filter(a => a.status === 'revised').length
  };

  const departments = ['all', 'Production', 'Quality', 'Maintenance', 'Logistics', 'HR'];

  const statusColors = {
    active: 'bg-green-100 text-green-700 border-green-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    revised: 'bg-blue-100 text-blue-700 border-blue-200'
  };

  const statusIcons = {
    active: <CheckCircle className="h-4 w-4" />,
    pending: <Clock className="h-4 w-4" />,
    revised: <AlertTriangle className="h-4 w-4" />
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100000).toFixed(2)}L`;
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Salary Template Assignments</h1>
        <p className="text-sm text-gray-600 mt-1">Assign and manage salary structures for employees</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Employees</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Assignments</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Recent Revisions</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.revised}</p>
            </div>
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by employee name, ID, or designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="revised">Revised</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <UserCheck className="h-4 w-4" />
            Bulk Assignment
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAssignments.map(assignment => (
          <div key={assignment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{assignment.employeeName}</h3>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                    {assignment.employeeId}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[assignment.status]}`}>
                    <span className="inline-flex items-center gap-1">
                      {statusIcons[assignment.status]}
                      {assignment.status.toUpperCase()}
                    </span>
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {assignment.designation} • {assignment.department} • Grade {assignment.grade}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {assignment.employmentType.charAt(0).toUpperCase() + assignment.employmentType.slice(1)} Employee •
                  Joined: {new Date(assignment.joiningDate).toLocaleDateString('en-IN')}
                </p>
              </div>
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                <Edit className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="text-xs font-medium text-blue-600 mb-2">Assigned Template</h4>
                <p className="text-sm font-bold text-blue-900">{assignment.templateName}</p>
                <p className="text-xs text-blue-700 mt-1">Code: {assignment.templateCode}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="text-xs font-medium text-green-600 mb-2">CTC Amount</h4>
                <p className="text-xl font-bold text-green-900">{formatCurrency(assignment.ctcAmount)}</p>
                <p className="text-xs text-green-700 mt-1">Annual CTC</p>
                {assignment.previousCTC && (
                  <p className="text-xs text-green-600 mt-1">
                    Previous: {formatCurrency(assignment.previousCTC)}
                    <span className="ml-1 font-semibold">
                      (+{(((assignment.ctcAmount - assignment.previousCTC) / assignment.previousCTC) * 100).toFixed(1)}%)
                    </span>
                  </p>
                )}
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="text-xs font-medium text-purple-600 mb-2">Effective Date</h4>
                <p className="text-sm font-bold text-purple-900">
                  {new Date(assignment.effectiveFrom).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
                {assignment.revisionDate && (
                  <p className="text-xs text-purple-700 mt-1">Revision Date: {new Date(assignment.revisionDate).toLocaleDateString('en-IN')}</p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Assigned by: {assignment.assignedBy} on {new Date(assignment.assignedOn).toLocaleDateString('en-IN')}
                </div>
                <div className="flex gap-2">
                  {assignment.status === 'pending' && (
                    <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                      Approve Assignment
                    </button>
                  )}
                  {assignment.status === 'active' && (
                    <>
                      <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                        Revise Salary
                      </button>
                      <button className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700">
                        View Breakdown
                      </button>
                    </>
                  )}
                  {assignment.status === 'revised' && (
                    <button className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700">
                      View Revision History
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Salary Assignment Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Each employee must be assigned a salary template based on their grade and designation</li>
          <li>• CTC amount is entered as annual gross cost to company</li>
          <li>• Template components automatically calculate based on assigned CTC</li>
          <li>• Salary revisions require approval before becoming effective</li>
          <li>• Changes take effect from the specified effective date</li>
          <li>• Bulk assignment allows assigning templates to multiple employees at once</li>
        </ul>
      </div>
    </div>
  );
}
