'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Save,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Paperclip,
  Link as LinkIcon,
  ArrowUp,
  FileText,
  TrendingUp,
  Search,
  BarChart3,
  GitBranch,
  Flag,
  XCircle,
  Target,
  Clock,
  Users,
  Shield,
  Calendar,
} from 'lucide-react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IssueRisk {
  id?: string;
  number?: string;
  title: string;
  type: 'Issue' | 'Risk';
  category: 'Technical' | 'Financial' | 'Resource' | 'Schedule' | 'Quality' | 'Safety' | 'Client';
  projectNumber: string;
  projectName: string;
  description: string;
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
  probability: 'Very High' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed' | 'Deferred';
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  raisedBy: string;
  assignedTo: string;
  raisedDate: string;
  targetDate: string;
  resolvedDate?: string;
  mitigationPlan: string;
  costImpact: number;
  scheduleImpact: number;
}

// ==============================================
// 1. LOG ISSUE MODAL
// ==============================================
interface LogIssueModalProps extends BaseModalProps {
  onSubmit: (data: IssueRisk) => void;
}

export function LogIssueModal({ isOpen, onClose, onSubmit }: LogIssueModalProps) {
  const [formData, setFormData] = useState<IssueRisk>({
    title: '',
    type: 'Issue',
    category: 'Technical',
    projectNumber: '',
    projectName: '',
    description: '',
    impact: 'Medium',
    probability: 'High',
    status: 'Open',
    priority: 'P2',
    raisedBy: 'Current User',
    assignedTo: '',
    raisedDate: new Date().toISOString().split('T')[0],
    targetDate: '',
    mitigationPlan: '',
    costImpact: 0,
    scheduleImpact: 0,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Log New Issue</h2>
              <p className="text-red-100 text-sm">Report a new project issue</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Issue Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Brief description of the issue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.projectNumber}
                  onChange={(e) => setFormData({ ...formData, projectNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select project</option>
                  <option value="PRJ-2024-001">PRJ-2024-001 - Taj Hotel Kitchen</option>
                  <option value="PRJ-2024-002">PRJ-2024-002 - BigBasket Cold Storage</option>
                  <option value="PRJ-2024-003">PRJ-2024-003 - L&T Switchgear</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="Technical">Technical</option>
                  <option value="Financial">Financial</option>
                  <option value="Resource">Resource</option>
                  <option value="Schedule">Schedule</option>
                  <option value="Quality">Quality</option>
                  <option value="Safety">Safety</option>
                  <option value="Client">Client</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="Detailed description of the issue..."
              />
            </div>
          </div>

          {/* Impact Assessment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              Impact Assessment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Impact Level <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="P4">P4 - Low</option>
                  <option value="P3">P3 - Medium</option>
                  <option value="P2">P2 - High</option>
                  <option value="P1">P1 - Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost Impact (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.costImpact}
                  onChange={(e) => setFormData({ ...formData, costImpact: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule Impact (days)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.scheduleImpact}
                  onChange={(e) => setFormData({ ...formData, scheduleImpact: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-red-600" />
              Assignment & Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign To <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select person/team</option>
                  <option value="Technical Team">Technical Team</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Procurement Team">Procurement Team</option>
                  <option value="QC Team">QC Team</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Resolution Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Mitigation Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mitigation Plan <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.mitigationPlan}
              onChange={(e) => setFormData({ ...formData, mitigationPlan: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Describe the plan to resolve or mitigate this issue..."
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Log Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==============================================
// 2. EDIT ISSUE MODAL
// ==============================================
interface EditIssueModalProps extends BaseModalProps {
  issue: IssueRisk;
  onSubmit: (data: IssueRisk) => void;
}

export function EditIssueModal({ isOpen, onClose, issue, onSubmit }: EditIssueModalProps) {
  const [formData, setFormData] = useState<IssueRisk>(issue);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Edit Issue</h2>
              <p className="text-purple-100 text-sm">{issue.number} - Update issue details</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Similar fields to Log Issue Modal */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
                <option value="Deferred">Deferred</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                required
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="P4">P4 - Low</option>
                <option value="P3">P3 - Medium</option>
                <option value="P2">P2 - High</option>
                <option value="P1">P1 - Critical</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
              <input
                type="text"
                required
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
              <input
                type="date"
                required
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==============================================
// 3. ASSIGN ISSUE MODAL
// ==============================================
interface AssignIssueModalProps extends BaseModalProps {
  issue: IssueRisk;
  onSubmit: (data: { assignedTo: string; notifyUser: boolean; comment: string }) => void;
}

export function AssignIssueModal({ isOpen, onClose, issue, onSubmit }: AssignIssueModalProps) {
  const [formData, setFormData] = useState({
    assignedTo: issue.assignedTo,
    notifyUser: true,
    comment: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const teamMembers = [
    'Rajesh Kumar - Project Manager',
    'Priya Sharma - Project Manager',
    'Amit Patel - Electrical Engineer',
    'Technical Team',
    'Procurement Team',
    'QC Team',
    'Installation Team',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Assign Issue</h2>
              <p className="text-blue-100 text-sm">{issue.number} - {issue.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign To <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select person or team</option>
              {teamMembers.map((member, index) => (
                <option key={index} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Comment
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Add a note about this assignment..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="notifyUser"
              checked={formData.notifyUser}
              onChange={(e) => setFormData({ ...formData, notifyUser: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="notifyUser" className="text-sm text-gray-700">
              Send email notification to assignee
            </label>
          </div>

          {/* Current Assignment Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900">Current Assignment</p>
            <p className="text-sm text-gray-600 mt-1">Currently assigned to: {issue.assignedTo}</p>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==============================================
// 4. UPDATE STATUS MODAL
// ==============================================
interface UpdateStatusModalProps extends BaseModalProps {
  issue: IssueRisk;
  onSubmit: (data: { status: string; comment: string }) => void;
}

export function UpdateStatusModal({ isOpen, onClose, issue, onSubmit }: UpdateStatusModalProps) {
  const [formData, setFormData] = useState({
    status: issue.status,
    comment: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Flag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Update Status</h2>
              <p className="text-green-100 text-sm">{issue.number} - Change issue status</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Status <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Deferred">Deferred</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Update Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Explain the reason for this status change..."
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900">Current Status</p>
            <p className="text-sm text-gray-600 mt-1">
              Status: <span className="font-semibold">{issue.status}</span>
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==============================================
// 5. ADD COMMENT MODAL
// ==============================================
interface AddCommentModalProps extends BaseModalProps {
  issue: IssueRisk;
  onSubmit: (data: { comment: string; isPrivate: boolean }) => void;
}

export function AddCommentModal({ isOpen, onClose, issue, onSubmit }: AddCommentModalProps) {
  const [formData, setFormData] = useState({
    comment: '',
    isPrivate: false,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ comment: '', isPrivate: false });
    onClose();
  };

  const mockComments = [
    { id: 1, user: 'Rajesh Kumar', time: '2 hours ago', text: 'Contacted supplier, they confirmed delay', isPrivate: false },
    { id: 2, user: 'Priya Sharma', time: '1 hour ago', text: 'Updated procurement team', isPrivate: false },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Comments & Discussion</h2>
              <p className="text-cyan-100 text-sm">{issue.number} - {issue.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Existing Comments */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Previous Comments</h3>
            <div className="space-y-3">
              {mockComments.map(comment => (
                <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-900">
                        {comment.user.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{comment.user}</p>
                      <p className="text-xs text-gray-500">{comment.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Comment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Comment <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                placeholder="Type your comment here..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPrivate"
                checked={formData.isPrivate}
                onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                className="w-4 h-4 text-cyan-600 rounded"
              />
              <label htmlFor="isPrivate" className="text-sm text-gray-700">
                Private comment (visible only to team members)
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Close
              </button>
              <button type="submit" className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Add Comment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==============================================
// 6. ATTACH FILES MODAL
// ==============================================
interface AttachFilesModalProps extends BaseModalProps {
  issue: IssueRisk;
  onSubmit: (files: File[]) => void;
}

export function AttachFilesModal({ isOpen, onClose, issue, onSubmit }: AttachFilesModalProps) {
  const [files, setFiles] = useState<File[]>([]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(files);
    onClose();
  };

  const mockAttachments = [
    { id: 1, name: 'supplier_email.pdf', size: '245 KB', uploadedBy: 'Rajesh Kumar', date: '2024-03-10' },
    { id: 2, name: 'equipment_photo.jpg', size: '1.2 MB', uploadedBy: 'Amit Patel', date: '2024-03-12' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Paperclip className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Attachments</h2>
              <p className="text-indigo-100 text-sm">{issue.number} - Upload files and documents</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Existing Attachments */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Existing Attachments</h3>
            <div className="space-y-2">
              {mockAttachments.map(attachment => (
                <div key={attachment.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                      <p className="text-xs text-gray-500">
                        {attachment.size} • Uploaded by {attachment.uploadedBy} on {attachment.date}
                      </p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Download</button>
                </div>
              ))}
            </div>
          </div>

          {/* Upload New Files */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Files</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Paperclip className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700 font-medium">Choose files</span>
                  <span className="text-gray-600"> or drag and drop</span>
                </label>
                <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX, JPG, PNG up to 10MB each</p>
              </div>
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {Array.from(files).map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <FileText className="w-4 h-4" />
                      <span>{file.name}</span>
                      <span className="text-gray-500">({(file.size / 1024).toFixed(0)} KB)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Close
              </button>
              <button
                type="submit"
                disabled={files.length === 0}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Paperclip className="w-4 h-4" />
                Upload Files ({files.length})
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==============================================
// 7. LINK ITEMS MODAL
// ==============================================
interface LinkItemsModalProps extends BaseModalProps {
  issue: IssueRisk;
  onSubmit: (data: { itemType: string; itemId: string; relationshipType: string }) => void;
}

export function LinkItemsModal({ isOpen, onClose, issue, onSubmit }: LinkItemsModalProps) {
  const [formData, setFormData] = useState({
    itemType: 'Task',
    itemId: '',
    relationshipType: 'Relates to',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const mockLinkedItems = [
    { type: 'Task', id: 'TASK-245', title: 'Equipment Installation', relationship: 'Blocks' },
    { type: 'Change Order', id: 'CHG-012', title: 'Design Modification', relationship: 'Related to' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <LinkIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Linked Items</h2>
              <p className="text-teal-100 text-sm">{issue.number} - Link to tasks, risks, changes</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Existing Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Current Links</h3>
            <div className="space-y-2">
              {mockLinkedItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <GitBranch className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.id} - {item.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.type} • {item.relationship}
                      </p>
                    </div>
                  </div>
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium">Remove</button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Link */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Add New Link</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
                <select
                  value={formData.itemType}
                  onChange={(e) => setFormData({ ...formData, itemType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Task">Task</option>
                  <option value="Risk">Risk</option>
                  <option value="Change Order">Change Order</option>
                  <option value="Deliverable">Deliverable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                <select
                  value={formData.relationshipType}
                  onChange={(e) => setFormData({ ...formData, relationshipType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Relates to">Relates to</option>
                  <option value="Blocks">Blocks</option>
                  <option value="Blocked by">Blocked by</option>
                  <option value="Duplicates">Duplicates</option>
                  <option value="Causes">Causes</option>
                  <option value="Caused by">Caused by</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Item</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.itemId}
                  onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="Search by ID or title..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Close
              </button>
              <button type="submit" className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Add Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==============================================
// 8. ESCALATE ISSUE MODAL
// ==============================================
interface EscalateIssueModalProps extends BaseModalProps {
  issue: IssueRisk;
  onSubmit: (data: { escalateTo: string; reason: string; urgency: string }) => void;
}

export function EscalateIssueModal({ isOpen, onClose, issue, onSubmit }: EscalateIssueModalProps) {
  const [formData, setFormData] = useState({
    escalateTo: '',
    reason: '',
    urgency: 'High',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <ArrowUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Escalate Issue</h2>
              <p className="text-orange-100 text-sm">{issue.number} - Escalate to management</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">Issue Details</p>
                <p className="text-sm text-orange-700 mt-1">{issue.title}</p>
                <p className="text-xs text-orange-600 mt-1">
                  Impact: {issue.impact} | Priority: {issue.priority} | Status: {issue.status}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Escalate To <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.escalateTo}
              onChange={(e) => setFormData({ ...formData, escalateTo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select escalation level</option>
              <option value="Senior Project Manager">Senior Project Manager</option>
              <option value="Program Director">Program Director</option>
              <option value="VP Operations">VP Operations</option>
              <option value="CEO">CEO</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Urgency Level <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="Medium">Medium - Standard escalation</option>
              <option value="High">High - Urgent attention required</option>
              <option value="Critical">Critical - Immediate action needed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Escalation Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Explain why this issue needs to be escalated..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2">
              <ArrowUp className="w-4 h-4" />
              Escalate Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==============================================
// 9. RESOLVE ISSUE MODAL
// ==============================================
interface ResolveIssueModalProps extends BaseModalProps {
  issue: IssueRisk;
  onSubmit: (data: { resolution: string; actualCost: number; actualDays: number; lessonsLearned: string }) => void;
}

export function ResolveIssueModal({ isOpen, onClose, issue, onSubmit }: ResolveIssueModalProps) {
  const [formData, setFormData] = useState({
    resolution: '',
    actualCost: 0,
    actualDays: 0,
    lessonsLearned: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Resolve Issue</h2>
              <p className="text-green-100 text-sm">{issue.number} - Mark issue as resolved</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resolution Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.resolution}
              onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Describe how the issue was resolved..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Actual Cost Impact (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.actualCost}
                onChange={(e) => setFormData({ ...formData, actualCost: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">Estimated: ₹{issue.costImpact.toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Actual Schedule Impact (days)</label>
              <input
                type="number"
                min="0"
                value={formData.actualDays}
                onChange={(e) => setFormData({ ...formData, actualDays: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">Estimated: {issue.scheduleImpact} days</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lessons Learned</label>
            <textarea
              value={formData.lessonsLearned}
              onChange={(e) => setFormData({ ...formData, lessonsLearned: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="What did we learn from this issue?"
            />
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-medium text-green-900">Resolution Summary</p>
            <div className="mt-2 space-y-1 text-sm">
              <p className="text-gray-700">Issue: {issue.title}</p>
              <p className="text-gray-700">Raised: {issue.raisedDate}</p>
              <p className="text-gray-700">Resolution Date: {new Date().toISOString().split('T')[0]}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Mark as Resolved
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==============================================
// 10. CLOSE ISSUE MODAL
// ==============================================
interface CloseIssueModalProps extends BaseModalProps {
  issue: IssueRisk;
  onSubmit: (data: { closureNotes: string; verified: boolean }) => void;
}

export function CloseIssueModal({ isOpen, onClose, issue, onSubmit }: CloseIssueModalProps) {
  const [formData, setFormData] = useState({
    closureNotes: '',
    verified: false,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Close Issue</h2>
              <p className="text-gray-100 text-sm">{issue.number} - Close and archive issue</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Closure Confirmation</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Closing an issue marks it as complete and archives it. This action can be undone if needed.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Closure Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.closureNotes}
              onChange={(e) => setFormData({ ...formData, closureNotes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
              placeholder="Add final notes before closing..."
            />
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="verified"
              checked={formData.verified}
              onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
              className="mt-1 w-4 h-4 text-gray-600 rounded"
            />
            <label htmlFor="verified" className="text-sm text-gray-700">
              I have verified that the issue has been fully resolved and all related tasks are complete
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.verified}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Close Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==============================================
// 11. IMPACT ANALYSIS MODAL
// ==============================================
interface ImpactAnalysisModalProps extends BaseModalProps {
  issue: IssueRisk;
}

export function ImpactAnalysisModal({ isOpen, onClose, issue }: ImpactAnalysisModalProps) {
  if (!isOpen) return null;

  const impactData = {
    schedule: {
      estimatedDelay: issue.scheduleImpact,
      criticalPath: 'Yes',
      affectedMilestones: ['Equipment Installation', 'Testing Phase', 'Client Handover'],
      recoveryOptions: ['Fast-track activities', 'Parallel execution', 'Overtime work'],
    },
    cost: {
      directCost: issue.costImpact,
      indirectCost: issue.costImpact * 0.3,
      contingencyUsed: 25000,
      totalImpact: issue.costImpact + issue.costImpact * 0.3,
    },
    resources: {
      additionalResources: ['2 Installation Technicians', '1 Project Coordinator'],
      reallocations: ['Shift team from Project B', 'Hire contractors'],
      skillGaps: ['Specialized equipment knowledge'],
    },
    quality: {
      riskToQuality: 'Medium',
      mitigationActions: ['Enhanced QC checks', 'Third-party inspection'],
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Impact Analysis</h2>
              <p className="text-amber-100 text-sm">{issue.number} - Comprehensive impact assessment</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Schedule Impact */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-amber-600" />
              Schedule Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Estimated Delay</p>
                <p className="text-2xl font-bold text-red-900">{impactData.schedule.estimatedDelay} days</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Critical Path Impact</p>
                <p className="text-2xl font-bold text-orange-900">{impactData.schedule.criticalPath}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Affected Milestones:</p>
              <ul className="list-disc list-inside space-y-1">
                {impactData.schedule.affectedMilestones.map((milestone, index) => (
                  <li key={index} className="text-sm text-gray-600">{milestone}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Recovery Options:</p>
              <ul className="list-disc list-inside space-y-1">
                {impactData.schedule.recoveryOptions.map((option, index) => (
                  <li key={index} className="text-sm text-gray-600">{option}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cost Impact */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              Financial Impact
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-gray-600">Direct Cost</p>
                <p className="text-lg font-bold text-blue-900">₹{impactData.cost.directCost.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-xs text-gray-600">Indirect Cost</p>
                <p className="text-lg font-bold text-purple-900">₹{impactData.cost.indirectCost.toLocaleString()}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-xs text-gray-600">Contingency Used</p>
                <p className="text-lg font-bold text-yellow-900">₹{impactData.cost.contingencyUsed.toLocaleString()}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-xs text-gray-600">Total Impact</p>
                <p className="text-lg font-bold text-red-900">₹{impactData.cost.totalImpact.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Resource Impact */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-amber-600" />
              Resource Impact
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Additional Resources Needed:</p>
                <div className="flex flex-wrap gap-2">
                  {impactData.resources.additionalResources.map((resource, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Resource Reallocations:</p>
                <ul className="list-disc list-inside space-y-1">
                  {impactData.resources.reallocations.map((reallocation, index) => (
                    <li key={index} className="text-sm text-gray-600">{reallocation}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Quality Impact */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-amber-600" />
              Quality Impact
            </h3>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Risk to Quality</p>
              <p className="text-xl font-bold text-yellow-900 mb-3">{impactData.quality.riskToQuality}</p>
              <p className="text-sm font-medium text-gray-700 mb-2">Mitigation Actions:</p>
              <ul className="list-disc list-inside space-y-1">
                {impactData.quality.mitigationActions.map((action, index) => (
                  <li key={index} className="text-sm text-gray-600">{action}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end rounded-b-xl">
          <button onClick={onClose} className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================================
// 12. ROOT CAUSE MODAL
// ==============================================
interface RootCauseModalProps extends BaseModalProps {
  issue: IssueRisk;
  onSubmit: (data: { rootCause: string; analysis: string; preventiveMeasures: string }) => void;
}

export function RootCauseModal({ isOpen, onClose, issue, onSubmit }: RootCauseModalProps) {
  const [formData, setFormData] = useState({
    rootCause: '',
    analysis: '',
    preventiveMeasures: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const whyAnalysis = [
    'Why did the equipment delivery delay? → Manufacturing issues at supplier',
    'Why manufacturing issues? → Quality control failures',
    'Why quality failures? → Inadequate process documentation',
    'Why inadequate documentation? → Lack of standardization',
    'Root Cause → No standard operating procedures for critical components',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-violet-700 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Root Cause Analysis</h2>
              <p className="text-violet-100 text-sm">{issue.number} - Identify underlying causes</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 5 Whys Analysis Example */}
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">5 Whys Analysis Framework</h3>
            <div className="space-y-2">
              {whyAnalysis.map((why, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-violet-600 font-semibold">{index + 1}.</span>
                  <p className="text-sm text-gray-700">{why}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Root Cause <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.rootCause}
              onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
              placeholder="What is the fundamental cause of this issue?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Detailed Analysis <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.analysis}
              onChange={(e) => setFormData({ ...formData, analysis: e.target.value })}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
              placeholder="Provide detailed analysis of the root cause..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preventive Measures <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.preventiveMeasures}
              onChange={(e) => setFormData({ ...formData, preventiveMeasures: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
              placeholder="What measures should be taken to prevent recurrence?"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Analysis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==============================================
// 13. ISSUE REPORT MODAL
// ==============================================
interface IssueReportModalProps extends BaseModalProps {
  onSubmit: (data: { reportType: string; format: string; filters: any }) => void;
}

export function IssueReportModal({ isOpen, onClose, onSubmit }: IssueReportModalProps) {
  const [formData, setFormData] = useState({
    reportType: 'Summary',
    format: 'PDF',
    dateFrom: '',
    dateTo: '',
    projects: [] as string[],
    status: 'All',
    impact: 'All',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Generate Issue Report</h2>
              <p className="text-blue-100 text-sm">Create customized issue reports</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select
                value={formData.reportType}
                onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Summary">Summary Report</option>
                <option value="Detailed">Detailed Report</option>
                <option value="Trend">Trend Analysis</option>
                <option value="Executive">Executive Dashboard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
                <option value="PowerPoint">PowerPoint</option>
                <option value="CSV">CSV</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={formData.dateFrom}
                onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={formData.dateTo}
                onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Open">Open Only</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Impact Filter</label>
              <select
                value={formData.impact}
                onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Impact Levels</option>
                <option value="Critical">Critical Only</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Report Will Include:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Issue summary statistics</li>
              <li>• Cost and schedule impact analysis</li>
              <li>• Resolution status and trends</li>
              <li>• Top issues by impact</li>
              <li>• Recommendations and action items</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==============================================
// 14. BULK UPDATE MODAL
// ==============================================
interface BulkUpdateModalProps extends BaseModalProps {
  selectedIssues: IssueRisk[];
  onSubmit: (data: { action: string; value: string }) => void;
}

export function BulkUpdateModal({ isOpen, onClose, selectedIssues, onSubmit }: BulkUpdateModalProps) {
  const [formData, setFormData] = useState({
    action: 'status',
    value: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Bulk Update Issues</h2>
              <p className="text-pink-100 text-sm">Update {selectedIssues.length} selected issues</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900 mb-2">Selected Issues ({selectedIssues.length})</p>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {selectedIssues.map(issue => (
                <p key={issue.id} className="text-sm text-gray-700">
                  {issue.number} - {issue.title}
                </p>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <select
              value={formData.action}
              onChange={(e) => setFormData({ ...formData, action: e.target.value, value: '' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              <option value="status">Change Status</option>
              <option value="priority">Change Priority</option>
              <option value="assignee">Change Assignee</option>
              <option value="category">Change Category</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Value</label>
            {formData.action === 'status' && (
              <select
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Select status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            )}
            {formData.action === 'priority' && (
              <select
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Select priority</option>
                <option value="P1">P1 - Critical</option>
                <option value="P2">P2 - High</option>
                <option value="P3">P3 - Medium</option>
                <option value="P4">P4 - Low</option>
              </select>
            )}
            {formData.action === 'assignee' && (
              <input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                placeholder="Enter assignee name"
              />
            )}
            {formData.action === 'category' && (
              <select
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Select category</option>
                <option value="Technical">Technical</option>
                <option value="Financial">Financial</option>
                <option value="Resource">Resource</option>
                <option value="Schedule">Schedule</option>
                <option value="Quality">Quality</option>
                <option value="Safety">Safety</option>
                <option value="Client">Client</option>
              </select>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Update All ({selectedIssues.length})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==============================================
// 15. ISSUE BOARD MODAL (Kanban View)
// ==============================================
interface IssueBoardModalProps extends BaseModalProps {
  issues: IssueRisk[];
}

export function IssueBoardModal({ isOpen, onClose, issues }: IssueBoardModalProps) {
  if (!isOpen) return null;

  const statusColumns = {
    'Open': issues.filter(i => i.status === 'Open'),
    'In Progress': issues.filter(i => i.status === 'In Progress'),
    'Resolved': issues.filter(i => i.status === 'Resolved'),
    'Closed': issues.filter(i => i.status === 'Closed'),
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Issue Board</h2>
              <p className="text-slate-100 text-sm">Kanban view of all issues</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(statusColumns).map(([status, statusIssues]) => (
              <div key={status} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{status}</h3>
                  <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                    {statusIssues.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {statusIssues.map(issue => (
                    <div key={issue.id} className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          issue.priority === 'P1' ? 'bg-red-100 text-red-700' :
                          issue.priority === 'P2' ? 'bg-orange-100 text-orange-700' :
                          issue.priority === 'P3' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {issue.priority}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${
                          issue.impact === 'Critical' ? 'bg-red-500' :
                          issue.impact === 'High' ? 'bg-orange-500' :
                          issue.impact === 'Medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}></span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">{issue.title}</p>
                      <p className="text-xs text-gray-600 mb-2">{issue.number}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{issue.category}</span>
                        <span>{issue.assignedTo.split(' ')[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end rounded-b-xl">
          <button onClick={onClose} className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
