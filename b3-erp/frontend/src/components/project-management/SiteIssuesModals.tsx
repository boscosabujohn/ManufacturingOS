'use client';

import { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Clock, FileText, Upload, Users, MessageSquare, TrendingUp, Calendar, Shield, Eye } from 'lucide-react';

// ============================================================================
// 1. Report Issue Modal (Blue gradient)
// ============================================================================

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: (data: any) => void;
}

export function ReportIssueModal({ isOpen, onClose, onReport }: ReportIssueModalProps) {
  const [formData, setFormData] = useState({
    projectId: '',
    issueTitle: '',
    issueType: 'Technical',
    severity: 'Medium',
    priority: 'P3',
    location: '',
    description: '',
    impactOnWork: '',
    reportedBy: '',
    reportedByRole: '',
  });

  const isFormValid = formData.projectId && formData.issueTitle && formData.location &&
                       formData.description && formData.reportedBy;

  const handleSubmit = () => {
    if (isFormValid) {
      onReport(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Report New Issue</h2>
              <p className="text-blue-100 text-sm">Document and track site issues</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project ID <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Project</option>
                    <option value="PRJ-2025-001">PRJ-2025-001 - Taj Hotels Kitchen</option>
                    <option value="PRJ-2025-002">PRJ-2025-002 - BigBasket Cold Room</option>
                    <option value="PRJ-2025-003">PRJ-2025-003 - L&T Campus Kitchen</option>
                    <option value="PRJ-2025-004">PRJ-2025-004 - ITC Grand Bakery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Main Kitchen - Cooking Section"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.issueTitle}
                    onChange={(e) => setFormData({ ...formData, issueTitle: e.target.value })}
                    placeholder="Brief title describing the issue"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Classification */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Classification</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                  <select
                    value={formData.issueType}
                    onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Safety">Safety</option>
                    <option value="Quality">Quality</option>
                    <option value="Technical">Technical</option>
                    <option value="Material">Material</option>
                    <option value="Resource">Resource</option>
                    <option value="Schedule">Schedule</option>
                    <option value="Client">Client</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="P1">P1 - Immediate</option>
                    <option value="P2">P2 - High</option>
                    <option value="P3">P3 - Medium</option>
                    <option value="P4">P4 - Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description of the issue..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Impact on Work</label>
                  <textarea
                    value={formData.impactOnWork}
                    onChange={(e) => setFormData({ ...formData, impactOnWork: e.target.value })}
                    placeholder="How does this issue affect the work progress..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Reporter Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reported By</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.reportedBy}
                    onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                    placeholder="Reporter name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={formData.reportedByRole}
                    onChange={(e) => setFormData({ ...formData, reportedByRole: e.target.value })}
                    placeholder="e.g., Site Supervisor"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Report Issue
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. Edit Issue Modal (Green gradient)
// ============================================================================

interface EditIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (data: any) => void;
  issue: any;
}

export function EditIssueModal({ isOpen, onClose, onEdit, issue }: EditIssueModalProps) {
  const [formData, setFormData] = useState({
    issueTitle: issue?.issueTitle || '',
    issueType: issue?.issueType || 'Technical',
    severity: issue?.severity || 'Medium',
    priority: issue?.priority || 'P3',
    location: issue?.location || '',
    description: issue?.description || '',
    impactOnWork: issue?.impactOnWork || '',
  });

  const isFormValid = formData.issueTitle && formData.location && formData.description;

  const handleSubmit = () => {
    if (isFormValid) {
      onEdit(formData);
    }
  };

  if (!isOpen || !issue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit Issue</h2>
              <p className="text-green-100 text-sm">{issue.issueNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.issueTitle}
                onChange={(e) => setFormData({ ...formData, issueTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                <select
                  value={formData.issueType}
                  onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Safety">Safety</option>
                  <option value="Quality">Quality</option>
                  <option value="Technical">Technical</option>
                  <option value="Material">Material</option>
                  <option value="Resource">Resource</option>
                  <option value="Schedule">Schedule</option>
                  <option value="Client">Client</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="P1">P1 - Immediate</option>
                  <option value="P2">P2 - High</option>
                  <option value="P3">P3 - Medium</option>
                  <option value="P4">P4 - Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Impact on Work</label>
              <textarea
                value={formData.impactOnWork}
                onChange={(e) => setFormData({ ...formData, impactOnWork: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. Assign Issue Modal (Purple gradient)
// ============================================================================

interface AssignIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (data: any) => void;
  issue: any;
}

export function AssignIssueModal({ isOpen, onClose, onAssign, issue }: AssignIssueModalProps) {
  const [formData, setFormData] = useState({
    assignedTo: issue?.assignedTo || '',
    targetDate: '',
    priority: issue?.priority || 'P3',
    remarks: '',
  });

  const isFormValid = formData.assignedTo && formData.targetDate;

  const handleSubmit = () => {
    if (isFormValid) {
      onAssign(formData);
    }
  };

  if (!isOpen || !issue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Assign Issue</h2>
              <p className="text-purple-100 text-sm">{issue.issueNumber} - {issue.issueTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-purple-900 mb-2">Issue Details</h4>
              <p className="text-sm text-gray-700 mb-2">{issue.description}</p>
              <div className="flex items-center space-x-4 mt-3">
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                  {issue.issueType}
                </span>
                <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                  {issue.severity}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign To <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Team Member</option>
                <option value="Ramesh Kumar (Site Supervisor)">Ramesh Kumar (Site Supervisor)</option>
                <option value="Prakash Rao (Plumbing Team)">Prakash Rao (Plumbing Team)</option>
                <option value="Anil Joshi (HVAC Team)">Anil Joshi (HVAC Team)</option>
                <option value="Deepak Shah (HVAC Team)">Deepak Shah (HVAC Team)</option>
                <option value="Suresh Patel (Procurement)">Suresh Patel (Procurement)</option>
                <option value="Dinesh Kumar (Installation Team)">Dinesh Kumar (Installation Team)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Resolution Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="P1">P1 - Immediate</option>
                  <option value="P2">P2 - High</option>
                  <option value="P3">P3 - Medium</option>
                  <option value="P4">P4 - Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Remarks</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Additional instructions or notes for the assignee..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Assign Issue
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. Update Status Modal (Orange gradient)
// ============================================================================

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  issue: any;
}

export function UpdateStatusModal({ isOpen, onClose, onUpdate, issue }: UpdateStatusModalProps) {
  const [formData, setFormData] = useState({
    status: issue?.status || 'Open',
    remarks: '',
  });

  const isFormValid = formData.remarks.trim().length > 0;

  const handleSubmit = () => {
    if (isFormValid) {
      onUpdate(formData);
    }
  };

  if (!isOpen || !issue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Update Issue Status</h2>
              <p className="text-orange-100 text-sm">{issue.issueNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">{issue.issueTitle}</p>
              <p className="text-xs text-gray-600">Current Status: <span className="font-semibold">{issue.status}</span></p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
                <option value="Reopened">Reopened</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Update Remarks <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Explain the reason for status change and any relevant updates..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 10 characters required</p>
            </div>

            {formData.status === 'Closed' && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ Closing this issue will mark it as fully resolved. Ensure all resolution details are documented.
                </p>
              </div>
            )}

            {formData.status === 'Reopened' && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-sm text-red-800">
                  ⚠ Reopening this issue requires clear explanation of why the previous resolution was inadequate.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. Add Root Cause Modal (Red gradient)
// ============================================================================

interface AddRootCauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  issue: any;
}

export function AddRootCauseModal({ isOpen, onClose, onAdd, issue }: AddRootCauseModalProps) {
  const [formData, setFormData] = useState({
    rootCause: issue?.rootCause || '',
    analysisMethod: '5 Why',
    contributingFactors: '',
  });

  const isFormValid = formData.rootCause.trim().length > 0;

  const handleSubmit = () => {
    if (isFormValid) {
      onAdd(formData);
    }
  };

  if (!isOpen || !issue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Identify Root Cause</h2>
              <p className="text-red-100 text-sm">Analyze and document the root cause</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-red-900 mb-2">Issue Details</h4>
              <p className="text-sm font-medium text-gray-900">{issue.issueTitle}</p>
              <p className="text-xs text-gray-600 mt-1">{issue.description}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Analysis Method</label>
              <select
                value={formData.analysisMethod}
                onChange={(e) => setFormData({ ...formData, analysisMethod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="5 Why">5 Why Analysis</option>
                <option value="Fishbone">Fishbone Diagram</option>
                <option value="Pareto">Pareto Analysis</option>
                <option value="Fault Tree">Fault Tree Analysis</option>
                <option value="Other">Other Method</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Root Cause <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.rootCause}
                onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
                placeholder="Describe the fundamental cause of this issue..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contributing Factors</label>
              <textarea
                value={formData.contributingFactors}
                onChange={(e) => setFormData({ ...formData, contributingFactors: e.target.value })}
                placeholder="List any contributing factors that led to this issue..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Root Cause Analysis Tips</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Focus on systemic issues, not individual blame</li>
                <li>• Ask "Why?" repeatedly to get to the fundamental cause</li>
                <li>• Consider all contributing factors (people, process, equipment, environment)</li>
                <li>• Verify your root cause by testing if fixing it would prevent recurrence</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Root Cause
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. Add Solution Modal (Teal gradient)
// ============================================================================

interface AddSolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  issue: any;
}

export function AddSolutionModal({ isOpen, onClose, onAdd, issue }: AddSolutionModalProps) {
  const [formData, setFormData] = useState({
    proposedSolution: issue?.proposedSolution || '',
    estimatedCost: '',
    estimatedTime: '',
    resourcesRequired: '',
    approvalRequired: false,
  });

  const isFormValid = formData.proposedSolution.trim().length > 0;

  const handleSubmit = () => {
    if (isFormValid) {
      onAdd(formData);
    }
  };

  if (!isOpen || !issue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Propose Solution</h2>
              <p className="text-teal-100 text-sm">Document the proposed corrective action</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-teal-900 mb-2">Issue & Root Cause</h4>
              <p className="text-sm font-medium text-gray-900">{issue.issueTitle}</p>
              {issue.rootCause && (
                <p className="text-xs text-gray-600 mt-2">
                  <span className="font-semibold">Root Cause:</span> {issue.rootCause}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proposed Solution <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.proposedSolution}
                onChange={(e) => setFormData({ ...formData, proposedSolution: e.target.value })}
                placeholder="Describe the proposed solution in detail..."
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost (₹)</label>
                <input
                  type="number"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time (days)</label>
                <input
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resources Required</label>
              <textarea
                value={formData.resourcesRequired}
                onChange={(e) => setFormData({ ...formData, resourcesRequired: e.target.value })}
                placeholder="List materials, equipment, manpower needed..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="approvalRequired"
                checked={formData.approvalRequired}
                onChange={(e) => setFormData({ ...formData, approvalRequired: e.target.checked })}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="approvalRequired" className="text-sm text-gray-700">
                Management approval required for this solution
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Solution
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 7. Add Resolution Modal (Indigo gradient)
// ============================================================================

interface AddResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  issue: any;
}

export function AddResolutionModal({ isOpen, onClose, onAdd, issue }: AddResolutionModalProps) {
  const [formData, setFormData] = useState({
    resolutionDetails: '',
    actualCost: '',
    actualTime: '',
    resolutionDate: new Date().toISOString().split('T')[0],
    verifiedBy: '',
  });

  const isFormValid = formData.resolutionDetails.trim().length > 0 && formData.resolutionDate;

  const handleSubmit = () => {
    if (isFormValid) {
      onAdd(formData);
    }
  };

  if (!isOpen || !issue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Document Resolution</h2>
              <p className="text-indigo-100 text-sm">Record how the issue was resolved</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-indigo-900 mb-2">Issue Details</h4>
              <p className="text-sm font-medium text-gray-900">{issue.issueTitle}</p>
              {issue.proposedSolution && (
                <p className="text-xs text-gray-600 mt-2">
                  <span className="font-semibold">Proposed Solution:</span> {issue.proposedSolution}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resolution Details <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.resolutionDetails}
                onChange={(e) => setFormData({ ...formData, resolutionDetails: e.target.value })}
                placeholder="Describe what actions were taken to resolve the issue..."
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resolution Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.resolutionDate}
                  onChange={(e) => setFormData({ ...formData, resolutionDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actual Cost (₹)</label>
                <input
                  type="number"
                  value={formData.actualCost}
                  onChange={(e) => setFormData({ ...formData, actualCost: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actual Time (days)</label>
                <input
                  type="number"
                  value={formData.actualTime}
                  onChange={(e) => setFormData({ ...formData, actualTime: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verified By</label>
              <input
                type="text"
                value={formData.verifiedBy}
                onChange={(e) => setFormData({ ...formData, verifiedBy: e.target.value })}
                placeholder="Name of person verifying the resolution"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ Once resolution is documented, the issue status will be updated to "Resolved"
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Resolution
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. Add Preventive Measures Modal (Emerald gradient)
// ============================================================================

interface AddPreventiveMeasuresModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  issue: any;
}

export function AddPreventiveMeasuresModal({ isOpen, onClose, onAdd, issue }: AddPreventiveMeasuresModalProps) {
  const [formData, setFormData] = useState({
    preventiveMeasures: issue?.preventiveMeasures || '',
    implementationPlan: '',
    responsiblePerson: '',
    implementationDate: '',
  });

  const isFormValid = formData.preventiveMeasures.trim().length > 0;

  const handleSubmit = () => {
    if (isFormValid) {
      onAdd(formData);
    }
  };

  if (!isOpen || !issue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Preventive Measures</h2>
              <p className="text-emerald-100 text-sm">Define actions to prevent recurrence</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-emerald-900 mb-2">Issue Summary</h4>
              <p className="text-sm font-medium text-gray-900 mb-2">{issue.issueTitle}</p>
              {issue.rootCause && (
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Root Cause:</span> {issue.rootCause}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preventive Measures <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.preventiveMeasures}
                onChange={(e) => setFormData({ ...formData, preventiveMeasures: e.target.value })}
                placeholder="Describe measures to prevent similar issues in future..."
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Implementation Plan</label>
              <textarea
                value={formData.implementationPlan}
                onChange={(e) => setFormData({ ...formData, implementationPlan: e.target.value })}
                placeholder="How will these preventive measures be implemented..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsible Person</label>
                <input
                  type="text"
                  value={formData.responsiblePerson}
                  onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                  placeholder="Person responsible for implementation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Implementation Date</label>
                <input
                  type="date"
                  value={formData.implementationDate}
                  onChange={(e) => setFormData({ ...formData, implementationDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Preventive Measure Examples</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Update standard operating procedures (SOPs)</li>
                <li>• Provide additional training to staff</li>
                <li>• Implement new quality checkpoints</li>
                <li>• Modify design standards or specifications</li>
                <li>• Enhance supervision or inspection frequency</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Measures
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 9. Upload Attachments Modal (Amber gradient)
// ============================================================================

interface UploadAttachmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: any) => void;
  issue: any;
}

export function UploadAttachmentsModal({ isOpen, onClose, onUpload, issue }: UploadAttachmentsModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [fileDescription, setFileDescription] = useState('');

  const handleFileSelect = () => {
    // Simulated file selection
    setSelectedFiles(['photo1.jpg', 'document.pdf', 'diagram.png']);
  };

  const handleSubmit = () => {
    onUpload({ files: selectedFiles, description: fileDescription });
  };

  if (!isOpen || !issue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Upload Attachments</h2>
              <p className="text-amber-100 text-sm">{issue.issueNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amber-500 transition-colors cursor-pointer">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, PDF, DOC (max 10MB each)</p>
              <button
                onClick={handleFileSelect}
                className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
              >
                Select Files
              </button>
            </div>

            {selectedFiles.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files ({selectedFiles.length})</h4>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-900">{file}</span>
                      </div>
                      <button className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File Description</label>
              <textarea
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
                placeholder="Optional description of the attachments..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Current attachments:</span> {issue.attachments} files
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedFiles.length === 0}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload Files
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 10. Add Comments Modal (Cyan gradient)
// ============================================================================

interface AddCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  issue: any;
}

export function AddCommentsModal({ isOpen, onClose, onAdd, issue }: AddCommentsModalProps) {
  const [comment, setComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  const isFormValid = comment.trim().length > 0;

  const handleSubmit = () => {
    if (isFormValid) {
      onAdd({ comment, isInternal });
      setComment('');
    }
  };

  if (!isOpen || !issue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Comment</h2>
              <p className="text-cyan-100 text-sm">{issue.issueNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{issue.issueTitle}</p>
              <p className="text-xs text-gray-600 mt-1">Status: {issue.status}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comment <span className="text-red-500">*</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your comment or update..."
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isInternal"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
              />
              <label htmlFor="isInternal" className="text-sm text-gray-700">
                Internal comment (not visible to client)
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-xs text-blue-800">
                💡 Comments are timestamped and attributed to you. They provide a complete audit trail of issue communication.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 11. Generate Report Modal (Pink gradient)
// ============================================================================

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: any) => void;
  issue?: any;
}

export function GenerateReportModal({ isOpen, onClose, onGenerate, issue }: GenerateReportModalProps) {
  const [formData, setFormData] = useState({
    reportType: 'single',
    includePhotos: true,
    includeRootCause: true,
    includeSolution: true,
    includeResolution: true,
    includePreventive: true,
    format: 'pdf',
  });

  const handleSubmit = () => {
    onGenerate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Generate Issue Report</h2>
              <p className="text-pink-100 text-sm">Create detailed issue documentation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Report Scope</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="single"
                    name="reportType"
                    value="single"
                    checked={formData.reportType === 'single'}
                    onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500"
                  />
                  <label htmlFor="single" className="text-sm text-gray-700">
                    Single Issue Report {issue && `(${issue.issueNumber})`}
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="summary"
                    name="reportType"
                    value="summary"
                    checked={formData.reportType === 'summary'}
                    onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500"
                  />
                  <label htmlFor="summary" className="text-sm text-gray-700">
                    Summary Report (All Open Issues)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="analytics"
                    name="reportType"
                    value="analytics"
                    checked={formData.reportType === 'analytics'}
                    onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500"
                  />
                  <label htmlFor="analytics" className="text-sm text-gray-700">
                    Analytics Report (Statistics & Trends)
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Include in Report</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includePhotos"
                    checked={formData.includePhotos}
                    onChange={(e) => setFormData({ ...formData, includePhotos: e.target.checked })}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includePhotos" className="text-sm text-gray-700">Attachments & Photos</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeRootCause"
                    checked={formData.includeRootCause}
                    onChange={(e) => setFormData({ ...formData, includeRootCause: e.target.checked })}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeRootCause" className="text-sm text-gray-700">Root Cause Analysis</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeSolution"
                    checked={formData.includeSolution}
                    onChange={(e) => setFormData({ ...formData, includeSolution: e.target.checked })}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeSolution" className="text-sm text-gray-700">Proposed Solution</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeResolution"
                    checked={formData.includeResolution}
                    onChange={(e) => setFormData({ ...formData, includeResolution: e.target.checked })}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeResolution" className="text-sm text-gray-700">Resolution Details</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includePreventive"
                    checked={formData.includePreventive}
                    onChange={(e) => setFormData({ ...formData, includePreventive: e.target.checked })}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includePreventive" className="text-sm text-gray-700">Preventive Measures</label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="pdf">PDF Document</option>
                <option value="excel">Excel Spreadsheet</option>
                <option value="word">Word Document</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium transition-colors"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 12. View Full Details Modal (Slate gradient)
// ============================================================================

interface ViewFullDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: any;
}

export function ViewFullDetailsModal({ isOpen, onClose, issue }: ViewFullDetailsModalProps) {
  if (!isOpen || !issue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{issue.issueNumber}</h2>
              <p className="text-slate-200 text-sm">{issue.issueTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Classification */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Classification</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Type</p>
                  <p className="font-semibold text-gray-900">{issue.issueType}</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Severity</p>
                  <p className="font-semibold text-red-700">{issue.severity}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Priority</p>
                  <p className="font-semibold text-blue-700">{issue.priority}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Status</p>
                  <p className="font-semibold text-green-700">{issue.status}</p>
                </div>
              </div>
            </div>

            {/* Project & Location */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Project & Location</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm"><span className="font-semibold">Project:</span> {issue.projectId} - {issue.projectName}</p>
                <p className="text-sm"><span className="font-semibold">Location:</span> {issue.location}</p>
                <p className="text-sm"><span className="font-semibold">Reported By:</span> {issue.reportedBy} ({issue.reportedByRole})</p>
                <p className="text-sm"><span className="font-semibold">Date:</span> {issue.reportedDate}</p>
              </div>
            </div>

            {/* Description & Impact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{issue.description}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Impact on Work</h3>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{issue.impactOnWork}</p>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-600">Cost Impact</p>
                      <p className="text-sm font-semibold text-red-600">₹{issue.costImpact.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Schedule Impact</p>
                      <p className="text-sm font-semibold text-orange-600">{issue.scheduleImpact} days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Root Cause & Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Root Cause</h3>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{issue.rootCause}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Proposed Solution</h3>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{issue.proposedSolution}</p>
                </div>
              </div>
            </div>

            {/* Assignment */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Assignment</h3>
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Assigned To</p>
                    <p className="text-sm font-semibold text-gray-900">{issue.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Target Date</p>
                    <p className="text-sm font-semibold text-gray-900">{issue.targetDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Resolution Date</p>
                    <p className="text-sm font-semibold text-gray-900">{issue.actualResolutionDate || 'Pending'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resolution */}
            {issue.resolutionDetails && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Resolution Details</h3>
                <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{issue.resolutionDetails}</p>
                </div>
              </div>
            )}

            {/* Preventive Measures */}
            {issue.preventiveMeasures && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Preventive Measures</h3>
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{issue.preventiveMeasures}</p>
                </div>
              </div>
            )}

            {/* Attachments */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Attachments</h3>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <p className="text-sm text-gray-700">{issue.attachments} files attached</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
