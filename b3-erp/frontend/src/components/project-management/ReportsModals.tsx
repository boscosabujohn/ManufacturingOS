'use client';

import { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Eye,
  TrendingUp,
  BarChart3,
  PieChart,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  Layout,
  Settings,
  Mail,
  Bell,
  Copy,
  Share2,
  Trash2,
  Plus,
  Edit,
  Save,
} from 'lucide-react';

// ============================================================
// INTERFACES
// ============================================================

interface Report {
  id: string;
  reportName: string;
  reportType: 'Financial' | 'Progress' | 'Resource' | 'Quality' | 'Risk' | 'Executive' | 'Custom';
  category: string;
  description: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'On-Demand';
  format: 'PDF' | 'Excel' | 'PowerPoint' | 'CSV';
  lastGenerated: string;
  generatedBy: string;
  projectScope: 'All Projects' | 'Single Project' | 'Project Type' | 'Department' | 'Client';
  projectCount: number;
  fileSize: string;
  status: 'Available' | 'Generating' | 'Failed' | 'Scheduled';
}

interface ReportTemplate {
  id: string;
  templateName: string;
  reportType: string;
  description: string;
  dataPoints: string[];
  filters: string[];
  charts: string[];
}

// ============================================================
// MODAL 1: GENERATE REPORT MODAL (Blue Gradient)
// ============================================================

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: any) => void;
  template?: ReportTemplate | null;
}

export function GenerateReportModal({ isOpen, onClose, onGenerate, template }: GenerateReportModalProps) {
  const [reportName, setReportName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(template?.templateName || 'Executive Dashboard');
  const [dateRange, setDateRange] = useState('Current Month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [outputFormat, setOutputFormat] = useState('PDF');
  const [projectScope, setProjectScope] = useState('All Projects');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeDetails, setIncludeDetails] = useState(true);

  const handleSubmit = () => {
    onGenerate({
      reportName,
      template: selectedTemplate,
      dateRange,
      startDate: dateRange === 'Custom Range' ? startDate : undefined,
      endDate: dateRange === 'Custom Range' ? endDate : undefined,
      format: outputFormat,
      projectScope,
      selectedProjects,
      includeCharts,
      includeSummary,
      includeDetails,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6" />
            <h2 className="text-xl font-bold">Generate Report</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Report Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Report Name *</label>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Enter custom report name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Report Template *</label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>Executive Dashboard</option>
              <option>Financial Performance Report</option>
              <option>Project Progress Report</option>
              <option>Resource Allocation Report</option>
              <option>Quality & Compliance Report</option>
              <option>Risk & Issues Dashboard</option>
              <option>Cost Variance Analysis</option>
              <option>Material Consumption Report</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date Range *</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>Current Month</option>
              <option>Current Quarter</option>
              <option>Current Year</option>
              <option>Last Month</option>
              <option>Last Quarter</option>
              <option>Last Year</option>
              <option>Year to Date</option>
              <option>Custom Range</option>
            </select>
          </div>

          {/* Custom Date Range */}
          {dateRange === 'Custom Range' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Output Format and Project Scope */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Output Format *</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>PDF</option>
                <option>Excel</option>
                <option>PowerPoint</option>
                <option>CSV</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Project Scope *</label>
              <select
                value={projectScope}
                onChange={(e) => setProjectScope(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>All Projects</option>
                <option>Active Projects Only</option>
                <option>Completed Projects</option>
                <option>Commercial Kitchen Projects</option>
                <option>Cold Room Projects</option>
                <option>Switchgear Projects</option>
                <option>Select Specific Projects</option>
              </select>
            </div>
          </div>

          {/* Report Options */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Report Options</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Include Charts & Visualizations</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeSummary}
                  onChange={(e) => setIncludeSummary(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Include Executive Summary</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeDetails}
                  onChange={(e) => setIncludeDetails(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Include Detailed Data Tables</span>
              </label>
            </div>
          </div>

          {/* Preview Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Report Preview</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p><span className="font-medium">Template:</span> {selectedTemplate}</p>
              <p><span className="font-medium">Format:</span> {outputFormat}</p>
              <p><span className="font-medium">Date Range:</span> {dateRange}</p>
              <p><span className="font-medium">Scope:</span> {projectScope}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reportName}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 2: SCHEDULE REPORT MODAL (Green Gradient)
// ============================================================

interface ScheduleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (data: any) => void;
}

export function ScheduleReportModal({ isOpen, onClose, onSchedule }: ScheduleReportModalProps) {
  const [reportName, setReportName] = useState('');
  const [template, setTemplate] = useState('Executive Dashboard');
  const [frequency, setFrequency] = useState('Monthly');
  const [scheduleDay, setScheduleDay] = useState('1');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [format, setFormat] = useState('PDF');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [autoDeliver, setAutoDeliver] = useState(true);

  const addRecipient = () => {
    if (emailRecipient && !recipients.includes(emailRecipient)) {
      setRecipients([...recipients, emailRecipient]);
      setEmailRecipient('');
    }
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email));
  };

  const handleSubmit = () => {
    onSchedule({
      reportName,
      template,
      frequency,
      scheduleDay,
      scheduleTime,
      format,
      recipients,
      autoDeliver,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Clock className="h-6 w-6" />
            <h2 className="text-xl font-bold">Schedule Report</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Report Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Report Name *</label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Monthly Executive Report"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Template *</label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option>Executive Dashboard</option>
                <option>Financial Performance Report</option>
                <option>Project Progress Report</option>
                <option>Resource Allocation Report</option>
                <option>Quality & Compliance Report</option>
              </select>
            </div>
          </div>

          {/* Schedule Settings */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency *</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Quarterly</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {frequency === 'Monthly' ? 'Day of Month' : frequency === 'Weekly' ? 'Day of Week' : 'Time'}
              </label>
              {frequency === 'Monthly' && (
                <select
                  value={scheduleDay}
                  onChange={(e) => setScheduleDay(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                  <option value="last">Last Day</option>
                </select>
              )}
              {frequency === 'Weekly' && (
                <select
                  value={scheduleDay}
                  onChange={(e) => setScheduleDay(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option>PDF</option>
                <option>Excel</option>
                <option>PowerPoint</option>
              </select>
            </div>
          </div>

          {/* Email Recipients */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Recipients</label>
            <div className="flex gap-2 mb-2">
              <input
                type="email"
                value={emailRecipient}
                onChange={(e) => setEmailRecipient(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                placeholder="Enter email address..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={addRecipient}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              {recipients.map((email, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="text-sm text-gray-700">{email}</span>
                  <button
                    onClick={() => removeRecipient(email)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Auto Deliver Option */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoDeliver}
                onChange={(e) => setAutoDeliver(e.target.checked)}
                className="h-4 w-4 text-green-600 rounded"
              />
              <span className="text-sm text-gray-700 font-medium">Automatically deliver report to recipients</span>
            </label>
          </div>

          {/* Schedule Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Schedule Summary</h4>
            <p className="text-sm text-gray-700">
              Report will be generated <span className="font-medium">{frequency.toLowerCase()}</span>{' '}
              {frequency === 'Monthly' && `on day ${scheduleDay}`}
              {frequency === 'Weekly' && `every ${scheduleDay}`}{' '}
              at <span className="font-medium">{scheduleTime}</span> and delivered to{' '}
              <span className="font-medium">{recipients.length} recipient(s)</span>.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reportName || recipients.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
          >
            Schedule Report
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 3: CUSTOMIZE TEMPLATE MODAL (Purple Gradient)
// ============================================================

interface CustomizeTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ReportTemplate | null;
  onSave: (data: any) => void;
}

export function CustomizeTemplateModal({ isOpen, onClose, template, onSave }: CustomizeTemplateModalProps) {
  const [templateName, setTemplateName] = useState(template?.templateName || '');
  const [description, setDescription] = useState(template?.description || '');
  const [selectedDataPoints, setSelectedDataPoints] = useState<string[]>(template?.dataPoints || []);
  const [selectedCharts, setSelectedCharts] = useState<string[]>(template?.charts || []);
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [includeLogo, setIncludeLogo] = useState(true);

  const availableDataPoints = [
    'Project Status', 'Budget vs Actual', 'Timeline Performance', 'Resource Utilization',
    'Risk Summary', 'Quality Metrics', 'Change Orders', 'Milestone Status', 'Task Completion',
    'Cost Performance Index', 'Schedule Performance Index', 'Earned Value'
  ];

  const availableCharts = [
    'Status Distribution Pie', 'Cost Trend Line', 'Schedule Performance Bar', 'Resource Heat Map',
    'Gantt Chart', 'Progress S-Curve', 'Variance Waterfall', 'Risk Matrix', 'Quality Trend'
  ];

  const toggleDataPoint = (point: string) => {
    setSelectedDataPoints(prev =>
      prev.includes(point) ? prev.filter(p => p !== point) : [...prev, point]
    );
  };

  const toggleChart = (chart: string) => {
    setSelectedCharts(prev =>
      prev.includes(chart) ? prev.filter(c => c !== chart) : [...prev, chart]
    );
  };

  const handleSubmit = () => {
    onSave({
      templateName,
      description,
      dataPoints: selectedDataPoints,
      charts: selectedCharts,
      headerText,
      footerText,
      includeLogo,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6" />
            <h2 className="text-xl font-bold">Customize Report Template</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Template Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Template Name *</label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Custom Executive Dashboard"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Data Points Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Data Points ({selectedDataPoints.length} selected)
            </label>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {availableDataPoints.map(point => (
                <label key={point} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedDataPoints.includes(point)}
                    onChange={() => toggleDataPoint(point)}
                    className="h-4 w-4 text-purple-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{point}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Charts Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Charts & Visualizations ({selectedCharts.length} selected)
            </label>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {availableCharts.map(chart => (
                <label key={chart} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCharts.includes(chart)}
                    onChange={() => toggleChart(chart)}
                    className="h-4 w-4 text-purple-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{chart}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Header and Footer */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Header Text</label>
              <textarea
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                placeholder="Company Name - Project Management"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Footer Text</label>
              <textarea
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="Confidential - For Internal Use Only"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Additional Options */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Display Options</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeLogo}
                  onChange={(e) => setIncludeLogo(e.target.checked)}
                  className="h-4 w-4 text-purple-600 rounded"
                />
                <span className="text-sm text-gray-700">Include company logo in header</span>
              </label>
            </div>
          </div>

          {/* Template Preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Template Configuration</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p><span className="font-medium">Data Points:</span> {selectedDataPoints.length} selected</p>
              <p><span className="font-medium">Charts:</span> {selectedCharts.length} selected</p>
              <p><span className="font-medium">Header:</span> {headerText || 'Default'}</p>
              <p><span className="font-medium">Footer:</span> {footerText || 'Default'}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!templateName || selectedDataPoints.length === 0}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 4: REPORT PREVIEW MODAL (Orange Gradient)
// ============================================================

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
}

export function ReportPreviewModal({ isOpen, onClose, report }: ReportPreviewModalProps) {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Eye className="h-6 w-6" />
            <h2 className="text-xl font-bold">Report Preview</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Report Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{report.reportName}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Generated on {new Date(report.lastGenerated).toLocaleDateString()}</span>
              <span>•</span>
              <span>By {report.generatedBy}</span>
              <span>•</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{report.reportType}</span>
            </div>
          </div>

          {/* Mock Report Content - Executive Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Executive Summary</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Projects</p>
                <p className="text-2xl font-bold text-blue-700">{report.projectCount}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">On Track</p>
                <p className="text-2xl font-bold text-green-700">{Math.floor(report.projectCount * 0.7)}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">At Risk</p>
                <p className="text-2xl font-bold text-yellow-700">{Math.floor(report.projectCount * 0.2)}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Behind</p>
                <p className="text-2xl font-bold text-red-700">{Math.floor(report.projectCount * 0.1)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              This report provides a comprehensive overview of project performance metrics for the selected period.
              Key highlights include project status distribution, budget utilization, resource allocation efficiency,
              and quality compliance rates. All data presented is based on real-time project management system data.
            </p>
          </div>

          {/* Mock Charts */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Budget Performance</h4>
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-blue-400" />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Bar Chart - Budget vs Actual</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Project Status Distribution</h4>
              <div className="h-48 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center">
                <PieChart className="h-16 w-16 text-green-400" />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Pie Chart - Status Breakdown</p>
            </div>
          </div>

          {/* Mock Data Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900">Project Details</h4>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 text-gray-900">Sample Project {i}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">On Track</span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">75%</td>
                    <td className="px-6 py-4 text-gray-900">₹{(Math.random() * 100).toFixed(1)}L</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Report Footer */}
          <div className="bg-gray-50 border-t border-gray-200 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500">
              This is a preview. Download the full report for complete data and analysis.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Download Full Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 5: SHARE REPORT MODAL (Indigo Gradient)
// ============================================================

interface ShareReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
  onShare: (data: any) => void;
}

export function ShareReportModal({ isOpen, onClose, report, onShare }: ShareReportModalProps) {
  const [shareMethod, setShareMethod] = useState('email');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [expiryDays, setExpiryDays] = useState('7');
  const [requirePassword, setRequirePassword] = useState(false);
  const [password, setPassword] = useState('');

  const addRecipient = () => {
    if (emailRecipient && !recipients.includes(emailRecipient)) {
      setRecipients([...recipients, emailRecipient]);
      setEmailRecipient('');
    }
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email));
  };

  const handleSubmit = () => {
    onShare({
      reportId: report?.id,
      method: shareMethod,
      recipients,
      message,
      expiryDays: shareMethod === 'link' ? expiryDays : undefined,
      password: requirePassword ? password : undefined,
    });
    onClose();
  };

  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Share2 className="h-6 w-6" />
            <h2 className="text-xl font-bold">Share Report</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Report Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900">{report.reportName}</h4>
            <p className="text-xs text-gray-600 mt-1">
              {report.format} • {report.fileSize} • Generated {new Date(report.lastGenerated).toLocaleDateString()}
            </p>
          </div>

          {/* Share Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Share Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShareMethod('email')}
                className={`p-4 rounded-lg border-2 text-center transition-colors ${
                  shareMethod === 'email'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <Mail className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
                <span className="text-sm font-medium">Email</span>
              </button>
              <button
                onClick={() => setShareMethod('link')}
                className={`p-4 rounded-lg border-2 text-center transition-colors ${
                  shareMethod === 'link'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <Share2 className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
                <span className="text-sm font-medium">Share Link</span>
              </button>
            </div>
          </div>

          {/* Email Recipients */}
          {shareMethod === 'email' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Recipients *</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="email"
                  value={emailRecipient}
                  onChange={(e) => setEmailRecipient(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                  placeholder="Enter email address..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={addRecipient}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-2">
                {recipients.map((email, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-sm text-gray-700">{email}</span>
                    <button
                      onClick={() => removeRecipient(email)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Link Sharing Options */}
          {shareMethod === 'link' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Link Expiration</label>
                <select
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="1">1 Day</option>
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                  <option value="never">Never Expires</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2 mb-3">
                  <input
                    type="checkbox"
                    checked={requirePassword}
                    onChange={(e) => setRequirePassword(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 rounded"
                  />
                  <span className="text-sm font-semibold text-gray-700">Require password to access</span>
                </label>
                {requirePassword && (
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter access password..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2 font-medium">Shareable Link:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`https://erp.company.com/reports/share/${report.id}`}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2">
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Message (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message to share with the report..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={shareMethod === 'email' && recipients.length === 0}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300"
          >
            Share Report
          </button>
        </div>
      </div>
    </div>
  );
}

// Due to length constraints, I'll continue with the remaining 7 modals in the next part
// Modals 6-12 will include:
// 6. Export Multiple Reports Modal (Teal)
// 7. Report Comparison Modal (Yellow)
// 8. Filter/Advanced Search Modal (Pink)
// 9. Report Analytics Modal (Cyan)
// 10. Create Template Modal (Red)
// 11. Report History Modal (Violet)
// 12. Notification Settings Modal (Emerald)

// ============================================================
// MODAL 6: EXPORT MULTIPLE REPORTS MODAL (Teal Gradient)
// ============================================================

interface ExportMultipleReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: Report[];
  onExport: (data: any) => void;
}

export function ExportMultipleReportsModal({ isOpen, onClose, reports, onExport }: ExportMultipleReportsModalProps) {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState('PDF');
  const [combineSingle, setCombineSingle] = useState(false);
  const [includeIndex, setIncludeIndex] = useState(true);

  const toggleReport = (reportId: string) => {
    setSelectedReports(prev =>
      prev.includes(reportId) ? prev.filter(id => id !== reportId) : [...prev, reportId]
    );
  };

  const selectAll = () => {
    setSelectedReports(reports.map(r => r.id));
  };

  const deselectAll = () => {
    setSelectedReports([]);
  };

  const handleSubmit = () => {
    onExport({
      reportIds: selectedReports,
      format: exportFormat,
      combineSingle,
      includeIndex,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Download className="h-6 w-6" />
            <h2 className="text-xl font-bold">Export Multiple Reports</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Export Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Export Format</label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option>PDF</option>
                <option>Excel</option>
                <option>ZIP Archive</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="space-y-2 w-full">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={combineSingle}
                    onChange={(e) => setCombineSingle(e.target.checked)}
                    className="h-4 w-4 text-teal-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Combine into single file</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={includeIndex}
                    onChange={(e) => setIncludeIndex(e.target.checked)}
                    className="h-4 w-4 text-teal-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Include index page</span>
                </label>
              </div>
            </div>
          </div>

          {/* Selection Controls */}
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700">
              Select Reports ({selectedReports.length}/{reports.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Select All
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={deselectAll}
                className="text-sm text-gray-600 hover:text-gray-700 font-medium"
              >
                Deselect All
              </button>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-3">
            {reports.slice(0, 10).map((report) => (
              <label
                key={report.id}
                className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedReports.includes(report.id)
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedReports.includes(report.id)}
                  onChange={() => toggleReport(report.id)}
                  className="mt-1 h-4 w-4 text-teal-600 rounded"
                />
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{report.reportName}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{report.reportType}</span>
                    <span className="text-xs text-gray-500">{report.format}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{report.fileSize}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* Export Summary */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Export Summary</h4>
            <p className="text-sm text-gray-700">
              {selectedReports.length} report(s) will be exported as{' '}
              {combineSingle ? 'a single combined' : 'separate'} {exportFormat} file(s).
            </p>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedReports.length === 0}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export {selectedReports.length} Report(s)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 7: REPORT COMPARISON MODAL (Yellow Gradient)
// ============================================================

interface ReportComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: Report[];
}

export function ReportComparisonModal({ isOpen, onClose, reports }: ReportComparisonModalProps) {
  const [report1, setReport1] = useState('');
  const [report2, setReport2] = useState('');
  const [comparisonType, setComparisonType] = useState('sidebyside');

  if (!isOpen) return null;

  const selectedReport1 = reports.find(r => r.id === report1);
  const selectedReport2 = reports.find(r => r.id === report2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6" />
            <h2 className="text-xl font-bold">Compare Reports</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Report Selection */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Report 1 *</label>
              <select
                value={report1}
                onChange={(e) => setReport1(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Select Report</option>
                {reports.map(r => (
                  <option key={r.id} value={r.id}>{r.reportName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Report 2 *</label>
              <select
                value={report2}
                onChange={(e) => setReport2(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Select Report</option>
                {reports.map(r => (
                  <option key={r.id} value={r.id}>{r.reportName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">View Mode</label>
              <select
                value={comparisonType}
                onChange={(e) => setComparisonType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="sidebyside">Side by Side</option>
                <option value="overlay">Overlay</option>
                <option value="difference">Difference Only</option>
              </select>
            </div>
          </div>

          {/* Comparison View */}
          {selectedReport1 && selectedReport2 && (
            <div className="grid grid-cols-2 gap-6">
              {/* Report 1 */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <h4 className="text-sm font-semibold text-gray-900">{selectedReport1.reportName}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {selectedReport1.reportType} • {new Date(selectedReport1.lastGenerated).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Projects:</span>
                    <span className="font-medium">{selectedReport1.projectCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">File Size:</span>
                    <span className="font-medium">{selectedReport1.fileSize}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-medium">{selectedReport1.format}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Generated By:</span>
                    <span className="font-medium">{selectedReport1.generatedBy}</span>
                  </div>
                </div>
              </div>

              {/* Report 2 */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <h4 className="text-sm font-semibold text-gray-900">{selectedReport2.reportName}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {selectedReport2.reportType} • {new Date(selectedReport2.lastGenerated).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Projects:</span>
                    <span className="font-medium">{selectedReport2.projectCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">File Size:</span>
                    <span className="font-medium">{selectedReport2.fileSize}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-medium">{selectedReport2.format}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Generated By:</span>
                    <span className="font-medium">{selectedReport2.generatedBy}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!selectedReport1 || !selectedReport2 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <p className="text-sm text-gray-600">Select two reports to compare their data and metrics.</p>
            </div>
          ) : null}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 8: ADVANCED FILTER MODAL (Pink Gradient)
// ============================================================

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export function AdvancedFilterModal({ isOpen, onClose, onApplyFilters }: AdvancedFilterModalProps) {
  const [reportType, setReportType] = useState<string[]>([]);
  const [format, setFormat] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [generatedBy, setGeneratedBy] = useState('');
  const [minSize, setMinSize] = useState('');
  const [maxSize, setMaxSize] = useState('');
  const [status, setStatus] = useState<string[]>([]);

  const toggleArrayValue = (value: string, array: string[], setter: (arr: string[]) => void) => {
    if (array.includes(value)) {
      setter(array.filter(v => v !== value));
    } else {
      setter([...array, value]);
    }
  };

  const handleApply = () => {
    onApplyFilters({
      reportType,
      format,
      dateFrom,
      dateTo,
      generatedBy,
      minSize,
      maxSize,
      status,
    });
    onClose();
  };

  const handleReset = () => {
    setReportType([]);
    setFormat([]);
    setDateFrom('');
    setDateTo('');
    setGeneratedBy('');
    setMinSize('');
    setMaxSize('');
    setStatus([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-pink-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Filter className="h-6 w-6" />
            <h2 className="text-xl font-bold">Advanced Filters</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Report Type</label>
            <div className="grid grid-cols-3 gap-2">
              {['Executive', 'Financial', 'Progress', 'Resource', 'Quality', 'Risk', 'Custom'].map(type => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={reportType.includes(type)}
                    onChange={() => toggleArrayValue(type, reportType, setReportType)}
                    className="h-4 w-4 text-pink-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Format</label>
            <div className="grid grid-cols-4 gap-2">
              {['PDF', 'Excel', 'PowerPoint', 'CSV'].map(fmt => (
                <label key={fmt} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={format.includes(fmt)}
                    onChange={() => toggleArrayValue(fmt, format, setFormat)}
                    className="h-4 w-4 text-pink-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{fmt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Generated Date Range</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Generated By */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Generated By</label>
            <input
              type="text"
              value={generatedBy}
              onChange={(e) => setGeneratedBy(e.target.value)}
              placeholder="Enter name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* File Size */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">File Size (MB)</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Min</label>
                <input
                  type="number"
                  value={minSize}
                  onChange={(e) => setMinSize(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Max</label>
                <input
                  type="number"
                  value={maxSize}
                  onChange={(e) => setMaxSize(e.target.value)}
                  placeholder="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Status</label>
            <div className="grid grid-cols-4 gap-2">
              {['Available', 'Generating', 'Failed', 'Scheduled'].map(st => (
                <label key={st} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={status.includes(st)}
                    onChange={() => toggleArrayValue(st, status, setStatus)}
                    className="h-4 w-4 text-pink-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{st}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-between rounded-b-lg">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            Reset Filters
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 9: REPORT ANALYTICS MODAL (Cyan Gradient)
// ============================================================

interface ReportAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: Report[];
}

export function ReportAnalyticsModal({ isOpen, onClose, reports }: ReportAnalyticsModalProps) {
  if (!isOpen) return null;

  const totalReports = reports.length;
  const byType = reports.reduce((acc, r) => {
    acc[r.reportType] = (acc[r.reportType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const byFormat = reports.reduce((acc, r) => {
    acc[r.format] = (acc[r.format] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6" />
            <h2 className="text-xl font-bold">Report Analytics</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 p-5 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Reports</p>
              <p className="text-3xl font-bold text-blue-700">{totalReports}</p>
            </div>
            <div className="bg-green-50 p-5 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">This Month</p>
              <p className="text-3xl font-bold text-green-700">
                {reports.filter(r => new Date(r.lastGenerated).getMonth() === new Date().getMonth()).length}
              </p>
            </div>
            <div className="bg-purple-50 p-5 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Templates</p>
              <p className="text-3xl font-bold text-purple-700">8</p>
            </div>
            <div className="bg-orange-50 p-5 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Scheduled</p>
              <p className="text-3xl font-bold text-orange-700">5</p>
            </div>
          </div>

          {/* By Type */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports by Type</h3>
            <div className="space-y-3">
              {Object.entries(byType).map(([type, count]) => {
                const percentage = (count / totalReports) * 100;
                return (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{type}</span>
                      <span className="font-semibold text-gray-900">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-cyan-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By Format */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports by Format</h3>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(byFormat).map(([format, count]) => (
                <div key={format} className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-600 mt-1">{format}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((count / totalReports) * 100).toFixed(0)}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Generators */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Report Generators</h3>
            <div className="space-y-2">
              {['Rajesh Kumar', 'Priya Sharma', 'Amit Patel'].map((name, index) => (
                <div key={name} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{name}</span>
                  </div>
                  <span className="text-sm font-semibold text-cyan-600">
                    {reports.filter(r => r.generatedBy === name).length} reports
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 10: CREATE TEMPLATE MODAL (Red Gradient)
// ============================================================

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function CreateTemplateModal({ isOpen, onClose, onSave }: CreateTemplateModalProps) {
  const [templateName, setTemplateName] = useState('');
  const [reportType, setReportType] = useState('Custom');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    onSave({
      templateName,
      reportType,
      description,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Plus className="h-6 w-6" />
            <h2 className="text-xl font-bold">Create New Template</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Template Name *</label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="My Custom Report Template"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Report Type *</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option>Custom</option>
              <option>Executive</option>
              <option>Financial</option>
              <option>Progress</option>
              <option>Resource</option>
              <option>Quality</option>
              <option>Risk</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this template is for..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!templateName}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300"
          >
            Create Template
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 11: REPORT HISTORY MODAL (Violet Gradient)
// ============================================================

interface ReportHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
}

export function ReportHistoryModal({ isOpen, onClose, report }: ReportHistoryModalProps) {
  if (!isOpen || !report) return null;

  const historyEntries = [
    { date: report.lastGenerated, action: 'Generated', user: report.generatedBy, version: '1.0' },
    { date: '2024-05-25', action: 'Shared', user: 'Rajesh Kumar', version: '1.0' },
    { date: '2024-05-20', action: 'Downloaded', user: 'Priya Sharma', version: '1.0' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-violet-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Clock className="h-6 w-6" />
            <h2 className="text-xl font-bold">Report History</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Report Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900">{report.reportName}</h4>
            <p className="text-xs text-gray-600 mt-1">
              {report.reportType} • {report.format} • {report.fileSize}
            </p>
          </div>

          {/* History Timeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Activity Timeline</h3>
            <div className="relative border-l-2 border-violet-200 ml-3 pl-6 space-y-6">
              {historyEntries.map((entry, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[29px] top-1 w-4 h-4 bg-violet-600 rounded-full border-2 border-white" />
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-900">{entry.action}</h4>
                      <span className="text-xs text-gray-500">{entry.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">By: {entry.user}</p>
                    <p className="text-xs text-gray-500 mt-1">Version: {entry.version}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 12: NOTIFICATION SETTINGS MODAL (Emerald Gradient)
// ============================================================

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: any) => void;
}

export function NotificationSettingsModal({ isOpen, onClose, onSave }: NotificationSettingsModalProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [reportGenerated, setReportGenerated] = useState(true);
  const [reportFailed, setReportFailed] = useState(true);
  const [reportShared, setReportShared] = useState(false);
  const [scheduledReports, setScheduledReports] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState('');

  const handleSubmit = () => {
    onSave({
      emailNotifications,
      reportGenerated,
      reportFailed,
      reportShared,
      scheduledReports,
      weeklyDigest,
      notificationEmail,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6" />
            <h2 className="text-xl font-bold">Notification Settings</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Master Toggle */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="h-5 w-5 text-emerald-600 rounded"
              />
              <div>
                <p className="font-semibold text-gray-900">Enable Email Notifications</p>
                <p className="text-sm text-gray-600">Receive email updates for report activities</p>
              </div>
            </label>
          </div>

          {/* Email Address */}
          {emailNotifications && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Notification Email</label>
              <input
                type="email"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                placeholder="your.email@company.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Notification Preferences */}
          {emailNotifications && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Notification Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={reportGenerated}
                    onChange={(e) => setReportGenerated(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Report Generated</p>
                    <p className="text-xs text-gray-600">Notify when a report generation completes</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={reportFailed}
                    onChange={(e) => setReportFailed(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Report Failed</p>
                    <p className="text-xs text-gray-600">Notify when a report generation fails</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={reportShared}
                    onChange={(e) => setReportShared(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Report Shared</p>
                    <p className="text-xs text-gray-600">Notify when someone shares a report with you</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={scheduledReports}
                    onChange={(e) => setScheduledReports(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Scheduled Reports</p>
                    <p className="text-xs text-gray-600">Notify when scheduled reports are ready</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={weeklyDigest}
                    onChange={(e) => setWeeklyDigest(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Weekly Digest</p>
                    <p className="text-xs text-gray-600">Receive a weekly summary of all reports</p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
