'use client';

import { useState, useMemo } from 'react';
import { Hash, Search, Edit, CheckCircle, AlertTriangle, UserPlus, Download } from 'lucide-react';

interface EmployeeUAN {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  dateOfJoining: string;
  uan: string;
  uanStatus: 'active' | 'pending' | 'inactive';
  pfAccountNumber: string;
  previousUAN?: string;
  aadharLinked: boolean;
  bankLinked: boolean;
  nomineeAdded: boolean;
  kycCompleted: boolean;
  lastUpdated: string;
}

export default function UANManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockEmployees: EmployeeUAN[] = [
    {
      id: 'UAN-001',
      employeeId: 'EMP001',
      employeeName: 'Rajesh Kumar',
      designation: 'Senior Production Manager',
      department: 'Production',
      dateOfJoining: '2020-01-15',
      uan: '101234567890',
      uanStatus: 'active',
      pfAccountNumber: 'KA/BLR/0012345/001',
      aadharLinked: true,
      bankLinked: true,
      nomineeAdded: true,
      kycCompleted: true,
      lastUpdated: '2025-01-15'
    },
    {
      id: 'UAN-002',
      employeeId: 'EMP002',
      employeeName: 'Priya Sharma',
      designation: 'Quality Control Supervisor',
      department: 'Quality',
      dateOfJoining: '2021-03-20',
      uan: '101234567891',
      uanStatus: 'active',
      pfAccountNumber: 'KA/BLR/0012345/002',
      aadharLinked: true,
      bankLinked: true,
      nomineeAdded: true,
      kycCompleted: true,
      lastUpdated: '2024-11-20'
    },
    {
      id: 'UAN-003',
      employeeId: 'EMP003',
      employeeName: 'Amit Patel',
      designation: 'Production Operator',
      department: 'Production',
      dateOfJoining: '2022-06-10',
      uan: '101234567892',
      uanStatus: 'active',
      pfAccountNumber: 'KA/BLR/0012345/003',
      aadharLinked: true,
      bankLinked: false,
      nomineeAdded: true,
      kycCompleted: false,
      lastUpdated: '2024-10-10'
    },
    {
      id: 'UAN-004',
      employeeId: 'EMP004',
      employeeName: 'Neha Singh',
      designation: 'Maintenance Engineer',
      department: 'Maintenance',
      dateOfJoining: '2021-08-15',
      uan: '101234567893',
      uanStatus: 'active',
      pfAccountNumber: 'KA/BLR/0012345/004',
      previousUAN: '100987654321',
      aadharLinked: true,
      bankLinked: true,
      nomineeAdded: true,
      kycCompleted: true,
      lastUpdated: '2024-12-01'
    },
    {
      id: 'UAN-005',
      employeeId: 'EMP005',
      employeeName: 'Vikram Desai',
      designation: 'Logistics Coordinator',
      department: 'Logistics',
      dateOfJoining: '2024-01-10',
      uan: '101234567894',
      uanStatus: 'active',
      pfAccountNumber: 'KA/BLR/0012345/005',
      aadharLinked: true,
      bankLinked: true,
      nomineeAdded: false,
      kycCompleted: false,
      lastUpdated: '2024-09-15'
    },
    {
      id: 'UAN-006',
      employeeId: 'EMP006',
      employeeName: 'Kavita Mehta',
      designation: 'HR Executive',
      department: 'HR',
      dateOfJoining: '2023-02-01',
      uan: '',
      uanStatus: 'pending',
      pfAccountNumber: 'KA/BLR/0012345/006',
      aadharLinked: false,
      bankLinked: false,
      nomineeAdded: false,
      kycCompleted: false,
      lastUpdated: '2025-02-01'
    }
  ];

  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter(emp => {
      const matchesSearch =
        emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.uan.includes(searchTerm);
      const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'all' || emp.uanStatus === selectedStatus;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [searchTerm, selectedDepartment, selectedStatus]);

  const stats = {
    total: mockEmployees.length,
    active: mockEmployees.filter(e => e.uanStatus === 'active').length,
    pending: mockEmployees.filter(e => e.uanStatus === 'pending').length,
    kycComplete: mockEmployees.filter(e => e.kycCompleted).length
  };

  const departments = ['all', 'Production', 'Quality', 'Maintenance', 'Logistics', 'HR'];

  const statusColors = {
    active: 'bg-green-100 text-green-700 border-green-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    inactive: 'bg-red-100 text-red-700 border-red-200'
  };

  const statusIcons = {
    active: <CheckCircle className="h-4 w-4" />,
    pending: <AlertTriangle className="h-4 w-4" />,
    inactive: <AlertTriangle className="h-4 w-4" />
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">UAN Management</h1>
        <p className="text-sm text-gray-600 mt-1">Universal Account Number management and KYC tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Employees</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <Hash className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active UAN</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending UAN</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">KYC Complete</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.kycComplete}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by employee name, ID, or UAN..."
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
            <option value="inactive">Inactive</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredEmployees.map(employee => (
          <div key={employee.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{employee.employeeName}</h3>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                    {employee.employeeId}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[employee.uanStatus]}`}>
                    <span className="inline-flex items-center gap-1">
                      {statusIcons[employee.uanStatus]}
                      {employee.uanStatus.toUpperCase()}
                    </span>
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {employee.designation} • {employee.department}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Joined: {new Date(employee.dateOfJoining).toLocaleDateString('en-IN')}
                </p>
              </div>
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                <Edit className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="text-xs font-semibold text-blue-900 mb-3">UAN Details</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-blue-700">Universal Account Number</p>
                    <p className="text-lg font-bold text-blue-900">
                      {employee.uan || 'Not Assigned'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700">PF Account Number</p>
                    <p className="text-xs font-medium text-blue-900">{employee.pfAccountNumber}</p>
                  </div>
                  {employee.previousUAN && (
                    <div>
                      <p className="text-xs text-blue-700">Previous UAN</p>
                      <p className="text-xs font-medium text-blue-900">{employee.previousUAN}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="text-xs font-semibold text-green-900 mb-3">KYC Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-700">Aadhar Linked</span>
                    {employee.aadharLinked ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-700">Bank Linked</span>
                    {employee.bankLinked ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-700">Nominee Added</span>
                    {employee.nomineeAdded ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-green-300">
                    <span className="text-xs font-bold text-green-900">KYC Complete</span>
                    {employee.kycCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="text-xs font-semibold text-purple-900 mb-3">Actions</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-purple-700 mb-1">Last Updated</p>
                    <p className="text-sm font-medium text-purple-900">
                      {new Date(employee.lastUpdated).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="pt-2">
                    {employee.uanStatus === 'pending' && (
                      <button className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-medium">
                        <UserPlus className="inline h-3 w-3 mr-1" />
                        Generate UAN
                      </button>
                    )}
                    {employee.uanStatus === 'active' && !employee.kycCompleted && (
                      <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium">
                        Complete KYC
                      </button>
                    )}
                    {employee.uanStatus === 'active' && employee.kycCompleted && (
                      <button className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-xs font-medium">
                        View UAN Portal
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {!employee.kycCompleted && employee.uanStatus === 'active' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <AlertTriangle className="inline h-4 w-4 mr-1" />
                  <strong>Action Required:</strong> Complete KYC verification on UAN portal for this employee
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">UAN Management Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>UAN (Universal Account Number):</strong> Single lifelong account number for PF across all employments</li>
          <li>• <strong>UAN Generation:</strong> Employer generates UAN for new employees via EPFO portal</li>
          <li>• <strong>UAN Activation:</strong> Employee activates UAN using mobile OTP on EPFO member portal</li>
          <li>• <strong>KYC Requirements:</strong> Aadhar, Bank account, and Nominee details must be linked</li>
          <li>• <strong>Transfer/Withdrawal:</strong> Complete KYC enables online PF transfer and withdrawal</li>
          <li>• <strong>Previous UAN:</strong> Transfer previous employer PF to current UAN via online claim</li>
          <li>• <strong>Passbook Access:</strong> Employees can view PF passbook online after UAN activation</li>
        </ul>
      </div>
    </div>
  );
}
