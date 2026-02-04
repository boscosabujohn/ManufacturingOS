'use client';

import React, { useState } from 'react';
import {
  X,
  Save,
  Send,
  FileDown,
  Eye,
  Settings,
  Upload,
  Palette,
  FileText,
  Mail,
  MessageSquare,
  Calendar,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Check,
  AlertCircle
} from 'lucide-react';

// Types
export interface ProposalSection {
  id: string;
  type: 'cover' | 'text' | 'quote' | 'table' | 'image' | 'terms';
  title: string;
  content: string;
  order: number;
  visible: boolean;
}

export interface Proposal {
  id: string;
  proposalNumber: string;
  customerName: string;
  contactEmail: string;
  contactPhone: string;
  quoteId: string;
  sections: ProposalSection[];
  status: 'draft' | 'sent' | 'viewed' | 'signed';
  totalValue: number;
  validUntil: string;
  createdDate: string;
  sentDate?: string;
  viewedDate?: string;
  signedDate?: string;
  branding?: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  settings?: {
    pageSize: 'A4' | 'Letter';
    orientation: 'portrait' | 'landscape';
    includePageNumbers: boolean;
    includeTableOfContents: boolean;
    includeTermsAndConditions: boolean;
  };
}

// Preview Modal
interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: Proposal;
}

export function PreviewModal({ isOpen, onClose, proposal }: PreviewModalProps) {
  if (!isOpen) return null;

  const visibleSections = proposal.sections
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full  max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Preview Proposal</h2>
              <p className="text-sm text-gray-500">{proposal.proposalNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div
            className=" bg-white shadow-lg"
            style={{
              minHeight: '800px',
              padding: '60px'
            }}
          >
            {/* Header with branding */}
            <div className="mb-8 pb-6 border-b-2" style={{ borderColor: proposal.branding?.primaryColor || '#6366f1' }}>
              {proposal.branding?.logo && (
                <img src={proposal.branding.logo} alt="Logo" className="h-16 mb-2" />
              )}
              <h1 className="text-4xl font-bold mb-2" style={{ color: proposal.branding?.primaryColor || '#6366f1' }}>
                Proposal
              </h1>
              <p className="text-gray-600">Proposal #{proposal.proposalNumber}</p>
            </div>

            {/* Customer Information */}
            <div className="mb-8 grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">PREPARED FOR</h3>
                <p className="text-lg font-semibold text-gray-900">{proposal.customerName}</p>
                <p className="text-gray-600">{proposal.contactEmail}</p>
                <p className="text-gray-600">{proposal.contactPhone}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">PROPOSAL DETAILS</h3>
                <p className="text-gray-600">Date: {new Date(proposal.createdDate).toLocaleDateString()}</p>
                <p className="text-gray-600">Valid Until: {new Date(proposal.validUntil).toLocaleDateString()}</p>
                <p className="text-gray-600">Quote ID: {proposal.quoteId}</p>
              </div>
            </div>

            {/* Sections */}
            {visibleSections.map((section) => (
              <div key={section.id} className="mb-8">
                <h2
                  className="text-2xl font-bold mb-2"
                  style={{ color: proposal.branding?.primaryColor || '#6366f1' }}
                >
                  {section.title}
                </h2>
                <div className="text-gray-700 whitespace-pre-wrap">
                  {section.content}
                </div>
              </div>
            ))}

            {/* Footer */}
            <div className="mt-12 pt-6 border-t text-center text-sm text-gray-500">
              <p>© {new Date().getFullYear()} All Rights Reserved</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-3 border-t bg-white">
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

// Send Proposal Modal
interface SendProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: any) => void;
  proposal: Proposal;
}

export function SendProposalModal({ isOpen, onClose, onSend, proposal }: SendProposalModalProps) {
  const [formData, setFormData] = useState({
    recipientEmail: proposal.contactEmail || '',
    recipientName: proposal.customerName || '',
    ccEmails: '',
    subject: `Proposal ${proposal.proposalNumber} from ${proposal.customerName}`,
    message: `Dear ${proposal.customerName},\n\nPlease find attached our proposal for your review.\n\nBest regards,`,
    sendCopy: true,
    requestSignature: true,
    trackViews: true,
    expiryDate: proposal.validUntil || '',
    deliveryMethod: 'email' as 'email' | 'link' | 'both',
    notifyOnView: true,
    notifyOnSign: true,
    reminderDays: '3'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.recipientEmail.trim()) {
      newErrors.recipientEmail = 'Recipient email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.recipientEmail)) {
      newErrors.recipientEmail = 'Please enter a valid email address';
    }

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSending(true);
    setTimeout(() => {
      onSend(formData);
      setIsSending(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Send Proposal</h2>
              <p className="text-sm text-gray-500">{proposal.proposalNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            {/* Delivery Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'email', label: 'Email Only', icon: Mail },
                  { value: 'link', label: 'Link Only', icon: LinkIcon },
                  { value: 'both', label: 'Email + Link', icon: Send }
                ].map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, deliveryMethod: method.value as any })}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                        formData.deliveryMethod === method.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${
                        formData.deliveryMethod === method.value ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                      <span className={`text-sm font-medium ${
                        formData.deliveryMethod === method.value ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {method.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recipient Information */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className={`w-full p-2 border rounded-lg ${
                    errors.recipientName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter recipient name"
                />
                {errors.recipientName && (
                  <p className="text-red-500 text-xs mt-1">{errors.recipientName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Email *
                </label>
                <input
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                  className={`w-full p-2 border rounded-lg ${
                    errors.recipientEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="recipient@example.com"
                />
                {errors.recipientEmail && (
                  <p className="text-red-500 text-xs mt-1">{errors.recipientEmail}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CC Emails (comma-separated)
              </label>
              <input
                type="text"
                value={formData.ccEmails}
                onChange={(e) => setFormData({ ...formData, ccEmails: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="email1@example.com, email2@example.com"
              />
            </div>

            {/* Email Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className={`w-full p-2 border rounded-lg ${
                  errors.subject ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter email subject"
              />
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className={`w-full p-2 border rounded-lg ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your message"
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
              )}
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className={`w-full p-2 border rounded-lg ${
                    errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reminder (days)
                </label>
                <select
                  value={formData.reminderDays}
                  onChange={(e) => setFormData({ ...formData, reminderDays: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="1">1 day</option>
                  <option value="2">2 days</option>
                  <option value="3">3 days</option>
                  <option value="5">5 days</option>
                  <option value="7">7 days</option>
                </select>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.requestSignature}
                  onChange={(e) => setFormData({ ...formData, requestSignature: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Request digital signature</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.trackViews}
                  onChange={(e) => setFormData({ ...formData, trackViews: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Track when proposal is viewed</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.notifyOnView}
                  onChange={(e) => setFormData({ ...formData, notifyOnView: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Notify me when viewed</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.notifyOnSign}
                  onChange={(e) => setFormData({ ...formData, notifyOnSign: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Notify me when signed</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.sendCopy}
                  onChange={(e) => setFormData({ ...formData, sendCopy: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Send me a copy</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-3 border-t bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSending}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSending}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Proposal</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Export PDF Modal
interface ExportPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (settings: any) => void;
  proposal: Proposal;
}

export function ExportPDFModal({ isOpen, onClose, onExport, proposal }: ExportPDFModalProps) {
  const [settings, setSettings] = useState({
    pageSize: proposal.settings?.pageSize || 'A4',
    orientation: proposal.settings?.orientation || 'portrait',
    includePageNumbers: proposal.settings?.includePageNumbers ?? true,
    includeTableOfContents: proposal.settings?.includeTableOfContents ?? true,
    includeTermsAndConditions: proposal.settings?.includeTermsAndConditions ?? true,
    watermark: '',
    headerText: '',
    footerText: '© 2024 All Rights Reserved',
    compression: 'standard' as 'low' | 'standard' | 'high',
    security: {
      requirePassword: false,
      password: '',
      allowPrinting: true,
      allowCopying: true,
      allowModification: false
    }
  });

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      onExport(settings);
      setIsExporting(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <FileDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Export to PDF</h2>
              <p className="text-sm text-gray-500">Configure PDF export settings</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            {/* Page Settings */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Page Settings</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Size
                  </label>
                  <select
                    value={settings.pageSize}
                    onChange={(e) => setSettings({ ...settings, pageSize: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="A4">A4 (210 × 297 mm)</option>
                    <option value="Letter">Letter (8.5 × 11 in)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orientation
                  </label>
                  <select
                    value={settings.orientation}
                    onChange={(e) => setSettings({ ...settings, orientation: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Content Options */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Content Options</h3>
              <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.includePageNumbers}
                    onChange={(e) => setSettings({ ...settings, includePageNumbers: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Include page numbers</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.includeTableOfContents}
                    onChange={(e) => setSettings({ ...settings, includeTableOfContents: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Include table of contents</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.includeTermsAndConditions}
                    onChange={(e) => setSettings({ ...settings, includeTermsAndConditions: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Include terms and conditions</span>
                </label>
              </div>
            </div>

            {/* Header & Footer */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Header & Footer</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Text
                  </label>
                  <input
                    type="text"
                    value={settings.headerText}
                    onChange={(e) => setSettings({ ...settings, headerText: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Optional header text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footer Text
                  </label>
                  <input
                    type="text"
                    value={settings.footerText}
                    onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Optional footer text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={settings.watermark}
                    onChange={(e) => setSettings({ ...settings, watermark: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., DRAFT, CONFIDENTIAL"
                  />
                </div>
              </div>
            </div>

            {/* Compression */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Compression</h3>
              <select
                value={settings.compression}
                onChange={(e) => setSettings({ ...settings, compression: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="low">Low (Larger file, better quality)</option>
                <option value="standard">Standard (Balanced)</option>
                <option value="high">High (Smaller file, lower quality)</option>
              </select>
            </div>

            {/* Security */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Security</h3>
              <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.security.requirePassword}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, requirePassword: e.target.checked }
                    })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Require password to open</span>
                </label>

                {settings.security.requirePassword && (
                  <div>
                    <input
                      type="password"
                      value={settings.security.password}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, password: e.target.value }
                      })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="Enter password"
                    />
                  </div>
                )}

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.security.allowPrinting}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, allowPrinting: e.target.checked }
                    })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Allow printing</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.security.allowCopying}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, allowCopying: e.target.checked }
                    })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Allow copying text</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.security.allowModification}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, allowModification: e.target.checked }
                    })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Allow modification</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-3 border-t bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>Export PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Save Draft Modal
interface SaveDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  proposal: Proposal;
}

export function SaveDraftModal({ isOpen, onClose, onSave, proposal }: SaveDraftModalProps) {
  const [formData, setFormData] = useState({
    draftName: `${proposal.customerName} Proposal Draft`,
    notes: '',
    tags: '',
    version: '1.0',
    saveAsTemplate: false,
    templateName: '',
    templateCategory: 'general'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.draftName.trim()) {
      newErrors.draftName = 'Draft name is required';
    }

    if (formData.saveAsTemplate && !formData.templateName.trim()) {
      newErrors.templateName = 'Template name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    setIsSaving(true);
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Save className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Save Draft</h2>
              <p className="text-sm text-gray-500">Save your proposal progress</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Draft Name *
              </label>
              <input
                type="text"
                value={formData.draftName}
                onChange={(e) => setFormData({ ...formData, draftName: e.target.value })}
                className={`w-full p-2 border rounded-lg ${
                  errors.draftName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter draft name"
              />
              {errors.draftName && (
                <p className="text-red-500 text-xs mt-1">{errors.draftName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Version
              </label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 1.0, 2.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="e.g., urgent, enterprise, renewal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Add any notes about this draft..."
              />
            </div>

            {/* Save as Template */}
            <div className="border-t pt-4">
              <label className="flex items-center space-x-3 mb-2">
                <input
                  type="checkbox"
                  checked={formData.saveAsTemplate}
                  onChange={(e) => setFormData({ ...formData, saveAsTemplate: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Save as reusable template
                </span>
              </label>

              {formData.saveAsTemplate && (
                <div className="space-y-2 ml-7">
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
                      Category
                    </label>
                    <select
                      value={formData.templateCategory}
                      onChange={(e) => setFormData({ ...formData, templateCategory: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="general">General</option>
                      <option value="enterprise">Enterprise</option>
                      <option value="smb">Small/Medium Business</option>
                      <option value="technical">Technical</option>
                      <option value="consulting">Consulting</option>
                      <option value="saas">SaaS</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Draft will be saved with:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>{proposal.sections.length} sections</li>
                  <li>Current branding and styling</li>
                  <li>All customer information</li>
                  <li>Current layout and formatting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-3 border-t bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Settings Modal (Branding & Layout)
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: any) => void;
  proposal: Proposal;
}

export function SettingsModal({ isOpen, onClose, onSave, proposal }: SettingsModalProps) {
  const [settings, setSettings] = useState({
    branding: {
      logo: proposal.branding?.logo || '',
      primaryColor: proposal.branding?.primaryColor || '#6366f1',
      secondaryColor: proposal.branding?.secondaryColor || '#8b5cf6',
      accentColor: proposal.branding?.accentColor || '#ec4899'
    },
    layout: {
      pageSize: proposal.settings?.pageSize || 'A4',
      orientation: proposal.settings?.orientation || 'portrait',
      includePageNumbers: proposal.settings?.includePageNumbers ?? true,
      includeTableOfContents: proposal.settings?.includeTableOfContents ?? true,
      includeTermsAndConditions: proposal.settings?.includeTermsAndConditions ?? true
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      headingSize: '24',
      bodySize: '14'
    }
  });

  const [logoPreview, setLogoPreview] = useState(settings.branding.logo);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setSettings({
          ...settings,
          branding: { ...settings.branding, logo: result }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full  max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Proposal Settings</h2>
              <p className="text-sm text-gray-500">Customize branding and layout</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Settings */}
            <div className="space-y-3">
              {/* Logo Upload */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Company Logo</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                  {logoPreview ? (
                    <div className="space-y-3">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-20 object-contain"
                      />
                      <label className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Change Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Click to upload logo</p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Brand Colors */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Brand Colors</h3>
                <div className="space-y-3">
                  {[
                    { key: 'primaryColor', label: 'Primary Color' },
                    { key: 'secondaryColor', label: 'Secondary Color' },
                    { key: 'accentColor', label: 'Accent Color' }
                  ].map((color) => (
                    <div key={color.key} className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.branding[color.key as keyof typeof settings.branding] as string}
                        onChange={(e) => setSettings({
                          ...settings,
                          branding: { ...settings.branding, [color.key]: e.target.value }
                        })}
                        className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                      />
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                          {color.label}
                        </label>
                        <input
                          type="text"
                          value={settings.branding[color.key as keyof typeof settings.branding]}
                          onChange={(e) => setSettings({
                            ...settings,
                            branding: { ...settings.branding, [color.key]: e.target.value }
                          })}
                          className="w-full p-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Page Layout */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Page Layout</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Size
                    </label>
                    <select
                      value={settings.layout.pageSize}
                      onChange={(e) => setSettings({
                        ...settings,
                        layout: { ...settings.layout, pageSize: e.target.value as any }
                      })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="A4">A4 (210 × 297 mm)</option>
                      <option value="Letter">Letter (8.5 × 11 in)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orientation
                    </label>
                    <select
                      value={settings.layout.orientation}
                      onChange={(e) => setSettings({
                        ...settings,
                        layout: { ...settings.layout, orientation: e.target.value as any }
                      })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                    </select>
                  </div>

                  <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.layout.includePageNumbers}
                        onChange={(e) => setSettings({
                          ...settings,
                          layout: { ...settings.layout, includePageNumbers: e.target.checked }
                        })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700">Include page numbers</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.layout.includeTableOfContents}
                        onChange={(e) => setSettings({
                          ...settings,
                          layout: { ...settings.layout, includeTableOfContents: e.target.checked }
                        })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700">Include table of contents</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.layout.includeTermsAndConditions}
                        onChange={(e) => setSettings({
                          ...settings,
                          layout: { ...settings.layout, includeTermsAndConditions: e.target.checked }
                        })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700">Include terms & conditions</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Typography</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heading Font
                      </label>
                      <select
                        value={settings.fonts.heading}
                        onChange={(e) => setSettings({
                          ...settings,
                          fonts: { ...settings.fonts, heading: e.target.value }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size (px)
                      </label>
                      <input
                        type="number"
                        value={settings.fonts.headingSize}
                        onChange={(e) => setSettings({
                          ...settings,
                          fonts: { ...settings.fonts, headingSize: e.target.value }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Body Font
                      </label>
                      <select
                        value={settings.fonts.body}
                        onChange={(e) => setSettings({
                          ...settings,
                          fonts: { ...settings.fonts, body: e.target.value }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size (px)
                      </label>
                      <input
                        type="number"
                        value={settings.fonts.bodySize}
                        onChange={(e) => setSettings({
                          ...settings,
                          fonts: { ...settings.fonts, bodySize: e.target.value }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Preview */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Preview</h3>
              <div className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm">
                <div className="space-y-2">
                  {/* Logo Preview */}
                  {logoPreview && (
                    <img src={logoPreview} alt="Logo" className="h-12 mb-2" />
                  )}

                  {/* Heading Preview */}
                  <h1
                    className="text-3xl font-bold mb-2"
                    style={{
                      color: settings.branding.primaryColor,
                      fontFamily: settings.fonts.heading,
                      fontSize: `${settings.fonts.headingSize}px`
                    }}
                  >
                    Proposal Title
                  </h1>

                  {/* Divider */}
                  <div
                    className="h-1 w-24 mb-2"
                    style={{ backgroundColor: settings.branding.accentColor }}
                  />

                  {/* Body Text Preview */}
                  <div
                    className="space-y-2"
                    style={{
                      fontFamily: settings.fonts.body,
                      fontSize: `${settings.fonts.bodySize}px`
                    }}
                  >
                    <p className="text-gray-700">
                      This is a preview of how your proposal will look with the selected
                      branding and typography settings.
                    </p>
                    <p className="text-gray-700">
                      The body text will appear in this style throughout your document.
                    </p>
                  </div>

                  {/* Color Palette */}
                  <div className="mt-6 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Color Palette:</p>
                    <div className="flex space-x-2">
                      <div
                        className="w-16 h-16 rounded-lg shadow-sm border border-gray-200"
                        style={{ backgroundColor: settings.branding.primaryColor }}
                      />
                      <div
                        className="w-16 h-16 rounded-lg shadow-sm border border-gray-200"
                        style={{ backgroundColor: settings.branding.secondaryColor }}
                      />
                      <div
                        className="w-16 h-16 rounded-lg shadow-sm border border-gray-200"
                        style={{ backgroundColor: settings.branding.accentColor }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-3 border-t bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Section Editor Modal
interface SectionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (section: ProposalSection) => void;
  section: ProposalSection | null;
}

export function SectionEditorModal({ isOpen, onClose, onSave, section }: SectionEditorModalProps) {
  const [formData, setFormData] = useState<ProposalSection>(
    section || {
      id: Date.now().toString(),
      type: 'text',
      title: '',
      content: '',
      order: 0,
      visible: true
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Section title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Section content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full  max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {section ? 'Edit Section' : 'Add Section'}
              </h2>
              <p className="text-sm text-gray-500">Create or modify proposal content</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            {/* Section Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="cover">Cover Page</option>
                <option value="text">Text Content</option>
                <option value="quote">Quote/Pricing</option>
                <option value="table">Table</option>
                <option value="image">Image</option>
                <option value="terms">Terms & Conditions</option>
              </select>
            </div>

            {/* Section Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full p-2 border rounded-lg ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter section title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Rich Text Editor Toolbar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                {/* Toolbar */}
                <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center space-x-1">
                  <button className="p-2 hover:bg-gray-200 rounded" title="Bold">
                    <Bold className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded" title="Italic">
                    <Italic className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded" title="Underline">
                    <Underline className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <button className="p-2 hover:bg-gray-200 rounded" title="Align Left">
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded" title="Align Center">
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded" title="Align Right">
                    <AlignRight className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <button className="p-2 hover:bg-gray-200 rounded" title="Bullet List">
                    <List className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded" title="Numbered List">
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <button className="p-2 hover:bg-gray-200 rounded" title="Insert Link">
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded" title="Insert Image">
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Content Area */}
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  className={`w-full p-3 focus:outline-none ${
                    errors.content ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter section content..."
                />
              </div>
              {errors.content && (
                <p className="text-red-500 text-xs mt-1">{errors.content}</p>
              )}
            </div>

            {/* Visibility Toggle */}
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.visible}
                onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">
                Include this section in the proposal
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-3 border-t bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all flex items-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>{section ? 'Update Section' : 'Add Section'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
