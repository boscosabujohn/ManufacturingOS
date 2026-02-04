'use client';

import { useState } from 'react';
import {
  FileEdit,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Calendar,
  FileText,
  Download,
  Upload,
  History,
  Users,
  TrendingUp,
  BarChart3,
  Settings,
} from 'lucide-react';

// ============================================================
// INTERFACES
// ============================================================

interface ChangeOrder {
  id: string;
  changeOrderNumber: string;
  projectId: string;
  projectName: string;
  requestDate: string;
  requestedBy: string;
  requestedByRole: 'Client' | 'Project Manager' | 'Engineer' | 'Site Supervisor';
  changeType: 'Scope Change' | 'Design Change' | 'Material Change' | 'Schedule Change' | 'Other';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  reason: string;
  impactOnCost: number;
  impactOnSchedule: number;
  originalBudget: number;
  revisedBudget: number;
  originalEndDate: string;
  revisedEndDate: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'In Progress' | 'Completed';
  approvedBy: string;
  approvalDate: string;
  implementationDate: string;
  completionDate: string;
  attachments: number;
  remarks: string;
}

// ============================================================
// MODAL 1: CREATE CHANGE ORDER MODAL (Blue Gradient)
// ============================================================

interface CreateChangeOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}

export function CreateChangeOrderModal({ isOpen, onClose, onCreate }: CreateChangeOrderModalProps) {
  const [projectId, setProjectId] = useState('');
  const [changeType, setChangeType] = useState('Scope Change');
  const [priority, setPriority] = useState('Medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');
  const [impactOnCost, setImpactOnCost] = useState('');
  const [impactOnSchedule, setImpactOnSchedule] = useState('');
  const [originalBudget, setOriginalBudget] = useState('');
  const [originalEndDate, setOriginalEndDate] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = () => {
    const revisedBudget = parseFloat(originalBudget) + parseFloat(impactOnCost || '0');
    onCreate({
      projectId,
      changeType,
      priority,
      title,
      description,
      reason,
      impactOnCost: parseFloat(impactOnCost || '0'),
      impactOnSchedule: parseInt(impactOnSchedule || '0'),
      originalBudget: parseFloat(originalBudget),
      revisedBudget,
      originalEndDate,
      attachments: attachments.length,
      status: 'Pending',
    });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Plus className="h-6 w-6" />
            <h2 className="text-xl font-bold">Create New Change Order</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Project Selection */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Project *</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Project</option>
                <option value="PRJ-2025-001">PRJ-2025-001 - Taj Hotels Kitchen</option>
                <option value="PRJ-2025-002">PRJ-2025-002 - BigBasket Cold Room</option>
                <option value="PRJ-2025-003">PRJ-2025-003 - L&T Industrial Kitchen</option>
                <option value="PRJ-2025-004">PRJ-2025-004 - ITC Bakery Setup</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Priority *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Change Type and Title */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Change Type *</label>
              <select
                value={changeType}
                onChange={(e) => setChangeType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Scope Change">Scope Change</option>
                <option value="Design Change">Design Change</option>
                <option value="Material Change">Material Change</option>
                <option value="Schedule Change">Schedule Change</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief title for the change order"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the proposed change..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Change *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Justification and rationale for this change..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Impact Analysis */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Impact Analysis</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Impact (₹)</label>
                <input
                  type="number"
                  value={impactOnCost}
                  onChange={(e) => setImpactOnCost(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Impact (days)</label>
                <input
                  type="number"
                  value={impactOnSchedule}
                  onChange={(e) => setImpactOnSchedule(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Current Project Details */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Original Budget (₹)</label>
              <input
                type="number"
                value={originalBudget}
                onChange={(e) => setOriginalBudget(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Original End Date</label>
              <input
                type="date"
                value={originalEndDate}
                onChange={(e) => setOriginalEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Attachments</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {attachments.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">{attachments.length} file(s) selected</p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!projectId || !title || !description || !reason}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Submit Change Order
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 2: EDIT CHANGE ORDER MODAL (Green Gradient)
// ============================================================

interface EditChangeOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ChangeOrder | null;
  onUpdate: (data: any) => void;
}

export function EditChangeOrderModal({ isOpen, onClose, order, onUpdate }: EditChangeOrderModalProps) {
  const [title, setTitle] = useState(order?.title || '');
  const [description, setDescription] = useState(order?.description || '');
  const [reason, setReason] = useState(order?.reason || '');
  const [priority, setPriority] = useState(order?.priority || 'Medium');
  const [impactOnCost, setImpactOnCost] = useState(order?.impactOnCost?.toString() || '');
  const [impactOnSchedule, setImpactOnSchedule] = useState(order?.impactOnSchedule?.toString() || '');

  const handleSubmit = () => {
    onUpdate({
      ...order,
      title,
      description,
      reason,
      priority,
      impactOnCost: parseFloat(impactOnCost),
      impactOnSchedule: parseInt(impactOnSchedule),
    });
    onClose();
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <FileEdit className="h-6 w-6" />
            <h2 className="text-xl font-bold">Edit Change Order</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Change Order:</span> {order.changeOrderNumber} |
              <span className="font-semibold ml-2">Project:</span> {order.projectName}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "Critical" | "High" | "Medium" | "Low")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Change *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cost Impact (₹)</label>
              <input
                type="number"
                value={impactOnCost}
                onChange={(e) => setImpactOnCost(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Schedule Impact (days)</label>
              <input
                type="number"
                value={impactOnSchedule}
                onChange={(e) => setImpactOnSchedule(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title || !description || !reason}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
          >
            Update Change Order
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 3: APPROVE/REJECT MODAL (Purple Gradient)
// ============================================================

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ChangeOrder | null;
  onApprove: (data: any) => void;
}

export function ApprovalModal({ isOpen, onClose, order, onApprove }: ApprovalModalProps) {
  const [decision, setDecision] = useState<'Approved' | 'Rejected'>('Approved');
  const [approverName, setApproverName] = useState('');
  const [approverRole, setApproverRole] = useState('Project Manager');
  const [remarks, setRemarks] = useState('');
  const [conditions, setConditions] = useState('');

  const handleSubmit = () => {
    onApprove({
      ...order,
      status: decision,
      approvedBy: `${approverName} (${approverRole})`,
      approvalDate: new Date().toISOString().split('T')[0],
      remarks: remarks || conditions,
    });
    onClose();
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6" />
            <h2 className="text-xl font-bold">Approve/Reject Change Order</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Change Order Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Change Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Change Order:</span>
                <span className="font-medium">{order.changeOrderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Project:</span>
                <span className="font-medium">{order.projectName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Title:</span>
                <span className="font-medium">{order.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cost Impact:</span>
                <span className="font-medium text-red-600">₹{(order.impactOnCost / 100000).toFixed(2)}L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Schedule Impact:</span>
                <span className="font-medium">{order.impactOnSchedule > 0 ? '+' : ''}{order.impactOnSchedule} days</span>
              </div>
            </div>
          </div>

          {/* Decision */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Decision *</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setDecision('Approved')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium ${
                  decision === 'Approved'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700'
                }`}
              >
                <CheckCircle className="h-5 w-5 inline mr-2" />
                Approve
              </button>
              <button
                onClick={() => setDecision('Rejected')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium ${
                  decision === 'Rejected'
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-gray-300 bg-white text-gray-700'
                }`}
              >
                <XCircle className="h-5 w-5 inline mr-2" />
                Reject
              </button>
            </div>
          </div>

          {/* Approver Details */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Approver Name *</label>
              <input
                type="text"
                value={approverName}
                onChange={(e) => setApproverName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Role *</label>
              <select
                value={approverRole}
                onChange={(e) => setApproverRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="Project Manager">Project Manager</option>
                <option value="Senior Management">Senior Management</option>
                <option value="Client Representative">Client Representative</option>
                <option value="Technical Lead">Technical Lead</option>
              </select>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {decision === 'Approved' ? 'Approval Remarks' : 'Rejection Reason'} *
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={
                decision === 'Approved'
                  ? 'Enter any remarks or conditions for approval...'
                  : 'Provide detailed reason for rejection...'
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {decision === 'Approved' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Conditions (if any)</label>
              <textarea
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                placeholder="Any conditions or requirements for implementation..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!approverName || !remarks}
            className={`px-4 py-2 text-white rounded-lg disabled:bg-gray-300 ${
              decision === 'Approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {decision === 'Approved' ? 'Approve' : 'Reject'} Change Order
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 4: IMPACT ANALYSIS MODAL (Orange Gradient)
// ============================================================

interface ImpactAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ChangeOrder | null;
}

export function ImpactAnalysisModal({ isOpen, onClose, order }: ImpactAnalysisModalProps) {
  if (!isOpen || !order) return null;

  const budgetImpactPercent = ((order.impactOnCost / order.originalBudget) * 100).toFixed(2);
  const scheduleImpactPercent = ((order.impactOnSchedule / 30) * 100).toFixed(2); // Assuming 30-day baseline

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6" />
            <h2 className="text-xl font-bold">Impact Analysis</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Change Order Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{order.title}</h3>
            <p className="text-sm text-gray-600">{order.changeOrderNumber} | {order.projectName}</p>
          </div>

          {/* Cost Impact */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-orange-600" />
              Cost Impact Analysis
            </h3>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Original Budget</p>
                  <p className="text-xl font-bold text-blue-700">₹{(order.originalBudget / 100000).toFixed(2)}L</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Cost Impact</p>
                  <p className="text-xl font-bold text-red-700">+₹{(order.impactOnCost / 100000).toFixed(2)}L</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Revised Budget</p>
                  <p className="text-xl font-bold text-purple-700">₹{(order.revisedBudget / 100000).toFixed(2)}L</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Budget Increase</span>
                  <span className="font-bold text-red-600">{budgetImpactPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-red-500 h-3 rounded-full"
                    style={{ width: `${Math.min(parseFloat(budgetImpactPercent), 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Financial Impact:</span> The proposed change will increase the project
                  budget by {budgetImpactPercent}%, requiring additional funding approval for the cost overrun.
                </p>
              </div>
            </div>
          </div>

          {/* Schedule Impact */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-orange-600" />
              Schedule Impact Analysis
            </h3>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Original End Date</p>
                  <p className="text-lg font-bold text-blue-700">{order.originalEndDate}</p>
                </div>
                <div className={`p-4 rounded-lg ${order.impactOnSchedule > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                  <p className="text-xs text-gray-600 mb-1">Schedule Impact</p>
                  <p className={`text-lg font-bold ${order.impactOnSchedule > 0 ? 'text-red-700' : 'text-green-700'}`}>
                    {order.impactOnSchedule > 0 ? '+' : ''}{order.impactOnSchedule} days
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Revised End Date</p>
                  <p className="text-lg font-bold text-purple-700">{order.revisedEndDate}</p>
                </div>
              </div>

              {order.impactOnSchedule !== 0 && (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">Schedule Change</span>
                      <span className={`font-bold ${order.impactOnSchedule > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {Math.abs(parseFloat(scheduleImpactPercent))}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={order.impactOnSchedule > 0 ? 'bg-red-500 h-3 rounded-full' : 'bg-green-500 h-3 rounded-full'}
                        style={{ width: `${Math.min(Math.abs(parseFloat(scheduleImpactPercent)), 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className={`border rounded-lg p-3 ${order.impactOnSchedule > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Timeline Impact:</span>{' '}
                      {order.impactOnSchedule > 0
                        ? `This change will delay the project completion by ${order.impactOnSchedule} days, potentially affecting downstream activities.`
                        : `This change will accelerate the project completion by ${Math.abs(order.impactOnSchedule)} days through optimized scheduling.`}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Resource Impact */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <Users className="h-5 w-5 mr-2 text-orange-600" />
              Resource & Risk Assessment
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Resource Requirements</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Additional manpower may be required</li>
                  <li>• Material procurement timeline affected</li>
                  <li>• Equipment availability to be verified</li>
                  <li>• Subcontractor coordination needed</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Associated Risks</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Budget overrun risk: Medium</li>
                  <li>• Schedule delay risk: {order.impactOnSchedule > 5 ? 'High' : 'Low'}</li>
                  <li>• Quality impact: Low</li>
                  <li>• Stakeholder approval: Required</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Recommendation</h4>
            <p className="text-sm text-gray-700">
              {parseFloat(budgetImpactPercent) < 5 && Math.abs(order.impactOnSchedule) < 7
                ? 'The change order has minimal impact on project parameters. Recommend approval with standard review.'
                : parseFloat(budgetImpactPercent) > 10 || Math.abs(order.impactOnSchedule) > 14
                ? 'The change order has significant impact on budget and schedule. Recommend detailed review with stakeholder consultation before approval.'
                : 'The change order has moderate impact. Recommend management review and client notification before proceeding.'}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 5: IMPLEMENTATION TRACKING MODAL (Indigo Gradient)
// ============================================================

interface ImplementationTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ChangeOrder | null;
  onUpdateStatus: (data: any) => void;
}

export function ImplementationTrackingModal({ isOpen, onClose, order, onUpdateStatus }: ImplementationTrackingModalProps) {
  const [implementationStatus, setImplementationStatus] = useState('Not Started');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('Planning');
  const [implementationNotes, setImplementationNotes] = useState('');
  const [estimatedCompletion, setEstimatedCompletion] = useState('');
  const [issuesEncountered, setIssuesEncountered] = useState('');

  const handleSubmit = () => {
    onUpdateStatus({
      ...order,
      status: progressPercentage === 100 ? 'Completed' : 'In Progress',
      implementationProgress: progressPercentage,
      currentPhase,
      implementationNotes,
    });
    onClose();
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6" />
            <h2 className="text-xl font-bold">Implementation Tracking</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Change Order Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-gray-900">{order.title}</h3>
            <p className="text-xs text-gray-600 mt-1">{order.changeOrderNumber} | Approved: {order.approvalDate}</p>
          </div>

          {/* Implementation Progress */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Implementation Progress</label>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercentage}
                onChange={(e) => setProgressPercentage(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between items-center">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-indigo-600 h-4 rounded-full flex items-center justify-center text-xs text-white font-semibold"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    {progressPercentage > 10 && `${progressPercentage}%`}
                  </div>
                </div>
                <span className="ml-3 text-2xl font-bold text-indigo-600 min-w-[60px]">{progressPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Implementation Status */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={implementationStatus}
                onChange={(e) => setImplementationStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Phase</label>
              <select
                value={currentPhase}
                onChange={(e) => setCurrentPhase(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Planning">Planning</option>
                <option value="Procurement">Procurement</option>
                <option value="Execution">Execution</option>
                <option value="Testing">Testing</option>
                <option value="Handover">Handover</option>
              </select>
            </div>
          </div>

          {/* Estimated Completion */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Completion Date</label>
            <input
              type="date"
              value={estimatedCompletion}
              onChange={(e) => setEstimatedCompletion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Implementation Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Implementation Notes</label>
            <textarea
              value={implementationNotes}
              onChange={(e) => setImplementationNotes(e.target.value)}
              placeholder="Provide details about current implementation activities..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Issues Encountered */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Issues/Challenges (if any)</label>
            <textarea
              value={issuesEncountered}
              onChange={(e) => setIssuesEncountered(e.target.value)}
              placeholder="Document any issues or challenges encountered during implementation..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Milestone Checklist */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Implementation Milestones</h4>
            <div className="space-y-2">
              {[
                { label: 'Approval Received', checked: order.status !== 'Pending' },
                { label: 'Resources Allocated', checked: progressPercentage >= 20 },
                { label: 'Materials Procured', checked: progressPercentage >= 40 },
                { label: 'Execution Started', checked: progressPercentage >= 60 },
                { label: 'Testing/QC Complete', checked: progressPercentage >= 80 },
                { label: 'Implementation Complete', checked: progressPercentage === 100 },
              ].map((milestone, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={milestone.checked}
                    readOnly
                    className="h-4 w-4 text-indigo-600 rounded"
                  />
                  <span className={`text-sm ${milestone.checked ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {milestone.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Update Implementation Status
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 6: CHANGE ORDER HISTORY MODAL (Teal Gradient)
// ============================================================

interface ChangeOrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ChangeOrder | null;
}

export function ChangeOrderHistoryModal({ isOpen, onClose, order }: ChangeOrderHistoryModalProps) {
  if (!isOpen || !order) return null;

  const historyEntries = [
    {
      date: order.requestDate,
      user: order.requestedBy,
      action: 'Change Order Created',
      details: `Change order ${order.changeOrderNumber} was submitted for review`,
      status: 'Created',
    },
    ...(order.approvalDate
      ? [
          {
            date: order.approvalDate,
            user: order.approvedBy,
            action: order.status === 'Approved' ? 'Change Order Approved' : 'Change Order Rejected',
            details: order.remarks,
            status: order.status,
          },
        ]
      : []),
    ...(order.implementationDate
      ? [
          {
            date: order.implementationDate,
            user: 'System',
            action: 'Implementation Started',
            details: 'Change order implementation has been initiated',
            status: 'In Progress',
          },
        ]
      : []),
    ...(order.completionDate
      ? [
          {
            date: order.completionDate,
            user: 'Project Team',
            action: 'Implementation Completed',
            details: 'All change order activities have been completed successfully',
            status: 'Completed',
          },
        ]
      : []),
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <History className="h-6 w-6" />
            <h2 className="text-xl font-bold">Change Order History</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Change Order Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h3 className="text-lg font-semibold text-gray-900">{order.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {order.changeOrderNumber} | {order.projectName}
            </p>
            <div className="flex items-center space-x-3 mt-2">
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{order.changeType}</span>
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">{order.priority} Priority</span>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">{order.status}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Activity Timeline</h3>
            <div className="relative border-l-2 border-teal-200 ml-3 pl-6 space-y-3">
              {historyEntries.map((entry, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[29px] top-1 w-4 h-4 bg-teal-600 rounded-full border-2 border-white" />
                  <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {entry.status === 'Approved' && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {entry.status === 'Rejected' && <XCircle className="h-5 w-5 text-red-600" />}
                        {entry.status === 'In Progress' && <Clock className="h-5 w-5 text-blue-600" />}
                        {entry.status === 'Completed' && <CheckCircle className="h-5 w-5 text-purple-600" />}
                        {entry.status === 'Created' && <FileEdit className="h-5 w-5 text-gray-600" />}
                        <h4 className="text-sm font-semibold text-gray-900">{entry.action}</h4>
                      </div>
                      <span className="text-xs text-gray-500">{entry.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{entry.details}</p>
                    <p className="text-xs text-gray-500">By: {entry.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document History */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Document Versions</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">Change Order Request v1.0</span>
                </div>
                <span className="text-xs text-gray-500">{order.requestDate}</span>
              </div>
              {order.approvalDate && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">Approval Document v1.0</span>
                  </div>
                  <span className="text-xs text-gray-500">{order.approvalDate}</span>
                </div>
              )}
              {order.completionDate && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">Completion Report v1.0</span>
                  </div>
                  <span className="text-xs text-gray-500">{order.completionDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Attachments */}
          {order.attachments > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Attachments ({order.attachments})</h4>
              <div className="space-y-2">
                {Array.from({ length: order.attachments }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">Attachment_{index + 1}.pdf</span>
                    </div>
                    <button className="text-teal-600 hover:text-teal-700 text-xs">Download</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 7: BULK CHANGE ORDER MODAL (Yellow Gradient)
// ============================================================

interface BulkChangeOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkAction: (action: string, orders: string[]) => void;
}

export function BulkChangeOrderModal({ isOpen, onClose, onBulkAction }: BulkChangeOrderModalProps) {
  const [action, setAction] = useState('approve');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [remarks, setRemarks] = useState('');

  const pendingOrders = [
    { id: 'CO-001', number: 'CHG-2025-001', title: 'Additional Exhaust Hood Installation', project: 'Taj Hotels' },
    { id: 'CO-002', number: 'CHG-2025-002', title: 'Upgrade Insulation Thickness', project: 'BigBasket' },
    { id: 'CO-009', number: 'CHG-2025-009', title: 'Include Pastry Section Renovation', project: 'Marriott Hotel' },
  ];

  const toggleOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleSubmit = () => {
    onBulkAction(action, selectedOrders);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <FileEdit className="h-6 w-6" />
            <h2 className="text-xl font-bold">Bulk Change Order Actions</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Action Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Action</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
            >
              <option value="approve">Approve Selected</option>
              <option value="reject">Reject Selected</option>
              <option value="review">Send for Review</option>
              <option value="export">Export Selected</option>
            </select>
          </div>

          {/* Change Orders List */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Change Orders ({selectedOrders.length} selected)
            </label>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedOrders.includes(order.id)
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => toggleOrder(order.id)}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleOrder(order.id)}
                      className="mt-1 h-4 w-4 text-yellow-600 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900">{order.number}</h4>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{order.project}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{order.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks (Optional)</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add bulk action remarks..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Action Summary */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Action Summary</h4>
            <p className="text-sm text-gray-700">
              You are about to <span className="font-semibold">{action}</span>{' '}
              <span className="font-semibold">{selectedOrders.length}</span> change order(s).
            </p>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedOrders.length === 0}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-300"
          >
            Execute Bulk Action
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 8: ATTACHMENT MANAGEMENT MODAL (Pink Gradient)
// ============================================================

interface AttachmentManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ChangeOrder | null;
  onUpload: (files: File[]) => void;
}

export function AttachmentManagementModal({ isOpen, onClose, order, onUpload }: AttachmentManagementModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = () => {
    onUpload(files);
    setFiles([]);
    onClose();
  };

  if (!isOpen || !order) return null;

  const existingAttachments = [
    { name: 'Technical_Drawing_Rev2.pdf', size: '2.4 MB', date: '2025-01-15', type: 'PDF' },
    { name: 'Cost_Breakdown.xlsx', size: '156 KB', date: '2025-01-15', type: 'Excel' },
    { name: 'Site_Photos.zip', size: '8.7 MB', date: '2025-01-16', type: 'Archive' },
    { name: 'Approval_Email.pdf', size: '89 KB', date: '2025-01-17', type: 'PDF' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-pink-700 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Upload className="h-6 w-6" />
            <h2 className="text-xl font-bold">Attachment Management</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Change Order Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Change Order:</span> {order.changeOrderNumber} | {order.title}
            </p>
          </div>

          {/* Upload Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Upload New Attachments</label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300 bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 mb-2">Drag and drop files here, or click to select</p>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 cursor-pointer"
              >
                Select Files
              </label>
              {files.length > 0 && (
                <div className="mt-4 text-left">
                  <p className="text-sm font-semibold text-gray-700 mb-2">{files.length} file(s) selected:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-white px-3 py-2 rounded border border-gray-200">
                        <span>{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Existing Attachments */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Existing Attachments ({existingAttachments.length})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {existingAttachments.map((attachment, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                      <p className="text-xs text-gray-500">
                        {attachment.size} • {attachment.type} • {attachment.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-blue-600 hover:text-blue-700">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-red-600 hover:text-red-700">
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* File Types Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-gray-700">
              <span className="font-semibold">Supported formats:</span> PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, ZIP (Max 25 MB per file)
            </p>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={files.length === 0}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-300"
          >
            Upload {files.length > 0 && `(${files.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 9: FINANCIAL IMPACT DASHBOARD MODAL (Gray Gradient)
// ============================================================

interface FinancialImpactDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: ChangeOrder[];
}

export function FinancialImpactDashboardModal({ isOpen, onClose, orders }: FinancialImpactDashboardModalProps) {
  if (!isOpen) return null;

  const totalImpact = orders.reduce((sum, order) => sum + order.impactOnCost, 0);
  const approvedImpact = orders
    .filter((o) => o.status === 'Approved' || o.status === 'In Progress' || o.status === 'Completed')
    .reduce((sum, order) => sum + order.impactOnCost, 0);
  const pendingImpact = orders
    .filter((o) => o.status === 'Pending' || o.status === 'Under Review')
    .reduce((sum, order) => sum + order.impactOnCost, 0);

  const byType = orders.reduce((acc, order) => {
    acc[order.changeType] = (acc[order.changeType] || 0) + order.impactOnCost;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-gray-700 to-gray-800 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6" />
            <h2 className="text-xl font-bold">Financial Impact Dashboard</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <p className="text-sm text-gray-600 mb-1">Total Cost Impact</p>
              <p className="text-3xl font-bold text-blue-700">₹{(totalImpact / 100000).toFixed(2)}L</p>
              <p className="text-xs text-gray-500 mt-1">{orders.length} change orders</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-5">
              <p className="text-sm text-gray-600 mb-1">Approved Impact</p>
              <p className="text-3xl font-bold text-green-700">₹{(approvedImpact / 100000).toFixed(2)}L</p>
              <p className="text-xs text-gray-500 mt-1">
                {((approvedImpact / totalImpact) * 100).toFixed(0)}% of total
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
              <p className="text-sm text-gray-600 mb-1">Pending Impact</p>
              <p className="text-3xl font-bold text-yellow-700">₹{(pendingImpact / 100000).toFixed(2)}L</p>
              <p className="text-xs text-gray-500 mt-1">
                {((pendingImpact / totalImpact) * 100).toFixed(0)}% of total
              </p>
            </div>
          </div>

          {/* By Change Type */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cost Impact by Change Type</h3>
            <div className="space-y-3">
              {Object.entries(byType).map(([type, amount]) => {
                const percentage = (amount / totalImpact) * 100;
                return (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{type}</span>
                      <span className="font-semibold text-gray-900">
                        ₹{(amount / 100000).toFixed(2)}L ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Cost Impact Orders */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Top 5 Cost Impact Change Orders</h3>
            <div className="space-y-2">
              {orders
                .sort((a, b) => b.impactOnCost - a.impactOnCost)
                .slice(0, 5)
                .map((order, index) => (
                  <div key={order.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.title}</p>
                        <p className="text-xs text-gray-500">{order.changeOrderNumber} • {order.projectName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">₹{(order.impactOnCost / 100000).toFixed(2)}L</p>
                      <p className="text-xs text-gray-500">{order.status}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Change Orders by Status</h3>
            <div className="grid grid-cols-3 gap-3">
              {['Pending', 'Under Review', 'Approved', 'Rejected', 'In Progress', 'Completed'].map((status) => {
                const count = orders.filter((o) => o.status === status).length;
                const statusImpact = orders
                  .filter((o) => o.status === status)
                  .reduce((sum, o) => sum + o.impactOnCost, 0);
                return (
                  <div key={status} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-600">{status}</p>
                    <p className="text-lg font-bold text-gray-900">{count}</p>
                    <p className="text-xs text-gray-500">₹{(statusImpact / 100000).toFixed(2)}L</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 10: SCHEDULE IMPACT ANALYSIS MODAL (Red Gradient)
// ============================================================

interface ScheduleImpactAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: ChangeOrder[];
}

export function ScheduleImpactAnalysisModal({ isOpen, onClose, orders }: ScheduleImpactAnalysisModalProps) {
  if (!isOpen) return null;

  const totalScheduleImpact = orders.reduce((sum, order) => sum + order.impactOnSchedule, 0);
  const avgScheduleImpact = (totalScheduleImpact / orders.length).toFixed(1);
  const delayedOrders = orders.filter((o) => o.impactOnSchedule > 0);
  const acceleratedOrders = orders.filter((o) => o.impactOnSchedule < 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6" />
            <h2 className="text-xl font-bold">Schedule Impact Analysis</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <p className="text-sm text-gray-600 mb-1">Total Schedule Impact</p>
              <p className="text-3xl font-bold text-blue-700">{totalScheduleImpact} days</p>
              <p className="text-xs text-gray-500 mt-1">Across {orders.length} change orders</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-5">
              <p className="text-sm text-gray-600 mb-1">Delayed Orders</p>
              <p className="text-3xl font-bold text-red-700">{delayedOrders.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                +{delayedOrders.reduce((sum, o) => sum + o.impactOnSchedule, 0)} days total
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-5">
              <p className="text-sm text-gray-600 mb-1">Accelerated Orders</p>
              <p className="text-3xl font-bold text-green-700">{acceleratedOrders.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                {acceleratedOrders.reduce((sum, o) => sum + o.impactOnSchedule, 0)} days saved
              </p>
            </div>
          </div>

          {/* Delayed Orders */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Change Orders Causing Delays</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {delayedOrders
                .sort((a, b) => b.impactOnSchedule - a.impactOnSchedule)
                .map((order) => (
                  <div key={order.id} className="flex items-center justify-between bg-red-50 rounded-lg p-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{order.title}</p>
                      <p className="text-xs text-gray-500">{order.changeOrderNumber} • {order.projectName}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-bold text-red-600">+{order.impactOnSchedule} days</p>
                      <p className="text-xs text-gray-500">{order.status}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Critical Path Impact */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Critical Path Impact Warning</h3>
            <p className="text-sm text-gray-700 mb-3">
              The cumulative schedule impact of {totalScheduleImpact} days may affect project milestones and delivery commitments.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                <span className="text-gray-700">
                  <span className="font-semibold">{delayedOrders.filter((o) => o.impactOnSchedule > 7).length}</span> change
                  orders with delays exceeding 7 days
                </span>
              </div>
              <div className="flex items-center text-sm">
                <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                <span className="text-gray-700">
                  <span className="font-semibold">{delayedOrders.filter((o) => o.impactOnSchedule > 14).length}</span> change
                  orders with delays exceeding 14 days
                </span>
              </div>
            </div>
          </div>

          {/* Mitigation Recommendations */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mitigation Recommendations</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Review resource allocation to accelerate critical path activities</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Consider parallel execution of non-dependent change orders</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Expedite material procurement for high-impact change orders</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Update project stakeholders on revised timeline commitments</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 11: EXPORT CHANGE ORDERS MODAL (Violet Gradient)
// ============================================================

interface ExportChangeOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, options: any) => void;
}

export function ExportChangeOrdersModal({ isOpen, onClose, onExport }: ExportChangeOrdersModalProps) {
  const [format, setFormat] = useState('excel');
  const [includeAttachments, setIncludeAttachments] = useState(false);
  const [dateRange, setDateRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [includeFields, setIncludeFields] = useState({
    basic: true,
    financial: true,
    schedule: true,
    approval: true,
    implementation: true,
  });

  const handleExport = () => {
    onExport(format, {
      includeAttachments,
      dateRange,
      statusFilter,
      includeFields,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-violet-700 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Download className="h-6 w-6" />
            <h2 className="text-xl font-bold">Export Change Orders</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'excel', label: 'Excel (.xlsx)', icon: '📊' },
                { value: 'pdf', label: 'PDF Report', icon: '📄' },
                { value: 'csv', label: 'CSV', icon: '📋' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormat(option.value)}
                  className={`p-4 rounded-lg border-2 text-center transition-colors ${
                    format === option.value
                      ? 'border-violet-600 bg-violet-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status Filter (Optional)</label>
            <div className="grid grid-cols-3 gap-2">
              {['Pending', 'Under Review', 'Approved', 'Rejected', 'In Progress', 'Completed'].map((status) => (
                <label key={status} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={statusFilter.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setStatusFilter([...statusFilter, status]);
                      } else {
                        setStatusFilter(statusFilter.filter((s) => s !== status));
                      }
                    }}
                    className="h-4 w-4 text-violet-600 rounded"
                  />
                  <span className="text-gray-700">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Include Fields */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Include Fields</label>
            <div className="space-y-2">
              {[
                { key: 'basic', label: 'Basic Information (Number, Title, Type, Priority)' },
                { key: 'financial', label: 'Financial Impact (Cost, Budget Changes)' },
                { key: 'schedule', label: 'Schedule Impact (Dates, Timeline Changes)' },
                { key: 'approval', label: 'Approval Details (Approver, Date, Remarks)' },
                { key: 'implementation', label: 'Implementation Status (Progress, Notes)' },
              ].map((field) => (
                <label key={field.key} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeFields[field.key as keyof typeof includeFields]}
                    onChange={(e) =>
                      setIncludeFields({
                        ...includeFields,
                        [field.key]: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-violet-600 rounded"
                  />
                  <span className="text-gray-700">{field.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={includeAttachments}
                onChange={(e) => setIncludeAttachments(e.target.checked)}
                className="h-4 w-4 text-violet-600 rounded"
              />
              <span className="text-gray-700 font-medium">Include attachments (ZIP file)</span>
            </label>
          </div>

          {/* Export Preview */}
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Export Preview</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>Format: <span className="font-medium">{format.toUpperCase()}</span></p>
              <p>Date Range: <span className="font-medium">{dateRange}</span></p>
              <p>Status Filters: <span className="font-medium">{statusFilter.length > 0 ? statusFilter.join(', ') : 'All'}</span></p>
              <p>Include Attachments: <span className="font-medium">{includeAttachments ? 'Yes' : 'No'}</span></p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL 12: STAKEHOLDER NOTIFICATION MODAL (Cyan Gradient)
// ============================================================

interface StakeholderNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ChangeOrder | null;
  onSendNotification: (data: any) => void;
}

export function StakeholderNotificationModal({ isOpen, onClose, order, onSendNotification }: StakeholderNotificationModalProps) {
  const [selectedStakeholders, setSelectedStakeholders] = useState<string[]>([]);
  const [notificationType, setNotificationType] = useState('email');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeAttachments, setIncludeAttachments] = useState(false);

  const stakeholders = [
    { id: '1', name: 'Client Representative', email: 'client@example.com', role: 'Client' },
    { id: '2', name: 'Project Manager', email: 'pm@company.com', role: 'PM' },
    { id: '3', name: 'Technical Lead', email: 'tech@company.com', role: 'Technical' },
    { id: '4', name: 'Finance Manager', email: 'finance@company.com', role: 'Finance' },
    { id: '5', name: 'Site Supervisor', email: 'site@company.com', role: 'Site' },
  ];

  const handleSend = () => {
    onSendNotification({
      stakeholders: selectedStakeholders,
      type: notificationType,
      subject,
      message,
      includeDetails,
      includeAttachments,
    });
    onClose();
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6" />
            <h2 className="text-xl font-bold">Notify Stakeholders</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Change Order Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-gray-900">{order.title}</h3>
            <p className="text-xs text-gray-600 mt-1">{order.changeOrderNumber} | Status: {order.status}</p>
          </div>

          {/* Notification Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notification Method</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'email', label: 'Email' },
                { value: 'sms', label: 'SMS' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setNotificationType(option.value)}
                  className={`p-3 rounded-lg border-2 font-medium ${
                    notificationType === option.value
                      ? 'border-cyan-600 bg-cyan-50 text-cyan-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Select Stakeholders */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Recipients ({selectedStakeholders.length} selected)
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {stakeholders.map((stakeholder) => (
                <label
                  key={stakeholder.id}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer ${
                    selectedStakeholders.includes(stakeholder.id)
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedStakeholders.includes(stakeholder.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStakeholders([...selectedStakeholders, stakeholder.id]);
                        } else {
                          setSelectedStakeholders(selectedStakeholders.filter((id) => id !== stakeholder.id));
                        }
                      }}
                      className="h-4 w-4 text-cyan-600 rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{stakeholder.name}</p>
                      <p className="text-xs text-gray-500">{stakeholder.email} • {stakeholder.role}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={`Change Order Update: ${order.changeOrderNumber}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter notification message..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={includeDetails}
                onChange={(e) => setIncludeDetails(e.target.checked)}
                className="h-4 w-4 text-cyan-600 rounded"
              />
              <span className="text-gray-700">Include change order details</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={includeAttachments}
                onChange={(e) => setIncludeAttachments(e.target.checked)}
                className="h-4 w-4 text-cyan-600 rounded"
              />
              <span className="text-gray-700">Include attachments ({order.attachments} files)</span>
            </label>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Notification Preview</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p><span className="font-medium">To:</span> {selectedStakeholders.length} recipient(s)</p>
              <p><span className="font-medium">Method:</span> {notificationType.toUpperCase()}</p>
              <p><span className="font-medium">Subject:</span> {subject || '(Not set)'}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={selectedStakeholders.length === 0 || !subject || !message}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-300"
          >
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
}
