'use client';

import { useState, useMemo } from 'react';
import { Wallet, Search, Download, FileText, Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';

interface EmployeePFContribution {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  uan: string;
  basicSalary: number;
  pfBasic: number;
  employeeContribution: number;
  employerContribution: number;
  pensionFund: number;
  epf: number;
  edli: number;
  adminCharges: number;
  totalEmployer: number;
  totalContribution: number;
  pfAccountNumber: string;
}

interface PFContributionMonth {
  id: string;
  monthYear: string;
  payPeriod: string;
  employeeCount: number;
  totalEmployeeContribution: number;
  totalEmployerContribution: number;
  totalPensionFund: number;
  totalEPF: number;
  totalEDLI: number;
  totalAdminCharges: number;
  totalPayable: number;
  dueDate: string;
  status: 'draft' | 'verified' | 'submitted';
  records: EmployeePFContribution[];
}

export default function PFContributionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const mockPFMonth: PFContributionMonth = {
    id: 'PF-2025-11',
    monthYear: 'November 2025',
    payPeriod: '01-Nov-2025 to 30-Nov-2025',
    employeeCount: 6,
    totalEmployeeContribution: 13550,
    totalEmployerContribution: 9047,
    totalPensionFund: 11083,
    totalEPF: 2467,
    totalEDLI: 271,
    totalAdminCharges: 226,
    totalPayable: 22597,
    dueDate: '2025-12-15',
    status: 'verified',
    records: [
      {
        id: 'PF-001',
        employeeId: 'EMP001',
        employeeName: 'Rajesh Kumar',
        designation: 'Senior Production Manager',
        department: 'Production',
        uan: 'UAN101234567890',
        basicSalary: 31250,
        pfBasic: 31250,
        employeeContribution: 3750,
        employerContribution: 2501,
        pensionFund: 3125,
        epf: 625,
        edli: 45,
        adminCharges: 38,
        totalEmployer: 2626,
        totalContribution: 6376,
        pfAccountNumber: 'KA/BLR/0012345/001'
      },
      {
        id: 'PF-002',
        employeeId: 'EMP002',
        employeeName: 'Priya Sharma',
        designation: 'Quality Control Supervisor',
        department: 'Quality',
        uan: 'UAN101234567891',
        basicSalary: 22917,
        pfBasic: 22917,
        employeeContribution: 2750,
        employerContribution: 1834,
        pensionFund: 2292,
        epf: 458,
        edli: 33,
        adminCharges: 28,
        totalEmployer: 1923,
        totalContribution: 4673,
        pfAccountNumber: 'KA/BLR/0012345/002'
      },
      {
        id: 'PF-003',
        employeeId: 'EMP003',
        employeeName: 'Amit Patel',
        designation: 'Production Operator',
        department: 'Production',
        uan: 'UAN101234567892',
        basicSalary: 14583,
        pfBasic: 14583,
        employeeContribution: 1750,
        employerContribution: 1167,
        pensionFund: 1458,
        epf: 292,
        edli: 21,
        adminCharges: 18,
        totalEmployer: 1225,
        totalContribution: 2975,
        pfAccountNumber: 'KA/BLR/0012345/003'
      },
      {
        id: 'PF-004',
        employeeId: 'EMP004',
        employeeName: 'Neha Singh',
        designation: 'Maintenance Engineer',
        department: 'Maintenance',
        uan: 'UAN101234567893',
        basicSalary: 21667,
        pfBasic: 21667,
        employeeContribution: 2600,
        employerContribution: 1734,
        pensionFund: 2167,
        epf: 433,
        edli: 31,
        adminCharges: 26,
        totalEmployer: 1817,
        totalContribution: 4417,
        pfAccountNumber: 'KA/BLR/0012345/004'
      },
      {
        id: 'PF-005',
        employeeId: 'EMP005',
        employeeName: 'Vikram Desai',
        designation: 'Logistics Coordinator',
        department: 'Logistics',
        uan: 'UAN101234567894',
        basicSalary: 20000,
        pfBasic: 20000,
        employeeContribution: 2400,
        employerContribution: 1600,
        pensionFund: 2000,
        epf: 400,
        edli: 29,
        adminCharges: 24,
        totalEmployer: 1677,
        totalContribution: 4077,
        pfAccountNumber: 'KA/BLR/0012345/005'
      },
      {
        id: 'PF-006',
        employeeId: 'EMP006',
        employeeName: 'Kavita Mehta',
        designation: 'HR Executive',
        department: 'HR',
        uan: 'UAN101234567895',
        basicSalary: 20833,
        pfBasic: 20833,
        employeeContribution: 2500,
        employerContribution: 1667,
        pensionFund: 2083,
        epf: 417,
        edli: 30,
        adminCharges: 25,
        totalEmployer: 1755,
        totalContribution: 4255,
        pfAccountNumber: 'KA/BLR/0012345/006'
      }
    ]
  };

  const filteredRecords = useMemo(() => {
    return mockPFMonth.records.filter(record => {
      const matchesSearch =
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.uan.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }, [searchTerm, selectedDepartment]);

  const departments = ['all', 'Production', 'Quality', 'Maintenance', 'Logistics', 'HR'];

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    verified: 'bg-blue-100 text-blue-700',
    submitted: 'bg-green-100 text-green-700'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">PF Contribution</h1>
        <p className="text-sm text-gray-600 mt-1">Monthly Provident Fund contribution calculations</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{mockPFMonth.monthYear}</h2>
            <p className="text-sm text-gray-600 mt-1">Pay Period: {mockPFMonth.payPeriod}</p>
            <p className="text-xs text-gray-500 mt-1">PF Month ID: {mockPFMonth.id}</p>
          </div>
          <div className="text-right">
            <span className={`px-4 py-2 text-sm font-semibold rounded-full ${statusColors[mockPFMonth.status]} block mb-2`}>
              {mockPFMonth.status.toUpperCase()}
            </span>
            <p className="text-xs text-gray-600">
              Due Date: {new Date(mockPFMonth.dueDate).toLocaleDateString('en-IN')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Employees</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{mockPFMonth.employeeCount}</p>
              </div>
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Employee Share</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(mockPFMonth.totalEmployeeContribution)}</p>
              </div>
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Employer Share</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(mockPFMonth.totalEmployerContribution)}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Payable</p>
                <p className="text-lg font-bold text-blue-900 mt-1">{formatCurrency(mockPFMonth.totalPayable)}</p>
              </div>
              <Wallet className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-xs font-medium text-blue-600 mb-1">Pension Fund (EPS)</p>
          <p className="text-xl font-bold text-blue-900">{formatCurrency(mockPFMonth.totalPensionFund)}</p>
          <p className="text-xs text-blue-700 mt-1">8.33% of Basic</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-xs font-medium text-green-600 mb-1">EPF Balance</p>
          <p className="text-xl font-bold text-green-900">{formatCurrency(mockPFMonth.totalEPF)}</p>
          <p className="text-xs text-green-700 mt-1">3.67% of Basic</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-xs font-medium text-purple-600 mb-1">EDLI Charges</p>
          <p className="text-xl font-bold text-purple-900">{formatCurrency(mockPFMonth.totalEDLI)}</p>
          <p className="text-xs text-purple-700 mt-1">0.5% of Basic</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <p className="text-xs font-medium text-orange-600 mb-1">Admin Charges</p>
          <p className="text-xl font-bold text-orange-900">{formatCurrency(mockPFMonth.totalAdminCharges)}</p>
          <p className="text-xs text-orange-700 mt-1">0.5% of Basic</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
          <p className="text-xs font-medium text-indigo-600 mb-1">Due Date</p>
          <p className="text-sm font-bold text-indigo-900 mt-1">
            {new Date(mockPFMonth.dueDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </p>
          <p className="text-xs text-indigo-700 mt-1">15th of next month</p>
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
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Download ECR
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <FileText className="h-4 w-4" />
            PF Challan
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
                </div>
                <p className="text-sm text-gray-600">
                  {record.designation} • {record.department}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  UAN: {record.uan} • PF A/C: {record.pfAccountNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Total Contribution</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(record.totalContribution)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-700 mb-3">Salary Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Basic Salary</span>
                    <span className="font-medium text-gray-900">{formatCurrency(record.basicSalary)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">PF Basic</span>
                    <span className="font-medium text-gray-900">{formatCurrency(record.pfBasic)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="text-xs font-semibold text-green-900 mb-3">Employee Share</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">EPF (12%)</span>
                    <span className="font-medium text-green-900">{formatCurrency(record.employeeContribution)}</span>
                  </div>
                  <div className="pt-2 border-t border-green-300">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-green-900">Total</span>
                      <span className="font-bold text-green-900">{formatCurrency(record.employeeContribution)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="text-xs font-semibold text-purple-900 mb-3">Employer Share</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-700">EPS (8.33%)</span>
                    <span className="font-medium text-purple-900">{formatCurrency(record.pensionFund)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-700">EPF (3.67%)</span>
                    <span className="font-medium text-purple-900">{formatCurrency(record.epf)}</span>
                  </div>
                  <div className="pt-2 border-t border-purple-300">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-purple-900">Subtotal</span>
                      <span className="font-bold text-purple-900">{formatCurrency(record.employerContribution)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h4 className="text-xs font-semibold text-orange-900 mb-3">Other Charges</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-orange-700">EDLI (0.5%)</span>
                    <span className="font-medium text-orange-900">{formatCurrency(record.edli)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-orange-700">Admin (0.5%)</span>
                    <span className="font-medium text-orange-900">{formatCurrency(record.adminCharges)}</span>
                  </div>
                  <div className="pt-2 border-t border-orange-300">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-orange-900">Total Employer</span>
                      <span className="font-bold text-orange-900">{formatCurrency(record.totalEmployer)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">PF Contribution Guidelines (India)</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Employee Contribution:</strong> 12% of Basic + DA (deducted from salary)</li>
          <li>• <strong>Employer Contribution:</strong> 12% of Basic + DA (8.33% to EPS, 3.67% to EPF)</li>
          <li>• <strong>EPS (Pension Fund):</strong> Maximum capped at ₹1,250/month (8.33% of ₹15,000)</li>
          <li>• <strong>EDLI Charges:</strong> 0.5% of Basic + DA (max ₹75/month)</li>
          <li>• <strong>Admin Charges:</strong> 0.5% of Basic + DA for EPFO administration</li>
          <li>• <strong>Due Date:</strong> 15th of the following month</li>
          <li>• <strong>ECR Filing:</strong> Electronic Challan cum Return to be filed online</li>
        </ul>
      </div>
    </div>
  );
}
