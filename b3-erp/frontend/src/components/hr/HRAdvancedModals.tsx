'use client';

import React, { useState } from 'react';
import { X, Plus, DollarSign, Calendar, Users, FileText, Award, Target, BookOpen, CheckCircle, AlertCircle, TrendingUp, Shield } from 'lucide-react';

// =============================================
// ADVANCED PAYROLL MODALS
// =============================================

export function CreatePayrollRunModal({ isOpen, onClose, onSubmit }: any) {
  const [formData, setFormData] = useState({
    payrollCycle: 'monthly',
    payPeriodStart: '',
    payPeriodEnd: '',
    paymentDate: '',
    department: 'all',
    employeeType: 'all',
    includeBonus: false,
    includeOvertime: true
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2 flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Create New Payroll Run
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-6 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payroll Cycle</label>
              <select
                value={formData.payrollCycle}
                onChange={(e) => setFormData({ ...formData, payrollCycle: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Departments</option>
                <option value="engineering">Engineering</option>
                <option value="sales">Sales</option>
                <option value="hr">HR</option>
                <option value="finance">Finance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pay Period Start</label>
              <input
                type="date"
                value={formData.payPeriodStart}
                onChange={(e) => setFormData({ ...formData, payPeriodStart: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pay Period End</label>
              <input
                type="date"
                value={formData.payPeriodEnd}
                onChange={(e) => setFormData({ ...formData, payPeriodEnd: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
            <input
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.includeBonus}
                onChange={(e) => setFormData({ ...formData, includeBonus: e.target.checked })}
                className="w-4 h-4 text-purple-600"
              />
              <span className="text-sm text-gray-700">Include Bonus Payments</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.includeOvertime}
                onChange={(e) => setFormData({ ...formData, includeOvertime: e.target.checked })}
                className="w-4 h-4 text-purple-600"
              />
              <span className="text-sm text-gray-700">Include Overtime</span>
            </label>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-sm text-purple-800"><strong>Note:</strong> Payroll will be calculated based on employee attendance, statutory deductions, and tax configurations.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Create Payroll Run
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ProcessPayrollModal({ isOpen, onClose, payrollRun, onConfirm }: any) {
  if (!isOpen || !payrollRun) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Process Payroll
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
            <p className="font-semibold text-gray-900 mb-2">Payroll Run Details:</p>
            <div className="space-y-1 text-sm text-gray-700">
              <p><strong>Period:</strong> {payrollRun.period}</p>
              <p><strong>Employees:</strong> {payrollRun.employeeCount}</p>
              <p><strong>Gross Amount:</strong> ₹{payrollRun.grossAmount?.toLocaleString()}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-2">
            This will process the payroll, generate payslips, and prepare payment files. This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={() => { onConfirm(payrollRun); onClose(); }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Process Payroll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GeneratePayrollReportModal({ isOpen, onClose, onGenerate }: any) {
  const [formData, setFormData] = useState({
    reportType: 'summary',
    period: 'current',
    format: 'pdf',
    includeDetails: true
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Payroll Report
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onGenerate(formData); }} className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={formData.reportType}
              onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="summary">Payroll Summary</option>
              <option value="detailed">Detailed Breakdown</option>
              <option value="statutory">Statutory Compliance</option>
              <option value="tax">Tax Deductions</option>
              <option value="department">Department-wise</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
            <select
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="current">Current Month</option>
              <option value="previous">Previous Month</option>
              <option value="quarter">Current Quarter</option>
              <option value="year">Current Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <select
              value={formData.format}
              onChange={(e) => setFormData({ ...formData, format: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel (XLSX)</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.includeDetails}
              onChange={(e) => setFormData({ ...formData, includeDetails: e.target.checked })}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">Include employee-level details</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Generate Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =============================================
// COMPLIANCE TRACKING MODALS
// =============================================

export function AddComplianceRuleModal({ isOpen, onClose, onSubmit }: any) {
  const [formData, setFormData] = useState({
    ruleName: '',
    category: 'labor',
    description: '',
    frequency: 'monthly',
    dueDate: '',
    responsibility: '',
    priority: 'medium'
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Add Compliance Rule
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
            <input
              type="text"
              value={formData.ruleName}
              onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., PF Contribution Filing"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="labor">Labor Law</option>
                <option value="tax">Tax Compliance</option>
                <option value="statutory">Statutory</option>
                <option value="safety">Safety & Health</option>
                <option value="environmental">Environmental</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Describe the compliance requirement..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsibility (Person/Department)</label>
            <input
              type="text"
              value={formData.responsibility}
              onChange={(e) => setFormData({ ...formData, responsibility: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., HR Department"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Add Compliance Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =============================================
// TALENT ANALYTICS MODALS
// =============================================

export function CreateAnalyticsReportModal({ isOpen, onClose, onGenerate }: any) {
  const [formData, setFormData] = useState({
    reportType: 'turnover',
    dateRange: 'quarter',
    departments: [] as string[],
    includeCharts: true,
    includeRecommendations: true
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Create Analytics Report
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onGenerate(formData); }} className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={formData.reportType}
              onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="turnover">Employee Turnover Analysis</option>
              <option value="diversity">Diversity & Inclusion Metrics</option>
              <option value="performance">Performance Trends</option>
              <option value="engagement">Employee Engagement</option>
              <option value="skills">Skills Gap Analysis</option>
              <option value="compensation">Compensation Benchmarking</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={formData.dateRange}
              onChange={(e) => setFormData({ ...formData, dateRange: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="ytd">Year to Date</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.includeCharts}
                onChange={(e) => setFormData({ ...formData, includeCharts: e.target.checked })}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="text-sm text-gray-700">Include Visual Charts & Graphs</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.includeRecommendations}
                onChange={(e) => setFormData({ ...formData, includeRecommendations: e.target.checked })}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="text-sm text-gray-700">Include AI-Powered Recommendations</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Generate Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =============================================
// ONBOARDING WORKFLOW MODALS
// =============================================

export function CreateOnboardingWorkflowModal({ isOpen, onClose, onSubmit }: any) {
  const [formData, setFormData] = useState({
    templateName: '',
    department: 'engineering',
    duration: '30',
    tasks: [] as any[]
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            Create Onboarding Workflow
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Workflow Template Name</label>
            <input
              type="text"
              value={formData.templateName}
              onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., Software Engineer Onboarding"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              >
                <option value="engineering">Engineering</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
                <option value="hr">HR</option>
                <option value="finance">Finance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                min="1"
                max="180"
              />
            </div>
          </div>

          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
            <p className="text-sm text-cyan-800 mb-2"><strong>Default Tasks Included:</strong></p>
            <ul className="text-sm text-cyan-700 space-y-1 list-disc list-inside">
              <li>Complete documentation & contracts</li>
              <li>IT equipment setup & system access</li>
              <li>Department orientation & team introductions</li>
              <li>Training modules & certifications</li>
              <li>30/60/90 day check-ins</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
              Create Workflow
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =============================================
// PERFORMANCE REVIEW MODALS
// =============================================

export function InitiateReviewCycleModal({ isOpen, onClose, onSubmit }: any) {
  const [formData, setFormData] = useState({
    cycleName: '',
    reviewType: 'annual',
    startDate: '',
    endDate: '',
    selfReview: true,
    peerReview: false,
    managerReview: true,
    includeGoals: true
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="h-5 w-5" />
            Initiate Review Cycle
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review Cycle Name</label>
            <input
              type="text"
              value={formData.cycleName}
              onChange={(e) => setFormData({ ...formData, cycleName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
              placeholder="e.g., Q1 2025 Performance Review"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review Type</label>
              <select
                value={formData.reviewType}
                onChange={(e) => setFormData({ ...formData, reviewType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="annual">Annual Review</option>
                <option value="semi-annual">Semi-Annual Review</option>
                <option value="quarterly">Quarterly Review</option>
                <option value="probation">Probation Review</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 mb-2">Review Components:</p>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.selfReview}
                onChange={(e) => setFormData({ ...formData, selfReview: e.target.checked })}
                className="w-4 h-4 text-amber-600"
              />
              <span className="text-sm text-gray-700">Self Review</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.peerReview}
                onChange={(e) => setFormData({ ...formData, peerReview: e.target.checked })}
                className="w-4 h-4 text-amber-600"
              />
              <span className="text-sm text-gray-700">Peer Review (360°)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.managerReview}
                onChange={(e) => setFormData({ ...formData, managerReview: e.target.checked })}
                className="w-4 h-4 text-amber-600"
              />
              <span className="text-sm text-gray-700">Manager Review</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.includeGoals}
                onChange={(e) => setFormData({ ...formData, includeGoals: e.target.checked })}
                className="w-4 h-4 text-amber-600"
              />
              <span className="text-sm text-gray-700">Include Goal Setting</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
              Initiate Review Cycle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =============================================
// POLICY MANAGEMENT MODALS
// =============================================

export function CreatePolicyModal({ isOpen, onClose, onSubmit }: any) {
  const [formData, setFormData] = useState({
    policyName: '',
    category: 'hr',
    effectiveDate: '',
    description: '',
    acknowledgementRequired: true,
    applicableTo: 'all'
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-3 py-2 flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Create New Policy
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Policy Name</label>
            <input
              type="text"
              value={formData.policyName}
              onChange={(e) => setFormData({ ...formData, policyName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500"
              placeholder="e.g., Remote Work Policy"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500"
              >
                <option value="hr">HR Policies</option>
                <option value="it">IT & Security</option>
                <option value="compliance">Compliance</option>
                <option value="safety">Safety</option>
                <option value="ethics">Ethics & Conduct</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
              <input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Policy Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500"
              placeholder="Enter the policy details..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Applicable To</label>
            <select
              value={formData.applicableTo}
              onChange={(e) => setFormData({ ...formData, applicableTo: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500"
            >
              <option value="all">All Employees</option>
              <option value="full-time">Full-time Only</option>
              <option value="contractors">Contractors Only</option>
              <option value="department">Specific Department</option>
            </select>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.acknowledgementRequired}
              onChange={(e) => setFormData({ ...formData, acknowledgementRequired: e.target.checked })}
              className="w-4 h-4 text-rose-600"
            />
            <span className="text-sm text-gray-700">Require employee acknowledgement</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">
              Create Policy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
