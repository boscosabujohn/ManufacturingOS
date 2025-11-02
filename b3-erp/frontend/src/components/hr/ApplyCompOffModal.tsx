'use client';

import React, { useState } from 'react';
import { X, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface CompOffCredit {
  id: string;
  earnedDate: string;
  reason: string;
  daysAvailable: number;
  expiryDate: string;
}

interface ApplyCompOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  availableCredits: CompOffCredit[];
}

export function ApplyCompOffModal({ isOpen, onClose, onSubmit, availableCredits }: ApplyCompOffModalProps) {
  const [formData, setFormData] = useState({
    selectedCreditId: '',
    leaveDate: '',
    leaveDays: '1',
    reason: '',
    sendNotification: true
  });

  const selectedCredit = availableCredits.find(c => c.id === formData.selectedCreditId);
  const totalAvailableDays = availableCredits.reduce((sum, c) => sum + c.daysAvailable, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      creditDetails: selectedCredit,
      applyDate: new Date().toISOString().split('T')[0]
    });
    // Reset form
    setFormData({
      selectedCreditId: '',
      leaveDate: '',
      leaveDays: '1',
      reason: '',
      sendNotification: true
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-7 h-7 text-blue-600" />
                Apply Compensatory Off
              </h2>
              <p className="text-gray-600 mt-1">Request to utilize your comp-off credits</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Available Credits Summary */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Available Comp-Off</p>
                <p className="text-3xl font-bold text-blue-600">{totalAvailableDays.toFixed(1)} days</p>
              </div>
              <CheckCircle className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          {/* Select Credit */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">1</span>
              Select Comp-Off Credit
            </h3>
            {availableCredits.length === 0 ? (
              <div className="p-8 text-center border border-gray-200 rounded-lg">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">You don't have any available comp-off credits.</p>
                <p className="text-sm text-gray-400 mt-1">Comp-off will be credited for approved overtime work.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableCredits.map((credit) => (
                  <label
                    key={credit.id}
                    className={`block border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      formData.selectedCreditId === credit.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="credit"
                      value={credit.id}
                      checked={formData.selectedCreditId === credit.id}
                      onChange={(e) => setFormData({ ...formData, selectedCreditId: e.target.value })}
                      className="sr-only"
                      required
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {formData.selectedCreditId === credit.id && (
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          )}
                          <span className="font-semibold text-gray-900">
                            {credit.daysAvailable.toFixed(1)} {credit.daysAvailable === 1 ? 'day' : 'days'} available
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            Earned on: {new Date(credit.earnedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            Expires on: {new Date(credit.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                          <div className="text-gray-500 italic">{credit.reason}</div>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Leave Details */}
          {availableCredits.length > 0 && (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">2</span>
                  Leave Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Leave Date *
                    </label>
                    <input
                      type="date"
                      value={formData.leaveDate}
                      onChange={(e) => setFormData({ ...formData, leaveDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Date when you want to take comp-off</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Days *
                    </label>
                    <select
                      value={formData.leaveDays}
                      onChange={(e) => setFormData({ ...formData, leaveDays: e.target.value })}
                      required
                      disabled={!selectedCredit}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">Select days</option>
                      <option value="0.5">0.5 day (Half day)</option>
                      {selectedCredit && selectedCredit.daysAvailable >= 1 && <option value="1">1 day</option>}
                      {selectedCredit && selectedCredit.daysAvailable >= 1.5 && <option value="1.5">1.5 days</option>}
                      {selectedCredit && selectedCredit.daysAvailable >= 2 && <option value="2">2 days</option>}
                    </select>
                    {selectedCredit && (
                      <p className="text-xs text-gray-500 mt-1">
                        Available: {selectedCredit.daysAvailable.toFixed(1)} days
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">3</span>
                  Reason (Optional)
                </h3>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Provide reason for taking comp-off (optional)..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Notification Option */}
              <div className="mb-6">
                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.sendNotification}
                    onChange={(e) => setFormData({ ...formData, sendNotification: e.target.checked })}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">Send Manager Notification</div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      Your manager will be notified about this comp-off application
                    </div>
                  </div>
                </label>
              </div>

              {/* Summary */}
              {formData.selectedCreditId && formData.leaveDate && formData.leaveDays && (
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 text-sm">
                      <h4 className="font-semibold text-blue-900 mb-1">Application Summary</h4>
                      <p className="text-blue-800">
                        You are applying for <span className="font-semibold">{formData.leaveDays} day{parseFloat(formData.leaveDays) !== 1 ? 's' : ''}</span> of comp-off
                        on <span className="font-semibold">{new Date(formData.leaveDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>.
                        {selectedCredit && ` After this, you will have ${(selectedCredit.daysAvailable - parseFloat(formData.leaveDays)).toFixed(1)} day(s) remaining from this credit.`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Alert */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 text-sm">
                    <h4 className="font-semibold text-yellow-900 mb-1">Important Information</h4>
                    <ul className="text-yellow-800 space-y-1 list-disc list-inside">
                      <li>Manager approval is required before comp-off is granted</li>
                      <li>Apply at least 2 days in advance for better approval chances</li>
                      <li>Comp-off credits will expire if not used within 90 days</li>
                      <li>Half-day comp-off cannot be combined with regular leave on the same day</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formData.selectedCreditId || !formData.leaveDate || !formData.leaveDays}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Submit Application
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
