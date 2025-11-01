'use client';

import { useState } from 'react';
import { X, Users, Calendar, Clock, Target, TrendingUp, AlertCircle, UserPlus, UserMinus, Award, BarChart3, Zap } from 'lucide-react';

// Modal 1: Allocate Resource Modal (Blue Gradient)
interface AllocateResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllocate: (data: any) => void;
  resource?: any;
}

export function AllocateResourceModal({ isOpen, onClose, onAllocate, resource }: AllocateResourceModalProps) {
  const [formData, setFormData] = useState({
    resourceId: resource?.id || '',
    resourceName: resource?.name || '',
    projectId: '',
    role: '',
    startDate: '',
    endDate: '',
    allocation: '100',
    billable: true,
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onAllocate(formData);
  };

  const isValid = formData.projectId && formData.role && formData.startDate && formData.endDate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Allocate Resource</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {resource && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900">Selected Resource</p>
              <p className="text-lg font-semibold text-blue-700">{resource.name}</p>
              <p className="text-sm text-blue-600">{resource.role} - {resource.dept}</p>
            </div>
          )}

          {!resource && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resource</label>
              <select
                value={formData.resourceId}
                onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Resource</option>
                <option value="E-307">Rahul Kumar - Engineer</option>
                <option value="E-101">Amit Singh - Project Manager</option>
                <option value="E-512">Vikram Reddy - Developer</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Project</option>
              <option value="PRJ-001">Taj Hotels - Commercial Kitchen</option>
              <option value="PRJ-002">L&T Campus - Industrial Kitchen</option>
              <option value="PRJ-003">Siemens - Switchgear Unit</option>
              <option value="PRJ-004">ITC Grand - Bakery Setup</option>
              <option value="PRJ-005">BigBasket - Cold Room</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role in Project *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Role</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Lead Engineer">Lead Engineer</option>
              <option value="Engineer">Engineer</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="QA Engineer">QA Engineer</option>
              <option value="Consultant">Consultant</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allocation %</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.allocation}
              onChange={(e) => setFormData({ ...formData, allocation: e.target.value })}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>0%</span>
              <span className="font-semibold text-blue-600">{formData.allocation}%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="billable"
              checked={formData.billable}
              onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="billable" className="text-sm font-medium text-gray-700">Billable</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any additional notes..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Allocate Resource
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal 2: Bulk Allocation Modal (Green Gradient)
interface BulkAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllocate: (data: any) => void;
}

export function BulkAllocationModal({ isOpen, onClose, onAllocate }: BulkAllocationModalProps) {
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [projectId, setProjectId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allocation, setAllocation] = useState('100');

  if (!isOpen) return null;

  const resources = [
    { id: 'E-307', name: 'Rahul Kumar', role: 'Engineer', available: true },
    { id: 'E-101', name: 'Amit Singh', role: 'Project Manager', available: true },
    { id: 'E-512', name: 'Vikram Reddy', role: 'Developer', available: true },
    { id: 'E-205', name: 'Priya Sharma', role: 'Designer', available: true },
    { id: 'E-408', name: 'Karthik Iyer', role: 'QA Engineer', available: false },
  ];

  const toggleResource = (id: string) => {
    setSelectedResources(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    onAllocate({ selectedResources, projectId, startDate, endDate, allocation });
  };

  const isValid = selectedResources.length > 0 && projectId && startDate && endDate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Bulk Allocation</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Resources *</label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
              {resources.map(resource => (
                <div
                  key={resource.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    selectedResources.includes(resource.id)
                      ? 'bg-green-50 border-green-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  } ${!resource.available ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedResources.includes(resource.id)}
                      onChange={() => toggleResource(resource.id)}
                      disabled={!resource.available}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{resource.name}</p>
                      <p className="text-sm text-gray-600">{resource.role} - {resource.id}</p>
                    </div>
                  </div>
                  {!resource.available && (
                    <span className="text-xs font-medium text-red-600">Unavailable</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">{selectedResources.length} resource(s) selected</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select Project</option>
              <option value="PRJ-001">Taj Hotels - Commercial Kitchen</option>
              <option value="PRJ-002">L&T Campus - Industrial Kitchen</option>
              <option value="PRJ-003">Siemens - Switchgear Unit</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Allocation %</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={allocation}
              onChange={(e) => setAllocation(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>0%</span>
              <span className="font-semibold text-green-600">{allocation}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Allocate {selectedResources.length} Resource(s)
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal 3: Resource Details Modal (Purple Gradient)
interface ResourceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: any;
}

export function ResourceDetailsModal({ isOpen, onClose, resource }: ResourceDetailsModalProps) {
  if (!isOpen || !resource) return null;

  const allocations = [
    { project: 'Taj Hotels - Commercial Kitchen', role: 'Lead Engineer', allocation: 60, startDate: '2025-01-01', endDate: '2025-03-31' },
    { project: 'ITC Grand - Bakery Setup', role: 'Consultant', allocation: 30, startDate: '2025-01-15', endDate: '2025-02-15' },
  ];

  const skills = ['Project Management', 'AutoCAD', 'Team Leadership', 'Quality Control', 'Electrical Systems'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Resource Details</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Profile Section */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-purple-900">{resource.name}</h3>
                <p className="text-purple-700 font-medium mt-1">{resource.role}</p>
                <p className="text-purple-600 text-sm">{resource.dept} Department</p>
                <p className="text-purple-600 text-sm mt-2">Employee ID: {resource.id}</p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center px-3 py-1 bg-purple-100 rounded-full">
                  <span className="text-sm font-semibold text-purple-900">Utilization: {resource.utilization}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Total Allocation</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">90%</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Active Projects</p>
              <p className="text-2xl font-bold text-green-900 mt-1">2</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-orange-600 font-medium">Billable Hours</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">156</p>
            </div>
          </div>

          {/* Current Allocations */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Current Allocations</h4>
            <div className="space-y-3">
              {allocations.map((alloc, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{alloc.project}</p>
                      <p className="text-sm text-gray-600 mt-1">Role: {alloc.role}</p>
                      <p className="text-sm text-gray-600">Duration: {alloc.startDate} to {alloc.endDate}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {alloc.allocation}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Skills & Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal 4: Edit Allocation Modal (Orange Gradient)
interface EditAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  allocation: any;
}

export function EditAllocationModal({ isOpen, onClose, onUpdate, allocation }: EditAllocationModalProps) {
  const [formData, setFormData] = useState({
    role: allocation?.role || '',
    startDate: allocation?.startDate || '',
    endDate: allocation?.endDate || '',
    allocation: allocation?.allocation || '100',
    billable: allocation?.billable !== false,
    notes: allocation?.notes || '',
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onUpdate(formData);
  };

  const isValid = formData.role && formData.startDate && formData.endDate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Edit Allocation</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {allocation && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm font-medium text-orange-900">Allocation Details</p>
              <p className="text-lg font-semibold text-orange-700">{allocation.resourceName} → {allocation.project}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Select Role</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Lead Engineer">Lead Engineer</option>
              <option value="Engineer">Engineer</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="QA Engineer">QA Engineer</option>
              <option value="Consultant">Consultant</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allocation %</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.allocation}
              onChange={(e) => setFormData({ ...formData, allocation: e.target.value })}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>0%</span>
              <span className="font-semibold text-orange-600">{formData.allocation}%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="edit-billable"
              checked={formData.billable}
              onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="edit-billable" className="text-sm font-medium text-gray-700">Billable</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Any additional notes..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Update Allocation
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal 5: Transfer Resource Modal (Indigo Gradient)
interface TransferResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (data: any) => void;
  resource: any;
}

export function TransferResourceModal({ isOpen, onClose, onTransfer, resource }: TransferResourceModalProps) {
  const [fromProject, setFromProject] = useState('');
  const [toProject, setToProject] = useState('');
  const [transferDate, setTransferDate] = useState('');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onTransfer({ fromProject, toProject, transferDate, reason });
  };

  const isValid = fromProject && toProject && transferDate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Transfer Resource</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {resource && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <p className="text-sm font-medium text-indigo-900">Resource to Transfer</p>
              <p className="text-lg font-semibold text-indigo-700">{resource.name}</p>
              <p className="text-sm text-indigo-600">{resource.role} - {resource.dept}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Project *</label>
            <select
              value={fromProject}
              onChange={(e) => setFromProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select Current Project</option>
              <option value="PRJ-001">Taj Hotels - Commercial Kitchen</option>
              <option value="PRJ-002">L&T Campus - Industrial Kitchen</option>
              <option value="PRJ-003">Siemens - Switchgear Unit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Project *</label>
            <select
              value={toProject}
              onChange={(e) => setToProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select New Project</option>
              <option value="PRJ-004">ITC Grand - Bakery Setup</option>
              <option value="PRJ-005">BigBasket - Cold Room</option>
              <option value="PRJ-006">Marriott - Kitchen Renovation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Date *</label>
            <input
              type="date"
              value={transferDate}
              onChange={(e) => setTransferDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Transfer</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Explain the reason for this transfer..."
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Transfer Impact</p>
                <p className="text-sm text-yellow-700 mt-1">
                  This resource will be removed from the current project and allocated to the new project on the specified date.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Transfer Resource
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal 6: Resource Availability Modal (Teal Gradient)
interface ResourceAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: string;
  endDate: string;
}

export function ResourceAvailabilityModal({ isOpen, onClose, startDate, endDate }: ResourceAvailabilityModalProps) {
  if (!isOpen) return null;

  const availableResources = [
    { id: 'E-205', name: 'Priya Sharma', role: 'Designer', dept: 'Design', availability: 100 },
    { id: 'E-408', name: 'Karthik Iyer', role: 'QA Engineer', dept: 'Quality', availability: 80 },
    { id: 'E-610', name: 'Deepak Verma', role: 'Engineer', dept: 'Engineering', availability: 50 },
    { id: 'E-712', name: 'Sneha Patel', role: 'Developer', dept: 'IT', availability: 100 },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Resource Availability</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <p className="text-sm font-medium text-teal-900">Date Range</p>
            <p className="text-lg font-semibold text-teal-700">{startDate} to {endDate}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Available Resources ({availableResources.length})</h4>
            <div className="space-y-3">
              {availableResources.map(resource => (
                <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{resource.name}</p>
                      <p className="text-sm text-gray-600">{resource.role} - {resource.dept} Department</p>
                      <p className="text-sm text-gray-500">ID: {resource.id}</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-semibold">
                        {resource.availability}% Available
                      </div>
                      <div className="mt-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-500"
                            style={{ width: `${resource.availability}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal 7: Workload Balancing Modal (Yellow Gradient)
interface WorkloadBalancingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBalance: (data: any) => void;
}

export function WorkloadBalancingModal({ isOpen, onClose, onBalance }: WorkloadBalancingModalProps) {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  if (!isOpen) return null;

  const workloadData = [
    { id: 'E-307', name: 'Rahul Kumar', utilization: 92, recommendation: 'Reduce by 12%', color: 'red' },
    { id: 'E-101', name: 'Amit Singh', utilization: 88, recommendation: 'Reduce by 8%', color: 'yellow' },
    { id: 'E-205', name: 'Priya Sharma', utilization: 35, recommendation: 'Can take +45%', color: 'green' },
    { id: 'E-408', name: 'Karthik Iyer', utilization: 42, recommendation: 'Can take +38%', color: 'green' },
  ];

  const handleAutoBalance = () => {
    onBalance({ department: selectedDepartment, method: 'auto' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Workload Balancing</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Workload Analysis</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Optimize resource utilization by redistributing work from over-utilized to under-utilized team members.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department Filter</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              <option value="engineering">Engineering</option>
              <option value="projects">Projects</option>
              <option value="it">IT</option>
              <option value="design">Design</option>
            </select>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600 font-medium">Over-utilized</p>
              <p className="text-2xl font-bold text-red-900 mt-1">2</p>
              <p className="text-xs text-red-600 mt-1">Above 85%</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Optimal</p>
              <p className="text-2xl font-bold text-green-900 mt-1">8</p>
              <p className="text-xs text-green-600 mt-1">60-85%</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Under-utilized</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">2</p>
              <p className="text-xs text-blue-600 mt-1">Below 60%</p>
            </div>
          </div>

          {/* Workload Table */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Team Workload</h4>
            <div className="space-y-3">
              {workloadData.map(resource => (
                <div key={resource.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{resource.name}</p>
                      <p className="text-sm text-gray-600">ID: {resource.id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      resource.color === 'red' ? 'bg-red-100 text-red-800' :
                      resource.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {resource.utilization}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full ${
                        resource.utilization > 85 ? 'bg-red-500' :
                        resource.utilization > 60 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${resource.utilization}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">{resource.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAutoBalance}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Auto-Balance Workload
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal 8: Request Resource Modal (Pink Gradient)
interface RequestResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequest: (data: any) => void;
}

export function RequestResourceModal({ isOpen, onClose, onRequest }: RequestResourceModalProps) {
  const [formData, setFormData] = useState({
    projectId: '',
    resourceType: '',
    skillsRequired: '',
    quantity: '1',
    startDate: '',
    endDate: '',
    allocation: '100',
    priority: 'medium',
    justification: '',
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onRequest(formData);
  };

  const isValid = formData.projectId && formData.resourceType && formData.startDate && formData.endDate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Request Resource</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Select Project</option>
              <option value="PRJ-001">Taj Hotels - Commercial Kitchen</option>
              <option value="PRJ-002">L&T Campus - Industrial Kitchen</option>
              <option value="PRJ-003">Siemens - Switchgear Unit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type *</label>
            <select
              value={formData.resourceType}
              onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Select Resource Type</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Engineer">Engineer</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="QA Engineer">QA Engineer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills Required</label>
            <input
              type="text"
              value={formData.skillsRequired}
              onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g., AutoCAD, Project Management, Python"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Allocation %</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.allocation}
              onChange={(e) => setFormData({ ...formData, allocation: e.target.value })}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>0%</span>
              <span className="font-semibold text-pink-600">{formData.allocation}%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Justification</label>
            <textarea
              value={formData.justification}
              onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Explain why this resource is needed..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal 9: Release Resource Modal (Cyan Gradient)
interface ReleaseResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRelease: (data: any) => void;
  resource: any;
}

export function ReleaseResourceModal({ isOpen, onClose, onRelease, resource }: ReleaseResourceModalProps) {
  const [formData, setFormData] = useState({
    projectId: '',
    releaseDate: '',
    reason: '',
    handoverNotes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onRelease(formData);
  };

  const isValid = formData.projectId && formData.releaseDate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <UserMinus className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Release Resource</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {resource && (
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <p className="text-sm font-medium text-cyan-900">Resource to Release</p>
              <p className="text-lg font-semibold text-cyan-700">{resource.name}</p>
              <p className="text-sm text-cyan-600">{resource.role} - {resource.dept}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="">Select Project</option>
              <option value="PRJ-001">Taj Hotels - Commercial Kitchen</option>
              <option value="PRJ-002">L&T Campus - Industrial Kitchen</option>
              <option value="PRJ-003">Siemens - Switchgear Unit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Release Date *</label>
            <input
              type="date"
              value={formData.releaseDate}
              onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Release</label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="">Select Reason</option>
              <option value="project-complete">Project Completed</option>
              <option value="early-completion">Early Completion</option>
              <option value="scope-change">Scope Change</option>
              <option value="resource-reallocation">Resource Reallocation</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Handover Notes</label>
            <textarea
              value={formData.handoverNotes}
              onChange={(e) => setFormData({ ...formData, handoverNotes: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Any important information for the handover..."
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Release Impact</p>
                <p className="text-sm text-blue-700 mt-1">
                  The resource will be removed from this project and will become available for other allocations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Release Resource
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal 10: Resource Skills Modal (Red Gradient)
interface ResourceSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  resource: any;
}

export function ResourceSkillsModal({ isOpen, onClose, onSave, resource }: ResourceSkillsModalProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  if (!isOpen) return null;

  const availableSkills = [
    'Project Management', 'AutoCAD', 'Team Leadership', 'Quality Control',
    'Electrical Systems', 'Python', 'React', 'Node.js', 'SQL',
    'Mechanical Design', 'HVAC', 'Plumbing', 'Welding', 'Fabrication'
  ];

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleAddSkill = () => {
    if (newSkill && !selectedSkills.includes(newSkill)) {
      setSelectedSkills([...selectedSkills, newSkill]);
      setNewSkill('');
    }
  };

  const handleSubmit = () => {
    onSave({ skills: selectedSkills });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Award className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Manage Skills</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {resource && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-900">Resource</p>
              <p className="text-lg font-semibold text-red-700">{resource.name}</p>
              <p className="text-sm text-red-600">{resource.role} - {resource.dept}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Custom Skill</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter skill name..."
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Skills</label>
            <div className="flex flex-wrap gap-2">
              {availableSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedSkills.includes(skill)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selected Skills ({selectedSkills.length})
            </label>
            <div className="border border-gray-300 rounded-lg p-4 min-h-[100px]">
              {selectedSkills.length === 0 ? (
                <p className="text-gray-500 text-center">No skills selected</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map(skill => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                      <button
                        onClick={() => toggleSkill(skill)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Save Skills
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal 11: Time Tracking Modal (Violet Gradient)
interface TimeTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  resource: any;
}

export function TimeTrackingModal({ isOpen, onClose, onSubmit, resource }: TimeTrackingModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    project: '',
    hours: '',
    activity: '',
    description: '',
    billable: true,
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const isValid = formData.date && formData.project && formData.hours && formData.activity;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Log Time</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {resource && (
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
              <p className="text-sm font-medium text-violet-900">Resource</p>
              <p className="text-lg font-semibold text-violet-700">{resource.name}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
            <select
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="">Select Project</option>
              <option value="PRJ-001">Taj Hotels - Commercial Kitchen</option>
              <option value="PRJ-002">L&T Campus - Industrial Kitchen</option>
              <option value="PRJ-003">Siemens - Switchgear Unit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hours *</label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="e.g., 8"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Activity *</label>
            <select
              value={formData.activity}
              onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="">Select Activity</option>
              <option value="design">Design</option>
              <option value="development">Development</option>
              <option value="testing">Testing</option>
              <option value="meeting">Meeting</option>
              <option value="documentation">Documentation</option>
              <option value="installation">Installation</option>
              <option value="support">Support</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="Describe what you worked on..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="time-billable"
              checked={formData.billable}
              onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
              className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
            />
            <label htmlFor="time-billable" className="text-sm font-medium text-gray-700">Billable</label>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Log Time
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal 12: Resource Forecast Modal (Emerald Gradient)
interface ResourceForecastModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: string;
  endDate: string;
}

export function ResourceForecastModal({ isOpen, onClose, startDate, endDate }: ResourceForecastModalProps) {
  if (!isOpen) return null;

  const forecastData = [
    { month: 'Feb 2025', required: 45, available: 44, shortage: 1, surplus: 0 },
    { month: 'Mar 2025', required: 52, available: 44, shortage: 8, surplus: 0 },
    { month: 'Apr 2025', required: 38, available: 44, shortage: 0, surplus: 6 },
    { month: 'May 2025', required: 41, available: 44, shortage: 0, surplus: 3 },
  ];

  const departmentForecast = [
    { dept: 'Engineering', current: 25, projected: 32, variance: +7 },
    { dept: 'Projects', current: 12, projected: 15, variance: +3 },
    { dept: 'IT', current: 8, projected: 6, variance: -2 },
    { dept: 'Design', current: 5, projected: 8, variance: +3 },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Resource Forecast</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="text-sm font-medium text-emerald-900">Forecast Period</p>
            <p className="text-lg font-semibold text-emerald-700">{startDate} to {endDate}</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Avg Required</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">44</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Available</p>
              <p className="text-2xl font-bold text-green-900 mt-1">44</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600 font-medium">Peak Shortage</p>
              <p className="text-2xl font-bold text-red-900 mt-1">8</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-sm text-emerald-600 font-medium">Max Surplus</p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">6</p>
            </div>
          </div>

          {/* Monthly Forecast */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Monthly Resource Forecast</h4>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Month</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Required</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Available</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Shortage</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Surplus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {forecastData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.month}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">{row.required}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">{row.available}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        {row.shortage > 0 ? (
                          <span className="text-red-600 font-semibold">-{row.shortage}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        {row.surplus > 0 ? (
                          <span className="text-green-600 font-semibold">+{row.surplus}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Department Forecast */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Department-wise Forecast</h4>
            <div className="space-y-3">
              {departmentForecast.map((dept, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{dept.dept}</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      dept.variance > 0 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {dept.variance > 0 ? '+' : ''}{dept.variance}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">Current: <span className="font-semibold text-gray-900">{dept.current}</span></span>
                    <span className="text-gray-600">Projected: <span className="font-semibold text-gray-900">{dept.projected}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
