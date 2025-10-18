'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  DocumentTextIcon, ChartBarIcon, CalendarIcon, ArrowDownTrayIcon,
  AdjustmentsHorizontalIcon, EyeIcon, DocumentDuplicateIcon,
  PlusIcon, PencilIcon, TrashIcon, PlayIcon, ClockIcon,
  ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon
} from '@heroicons/react/24/outline';

interface ReportTemplate {
  id: string;
  name: string;
  category: 'financial' | 'operational' | 'statutory' | 'management' | 'regulatory';
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'custom';
  lastGenerated: string;
  nextDue: string;
  status: 'active' | 'draft' | 'archived';
  sections: ReportSection[];
  parameters: ReportParameter[];
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv' | 'html';
  isScheduled: boolean;
  createdBy: string;
  createdDate: string;
}

interface ReportSection {
  id: string;
  name: string;
  type: 'chart' | 'table' | 'text' | 'kpi' | 'summary';
  dataSource: string;
  chartType?: 'bar' | 'line' | 'pie' | 'area';
  filters?: ReportFilter[];
  formatting?: SectionFormatting;
  order: number;
}

interface ReportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: string | number | [number, number];
}

interface SectionFormatting {
  showTitle: boolean;
  showBorder: boolean;
  backgroundColor?: string;
  titleColor?: string;
  fontSize?: 'small' | 'medium' | 'large';
}

interface ReportParameter {
  id: string;
  name: string;
  type: 'date' | 'dateRange' | 'text' | 'number' | 'select';
  label: string;
  required: boolean;
  defaultValue?: any;
  options?: string[];
}

interface GeneratedReport {
  id: string;
  templateId: string;
  templateName: string;
  generatedDate: string;
  generatedBy: string;
  parameters: Record<string, any>;
  status: 'generating' | 'completed' | 'failed';
  fileSize?: string;
  downloadUrl?: string;
  recipients: string[];
  emailSent: boolean;
}

const FinancialReporting: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'templates' | 'generate' | 'reports' | 'schedule'>('dashboard');
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Mock data
  const [templates] = useState<ReportTemplate[]>([
    {
      id: '1',
      name: 'Monthly Financial Statement',
      category: 'financial',
      description: 'Comprehensive monthly financial statement including P&L, Balance Sheet, and Cash Flow',
      frequency: 'monthly',
      lastGenerated: '2024-01-15T10:30:00Z',
      nextDue: '2024-02-15T10:30:00Z',
      status: 'active',
      sections: [
        { id: '1', name: 'P&L Summary', type: 'chart', dataSource: 'profit_loss', chartType: 'bar', order: 1 },
        { id: '2', name: 'Revenue Breakdown', type: 'chart', dataSource: 'revenue', chartType: 'pie', order: 2 },
        { id: '3', name: 'Cash Flow', type: 'chart', dataSource: 'cash_flow', chartType: 'line', order: 3 }
      ],
      parameters: [
        { id: '1', name: 'period', type: 'dateRange', label: 'Reporting Period', required: true },
        { id: '2', name: 'currency', type: 'select', label: 'Currency', required: false, options: ['USD', 'EUR', 'GBP'] }
      ],
      recipients: ['cfo@company.com', 'accounting@company.com'],
      format: 'pdf',
      isScheduled: true,
      createdBy: 'John Smith',
      createdDate: '2024-01-01T09:00:00Z'
    },
    {
      id: '2',
      name: 'Quarterly Board Report',
      category: 'management',
      description: 'Executive summary for board meetings with key financial metrics and trends',
      frequency: 'quarterly',
      lastGenerated: '2024-01-01T15:00:00Z',
      nextDue: '2024-04-01T15:00:00Z',
      status: 'active',
      sections: [
        { id: '1', name: 'Executive Summary', type: 'text', dataSource: 'executive_summary', order: 1 },
        { id: '2', name: 'Key Metrics', type: 'kpi', dataSource: 'key_metrics', order: 2 },
        { id: '3', name: 'Trend Analysis', type: 'chart', dataSource: 'trends', chartType: 'area', order: 3 }
      ],
      parameters: [
        { id: '1', name: 'quarter', type: 'select', label: 'Quarter', required: true, options: ['Q1', 'Q2', 'Q3', 'Q4'] },
        { id: '2', name: 'year', type: 'number', label: 'Year', required: true, defaultValue: 2024 }
      ],
      recipients: ['board@company.com', 'ceo@company.com'],
      format: 'pdf',
      isScheduled: true,
      createdBy: 'Sarah Johnson',
      createdDate: '2024-01-01T09:00:00Z'
    },
    {
      id: '3',
      name: 'Daily Cash Position',
      category: 'operational',
      description: 'Daily cash position and liquidity monitoring',
      frequency: 'daily',
      lastGenerated: '2024-01-18T08:00:00Z',
      nextDue: '2024-01-19T08:00:00Z',
      status: 'active',
      sections: [
        { id: '1', name: 'Cash Position', type: 'kpi', dataSource: 'cash_position', order: 1 },
        { id: '2', name: 'Daily Movements', type: 'table', dataSource: 'cash_movements', order: 2 }
      ],
      parameters: [
        { id: '1', name: 'date', type: 'date', label: 'Report Date', required: true }
      ],
      recipients: ['treasury@company.com'],
      format: 'excel',
      isScheduled: true,
      createdBy: 'Mike Chen',
      createdDate: '2024-01-01T09:00:00Z'
    }
  ]);

  const [generatedReports] = useState<GeneratedReport[]>([
    {
      id: '1',
      templateId: '1',
      templateName: 'Monthly Financial Statement',
      generatedDate: '2024-01-15T10:30:00Z',
      generatedBy: 'John Smith',
      parameters: { period: '2024-01', currency: 'USD' },
      status: 'completed',
      fileSize: '2.3 MB',
      downloadUrl: '/reports/monthly-jan-2024.pdf',
      recipients: ['cfo@company.com', 'accounting@company.com'],
      emailSent: true
    },
    {
      id: '2',
      templateId: '3',
      templateName: 'Daily Cash Position',
      generatedDate: '2024-01-18T08:00:00Z',
      generatedBy: 'Mike Chen',
      parameters: { date: '2024-01-18' },
      status: 'completed',
      fileSize: '156 KB',
      downloadUrl: '/reports/cash-position-2024-01-18.xlsx',
      recipients: ['treasury@company.com'],
      emailSent: true
    },
    {
      id: '3',
      templateId: '2',
      templateName: 'Quarterly Board Report',
      generatedDate: '2024-01-18T14:30:00Z',
      generatedBy: 'Sarah Johnson',
      parameters: { quarter: 'Q4', year: 2023 },
      status: 'generating',
      recipients: ['board@company.com', 'ceo@company.com'],
      emailSent: false
    }
  ]);

  // Mock chart data
  const reportUsageData = [
    { month: 'Jan', financial: 45, operational: 32, management: 18, statutory: 12 },
    { month: 'Feb', financial: 52, operational: 38, management: 22, statutory: 15 },
    { month: 'Mar', financial: 48, operational: 35, management: 20, statutory: 13 },
    { month: 'Apr', financial: 61, operational: 42, management: 25, statutory: 18 },
    { month: 'May', financial: 55, operational: 39, management: 23, statutory: 16 },
    { month: 'Jun', financial: 58, operational: 41, management: 24, statutory: 17 }
  ];

  const templateDistribution = [
    { name: 'Financial', value: 35, color: '#3B82F6' },
    { name: 'Operational', value: 28, color: '#10B981' },
    { name: 'Management', value: 22, color: '#F59E0B' },
    { name: 'Statutory', value: 15, color: '#EF4444' }
  ];

  const generateReport = (templateId: string, parameters: Record<string, any>) => {
    console.log('Generating report for template:', templateId, 'with parameters:', parameters);
    setShowGenerateModal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon },
      draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: ClockIcon },
      archived: { bg: 'bg-gray-100', text: 'text-gray-800', icon: InformationCircleIcon },
      generating: { bg: 'bg-blue-100', text: 'text-blue-800', icon: ClockIcon },
      completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon },
      failed: { bg: 'bg-red-100', text: 'text-red-800', icon: ExclamationTriangleIcon }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      financial: { bg: 'bg-blue-100', text: 'text-blue-800' },
      operational: { bg: 'bg-green-100', text: 'text-green-800' },
      management: { bg: 'bg-purple-100', text: 'text-purple-800' },
      statutory: { bg: 'bg-red-100', text: 'text-red-800' },
      regulatory: { bg: 'bg-orange-100', text: 'text-orange-800' }
    };

    const config = categoryConfig[category as keyof typeof categoryConfig];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Templates</p>
              <p className="text-2xl font-semibold text-gray-900">{templates.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reports Generated</p>
              <p className="text-2xl font-semibold text-gray-900">147</p>
              <p className="text-sm text-green-600">+12% this month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled Reports</p>
              <p className="text-2xl font-semibold text-gray-900">
                {templates.filter(t => t.isScheduled).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowDownTrayIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Downloads</p>
              <p className="text-2xl font-semibold text-gray-900">1,234</p>
              <p className="text-sm text-purple-600">Last 30 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Generation Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={reportUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="financial" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
              <Area type="monotone" dataKey="operational" stackId="1" stroke="#10B981" fill="#10B981" />
              <Area type="monotone" dataKey="management" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
              <Area type="monotone" dataKey="statutory" stackId="1" stroke="#EF4444" fill="#EF4444" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={templateDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {templateDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {generatedReports.slice(0, 5).map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{report.templateName}</h4>
                  <p className="text-sm text-gray-600">
                    Generated by {report.generatedBy} on {formatDateTime(report.generatedDate)}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(report.status)}
                  {report.status === 'completed' && (
                    <button className="text-blue-600 hover:text-blue-800">
                      <ArrowDownTrayIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Report Templates</h3>
        <button
          onClick={() => {
            setSelectedTemplate(null);
            setIsEditMode(false);
            setShowTemplateModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Template
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedTemplate(template);
                    setIsEditMode(true);
                    setShowTemplateModal(true);
                  }}
                  className="text-gray-600 hover:text-blue-600"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button className="text-gray-600 hover:text-red-600">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Category:</span>
                {getCategoryBadge(template.category)}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                {getStatusBadge(template.status)}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Frequency:</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{template.frequency}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Generated:</span>
                <span className="text-sm text-gray-900">{formatDate(template.lastGenerated)}</span>
              </div>

              {template.isScheduled && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Next Due:</span>
                  <span className="text-sm text-gray-900">{formatDate(template.nextDue)}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
              <button
                onClick={() => {
                  setSelectedTemplate(template);
                  setShowGenerateModal(true);
                }}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 flex items-center justify-center"
              >
                <PlayIcon className="w-4 h-4 mr-1" />
                Generate
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center justify-center">
                <EyeIcon className="w-4 h-4" />
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center justify-center">
                <DocumentDuplicateIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGenerate = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Generate Report</h3>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">Quick Generate</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.filter(t => t.status === 'active').map((template) => (
            <button
              key={template.id}
              onClick={() => {
                setSelectedTemplate(template);
                setShowGenerateModal(true);
              }}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 text-left"
            >
              <h5 className="font-medium text-gray-900">{template.name}</h5>
              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              <div className="mt-2">
                {getCategoryBadge(template.category)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Generated Reports</h3>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="space-y-4">
            {generatedReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{report.templateName}</h4>
                  <p className="text-sm text-gray-600">
                    Generated by {report.generatedBy} on {formatDateTime(report.generatedDate)}
                  </p>
                  {report.fileSize && (
                    <p className="text-sm text-gray-500">File size: {report.fileSize}</p>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {getStatusBadge(report.status)}

                  {report.status === 'completed' && (
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center">
                        <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                        Download
                      </button>
                      <button className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50 flex items-center">
                        <EyeIcon className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </div>
                  )}

                  {report.status === 'generating' && (
                    <div className="flex items-center text-blue-600">
                      <ClockIcon className="w-4 h-4 mr-1 animate-spin" />
                      <span className="text-sm">Generating...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Scheduled Reports</h3>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="space-y-4">
            {templates.filter(t => t.isScheduled).map((template) => (
              <div key={template.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-600">
                    Frequency: {template.frequency} | Next due: {formatDate(template.nextDue)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Recipients: {template.recipients.join(', ')}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  {getCategoryBadge(template.category)}
                  {getStatusBadge(template.status)}

                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <PlayIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Generate Modal
  const GenerateModal = () => {
    if (!selectedTemplate) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Generate Report: {selectedTemplate.name}
          </h3>

          <div className="space-y-4">
            {selectedTemplate.parameters.map((param) => (
              <div key={param.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {param.label} {param.required && <span className="text-red-500">*</span>}
                </label>
                {param.type === 'select' ? (
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    {param.options?.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : param.type === 'date' ? (
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    defaultValue={param.defaultValue}
                  />
                ) : param.type === 'dateRange' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" className="border border-gray-300 rounded-lg px-3 py-2" />
                    <input type="date" className="border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                ) : (
                  <input
                    type={param.type}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    defaultValue={param.defaultValue}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowGenerateModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => generateReport(selectedTemplate.id, {})}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Financial Reporting</h1>
        <p className="text-gray-600 mt-2">Create and manage financial reports with customizable templates</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
            { key: 'templates', label: 'Templates', icon: DocumentTextIcon },
            { key: 'generate', label: 'Generate', icon: PlayIcon },
            { key: 'reports', label: 'Reports', icon: DocumentDuplicateIcon },
            { key: 'schedule', label: 'Schedule', icon: CalendarIcon }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-5 h-5 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'templates' && renderTemplates()}
      {activeTab === 'generate' && renderGenerate()}
      {activeTab === 'reports' && renderReports()}
      {activeTab === 'schedule' && renderSchedule()}

      {/* Modals */}
      {showGenerateModal && <GenerateModal />}
    </div>
  );
};

export default FinancialReporting;