'use client';

import { useState, useMemo } from 'react';
import { FileText, Search, Download, Mail, Users, Calendar, DollarSign, Send, Eye, Printer } from 'lucide-react';

interface PayslipRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  monthYear: string;
  payPeriod: string;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  paymentDate: string;
  paymentMode: 'bank' | 'cash' | 'cheque';
  status: 'draft' | 'generated' | 'sent' | 'downloaded' | 'acknowledged';
  emailSent: boolean;
  emailDate?: string;
  acknowledgedDate?: string;
  basic: number;
  hra: number;
  conveyance: number;
  specialAllowance: number;
  pfEmployee: number;
  esi: number;
  pt: number;
  tds: number;
  loanEMI?: number;
  advanceRecovery?: number;
}

export default function PayslipsReportPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('2025-11');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockPayslips: PayslipRecord[] = [
    {
      id: 'PS-2025-11-001',
      employeeId: 'EMP001',
      employeeName: 'Rajesh Kumar',
      designation: 'Senior Production Manager',
      department: 'Production',
      monthYear: 'November 2025',
      payPeriod: '01-Nov-2025 to 30-Nov-2025',
      basic: 20000,
      hra: 10000,
      conveyance: 1600,
      specialAllowance: 18125,
      grossSalary: 49725,
      pfEmployee: 2400,
      esi: 373,
      pt: 200,
      tds: 1250,
      totalDeductions: 4223,
      netSalary: 45502,
      paymentDate: '2025-12-01',
      paymentMode: 'bank',
      status: 'sent',
      emailSent: true,
      emailDate: '2025-12-01',
      acknowledgedDate: '2025-12-01'
    },
    {
      id: 'PS-2025-11-002',
      employeeId: 'EMP002',
      employeeName: 'Priya Sharma',
      designation: 'Quality Control Supervisor',
      department: 'Quality',
      monthYear: 'November 2025',
      payPeriod: '01-Nov-2025 to 30-Nov-2025',
      basic: 14500,
      hra: 7250,
      conveyance: 1600,
      specialAllowance: 12626,
      grossSalary: 35976,
      pfEmployee: 1740,
      esi: 270,
      pt: 200,
      tds: 450,
      totalDeductions: 2660,
      netSalary: 33316,
      paymentDate: '2025-12-01',
      paymentMode: 'bank',
      status: 'sent',
      emailSent: true,
      emailDate: '2025-12-01'
    },
    {
      id: 'PS-2025-11-003',
      employeeId: 'EMP003',
      employeeName: 'Amit Patel',
      designation: 'Production Operator',
      department: 'Production',
      monthYear: 'November 2025',
      payPeriod: '01-Nov-2025 to 30-Nov-2025',
      basic: 8800,
      hra: 4400,
      conveyance: 1600,
      specialAllowance: 7074,
      grossSalary: 21874,
      pfEmployee: 1056,
      esi: 164,
      pt: 200,
      tds: 0,
      totalDeductions: 1420,
      netSalary: 20454,
      paymentDate: '2025-12-01',
      paymentMode: 'bank',
      status: 'generated',
      emailSent: false
    },
    {
      id: 'PS-2025-11-004',
      employeeId: 'EMP004',
      employeeName: 'Neha Singh',
      designation: 'Maintenance Engineer',
      department: 'Maintenance',
      monthYear: 'November 2025',
      payPeriod: '01-Nov-2025 to 30-Nov-2025',
      basic: 13725,
      hra: 6862,
      conveyance: 1600,
      specialAllowance: 11914,
      grossSalary: 34101,
      pfEmployee: 1647,
      esi: 256,
      pt: 200,
      tds: 380,
      loanEMI: 2500,
      totalDeductions: 4983,
      netSalary: 29118,
      paymentDate: '2025-12-01',
      paymentMode: 'bank',
      status: 'sent',
      emailSent: true,
      emailDate: '2025-12-01',
      acknowledgedDate: '2025-12-02'
    },
    {
      id: 'PS-2025-11-005',
      employeeId: 'EMP005',
      employeeName: 'Vikram Desai',
      designation: 'Logistics Coordinator',
      department: 'Logistics',
      monthYear: 'November 2025',
      payPeriod: '01-Nov-2025 to 30-Nov-2025',
      basic: 12720,
      hra: 6360,
      conveyance: 1600,
      specialAllowance: 10920,
      grossSalary: 31600,
      pfEmployee: 1526,
      esi: 237,
      pt: 200,
      tds: 320,
      advanceRecovery: 3000,
      totalDeductions: 5283,
      netSalary: 26317,
      paymentDate: '2025-12-01',
      paymentMode: 'bank',
      status: 'generated',
      emailSent: false
    },
    {
      id: 'PS-2025-11-006',
      employeeId: 'EMP006',
      employeeName: 'Kavita Mehta',
      designation: 'HR Executive',
      department: 'HR',
      monthYear: 'November 2025',
      payPeriod: '01-Nov-2025 to 30-Nov-2025',
      basic: 13220,
      hra: 6610,
      conveyance: 1600,
      specialAllowance: 11419,
      grossSalary: 32849,
      pfEmployee: 1586,
      esi: 246,
      pt: 200,
      tds: 350,
      totalDeductions: 2382,
      netSalary: 30467,
      paymentDate: '2025-12-01',
      paymentMode: 'bank',
      status: 'sent',
      emailSent: true,
      emailDate: '2025-12-01'
    }
  ];

  const filteredPayslips = useMemo(() => {
    return mockPayslips.filter(payslip => {
      const matchesSearch =
        payslip.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payslip.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || payslip.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'all' || payslip.status === selectedStatus;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [searchTerm, selectedDepartment, selectedStatus]);

  const departments = ['all', 'Production', 'Quality', 'Maintenance', 'Logistics', 'HR'];
  const statuses = ['all', 'draft', 'generated', 'sent', 'downloaded', 'acknowledged'];

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    generated: 'bg-blue-100 text-blue-700',
    sent: 'bg-green-100 text-green-700',
    downloaded: 'bg-purple-100 text-purple-700',
    acknowledged: 'bg-teal-100 text-teal-700'
  };

  const totalStats = useMemo(() => {
    const total = filteredPayslips.reduce((acc, p) => ({
      grossSalary: acc.grossSalary + p.grossSalary,
      totalDeductions: acc.totalDeductions + p.totalDeductions,
      netSalary: acc.netSalary + p.netSalary,
      sent: acc.sent + (p.status === 'sent' ? 1 : 0),
      acknowledged: acc.acknowledged + (p.acknowledgedDate ? 1 : 0)
    }), { grossSalary: 0, totalDeductions: 0, netSalary: 0, sent: 0, acknowledged: 0 });
    return total;
  }, [filteredPayslips]);

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payslips Report</h1>
        <p className="text-sm text-gray-600 mt-1">Generate, view and distribute employee payslips</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">November 2025</h2>
            <p className="text-sm text-gray-600 mt-1">Pay Period: 01-Nov-2025 to 30-Nov-2025</p>
            <p className="text-xs text-gray-500 mt-1">Payment Date: 01-Dec-2025</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Mail className="h-4 w-4" />
              Send All
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Download className="h-4 w-4" />
              Bulk Download
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{filteredPayslips.length}</p>
              </div>
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Gross Salary</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(totalStats.grossSalary)}</p>
              </div>
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Deductions</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(totalStats.totalDeductions)}</p>
              </div>
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Net Salary</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(totalStats.netSalary)}</p>
              </div>
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Sent / Acknowledged</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalStats.sent} / {totalStats.acknowledged}</p>
              </div>
              <Send className="h-6 w-6 text-purple-600" />
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
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
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

      <div className="space-y-4">
        {filteredPayslips.map(payslip => (
          <div key={payslip.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{payslip.employeeName}</h3>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                    {payslip.employeeId}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[payslip.status]}`}>
                    {payslip.status.toUpperCase()}
                  </span>
                  {payslip.emailSent && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                      EMAIL SENT
                    </span>
                  )}
                  {payslip.acknowledgedDate && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-700">
                      ACKNOWLEDGED
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {payslip.designation} • {payslip.department}
                </p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {payslip.payPeriod} • Payment: {new Date(payslip.paymentDate).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Net Salary</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(payslip.netSalary)}</p>
                <p className="text-xs text-gray-500 mt-1">ID: {payslip.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="text-xs font-semibold text-green-900 mb-3">Earnings</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">Basic</span>
                    <span className="font-medium text-green-900">{formatCurrency(payslip.basic)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">HRA</span>
                    <span className="font-medium text-green-900">{formatCurrency(payslip.hra)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">Conveyance</span>
                    <span className="font-medium text-green-900">{formatCurrency(payslip.conveyance)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">Special Allowance</span>
                    <span className="font-medium text-green-900">{formatCurrency(payslip.specialAllowance)}</span>
                  </div>
                  <div className="pt-2 border-t border-green-300">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-green-900">Gross Salary</span>
                      <span className="font-bold text-green-900">{formatCurrency(payslip.grossSalary)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h4 className="text-xs font-semibold text-red-900 mb-3">Deductions</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-red-700">PF (Employee)</span>
                    <span className="font-medium text-red-900">{formatCurrency(payslip.pfEmployee)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-red-700">ESI</span>
                    <span className="font-medium text-red-900">{formatCurrency(payslip.esi)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-red-700">Professional Tax</span>
                    <span className="font-medium text-red-900">{formatCurrency(payslip.pt)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-red-700">TDS</span>
                    <span className="font-medium text-red-900">{formatCurrency(payslip.tds)}</span>
                  </div>
                  {payslip.loanEMI && (
                    <div className="flex justify-between text-xs">
                      <span className="text-red-700">Loan EMI</span>
                      <span className="font-medium text-red-900">{formatCurrency(payslip.loanEMI)}</span>
                    </div>
                  )}
                  {payslip.advanceRecovery && (
                    <div className="flex justify-between text-xs">
                      <span className="text-red-700">Advance Recovery</span>
                      <span className="font-medium text-red-900">{formatCurrency(payslip.advanceRecovery)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-red-300">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-red-900">Total Deductions</span>
                      <span className="font-bold text-red-900">{formatCurrency(payslip.totalDeductions)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="text-xs font-semibold text-blue-900 mb-3">Payment Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-700">Gross Salary</span>
                    <span className="font-medium text-blue-900">{formatCurrency(payslip.grossSalary)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-700">Total Deductions</span>
                    <span className="font-medium text-blue-900">-{formatCurrency(payslip.totalDeductions)}</span>
                  </div>
                  <div className="pt-2 border-t border-blue-300">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="font-bold text-blue-900">Net Salary</span>
                      <span className="font-bold text-blue-900">{formatCurrency(payslip.netSalary)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-700">Payment Mode</span>
                    <span className="font-medium text-blue-900 uppercase">{payslip.paymentMode}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-700">Payment Date</span>
                    <span className="font-medium text-blue-900">{new Date(payslip.paymentDate).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="text-xs font-semibold text-purple-900 mb-3">Delivery Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-700">Status</span>
                    <span className="font-medium text-purple-900 uppercase">{payslip.status}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-700">Email Sent</span>
                    <span className="font-medium text-purple-900">{payslip.emailSent ? 'Yes' : 'No'}</span>
                  </div>
                  {payslip.emailDate && (
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-700">Email Date</span>
                      <span className="font-medium text-purple-900">{new Date(payslip.emailDate).toLocaleDateString('en-IN')}</span>
                    </div>
                  )}
                  {payslip.acknowledgedDate && (
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-700">Acknowledged</span>
                      <span className="font-medium text-purple-900">{new Date(payslip.acknowledgedDate).toLocaleDateString('en-IN')}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-purple-300">
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                      <Eye className="h-3 w-3" />
                      View
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      <Download className="h-3 w-3" />
                      PDF
                    </button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                      <Mail className="h-3 w-3" />
                      Email
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                      <Printer className="h-3 w-3" />
                      Print
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Payslip Management Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Generation:</strong> Payslips auto-generated after salary processing completion</li>
          <li>• <strong>Distribution:</strong> Email payslips to employees on payment date</li>
          <li>• <strong>Format:</strong> Password-protected PDF (password: DOB in DDMMYYYY format)</li>
          <li>• <strong>Content:</strong> All earnings, deductions, net pay, YTD totals, and employer details</li>
          <li>• <strong>Access:</strong> Employees can download from self-service portal</li>
          <li>• <strong>Retention:</strong> Store payslips for minimum 7 years as per labor laws</li>
          <li>• <strong>Privacy:</strong> Ensure confidentiality of salary information</li>
          <li>• <strong>Acknowledgment:</strong> Track employee receipt and acknowledgment</li>
        </ul>
      </div>
    </div>
  );
}
