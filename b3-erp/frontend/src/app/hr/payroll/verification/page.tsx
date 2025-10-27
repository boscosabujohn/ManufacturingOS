'use client';

import { useState, useMemo } from 'react';
import { CheckCircle, AlertTriangle, Search, Eye, Download, FileText, Users, DollarSign, TrendingUp } from 'lucide-react';

interface EmployeePayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  grade: string;
  basicSalary: number;
  hra: number;
  da: number;
  conveyance: number;
  medical: number;
  otherEarnings: number;
  grossSalary: number;
  pfEmployee: number;
  esiEmployee: number;
  professionalTax: number;
  tds: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  presentDays: number;
  totalDays: number;
  verificationStatus: 'pending' | 'verified' | 'flagged';
  verifiedBy?: string;
  verifiedOn?: string;
  flaggedReason?: string;
}

interface PayrollVerificationBatch {
  id: string;
  monthYear: string;
  payPeriod: string;
  employeeCount: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  pendingVerification: number;
  verified: number;
  flagged: number;
  status: 'pending' | 'in_progress' | 'completed';
  records: EmployeePayrollRecord[];
}

export default function PayrollVerificationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockBatch: PayrollVerificationBatch = {
    id: 'VER-2025-11',
    monthYear: 'November 2025',
    payPeriod: '01-Nov-2025 to 30-Nov-2025',
    employeeCount: 6,
    totalGross: 3150000,
    totalDeductions: 450000,
    totalNet: 2700000,
    pendingVerification: 2,
    verified: 3,
    flagged: 1,
    status: 'in_progress',
    records: [
      {
        id: 'PAY-001',
        employeeId: 'EMP001',
        employeeName: 'Rajesh Kumar',
        designation: 'Senior Production Manager',
        department: 'Production',
        grade: 'A',
        basicSalary: 31250,
        hra: 12500,
        da: 3125,
        conveyance: 1600,
        medical: 1250,
        otherEarnings: 0,
        grossSalary: 49725,
        pfEmployee: 3750,
        esiEmployee: 373,
        professionalTax: 200,
        tds: 1500,
        otherDeductions: 0,
        totalDeductions: 5823,
        netSalary: 43902,
        presentDays: 30,
        totalDays: 30,
        verificationStatus: 'verified',
        verifiedBy: 'Finance Manager',
        verifiedOn: '2025-11-27'
      },
      {
        id: 'PAY-002',
        employeeId: 'EMP002',
        employeeName: 'Priya Sharma',
        designation: 'Quality Control Supervisor',
        department: 'Quality',
        grade: 'B',
        basicSalary: 22917,
        hra: 9167,
        da: 2292,
        conveyance: 1600,
        medical: 0,
        otherEarnings: 0,
        grossSalary: 35976,
        pfEmployee: 2750,
        esiEmployee: 270,
        professionalTax: 200,
        tds: 800,
        otherDeductions: 0,
        totalDeductions: 4020,
        netSalary: 31956,
        presentDays: 30,
        totalDays: 30,
        verificationStatus: 'verified',
        verifiedBy: 'Finance Manager',
        verifiedOn: '2025-11-27'
      },
      {
        id: 'PAY-003',
        employeeId: 'EMP003',
        employeeName: 'Amit Patel',
        designation: 'Production Operator',
        department: 'Production',
        grade: 'C',
        basicSalary: 14583,
        hra: 5833,
        da: 1458,
        conveyance: 0,
        medical: 0,
        otherEarnings: 0,
        grossSalary: 21874,
        pfEmployee: 1750,
        esiEmployee: 164,
        professionalTax: 200,
        tds: 0,
        otherDeductions: 0,
        totalDeductions: 2114,
        netSalary: 19760,
        presentDays: 30,
        totalDays: 30,
        verificationStatus: 'verified',
        verifiedBy: 'Finance Manager',
        verifiedOn: '2025-11-27'
      },
      {
        id: 'PAY-004',
        employeeId: 'EMP004',
        employeeName: 'Neha Singh',
        designation: 'Maintenance Engineer',
        department: 'Maintenance',
        grade: 'B',
        basicSalary: 21667,
        hra: 8667,
        da: 2167,
        conveyance: 1600,
        medical: 0,
        otherEarnings: 0,
        grossSalary: 34101,
        pfEmployee: 2600,
        esiEmployee: 256,
        professionalTax: 200,
        tds: 700,
        otherDeductions: 0,
        totalDeductions: 3756,
        netSalary: 30345,
        presentDays: 30,
        totalDays: 30,
        verificationStatus: 'pending'
      },
      {
        id: 'PAY-005',
        employeeId: 'EMP005',
        employeeName: 'Vikram Desai',
        designation: 'Logistics Coordinator',
        department: 'Logistics',
        grade: 'B',
        basicSalary: 20000,
        hra: 8000,
        da: 2000,
        conveyance: 1600,
        medical: 0,
        otherEarnings: 0,
        grossSalary: 31600,
        pfEmployee: 2400,
        esiEmployee: 237,
        professionalTax: 200,
        tds: 600,
        otherDeductions: 0,
        totalDeductions: 3437,
        netSalary: 28163,
        presentDays: 30,
        totalDays: 30,
        verificationStatus: 'pending'
      },
      {
        id: 'PAY-006',
        employeeId: 'EMP006',
        employeeName: 'Kavita Mehta',
        designation: 'HR Executive',
        department: 'HR',
        grade: 'B',
        basicSalary: 20833,
        hra: 8333,
        da: 2083,
        conveyance: 1600,
        medical: 0,
        otherEarnings: 0,
        grossSalary: 32849,
        pfEmployee: 2500,
        esiEmployee: 246,
        professionalTax: 200,
        tds: 650,
        otherDeductions: 1500,
        totalDeductions: 5096,
        netSalary: 27753,
        presentDays: 28,
        totalDays: 30,
        verificationStatus: 'flagged',
        flaggedReason: 'High other deductions - requires approval'
      }
    ]
  };

  const filteredRecords = useMemo(() => {
    return mockBatch.records.filter(record => {
      const matchesSearch =
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.designation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'all' || record.verificationStatus === selectedStatus;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [searchTerm, selectedDepartment, selectedStatus]);

  const departments = ['all', 'Production', 'Quality', 'Maintenance', 'Logistics', 'HR'];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    verified: 'bg-green-100 text-green-700 border-green-200',
    flagged: 'bg-red-100 text-red-700 border-red-200'
  };

  const statusIcons = {
    pending: <AlertTriangle className="h-4 w-4" />,
    verified: <CheckCircle className="h-4 w-4" />,
    flagged: <AlertTriangle className="h-4 w-4" />
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatCurrencyLakhs = (amount: number) => {
    return `₹${(amount / 100000).toFixed(2)}L`;
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payroll Verification</h1>
        <p className="text-sm text-gray-600 mt-1">Verify salary calculations before approval and disbursement</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm border border-blue-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{mockBatch.monthYear}</h2>
            <p className="text-sm text-gray-600 mt-1">Pay Period: {mockBatch.payPeriod}</p>
            <p className="text-xs text-gray-500 mt-1">Batch ID: {mockBatch.id}</p>
          </div>
          <span className="px-4 py-2 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-700">
            IN PROGRESS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Employees</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{mockBatch.employeeCount}</p>
              </div>
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Gross</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrencyLakhs(mockBatch.totalGross)}</p>
              </div>
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Deductions</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrencyLakhs(mockBatch.totalDeductions)}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Net Payable</p>
                <p className="text-lg font-bold text-green-900 mt-1">{formatCurrencyLakhs(mockBatch.totalNet)}</p>
              </div>
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending Verification</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{mockBatch.pendingVerification}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Verified</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{mockBatch.verified}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Flagged</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{mockBatch.flagged}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
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
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="flagged">Flagged</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRecords.map(record => (
          <div key={record.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{record.employeeName}</h3>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                    {record.employeeId}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[record.verificationStatus]}`}>
                    <span className="inline-flex items-center gap-1">
                      {statusIcons[record.verificationStatus]}
                      {record.verificationStatus.toUpperCase()}
                    </span>
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {record.designation} • {record.department} • Grade {record.grade}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Attendance: {record.presentDays}/{record.totalDays} days
                </p>
                {record.flaggedReason && (
                  <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2">
                    <p className="text-xs text-red-700 font-medium">⚠️ {record.flaggedReason}</p>
                  </div>
                )}
              </div>
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                <Eye className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-3 text-sm">Earnings</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">Basic Salary</span>
                    <span className="font-medium text-green-900">{formatCurrency(record.basicSalary)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">HRA</span>
                    <span className="font-medium text-green-900">{formatCurrency(record.hra)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">DA</span>
                    <span className="font-medium text-green-900">{formatCurrency(record.da)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">Conveyance</span>
                    <span className="font-medium text-green-900">{formatCurrency(record.conveyance)}</span>
                  </div>
                  {record.medical > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-green-700">Medical</span>
                      <span className="font-medium text-green-900">{formatCurrency(record.medical)}</span>
                    </div>
                  )}
                  {record.otherEarnings > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-green-700">Other Earnings</span>
                      <span className="font-medium text-green-900">{formatCurrency(record.otherEarnings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs pt-2 border-t border-green-300">
                    <span className="font-bold text-green-900">Gross Salary</span>
                    <span className="font-bold text-green-900">{formatCurrency(record.grossSalary)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h4 className="font-semibold text-red-900 mb-3 text-sm">Deductions</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-red-700">PF (Employee)</span>
                    <span className="font-medium text-red-900">{formatCurrency(record.pfEmployee)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-red-700">ESI (Employee)</span>
                    <span className="font-medium text-red-900">{formatCurrency(record.esiEmployee)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-red-700">Professional Tax</span>
                    <span className="font-medium text-red-900">{formatCurrency(record.professionalTax)}</span>
                  </div>
                  {record.tds > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-red-700">TDS</span>
                      <span className="font-medium text-red-900">{formatCurrency(record.tds)}</span>
                    </div>
                  )}
                  {record.otherDeductions > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-red-700">Other Deductions</span>
                      <span className="font-medium text-red-900">{formatCurrency(record.otherDeductions)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs pt-2 border-t border-red-300">
                    <span className="font-bold text-red-900">Total Deductions</span>
                    <span className="font-bold text-red-900">{formatCurrency(record.totalDeductions)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3 text-sm">Net Payment</h4>
                <div className="text-center py-4">
                  <p className="text-xs text-blue-700 mb-2">Net Salary</p>
                  <p className="text-3xl font-bold text-blue-900">{formatCurrency(record.netSalary)}</p>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-700">Gross</span>
                    <span className="text-blue-900">{formatCurrency(record.grossSalary)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-700">Deductions</span>
                    <span className="text-blue-900">-{formatCurrency(record.totalDeductions)}</span>
                  </div>
                </div>
              </div>
            </div>

            {record.verifiedBy && record.verifiedOn && (
              <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                <p>Verified by: {record.verifiedBy} on {new Date(record.verifiedOn).toLocaleDateString('en-IN')}</p>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              {record.verificationStatus === 'pending' && (
                <>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                    <CheckCircle className="inline h-4 w-4 mr-2" />
                    Verify
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm">
                    <AlertTriangle className="inline h-4 w-4 mr-2" />
                    Flag Issue
                  </button>
                </>
              )}
              {record.verificationStatus === 'flagged' && (
                <>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                    Resolve & Verify
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                    Edit Record
                  </button>
                </>
              )}
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm border border-gray-300">
                <Eye className="inline h-4 w-4 mr-2" />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {mockBatch.verified === mockBatch.employeeCount && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900">All records verified!</h3>
              <p className="text-sm text-green-700 mt-1">
                Payroll batch is ready for approval and disbursement
              </p>
            </div>
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
              Submit for Approval
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Verification Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Verify attendance days match with actual attendance records</li>
          <li>• Check that earnings and deductions are calculated correctly based on template</li>
          <li>• Ensure statutory deductions (PF, ESI, PT) comply with government regulations</li>
          <li>• Flag any records with unusual values or missing information</li>
          <li>• All flagged records must be resolved before batch approval</li>
          <li>• Cross-check total payable amount with budget allocation</li>
        </ul>
      </div>
    </div>
  );
}
