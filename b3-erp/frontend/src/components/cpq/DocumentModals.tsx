'use client'

import { useState } from 'react'
import {
  X,
  Save,
  Wand2,
  Eye,
  Download,
  Send,
  FileText,
  User,
  Mail,
  Building2,
  Calendar,
  DollarSign,
  Package,
  CheckCircle
} from 'lucide-react'
import type {
  DocumentTemplate,
  GeneratedDocument,
  DocumentType,
  TemplateField
} from './DocumentGenerator'

interface CreateTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (template: Partial<DocumentTemplate>) => void
}

interface GenerateDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (data: any) => void
  template: DocumentTemplate | null
}

interface ViewDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  document: GeneratedDocument | null
  onDownload?: (docId: string) => void
  onSend?: (docId: string) => void
}

interface PreviewTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  template: DocumentTemplate | null
}

export const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'quote' as DocumentType,
    status: 'draft' as 'active' | 'draft' | 'archived'
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      fields: [],
      sections: [],
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      usageCount: 0,
      version: '1.0'
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 flex items-center justify-between rounded-t-xl">
          <h2 className="text-2xl font-bold">Create Document Template</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Standard Quote Template"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as DocumentType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="quote">Quote</option>
                <option value="proposal">Proposal</option>
                <option value="contract">Contract</option>
                <option value="invoice">Invoice</option>
                <option value="sow">Statement of Work</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors"
            >
              <Save className="h-5 w-5" />
              Create Template
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const GenerateDocumentModal: React.FC<GenerateDocumentModalProps> = ({ isOpen, onClose, onGenerate, template }) => {
  const [formData, setFormData] = useState({
    title: '',
    customerName: '',
    customerEmail: '',
    customerCompany: '',
    dealValue: '',
    expiresInDays: '30'
  })

  if (!isOpen || !template) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate({
      templateId: template.id,
      templateName: template.name,
      documentType: template.type,
      title: formData.title,
      customer: {
        name: formData.customerName,
        email: formData.customerEmail,
        company: formData.customerCompany
      },
      dealValue: parseFloat(formData.dealValue),
      expiresInDays: parseInt(formData.expiresInDays)
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold">Generate Document</h2>
            <p className="text-sm opacity-90 mt-1">Using template: {template.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Q1 2025 Manufacturing Solution Quote"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Customer Information</h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
              <input
                type="text"
                required
                value={formData.customerCompany}
                onChange={(e) => setFormData({ ...formData, customerCompany: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deal Value ($)</label>
              <input
                type="number"
                value={formData.dealValue}
                onChange={(e) => setFormData({ ...formData, dealValue: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expires In (Days)</label>
              <input
                type="number"
                value={formData.expiresInDays}
                onChange={(e) => setFormData({ ...formData, expiresInDays: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              <Wand2 className="h-5 w-5" />
              Generate Document
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const ViewDocumentModal: React.FC<ViewDocumentModalProps> = ({ isOpen, onClose, document, onDownload, onSend }) => {
  if (!isOpen || !document) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full  max-h-[90vh] overflow-y-auto">
        <div className={`text-white p-3 flex items-center justify-between rounded-t-xl ${
          document.status === 'signed' ? 'bg-gradient-to-r from-green-600 to-emerald-600' :
          document.status === 'sent' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' :
          'bg-gradient-to-r from-gray-600 to-slate-600'
        }`}>
          <div>
            <h2 className="text-2xl font-bold">{document.title}</h2>
            <p className="text-sm opacity-90 mt-1">{document.templateName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Status & Type */}
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              document.status === 'signed' ? 'bg-green-100 text-green-700' :
              document.status === 'sent' ? 'bg-blue-100 text-blue-700' :
              document.status === 'viewed' ? 'bg-purple-100 text-purple-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {document.status.toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700">
              {document.documentType.toUpperCase()}
            </span>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Customer Information</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Company</p>
                  <p className="font-semibold text-gray-900">{document.customer.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Contact</p>
                  <p className="font-semibold text-gray-900">{document.customer.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-semibold text-gray-900">{document.customer.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-3">Document Timeline</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-blue-800">Created: {new Date(document.createdAt).toLocaleString()}</span>
              </div>
              {document.sentAt && (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">Sent: {new Date(document.sentAt).toLocaleString()}</span>
                </div>
              )}
              {document.viewedAt && (
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">Viewed: {new Date(document.viewedAt).toLocaleString()}</span>
                </div>
              )}
              {document.signedAt && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-800">Signed: {new Date(document.signedAt).toLocaleString()}</span>
                </div>
              )}
              {document.expiresAt && (
                <div className="flex items-center gap-2 text-orange-600">
                  <Calendar className="h-4 w-4" />
                  <span>Expires: {new Date(document.expiresAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Document Preview Placeholder */}
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FileText className="h-16 w-16 text-gray-400 mb-3" />
            <p className="text-gray-600">Document preview would appear here</p>
            <p className="text-sm text-gray-500 mt-1">Full document viewer implementation in production</p>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
          >
            Close
          </button>
          <div className="flex gap-3">
            {onDownload && (
              <button
                onClick={() => onDownload(document.id)}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-5 w-5" />
                Download PDF
              </button>
            )}
            {onSend && document.status === 'draft' && (
              <button
                onClick={() => onSend(document.id)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="h-5 w-5" />
                Send to Customer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const PreviewTemplateModal: React.FC<PreviewTemplateModalProps> = ({ isOpen, onClose, template }) => {
  if (!isOpen || !template) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full  max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold">Template Preview</h2>
            <p className="text-sm opacity-90 mt-1">{template.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Template Info */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Type</p>
              <p className="font-semibold text-gray-900 capitalize">{template.type}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Status</p>
              <p className="font-semibold text-gray-900 capitalize">{template.status}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Fields</p>
              <p className="font-semibold text-gray-900">{template.fields.length}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Usage</p>
              <p className="font-semibold text-gray-900">{template.usageCount} times</p>
            </div>
          </div>

          {/* Template Preview */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8 min-h-96">
            <div className="max-w-3xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-gray-600 mb-3">{template.description}</p>

              {template.sections.map(section => (
                <div key={section.id} className="mb-3">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{section.title}</h4>
                  <p className="text-gray-600">{section.content}</p>
                </div>
              ))}

              {template.fields.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Template Fields:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {template.fields.map(field => (
                      <div key={field.id} className="text-sm text-gray-600 flex items-center gap-2">
                        <Package className="h-3 w-3" />
                        {field.label} ({field.type})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  )
}
