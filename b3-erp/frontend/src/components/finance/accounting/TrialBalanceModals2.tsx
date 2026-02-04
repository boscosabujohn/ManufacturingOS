'use client';

import React, { useState } from 'react';
import { X, Mail, Calendar, TrendingUp, AlertCircle, Settings, BarChart2, RefreshCw } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// ============================================================================
// 7. TRIAL BALANCE ANALYTICS MODAL (Indigo Gradient)
// ============================================================================
interface TrialBalanceAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrialBalanceAnalyticsModal({ isOpen, onClose }: TrialBalanceAnalyticsModalProps) {
  if (!isOpen) return null;

  const accountTypeData = [
    { name: 'Assets', value: 2850000, color: '#3b82f6' },
    { name: 'Liabilities', value: 1250000, color: '#ef4444' },
    { name: 'Equity', value: 1000000, color: '#10b981' },
    { name: 'Revenue', value: 850000, color: '#8b5cf6' },
    { name: 'Expenses', value: 450000, color: '#f59e0b' }
  ];

  const trendData = [
    { month: 'Jul', assets: 2600000, liabilities: 1100000, equity: 950000 },
    { month: 'Aug', assets: 2700000, liabilities: 1150000, equity: 975000 },
    { month: 'Sep', assets: 2750000, liabilities: 1200000, equity: 980000 },
    { month: 'Oct', assets: 2800000, liabilities: 1220000, equity: 990000 },
    { month: 'Nov', assets: 2825000, liabilities: 1235000, equity: 995000 },
    { month: 'Dec', assets: 2850000, liabilities: 1250000, equity: 1000000 }
  ];

  const topAccounts = [
    { code: '1002', name: 'Bank Account - HDFC', balance: 1250000, type: 'Asset' },
    { code: '1100', name: 'Accounts Receivable', balance: 650000, type: 'Asset' },
    { code: '2001', name: 'Accounts Payable', balance: 425000, type: 'Liability' },
    { code: '4001', name: 'Sales Revenue', balance: 850000, type: 'Revenue' },
    { code: '5001', name: 'Cost of Goods Sold', balance: 450000, type: 'Expense' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full  max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Trial Balance Analytics</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600 mb-1">Total Assets</div>
              <div className="text-2xl font-bold text-blue-900">₹2.85M</div>
              <div className="text-xs text-blue-700 mt-1">↑ 8.5% vs last month</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg border border-red-200">
              <div className="text-sm text-red-600 mb-1">Total Liabilities</div>
              <div className="text-2xl font-bold text-red-900">₹1.25M</div>
              <div className="text-xs text-red-700 mt-1">↑ 3.2% vs last month</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
              <div className="text-sm text-green-600 mb-1">Total Equity</div>
              <div className="text-2xl font-bold text-green-900">₹1.00M</div>
              <div className="text-xs text-green-700 mt-1">↑ 1.5% vs last month</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
              <div className="text-sm text-purple-600 mb-1">Net Position</div>
              <div className="text-2xl font-bold text-purple-900">₹1.60M</div>
              <div className="text-xs text-purple-700 mt-1">Assets - Liabilities</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
            {/* Account Type Distribution */}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Type Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={accountTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {accountTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `₹${(value / 1000).toFixed(0)}K`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 6-Month Trend */}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">6-Month Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => `₹${(value / 1000).toFixed(0)}K`} />
                  <Legend />
                  <Line type="monotone" dataKey="assets" stroke="#3b82f6" strokeWidth={2} name="Assets" />
                  <Line type="monotone" dataKey="liabilities" stroke="#ef4444" strokeWidth={2} name="Liabilities" />
                  <Line type="monotone" dataKey="equity" stroke="#10b981" strokeWidth={2} name="Equity" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Accounts by Balance */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Accounts by Balance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Account Code</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Account Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Balance</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">% of Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topAccounts.map((account) => (
                    <tr key={account.code} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-sm text-gray-900">{account.code}</td>
                      <td className="px-4 py-3 text-gray-900">{account.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          account.type === 'Asset' ? 'bg-blue-100 text-blue-700' :
                          account.type === 'Liability' ? 'bg-red-100 text-red-700' :
                          account.type === 'Revenue' ? 'bg-purple-100 text-purple-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {account.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        ₹{account.balance.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {account.type === 'Asset' ? ((account.balance / 2850000) * 100).toFixed(1) :
                         account.type === 'Liability' ? ((account.balance / 1250000) * 100).toFixed(1) :
                         account.type === 'Revenue' ? ((account.balance / 850000) * 100).toFixed(1) :
                         ((account.balance / 450000) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. EMAIL TRIAL BALANCE MODAL (Cyan Gradient)
// ============================================================================
interface EmailTrialBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend?: (data: any) => void;
}

export function EmailTrialBalanceModal({ isOpen, onClose, onSend }: EmailTrialBalanceModalProps) {
  const [recipients, setRecipients] = useState<string[]>(['finance@company.com']);
  const [ccRecipients, setCcRecipients] = useState<string[]>([]);
  const [subject, setSubject] = useState('Trial Balance Report - January 2025');
  const [message, setMessage] = useState('Please find attached the Trial Balance report for January 2025.');
  const [format, setFormat] = useState('pdf');
  const [includeAttachments, setIncludeAttachments] = useState(true);

  const handleSend = () => {
    console.log('Sending email:', { recipients, ccRecipients, subject, message, format, includeAttachments });
    onSend?.({ recipients, ccRecipients, subject, message, format, includeAttachments });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Email Trial Balance</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Recipients */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">To *</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {recipients.map((email, index) => (
                <span key={index} className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm flex items-center gap-2">
                  {email}
                  <button
                    onClick={() => setRecipients(recipients.filter((_, i) => i !== index))}
                    className="text-cyan-600 hover:text-cyan-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="email"
              placeholder="Add recipient email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  setRecipients([...recipients, e.currentTarget.value]);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>

          {/* CC Recipients */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">CC (Optional)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {ccRecipients.map((email, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2">
                  {email}
                  <button
                    onClick={() => setCcRecipients(ccRecipients.filter((_, i) => i !== index))}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="email"
              placeholder="Add CC recipient..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  setCcRecipients([...ccRecipients, e.currentTarget.value]);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>

          {/* Subject */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {/* Message */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {/* Attachment Format */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Attachment Format</label>
            <div className="grid grid-cols-3 gap-3">
              {['pdf', 'excel', 'csv'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    format === fmt
                      ? 'bg-cyan-50 border-cyan-300 text-cyan-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="mb-3">
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={includeAttachments}
                onChange={(e) => setIncludeAttachments(e.target.checked)}
                className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Include Trial Balance as attachment</span>
                <p className="text-xs text-gray-500">Attach the full report in selected format</p>
              </div>
            </label>
          </div>

          {/* Preview */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
            <h4 className="text-cyan-800 font-medium mb-2">📧 Email Preview</h4>
            <div className="text-sm text-cyan-700 space-y-1">
              <p>• Recipients: {recipients.length}</p>
              <p>• CC: {ccRecipients.length}</p>
              <p>• Attachment: Trial_Balance_Jan_2025.{format}</p>
              <p>• Estimated size: ~250 KB</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={recipients.length === 0 || !subject}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 9. SCHEDULE TRIAL BALANCE REPORT MODAL (Green Gradient)
// ============================================================================
interface ScheduleTrialBalanceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule?: (data: any) => void;
}

export function ScheduleTrialBalanceReportModal({ isOpen, onClose, onSchedule }: ScheduleTrialBalanceReportModalProps) {
  const [frequency, setFrequency] = useState('monthly');
  const [dayOfMonth, setDayOfMonth] = useState('1');
  const [recipients, setRecipients] = useState<string[]>(['finance@company.com']);
  const [format, setFormat] = useState('pdf');
  const [isActive, setIsActive] = useState(true);

  const handleSchedule = () => {
    console.log('Scheduling report:', { frequency, dayOfMonth, recipients, format, isActive });
    onSchedule?.({ frequency, dayOfMonth, recipients, format, isActive });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Schedule Trial Balance Report</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Frequency */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">Frequency *</label>
            <div className="grid grid-cols-4 gap-3">
              {['daily', 'weekly', 'monthly', 'quarterly'].map((freq) => (
                <button
                  key={freq}
                  onClick={() => setFrequency(freq)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    frequency === freq
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Day Selection */}
          {frequency === 'monthly' && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Day of Month</label>
              <select
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="1">1st day of month</option>
                <option value="15">15th day of month</option>
                <option value="last">Last day of month</option>
              </select>
            </div>
          )}

          {/* Recipients */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipients *</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {recipients.map((email, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2">
                  {email}
                  <button
                    onClick={() => setRecipients(recipients.filter((_, i) => i !== index))}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="email"
              placeholder="Add recipient..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  setRecipients([...recipients, e.currentTarget.value]);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>

          {/* Format */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Format</label>
            <div className="grid grid-cols-3 gap-3">
              {['pdf', 'excel', 'csv'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    format === fmt
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="mb-3">
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Active schedule</span>
                <p className="text-xs text-gray-500">Reports will be sent automatically based on the schedule</p>
              </div>
            </label>
          </div>

          {/* Schedule Preview */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h4 className="text-green-800 font-medium mb-3">📅 Schedule Preview</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Frequency: {frequency.charAt(0).toUpperCase() + frequency.slice(1)}</li>
              {frequency === 'monthly' && <li>• Delivery: {dayOfMonth === 'last' ? 'Last day' : `${dayOfMonth}${dayOfMonth === '1' ? 'st' : 'th'} day`} of each month</li>}
              <li>• Recipients: {recipients.length} email{recipients.length !== 1 ? 's' : ''}</li>
              <li>• Format: {format.toUpperCase()}</li>
              <li>• Next scheduled run: {frequency === 'monthly' && dayOfMonth === '1' ? 'Feb 1, 2025' : 'Feb 15, 2025'}</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 rounded-b-xl flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            disabled={recipients.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Create Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 10. TRIAL BALANCE VARIANCE ANALYSIS MODAL (Orange Gradient)
// ============================================================================
interface TrialBalanceVarianceAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrialBalanceVarianceAnalysisModal({ isOpen, onClose }: TrialBalanceVarianceAnalysisModalProps) {
  const [threshold, setThreshold] = useState('10');

  if (!isOpen) return null;

  const variances = [
    {
      accountCode: '1100',
      accountName: 'Accounts Receivable',
      expected: 720000,
      actual: 650000,
      variance: -70000,
      variancePercent: -9.72,
      status: 'concern'
    },
    {
      accountCode: '2001',
      accountName: 'Accounts Payable',
      expected: 380000,
      actual: 425000,
      variance: 45000,
      variancePercent: 11.84,
      status: 'warning'
    },
    {
      accountCode: '1001',
      accountName: 'Cash in Hand',
      expected: 245000,
      actual: 285000,
      variance: 40000,
      variancePercent: 16.33,
      status: 'warning'
    },
    {
      accountCode: '1002',
      accountName: 'Bank Account - HDFC',
      expected: 1180000,
      actual: 1250000,
      variance: 70000,
      variancePercent: 5.93,
      status: 'ok'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full  max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Variance Analysis</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Controls */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variance Threshold (%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="50"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="flex-1"
              />
              <span className="text-lg font-semibold text-gray-900 w-16">{threshold}%</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Show accounts with variance greater than {threshold}%
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg border border-red-200">
              <div className="text-sm text-red-600 mb-1">Significant Concerns</div>
              <div className="text-2xl font-bold text-red-900">2</div>
              <div className="text-xs text-red-700 mt-1">Variance &gt; 10%</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-lg border border-yellow-200">
              <div className="text-sm text-yellow-600 mb-1">Warnings</div>
              <div className="text-2xl font-bold text-yellow-900">2</div>
              <div className="text-xs text-yellow-700 mt-1">Variance 5-10%</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
              <div className="text-sm text-green-600 mb-1">Within Tolerance</div>
              <div className="text-2xl font-bold text-green-900">230</div>
              <div className="text-xs text-green-700 mt-1">Variance &lt; 5%</div>
            </div>
          </div>

          {/* Variance Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Account Code</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Account Name</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Expected</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actual</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Variance</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {variances.map((variance) => (
                    <tr key={variance.accountCode} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {variance.status === 'concern' && (
                          <span className="flex items-center gap-1 text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">High</span>
                          </span>
                        )}
                        {variance.status === 'warning' && (
                          <span className="flex items-center gap-1 text-yellow-600">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">Med</span>
                          </span>
                        )}
                        {variance.status === 'ok' && (
                          <span className="flex items-center gap-1 text-green-600">
                            <span className="text-xs font-medium">Low</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-gray-900">{variance.accountCode}</td>
                      <td className="px-4 py-3 text-gray-900">{variance.accountName}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        ₹{variance.expected.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        ₹{variance.actual.toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${
                        variance.variance > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {variance.variance > 0 ? '+' : ''}₹{variance.variance.toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${
                        Math.abs(variance.variancePercent) > 10 ? 'text-red-600' :
                        Math.abs(variance.variancePercent) > 5 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {variance.variancePercent > 0 ? '+' : ''}{variance.variancePercent}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Analysis Notes */}
          <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-3">
            <h4 className="text-orange-800 font-medium mb-3">📊 Analysis Summary</h4>
            <ul className="text-sm text-orange-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-semibold">Accounts Receivable:</span>
                <span>Down 9.72% - May indicate collection issues or reduced sales</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">Accounts Payable:</span>
                <span>Up 11.84% - Could indicate delayed payments or increased purchasing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">Cash in Hand:</span>
                <span>Up 16.33% - Positive liquidity position, but may be holding excess cash</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 flex gap-3 justify-end">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Export Analysis
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 11. TRIAL BALANCE SETTINGS MODAL (Slate Gradient)
// ============================================================================
interface TrialBalanceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (settings: any) => void;
}

export function TrialBalanceSettingsModal({ isOpen, onClose, onSave }: TrialBalanceSettingsModalProps) {
  const [defaultPeriod, setDefaultPeriod] = useState('current_month');
  const [showZeroBalances, setShowZeroBalances] = useState(false);
  const [groupBy, setGroupBy] = useState('type');
  const [sortBy, setSortBy] = useState('code');
  const [decimalPlaces, setDecimalPlaces] = useState('2');
  const [currencyDisplay, setCurrencyDisplay] = useState('symbol');

  const handleSave = () => {
    const settings = {
      defaultPeriod,
      showZeroBalances,
      groupBy,
      sortBy,
      decimalPlaces,
      currencyDisplay
    };
    console.log('Saving settings:', settings);
    onSave?.(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Trial Balance Settings</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Default Period */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Period</label>
            <select
              value={defaultPeriod}
              onChange={(e) => setDefaultPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            >
              <option value="current_month">Current Month</option>
              <option value="current_quarter">Current Quarter</option>
              <option value="current_year">Current Year</option>
              <option value="last_month">Last Month</option>
              <option value="ytd">Year to Date</option>
            </select>
          </div>

          {/* Display Options */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">Display Options</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={showZeroBalances}
                  onChange={(e) => setShowZeroBalances(e.target.checked)}
                  className="w-5 h-5 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
                />
                <span className="text-sm font-medium text-gray-700">Show accounts with zero balance</span>
              </label>
            </div>
          </div>

          {/* Grouping & Sorting */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group By</label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="none">No Grouping</option>
                <option value="type">Account Type</option>
                <option value="category">Category</option>
                <option value="parent">Parent Account</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="code">Account Code</option>
                <option value="name">Account Name</option>
                <option value="balance">Balance</option>
                <option value="type">Account Type</option>
              </select>
            </div>
          </div>

          {/* Number Formatting */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Decimal Places</label>
              <select
                value={decimalPlaces}
                onChange={(e) => setDecimalPlaces(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="0">0 (₹1,234)</option>
                <option value="2">2 (₹1,234.56)</option>
                <option value="3">3 (₹1,234.567)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency Display</label>
              <select
                value={currencyDisplay}
                onChange={(e) => setCurrencyDisplay(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="symbol">Symbol (₹)</option>
                <option value="code">Code (INR)</option>
                <option value="both">Both (INR ₹)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 rounded-b-xl flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 12. REFRESH TRIAL BALANCE MODAL (Teal Gradient)
// ============================================================================
interface RefreshTrialBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export function RefreshTrialBalanceModal({ isOpen, onClose, onRefresh }: RefreshTrialBalanceModalProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    console.log('Refreshing trial balance...');

    // Simulate refresh process
    setTimeout(() => {
      setIsRefreshing(false);
      onRefresh?.();
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-3 py-2 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Refresh Trial Balance</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white" disabled={isRefreshing}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isRefreshing ? (
            <>
              <p className="text-gray-700 mb-2">
                This will recalculate all account balances from the general ledger and update the trial balance.
              </p>
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-2">
                <h4 className="text-teal-800 font-medium mb-2">🔄 Refresh Process</h4>
                <ul className="text-sm text-teal-700 space-y-1">
                  <li>• Recalculate opening balances</li>
                  <li>• Sum all debits and credits</li>
                  <li>• Calculate closing balances</li>
                  <li>• Verify balance equality</li>
                  <li>• Update cached data</li>
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                Last refreshed: Today at 2:30 PM
              </p>
            </>
          ) : (
            <div className="py-8">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="w-12 h-12 text-teal-600 animate-spin" />
                <p className="text-gray-700 font-medium">Refreshing trial balance...</p>
                <p className="text-sm text-gray-600">Please wait while we recalculate all balances</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 rounded-b-xl flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isRefreshing}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
