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

// Placeholder exports for remaining modals (7-12)
export function WorkloadBalancingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return null;
}

export function RequestResourceModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return null;
}

export function ReleaseResourceModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return null;
}

export function ResourceSkillsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return null;
}

export function TimeTrackingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return null;
}

export function ResourceForecastModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return null;
}
