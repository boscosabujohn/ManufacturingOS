'use client';

import { useState } from 'react';
import {
  Sparkles,
  DollarSign,
  GitBranch,
  Wand2,
  Shield,
  FileText,
  PenTool,
  BarChart3,
  ArrowRight,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { PricingRulesEngine, PricingRule } from '@/components/cpq/PricingRulesEngine';
import { PricingVersionControl, PricingVersion } from '@/components/cpq/PricingVersionControl';
import { GuidedSellingWizard, WizardStep, Question } from '@/components/cpq/GuidedSellingWizard';
import { ApprovalMatrix, ApprovalThreshold, ApprovalRequest } from '@/components/cpq/ApprovalMatrix';
import { DocumentGenerator, DocumentTemplate, GeneratedDocument } from '@/components/cpq/DocumentGenerator';
import { ESignatureIntegration, SignatureDocument } from '@/components/cpq/ESignatureIntegration';
import { MarginAnalysis, QuoteMarginAnalysis, MarginGuardrail } from '@/components/cpq/MarginAnalysis';

// Mock Data
const mockRules: PricingRule[] = [
  {
    id: '1',
    name: 'Volume Discount - Enterprise',
    description: 'Automatic 15% discount for orders over $50,000',
    type: 'volume',
    priority: 10,
    status: 'active',
    conditions: [
      { id: 'c1', field: 'deal_value', operator: 'greater_than', value: 50000 },
    ],
    actions: [
      { type: 'add_discount', value: 15, applyTo: 'total' },
    ],
    validFrom: '2025-01-01',
    createdBy: 'Admin',
    createdAt: '2025-01-15',
    lastModified: '2025-01-20',
    executionCount: 47,
  },
  {
    id: '2',
    name: 'Bundle Pricing - Starter Pack',
    description: '20% discount when buying all starter products together',
    type: 'bundle',
    priority: 8,
    status: 'active',
    conditions: [
      { id: 'c2', field: 'product_category', operator: 'equals', value: 'starter_pack' },
      { id: 'c3', field: 'quantity', operator: 'greater_than', value: 3, logicOperator: 'AND' },
    ],
    actions: [
      { type: 'add_discount', value: 20, applyTo: 'line_items' },
    ],
    createdBy: 'Sales Manager',
    createdAt: '2025-01-10',
    lastModified: '2025-01-18',
    executionCount: 23,
  },
];

const mockVersions: PricingVersion[] = [
  {
    id: '1',
    version: 'v2.1',
    name: 'Q1 2025 Price Increase',
    description: 'Annual price adjustment reflecting increased manufacturing costs',
    status: 'active',
    changeType: 'price_increase',
    createdBy: 'Pricing Team',
    createdAt: '2025-01-10T10:00:00Z',
    activatedAt: '2025-01-15T08:00:00Z',
    lastModified: '2025-01-15T08:00:00Z',
    changes: [
      { productId: '1', productName: 'Product A', oldPrice: 100, newPrice: 105, changePercent: 5 },
      { productId: '2', productName: 'Product B', oldPrice: 200, newPrice: 215, changePercent: 7.5 },
      { productId: '3', productName: 'Product C', oldPrice: 300, newPrice: 309, changePercent: 3 },
    ],
    totalItems: 45,
    avgPriceChange: 5.2,
    approvedBy: 'VP Sales',
    approvedAt: '2025-01-14T16:00:00Z',
  },
  {
    id: '2',
    version: 'v2.0',
    name: 'Holiday Promotion 2024',
    description: 'Temporary price reductions for year-end promotion',
    status: 'archived',
    changeType: 'price_decrease',
    createdBy: 'Marketing',
    createdAt: '2024-11-15T10:00:00Z',
    activatedAt: '2024-12-01T00:00:00Z',
    lastModified: '2024-12-31T23:59:59Z',
    changes: [
      { productId: '1', productName: 'Product A', oldPrice: 100, newPrice: 85, changePercent: -15 },
      { productId: '2', productName: 'Product B', oldPrice: 200, newPrice: 170, changePercent: -15 },
    ],
    totalItems: 30,
    avgPriceChange: -12.5,
    approvedBy: 'CEO',
    approvedAt: '2024-11-20T14:00:00Z',
  },
];

const mockWizardSteps: WizardStep[] = [
  {
    id: 'step1',
    title: 'Business Requirements',
    description: 'Tell us about your business needs',
    icon: Sparkles,
    status: 'active',
    questions: [
      {
        id: 'q1',
        title: 'What is your company size?',
        type: 'single',
        required: true,
        options: [
          { id: 'o1', label: '1-10 employees', value: 'small', icon: TrendingUp, popular: true },
          { id: 'o2', label: '11-50 employees', value: 'medium', icon: TrendingUp },
          { id: 'o3', label: '51-200 employees', value: 'large', icon: TrendingUp, recommended: true },
          { id: 'o4', label: '200+ employees', value: 'enterprise', icon: TrendingUp },
        ],
      },
    ],
  },
];

const mockThresholds: ApprovalThreshold[] = [
  {
    id: '1',
    name: 'Large Deal Approval',
    description: 'Requires director approval for deals over $100K',
    condition: {
      type: 'deal_value',
      operator: 'greater_than',
      value: 100000,
    },
    requiredApprovers: [
      { role: 'director', count: 1 },
    ],
    autoEscalateAfterHours: 48,
    priority: 'high',
  },
];

const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: '1',
    quoteId: 'Q-2025-001',
    quoteName: 'Enterprise Manufacturing Solution',
    customerName: 'Global Tech Industries',
    dealValue: 125000,
    discountPercent: 18,
    marginPercent: 32,
    requestedBy: 'Sarah Johnson',
    requestedAt: '2025-01-20T10:00:00Z',
    status: 'pending',
    approvers: [
      {
        id: 'a1',
        name: 'Michael Chen',
        email: 'michael@company.com',
        role: 'director',
        order: 1,
        status: 'pending',
      },
    ],
    threshold: mockThresholds[0],
    currentApprovalLevel: 1,
    totalApprovalLevels: 1,
    justification: 'Strategic account with high growth potential and multi-year commitment',
  },
];

const mockTemplates: DocumentTemplate[] = [
  {
    id: '1',
    name: 'Standard Sales Quote',
    description: 'Professional quote template with company branding',
    type: 'quote',
    status: 'active',
    fields: [
      { id: 'f1', name: 'customer_name', label: 'Customer Name', type: 'text', required: true },
      { id: 'f2', name: 'total_amount', label: 'Total Amount', type: 'currency', required: true },
    ],
    sections: [
      { id: 's1', title: 'Introduction', content: 'Thank you for your interest...', order: 1, editable: true },
      { id: 's2', title: 'Pricing', content: 'See attached pricing details...', order: 2, editable: false },
    ],
    createdBy: 'Sales Ops',
    createdAt: '2025-01-01T00:00:00Z',
    lastModified: '2025-01-15T00:00:00Z',
    usageCount: 145,
    version: '2.0',
  },
];

const mockDocuments: GeneratedDocument[] = [
  {
    id: '1',
    templateId: '1',
    templateName: 'Standard Sales Quote',
    documentType: 'quote',
    title: 'Quote for Global Tech Industries',
    customer: {
      name: 'John Smith',
      email: 'john@globaltech.com',
      company: 'Global Tech Industries',
    },
    data: {},
    status: 'sent',
    createdBy: 'Sarah Johnson',
    createdAt: '2025-01-20T10:00:00Z',
    sentAt: '2025-01-20T11:00:00Z',
  },
];

const mockSignatureDocs: SignatureDocument[] = [
  {
    id: '1',
    title: 'Enterprise Service Agreement - Global Tech',
    description: 'Three-year service agreement for manufacturing platform',
    status: 'awaiting',
    documentType: 'contract',
    fileUrl: '/docs/contract.pdf',
    fileName: 'contract-globaltech-2025.pdf',
    fileSize: 245000,
    signers: [
      {
        id: 's1',
        name: 'John Smith',
        email: 'john@globaltech.com',
        role: 'signer',
        order: 1,
        status: 'signed',
        signedAt: '2025-01-21T14:30:00Z',
        ipAddress: '192.168.1.100',
        location: 'New York, USA',
      },
      {
        id: 's2',
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        role: 'signer',
        order: 2,
        status: 'pending',
      },
    ],
    createdBy: 'Sales Team',
    createdAt: '2025-01-20T10:00:00Z',
    sentAt: '2025-01-20T11:00:00Z',
    expiresAt: '2025-02-20T23:59:59Z',
    remindersSent: 1,
    lastReminderAt: '2025-01-22T09:00:00Z',
    securityOptions: {
      requireIdVerification: true,
      allowPrinting: false,
      allowDownload: false,
      watermark: true,
    },
    auditTrail: [
      {
        timestamp: '2025-01-20T10:00:00Z',
        actor: 'Sarah Johnson',
        action: 'Document Created',
        details: 'Created from template',
      },
      {
        timestamp: '2025-01-20T11:00:00Z',
        actor: 'System',
        action: 'Document Sent',
        details: 'Sent to 2 signers',
      },
    ],
  },
];

const mockQuotes: QuoteMarginAnalysis[] = [
  {
    id: '1',
    quoteId: 'Q-2025-001',
    quoteName: 'Enterprise Manufacturing Solution',
    customer: 'Global Tech Industries',
    totalRevenue: 125000,
    totalCost: 75000,
    totalMargin: 50000,
    marginPercent: 40,
    status: 'healthy',
    products: [
      {
        id: 'p1',
        productId: 'PROD-001',
        productName: 'Manufacturing Platform License',
        category: 'Software',
        basePrice: 50000,
        cost: 25000,
        sellingPrice: 45000,
        discountPercent: 10,
        discountAmount: 5000,
        marginAmount: 20000,
        marginPercent: 44.4,
        status: 'healthy',
        quantity: 1,
        totalRevenue: 45000,
        totalCost: 25000,
        totalMargin: 20000,
      },
    ],
    createdBy: 'Sarah Johnson',
    createdAt: '2025-01-20T10:00:00Z',
    lastModified: '2025-01-20T15:00:00Z',
  },
];

const mockGuardrails: MarginGuardrail[] = [
  {
    id: '1',
    name: 'Minimum Margin Protection',
    type: 'min_margin',
    threshold: 25,
    enabled: true,
    action: 'require_approval',
    notifyRoles: ['Sales Manager', 'Director'],
    description: 'Requires approval when margin falls below 25%',
  },
  {
    id: '2',
    name: 'Maximum Discount Cap',
    type: 'max_discount',
    threshold: 20,
    enabled: true,
    action: 'block',
    notifyRoles: ['VP Sales'],
    description: 'Blocks deals with discounts exceeding 20%',
  },
];

export default function CPQAdvancedFeaturesPage() {
  const [activeTab, setActiveTab] = useState<string>('pricing-rules');

  const features = [
    {
      id: 'pricing-rules',
      name: 'Pricing Rules Engine',
      icon: DollarSign,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      description: 'Automated pricing logic with conditional rules',
    },
    {
      id: 'version-control',
      name: 'Version Control',
      icon: GitBranch,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      description: 'Track pricing changes and manage versions',
    },
    {
      id: 'guided-selling',
      name: 'Guided Selling',
      icon: Wand2,
      color: 'text-green-600',
      bg: 'bg-green-50',
      description: 'Step-by-step product configuration wizard',
    },
    {
      id: 'approvals',
      name: 'Approval Workflows',
      icon: Shield,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      description: 'Multi-level approval matrices and thresholds',
    },
    {
      id: 'documents',
      name: 'Document Generation',
      icon: FileText,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      description: 'Template-based document creation',
    },
    {
      id: 'e-signature',
      name: 'E-Signature',
      icon: PenTool,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
      description: 'Digital signature workflows and tracking',
    },
    {
      id: 'margin-analysis',
      name: 'Margin Analysis',
      icon: BarChart3,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      description: 'Real-time margin analytics and guardrails',
    },
  ];

  const activeFeature = features.find((f) => f.id === activeTab);

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Sparkles className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">CPQ Advanced Features</h1>
        </div>
        <p className="text-gray-600">
          Enterprise-grade CPQ capabilities including pricing automation, approval workflows, document generation, and margin analytics
        </p>
      </div>

      {/* Feature Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
        <div className="grid grid-cols-7 divide-x divide-gray-200">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isActive = feature.id === activeTab;

            return (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`p-4 transition-all ${
                  isActive
                    ? `${feature.bg} border-b-4 border-current ${feature.color}`
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`p-3 rounded-lg ${isActive ? 'bg-white' : feature.bg}`}>
                    <Icon className={`h-6 w-6 ${isActive ? feature.color : 'text-gray-500'}`} />
                  </div>
                  <span className={`text-xs font-semibold text-center ${isActive ? feature.color : 'text-gray-700'}`}>
                    {feature.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature Description */}
      {activeFeature && (
        <div className={`mb-6 ${activeFeature.bg} rounded-lg border border-gray-200 p-4`}>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-white rounded-lg">
              <activeFeature.icon className={`h-6 w-6 ${activeFeature.color}`} />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${activeFeature.color} mb-1`}>{activeFeature.name}</h2>
              <p className="text-sm text-gray-700">{activeFeature.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Feature Content */}
      <div>
        {activeTab === 'pricing-rules' && (
          <PricingRulesEngine
            rules={mockRules}
            onCreateRule={() => alert('Create pricing rule')}
            onEditRule={(id) => alert(`Edit rule ${id}`)}
            onDeleteRule={(id) => alert(`Delete rule ${id}`)}
            onDuplicateRule={(id) => alert(`Duplicate rule ${id}`)}
            onToggleStatus={(id) => alert(`Toggle status ${id}`)}
            onTestRule={(id) => alert(`Test rule ${id}`)}
          />
        )}

        {activeTab === 'version-control' && (
          <PricingVersionControl
            versions={mockVersions}
            currentVersion="1"
            onCreateVersion={() => alert('Create new version')}
            onActivateVersion={(id) => alert(`Activate version ${id}`)}
            onArchiveVersion={(id) => alert(`Archive version ${id}`)}
            onViewVersion={(id) => alert(`View version ${id}`)}
            onCompareVersions={(id1, id2) => alert(`Compare ${id1} vs ${id2}`)}
            onDuplicateVersion={(id) => alert(`Duplicate version ${id}`)}
            onRollbackVersion={(id) => alert(`Rollback to version ${id}`)}
            onExportVersion={(id) => alert(`Export version ${id}`)}
          />
        )}

        {activeTab === 'guided-selling' && (
          <GuidedSellingWizard
            steps={mockWizardSteps}
            onComplete={(answers, recommendations) => alert('Wizard completed!')}
            onCancel={() => alert('Wizard cancelled')}
            showRecommendations={true}
          />
        )}

        {activeTab === 'approvals' && (
          <ApprovalMatrix
            thresholds={mockThresholds}
            approvalRequests={mockApprovalRequests}
            currentUserRole="director"
            onCreateThreshold={() => alert('Create threshold')}
            onEditThreshold={(id) => alert(`Edit threshold ${id}`)}
            onDeleteThreshold={(id) => alert(`Delete threshold ${id}`)}
            onApprove={(id, comments) => alert(`Approve request ${id}`)}
            onReject={(id, comments) => alert(`Reject request ${id}: ${comments}`)}
            onEscalate={(id) => alert(`Escalate request ${id}`)}
            onViewRequest={(id) => alert(`View request ${id}`)}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentGenerator
            templates={mockTemplates}
            documents={mockDocuments}
            onCreateTemplate={() => alert('Create template')}
            onEditTemplate={(id) => alert(`Edit template ${id}`)}
            onDeleteTemplate={(id) => alert(`Delete template ${id}`)}
            onDuplicateTemplate={(id) => alert(`Duplicate template ${id}`)}
            onGenerateDocument={(id) => alert(`Generate document from template ${id}`)}
            onViewDocument={(id) => alert(`View document ${id}`)}
            onDownloadDocument={(id) => alert(`Download document ${id}`)}
            onSendDocument={(id) => alert(`Send document ${id}`)}
            onPreviewTemplate={(id) => alert(`Preview template ${id}`)}
          />
        )}

        {activeTab === 'e-signature' && (
          <ESignatureIntegration
            documents={mockSignatureDocs}
            onSendDocument={(id) => alert(`Send document ${id} for signature`)}
            onVoidDocument={(id, reason) => alert(`Void document ${id}: ${reason}`)}
            onResendDocument={(id) => alert(`Resend document ${id}`)}
            onSendReminder={(docId, signerId) => alert(`Send reminder to signer ${signerId} for doc ${docId}`)}
            onDownloadDocument={(id) => alert(`Download signed document ${id}`)}
            onViewDocument={(id) => alert(`View document ${id}`)}
            onViewAuditTrail={(id) => alert(`View audit trail for ${id}`)}
            onUploadDocument={() => alert('Upload new document')}
          />
        )}

        {activeTab === 'margin-analysis' && (
          <MarginAnalysis
            quotes={mockQuotes}
            guardrails={mockGuardrails}
            targetMargin={30}
            onEditGuardrail={(id) => alert(`Edit guardrail ${id}`)}
            onToggleGuardrail={(id) => alert(`Toggle guardrail ${id}`)}
            onCreateGuardrail={() => alert('Create guardrail')}
            onViewQuote={(id) => alert(`View quote ${id}`)}
            onOptimizeMargin={(id) => alert(`Optimize margin for quote ${id}`)}
            onExportAnalysis={() => alert('Export margin analysis')}
          />
        )}
      </div>
    </div>
  );
}
