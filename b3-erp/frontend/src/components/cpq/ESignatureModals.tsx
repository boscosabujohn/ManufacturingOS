'use client';

import React, { useState } from 'react';
import { X, Upload, Plus, Trash2, Shield, Mail, Clock, User, FileText, Calendar, Globe, MapPin, Smartphone } from 'lucide-react';
import { SignatureDocument, Signer, SignerRole, AuthMethod } from './ESignatureIntegration';

// Upload Document Modal
interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: any) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    documentType: 'quote' as 'quote' | 'contract' | 'nda' | 'sow' | 'other',
    fileName: '',
    fileSize: 0,
    expiresInDays: '30',
    customMessage: '',
    brandingEnabled: true,
  });

  const [signers, setSigners] = useState<Array<{
    name: string;
    email: string;
    role: SignerRole;
    order: number;
    requiresIdVerification: boolean;
    authMethod: AuthMethod;
  }>>([
    { name: '', email: '', role: 'signer', order: 1, requiresIdVerification: false, authMethod: 'email' }
  ]);

  const [securityOptions, setSecurityOptions] = useState({
    requireAccessCode: false,
    accessCode: '',
    requireIdVerification: false,
    allowPrinting: true,
    allowDownload: true,
    watermark: false,
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        fileName: file.name,
        fileSize: file.size,
      });
    }
  };

  const handleAddSigner = () => {
    setSigners([
      ...signers,
      { name: '', email: '', role: 'signer', order: signers.length + 1, requiresIdVerification: false, authMethod: 'email' }
    ]);
  };

  const handleRemoveSigner = (index: number) => {
    if (signers.length > 1) {
      setSigners(signers.filter((_, i) => i !== index));
    }
  };

  const handleSignerChange = (index: number, field: string, value: any) => {
    const updated = [...signers];
    (updated[index] as any)[field] = value;
    setSigners(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(formData.expiresInDays));

    onUpload({
      ...formData,
      signers: signers.map((s, idx) => ({
        ...s,
        id: `signer-${Date.now()}-${idx}`,
        status: 'pending',
        order: idx + 1,
      })),
      securityOptions,
      expiresAt: expiresAt.toISOString(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Upload Document for E-Signature</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Document Upload */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document File *</label>
                <div className="flex items-center space-x-3">
                  <label className="flex-1 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                      <Upload className="h-5 w-5" />
                      <span>{formData.fileName || 'Choose file or drag here'}</span>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      required
                    />
                  </label>
                </div>
                {formData.fileName && (
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.fileName} ({(formData.fileSize / 1024).toFixed(0)} KB)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Q-2025-001 - Enterprise License Agreement"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Brief description of the document..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Type *</label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="quote">Quote</option>
                    <option value="contract">Contract</option>
                    <option value="nda">NDA</option>
                    <option value="sow">Statement of Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expires In (Days) *</label>
                  <input
                    type="number"
                    value={formData.expiresInDays}
                    onChange={(e) => setFormData({ ...formData, expiresInDays: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="365"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Signers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Signers</h3>
              <button
                type="button"
                onClick={handleAddSigner}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Signer</span>
              </button>
            </div>

            <div className="space-y-3">
              {signers.map((signer, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Signer #{index + 1}</span>
                    {signers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSigner(index)}
                        className="text-red-600 hover:bg-red-50 rounded p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        value={signer.name}
                        onChange={(e) => handleSignerChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={signer.email}
                        onChange={(e) => handleSignerChange(index, 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Role *</label>
                      <select
                        value={signer.role}
                        onChange={(e) => handleSignerChange(index, 'role', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      >
                        <option value="signer">Signer</option>
                        <option value="approver">Approver</option>
                        <option value="cc">CC</option>
                        <option value="witness">Witness</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Authentication *</label>
                      <select
                        value={signer.authMethod}
                        onChange={(e) => handleSignerChange(index, 'authMethod', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      >
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="access_code">Access Code</option>
                        <option value="id_verification">ID Verification</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-2">
                    <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={signer.requiresIdVerification}
                        onChange={(e) => handleSignerChange(index, 'requiresIdVerification', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Require ID Verification</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Options */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Options</h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={securityOptions.requireAccessCode}
                  onChange={(e) => setSecurityOptions({ ...securityOptions, requireAccessCode: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Require Access Code</span>
              </label>

              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={securityOptions.requireIdVerification}
                  onChange={(e) => setSecurityOptions({ ...securityOptions, requireIdVerification: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Require ID Verification</span>
              </label>

              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={securityOptions.allowPrinting}
                  onChange={(e) => setSecurityOptions({ ...securityOptions, allowPrinting: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Allow Printing</span>
              </label>

              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={securityOptions.allowDownload}
                  onChange={(e) => setSecurityOptions({ ...securityOptions, allowDownload: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Allow Download</span>
              </label>

              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={securityOptions.watermark}
                  onChange={(e) => setSecurityOptions({ ...securityOptions, watermark: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Add Watermark</span>
              </label>

              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.brandingEnabled}
                  onChange={(e) => setFormData({ ...formData, brandingEnabled: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Custom Branding</span>
              </label>
            </div>

            {securityOptions.requireAccessCode && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Code</label>
                <input
                  type="text"
                  value={securityOptions.accessCode}
                  onChange={(e) => setSecurityOptions({ ...securityOptions, accessCode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter 4-6 digit access code"
                  maxLength={6}
                />
              </div>
            )}
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Message (Optional)</label>
            <textarea
              value={formData.customMessage}
              onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Add a custom message for signers..."
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload & Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Document Detail Modal
interface ViewDocumentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: SignatureDocument | null;
  onDownload?: (docId: string) => void;
  onSend?: (docId: string) => void;
}

export const ViewDocumentDetailModal: React.FC<ViewDocumentDetailModalProps> = ({
  isOpen,
  onClose,
  document,
  onDownload,
  onSend,
}) => {
  if (!isOpen || !document) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'awaiting': return 'bg-yellow-100 text-yellow-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      case 'voided': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{document.title}</h2>
            <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(document.status)}`}>
              {document.status.toUpperCase()}
            </span>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Document Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Document Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">File:</span>
                <span className="text-sm font-medium">{document.fileName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Size:</span>
                <span className="text-sm font-medium">{(document.fileSize / 1024).toFixed(0)} KB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <span className="text-sm font-medium">{document.documentType.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created By:</span>
                <span className="text-sm font-medium">{document.createdBy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created:</span>
                <span className="text-sm font-medium">{new Date(document.createdAt).toLocaleString()}</span>
              </div>
              {document.expiresAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Expires:</span>
                  <span className="text-sm font-medium text-orange-600">{new Date(document.expiresAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Signers */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Signers ({document.signers.length})</h3>
            <div className="space-y-3">
              {document.signers.map((signer) => (
                <div key={signer.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{signer.name}</p>
                      <p className="text-sm text-gray-600">{signer.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(signer.status)}`}>
                      {signer.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-3">
                    <div>Role: <span className="font-medium">{signer.role}</span></div>
                    <div>Order: <span className="font-medium">#{signer.order}</span></div>
                    {signer.sentAt && <div>Sent: <span className="font-medium">{new Date(signer.sentAt).toLocaleDateString()}</span></div>}
                    {signer.viewedAt && <div>Viewed: <span className="font-medium">{new Date(signer.viewedAt).toLocaleDateString()}</span></div>}
                    {signer.signedAt && <div className="col-span-2">Signed: <span className="font-medium text-green-600">{new Date(signer.signedAt).toLocaleString()}</span></div>}
                  </div>

                  {signer.status === 'signed' && (
                    <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600 space-y-1">
                      {signer.ipAddress && (
                        <div className="flex items-center">
                          <Globe className="h-3 w-3 mr-1" />
                          IP: {signer.ipAddress}
                        </div>
                      )}
                      {signer.location && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {signer.location}
                        </div>
                      )}
                      {signer.device && (
                        <div className="flex items-center">
                          <Smartphone className="h-3 w-3 mr-1" />
                          {signer.device}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Security Options */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Security Options</h3>
            <div className="grid grid-cols-2 gap-3">
              {document.securityOptions.requireIdVerification && (
                <div className="flex items-center space-x-2 text-sm text-purple-700 bg-purple-50 px-3 py-2 rounded">
                  <Shield className="h-4 w-4" />
                  <span>ID Verification Required</span>
                </div>
              )}
              {document.securityOptions.requireAccessCode && (
                <div className="flex items-center space-x-2 text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded">
                  <Shield className="h-4 w-4" />
                  <span>Access Code Protected</span>
                </div>
              )}
              {document.securityOptions.watermark && (
                <div className="flex items-center space-x-2 text-sm text-indigo-700 bg-indigo-50 px-3 py-2 rounded">
                  <FileText className="h-4 w-4" />
                  <span>Watermarked</span>
                </div>
              )}
              {!document.securityOptions.allowPrinting && (
                <div className="flex items-center space-x-2 text-sm text-red-700 bg-red-50 px-3 py-2 rounded">
                  <X className="h-4 w-4" />
                  <span>Printing Disabled</span>
                </div>
              )}
            </div>
          </div>

          {/* Audit Trail */}
          {document.auditTrail.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Audit Trail</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto space-y-3">
                {document.auditTrail.map((entry, idx) => (
                  <div key={idx} className="border-l-2 border-blue-500 pl-3">
                    <p className="text-sm font-semibold text-gray-900">{entry.action}</p>
                    <p className="text-xs text-gray-600">{entry.actor} - {new Date(entry.timestamp).toLocaleString()}</p>
                    {entry.details && <p className="text-xs text-gray-500 italic mt-1">{entry.details}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            {onDownload && document.status === 'signed' && (
              <button
                onClick={() => onDownload(document.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Download Signed Document
              </button>
            )}
            {onSend && document.status === 'draft' && (
              <button
                onClick={() => onSend(document.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send for Signature
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// View Audit Trail Modal
interface ViewAuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: SignatureDocument | null;
}

export const ViewAuditTrailModal: React.FC<ViewAuditTrailModalProps> = ({ isOpen, onClose, document }) => {
  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Complete Audit Trail</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{document.title}</h3>
            <p className="text-sm text-gray-600">Complete chronological record of all document activities</p>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {document.auditTrail.map((entry, idx) => (
              <div key={idx} className="relative pl-8 pb-4">
                {/* Timeline line */}
                {idx < document.auditTrail.length - 1 && (
                  <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-gray-300" />
                )}

                {/* Timeline dot */}
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />

                {/* Content */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-gray-900">{entry.action}</p>
                    <span className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">By: {entry.actor}</p>
                  {entry.details && <p className="text-sm text-gray-600 italic">{entry.details}</p>}
                  {entry.ipAddress && (
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      IP: {entry.ipAddress}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {document.auditTrail.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No audit trail entries yet</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
