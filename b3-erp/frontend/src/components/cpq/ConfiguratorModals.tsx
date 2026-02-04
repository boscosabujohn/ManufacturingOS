'use client';

import React, { useState } from 'react';
import { X, FileText, Download, Mail, Save, CheckCircle, User, Building, Phone, MapPin } from 'lucide-react';

// Generate Quote Modal
interface GenerateQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: any) => void;
  configuration: {
    basePrice: number;
    selectedOptions: Array<{ name: string; price: number }>;
    totalPrice: number;
    steps: Array<{ title: string; completed: boolean }>;
  };
}

export const GenerateQuoteModal: React.FC<GenerateQuoteModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  configuration,
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerCompany: '',
    customerAddress: '',
    projectName: '',
    validityDays: '30',
    notes: '',
    includeTerms: true,
    sendEmail: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const quoteData = {
      ...formData,
      configuration,
      quoteNumber: `Q-${Date.now()}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + parseInt(formData.validityDays) * 24 * 60 * 60 * 1000).toISOString(),
      status: 'draft',
    };

    onGenerate(quoteData);
    onClose();
  };

  if (!isOpen) return null;

  const completedSteps = configuration.steps.filter(s => s.completed).length;
  const totalSteps = configuration.steps.length;
  const configProgress = (completedSteps / totalSteps) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full  max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <h2 className="text-xl font-bold">Generate Quote</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {/* Configuration Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuration Summary</h3>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <p className="text-sm text-blue-700 mb-1">Base Price</p>
                  <p className="text-xl font-bold text-blue-900">₹{(configuration.basePrice / 100000).toFixed(2)}L</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 mb-1">Total Price</p>
                  <p className="text-xl font-bold text-blue-900">₹{(configuration.totalPrice / 100000).toFixed(2)}L</p>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm text-blue-800 mb-1">
                  <span>Configuration Progress</span>
                  <span>{completedSteps} of {totalSteps} steps</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${configProgress}%` }}
                  />
                </div>
              </div>

              {configuration.selectedOptions.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-2">Selected Options:</p>
                  <div className="space-y-1">
                    {configuration.selectedOptions.map((option, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm text-blue-800">
                        <span>{option.name}</span>
                        <span className="font-semibold">+₹{(option.price / 100000).toFixed(2)}L</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Information</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={formData.customerCompany}
                  onChange={(e) => setFormData({ ...formData, customerCompany: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Company Name"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={formData.customerAddress}
                  onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Customer address..."
                />
              </div>
            </div>
          </div>

          {/* Quote Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quote Details</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Kitchen Renovation Project"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Validity (Days) *</label>
                <input
                  type="number"
                  value={formData.validityDays}
                  onChange={(e) => setFormData({ ...formData, validityDays: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="90"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Any special requirements, terms, or notes for this quote..."
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quote Options</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeTerms}
                  onChange={(e) => setFormData({ ...formData, includeTerms: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Include Terms & Conditions</p>
                  <p className="text-xs text-gray-600">Add standard terms and conditions to the quote</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sendEmail}
                  onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Send Email to Customer</p>
                  <p className="text-xs text-gray-600">Automatically email the quote to the customer</p>
                </div>
              </label>
            </div>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Generate Quote</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Quote Success Modal
interface QuoteSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: any;
  onDownload: () => void;
  onViewQuote: () => void;
}

export const QuoteSuccessModal: React.FC<QuoteSuccessModalProps> = ({
  isOpen,
  onClose,
  quote,
  onDownload,
  onViewQuote,
}) => {
  if (!isOpen || !quote) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-2 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6" />
            <h2 className="text-xl font-bold">Quote Generated Successfully!</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Success Message */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Quote Created!</h3>
            <p className="text-gray-600">
              Your quote has been generated and {quote.sendEmail ? 'sent to the customer' : 'is ready for review'}
            </p>
          </div>

          {/* Quote Details */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Quote Number:</span>
              <span className="text-sm font-semibold text-gray-900">{quote.quoteNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Customer:</span>
              <span className="text-sm font-semibold text-gray-900">{quote.customerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Project:</span>
              <span className="text-sm font-semibold text-gray-900">{quote.projectName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Amount:</span>
              <span className="text-lg font-bold text-blue-600">
                ₹{(quote.configuration.totalPrice / 100000).toFixed(2)}L
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Valid Until:</span>
              <span className="text-sm font-semibold text-gray-900">
                {new Date(quote.expiresAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {quote.sendEmail && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start space-x-2">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900">Email Sent</p>
                <p className="text-xs text-blue-700">Quote has been sent to {quote.customerEmail}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onDownload}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onViewQuote}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>View Quote</span>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Close and continue configuring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Save Configuration Modal
interface SaveConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const SaveConfigModal: React.FC<SaveConfigModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: `CONFIG-${Date.now()}`,
      savedAt: new Date().toISOString(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-2 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Save className="h-5 w-5" />
            <h2 className="text-xl font-bold">Save Configuration</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Configuration Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="My Kitchen Configuration"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              placeholder="Add notes about this configuration..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="modern, premium, large"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
