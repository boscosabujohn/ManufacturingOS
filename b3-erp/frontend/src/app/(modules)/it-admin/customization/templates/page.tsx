'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, FileText, Mail, Download, Copy, Edit, Trash2, Eye, Code } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'document' | 'report' | 'invoice' | 'label';
  category: string;
  content: string;
  variables: string[];
  format: 'html' | 'pdf' | 'docx' | 'plain';
  lastModified: string;
  usageCount: number;
  isDefault: boolean;
  active: boolean;
}

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Sales Order Confirmation',
      description: 'Email sent to customers when order is confirmed',
      type: 'email',
      category: 'Sales',
      content: '<h1>Order Confirmation</h1><p>Dear {customer_name},</p><p>Your order #{order_number} has been confirmed...</p>',
      variables: ['customer_name', 'order_number', 'order_date', 'total_amount', 'items'],
      format: 'html',
      lastModified: '2024-01-18',
      usageCount: 1247,
      isDefault: true,
      active: true
    },
    {
      id: '2',
      name: 'Invoice Template',
      description: 'Standard invoice document for customer billing',
      type: 'invoice',
      category: 'Finance',
      content: 'Invoice #: {invoice_number}\nDate: {invoice_date}\nBill To: {customer_name}...',
      variables: ['invoice_number', 'invoice_date', 'customer_name', 'customer_address', 'line_items', 'subtotal', 'tax', 'total'],
      format: 'pdf',
      lastModified: '2024-01-15',
      usageCount: 3456,
      isDefault: true,
      active: true
    },
    {
      id: '3',
      name: 'Quotation Document',
      description: 'Professional quotation template for customers',
      type: 'document',
      category: 'Sales',
      content: 'QUOTATION\n\nQuote #: {quote_number}\nValid Until: {valid_until}\nTo: {customer_name}...',
      variables: ['quote_number', 'valid_until', 'customer_name', 'items', 'terms', 'total'],
      format: 'pdf',
      lastModified: '2024-01-12',
      usageCount: 892,
      isDefault: false,
      active: true
    },
    {
      id: '4',
      name: 'Payment Receipt',
      description: 'Email receipt sent after payment is received',
      type: 'email',
      category: 'Finance',
      content: '<h2>Payment Receipt</h2><p>Thank you for your payment of {amount}...</p>',
      variables: ['customer_name', 'amount', 'payment_date', 'payment_method', 'invoice_number'],
      format: 'html',
      lastModified: '2024-01-20',
      usageCount: 2134,
      isDefault: true,
      active: true
    },
    {
      id: '5',
      name: 'Welcome Email',
      description: 'Welcome email for new customers',
      type: 'email',
      category: 'Customer',
      content: '<h1>Welcome to B3 Manufacturing!</h1><p>Dear {customer_name}, Thank you for choosing us...</p>',
      variables: ['customer_name', 'company_name', 'account_number'],
      format: 'html',
      lastModified: '2024-01-10',
      usageCount: 234,
      isDefault: true,
      active: true
    },
    {
      id: '6',
      name: 'Work Order Sheet',
      description: 'Production work order document',
      type: 'document',
      category: 'Production',
      content: 'WORK ORDER #{work_order_number}\nProduct: {product_name}\nQuantity: {quantity}...',
      variables: ['work_order_number', 'product_name', 'quantity', 'start_date', 'due_date', 'bom_items'],
      format: 'pdf',
      lastModified: '2024-01-14',
      usageCount: 2847,
      isDefault: true,
      active: true
    },
    {
      id: '7',
      name: 'Shipping Label',
      description: 'Standard shipping label for packages',
      type: 'label',
      category: 'Logistics',
      content: 'FROM:\n{company_name}\n{company_address}\n\nTO:\n{customer_name}\n{shipping_address}...',
      variables: ['company_name', 'company_address', 'customer_name', 'shipping_address', 'tracking_number', 'weight'],
      format: 'pdf',
      lastModified: '2024-01-16',
      usageCount: 5678,
      isDefault: true,
      active: true
    },
    {
      id: '8',
      name: 'Monthly Sales Report',
      description: 'Automated monthly sales summary report',
      type: 'report',
      category: 'Sales',
      content: 'SALES REPORT - {month} {year}\n\nTotal Orders: {total_orders}\nRevenue: {total_revenue}...',
      variables: ['month', 'year', 'total_orders', 'total_revenue', 'top_products', 'top_customers'],
      format: 'pdf',
      lastModified: '2024-01-19',
      usageCount: 24,
      isDefault: false,
      active: true
    },
    {
      id: '9',
      name: 'Password Reset Email',
      description: 'Email sent for password reset requests',
      type: 'email',
      category: 'System',
      content: '<h2>Password Reset Request</h2><p>Click the link below to reset your password: {reset_link}</p>',
      variables: ['user_name', 'reset_link', 'expiry_time'],
      format: 'html',
      lastModified: '2024-01-08',
      usageCount: 156,
      isDefault: true,
      active: true
    },
    {
      id: '10',
      name: 'Delivery Note',
      description: 'Document accompanying shipments',
      type: 'document',
      category: 'Logistics',
      content: 'DELIVERY NOTE\n\nDelivery #: {delivery_number}\nOrder #: {order_number}\nItems: {items}...',
      variables: ['delivery_number', 'order_number', 'items', 'delivery_date', 'customer_name', 'signature'],
      format: 'pdf',
      lastModified: '2024-01-17',
      usageCount: 4521,
      isDefault: true,
      active: true
    },
    {
      id: '11',
      name: 'Quality Check Report',
      description: 'Quality inspection report template',
      type: 'report',
      category: 'Production',
      content: 'QUALITY INSPECTION REPORT\n\nProduct: {product_name}\nInspector: {inspector_name}\nResult: {result}...',
      variables: ['product_name', 'inspector_name', 'inspection_date', 'result', 'defects', 'notes'],
      format: 'pdf',
      lastModified: '2024-01-11',
      usageCount: 1234,
      isDefault: false,
      active: true
    },
    {
      id: '12',
      name: 'Purchase Order',
      description: 'Purchase order sent to suppliers',
      type: 'document',
      category: 'Purchasing',
      content: 'PURCHASE ORDER #{po_number}\n\nSupplier: {supplier_name}\nDelivery Date: {delivery_date}...',
      variables: ['po_number', 'supplier_name', 'delivery_date', 'items', 'total_amount', 'payment_terms'],
      format: 'pdf',
      lastModified: '2024-01-13',
      usageCount: 1567,
      isDefault: true,
      active: true
    }
  ]);

  const templateTypes = [
    { id: 'all', name: 'All Templates', icon: FileText, count: templates.length },
    { id: 'email', name: 'Email Templates', icon: Mail, count: templates.filter(t => t.type === 'email').length },
    { id: 'document', name: 'Documents', icon: FileText, count: templates.filter(t => t.type === 'document').length },
    { id: 'report', name: 'Reports', icon: FileText, count: templates.filter(t => t.type === 'report').length },
    { id: 'invoice', name: 'Invoices', icon: FileText, count: templates.filter(t => t.type === 'invoice').length },
    { id: 'label', name: 'Labels', icon: FileText, count: templates.filter(t => t.type === 'label').length }
  ];

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      email: 'bg-blue-50 text-blue-700 border-blue-200',
      document: 'bg-green-50 text-green-700 border-green-200',
      report: 'bg-purple-50 text-purple-700 border-purple-200',
      invoice: 'bg-orange-50 text-orange-700 border-orange-200',
      label: 'bg-pink-50 text-pink-700 border-pink-200'
    };
    return colors[type] || colors.document;
  };

  const getFormatColor = (format: string) => {
    const colors: { [key: string]: string } = {
      html: 'bg-blue-100 text-blue-800',
      pdf: 'bg-red-100 text-red-800',
      docx: 'bg-blue-100 text-blue-800',
      plain: 'bg-gray-100 text-gray-800'
    };
    return colors[format] || colors.plain;
  };

  const filteredTemplates = selectedType === 'all'
    ? templates
    : templates.filter(t => t.type === selectedType);

  const handleDuplicate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const newTemplate = {
        ...template,
        id: `${Date.now()}`,
        name: `${template.name} (Copy)`,
        isDefault: false,
        usageCount: 0
      };
      setTemplates(prev => [...prev, newTemplate]);
    }
  };

  const handleDelete = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const handleToggleActive = (templateId: string) => {
    setTemplates(prev =>
      prev.map(t =>
        t.id === templateId ? { ...t, active: !t.active } : t
      )
    );
  };

  const stats = {
    totalTemplates: templates.length,
    activeTemplates: templates.filter(t => t.active).length,
    defaultTemplates: templates.filter(t => t.isDefault).length,
    totalUsage: templates.reduce((acc, t) => acc + t.usageCount, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-2">
      <div className="mb-3 flex items-center gap-2">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Document Templates</h1>
          <p className="text-sm text-gray-500 mt-1">Manage templates for emails, documents, reports, and labels</p>
        </div>
        <button
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Template
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Templates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTemplates}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeTemplates}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Default Templates</p>
              <p className="text-2xl font-bold text-purple-600">{stats.defaultTemplates}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Download className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Usage</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalUsage.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Template Types */}
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Template Types</h2>

          <div className="space-y-2">
            {templateTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <IconComponent className={`w-4 h-4 ${selectedType === type.id ? 'text-blue-600' : 'text-gray-600'}`} />
                    <p className="font-medium text-gray-900 text-sm">{type.name}</p>
                  </div>
                  <p className="text-xs text-gray-600 ml-6">{type.count} templates</p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
            <h3 className="text-sm font-bold text-blue-900 mb-3">Quick Tips</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Use {'{'}variables{'}'} for dynamic content</li>
              <li>• Test templates before using</li>
              <li>• Duplicate to create variations</li>
              <li>• Default templates are auto-selected</li>
            </ul>
          </div>
        </div>

        {/* Templates List */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-3">
          <div className="mb-2">
            <h2 className="text-lg font-bold text-gray-900">
              {selectedType === 'all' ? 'All Templates' : templateTypes.find(t => t.id === selectedType)?.name}
            </h2>
            <p className="text-sm text-gray-600">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="space-y-2">
            {filteredTemplates.map((template) => (
              <div key={template.id} className={`border-2 rounded-lg p-5 ${template.active ? 'border-gray-200' : 'border-gray-200 bg-gray-50 opacity-70'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className={template.active ? 'w-5 h-5 text-blue-600' : 'w-5 h-5 text-gray-400'} />
                      <div>
                        <h3 className="font-bold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-2 py-1 rounded border ${getTypeColor(template.type)}`}>
                        {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getFormatColor(template.format)}`}>
                        {template.format.toUpperCase()}
                      </span>
                      <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded border border-purple-200">
                        {template.category}
                      </span>
                      {template.isDefault && (
                        <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded border border-green-200">
                          Default
                        </span>
                      )}
                      {!template.active && (
                        <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">Variables ({template.variables.length}):</p>
                        <div className="flex flex-wrap gap-1">
                          {template.variables.slice(0, 5).map((variable, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded font-mono">
                              {'{' + variable + '}'}
                            </span>
                          ))}
                          {template.variables.length > 5 && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                              +{template.variables.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">Statistics:</p>
                        <div className="space-y-1 text-xs text-gray-700">
                          <p><span className="text-gray-600">Usage Count:</span> <span className="font-semibold">{template.usageCount.toLocaleString()}</span></p>
                          <p><span className="text-gray-600">Last Modified:</span> <span className="font-semibold">{template.lastModified}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedTemplate(template);
                        setShowPreview(true);
                      }}
                      className="p-2 hover:bg-purple-50 rounded-lg text-purple-600"
                     
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(template.id)}
                      className="p-2 hover:bg-green-50 rounded-lg text-green-600"
                     
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                     
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    {!template.isDefault && (
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                       
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-600 font-medium">No templates found</p>
              <p className="text-sm text-gray-500">Create a new template to get started</p>
            </div>
          )}

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-yellow-900 mb-2">Template Guidelines:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Variables are case-sensitive and must match exactly</li>
              <li>• HTML templates support full CSS styling</li>
              <li>• PDF templates are generated from HTML or plain text</li>
              <li>• Default templates cannot be deleted, only deactivated</li>
              <li>• Test all templates with sample data before deployment</li>
              <li>• Keep backups of custom templates before making changes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedTemplate.name}</h2>
                <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
              </div>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setSelectedTemplate(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-700">Template Content</h3>
                </div>
                <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs overflow-x-auto">
                  {selectedTemplate.content}
                </pre>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Available Variables</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variables.map((variable, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded border border-blue-200 font-mono">
                      {'{' + variable + '}'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
