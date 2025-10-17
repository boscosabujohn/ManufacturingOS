'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Download,
  DollarSign,
  Calendar,
  User,
  Building2,
  Briefcase,
  Mail,
  Phone,
  TrendingUp,
  TrendingDown,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Receipt,
  Banknote,
  Wallet,
  CreditCard,
} from 'lucide-react';

interface PayrollEntry {
  id: string;
  payrollNumber: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  payPeriod: string;
  payDate: string;
  status: 'draft' | 'processed' | 'paid' | 'cancelled';
  basicSalary: number;
  hra: number;
  transportAllowance: number;
  medicalAllowance: number;
  specialAllowance: number;
  otherAllowances: number;
  providentFund: number;
  professionalTax: number;
  incomeTax: number;
  esi: number;
  loans: number;
  otherDeductions: number;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  workingDays: number;
  presentDays: number;
  leaveDays: number;
  overtimeHours: number;
  overtimePay: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  panNumber: string;
  uanNumber: string;
  processedBy: string;
  processedDate: string;
  paidDate: string;
  remarks: string;
}

interface Activity {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

export default function ViewPayrollPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'attendance' | 'activity'>('overview');

  // Mock data - replace with API call
  const payroll: PayrollEntry = {
    id: params.id,
    payrollNumber: 'PAY-2025-0001',
    employeeId: 'B3-0001',
    employeeName: 'Rajesh Kumar',
    department: 'Production',
    position: 'Production Supervisor',
    email: 'rajesh.kumar@b3erp.com',
    phone: '+91 98765 43210',
    payPeriod: 'October 2025',
    payDate: '2025-10-30',
    status: 'paid',
    basicSalary: 45000,
    hra: 18000,
    transportAllowance: 3000,
    medicalAllowance: 2500,
    specialAllowance: 5000,
    otherAllowances: 1500,
    providentFund: 5400,
    professionalTax: 200,
    incomeTax: 4500,
    esi: 675,
    loans: 2000,
    otherDeductions: 500,
    grossSalary: 75000,
    totalDeductions: 13275,
    netSalary: 61725,
    workingDays: 26,
    presentDays: 24,
    leaveDays: 2,
    overtimeHours: 8,
    overtimePay: 2000,
    bankName: 'HDFC Bank',
    accountNumber: '50100123456789',
    ifscCode: 'HDFC0001234',
    panNumber: 'ABCDE1234F',
    uanNumber: '101234567890',
    processedBy: 'Sunita Reddy',
    processedDate: '2025-10-28',
    paidDate: '2025-10-30',
    remarks: 'Salary processed successfully for October 2025',
  };

  const activities: Activity[] = [
    {
      id: '1',
      action: 'Payroll Paid',
      user: 'Sunita Reddy',
      timestamp: '2025-10-30 10:30 AM',
      details: 'Salary paid via bank transfer',
    },
    {
      id: '2',
      action: 'Payroll Processed',
      user: 'Sunita Reddy',
      timestamp: '2025-10-28 03:45 PM',
      details: 'Payroll processed and approved for payment',
    },
    {
      id: '3',
      action: 'Payroll Created',
      user: 'Vikram Singh',
      timestamp: '2025-10-25 11:15 AM',
      details: 'Payroll entry created for October 2025',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'processed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleDownloadPayslip = () => {
    alert('Downloading payslip PDF...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{payroll.payrollNumber}</h1>
              <p className="text-gray-600 mt-1">{payroll.payPeriod} Payroll</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadPayslip}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Payslip
            </button>
            <button
              onClick={() => router.push(`/hr/payroll/edit/${params.id}`)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Wallet className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-2xl font-bold">₹{payroll.grossSalary.toLocaleString('en-IN')}</div>
            <div className="text-blue-100 text-sm mt-1">Gross Salary</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-2xl font-bold">₹{payroll.totalDeductions.toLocaleString('en-IN')}</div>
            <div className="text-red-100 text-sm mt-1">Total Deductions</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Banknote className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-2xl font-bold">₹{payroll.netSalary.toLocaleString('en-IN')}</div>
            <div className="text-green-100 text-sm mt-1">Net Salary</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-2xl font-bold">{payroll.presentDays}/{payroll.workingDays}</div>
            <div className="text-purple-100 text-sm mt-1">Days Worked</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-2xl font-bold">{new Date(payroll.payDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
            <div className="text-orange-100 text-sm mt-1">Payment Date</div>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`px-4 py-3 rounded-lg border mb-6 ${getStatusColor(payroll.status)}`}>
          <div className="flex items-center gap-2">
            {payroll.status === 'paid' && <CheckCircle2 className="w-5 h-5" />}
            {payroll.status === 'cancelled' && <XCircle className="w-5 h-5" />}
            <span className="font-semibold">
              Status: {payroll.status.charAt(0).toUpperCase() + payroll.status.slice(1)}
            </span>
            {payroll.status === 'paid' && (
              <span className="ml-auto text-sm">
                Paid on {new Date(payroll.paidDate).toLocaleDateString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('breakdown')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'breakdown'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Salary Breakdown
              </button>
              <button
                onClick={() => setActiveTab('attendance')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'attendance'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Attendance
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'activity'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Activity
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Employee Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Employee Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-600">Employee ID</label>
                      <p className="font-semibold text-gray-900">{payroll.employeeId}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Employee Name</label>
                      <p className="font-semibold text-gray-900">{payroll.employeeName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Department</label>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        {payroll.department}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Position</label>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        {payroll.position}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {payroll.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {payroll.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payroll Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-blue-600" />
                    Payroll Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-600">Pay Period</label>
                      <p className="font-semibold text-gray-900">{payroll.payPeriod}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Payment Date</label>
                      <p className="font-semibold text-gray-900">
                        {new Date(payroll.payDate).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Processed By</label>
                      <p className="font-semibold text-gray-900">{payroll.processedBy}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Processed Date</label>
                      <p className="font-semibold text-gray-900">
                        {new Date(payroll.processedDate).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Bank Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-600">Bank Name</label>
                      <p className="font-semibold text-gray-900">{payroll.bankName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Account Number</label>
                      <p className="font-semibold text-gray-900">{payroll.accountNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">IFSC Code</label>
                      <p className="font-semibold text-gray-900">{payroll.ifscCode}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">PAN Number</label>
                      <p className="font-semibold text-gray-900">{payroll.panNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">UAN Number</label>
                      <p className="font-semibold text-gray-900">{payroll.uanNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                {payroll.remarks && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Remarks
                    </h3>
                    <p className="text-gray-700">{payroll.remarks}</p>
                  </div>
                )}
              </div>
            )}

            {/* Salary Breakdown Tab */}
            {activeTab === 'breakdown' && (
              <div className="space-y-6">
                {/* Earnings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Earnings
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Basic Salary</span>
                      <span className="font-semibold text-gray-900">
                        ₹{payroll.basicSalary.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">House Rent Allowance (HRA)</span>
                      <span className="font-semibold text-gray-900">
                        ₹{payroll.hra.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Transport Allowance</span>
                      <span className="font-semibold text-gray-900">
                        ₹{payroll.transportAllowance.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Medical Allowance</span>
                      <span className="font-semibold text-gray-900">
                        ₹{payroll.medicalAllowance.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Special Allowance</span>
                      <span className="font-semibold text-gray-900">
                        ₹{payroll.specialAllowance.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Overtime Pay ({payroll.overtimeHours} hrs)</span>
                      <span className="font-semibold text-gray-900">
                        ₹{payroll.overtimePay.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Other Allowances</span>
                      <span className="font-semibold text-gray-900">
                        ₹{payroll.otherAllowances.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg">
                      <span className="font-semibold text-green-900">Total Earnings</span>
                      <span className="font-bold text-green-900 text-lg">
                        ₹{payroll.grossSalary.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    Deductions
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Provident Fund (PF)</span>
                      <span className="font-semibold text-gray-900">
                        ₹{payroll.providentFund.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Professional Tax</span>
                      <span className="font-semibold text-gray-900">
                        ₹{payroll.professionalTax.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Income Tax (TDS)</span>
                      <span className="font-semibold text-gray-900">
                        ₹{payroll.incomeTax.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">ESI</span>
                      <span className="font-semibold text-gray-900">
                        ₹{payroll.esi.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Loan Repayment</span>
                      <span className="font-semibold text-gray-900">
                        ₹{payroll.loans.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Other Deductions</span>
                      <span className="font-semibold text-gray-900">
                        ₹{payroll.otherDeductions.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg">
                      <span className="font-semibold text-red-900">Total Deductions</span>
                      <span className="font-bold text-red-900 text-lg">
                        ₹{payroll.totalDeductions.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Net Salary */}
                <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-blue-100 mb-1">Net Salary</p>
                      <p className="text-3xl font-bold">₹{payroll.netSalary.toLocaleString('en-IN')}</p>
                    </div>
                    <Banknote className="w-16 h-16 opacity-50" />
                  </div>
                </div>
              </div>
            )}

            {/* Attendance Tab */}
            {activeTab === 'attendance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-700 font-medium">Total Working Days</span>
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-blue-900">{payroll.workingDays}</p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-700 font-medium">Present Days</span>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-900">{payroll.presentDays}</p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-yellow-700 font-medium">Leave Days</span>
                      <XCircle className="w-5 h-5 text-yellow-600" />
                    </div>
                    <p className="text-3xl font-bold text-yellow-900">{payroll.leaveDays}</p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-700 font-medium">Overtime Hours</span>
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold text-purple-900">{payroll.overtimeHours} hrs</p>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Attendance Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attendance Rate</span>
                      <span className="font-semibold text-gray-900">
                        {((payroll.presentDays / payroll.workingDays) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Overtime Pay Rate</span>
                      <span className="font-semibold text-gray-900">
                        ₹{(payroll.overtimePay / payroll.overtimeHours).toFixed(2)}/hr
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Per Day Salary</span>
                      <span className="font-semibold text-gray-900">
                        ₹{(payroll.basicSalary / payroll.workingDays).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      {index < activities.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gray-300 mt-2" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{activity.action}</h4>
                        <span className="text-sm text-gray-500">{activity.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{activity.details}</p>
                      <p className="text-sm text-gray-500">by {activity.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
