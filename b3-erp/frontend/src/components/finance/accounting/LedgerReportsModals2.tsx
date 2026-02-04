'use client';

import React, { useState } from 'react';
import { X, Calendar, Mail, Save, Clock, Copy, Star, FolderOpen, Share2, Bell } from 'lucide-react';

// ============================================================================
// 7. SCHEDULE REPORT MODAL (Cyan Gradient)
// ============================================================================
interface ScheduleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType?: string;
  onSchedule?: (data: any) => void;
}

export function ScheduleReportModal({ isOpen, onClose, reportType, onSchedule }: ScheduleReportModalProps) {
  const [scheduleName, setScheduleName] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [dayOfMonth, setDayOfMonth] = useState('1');
  const [dayOfWeek, setDayOfWeek] = useState('monday');
  const [time, setTime] = useState('09:00');
  const [recipients, setRecipients] = useState<string[]>(['finance@company.com']);
  const [format, setFormat] = useState('pdf');
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSchedule = () => {
    const schedule = {
      scheduleName,
      reportType,
      frequency,
      dayOfMonth,
      dayOfWeek,
      time,
      recipients,
      format,
      isActive,
      startDate,
      endDate
    };
    console.log('Creating schedule:', schedule);
    onSchedule?.(schedule);
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
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Schedule Report</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Schedule Name */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Name *</label>
            <input
              type="text"
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              placeholder="e.g., Monthly P&L Report"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {/* Report Type */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <input
              type="text"
              value={reportType || 'Profit & Loss Statement'}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

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
                      ? 'bg-cyan-50 border-cyan-300 text-cyan-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Details */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {frequency === 'weekly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Day of Week</label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                </select>
              </div>
            )}
            {frequency === 'monthly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Day of Month</label>
                <select
                  value={dayOfMonth}
                  onChange={(e) => setDayOfMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="1">1st day</option>
                  <option value="15">15th day</option>
                  <option value="last">Last day</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Recipients */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipients *</label>
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
              placeholder="Add recipient..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                      ? 'bg-cyan-50 border-cyan-300 text-cyan-700'
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
                className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Active schedule</span>
                <p className="text-xs text-gray-500">Reports will be sent automatically</p>
              </div>
            </label>
          </div>

          {/* Preview */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
            <h4 className="text-cyan-800 font-medium mb-3">📅 Schedule Summary</h4>
            <ul className="text-sm text-cyan-700 space-y-1">
              <li>• Frequency: {frequency.charAt(0).toUpperCase() + frequency.slice(1)}</li>
              {frequency === 'weekly' && <li>• Every {dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}</li>}
              {frequency === 'monthly' && <li>• On {dayOfMonth === 'last' ? 'last day' : `${dayOfMonth}${dayOfMonth === '1' ? 'st' : 'th'} day`} of month</li>}
              <li>• Time: {time}</li>
              <li>• Recipients: {recipients.length}</li>
              <li>• Format: {format.toUpperCase()}</li>
              <li>• Next run: {startDate || 'Not set'} at {time}</li>
            </ul>
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
            onClick={handleSchedule}
            disabled={!scheduleName || recipients.length === 0 || !startDate}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Create Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. EMAIL REPORT MODAL (Green Gradient)
// ============================================================================
interface EmailReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportName?: string;
  onSend?: (data: any) => void;
}

export function EmailReportModal({ isOpen, onClose, reportName, onSend }: EmailReportModalProps) {
  const [recipients, setRecipients] = useState<string[]>([]);
  const [ccRecipients, setCcRecipients] = useState<string[]>([]);
  const [subject, setSubject] = useState(`${reportName || 'Financial Report'} - ${new Date().toLocaleDateString()}`);
  const [message, setMessage] = useState('Please find attached the financial report.');
  const [format, setFormat] = useState('pdf');
  const [priority, setPriority] = useState('normal');

  const handleSend = () => {
    console.log('Sending email:', { recipients, ccRecipients, subject, message, format, priority });
    onSend?.({ recipients, ccRecipients, subject, message, format, priority });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Email Report</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* To Recipients */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">To *</label>
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
              placeholder="Add recipient email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Message */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Format & Priority */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachment Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h4 className="text-green-800 font-medium mb-2">📧 Email Preview</h4>
            <div className="text-sm text-green-700 space-y-1">
              <p>• To: {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}</p>
              <p>• CC: {ccRecipients.length} recipient{ccRecipients.length !== 1 ? 's' : ''}</p>
              <p>• Attachment: {reportName}.{format}</p>
              <p>• Priority: {priority.charAt(0).toUpperCase() + priority.slice(1)}</p>
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
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 9. SAVE REPORT TEMPLATE MODAL (Blue Gradient)
// ============================================================================
interface SaveReportTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportConfig?: any;
  onSave?: (data: any) => void;
}

export function SaveReportTemplateModal({ isOpen, onClose, reportConfig, onSave }: SaveReportTemplateModalProps) {
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('financial_statements');
  const [isPublic, setIsPublic] = useState(false);
  const [setAsDefault, setSetAsDefault] = useState(false);

  const handleSave = () => {
    const template = {
      templateName,
      description,
      category,
      isPublic,
      setAsDefault,
      config: reportConfig
    };
    console.log('Saving template:', template);
    onSave?.(template);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Save className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Save Report Template</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Template Name */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Template Name *</label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Monthly P&L - Detailed"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe the report configuration and when to use it..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="financial_statements">Financial Statements</option>
              <option value="management_reports">Management Reports</option>
              <option value="compliance">Compliance Reports</option>
              <option value="analysis">Analysis Reports</option>
              <option value="custom">Custom Reports</option>
            </select>
          </div>

          {/* Options */}
          <div className="mb-3 space-y-3">
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Share with organization</span>
                <p className="text-xs text-gray-500">Make this template available to other users</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={setAsDefault}
                onChange={(e) => setSetAsDefault(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Set as my default</span>
                <p className="text-xs text-gray-500">Use this template by default for this report type</p>
              </div>
            </label>
          </div>

          {/* Configuration Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-blue-800 font-medium mb-2">📋 Template Configuration</h4>
            <p className="text-sm text-blue-700">
              This template will save your current report settings including columns, filters, grouping, and formatting options.
            </p>
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
            disabled={!templateName}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 10. LOAD REPORT TEMPLATE MODAL (Purple Gradient)
// ============================================================================
interface LoadReportTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad?: (template: any) => void;
}

export function LoadReportTemplateModal({ isOpen, onClose, onLoad }: LoadReportTemplateModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const templates = [
    {
      id: 'T001',
      name: 'Monthly P&L - Detailed',
      description: 'Comprehensive profit & loss with departmental breakdown',
      category: 'financial_statements',
      createdBy: 'John Doe',
      lastUsed: '2025-01-30',
      isDefault: true,
      isPublic: true
    },
    {
      id: 'T002',
      name: 'Balance Sheet - Comparative',
      description: 'Year-over-year balance sheet comparison',
      category: 'financial_statements',
      createdBy: 'Jane Smith',
      lastUsed: '2025-01-28',
      isDefault: false,
      isPublic: true
    },
    {
      id: 'T003',
      name: 'Cash Flow - Direct Method',
      description: 'Cash flow statement using direct method',
      category: 'financial_statements',
      createdBy: 'You',
      lastUsed: '2025-01-25',
      isDefault: false,
      isPublic: false
    },
    {
      id: 'T004',
      name: 'Aged Receivables - 90 Days',
      description: 'Receivables aging with 30-day buckets',
      category: 'analysis',
      createdBy: 'You',
      lastUsed: '2025-01-20',
      isDefault: false,
      isPublic: false
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleLoad = (template: any) => {
    console.log('Loading template:', template);
    onLoad?.(template);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full  max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Load Report Template</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Search & Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="financial_statements">Financial Statements</option>
                <option value="management_reports">Management Reports</option>
                <option value="compliance">Compliance</option>
                <option value="analysis">Analysis</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          {/* Templates List */}
          <div className="space-y-3 max-h-[calc(90vh-16rem)] overflow-y-auto">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-3 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      {template.isDefault && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                          <Star className="w-3 h-3 fill-current" />
                          Default
                        </span>
                      )}
                      {template.isPublic && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                          Public
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                  <button
                    onClick={() => handleLoad(template)}
                    className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm ml-4"
                  >
                    Load
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>ID: {template.id}</span>
                  <span>Created by: {template.createdBy}</span>
                  <span>Last used: {template.lastUsed}</span>
                  <span className="capitalize">{template.category.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No templates found matching your criteria
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 11. DUPLICATE REPORT MODAL (Teal Gradient)
// ============================================================================
interface DuplicateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportName?: string;
  onDuplicate?: (data: any) => void;
}

export function DuplicateReportModal({ isOpen, onClose, reportName, onDuplicate }: DuplicateReportModalProps) {
  const [newName, setNewName] = useState(`${reportName} (Copy)`);
  const [copySchedules, setCopySchedules] = useState(false);
  const [copyRecipients, setCopyRecipients] = useState(true);
  const [makeActive, setMakeActive] = useState(true);

  const handleDuplicate = () => {
    console.log('Duplicating report:', { originalName: reportName, newName, copySchedules, copyRecipients, makeActive });
    onDuplicate?.({ originalName: reportName, newName, copySchedules, copyRecipients, makeActive });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-3 py-2 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Copy className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Duplicate Report</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-3">
            <p className="text-gray-700 mb-2">
              Duplicating: <span className="font-semibold">{reportName}</span>
            </p>
          </div>

          {/* New Name */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">New Report Name *</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Options */}
          <div className="mb-3 space-y-3">
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={copySchedules}
                onChange={(e) => setCopySchedules(e.target.checked)}
                className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Copy schedules</span>
                <p className="text-xs text-gray-500">Include automated report schedules</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={copyRecipients}
                onChange={(e) => setCopyRecipients(e.target.checked)}
                className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Copy recipients</span>
                <p className="text-xs text-gray-500">Include email distribution list</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={makeActive}
                onChange={(e) => setMakeActive(e.target.checked)}
                className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Make active</span>
                <p className="text-xs text-gray-500">Enable the duplicated report immediately</p>
              </div>
            </label>
          </div>

          {/* Info */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
            <h4 className="text-teal-800 font-medium mb-2">📋 What Will Be Copied</h4>
            <ul className="text-sm text-teal-700 space-y-1">
              <li>• Report configuration and parameters</li>
              <li>• Column selection and formatting</li>
              <li>• Filters and grouping settings</li>
              {copySchedules && <li>• Report schedules (as inactive)</li>}
              {copyRecipients && <li>• Distribution list</li>}
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
            onClick={handleDuplicate}
            disabled={!newName}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Duplicate Report
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 12. SHARE REPORT MODAL (Orange Gradient)
// ============================================================================
interface ShareReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportName?: string;
  onShare?: (data: any) => void;
}

export function ShareReportModal({ isOpen, onClose, reportName, onShare }: ShareReportModalProps) {
  const [shareWith, setShareWith] = useState<string[]>([]);
  const [permissions, setPermissions] = useState('view');
  const [expiryDate, setExpiryDate] = useState('');
  const [includeMessage, setIncludeMessage] = useState(true);
  const [message, setMessage] = useState('I\'ve shared a financial report with you.');

  const handleShare = () => {
    console.log('Sharing report:', { reportName, shareWith, permissions, expiryDate, includeMessage, message });
    onShare?.({ reportName, shareWith, permissions, expiryDate, includeMessage, message });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-3 py-2 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Share Report</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-3">
            <p className="text-gray-700">
              Sharing: <span className="font-semibold">{reportName}</span>
            </p>
          </div>

          {/* Share With */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Share With *</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {shareWith.map((email, index) => (
                <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-2">
                  {email}
                  <button
                    onClick={() => setShareWith(shareWith.filter((_, i) => i !== index))}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="email"
              placeholder="Add email address..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  setShareWith([...shareWith, e.currentTarget.value]);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>

          {/* Permissions */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'view', label: 'View Only' },
                { value: 'edit', label: 'Can Edit' },
                { value: 'manage', label: 'Can Manage' }
              ].map((perm) => (
                <button
                  key={perm.value}
                  onClick={() => setPermissions(perm.value)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    permissions === perm.value
                      ? 'bg-orange-50 border-orange-300 text-orange-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {perm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Expiry Date */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Access Expires (Optional)</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Message */}
          <div className="mb-3">
            <label className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                checked={includeMessage}
                onChange={(e) => setIncludeMessage(e.target.checked)}
                className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">Include a message</span>
            </label>
            {includeMessage && (
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            )}
          </div>

          {/* Info */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <h4 className="text-orange-800 font-medium mb-2">🔒 Privacy & Access</h4>
            <p className="text-sm text-orange-700">
              Shared users will receive an email notification with access to this report. You can revoke access at any time from the report settings.
            </p>
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
            onClick={handleShare}
            disabled={shareWith.length === 0}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Share Report
          </button>
        </div>
      </div>
    </div>
  );
}
