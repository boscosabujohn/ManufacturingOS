'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  DocumentTextIcon, CurrencyDollarIcon, CalendarIcon, ExclamationTriangleIcon,
  CheckCircleIcon, ClockIcon, PlusIcon, PencilIcon, EyeIcon,
  DocumentArrowDownIcon, DocumentArrowUpIcon, BanknotesIcon,
  ChartBarIcon, ShieldCheckIcon, InformationCircleIcon,
  BuildingOffice2Icon, GlobeAltIcon, ReceiptPercentIcon
} from '@heroicons/react/24/outline';

interface TaxJurisdiction {
  id: string;
  name: string;
  code: string;
  type: 'federal' | 'state' | 'local' | 'international';
  country: string;
  region?: string;
  isActive: boolean;
  taxTypes: TaxType[];
  filingFrequency: 'monthly' | 'quarterly' | 'annual';
  nextFilingDate: string;
  contactInfo: JurisdictionContact;
}

interface TaxType {
  id: string;
  name: string;
  code: string;
  category: 'income' | 'sales' | 'payroll' | 'property' | 'vat' | 'gst' | 'withholding' | 'other';
  rate: number;
  isPercentage: boolean;
  applicableFrom: string;
  applicableTo?: string;
  description: string;
  calculationMethod: 'flat' | 'progressive' | 'regressive';
  brackets?: TaxBracket[];
}

interface TaxBracket {
  id: string;
  minAmount: number;
  maxAmount?: number;
  rate: number;
  fixedAmount?: number;
}

interface JurisdictionContact {
  department: string;
  phone: string;
  email: string;
  website: string;
  address: string;
}

interface TaxFiling {
  id: string;
  jurisdictionId: string;
  jurisdictionName: string;
  taxTypeId: string;
  taxTypeName: string;
  filingPeriod: string;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  status: 'draft' | 'prepared' | 'filed' | 'paid' | 'overdue' | 'amended';
  taxableAmount: number;
  taxOwed: number;
  taxPaid: number;
  penalties: number;
  interest: number;
  totalDue: number;
  filedDate?: string;
  paidDate?: string;
  confirmationNumber?: string;
  preparedBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  attachments: TaxDocument[];
  notes?: string;
  amendments: TaxAmendment[];
}

interface TaxDocument {
  id: string;
  name: string;
  type: 'return' | 'schedule' | 'receipt' | 'correspondence' | 'supporting';
  url: string;
  size: string;
  uploadDate: string;
  description?: string;
}

interface TaxAmendment {
  id: string;
  amendmentDate: string;
  reason: string;
  originalAmount: number;
  amendedAmount: number;
  additionalTax: number;
  additionalPenalty: number;
  status: 'draft' | 'filed' | 'accepted' | 'rejected';
  filedBy: string;
}

interface TaxCalculation {
  id: string;
  transactionId: string;
  transactionType: 'sale' | 'purchase' | 'payroll' | 'expense';
  transactionDate: string;
  transactionAmount: number;
  jurisdictionId: string;
  taxTypeId: string;
  taxableAmount: number;
  taxRate: number;
  taxAmount: number;
  isReversed: boolean;
  reversalReason?: string;
  calculationMethod: string;
  appliedRules: string[];
}

interface ComplianceAlert {
  id: string;
  type: 'filing_due' | 'payment_due' | 'registration_expiring' | 'rate_change' | 'law_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  dueDate?: string;
  jurisdictionId: string;
  jurisdictionName: string;
  isRead: boolean;
  isResolved: boolean;
  createdDate: string;
  actionRequired: string;
}

interface TaxReport {
  id: string;
  name: string;
  type: 'liability' | 'payment' | 'compliance' | 'audit' | 'summary';
  period: string;
  generatedDate: string;
  generatedBy: string;
  format: 'pdf' | 'excel' | 'csv';
  size: string;
  downloadUrl: string;
}

const TaxManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jurisdictions' | 'filings' | 'calculations' | 'compliance' | 'reports'>('dashboard');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<TaxJurisdiction | null>(null);
  const [selectedFiling, setSelectedFiling] = useState<TaxFiling | null>(null);
  const [showJurisdictionModal, setShowJurisdictionModal] = useState(false);
  const [showFilingModal, setShowFilingModal] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-12-31' });

  // Mock data
  const [jurisdictions] = useState<TaxJurisdiction[]>([
    {
      id: '1',
      name: 'Internal Revenue Service',
      code: 'US-FED',
      type: 'federal',
      country: 'United States',
      isActive: true,
      taxTypes: [
        {
          id: '1',
          name: 'Federal Income Tax',
          code: 'FIT',
          category: 'income',
          rate: 21,
          isPercentage: true,
          applicableFrom: '2024-01-01T00:00:00Z',
          description: 'Federal corporate income tax',
          calculationMethod: 'flat'
        }
      ],
      filingFrequency: 'quarterly',
      nextFilingDate: '2024-04-15T00:00:00Z',
      contactInfo: {
        department: 'Business Tax Division',
        phone: '1-800-829-4933',
        email: 'business@irs.gov',
        website: 'https://www.irs.gov',
        address: '1111 Constitution Ave NW, Washington, DC 20224'
      }
    },
    {
      id: '2',
      name: 'California Department of Tax and Fee Administration',
      code: 'CA-CDTFA',
      type: 'state',
      country: 'United States',
      region: 'California',
      isActive: true,
      taxTypes: [
        {
          id: '2',
          name: 'California Sales Tax',
          code: 'CA-ST',
          category: 'sales',
          rate: 7.25,
          isPercentage: true,
          applicableFrom: '2024-01-01T00:00:00Z',
          description: 'California state sales tax',
          calculationMethod: 'flat'
        }
      ],
      filingFrequency: 'monthly',
      nextFilingDate: '2024-02-28T00:00:00Z',
      contactInfo: {
        department: 'Sales and Use Tax Division',
        phone: '1-800-400-7115',
        email: 'info@cdtfa.ca.gov',
        website: 'https://www.cdtfa.ca.gov',
        address: '450 N Street, Sacramento, CA 95814'
      }
    },
    {
      id: '3',
      name: 'HM Revenue and Customs',
      code: 'UK-HMRC',
      type: 'international',
      country: 'United Kingdom',
      isActive: true,
      taxTypes: [
        {
          id: '3',
          name: 'UK VAT',
          code: 'UK-VAT',
          category: 'vat',
          rate: 20,
          isPercentage: true,
          applicableFrom: '2024-01-01T00:00:00Z',
          description: 'United Kingdom Value Added Tax',
          calculationMethod: 'flat'
        }
      ],
      filingFrequency: 'quarterly',
      nextFilingDate: '2024-04-07T00:00:00Z',
      contactInfo: {
        department: 'VAT Helpline',
        phone: '+44 300 200 3700',
        email: 'vat@hmrc.gov.uk',
        website: 'https://www.gov.uk/government/organisations/hm-revenue-customs',
        address: '100 Parliament Street, London SW1A 2BQ'
      }
    }
  ]);

  const [taxFilings] = useState<TaxFiling[]>([
    {
      id: '1',
      jurisdictionId: '1',
      jurisdictionName: 'Internal Revenue Service',
      taxTypeId: '1',
      taxTypeName: 'Federal Income Tax',
      filingPeriod: 'Q4 2023',
      periodStart: '2023-10-01T00:00:00Z',
      periodEnd: '2023-12-31T00:00:00Z',
      dueDate: '2024-01-15T00:00:00Z',
      status: 'filed',
      taxableAmount: 2500000,
      taxOwed: 525000,
      taxPaid: 525000,
      penalties: 0,
      interest: 0,
      totalDue: 0,
      filedDate: '2024-01-10T00:00:00Z',
      paidDate: '2024-01-10T00:00:00Z',
      confirmationNumber: 'IRS2024010112345',
      preparedBy: 'Sarah Johnson',
      reviewedBy: 'Michael Chen',
      approvedBy: 'David Wilson',
      attachments: [
        {
          id: '1',
          name: 'Form 1120 - Q4 2023',
          type: 'return',
          url: '/tax/form-1120-q4-2023.pdf',
          size: '2.1 MB',
          uploadDate: '2024-01-10T00:00:00Z',
          description: 'Corporate income tax return'
        }
      ],
      amendments: []
    },
    {
      id: '2',
      jurisdictionId: '2',
      jurisdictionName: 'California Department of Tax and Fee Administration',
      taxTypeId: '2',
      taxTypeName: 'California Sales Tax',
      filingPeriod: 'January 2024',
      periodStart: '2024-01-01T00:00:00Z',
      periodEnd: '2024-01-31T00:00:00Z',
      dueDate: '2024-02-28T00:00:00Z',
      status: 'prepared',
      taxableAmount: 450000,
      taxOwed: 32625,
      taxPaid: 0,
      penalties: 0,
      interest: 0,
      totalDue: 32625,
      preparedBy: 'Emma Davis',
      reviewedBy: 'Sarah Johnson',
      attachments: [],
      amendments: []
    },
    {
      id: '3',
      jurisdictionId: '1',
      jurisdictionName: 'Internal Revenue Service',
      taxTypeId: '1',
      taxTypeName: 'Federal Income Tax',
      filingPeriod: 'Q1 2024',
      periodStart: '2024-01-01T00:00:00Z',
      periodEnd: '2024-03-31T00:00:00Z',
      dueDate: '2024-04-15T00:00:00Z',
      status: 'draft',
      taxableAmount: 0,
      taxOwed: 0,
      taxPaid: 0,
      penalties: 0,
      interest: 0,
      totalDue: 0,
      preparedBy: 'System',
      attachments: [],
      amendments: []
    }
  ]);

  const [complianceAlerts] = useState<ComplianceAlert[]>([
    {
      id: '1',
      type: 'filing_due',
      severity: 'high',
      title: 'California Sales Tax Filing Due Soon',
      description: 'January 2024 sales tax filing is due in 10 days',
      dueDate: '2024-02-28T00:00:00Z',
      jurisdictionId: '2',
      jurisdictionName: 'California Department of Tax and Fee Administration',
      isRead: false,
      isResolved: false,
      createdDate: '2024-02-18T00:00:00Z',
      actionRequired: 'Complete and file January 2024 sales tax return'
    },
    {
      id: '2',
      type: 'payment_due',
      severity: 'critical',
      title: 'Q1 2024 Federal Estimated Tax Payment Due',
      description: 'First quarter estimated tax payment is due in 5 days',
      dueDate: '2024-04-15T00:00:00Z',
      jurisdictionId: '1',
      jurisdictionName: 'Internal Revenue Service',
      isRead: false,
      isResolved: false,
      createdDate: '2024-04-10T00:00:00Z',
      actionRequired: 'Make quarterly estimated tax payment'
    },
    {
      id: '3',
      type: 'rate_change',
      severity: 'medium',
      title: 'UK VAT Rate Change Notification',
      description: 'VAT rate for certain goods will change from 20% to 15% effective April 1st',
      jurisdictionId: '3',
      jurisdictionName: 'HM Revenue and Customs',
      isRead: true,
      isResolved: false,
      createdDate: '2024-03-15T00:00:00Z',
      actionRequired: 'Update tax calculation settings for affected products'
    }
  ]);

  const [taxCalculations] = useState<TaxCalculation[]>([
    {
      id: '1',
      transactionId: 'INV-2024-001',
      transactionType: 'sale',
      transactionDate: '2024-01-15T00:00:00Z',
      transactionAmount: 10000,
      jurisdictionId: '2',
      taxTypeId: '2',
      taxableAmount: 10000,
      taxRate: 7.25,
      taxAmount: 725,
      isReversed: false,
      calculationMethod: 'flat_rate',
      appliedRules: ['standard_sales_tax', 'california_base_rate']
    },
    {
      id: '2',
      transactionId: 'INV-2024-002',
      transactionType: 'sale',
      transactionDate: '2024-01-16T00:00:00Z',
      transactionAmount: 25000,
      jurisdictionId: '3',
      taxTypeId: '3',
      taxableAmount: 25000,
      taxRate: 20,
      taxAmount: 5000,
      isReversed: false,
      calculationMethod: 'flat_rate',
      appliedRules: ['uk_vat_standard_rate']
    }
  ]);

  // Chart data
  const taxLiabilityData = [
    { month: 'Jan', federal: 125000, state: 32000, local: 8000, international: 15000 },
    { month: 'Feb', federal: 118000, state: 35000, local: 9000, international: 18000 },
    { month: 'Mar', federal: 132000, state: 38000, local: 7500, international: 16000 },
    { month: 'Apr', federal: 145000, state: 42000, local: 11000, international: 22000 },
    { month: 'May', federal: 138000, state: 39000, local: 9500, international: 19000 },
    { month: 'Jun', federal: 152000, state: 45000, local: 12000, international: 25000 }
  ];

  const complianceStatusData = [
    { name: 'Compliant', value: 85, color: '#10B981' },
    { name: 'At Risk', value: 12, color: '#F59E0B' },
    { name: 'Non-Compliant', value: 3, color: '#EF4444' }
  ];

  const filingStatusData = [
    { status: 'Filed', count: 24, color: '#10B981' },
    { status: 'Prepared', count: 8, color: '#3B82F6' },
    { status: 'Draft', count: 12, color: '#F59E0B' },
    { status: 'Overdue', count: 2, color: '#EF4444' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: ClockIcon },
      prepared: { bg: 'bg-blue-100', text: 'text-blue-800', icon: DocumentTextIcon },
      filed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon },
      paid: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon },
      overdue: { bg: 'bg-red-100', text: 'text-red-800', icon: ExclamationTriangleIcon },
      amended: { bg: 'bg-purple-100', text: 'text-purple-800', icon: PencilIcon }
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

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      low: { bg: 'bg-blue-100', text: 'text-blue-800' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      high: { bg: 'bg-orange-100', text: 'text-orange-800' },
      critical: { bg: 'bg-red-100', text: 'text-red-800' }
    };

    const config = severityConfig[severity as keyof typeof severityConfig];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    );
  };

  const getJurisdictionTypeIcon = (type: string) => {
    switch (type) {
      case 'federal':
        return <BuildingOffice2Icon className="w-5 h-5 text-blue-600" />;
      case 'state':
        return <BuildingOffice2Icon className="w-5 h-5 text-green-600" />;
      case 'local':
        return <BuildingOffice2Icon className="w-5 h-5 text-orange-600" />;
      case 'international':
        return <GlobeAltIcon className="w-5 h-5 text-purple-600" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tax Liability</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(taxFilings.reduce((sum, f) => sum + f.taxOwed, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Jurisdictions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {jurisdictions.filter(j => j.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compliance Alerts</p>
              <p className="text-2xl font-semibold text-gray-900">
                {complianceAlerts.filter(a => !a.isResolved).length}
              </p>
              <p className="text-sm text-orange-600">
                {complianceAlerts.filter(a => a.severity === 'critical' && !a.isResolved).length} critical
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Filings</p>
              <p className="text-2xl font-semibold text-gray-900">
                {taxFilings.filter(f => new Date(f.dueDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length}
              </p>
              <p className="text-sm text-red-600">Next 30 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Liability by Jurisdiction</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={taxLiabilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Area type="monotone" dataKey="federal" stackId="1" stroke="#3B82F6" fill="#3B82F6" name="Federal" />
              <Area type="monotone" dataKey="state" stackId="1" stroke="#10B981" fill="#10B981" name="State" />
              <Area type="monotone" dataKey="local" stackId="1" stroke="#F59E0B" fill="#F59E0B" name="Local" />
              <Area type="monotone" dataKey="international" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" name="International" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filing Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={filingStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {filingStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Compliance Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Compliance Alerts</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {complianceAlerts.filter(a => !a.isResolved).slice(0, 5).map((alert) => (
              <div key={alert.id} className={`flex items-start justify-between p-4 rounded-lg border ${
                !alert.isRead ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                    {getSeverityBadge(alert.severity)}
                  </div>
                  <p className="text-sm text-gray-600">{alert.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {alert.jurisdictionName}
                    {alert.dueDate && ` • Due: ${formatDate(alert.dueDate)}`}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderJurisdictions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Tax Jurisdictions</h3>
        <button
          onClick={() => setShowJurisdictionModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Jurisdiction
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {jurisdictions.map((jurisdiction) => (
          <div key={jurisdiction.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                {getJurisdictionTypeIcon(jurisdiction.type)}
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">{jurisdiction.name}</h4>
                  <p className="text-sm text-gray-600">{jurisdiction.code}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedJurisdiction(jurisdiction)}
                  className="text-gray-600 hover:text-blue-600"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button className="text-gray-600 hover:text-blue-600">
                  <PencilIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{jurisdiction.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Country:</span>
                <span className="text-sm text-gray-900">{jurisdiction.country}</span>
              </div>
              {jurisdiction.region && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Region:</span>
                  <span className="text-sm text-gray-900">{jurisdiction.region}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Filing Frequency:</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{jurisdiction.filingFrequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Next Filing:</span>
                <span className="text-sm text-gray-900">{formatDate(jurisdiction.nextFilingDate)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tax Types:</span>
                <span className="text-sm font-medium text-gray-900">{jurisdiction.taxTypes.length}</span>
              </div>
              <div className="mt-2">
                {jurisdiction.taxTypes.slice(0, 2).map((taxType) => (
                  <div key={taxType.id} className="text-xs text-gray-600">
                    {taxType.name} ({taxType.rate}%)
                  </div>
                ))}
                {jurisdiction.taxTypes.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{jurisdiction.taxTypes.length - 2} more
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFilings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Tax Filings</h3>
        <button
          onClick={() => setShowFilingModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Filing
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Filing Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jurisdiction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax Owed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {taxFilings.map((filing) => (
                <tr key={filing.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {filing.filingPeriod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {filing.jurisdictionName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {filing.taxTypeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(filing.dueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(filing.taxOwed)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(filing.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedFiling(filing)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-blue-600">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      {filing.status === 'filed' && (
                        <button className="text-gray-600 hover:text-green-600">
                          <DocumentArrowDownIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCalculations = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Tax Calculations</h3>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxable Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {taxCalculations.map((calc) => (
                <tr key={calc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {calc.transactionId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(calc.transactionDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {calc.transactionType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(calc.taxableAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {calc.taxRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(calc.taxAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      calc.isReversed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {calc.isReversed ? 'Reversed' : 'Applied'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Compliance Management</h3>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-4">Compliance Status Overview</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={complianceStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {complianceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">Quick Stats</h4>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Alerts:</span>
              <span className="text-sm font-medium text-gray-900">{complianceAlerts.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Critical:</span>
              <span className="text-sm font-medium text-red-600">
                {complianceAlerts.filter(a => a.severity === 'critical').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Resolved:</span>
              <span className="text-sm font-medium text-green-600">
                {complianceAlerts.filter(a => a.isResolved).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">This Month:</span>
              <span className="text-sm font-medium text-blue-600">
                {complianceAlerts.filter(a => new Date(a.createdDate).getMonth() === new Date().getMonth()).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Compliance Alerts</h4>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {complianceAlerts.map((alert) => (
              <div key={alert.id} className={`border rounded-lg p-4 ${
                alert.isResolved ? 'border-gray-200 bg-gray-50' :
                alert.severity === 'critical' ? 'border-red-200 bg-red-50' :
                alert.severity === 'high' ? 'border-orange-200 bg-orange-50' :
                'border-yellow-200 bg-yellow-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="font-medium text-gray-900">{alert.title}</h5>
                      {getSeverityBadge(alert.severity)}
                      {alert.isResolved && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircleIcon className="w-3 h-3 mr-1" />
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{alert.jurisdictionName}</span>
                      {alert.dueDate && <span>Due: {formatDate(alert.dueDate)}</span>}
                      <span>Created: {formatDate(alert.createdDate)}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2 font-medium">
                      Action Required: {alert.actionRequired}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {!alert.isResolved && (
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                        Resolve
                      </button>
                    )}
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
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

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Tax Reports</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Tax Liability Summary', type: 'liability', period: 'Q1 2024', generated: '2024-04-01' },
          { name: 'Sales Tax Report', type: 'payment', period: 'March 2024', generated: '2024-03-31' },
          { name: 'Compliance Status Report', type: 'compliance', period: 'Q1 2024', generated: '2024-04-01' },
          { name: 'International Tax Summary', type: 'summary', period: 'Q1 2024', generated: '2024-04-01' }
        ].map((report, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">{report.name}</h4>
                <p className="text-sm text-gray-600">{report.period}</p>
              </div>
              <DocumentTextIcon className="w-6 h-6 text-blue-600" />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium text-gray-900 capitalize">{report.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Generated:</span>
                <span className="text-gray-900">{formatDate(report.generated)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Format:</span>
                <span className="text-gray-900">PDF</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 flex items-center justify-center">
                <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                Download
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center justify-center">
                <EyeIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tax Management</h1>
        <p className="text-gray-600 mt-2">Manage tax compliance, filings, and calculations across multiple jurisdictions</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
            { key: 'jurisdictions', label: 'Jurisdictions', icon: GlobeAltIcon },
            { key: 'filings', label: 'Tax Filings', icon: DocumentTextIcon },
            { key: 'calculations', label: 'Calculations', icon: ReceiptPercentIcon },
            { key: 'compliance', label: 'Compliance', icon: ShieldCheckIcon },
            { key: 'reports', label: 'Reports', icon: DocumentArrowDownIcon }
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
      {activeTab === 'jurisdictions' && renderJurisdictions()}
      {activeTab === 'filings' && renderFilings()}
      {activeTab === 'calculations' && renderCalculations()}
      {activeTab === 'compliance' && renderCompliance()}
      {activeTab === 'reports' && renderReports()}
    </div>
  );
};

export default TaxManagement;