'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Edit,
  Trash2,
  Copy,
  Send,
  Save,
  Plus,
  Image,
  Code,
  Type,
  Table,
  List,
  CheckSquare,
  DollarSign,
  Calendar,
  User,
  Mail,
  Phone,
  Building2,
  Package,
  Sparkles,
  Wand2,
  FileUp,
  Printer,
  Share2,
  Clock,
  Star,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export type DocumentType = 'quote' | 'proposal' | 'contract' | 'invoice' | 'sow' | 'custom';
export type TemplateStatus = 'active' | 'draft' | 'archived';
export type FieldType = 'text' | 'number' | 'date' | 'currency' | 'list' | 'table' | 'image' | 'signature';

export interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  defaultValue?: any;
  placeholder?: string;
  options?: string[]; // for list type
  formula?: string; // for calculated fields
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  type: DocumentType;
  status: TemplateStatus;
  thumbnail?: string;
  fields: TemplateField[];
  sections: {
    id: string;
    title: string;
    content: string;
    order: number;
    editable: boolean;
  }[];
  headerLogo?: string;
  footerText?: string;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  usageCount: number;
  version: string;
}

export interface GeneratedDocument {
  id: string;
  templateId: string;
  templateName: string;
  documentType: DocumentType;
  title: string;
  customer: {
    name: string;
    email: string;
    company: string;
  };
  data: { [key: string]: any };
  status: 'draft' | 'sent' | 'viewed' | 'signed' | 'expired';
  createdBy: string;
  createdAt: string;
  sentAt?: string;
  viewedAt?: string;
  signedAt?: string;
  expiresAt?: string;
  downloadUrl?: string;
  pdfUrl?: string;
}

export interface DocumentGeneratorProps {
  templates: DocumentTemplate[];
  documents: GeneratedDocument[];
  onCreateTemplate?: () => void;
  onEditTemplate?: (templateId: string) => void;
  onDeleteTemplate?: (templateId: string) => void;
  onDuplicateTemplate?: (templateId: string) => void;
  onGenerateDocument?: (templateId: string) => void;
  onViewDocument?: (documentId: string) => void;
  onDownloadDocument?: (documentId: string) => void;
  onSendDocument?: (documentId: string) => void;
  onPreviewTemplate?: (templateId: string) => void;
  className?: string;
}

export const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  templates,
  documents,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  onGenerateDocument,
  onViewDocument,
  onDownloadDocument,
  onSendDocument,
  onPreviewTemplate,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'documents'>('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());

  const getDocTypeConfig = (type: DocumentType) => {
    switch (type) {
      case 'quote':
        return { icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Quote' };
      case 'proposal':
        return { icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Proposal' };
      case 'contract':
        return { icon: FileText, color: 'text-green-600', bg: 'bg-green-50', label: 'Contract' };
      case 'invoice':
        return { icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Invoice' };
      case 'sow':
        return { icon: List, color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'SOW' };
      case 'custom':
        return { icon: FileText, color: 'text-gray-600', bg: 'bg-gray-50', label: 'Custom' };
    }
  };

  const getStatusConfig = (status: TemplateStatus | string) => {
    switch (status) {
      case 'active':
        return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Active' };
      case 'draft':
        return { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Draft' };
      case 'archived':
        return { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', label: 'Archived' };
      case 'sent':
        return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Sent' };
      case 'viewed':
        return { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', label: 'Viewed' };
      case 'signed':
        return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Signed' };
      case 'expired':
        return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Expired' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', label: status };
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || template.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || template.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.documentType === typeFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const templateStats = {
    total: templates.length,
    active: templates.filter((t) => t.status === 'active').length,
    draft: templates.filter((t) => t.status === 'draft').length,
    byType: templates.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {} as Record<DocumentType, number>),
  };

  const documentStats = {
    total: documents.length,
    draft: documents.filter((d) => d.status === 'draft').length,
    sent: documents.filter((d) => d.status === 'sent').length,
    signed: documents.filter((d) => d.status === 'signed').length,
  };

  const toggleExpanded = (docId: string) => {
    setExpandedDocs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(docId)) {
        newSet.delete(docId);
      } else {
        newSet.add(docId);
      }
      return newSet;
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        {activeTab === 'templates' ? (
          <>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Total Templates</p>
              <p className="text-3xl font-bold">{templateStats.total}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Active</p>
              <p className="text-3xl font-bold">{templateStats.active}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Draft</p>
              <p className="text-3xl font-bold">{templateStats.draft}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Most Used</p>
              <p className="text-3xl font-bold">
                {templates.length > 0 ? Math.max(...templates.map((t) => t.usageCount)) : 0}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Total Documents</p>
              <p className="text-3xl font-bold">{documentStats.total}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Draft</p>
              <p className="text-3xl font-bold">{documentStats.draft}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Sent</p>
              <p className="text-3xl font-bold">{documentStats.sent}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Signed</p>
              <p className="text-3xl font-bold">{documentStats.signed}</p>
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 px-6 py-3 font-semibold transition-colors ${
              activeTab === 'templates'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Templates ({templates.length})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 px-6 py-3 font-semibold transition-colors ${
              activeTab === 'documents'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Generated Documents ({documents.length})
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={activeTab === 'templates' ? 'Search templates...' : 'Search documents...'}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="quote">Quote</option>
                <option value="proposal">Proposal</option>
                <option value="contract">Contract</option>
                <option value="invoice">Invoice</option>
                <option value="sow">SOW</option>
                <option value="custom">Custom</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                {activeTab === 'templates' ? (
                  <>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </>
                ) : (
                  <>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="viewed">Viewed</option>
                    <option value="signed">Signed</option>
                    <option value="expired">Expired</option>
                  </>
                )}
              </select>
            </div>

            {/* Create Button */}
            {activeTab === 'templates' && onCreateTemplate && (
              <button
                onClick={onCreateTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Template</span>
              </button>
            )}
          </div>
        </div>

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => {
                const typeConfig = getDocTypeConfig(template.type);
                const statusConfig = getStatusConfig(template.status);
                const TypeIcon = typeConfig.icon;

                return (
                  <div
                    key={template.id}
                    className="bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-lg transition-all overflow-hidden"
                  >
                    {/* Thumbnail */}
                    <div className={`h-32 ${typeConfig.bg} flex items-center justify-center`}>
                      <TypeIcon className={`h-16 w-16 ${typeConfig.color}`} />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900 flex-1">{template.name}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
                        >
                          {statusConfig.label}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span className="flex items-center">
                          <Package className="h-3 w-3 mr-1" />
                          {template.fields.length} fields
                        </span>
                        <span className="flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          Used {template.usageCount} times
                        </span>
                        <span>v{template.version}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {onGenerateDocument && (
                          <button
                            onClick={() => onGenerateDocument(template.id)}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center justify-center space-x-1"
                          >
                            <Wand2 className="h-4 w-4" />
                            <span>Generate</span>
                          </button>
                        )}
                        {onPreviewTemplate && (
                          <button
                            onClick={() => onPreviewTemplate(template.id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                            title="Preview"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        {onEditTemplate && (
                          <button
                            onClick={() => onEditTemplate(template.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        {onDuplicateTemplate && (
                          <button
                            onClick={() => onDuplicateTemplate(template.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        )}
                        {onDeleteTemplate && (
                          <button
                            onClick={() => onDeleteTemplate(template.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No templates found</p>
                {onCreateTemplate && (
                  <button
                    onClick={onCreateTemplate}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create First Template
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="p-6">
            <div className="space-y-3">
              {filteredDocuments.map((doc) => {
                const typeConfig = getDocTypeConfig(doc.documentType);
                const statusConfig = getStatusConfig(doc.status);
                const TypeIcon = typeConfig.icon;
                const isExpanded = expandedDocs.has(doc.id);

                return (
                  <div
                    key={doc.id}
                    className="bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-lg transition-all"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`p-3 rounded-lg ${typeConfig.bg}`}>
                            <TypeIcon className={`h-6 w-6 ${typeConfig.color}`} />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">{doc.title}</h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
                              >
                                {statusConfig.label}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${typeConfig.bg} ${typeConfig.color}`}>
                                {typeConfig.label}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                              <div className="flex items-center">
                                <Building2 className="h-4 w-4 mr-2" />
                                {doc.customer.company}
                              </div>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                {doc.customer.name}
                              </div>
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2" />
                                {doc.customer.email}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {new Date(doc.createdAt).toLocaleDateString()}
                              </div>
                            </div>

                            {doc.expiresAt && (
                              <p className="text-xs text-orange-600">
                                <Clock className="h-3 w-3 inline mr-1" />
                                Expires: {new Date(doc.expiresAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2 ml-4">
                          {onViewDocument && (
                            <button
                              onClick={() => onViewDocument(doc.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          {onDownloadDocument && (
                            <button
                              onClick={() => onDownloadDocument(doc.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                          {onSendDocument && doc.status === 'draft' && (
                            <button
                              onClick={() => onSendDocument(doc.id)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                              title="Send"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => toggleExpanded(doc.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">Timeline</h4>
                              <div className="space-y-2 text-sm text-gray-600">
                                <p>Created: {new Date(doc.createdAt).toLocaleString()}</p>
                                {doc.sentAt && <p>Sent: {new Date(doc.sentAt).toLocaleString()}</p>}
                                {doc.viewedAt && <p>Viewed: {new Date(doc.viewedAt).toLocaleString()}</p>}
                                {doc.signedAt && <p>Signed: {new Date(doc.signedAt).toLocaleString()}</p>}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">Template</h4>
                              <p className="text-sm text-gray-600">{doc.templateName}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No documents found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
