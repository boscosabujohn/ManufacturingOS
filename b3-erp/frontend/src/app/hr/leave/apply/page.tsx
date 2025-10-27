'use client';

import React, { useState, useMemo } from 'react';
import { Send, Calendar, AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { mockMyLeaveBalances } from '@/data/hr/leave-balances';
import { mockLeaveTypes } from '@/data/hr/leave-types';

export default function ApplyLeavePage() {
  const [leaveBalances] = useState(mockMyLeaveBalances);
  const [leaveTypes] = useState(mockLeaveTypes);

  // Form state
  const [selectedLeaveType, setSelectedLeaveType] = useState('');
  const [durationType, setDurationType] = useState('full-day');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Calculate days
  const calculatedDays = useMemo(() => {
    if (!fromDate || !toDate) return 0;

    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    let days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (durationType === 'half-day-first' || durationType === 'half-day-second') {
      days = 0.5;
    }

    return days;
  }, [fromDate, toDate, durationType]);

  // Get selected leave balance
  const selectedBalance = useMemo(() => {
    if (!selectedLeaveType) return null;
    return leaveBalances.find(lb => lb.leaveTypeCode === selectedLeaveType);
  }, [selectedLeaveType, leaveBalances]);

  // Get selected leave type details
  const selectedLeaveTypeDetails = useMemo(() => {
    if (!selectedLeaveType) return null;
    return leaveTypes.find(lt => lt.code === selectedLeaveType);
  }, [selectedLeaveType, leaveTypes]);

  // Validate form
  const canSubmit = useMemo(() => {
    return selectedLeaveType && fromDate && toDate && reason.trim().length >= 10;
  }, [selectedLeaveType, fromDate, toDate, reason]);

  // Check if leave exceeds balance
  const exceedsBalance = useMemo(() => {
    if (!selectedBalance) return false;
    return calculatedDays > selectedBalance.balance;
  }, [calculatedDays, selectedBalance]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) return;

    // Simulate submission
    console.log('Submitting leave application:', {
      leaveType: selectedLeaveType,
      durationType,
      fromDate,
      toDate,
      days: calculatedDays,
      reason,
      emergencyContact,
      attachedFile
    });

    setShowSuccessMessage(true);

    // Reset form
    setTimeout(() => {
      setSelectedLeaveType('');
      setDurationType('full-day');
      setFromDate('');
      setToDate('');
      setReason('');
      setEmergencyContact('');
      setAttachedFile(null);
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Send className="w-7 h-7 text-blue-600" />
          Apply for Leave
        </h1>
        <p className="text-gray-600 mt-1">Submit a new leave application for approval</p>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-900">Leave Application Submitted Successfully!</h3>
            <p className="text-sm text-green-700 mt-1">Your leave request has been sent for approval. You will be notified once it's reviewed.</p>
          </div>
          <button onClick={() => setShowSuccessMessage(false)} className="text-green-600 hover:text-green-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Leave Balance Summary */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Your Leave Balance</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {leaveBalances.filter(lb => lb.balance > 0 || lb.leaveTypeCode === 'WFH').map((balance) => (
            <div
              key={balance.id}
              className={`rounded-lg p-4 border-2 transition-all cursor-pointer ${
                selectedLeaveType === balance.leaveTypeCode
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => setSelectedLeaveType(balance.leaveTypeCode)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{balance.leaveTypeIcon}</span>
                <span className={`text-xs font-mono font-semibold ${balance.leaveTypeColor.split(' ')[1]}`}>
                  {balance.leaveTypeCode}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">{balance.leaveTypeName}</p>
              <p className="text-xl font-bold text-gray-900">{balance.balance}</p>
              <p className="text-xs text-gray-500">of {balance.totalEntitlement} days</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leave Application Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Leave Application Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Leave Type & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave Type <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedLeaveType}
                onChange={(e) => setSelectedLeaveType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Leave Type</option>
                {leaveTypes.filter(lt => lt.isActive).map((lt) => (
                  <option key={lt.id} value={lt.code}>
                    {lt.name} ({lt.code}) - {lt.paidLeave ? 'Paid' : 'Unpaid'}
                  </option>
                ))}
              </select>
              {selectedLeaveTypeDetails && (
                <p className="text-xs text-gray-500 mt-1">
                  Max: {selectedLeaveTypeDetails.maxDaysPerYear} days/year
                  {selectedLeaveTypeDetails.encashable && ' • Encashable'}
                  {selectedLeaveTypeDetails.carryForward && ' • Carry Forward'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration Type <span className="text-red-500">*</span>
              </label>
              <select
                value={durationType}
                onChange={(e) => setDurationType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="full-day">Full Day</option>
                <option value="half-day-first">Half Day - First Half (9 AM - 1 PM)</option>
                <option value="half-day-second">Half Day - Second Half (2 PM - 6 PM)</option>
              </select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  if (!toDate || e.target.value > toDate) {
                    setToDate(e.target.value);
                  }
                }}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                min={fromDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Days Calculation */}
          {calculatedDays > 0 && (
            <div className={`p-4 rounded-lg border ${exceedsBalance ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-start gap-3">
                {exceedsBalance ? (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                )}
                <div>
                  <p className={`font-semibold ${exceedsBalance ? 'text-red-900' : 'text-blue-900'}`}>
                    Total Leave Duration: {calculatedDays} day{calculatedDays !== 1 ? 's' : ''}
                  </p>
                  {selectedBalance && (
                    <p className={`text-sm mt-1 ${exceedsBalance ? 'text-red-700' : 'text-blue-700'}`}>
                      {exceedsBalance ? (
                        <>⚠️ Exceeds available balance ({selectedBalance.balance} days). This request may be rejected.</>
                      ) : (
                        <>Remaining balance after approval: {selectedBalance.balance - calculatedDays} days</>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Leave <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please provide a detailed reason for your leave request (minimum 10 characters)..."
              required
              minLength={10}
            />
            <p className="text-xs text-gray-500 mt-1">
              {reason.length}/10 characters minimum
            </p>
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Contact Number (Optional)
            </label>
            <input
              type="tel"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+91 98765 43210"
            />
          </div>

          {/* File Attachment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attach Supporting Document (Optional)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {attachedFile && (
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                {attachedFile.name} ({(attachedFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={!canSubmit || exceedsBalance}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${
                canSubmit && !exceedsBalance
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              Submit Application
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedLeaveType('');
                setDurationType('full-day');
                setFromDate('');
                setToDate('');
                setReason('');
                setEmergencyContact('');
                setAttachedFile(null);
              }}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>

      {/* Information Panel */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Leave Application Guidelines
        </h3>
        <ul className="text-sm text-amber-800 space-y-1 ml-7">
          <li>• Apply for leave at least 2 days in advance (except for emergency/sick leave)</li>
          <li>• Medical certificate required for sick leave exceeding 3 consecutive days</li>
          <li>• Earned Leave requires minimum 3 days notice as per company policy</li>
          <li>• Check with your supervisor about shift coverage before applying</li>
          <li>• Festival Leave is subject to production schedule and must be planned in advance</li>
          <li>• Compensatory Off must be availed within 90 days of credit</li>
        </ul>
      </div>
    </div>
  );
}
