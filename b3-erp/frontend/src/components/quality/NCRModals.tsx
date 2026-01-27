'use client';

import React, { useState } from 'react';
import {
  X,
  Save,
  Upload,
  AlertTriangle,
  Calendar,
  User,
  Package,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  Edit3,
  XCircle,
  TrendingUp,
  Shield,
  Target,
  AlertCircle
} from 'lucide-react';

// Types
export interface NCR {
  id: string;
  ncrNumber: string;
  title: string;
  productCode: string;
  productName: string;
  workOrder: string;
  lotNumber: string;
  quantityAffected: number;
  detectedBy: string;
  detectionDate: string;
  detectionStage: string;
  severity: 'Critical' | 'Major' | 'Minor';
  nonconformanceType: string;
  description: string;
  assignedTo: string;
  targetCloseDate: string;
  customerImpact: boolean;
  costImpact: number;
  status: 'Open' | 'In Progress' | 'Pending Approval' | 'Closed' | 'Rejected';
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  actualCloseDate?: string;
  approvedBy?: string;
  verifiedBy?: string;
  createdDate: string;
  lastModified: string;
}

// Raise NCR Modal
interface RaiseNCRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<NCR>) => void;
}

export const RaiseNCRModal: React.FC<RaiseNCRModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    productCode: '',
    productName: '',
    workOrder: '',
    lotNumber: '',
    quantityAffected: 0,
    detectedBy: 'Current User',
    detectionDate: new Date().toISOString().split('T')[0],
    detectionStage: 'Incoming Inspection',
    severity: 'Major' as 'Critical' | 'Major' | 'Minor',
    nonconformanceType: 'dimensional',
    description: '',
    assignedTo: '',
    targetCloseDate: '',
    customerImpact: false,
    costImpact: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.productCode.trim()) {
      newErrors.productCode = 'Product code is required';
    }

    if (!formData.assignedTo.trim()) {
      newErrors.assignedTo = 'Assignment is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const ncrData: Partial<NCR> = {
      ncrNumber: `NCR-${Date.now()}`,
      ...formData,
      status: 'Open',
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    onSave(ncrData);
    onClose();

    // Reset form
    setFormData({
      title: '',
      productCode: '',
      productName: '',
      workOrder: '',
      lotNumber: '',
      quantityAffected: 0,
      detectedBy: 'Current User',
      detectionDate: new Date().toISOString().split('T')[0],
      detectionStage: 'Incoming Inspection',
      severity: 'Major',
      nonconformanceType: 'dimensional',
      description: '',
      assignedTo: '',
      targetCloseDate: '',
      customerImpact: false,
      costImpact: 0,
    });
    setErrors({});
  };

  if (!isOpen) return null;

  const detectionStages = [
    'Incoming Inspection',
    'In-Process Inspection',
    'Final Inspection',
    'Customer Site',
    'Pre-Delivery Audit',
    'Production Floor',
    'Assembly',
    'Testing',
    'Packaging'
  ];

  const nonconformanceTypes = [
    { value: 'dimensional', label: 'Dimensional' },
    { value: 'material', label: 'Material' },
    { value: 'visual', label: 'Visual/Cosmetic' },
    { value: 'functional', label: 'Functional' },
    { value: 'safety', label: 'Safety' },
    { value: 'packaging', label: 'Packaging' }
  ];

  const productCodes = ['PROD-001', 'PROD-002', 'PROD-003', 'PROD-004', 'PROD-005'];
  const productNames = ['Premium Kitchen Cabinet', 'Modular Wardrobe', 'Office Desk', 'Storage Unit', 'Display Rack'];
  const users = ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Robert Brown'];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Major':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Minor':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Raise Non-Conformance Report</h2>
              <p className="text-sm opacity-90">Document quality issues for investigation and resolution</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Auto-generated NCR Number */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Auto-Generated NCR Number</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">NCR-{Date.now()}</p>
              </div>
              <FileText className="h-12 w-12 text-blue-400" />
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NCR Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Brief title describing the non-conformance"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Code <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.productCode}
                  onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.productCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Product Code</option>
                  {productCodes.map((code) => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
                {errors.productCode && <p className="text-red-500 text-xs mt-1">{errors.productCode}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <select
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select Product Name</option>
                  {productNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Order</label>
                <input
                  type="text"
                  value={formData.workOrder}
                  onChange={(e) => setFormData({ ...formData, workOrder: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="WO-12345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lot Number</label>
                <input
                  type="text"
                  value={formData.lotNumber}
                  onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="LOT-2024-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Affected</label>
                <input
                  type="number"
                  value={formData.quantityAffected}
                  onChange={(e) => setFormData({ ...formData, quantityAffected: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Detection Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Detection Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detected By</label>
                <select
                  value={formData.detectedBy}
                  onChange={(e) => setFormData({ ...formData, detectedBy: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Current User">Current User</option>
                  {users.map((user) => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detection Date</label>
                <input
                  type="date"
                  value={formData.detectionDate}
                  onChange={(e) => setFormData({ ...formData, detectionDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detection Stage</label>
                <select
                  value={formData.detectionStage}
                  onChange={(e) => setFormData({ ...formData, detectionStage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {detectionStages.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  {(['Critical', 'Major', 'Minor'] as const).map((severity) => (
                    <button
                      key={severity}
                      type="button"
                      onClick={() => setFormData({ ...formData, severity })}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all font-semibold ${
                        formData.severity === severity
                          ? getSeverityColor(severity)
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {severity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nonconformance Type</label>
                <select
                  value={formData.nonconformanceType}
                  onChange={(e) => setFormData({ ...formData, nonconformanceType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {nonconformanceTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Nonconformance Description</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs ml-2">(minimum 20 characters)</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={4}
                placeholder="Provide a detailed description of the non-conformance, including what was expected vs. what was observed..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                <p className={`text-xs ml-auto ${formData.description.length < 20 ? 'text-red-500' : 'text-gray-500'}`}>
                  {formData.description.length} / 20 minimum characters
                </p>
              </div>
            </div>
          </div>

          {/* Assignment & Timeline */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Assignment & Timeline</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign To <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.assignedTo ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
                {errors.assignedTo && <p className="text-red-500 text-xs mt-1">{errors.assignedTo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Close Date</label>
                <input
                  type="date"
                  value={formData.targetCloseDate}
                  onChange={(e) => setFormData({ ...formData, targetCloseDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          {/* Impact Assessment */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Impact Assessment</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="customerImpact"
                  checked={formData.customerImpact}
                  onChange={(e) => setFormData({ ...formData, customerImpact: e.target.checked })}
                  className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="customerImpact" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Customer Impact - This nonconformance affects or may affect the customer
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Cost Impact ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.costImpact}
                    onChange={(e) => setFormData({ ...formData, costImpact: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Attachments</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors cursor-pointer">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">Images, documents, or other evidence (Max 10MB)</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Raise NCR</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View NCR Details Modal
interface ViewNCRDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ncr: NCR | null;
  onEdit: (ncr: NCR) => void;
  onCloseNCR?: (ncrId: string) => void;
}

export const ViewNCRDetailsModal: React.FC<ViewNCRDetailsModalProps> = ({
  isOpen,
  onClose: handleClose,
  ncr,
  onEdit,
  onCloseNCR: handleCloseNCR
}) => {
  if (!isOpen || !ncr) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending Approval':
        return 'bg-purple-100 text-purple-800';
      case 'Closed':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'Major':
        return 'bg-orange-100 text-orange-800';
      case 'Minor':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold">{ncr.ncrNumber}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(ncr.status)}`}>
                {ncr.status}
              </span>
            </div>
            <p className="text-sm opacity-90 mt-1">{ncr.title}</p>
          </div>
          <button onClick={handleClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product & WO Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Product & Work Order Information</span>
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Product Code</p>
                <p className="font-semibold text-gray-900">{ncr.productCode}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Product Name</p>
                <p className="font-semibold text-gray-900">{ncr.productName || 'N/A'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Work Order</p>
                <p className="font-semibold text-gray-900">{ncr.workOrder || 'N/A'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Lot Number</p>
                <p className="font-semibold text-gray-900">{ncr.lotNumber || 'N/A'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Quantity Affected</p>
                <p className="font-semibold text-gray-900">{ncr.quantityAffected}</p>
              </div>
            </div>
          </div>

          {/* Detection Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>Detection Details</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 mb-1">Detected By</p>
                <p className="font-semibold text-blue-900">{ncr.detectedBy}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 mb-1">Detection Date</p>
                <p className="font-semibold text-blue-900">{ncr.detectionDate}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 mb-1">Detection Stage</p>
                <p className="font-semibold text-blue-900">{ncr.detectionStage}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 mb-1">Severity</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(ncr.severity)}`}>
                  {ncr.severity}
                </span>
              </div>
              <div className="col-span-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 mb-1">Nonconformance Type</p>
                <p className="font-semibold text-blue-900 capitalize">{ncr.nonconformanceType}</p>
              </div>
            </div>
          </div>

          {/* Nonconformance Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Nonconformance Description</span>
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700">{ncr.description}</p>
            </div>
          </div>

          {/* Root Cause Analysis */}
          {ncr.rootCause && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Root Cause Analysis</span>
              </h3>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-gray-700">{ncr.rootCause}</p>
              </div>
            </div>
          )}

          {/* Corrective Action Plan */}
          {ncr.correctiveAction && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Corrective Action Plan</span>
              </h3>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-700">{ncr.correctiveAction}</p>
              </div>
            </div>
          )}

          {/* Preventive Action Plan */}
          {ncr.preventiveAction && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Preventive Action Plan</span>
              </h3>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-700">{ncr.preventiveAction}</p>
              </div>
            </div>
          )}

          {/* Assignment and Dates */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Assignment & Timeline</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Assigned To</p>
                <p className="font-semibold text-gray-900">{ncr.assignedTo}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Target Close Date</p>
                <p className="font-semibold text-gray-900">{ncr.targetCloseDate || 'Not set'}</p>
              </div>
              {ncr.actualCloseDate && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-600 mb-1">Actual Close Date</p>
                  <p className="font-semibold text-green-900">{ncr.actualCloseDate}</p>
                </div>
              )}
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Created Date</p>
                <p className="font-semibold text-gray-900">{ncr.createdDate}</p>
              </div>
            </div>
          </div>

          {/* Cost & Customer Impact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Impact Assessment</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-600 mb-1">Cost Impact</p>
                <p className="text-xl font-bold text-yellow-900">${ncr.costImpact.toFixed(2)}</p>
              </div>
              <div className={`p-3 rounded-lg border ${
                ncr.customerImpact
                  ? 'bg-red-50 border-red-200'
                  : 'bg-green-50 border-green-200'
              }`}>
                <p className={`text-xs mb-1 ${ncr.customerImpact ? 'text-red-600' : 'text-green-600'}`}>
                  Customer Impact
                </p>
                <p className={`text-xl font-bold ${ncr.customerImpact ? 'text-red-900' : 'text-green-900'}`}>
                  {ncr.customerImpact ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>

          {/* Approval/Verification Status */}
          {(ncr.approvedBy || ncr.verifiedBy) && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Approval & Verification</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {ncr.approvedBy && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-green-600 mb-1">Approved By</p>
                    <p className="font-semibold text-green-900">{ncr.approvedBy}</p>
                  </div>
                )}
                {ncr.verifiedBy && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-green-600 mb-1">Verified By</p>
                    <p className="font-semibold text-green-900">{ncr.verifiedBy}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {ncr.status !== 'Closed' && (
              <>
                <button
                  onClick={() => {
                    onEdit(ncr);
                    handleClose();
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleCloseNCR?.(ncr.id)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Close NCR</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit NCR Modal
interface EditNCRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NCR) => void;
  ncr: NCR | null;
}

export const EditNCRModal: React.FC<EditNCRModalProps> = ({ isOpen, onClose, onSave, ncr }) => {
  const [formData, setFormData] = useState<Partial<NCR>>({});

  React.useEffect(() => {
    if (ncr) {
      setFormData(ncr);
    }
  }, [ncr]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedNCR: NCR = {
      ...(ncr as NCR),
      ...formData,
      lastModified: new Date().toISOString(),
    };

    onSave(updatedNCR);
    onClose();
  };

  if (!isOpen || !ncr) return null;

  const detectionStages = [
    'Incoming Inspection',
    'In-Process Inspection',
    'Final Inspection',
    'Customer Site',
    'Pre-Delivery Audit',
    'Production Floor',
    'Assembly',
    'Testing',
    'Packaging'
  ];

  const nonconformanceTypes = [
    { value: 'dimensional', label: 'Dimensional' },
    { value: 'material', label: 'Material' },
    { value: 'visual', label: 'Visual/Cosmetic' },
    { value: 'functional', label: 'Functional' },
    { value: 'safety', label: 'Safety' },
    { value: 'packaging', label: 'Packaging' }
  ];

  const statusOptions = ['Open', 'In Progress', 'Pending Approval', 'Closed', 'Rejected'];
  const productCodes = ['PROD-001', 'PROD-002', 'PROD-003', 'PROD-004', 'PROD-005'];
  const productNames = ['Premium Kitchen Cabinet', 'Modular Wardrobe', 'Office Desk', 'Storage Unit', 'Display Rack'];
  const users = ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Robert Brown'];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Major':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Minor':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Edit3 className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Edit Non-Conformance Report</h2>
              <p className="text-sm opacity-90">{ncr.ncrNumber} - Update NCR details and resolution</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NCR Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Brief title describing the non-conformance"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Code</label>
                <select
                  value={formData.productCode || ''}
                  onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {productCodes.map((code) => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <select
                  value={formData.productName || ''}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {productNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Order</label>
                <input
                  type="text"
                  value={formData.workOrder || ''}
                  onChange={(e) => setFormData({ ...formData, workOrder: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lot Number</label>
                <input
                  type="text"
                  value={formData.lotNumber || ''}
                  onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status || ''}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Affected</label>
                <input
                  type="number"
                  value={formData.quantityAffected || 0}
                  onChange={(e) => setFormData({ ...formData, quantityAffected: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Detection Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Detection Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detection Stage</label>
                <select
                  value={formData.detectionStage || ''}
                  onChange={(e) => setFormData({ ...formData, detectionStage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {detectionStages.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <div className="flex space-x-2">
                  {(['Critical', 'Major', 'Minor'] as const).map((severity) => (
                    <button
                      key={severity}
                      type="button"
                      onClick={() => setFormData({ ...formData, severity })}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all font-semibold ${
                        formData.severity === severity
                          ? getSeverityColor(severity)
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {severity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nonconformance Type</label>
                <select
                  value={formData.nonconformanceType || ''}
                  onChange={(e) => setFormData({ ...formData, nonconformanceType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {nonconformanceTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Nonconformance Description</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={4}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Root Cause */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Root Cause Analysis</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Root Cause</label>
              <textarea
                value={formData.rootCause || ''}
                onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Identify the root cause of this nonconformance..."
              />
            </div>
          </div>

          {/* Corrective Action */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Corrective Action Plan</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Corrective Action</label>
              <textarea
                value={formData.correctiveAction || ''}
                onChange={(e) => setFormData({ ...formData, correctiveAction: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Define the corrective actions to be taken..."
              />
            </div>
          </div>

          {/* Preventive Action */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Preventive Action Plan</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preventive Action</label>
              <textarea
                value={formData.preventiveAction || ''}
                onChange={(e) => setFormData({ ...formData, preventiveAction: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Define preventive actions to avoid future occurrences..."
              />
            </div>
          </div>

          {/* Assignment & Dates */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Assignment & Timeline</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                <select
                  value={formData.assignedTo || ''}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {users.map((user) => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Close Date</label>
                <input
                  type="date"
                  value={formData.targetCloseDate || ''}
                  onChange={(e) => setFormData({ ...formData, targetCloseDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {formData.status === 'Closed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Actual Close Date</label>
                  <input
                    type="date"
                    value={formData.actualCloseDate || ''}
                    onChange={(e) => setFormData({ ...formData, actualCloseDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Approval & Verification */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Approval & Verification</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Approved By</label>
                <select
                  value={formData.approvedBy || ''}
                  onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Approver</option>
                  {users.map((user) => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verified By</label>
                <select
                  value={formData.verifiedBy || ''}
                  onChange={(e) => setFormData({ ...formData, verifiedBy: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Verifier</option>
                  {users.map((user) => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Impact Assessment */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Impact Assessment</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="customerImpact"
                  checked={formData.customerImpact || false}
                  onChange={(e) => setFormData({ ...formData, customerImpact: e.target.checked })}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="customerImpact" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Customer Impact
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost Impact ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.costImpact || 0}
                    onChange={(e) => setFormData({ ...formData, costImpact: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Update NCR</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
