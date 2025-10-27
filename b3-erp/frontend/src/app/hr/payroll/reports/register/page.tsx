'use client';

import { useState, useMemo } from 'react';
import { FileText, Search, Download, Users, DollarSign, Calendar } from 'lucide-react';

interface PayrollRegisterRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  daysWorked: number;
  daysPresent: number;
  basic: number;
  hra: number;
  conveyance: number;
  specialAllowance: number;
  grossSalary: number;
  pfEmployee: number;
  pfEmployer: number;
  esi: number;
  pt: number;
  tds: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  monthYear: string;
}

export default function PayrollRegisterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('2025-11');

  const mockRegisterRecords: PayrollRegisterRecord[] = [
    {
      id: 'PR-2025-11-001',
      employeeId: 'EMP001',
      employeeName: 'Rajesh Kumar',
      designation: 'Senior Production Manager',
      department: 'Production',
      daysWorked: 30,
      daysPresent: 30,
      basic: 20000,
      hra: 10000,
      conveyance: 1600,
      specialAllowance: 18125,
      grossSalary: 49725,
      pfEmployee: 2400,
      pfEmployer: 2400,
      esi: 373,
      pt: 200,
      tds: 1250,
      otherDeductions: 0,
      totalDeductions: 4223,
      netSalary: 45502,
      monthYear: 'November 2025'
    },
    {
      id: 'PR-2025-11-002',
      employeeId: 'EMP002',
      employeeName: 'Priya Sharma',
      designation: 'Quality Control Supervisor',
      department: 'Quality',
      daysWorked: 30,
      daysPresent: 30,
      basic: 14500,
      hra: 7250,
      conveyance: 1600,
      specialAllowance: 12626,
      grossSalary: 35976,
      pfEmployee: 1740,
      pfEmployer: 1740,
      esi: 270,
      pt: 200,
      tds: 450,
      otherDeductions: 0,
      totalDeductions: 2660,
      netSalary: 33316,
      monthYear: 'November 2025'
    },
    {
      id: 'PR-2025-11-003',
      employeeId: 'EMP003',
      employeeName: 'Amit Patel',
      designation: 'Production Operator',
      department: 'Production',
      daysWorked: 30,
      daysPresent: 30,
      basic: 8800,
      hra: 4400,
      conveyance: 1600,
      specialAllowance: 7074,
      grossSalary: 21874,
      pfEmployee: 1056,
      pfEmployer: 1056,
      esi: 164,
      pt: 200,
      tds: 0,
      otherDeductions: 0,
      totalDeductions: 1420,
      netSalary: 20454,
      monthYear: 'November 2025'
    },
    {
      id: 'PR-2025-11-004',
      employeeId: 'EMP004',
      employeeName: 'Neha Singh',
      designation: 'Maintenance Engineer',
      department: 'Maintenance',
      daysWorked: 30,
      daysPresent: 30,
      basic: 13725,
      hra: 6862,
      conveyance: 1600,
      specialAllowance: 11914,
      grossSalary: 34101,
      pfEmployee: 1647,
      pfEmployer: 1647,
      esi: 256,
      pt: 200,
      tds: 380,
      otherDeductions: 2500,
      totalDeductions: 4983,
      netSalary: 29118,
      monthYear: 'November 2025'
    },
    {
      id: 'PR-2025-11-005',
      employeeId: 'EMP005',
      employeeName: 'Vikram Desai',
      designation: 'Logistics Coordinator',
      department: 'Logistics',
      daysWorked: 30,
      daysPresent: 30,
      basic: 12720,
      hra: 6360,
      conveyance: 1600,
      specialAllowance: 10920,
      grossSalary: 31600,
      pfEmployee: 1526,
      pfEmployer: 1526,
      esi: 237,
      pt: 200,
      tds: 320,
      otherDeductions: 3000,
      totalDeductions: 5283,
      netSalary: 26317,
      monthYear: 'November 2025'
    },
    {
      id: 'PR-2025-11-006',
      employeeId: 'EMP006',
      employeeName: 'Kavita Mehta',
      designation: 'HR Executive',
      department: 'HR',
      daysWorked: 30,
      daysPresent: 30,
      basic: 13220,
      hra: 6610,
      conveyance: 1600,
      specialAllowance: 11419,
      grossSalary: 32849,
      pfEmployee: 1586,
      pfEmployer: 1586,
      esi: 246,
      pt: 200,
      tds: 350,
      otherDeductions: 0,
      totalDeductions: 2382,
      netSalary: 30467,
      monthYear: 'November 2025'
    }
  ];

  const filteredRecords = useMemo(() => {
    return mockRegisterRecords.filter(record => {
      const matchesSearch =
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }, [searchTerm, selectedDepartment]);

  const departments = ['all', 'Production', 'Quality', 'Maintenance', 'Logistics', 'HR'];

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const totalStats = useMemo(() => {
    return filteredRecords.reduce((acc, record) => ({
      employees: acc.employees + 1,
      totalGross: acc.totalGross + record.grossSalary,
      totalDeductions: acc.totalDeductions + record.totalDeductions,
      totalNet: acc.totalNet + record.netSalary,
      totalPFEmployee: acc.totalPFEmployee + record.pfEmployee,
      totalPFEmployer: acc.totalPFEmployer + record.pfEmployer,
      totalESI: acc.totalESI + record.esi,
      totalPT: acc.totalPT + record.pt,
      totalTDS: acc.totalTDS + record.tds
    }), {
      employees: 0,
      totalGross: 0,
      totalDeductions: 0,
      totalNet: 0,
      totalPFEmployee: 0,
      totalPFEmployer: 0,
      totalESI: 0,
      totalPT: 0,
      totalTDS: 0
    });
  }, [filteredRecords]);

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payroll Register</h1>
        <p className="text-sm text-gray-600 mt-1">Comprehensive monthly salary register</p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-sm border border-purple-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">November 2025</h2>
            <p className="text-sm text-gray-600 mt-1">Monthly Payroll Summary</p>
            <p className="text-xs text-gray-500 mt-1">Complete salary register for statutory compliance</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <Download className="h-4 w-4" />
              Export PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Download className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalStats.employees}</p>
              </div>
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Gross Salary</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(totalStats.totalGross)}</p>
              </div>
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Deductions</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(totalStats.totalDeductions)}</p>
              </div>
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Net Salary</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(totalStats.totalNet)}</p>
              </div>
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Employer Cost</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {formatCurrency(totalStats.totalGross + totalStats.totalPFEmployer)}
                </p>
              </div>
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by employee name or ID..."
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
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 border-b">Employee</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 border-b">Department</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 border-b">Days</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 border-b bg-green-50">Basic</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 border-b bg-green-50">HRA</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 border-b bg-green-50">Conveyance</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 border-b bg-green-50">Special</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 border-b bg-green-100">Gross</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 border-b bg-red-50">PF</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 border-b bg-red-50">ESI</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 border-b bg-red-50">PT</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 border-b bg-red-50">TDS</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 border-b bg-red-50">Other</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 border-b bg-red-100">Deductions</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 border-b bg-blue-100">Net Salary</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 border-b">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{record.employeeName}</p>
                    <p className="text-xs text-gray-500">{record.employeeId}</p>
                    <p className="text-xs text-gray-500">{record.designation}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{record.department}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{record.daysPresent}/{record.daysWorked}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-700 bg-green-50">{formatCurrency(record.basic)}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-700 bg-green-50">{formatCurrency(record.hra)}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-700 bg-green-50">{formatCurrency(record.conveyance)}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-700 bg-green-50">{formatCurrency(record.specialAllowance)}</td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900 bg-green-100">{formatCurrency(record.grossSalary)}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-700 bg-red-50">{formatCurrency(record.pfEmployee)}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-700 bg-red-50">{formatCurrency(record.esi)}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-700 bg-red-50">{formatCurrency(record.pt)}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-700 bg-red-50">{formatCurrency(record.tds)}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-700 bg-red-50">{formatCurrency(record.otherDeductions)}</td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900 bg-red-100">{formatCurrency(record.totalDeductions)}</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-blue-600 bg-blue-100">{formatCurrency(record.netSalary)}</td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-bold">
              <td className="px-4 py-3 text-sm text-gray-900" colSpan={3}>TOTAL ({totalStats.employees} Employees)</td>
              <td className="px-4 py-3 text-right text-sm text-gray-900 bg-green-50">{formatCurrency(filteredRecords.reduce((s, r) => s + r.basic, 0))}</td>
              <td className="px-4 py-3 text-right text-sm text-gray-900 bg-green-50">{formatCurrency(filteredRecords.reduce((s, r) => s + r.hra, 0))}</td>
              <td className="px-4 py-3 text-right text-sm text-gray-900 bg-green-50">{formatCurrency(filteredRecords.reduce((s, r) => s + r.conveyance, 0))}</td>
              <td className="px-4 py-3 text-right text-sm text-gray-900 bg-green-50">{formatCurrency(filteredRecords.reduce((s, r) => s + r.specialAllowance, 0))}</td>
              <td className="px-4 py-3 text-right text-sm text-gray-900 bg-green-100">{formatCurrency(totalStats.totalGross)}</td>
              <td className="px-4 py-3 text-right text-sm text-gray-900 bg-red-50">{formatCurrency(totalStats.totalPFEmployee)}</td>
              <td className="px-4 py-3 text-right text-sm text-gray-900 bg-red-50">{formatCurrency(totalStats.totalESI)}</td>
              <td className="px-4 py-3 text-right text-sm text-gray-900 bg-red-50">{formatCurrency(totalStats.totalPT)}</td>
              <td className="px-4 py-3 text-right text-sm text-gray-900 bg-red-50">{formatCurrency(totalStats.totalTDS)}</td>
              <td className="px-4 py-3 text-right text-sm text-gray-900 bg-red-50">{formatCurrency(filteredRecords.reduce((s, r) => s + r.otherDeductions, 0))}</td>
              <td className="px-4 py-3 text-right text-sm text-gray-900 bg-red-100">{formatCurrency(totalStats.totalDeductions)}</td>
              <td className="px-4 py-3 text-right text-sm text-gray-900 bg-blue-100">{formatCurrency(totalStats.totalNet)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-purple-900 mb-2">Payroll Register Guidelines</h3>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• <strong>Purpose:</strong> Statutory register to be maintained as per labor laws (Payment of Wages Act, Factories Act)</li>
          <li>• <strong>Contents:</strong> Complete details of earnings, deductions, and net payment for each employee</li>
          <li>• <strong>Retention:</strong> Register must be preserved for 3 years from last entry</li>
          <li>• <strong>Inspection:</strong> Must be available for inspection by labor authorities</li>
          <li>• <strong>Format:</strong> Can be maintained in physical or electronic form</li>
          <li>• <strong>Signature:</strong> Each entry should be signed/acknowledged by employee upon payment</li>
          <li>• <strong>Employer Cost:</strong> Includes gross salary + employer PF (12%) + employer ESI (3.0%)</li>
          <li>• <strong>Compliance:</strong> Essential for statutory audits and labor inspections</li>
        </ul>
      </div>
    </div>
  );
}
