'use client';

import React, { useState } from 'react';
import {
  X,
  FileText,
  Copy,
  Eye,
  Edit,
  Check,
  AlertCircle,
  Upload,
  Download,
  Trash2,
  Star,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Tag,
  Layers
} from 'lucide-react';

// Types
export interface TemplateSection {
  id: string;
  type: 'cover' | 'text' | 'quote' | 'table' | 'image' | 'terms';
  title: string;
  content: string;
  order: number;
  editable: boolean;
}

export interface ProposalTemplate {
  id: string;
  templateCode: string;
  templateName: string;
  category: string;
  description: string;
  sections: number;
  pages: number;
  usageCount: number;
  successRate: number;
  avgDealSize: number;
  avgClosureTime: number;
  lastUsed: string;
  createdBy: string;
  createdDate: string;
  tags: string[];
  status: 'active' | 'draft' | 'archived';
  thumbnail?: string;
  sectionsData?: TemplateSection[];
}

// Create/Edit Template Modal
interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: ProposalTemplate) => void;
  template: ProposalTemplate | null;
}

export function TemplateModal({ isOpen, onClose, onSave, template }: TemplateModalProps) {
  const [formData, setFormData] = useState<Partial<ProposalTemplate>>(
    template || {
      templateCode: `TPL-${Date.now()}`,
      templateName: '',
      category: 'general',
      description: '',
      tags: [],
      status: 'active',
      sections: 0,
      pages: 0,
      usageCount: 0,
      successRate: 0,
      avgDealSize: 0,
      avgClosureTime: 0,
      createdDate: new Date().toISOString().split('T')[0],
      lastUsed: new Date().toISOString().split('T')[0]
    }
  );

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.templateName?.trim()) {
      newErrors.templateName = 'Template name is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag) || []
    });
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setIsSaving(true);
    setTimeout(() => {
      onSave(formData as ProposalTemplate);
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {template ? 'Edit Template' : 'Create Template'}
              </h2>
              <p className="text-sm text-gray-500">
                {template ? formData.templateCode : 'Create a new proposal template'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={formData.templateName}
                    onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
                    className={`w-full p-2 border rounded-lg ${
                      errors.templateName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter template name"
                  />
                  {errors.templateName && (
                    <p className="text-red-500 text-xs mt-1">{errors.templateName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full p-2 border rounded-lg ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="general">General</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="smb">Small/Medium Business</option>
                    <option value="technical">Technical</option>
                    <option value="consulting">Consulting</option>
                    <option value="saas">SaaS</option>
                    <option value="custom">Custom</option>
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className={`w-full p-2 border rounded-lg ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe this template and when to use it..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                  placeholder="Add tags (press Enter)"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Template Metrics (Only show when editing) */}
            {template && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Performance Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Usage Count</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formData.usageCount}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Success Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formData.successRate}%</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Avg Deal Size</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      ${formData.avgDealSize?.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Avg Closure Time</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formData.avgClosureTime} days</p>
                  </div>
                </div>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{template ? 'Update Template' : 'Create Template'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// View Template Modal
interface ViewTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ProposalTemplate;
}

export function ViewTemplateModal({ isOpen, onClose, template }: ViewTemplateModalProps) {
  if (!isOpen) return null;

  const sampleSections: TemplateSection[] = template.sectionsData || [
    {
      id: '1',
      type: 'cover',
      title: 'Cover Page',
      content: 'Professional cover page with company branding',
      order: 1,
      editable: true
    },
    {
      id: '2',
      type: 'text',
      title: 'Executive Summary',
      content: 'Overview of the proposal and key highlights',
      order: 2,
      editable: true
    },
    {
      id: '3',
      type: 'quote',
      title: 'Pricing & Quote',
      content: 'Detailed pricing breakdown and quote information',
      order: 3,
      editable: true
    },
    {
      id: '4',
      type: 'terms',
      title: 'Terms & Conditions',
      content: 'Standard terms and conditions',
      order: 4,
      editable: false
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">View Template</h2>
              <p className="text-sm text-gray-500">{template.templateCode}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Template Information */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{template.templateName}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                  {template.category}
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full">
                  {template.status}
                </span>
              </div>
              <p className="text-gray-700">{template.description}</p>
            </div>

            {/* Tags */}
            {template.tags && template.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Metrics */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Performance Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Usage Count</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{template.usageCount}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Success Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{template.successRate}%</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600">Avg Deal Size</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${template.avgDealSize.toLocaleString()}
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-600">Avg Closure</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{template.avgClosureTime} days</p>
                </div>
              </div>
            </div>

            {/* Template Structure */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Template Structure</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <Layers className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Sections</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{template.sections}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Pages</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{template.pages}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Last Used</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(template.lastUsed).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Section List */}
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-gray-700 uppercase">Sections</h5>
                  {sampleSections.map((section, index) => (
                    <div
                      key={section.id}
                      className="flex items-center justify-between p-3 bg-white rounded border border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{section.title}</p>
                          <p className="text-xs text-gray-500">{section.content}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {section.type}
                        </span>
                        {section.editable ? (
                          <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded">
                            Editable
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            Fixed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Created By:</span>
                <span className="ml-2 font-medium text-gray-900">{template.createdBy}</span>
              </div>
              <div>
                <span className="text-gray-600">Created Date:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {new Date(template.createdDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Use Template Modal
interface UseTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUse: (data: any) => void;
  template: ProposalTemplate;
}

export function UseTemplateModal({ isOpen, onClose, onUse, template }: UseTemplateModalProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    quoteId: '',
    projectName: '',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customizeSections: true,
    applyBranding: true,
    includeAllSections: true,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Customer email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }

    if (!formData.validUntil) {
      newErrors.validUntil = 'Valid until date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setIsProcessing(true);
    setTimeout(() => {
      onUse({ ...formData, templateId: template.id });
      setIsProcessing(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Use Template</h2>
              <p className="text-sm text-gray-500">{template.templateName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Template Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Using template: {template.templateName}</p>
                  <p>This template has {template.sections} sections and typically results in {template.pages} pages.</p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Customer Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className={`w-full p-2 border rounded-lg ${
                      errors.customerName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter customer name"
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className={`w-full p-2 border rounded-lg ${
                        errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="customer@example.com"
                    />
                    {errors.customerEmail && (
                      <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Project Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    className={`w-full p-2 border rounded-lg ${
                      errors.projectName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter project name"
                  />
                  {errors.projectName && (
                    <p className="text-red-500 text-xs mt-1">{errors.projectName}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quote/Opportunity ID
                    </label>
                    <input
                      type="text"
                      value={formData.quoteId}
                      onChange={(e) => setFormData({ ...formData, quoteId: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="QT-12345"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valid Until *
                    </label>
                    <input
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className={`w-full p-2 border rounded-lg ${
                        errors.validUntil ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.validUntil && (
                      <p className="text-red-500 text-xs mt-1">{errors.validUntil}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Add any notes or special instructions..."
                  />
                </div>
              </div>
            </div>

            {/* Template Options */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Template Options</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.includeAllSections}
                    onChange={(e) => setFormData({ ...formData, includeAllSections: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Include all template sections</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.applyBranding}
                    onChange={(e) => setFormData({ ...formData, applyBranding: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Apply company branding</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.customizeSections}
                    onChange={(e) => setFormData({ ...formData, customizeSections: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Allow section customization</span>
                </label>
              </div>
            </div>

            {/* Success Prediction */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-900 mb-3">Success Prediction</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-green-700 mb-1">Success Rate</p>
                  <p className="text-2xl font-bold text-green-900">{template.successRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-green-700 mb-1">Avg Deal Size</p>
                  <p className="text-2xl font-bold text-green-900">
                    ${template.avgDealSize.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-green-700 mb-1">Avg Closure</p>
                  <p className="text-2xl font-bold text-green-900">{template.avgClosureTime} days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Proposal...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Create Proposal</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Copy Template Modal
interface CopyTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopy: (data: any) => void;
  template: ProposalTemplate;
}

export function CopyTemplateModal({ isOpen, onClose, onCopy, template }: CopyTemplateModalProps) {
  const [formData, setFormData] = useState({
    newName: `${template.templateName} (Copy)`,
    copyMetrics: false,
    copySections: true,
    copyBranding: true,
    newCategory: template.category
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.newName.trim()) {
      newErrors.newName = 'Template name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCopy = () => {
    if (!validate()) return;
    onCopy(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Copy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Copy Template</h2>
              <p className="text-sm text-gray-500">Create a copy of {template.templateName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Template Name *
              </label>
              <input
                type="text"
                value={formData.newName}
                onChange={(e) => setFormData({ ...formData, newName: e.target.value })}
                className={`w-full p-2 border rounded-lg ${
                  errors.newName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter new template name"
              />
              {errors.newName && (
                <p className="text-red-500 text-xs mt-1">{errors.newName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.newCategory}
                onChange={(e) => setFormData({ ...formData, newCategory: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="general">General</option>
                <option value="enterprise">Enterprise</option>
                <option value="smb">Small/Medium Business</option>
                <option value="technical">Technical</option>
                <option value="consulting">Consulting</option>
                <option value="saas">SaaS</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.copySections}
                  onChange={(e) => setFormData({ ...formData, copySections: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Copy all sections ({template.sections} sections)</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.copyBranding}
                  onChange={(e) => setFormData({ ...formData, copyBranding: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Copy branding and styling</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.copyMetrics}
                  onChange={(e) => setFormData({ ...formData, copyMetrics: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Copy performance metrics</span>
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Template will be created as a draft</p>
                  <p>You can edit and customize the copied template before activating it.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center space-x-2"
          >
            <Copy className="w-4 h-4" />
            <span>Create Copy</span>
          </button>
        </div>
      </div>
    </div>
  );
}
