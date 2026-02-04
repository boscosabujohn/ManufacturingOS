'use client';

import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Clock, Send, MessageSquare, FileText, AlertCircle, TrendingUp } from 'lucide-react';

// ============================================================================
// 13. APPROVE JOURNAL ENTRY MODAL (Green Gradient)
// ============================================================================
interface ApproveJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryId?: string;
  onApprove?: (data: any) => void;
}

export function ApproveJournalEntryModal({ isOpen, onClose, entryId, onApprove }: ApproveJournalEntryModalProps) {
  const [comments, setComments] = useState('');
  const [autoPost, setAutoPost] = useState(true);

  const handleApprove = () => {
    console.log('Approving entry:', entryId, { comments, autoPost });
    onApprove?.({ entryId, comments, autoPost });
    onClose();
  };

  if (!isOpen) return null;

  const entryData = {
    voucherNumber: 'JE-2025-0456',
    createdBy: 'John Doe',
    createdDate: '2025-01-20',
    description: 'Monthly depreciation for machinery',
    totalAmount: 15000.00,
    lineCount: 2
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Approve Journal Entry</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Entry Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium text-gray-600">Voucher Number</label>
                <p className="text-gray-900 font-mono">{entryData.voucherNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Amount</label>
                <p className="text-gray-900 font-semibold">₹{entryData.totalAmount.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Created By</label>
                <p className="text-gray-900">{entryData.createdBy}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Created Date</label>
                <p className="text-gray-900">{entryData.createdDate}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-900">{entryData.description}</p>
              </div>
            </div>
          </div>

          {/* Approval Comments */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Approval Comments (Optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              placeholder="Add any comments or notes about this approval..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Options */}
          <div className="mb-3">
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={autoPost}
                onChange={(e) => setAutoPost(e.target.checked)}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Automatically post after approval</span>
                <p className="text-xs text-gray-500">Entry will be posted to the general ledger immediately</p>
              </div>
            </label>
          </div>

          {/* Approval Checklist */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h4 className="text-green-800 font-medium mb-3">✓ Pre-Approval Checklist</h4>
            <div className="space-y-2 text-sm text-green-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Entry is balanced</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>All accounts are valid</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Within open accounting period</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Supporting documentation attached</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 rounded-b-xl flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Approve Entry
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 14. REJECT JOURNAL ENTRY MODAL (Red Gradient)
// ============================================================================
interface RejectJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryId?: string;
  onReject?: (data: any) => void;
}

export function RejectJournalEntryModal({ isOpen, onClose, entryId, onReject }: RejectJournalEntryModalProps) {
  const [reason, setReason] = useState('');
  const [rejectionCategory, setRejectionCategory] = useState('');

  const handleReject = () => {
    if (!reason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    console.log('Rejecting entry:', entryId, { reason, rejectionCategory });
    onReject?.({ entryId, reason, rejectionCategory });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-3 py-2 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Reject Journal Entry</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-3">
            <p className="text-gray-900 font-medium mb-2">
              Entry ID: <span className="font-mono">{entryId || 'JE-2025-0456'}</span>
            </p>
            <p className="text-gray-600 text-sm">
              This entry will be returned to the creator for corrections.
            </p>
          </div>

          {/* Rejection Category */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Category *</label>
            <select
              value={rejectionCategory}
              onChange={(e) => setRejectionCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="incorrect_accounts">Incorrect Account Codes</option>
              <option value="missing_documentation">Missing Documentation</option>
              <option value="wrong_amount">Incorrect Amount</option>
              <option value="wrong_period">Wrong Accounting Period</option>
              <option value="unauthorized">Unauthorized Transaction</option>
              <option value="duplicate">Duplicate Entry</option>
              <option value="other">Other Reason</option>
            </select>
          </div>

          {/* Rejection Reason */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Reason for Rejection *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Provide a detailed explanation for rejecting this entry..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              This will be sent to the entry creator for review and correction
            </p>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <h4 className="text-red-800 font-medium mb-2">⚠️ Rejection Impact</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Entry status will be changed to "Rejected"</li>
              <li>• Creator will be notified via email</li>
              <li>• Entry can be corrected and resubmitted</li>
              <li>• Rejection will be logged in audit trail</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 rounded-b-xl flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            disabled={!reason.trim() || !rejectionCategory}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Reject Entry
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 15. SUBMIT FOR APPROVAL MODAL (Blue Gradient)
// ============================================================================
interface SubmitForApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryId?: string;
  onSubmit?: (data: any) => void;
}

export function SubmitForApprovalModal({ isOpen, onClose, entryId, onSubmit }: SubmitForApprovalModalProps) {
  const [approver, setApprover] = useState('');
  const [priority, setPriority] = useState('normal');
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = () => {
    if (!approver) {
      alert('Please select an approver');
      return;
    }
    console.log('Submitting for approval:', entryId, { approver, priority, notes, attachments });
    onSubmit?.({ entryId, approver, priority, notes, attachments });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Submit for Approval</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-3">
            <p className="text-gray-900 font-medium mb-2">
              Entry ID: <span className="font-mono">{entryId || 'JE-2025-0456'}</span>
            </p>
            <p className="text-gray-600 text-sm">
              This entry will be sent to the selected approver for review.
            </p>
          </div>

          {/* Select Approver */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Approver *</label>
            <select
              value={approver}
              onChange={(e) => setApprover(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose an approver</option>
              <option value="jane.smith">Jane Smith - Finance Manager</option>
              <option value="bob.johnson">Bob Johnson - CFO</option>
              <option value="alice.wong">Alice Wong - Controller</option>
              <option value="david.lee">David Lee - Senior Accountant</option>
            </select>
          </div>

          {/* Priority */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setPriority('low')}
                className={`p-3 border rounded-lg transition-colors ${
                  priority === 'low'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">Low</div>
                <div className="text-xs">Normal processing</div>
              </button>
              <button
                onClick={() => setPriority('normal')}
                className={`p-3 border rounded-lg transition-colors ${
                  priority === 'normal'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">Normal</div>
                <div className="text-xs">Standard</div>
              </button>
              <button
                onClick={() => setPriority('high')}
                className={`p-3 border rounded-lg transition-colors ${
                  priority === 'high'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">High</div>
                <div className="text-xs">Urgent review</div>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes to Approver (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add any context or notes for the approver..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-blue-800 font-medium mb-2">📋 Approval Workflow</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Approver will receive email notification</li>
              <li>• Entry cannot be edited while pending approval</li>
              <li>• You will be notified of approval/rejection</li>
              <li>• Approval typically takes 1-2 business days</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 rounded-b-xl flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!approver}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Submit for Approval
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 16. BATCH POST JOURNAL ENTRIES MODAL (Teal Gradient)
// ============================================================================
interface BatchPostJournalEntriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEntries?: string[];
  onPost?: (data: any) => void;
}

export function BatchPostJournalEntriesModal({ isOpen, onClose, selectedEntries = [], onPost }: BatchPostJournalEntriesModalProps) {
  const [postDate, setPostDate] = useState(new Date().toISOString().split('T')[0]);
  const [validateBeforePost, setValidateBeforePost] = useState(true);
  const [skipErrors, setSkipErrors] = useState(true);

  const handlePost = () => {
    console.log('Batch posting entries:', { selectedEntries, postDate, validateBeforePost, skipErrors });
    onPost?.({ selectedEntries, postDate, validateBeforePost, skipErrors });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-3 py-2 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Batch Post Journal Entries</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Summary */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-teal-600" />
              <h3 className="font-semibold text-teal-900">Batch Summary</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-teal-700">Selected Entries:</span>
                <span className="ml-2 font-semibold text-teal-900">{selectedEntries.length}</span>
              </div>
              <div>
                <span className="text-teal-700">Total Amount:</span>
                <span className="ml-2 font-semibold text-teal-900">₹245,000</span>
              </div>
            </div>
          </div>

          {/* Post Date */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Posting Date *</label>
            <input
              type="date"
              value={postDate}
              onChange={(e) => setPostDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              All entries will be posted with this date
            </p>
          </div>

          {/* Options */}
          <div className="mb-3 space-y-3">
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={validateBeforePost}
                onChange={(e) => setValidateBeforePost(e.target.checked)}
                className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Validate entries before posting</span>
                <p className="text-xs text-gray-500">Run validation checks on all entries before posting</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={skipErrors}
                onChange={(e) => setSkipErrors(e.target.checked)}
                className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Skip entries with errors</span>
                <p className="text-xs text-gray-500">Continue posting valid entries even if some fail validation</p>
              </div>
            </label>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-yellow-800 font-medium mb-1">Important Notice</h4>
                <p className="text-sm text-yellow-700">
                  Posting entries will update the general ledger and cannot be undone. Make sure all entries have been reviewed and approved before proceeding.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 rounded-b-xl flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePost}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Post {selectedEntries.length} Entries
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 17. JOURNAL ENTRY COMMENTS MODAL (Indigo Gradient)
// ============================================================================
interface JournalEntryCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryId?: string;
}

export function JournalEntryCommentsModal({ isOpen, onClose, entryId }: JournalEntryCommentsModalProps) {
  const [newComment, setNewComment] = useState('');

  const comments = [
    {
      id: 1,
      user: 'Jane Smith',
      role: 'Finance Manager',
      date: '2025-01-20 10:30 AM',
      text: 'Please verify the depreciation rate used for this entry.'
    },
    {
      id: 2,
      user: 'John Doe',
      role: 'Senior Accountant',
      date: '2025-01-20 11:15 AM',
      text: 'The rate is based on company policy - 20% straight-line depreciation for machinery.'
    },
    {
      id: 3,
      user: 'Jane Smith',
      role: 'Finance Manager',
      date: '2025-01-20 02:45 PM',
      text: 'Confirmed. Looks good for approval.'
    }
  ];

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    console.log('Adding comment to entry:', entryId, newComment);
    setNewComment('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Entry Comments</h2>
              <p className="text-white/80 text-sm">{entryId || 'JE-2025-0456'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Comments List */}
          <div className="mb-3 max-h-96 overflow-y-auto space-y-2">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-gray-900">{comment.user}</div>
                    <div className="text-sm text-gray-600">{comment.role}</div>
                  </div>
                  <div className="text-sm text-gray-500">{comment.date}</div>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Comment</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              placeholder="Type your comment here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-3"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Post Comment
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 18. JOURNAL ENTRY AUDIT TRAIL MODAL (Slate Gradient)
// ============================================================================
interface JournalEntryAuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryId?: string;
}

export function JournalEntryAuditTrailModal({ isOpen, onClose, entryId }: JournalEntryAuditTrailModalProps) {
  const auditEvents = [
    {
      id: 1,
      timestamp: '2025-01-20 09:30 AM',
      user: 'John Doe',
      action: 'Created',
      details: 'Entry created with 2 lines totaling ₹15,000',
      icon: '✏️'
    },
    {
      id: 2,
      timestamp: '2025-01-20 09:45 AM',
      user: 'John Doe',
      action: 'Updated',
      details: 'Modified description and cost center allocation',
      icon: '📝'
    },
    {
      id: 3,
      timestamp: '2025-01-20 10:00 AM',
      user: 'John Doe',
      action: 'Submitted for Approval',
      details: 'Sent to Jane Smith for approval',
      icon: '📤'
    },
    {
      id: 4,
      timestamp: '2025-01-20 02:45 PM',
      user: 'Jane Smith',
      action: 'Approved',
      details: 'Entry approved with comment: "Looks good"',
      icon: '✅'
    },
    {
      id: 5,
      timestamp: '2025-01-20 02:46 PM',
      user: 'System',
      action: 'Posted',
      details: 'Entry automatically posted to general ledger',
      icon: '🔒'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full  max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Audit Trail</h2>
              <p className="text-white/80 text-sm">{entryId || 'JE-2025-0456'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-3">
              {auditEvents.map((event, index) => (
                <div key={event.id} className="relative flex gap-2">
                  <div className="flex-shrink-0 w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-2xl border-4 border-white shadow-sm z-10">
                    {event.icon}
                  </div>
                  <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{event.action}</h3>
                        <p className="text-sm text-gray-600">by {event.user}</p>
                      </div>
                      <div className="text-sm text-gray-500">{event.timestamp}</div>
                    </div>
                    <p className="text-gray-700">{event.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-2xl font-bold text-slate-900">{auditEvents.length}</div>
                <div className="text-sm text-slate-600">Total Events</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">3</div>
                <div className="text-sm text-slate-600">Users Involved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">5h 16m</div>
                <div className="text-sm text-slate-600">Total Duration</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
