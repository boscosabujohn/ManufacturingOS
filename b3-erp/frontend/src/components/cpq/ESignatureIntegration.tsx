'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  PenTool,
  Mail,
  User,
  Users,
  FileText,
  Download,
  Eye,
  Send,
  RefreshCw,
  Calendar,
  Shield,
  Bell,
  Check,
  X,
  ArrowRight,
  Upload,
  MapPin,
  Globe,
  Smartphone,
  Printer,
  ExternalLink,
  MessageSquare,
  Archive,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export type SignatureStatus = 'draft' | 'sent' | 'awaiting' | 'signed' | 'declined' | 'expired' | 'voided';
export type SignerRole = 'signer' | 'approver' | 'cc' | 'witness';
export type SignatureType = 'electronic' | 'digital' | 'wet_ink';
export type AuthMethod = 'email' | 'sms' | 'access_code' | 'id_verification';

export interface Signer {
  id: string;
  name: string;
  email: string;
  role: SignerRole;
  order: number;
  status: 'pending' | 'sent' | 'viewed' | 'signed' | 'declined';
  sentAt?: string;
  viewedAt?: string;
  signedAt?: string;
  declinedAt?: string;
  declineReason?: string;
  ipAddress?: string;
  location?: string;
  device?: string;
  authMethod?: AuthMethod;
  signatureImage?: string;
  requiresIdVerification?: boolean;
}

export interface SignatureDocument {
  id: string;
  title: string;
  description?: string;
  status: SignatureStatus;
  documentType: 'quote' | 'contract' | 'nda' | 'sow' | 'other';
  fileUrl: string;
  fileName: string;
  fileSize: number;
  signers: Signer[];
  createdBy: string;
  createdAt: string;
  sentAt?: string;
  completedAt?: string;
  expiresAt?: string;
  voidedAt?: string;
  voidReason?: string;
  remindersSent: number;
  lastReminderAt?: string;
  securityOptions: {
    requireAccessCode?: boolean;
    accessCode?: string;
    requireIdVerification?: boolean;
    allowPrinting?: boolean;
    allowDownload?: boolean;
    watermark?: boolean;
  };
  auditTrail: {
    timestamp: string;
    actor: string;
    action: string;
    details: string;
    ipAddress?: string;
  }[];
  customMessage?: string;
  brandingEnabled?: boolean;
}

export interface ESignatureIntegrationProps {
  documents: SignatureDocument[];
  onSendDocument?: (documentId: string) => void;
  onVoidDocument?: (documentId: string, reason: string) => void;
  onResendDocument?: (documentId: string) => void;
  onSendReminder?: (documentId: string, signerId: string) => void;
  onDownloadDocument?: (documentId: string) => void;
  onViewDocument?: (documentId: string) => void;
  onViewAuditTrail?: (documentId: string) => void;
  onUploadDocument?: () => void;
  className?: string;
}

export const ESignatureIntegration: React.FC<ESignatureIntegrationProps> = ({
  documents,
  onSendDocument,
  onVoidDocument,
  onResendDocument,
  onSendReminder,
  onDownloadDocument,
  onViewDocument,
  onViewAuditTrail,
  onUploadDocument,
  className = '',
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());
  const [voidingDoc, setVoidingDoc] = useState<string | null>(null);
  const [voidReason, setVoidReason] = useState('');

  const getStatusConfig = (status: SignatureStatus) => {
    switch (status) {
      case 'draft':
        return { icon: FileText, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', label: 'Draft' };
      case 'sent':
        return { icon: Send, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Sent' };
      case 'awaiting':
        return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Awaiting Signature' };
      case 'signed':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Signed' };
      case 'declined':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Declined' };
      case 'expired':
        return { icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Expired' };
      case 'voided':
        return { icon: X, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', label: 'Voided' };
    }
  };

  const getSignerStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Pending' };
      case 'sent':
        return { icon: Mail, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Sent' };
      case 'viewed':
        return { icon: Eye, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Viewed' };
      case 'signed':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Signed' };
      case 'declined':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Declined' };
      default:
        return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100', label: status };
    }
  };

  const getRoleLabel = (role: SignerRole): string => {
    const labels: Record<SignerRole, string> = {
      signer: 'Signer',
      approver: 'Approver',
      cc: 'CC',
      witness: 'Witness',
    };
    return labels[role];
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.signers.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filter === 'all' || doc.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: documents.length,
    draft: documents.filter((d) => d.status === 'draft').length,
    awaiting: documents.filter((d) => d.status === 'awaiting').length,
    signed: documents.filter((d) => d.status === 'signed').length,
    declined: documents.filter((d) => d.status === 'declined').length,
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

  const handleVoid = (documentId: string) => {
    if (voidReason.trim() && onVoidDocument) {
      onVoidDocument(documentId, voidReason);
      setVoidingDoc(null);
      setVoidReason('');
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Stats Bar */}
      <div className="grid grid-cols-5 gap-2">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 text-white">
          <p className="text-sm opacity-90">Total Documents</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-3 text-white">
          <p className="text-sm opacity-90">Draft</p>
          <p className="text-3xl font-bold">{stats.draft}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-3 text-white">
          <p className="text-sm opacity-90">Awaiting</p>
          <p className="text-3xl font-bold">{stats.awaiting}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 text-white">
          <p className="text-sm opacity-90">Signed</p>
          <p className="text-3xl font-bold">{stats.signed}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-3 text-white">
          <p className="text-sm opacity-90">Declined</p>
          <p className="text-3xl font-bold">{stats.declined}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents or signers..."
              className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Filter */}
            <div className="flex items-center space-x-2">
              {['all', 'draft', 'sent', 'awaiting', 'signed', 'declined'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Button */}
          {onUploadDocument && (
            <button
              onClick={onUploadDocument}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Document</span>
            </button>
          )}
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-2">
        {filteredDocuments.map((doc) => {
          const statusConfig = getStatusConfig(doc.status);
          const StatusIcon = statusConfig.icon;
          const isExpanded = expandedDocs.has(doc.id);

          return (
            <div
              key={doc.id}
              className="bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all"
            >
              {/* Document Header */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Status Icon */}
                    <div className={`p-3 rounded-lg ${statusConfig.bg}`}>
                      <StatusIcon className={`h-6 w-6 ${statusConfig.color}`} />
                    </div>

                    {/* Document Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{doc.title}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
                        >
                          {statusConfig.label}
                        </span>
                        {doc.securityOptions.requireIdVerification && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold flex items-center space-x-1">
                            <Shield className="h-3 w-3" />
                            <span>ID Verification</span>
                          </span>
                        )}
                      </div>

                      {doc.description && <p className="text-sm text-gray-600 mb-3">{doc.description}</p>}

                      {/* Signers Progress */}
                      <div className="mb-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs font-semibold text-gray-700">Signing Progress:</span>
                          <span className="text-xs text-gray-600">
                            {doc.signers.filter((s) => s.status === 'signed').length} / {doc.signers.length} signed
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {doc.signers.map((signer, idx) => {
                            const signerConfig = getSignerStatusConfig(signer.status);
                            const SignerIcon = signerConfig.icon;

                            return (
                              <div key={signer.id} className="flex items-center">
                                {idx > 0 && <ArrowRight className="h-3 w-3 text-gray-400 mx-1" />}
                                <div
                                  className={`group relative px-3 py-1 rounded text-xs font-semibold ${signerConfig.bg} ${signerConfig.color} flex items-center space-x-1`}
                                  title={`${signer.name} - ${signerConfig.label}`}
                                >
                                  <SignerIcon className="h-3 w-3" />
                                  <span>{signer.name.split(' ')[0]}</span>
                                  {signer.status === 'signed' && <Check className="h-3 w-3 ml-1" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Document Metadata */}
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span className="flex items-center">
                          <FileText className="h-3 w-3 mr-1" />
                          {doc.fileName} ({(doc.fileSize / 1024).toFixed(0)} KB)
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </span>
                        {doc.expiresAt && (
                          <span className="flex items-center text-orange-600">
                            <Clock className="h-3 w-3 mr-1" />
                            Expires: {new Date(doc.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                        {doc.remindersSent > 0 && (
                          <span className="flex items-center">
                            <Bell className="h-3 w-3 mr-1" />
                            {doc.remindersSent} reminders sent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    {onViewDocument && (
                      <button
                        onClick={() => onViewDocument(doc.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Document"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    {onDownloadDocument && doc.status === 'signed' && (
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
                        title="Send for Signature"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    )}
                    {onResendDocument && (doc.status === 'awaiting' || doc.status === 'sent') && (
                      <button
                        onClick={() => onResendDocument(doc.id)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                        title="Resend"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    )}
                    {onViewAuditTrail && (
                      <button
                        onClick={() => onViewAuditTrail(doc.id)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="Audit Trail"
                      >
                        <Shield className="h-4 w-4" />
                      </button>
                    )}
                    {onVoidDocument && (doc.status === 'awaiting' || doc.status === 'sent') && (
                      <button
                        onClick={() => setVoidingDoc(doc.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Void Document"
                      >
                        <X className="h-4 w-4" />
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

                {/* Void Confirmation */}
                {voidingDoc === doc.id && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <label className="block text-sm font-semibold text-red-900 mb-2">Void Reason (Required)</label>
                    <textarea
                      value={voidReason}
                      onChange={(e) => setVoidReason(e.target.value)}
                      className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
                      rows={3}
                      placeholder="Please provide a reason for voiding this document..."
                    />
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleVoid(doc.id)}
                        disabled={!voidReason.trim()}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Confirm Void
                      </button>
                      <button
                        onClick={() => {
                          setVoidingDoc(null);
                          setVoidReason('');
                        }}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-gray-200 p-3 bg-gray-50">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Signer Details */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Signer Details</h4>
                      <div className="space-y-3">
                        {doc.signers.map((signer) => {
                          const signerConfig = getSignerStatusConfig(signer.status);

                          return (
                            <div key={signer.id} className="bg-white border border-gray-200 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <p className="text-sm font-semibold text-gray-900">{signer.name}</p>
                                    <span
                                      className={`px-2 py-0.5 rounded text-xs font-semibold ${signerConfig.bg} ${signerConfig.color}`}
                                    >
                                      {signerConfig.label}
                                    </span>
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                      {getRoleLabel(signer.role)}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600">{signer.email}</p>
                                </div>
                                {onSendReminder && signer.status !== 'signed' && signer.status !== 'declined' && (
                                  <button
                                    onClick={() => onSendReminder(doc.id, signer.id)}
                                    className="p-1 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                    title="Send Reminder"
                                  >
                                    <Bell className="h-4 w-4" />
                                  </button>
                                )}
                              </div>

                              {/* Signer Timeline */}
                              <div className="space-y-1 text-xs text-gray-600">
                                {signer.sentAt && <p>Sent: {new Date(signer.sentAt).toLocaleString()}</p>}
                                {signer.viewedAt && <p>Viewed: {new Date(signer.viewedAt).toLocaleString()}</p>}
                                {signer.signedAt && (
                                  <p className="text-green-600 font-semibold">
                                    Signed: {new Date(signer.signedAt).toLocaleString()}
                                  </p>
                                )}
                                {signer.declinedAt && (
                                  <div className="text-red-600">
                                    <p className="font-semibold">Declined: {new Date(signer.declinedAt).toLocaleString()}</p>
                                    {signer.declineReason && <p className="italic">Reason: {signer.declineReason}</p>}
                                  </div>
                                )}
                              </div>

                              {/* Security Info */}
                              {signer.status === 'signed' && (
                                <div className="mt-2 pt-2 border-t border-gray-200 space-y-1 text-xs text-gray-600">
                                  {signer.ipAddress && (
                                    <p className="flex items-center">
                                      <Globe className="h-3 w-3 mr-1" />
                                      IP: {signer.ipAddress}
                                    </p>
                                  )}
                                  {signer.location && (
                                    <p className="flex items-center">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {signer.location}
                                    </p>
                                  )}
                                  {signer.device && (
                                    <p className="flex items-center">
                                      <Smartphone className="h-3 w-3 mr-1" />
                                      {signer.device}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Security & Audit */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Security Options</h4>
                      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2">
                        <div className="space-y-2 text-sm">
                          {doc.securityOptions.requireIdVerification && (
                            <div className="flex items-center text-purple-700">
                              <Shield className="h-4 w-4 mr-2" />
                              ID Verification Required
                            </div>
                          )}
                          {doc.securityOptions.requireAccessCode && (
                            <div className="flex items-center text-blue-700">
                              <Shield className="h-4 w-4 mr-2" />
                              Access Code Protected
                            </div>
                          )}
                          {doc.securityOptions.watermark && (
                            <div className="flex items-center text-indigo-700">
                              <Shield className="h-4 w-4 mr-2" />
                              Watermarked
                            </div>
                          )}
                          {!doc.securityOptions.allowPrinting && (
                            <div className="flex items-center text-red-700">
                              <Printer className="h-4 w-4 mr-2 line-through" />
                              Printing Disabled
                            </div>
                          )}
                          {!doc.securityOptions.allowDownload && (
                            <div className="flex items-center text-red-700">
                              <Download className="h-4 w-4 mr-2 line-through" />
                              Download Disabled
                            </div>
                          )}
                        </div>
                      </div>

                      {doc.auditTrail.length > 0 && (
                        <>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h4>
                          <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {doc.auditTrail.slice(0, 5).map((entry, idx) => (
                                <div key={idx} className="text-xs">
                                  <p className="font-semibold text-gray-900">{entry.action}</p>
                                  <p className="text-gray-600">
                                    {entry.actor} - {new Date(entry.timestamp).toLocaleString()}
                                  </p>
                                  {entry.details && <p className="text-gray-500 italic">{entry.details}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <PenTool className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-600">No signature documents found</p>
          {onUploadDocument && (
            <button
              onClick={onUploadDocument}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload First Document
            </button>
          )}
        </div>
      )}
    </div>
  );
};
