'use client';

import React, { useState } from 'react';
import {
  X,
  Eye,
  Download,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  User,
  Mail,
  Calendar,
  MessageSquare,
  Shield,
  History,
  MapPin,
  Smartphone,
  Globe,
  Bell,
  Check
} from 'lucide-react';

// Types
export interface SignatureRecord {
  id: string;
  signatureId: string;
  proposalNumber: string;
  proposalTitle: string;
  customerName: string;
  customerEmail: string;
  signerName: string;
  signerTitle: string;
  status: 'pending' | 'viewed' | 'signed' | 'declined' | 'expired';
  sentDate: string;
  viewedDate?: string;
  signedDate?: string;
  expiryDate: string;
  remindersSent: number;
  ipAddress?: string;
  location?: string;
  device?: string;
  notes?: string;
  declineReason?: string;
  signatureImage?: string;
}

// View Proposal Modal
interface ViewProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  signature: SignatureRecord;
}

export function ViewProposalModal({ isOpen, onClose, signature }: ViewProposalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">View Proposal</h2>
              <p className="text-sm text-gray-500">{signature.proposalNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-12">
            {/* Status Banner */}
            <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
              signature.status === 'signed' ? 'bg-green-50 border border-green-200' :
              signature.status === 'declined' ? 'bg-red-50 border border-red-200' :
              signature.status === 'expired' ? 'bg-gray-50 border border-gray-200' :
              signature.status === 'viewed' ? 'bg-blue-50 border border-blue-200' :
              'bg-yellow-50 border border-yellow-200'
            }`}>
              {signature.status === 'signed' && <CheckCircle className="w-5 h-5 text-green-600" />}
              {signature.status === 'declined' && <XCircle className="w-5 h-5 text-red-600" />}
              {signature.status === 'expired' && <Clock className="w-5 h-5 text-gray-600" />}
              {signature.status === 'viewed' && <Eye className="w-5 h-5 text-blue-600" />}
              {signature.status === 'pending' && <Clock className="w-5 h-5 text-yellow-600" />}
              <div className="flex-1">
                <p className="font-medium text-gray-900 capitalize">
                  Status: {signature.status}
                </p>
                {signature.signedDate && (
                  <p className="text-sm text-gray-600">
                    Signed on {new Date(signature.signedDate).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Proposal Header */}
            <div className="mb-8 pb-6 border-b-2 border-blue-500">
              <h1 className="text-4xl font-bold text-blue-600 mb-2">
                {signature.proposalTitle}
              </h1>
              <p className="text-gray-600">Proposal #{signature.proposalNumber}</p>
            </div>

            {/* Customer Information */}
            <div className="mb-8 grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">PREPARED FOR</h3>
                <p className="text-lg font-semibold text-gray-900">{signature.customerName}</p>
                <p className="text-gray-600">{signature.customerEmail}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">SIGNATURE DETAILS</h3>
                <p className="text-gray-600">Sent: {new Date(signature.sentDate).toLocaleDateString()}</p>
                <p className="text-gray-600">Expires: {new Date(signature.expiryDate).toLocaleDateString()}</p>
                {signature.viewedDate && (
                  <p className="text-gray-600">Viewed: {new Date(signature.viewedDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>

            {/* Sample Proposal Content */}
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Executive Summary</h2>
                <p className="text-gray-700 leading-relaxed">
                  This proposal outlines our comprehensive solution tailored to meet your specific business needs.
                  Our approach combines industry best practices with innovative technology to deliver measurable results.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Solution Overview</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our solution provides end-to-end capabilities designed to streamline your operations
                  and drive business growth. Key features include automation, analytics, and integration
                  with your existing systems.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Investment</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Implementation Services</span>
                    <span className="font-semibold text-gray-900">$50,000</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Annual License</span>
                    <span className="font-semibold text-gray-900">$25,000</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-lg font-semibold text-gray-900">Total Investment</span>
                    <span className="text-lg font-bold text-blue-600">$75,000</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Signature Section */}
            {signature.status === 'signed' && signature.signatureImage && (
              <div className="mt-12 pt-6 border-t">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">SIGNATURE</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="mb-4">
                    <img
                      src={signature.signatureImage}
                      alt="Signature"
                      className="h-20 border-b-2 border-gray-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Signed by:</p>
                      <p className="font-medium text-gray-900">{signature.signerName}</p>
                      <p className="text-gray-600">{signature.signerTitle}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date & Time:</p>
                      <p className="font-medium text-gray-900">
                        {new Date(signature.signedDate!).toLocaleString()}
                      </p>
                      <p className="text-gray-600">IP: {signature.ipAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-12 pt-6 border-t text-center text-sm text-gray-500">
              <p>© {new Date().getFullYear()} All Rights Reserved</p>
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

// Send Reminder Modal
interface SendReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: any) => void;
  signature: SignatureRecord;
}

export function SendReminderModal({ isOpen, onClose, onSend, signature }: SendReminderModalProps) {
  const [formData, setFormData] = useState({
    message: `Hi ${signature.signerName},\n\nThis is a friendly reminder to review and sign the proposal "${signature.proposalTitle}" (${signature.proposalNumber}).\n\nThe proposal expires on ${new Date(signature.expiryDate).toLocaleDateString()}.\n\nPlease let me know if you have any questions.\n\nBest regards,`,
    includeProposalLink: true,
    sendCopy: false,
    urgency: 'normal' as 'low' | 'normal' | 'high'
  });

  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      onSend(formData);
      setIsSending(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Send Reminder</h2>
              <p className="text-sm text-gray-500">To: {signature.signerName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Reminder Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Reminder Details</p>
                  <p>Proposal: {signature.proposalNumber}</p>
                  <p>Sent: {new Date(signature.sentDate).toLocaleDateString()}</p>
                  <p>Previous reminders: {signature.remindersSent}</p>
                  <p>Expires: {new Date(signature.expiryDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'low', label: 'Low', color: 'gray' },
                  { value: 'normal', label: 'Normal', color: 'blue' },
                  { value: 'high', label: 'High', color: 'red' }
                ].map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, urgency: level.value as any })}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      formData.urgency === level.value
                        ? `border-${level.color}-500 bg-${level.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className={`text-sm font-medium ${
                      formData.urgency === level.value
                        ? `text-${level.color}-700`
                        : 'text-gray-700'
                    }`}>
                      {level.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={8}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Enter your reminder message"
              />
            </div>

            {/* Options */}
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.includeProposalLink}
                  onChange={(e) => setFormData({ ...formData, includeProposalLink: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Include direct link to proposal</span>
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

        <div className="flex justify-end space-x-3 p-6 border-t bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSending}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSending}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Reminder</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Signature Details Modal
interface SignatureDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  signature: SignatureRecord;
}

export function SignatureDetailsModal({ isOpen, onClose, signature }: SignatureDetailsModalProps) {
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'text-green-600 bg-green-50';
      case 'declined': return 'text-red-600 bg-red-50';
      case 'expired': return 'text-gray-600 bg-gray-50';
      case 'viewed': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const auditTrail = [
    {
      timestamp: signature.sentDate,
      action: 'Proposal Sent',
      details: `Sent to ${signature.customerEmail}`,
      icon: Send
    },
    ...(signature.viewedDate ? [{
      timestamp: signature.viewedDate,
      action: 'Proposal Viewed',
      details: `Opened by ${signature.signerName}`,
      icon: Eye
    }] : []),
    ...(signature.signedDate ? [{
      timestamp: signature.signedDate,
      action: 'Proposal Signed',
      details: `Signed by ${signature.signerName}`,
      icon: CheckCircle
    }] : []),
    ...(signature.status === 'declined' ? [{
      timestamp: signature.sentDate,
      action: 'Proposal Declined',
      details: signature.declineReason || 'No reason provided',
      icon: XCircle
    }] : [])
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Signature Details</h2>
              <p className="text-sm text-gray-500">{signature.signatureId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Status Overview */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Status</h3>
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(signature.status)}`}>
                {signature.status === 'signed' && <CheckCircle className="w-4 h-4 mr-2" />}
                {signature.status === 'declined' && <XCircle className="w-4 h-4 mr-2" />}
                {signature.status === 'expired' && <Clock className="w-4 h-4 mr-2" />}
                {signature.status === 'viewed' && <Eye className="w-4 h-4 mr-2" />}
                {signature.status === 'pending' && <Clock className="w-4 h-4 mr-2" />}
                <span className="capitalize">{signature.status}</span>
              </div>
            </div>

            {/* Proposal Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Proposal Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Proposal Number</span>
                    </div>
                    <p className="font-medium text-gray-900">{signature.proposalNumber}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Customer</span>
                    </div>
                    <p className="font-medium text-gray-900">{signature.customerName}</p>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{signature.proposalTitle}</p>
                </div>
              </div>
            </div>

            {/* Signer Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Signer Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Name</span>
                    </div>
                    <p className="font-medium text-gray-900">{signature.signerName}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Email</span>
                    </div>
                    <p className="font-medium text-gray-900">{signature.customerEmail}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Title</span>
                  </div>
                  <p className="font-medium text-gray-900">{signature.signerTitle}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Timeline</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Send className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600">Sent Date</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(signature.sentDate).toLocaleDateString()}
                    </p>
                  </div>
                  {signature.viewedDate && (
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600">Viewed Date</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(signature.viewedDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {signature.signedDate && (
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600">Signed Date</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(signature.signedDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600">Expiry Date</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(signature.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Bell className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600">Reminders Sent</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{signature.remindersSent}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Details (if signed) */}
            {signature.status === 'signed' && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Technical Details</h3>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4">
                    {signature.ipAddress && (
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Globe className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-green-700">IP Address</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{signature.ipAddress}</p>
                      </div>
                    )}
                    {signature.location && (
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-green-700">Location</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{signature.location}</p>
                      </div>
                    )}
                    {signature.device && (
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Smartphone className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-green-700">Device</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{signature.device}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Signature Image */}
            {signature.status === 'signed' && signature.signatureImage && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Digital Signature</h3>
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                  <img
                    src={signature.signatureImage}
                    alt="Signature"
                    className="h-24 border-b-2 border-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    This signature is legally binding and has been cryptographically verified
                  </p>
                </div>
              </div>
            )}

            {/* Decline Reason */}
            {signature.status === 'declined' && signature.declineReason && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Decline Reason</h3>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{signature.declineReason}</p>
                </div>
              </div>
            )}

            {/* Audit Trail */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Audit Trail</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-4">
                  {auditTrail.map((event, index) => {
                    const Icon = event.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{event.action}</p>
                          <p className="text-xs text-gray-600">{event.details}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Notes */}
            {signature.notes && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Notes</h3>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{signature.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between p-6 border-t bg-white">
          <div className="flex space-x-2">
            {signature.status === 'signed' && (
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download Signed Copy</span>
              </button>
            )}
          </div>
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

// Export Report Modal
interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (settings: any) => void;
}

export function ExportReportModal({ isOpen, onClose, onExport }: ExportReportModalProps) {
  const [settings, setSettings] = useState({
    reportType: 'summary' as 'summary' | 'detailed' | 'audit',
    format: 'pdf' as 'pdf' | 'excel' | 'csv',
    dateRange: 'all' as 'all' | '30days' | '90days' | 'custom',
    customStartDate: '',
    customEndDate: '',
    includeDeclined: true,
    includeExpired: true,
    includePending: true,
    includeAuditTrail: false,
    groupBy: 'status' as 'status' | 'date' | 'customer'
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Export Report</h2>
              <p className="text-sm text-gray-500">Configure export settings</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                value={settings.reportType}
                onChange={(e) => setSettings({ ...settings, reportType: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="summary">Summary Report</option>
                <option value="detailed">Detailed Report</option>
                <option value="audit">Audit Trail Report</option>
              </select>
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'pdf', label: 'PDF' },
                  { value: 'excel', label: 'Excel' },
                  { value: 'csv', label: 'CSV' }
                ].map((format) => (
                  <button
                    key={format.value}
                    type="button"
                    onClick={() => setSettings({ ...settings, format: format.value as any })}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      settings.format === format.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{format.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={settings.dateRange}
                onChange={(e) => setSettings({ ...settings, dateRange: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Time</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </select>

              {settings.dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={settings.customStartDate}
                      onChange={(e) => setSettings({ ...settings, customStartDate: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      value={settings.customEndDate}
                      onChange={(e) => setSettings({ ...settings, customEndDate: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Filter Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Include Status
              </label>
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.includePending}
                    onChange={(e) => setSettings({ ...settings, includePending: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Pending signatures</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.includeDeclined}
                    onChange={(e) => setSettings({ ...settings, includeDeclined: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Declined signatures</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.includeExpired}
                    onChange={(e) => setSettings({ ...settings, includeExpired: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Expired signatures</span>
                </label>
              </div>
            </div>

            {/* Group By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group By
              </label>
              <select
                value={settings.groupBy}
                onChange={(e) => setSettings({ ...settings, groupBy: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="status">Status</option>
                <option value="date">Date</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            {/* Additional Options */}
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.includeAuditTrail}
                  onChange={(e) => setSettings({ ...settings, includeAuditTrail: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Include detailed audit trail</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-white">
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
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
