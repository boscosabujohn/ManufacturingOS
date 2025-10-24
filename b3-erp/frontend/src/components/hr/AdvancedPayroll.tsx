'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  Calculator,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
  Percent,
  PieChart,
  BarChart3,
  CreditCard,
  Building2,
  Award,
  Shield,
  Target,
  Activity,
  Zap,
  Plus,
  Edit,
  Trash2,
  Eye,
  Send,
} from 'lucide-react';

// Type Definitions
export type PayrollStatus = 'draft' | 'calculated' | 'approved' | 'processed' | 'paid' | 'cancelled';
export type PayrollCycle = 'monthly' | 'semi-monthly' | 'bi-weekly' | 'weekly';
export type SalaryComponent = 'basic' | 'hra' | 'da' | 'ta' | 'special' | 'bonus' | 'overtime' | 'arrears';
export type DeductionType = 'pf' | 'esi' | 'pt' | 'tds' | 'loan' | 'advance' | 'other';
export type TaxRegime = 'old' | 'new';

export interface PayrollRun {
  id: string;
  payPeriod: string;
  cycle: PayrollCycle;
  fromDate: string;
  toDate: string;
  status: PayrollStatus;
  employeeCount: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  processedAt?: string;
}

export interface EarningComponent {
  component: SalaryComponent;
  label: string;
  amount: number;
  isTaxable: boolean;
  isPFApplicable: boolean;
  isESIApplicable: boolean;
  calculationFormula?: string;
}

export interface DeductionComponent {
  type: DeductionType;
  label: string;
  amount: number;
  percentage?: number;
  isStatutory: boolean;
  description?: string;
}

export interface EmployeePayslip {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  payPeriod: string;
  workingDays: number;
  presentDays: number;
  paidDays: number;
  lop: number;
  earnings: EarningComponent[];
  deductions: DeductionComponent[];
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  status: 'draft' | 'finalized' | 'sent' | 'acknowledged';
}

export interface TaxCalculation {
  employeeId: string;
  financialYear: string;
  taxRegime: TaxRegime;
  grossIncome: number;
  exemptions: number;
  deductions: number;
  taxableIncome: number;
  incomeTax: number;
  cess: number;
  totalTax: number;
  monthlyTDS: number;
}

export interface PayrollCompliance {
  id: string;
  type: 'pf' | 'esi' | 'pt' | 'lwf' | 'tds';
  label: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'filed' | 'paid' | 'overdue';
  filedOn?: string;
  challanNumber?: string;
}

export interface PayrollAudit {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  details: string;
  ipAddress: string;
}

export default function AdvancedPayroll() {
  const [activeTab, setActiveTab] = useState<'runs' | 'calculation' | 'tax' | 'compliance' | 'audit' | 'reports'>('runs');
  const [selectedRun, setSelectedRun] = useState<string | null>(null);

  // Mock Data
  const payrollRuns: PayrollRun[] = [
    {
      id: 'pr-202501',
      payPeriod: 'January 2025',
      cycle: 'monthly',
      fromDate: '2025-01-01',
      toDate: '2025-01-31',
      status: 'processed',
      employeeCount: 245,
      totalGross: 29400000,
      totalDeductions: 4680000,
      totalNet: 24720000,
      createdBy: 'HR Admin',
      createdAt: '2025-01-25',
      approvedBy: 'Finance Head',
      approvedAt: '2025-01-28',
      processedAt: '2025-01-30',
    },
    {
      id: 'pr-202502',
      payPeriod: 'February 2025',
      cycle: 'monthly',
      fromDate: '2025-02-01',
      toDate: '2025-02-28',
      status: 'draft',
      employeeCount: 247,
      totalGross: 29640000,
      totalDeductions: 4722000,
      totalNet: 24918000,
      createdBy: 'HR Admin',
      createdAt: '2025-02-01',
    },
  ];

  const samplePayslip: EmployeePayslip = {
    id: 'ps-001',
    employeeId: 'EMP2025001',
    employeeName: 'John Doe',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    payPeriod: 'January 2025',
    workingDays: 31,
    presentDays: 28,
    paidDays: 28,
    lop: 3,
    earnings: [
      { component: 'basic', label: 'Basic Salary', amount: 60000, isTaxable: true, isPFApplicable: true, isESIApplicable: false },
      { component: 'hra', label: 'House Rent Allowance', amount: 30000, isTaxable: true, isPFApplicable: false, isESIApplicable: false },
      { component: 'da', label: 'Dearness Allowance', amount: 12000, isTaxable: true, isPFApplicable: false, isESIApplicable: false },
      { component: 'ta', label: 'Transport Allowance', amount: 3200, isTaxable: false, isPFApplicable: false, isESIApplicable: false },
      { component: 'special', label: 'Special Allowance', amount: 14800, isTaxable: true, isPFApplicable: false, isESIApplicable: false },
    ],
    deductions: [
      { type: 'pf', label: 'Provident Fund (Employee)', amount: 7200, percentage: 12, isStatutory: true },
      { type: 'esi', label: 'ESI (Employee)', amount: 0, percentage: 0.75, isStatutory: true },
      { type: 'pt', label: 'Professional Tax', amount: 200, isStatutory: true },
      { type: 'tds', label: 'Tax Deducted at Source', amount: 8500, isStatutory: true },
      { type: 'loan', label: 'Home Loan Repayment', amount: 5000, isStatutory: false },
    ],
    grossPay: 120000,
    totalDeductions: 20900,
    netPay: 99100,
    status: 'finalized',
  };

  const taxCalculations: TaxCalculation[] = [
    {
      employeeId: 'EMP2025001',
      financialYear: '2024-25',
      taxRegime: 'new',
      grossIncome: 1440000,
      exemptions: 50000,
      deductions: 150000,
      taxableIncome: 1240000,
      incomeTax: 102000,
      cess: 4080,
      totalTax: 106080,
      monthlyTDS: 8840,
    },
  ];

  const complianceItems: PayrollCompliance[] = [
    {
      id: 'pf-202501',
      type: 'pf',
      label: 'PF Return - January 2025',
      dueDate: '2025-02-15',
      amount: 3528000,
      status: 'paid',
      filedOn: '2025-02-10',
      challanNumber: 'PF/2025/001',
    },
    {
      id: 'esi-202501',
      type: 'esi',
      label: 'ESI Return - January 2025',
      dueDate: '2025-02-21',
      amount: 220500,
      status: 'pending',
    },
    {
      id: 'tds-202501',
      type: 'tds',
      label: 'TDS Return - Q4 FY2024-25',
      dueDate: '2025-04-30',
      amount: 2088000,
      status: 'pending',
    },
  ];

  const auditLogs: PayrollAudit[] = [
    {
      id: 'aud-001',
      timestamp: '2025-01-30 16:45:23',
      action: 'Payroll Processed',
      performedBy: 'Finance Head',
      details: 'January 2025 payroll processed for 245 employees',
      ipAddress: '192.168.1.100',
    },
    {
      id: 'aud-002',
      timestamp: '2025-01-28 14:30:15',
      action: 'Payroll Approved',
      performedBy: 'Finance Head',
      details: 'January 2025 payroll approved',
      ipAddress: '192.168.1.100',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: PayrollStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'calculated': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'processed': return 'bg-purple-100 text-purple-800';
      case 'paid': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'runs', label: 'Payroll Runs', icon: Calendar },
    { id: 'calculation', label: 'Salary Calculation', icon: Calculator },
    { id: 'tax', label: 'Tax Computation', icon: Percent },
    { id: 'compliance', label: 'Statutory Compliance', icon: Shield },
    { id: 'audit', label: 'Audit Trail', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Payroll Management</h1>
          <p className="text-gray-600">Automated payroll processing with statutory compliance and tax calculations</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          {activeTab === 'runs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Payroll Runs</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Create New Payroll Run
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <p className="text-sm font-medium text-gray-700">Total Employees</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{payrollRuns[0].employeeCount}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-medium text-gray-700">Total Gross</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(payrollRuns[0].totalGross)}</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    <p className="text-sm font-medium text-gray-700">Total Deductions</p>
                  </div>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(payrollRuns[0].totalDeductions)}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    <p className="text-sm font-medium text-gray-700">Total Net Pay</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(payrollRuns[0].totalNet)}</p>
                </div>
              </div>

              {/* Payroll Runs List */}
              <div className="space-y-3">
                {payrollRuns.map((run) => (
                  <div key={run.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-purple-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-6 h-6 text-purple-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{run.payPeriod}</h3>
                          <p className="text-sm text-gray-600">
                            {run.fromDate} to {run.toDate} • {run.employeeCount} employees
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(run.status)}`}>
                        {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Gross Pay</p>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(run.totalGross)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Deductions</p>
                        <p className="text-lg font-bold text-red-600">{formatCurrency(run.totalDeductions)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Net Pay</p>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(run.totalNet)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      {run.status === 'draft' && (
                        <>
                          <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                            <Calculator className="w-4 h-4" />
                            Calculate
                          </button>
                          <button className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                        </>
                      )}
                      {run.status === 'processed' && (
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors">
                          <Download className="w-4 h-4" />
                          Download Reports
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'calculation' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Salary Calculation Engine</h2>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{samplePayslip.employeeName}</h3>
                    <p className="text-sm text-gray-600">
                      {samplePayslip.employeeId} • {samplePayslip.department} • {samplePayslip.designation}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {samplePayslip.status}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600">Working Days</p>
                    <p className="text-lg font-bold text-gray-900">{samplePayslip.workingDays}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600">Present Days</p>
                    <p className="text-lg font-bold text-green-600">{samplePayslip.presentDays}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600">Paid Days</p>
                    <p className="text-lg font-bold text-blue-600">{samplePayslip.paidDays}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600">LOP</p>
                    <p className="text-lg font-bold text-red-600">{samplePayslip.lop}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Earnings */}
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Earnings
                    </h4>
                    <div className="space-y-2">
                      {samplePayslip.earnings.map((earning, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700">{earning.label}</span>
                            {earning.isTaxable && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Taxable</span>}
                          </div>
                          <span className="font-semibold text-gray-900">{formatCurrency(earning.amount)}</span>
                        </div>
                      ))}
                      <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-bold">
                        <span className="text-gray-900">Gross Pay</span>
                        <span className="text-green-600">{formatCurrency(samplePayslip.grossPay)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                      Deductions
                    </h4>
                    <div className="space-y-2">
                      {samplePayslip.deductions.map((deduction, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700">{deduction.label}</span>
                            {deduction.isStatutory && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Statutory</span>}
                          </div>
                          <span className="font-semibold text-gray-900">{formatCurrency(deduction.amount)}</span>
                        </div>
                      ))}
                      <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-bold">
                        <span className="text-gray-900">Total Deductions</span>
                        <span className="text-red-600">{formatCurrency(samplePayslip.totalDeductions)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Net Pay (Take Home)</p>
                      <p className="text-3xl font-bold">{formatCurrency(samplePayslip.netPay)}</p>
                    </div>
                    <DollarSign className="w-12 h-12 opacity-75" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tax' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Tax Computation & TDS</h2>

              {taxCalculations.map((tax, index) => (
                <div key={index} className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6 border border-orange-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Tax Calculation - FY {tax.financialYear}</h3>
                      <p className="text-sm text-gray-600">Employee: {tax.employeeId}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {tax.taxRegime.toUpperCase()} Regime
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Gross Income</p>
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(tax.grossIncome)}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Exemptions</p>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(tax.exemptions)}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Deductions</p>
                      <p className="text-lg font-bold text-blue-600">{formatCurrency(tax.deductions)}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Taxable Income</p>
                      <p className="text-lg font-bold text-orange-600">{formatCurrency(tax.taxableIncome)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Income Tax</p>
                      <p className="text-xl font-bold text-red-600">{formatCurrency(tax.incomeTax)}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Cess (4%)</p>
                      <p className="text-xl font-bold text-orange-600">{formatCurrency(tax.cess)}</p>
                    </div>
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-4 text-white">
                      <p className="text-xs opacity-90 mb-1">Monthly TDS</p>
                      <p className="text-xl font-bold">{formatCurrency(tax.monthlyTDS)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Statutory Compliance & Returns</h2>

              <div className="grid grid-cols-1 gap-4">
                {complianceItems.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6 text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.label}</h3>
                          <p className="text-sm text-gray-600">Due Date: {item.dueDate}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === 'paid' ? 'bg-green-100 text-green-800' :
                        item.status === 'filed' ? 'bg-blue-100 text-blue-800' :
                        item.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                        {item.challanNumber && (
                          <p className="text-sm text-gray-600">Challan: {item.challanNumber}</p>
                        )}
                      </div>
                      {item.status === 'pending' && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <Send className="w-4 h-4" />
                          File Return
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Payroll Audit Trail</h2>

              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-semibold text-gray-900">{log.action}</p>
                          <p className="text-sm text-gray-600">{log.details}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{log.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {log.performedBy}
                      </span>
                      <span>IP: {log.ipAddress}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Payroll Reports</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Monthly Payroll Summary', icon: FileText, color: 'blue' },
                  { name: 'Department-wise Analysis', icon: Building2, color: 'green' },
                  { name: 'Tax Deduction Summary', icon: Percent, color: 'orange' },
                  { name: 'Statutory Compliance Report', icon: Shield, color: 'purple' },
                  { name: 'Year-to-Date Report', icon: Calendar, color: 'indigo' },
                  { name: 'Cost Center Allocation', icon: PieChart, color: 'pink' },
                ].map((report, index) => {
                  const Icon = report.icon;
                  return (
                    <div key={index} className={`bg-gradient-to-br from-${report.color}-50 to-${report.color}-100 rounded-lg p-6 border border-${report.color}-200 hover:shadow-lg transition-shadow cursor-pointer`}>
                      <Icon className={`w-8 h-8 text-${report.color}-600 mb-3`} />
                      <h3 className="font-semibold text-gray-900 mb-2">{report.name}</h3>
                      <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        <Download className="w-4 h-4" />
                        Generate Report
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
