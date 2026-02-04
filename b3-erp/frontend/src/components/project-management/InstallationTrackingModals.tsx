'use client';

import { useState } from 'react';
import { X, Plus, Edit, Eye, Wrench, Upload, CheckCircle, AlertTriangle, Users, Calendar, FileText, TrendingUp, Package, Link, Download } from 'lucide-react';

// ==================== 1. Add Installation Activity Modal ====================
interface AddInstallationActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

export function AddInstallationActivityModal({ isOpen, onClose, onAdd }: AddInstallationActivityModalProps) {
  const [formData, setFormData] = useState({
    activityNumber: '',
    projectId: '',
    equipmentItem: '',
    equipmentCode: '',
    location: '',
    zone: '',
    installationType: 'New Installation',
    plannedStartDate: '',
    plannedEndDate: '',
    assignedTeam: '',
    teamSize: '',
    supervisor: '',
    toolsRequired: '',
    remarks: '',
  });

  if (!isOpen) return null;

  const isValid = formData.activityNumber && formData.projectId && formData.equipmentItem && formData.location && formData.plannedStartDate && formData.plannedEndDate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl  w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Installation Activity</h2>
              <p className="text-blue-100 text-sm">Create new equipment installation task</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activity Number *</label>
              <input
                type="text"
                value={formData.activityNumber}
                onChange={(e) => setFormData({ ...formData, activityNumber: e.target.value })}
                placeholder="e.g., INST-2025-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project ID *</label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Project</option>
                <option value="PRJ-2025-001">PRJ-2025-001 - Taj Hotels</option>
                <option value="PRJ-2025-002">PRJ-2025-002 - BigBasket</option>
                <option value="PRJ-2025-003">PRJ-2025-003 - L&T Campus</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Item *</label>
              <input
                type="text"
                value={formData.equipmentItem}
                onChange={(e) => setFormData({ ...formData, equipmentItem: e.target.value })}
                placeholder="e.g., Gas Cooking Range - 6 Burner"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Code</label>
              <input
                type="text"
                value={formData.equipmentCode}
                onChange={(e) => setFormData({ ...formData, equipmentCode: e.target.value })}
                placeholder="e.g., EQ-CK-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Installation Type</label>
              <select
                value={formData.installationType}
                onChange={(e) => setFormData({ ...formData, installationType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="New Installation">New Installation</option>
                <option value="Replacement">Replacement</option>
                <option value="Modification">Modification</option>
                <option value="Upgrade">Upgrade</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Main Kitchen - Cooking Section"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
              <input
                type="text"
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                placeholder="e.g., Zone A"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Planned Start Date *</label>
              <input
                type="date"
                value={formData.plannedStartDate}
                onChange={(e) => setFormData({ ...formData, plannedStartDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Planned End Date *</label>
              <input
                type="date"
                value={formData.plannedEndDate}
                onChange={(e) => setFormData({ ...formData, plannedEndDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Team</label>
              <input
                type="text"
                value={formData.assignedTeam}
                onChange={(e) => setFormData({ ...formData, assignedTeam: e.target.value })}
                placeholder="e.g., Installation Team A"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
              <input
                type="number"
                value={formData.teamSize}
                onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                placeholder="e.g., 4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
              <input
                type="text"
                value={formData.supervisor}
                onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                placeholder="Supervisor name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tools Required</label>
              <input
                type="text"
                value={formData.toolsRequired}
                onChange={(e) => setFormData({ ...formData, toolsRequired: e.target.value })}
                placeholder="Comma-separated list of tools"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea
                rows={3}
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Additional notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={() => onAdd(formData)}
            disabled={!isValid}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Activity
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 2. Edit Installation Activity Modal ====================
interface EditInstallationActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (data: any) => void;
  activity: any;
}

export function EditInstallationActivityModal({ isOpen, onClose, onEdit, activity }: EditInstallationActivityModalProps) {
  const [formData, setFormData] = useState({
    equipmentItem: activity.equipmentItem,
    location: activity.location,
    zone: activity.zone,
    plannedStartDate: activity.plannedStartDate,
    plannedEndDate: activity.plannedEndDate,
    assignedTeam: activity.assignedTeam,
    teamSize: activity.teamSize,
    supervisor: activity.supervisor,
    remarks: activity.remarks,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl  w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit Installation Activity</h2>
              <p className="text-green-100 text-sm">{activity.activityNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Item</label>
              <input
                type="text"
                value={formData.equipmentItem}
                onChange={(e) => setFormData({ ...formData, equipmentItem: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
              <input
                type="text"
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Planned Start Date</label>
              <input
                type="date"
                value={formData.plannedStartDate}
                onChange={(e) => setFormData({ ...formData, plannedStartDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Planned End Date</label>
              <input
                type="date"
                value={formData.plannedEndDate}
                onChange={(e) => setFormData({ ...formData, plannedEndDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Team</label>
              <input
                type="text"
                value={formData.assignedTeam}
                onChange={(e) => setFormData({ ...formData, assignedTeam: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
              <input
                type="number"
                value={formData.teamSize}
                onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
              <input
                type="text"
                value={formData.supervisor}
                onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea
                rows={3}
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={() => onEdit(formData)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 3. Update Progress Modal ====================
interface UpdateProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  activity: any;
}

export function UpdateProgressModal({ isOpen, onClose, onUpdate, activity }: UpdateProgressModalProps) {
  const [formData, setFormData] = useState({
    progress: activity.progress.toString(),
    actualStartDate: activity.actualStartDate || '',
    actualEndDate: activity.actualEndDate || '',
    remarks: '',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Update Progress</h2>
              <p className="text-purple-100 text-sm">{activity.activityNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progress: {formData.progress}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Actual Start Date</label>
              <input
                type="date"
                value={formData.actualStartDate}
                onChange={(e) => setFormData({ ...formData, actualStartDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Actual End Date</label>
              <input
                type="date"
                value={formData.actualEndDate}
                onChange={(e) => setFormData({ ...formData, actualEndDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Progress Notes</label>
            <textarea
              rows={3}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Describe progress updates..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={() => onUpdate(formData)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Update Progress
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 4. Upload Photos Modal ====================
interface UploadPhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: FileList) => void;
  activity: any;
}

export function UploadPhotosModal({ isOpen, onClose, onUpload, activity }: UploadPhotosModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Upload Installation Photos</h2>
              <p className="text-orange-100 text-sm">{activity.activityNumber} - Current: {activity.photos} photos</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop photos here, or click to select files
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="inline-block px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 cursor-pointer"
            >
              Select Photos
            </label>
          </div>

          {selectedFiles && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Selected Files: {selectedFiles.length}
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                {Array.from(selectedFiles).map((file, index) => (
                  <li key={index}>• {file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Upload photos of installation progress, completed work, safety measures, and quality checkpoints.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={() => selectedFiles && onUpload(selectedFiles)}
            disabled={!selectedFiles}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload Photos
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 5. Mark Safety Checklist Modal ====================
interface MarkSafetyChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMark: (data: any) => void;
  activity: any;
}

export function MarkSafetyChecklistModal({ isOpen, onClose, onMark, activity }: MarkSafetyChecklistModalProps) {
  const [checklistItems, setChecklistItems] = useState([
    { item: 'Personal protective equipment (PPE) provided and worn', checked: false },
    { item: 'Work area inspected for hazards', checked: false },
    { item: 'Tools and equipment inspected for safety', checked: false },
    { item: 'Emergency exits and fire extinguishers identified', checked: false },
    { item: 'Electrical safety measures in place', checked: false },
    { item: 'Lifting and handling procedures reviewed', checked: false },
    { item: 'First aid kit available on site', checked: false },
    { item: 'Safety briefing conducted with team', checked: false },
  ]);

  const [inspector, setInspector] = useState('');
  const [remarks, setRemarks] = useState('');

  if (!isOpen) return null;

  const allChecked = checklistItems.every(item => item.checked);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Safety Checklist</h2>
              <p className="text-green-100 text-sm">{activity.activityNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="space-y-3">
            {checklistItems.map((item, index) => (
              <label key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => {
                    const newItems = [...checklistItems];
                    newItems[index].checked = e.target.checked;
                    setChecklistItems(newItems);
                  }}
                  className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <span className="text-sm text-gray-900">{item.item}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Safety Inspector</label>
            <input
              type="text"
              value={inspector}
              onChange={(e) => setInspector(e.target.value)}
              placeholder="Inspector name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Additional safety notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {allChecked && (
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
              <p className="text-sm font-semibold text-green-800">
                ✓ All safety checklist items completed
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={() => onMark({ checklistItems, inspector, remarks })}
            disabled={!allChecked || !inspector}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark as Completed
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 6. Mark Quality Checkpoint Modal ====================
interface MarkQualityCheckpointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMark: (data: any) => void;
  activity: any;
}

export function MarkQualityCheckpointModal({ isOpen, onClose, onMark, activity }: MarkQualityCheckpointModalProps) {
  const [formData, setFormData] = useState({
    inspector: '',
    result: 'Passed',
    measurements: '',
    defects: '',
    correctionRequired: false,
    correctionDetails: '',
    remarks: '',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Quality Checkpoint</h2>
              <p className="text-indigo-100 text-sm">{activity.activityNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quality Inspector</label>
            <input
              type="text"
              value={formData.inspector}
              onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
              placeholder="Inspector name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inspection Result</label>
            <select
              value={formData.result}
              onChange={(e) => setFormData({ ...formData, result: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Passed">Passed</option>
              <option value="Passed with Minor Issues">Passed with Minor Issues</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Measurements / Specifications</label>
            <textarea
              rows={2}
              value={formData.measurements}
              onChange={(e) => setFormData({ ...formData, measurements: e.target.value })}
              placeholder="e.g., Level variance: ±2mm, Alignment: Within tolerance"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Defects / Issues Found</label>
            <textarea
              rows={2}
              value={formData.defects}
              onChange={(e) => setFormData({ ...formData, defects: e.target.value })}
              placeholder="List any defects or issues..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.correctionRequired}
                onChange={(e) => setFormData({ ...formData, correctionRequired: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Correction Required</span>
            </label>
          </div>

          {formData.correctionRequired && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correction Details</label>
              <textarea
                rows={2}
                value={formData.correctionDetails}
                onChange={(e) => setFormData({ ...formData, correctionDetails: e.target.value })}
                placeholder="Describe required corrections..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Remarks</label>
            <textarea
              rows={2}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Additional notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={() => onMark(formData)}
            disabled={!formData.inspector}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Quality Check
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 7. Report Issue Modal ====================
interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: (data: any) => void;
  activity: any;
}

export function ReportIssueModal({ isOpen, onClose, onReport, activity }: ReportIssueModalProps) {
  const [formData, setFormData] = useState({
    issueType: 'Technical',
    severity: 'Medium',
    description: '',
    impact: '',
    suggestedAction: '',
    reportedBy: '',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Report Issue</h2>
              <p className="text-red-100 text-sm">{activity.activityNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
              <select
                value={formData.issueType}
                onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="Technical">Technical</option>
                <option value="Material">Material</option>
                <option value="Safety">Safety</option>
                <option value="Quality">Quality</option>
                <option value="Resource">Resource</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the issue in detail..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Impact on Project</label>
            <textarea
              rows={2}
              value={formData.impact}
              onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
              placeholder="Describe the impact..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Suggested Action</label>
            <textarea
              rows={2}
              value={formData.suggestedAction}
              onChange={(e) => setFormData({ ...formData, suggestedAction: e.target.value })}
              placeholder="Suggest corrective action..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reported By</label>
            <input
              type="text"
              value={formData.reportedBy}
              onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
              placeholder="Your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={() => onReport(formData)}
            disabled={!formData.description || !formData.reportedBy}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Report Issue
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 8. Update Status Modal ====================
interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  activity: any;
}

export function UpdateStatusModal({ isOpen, onClose, onUpdate, activity }: UpdateStatusModalProps) {
  const [formData, setFormData] = useState({
    status: activity.status,
    reason: '',
    remarks: '',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full">
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Update Status</h2>
              <p className="text-yellow-100 text-sm">{activity.activityNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Status: {activity.status}</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>

          {(formData.status === 'On Hold' || formData.status === 'Delayed') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for {formData.status}</label>
              <textarea
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Explain the reason..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Remarks</label>
            <textarea
              rows={3}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Additional notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={() => onUpdate(formData)}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 9. Assign Team Modal ====================
interface AssignTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (data: any) => void;
  activity: any;
}

export function AssignTeamModal({ isOpen, onClose, onAssign, activity }: AssignTeamModalProps) {
  const [formData, setFormData] = useState({
    assignedTeam: activity.assignedTeam,
    teamSize: activity.teamSize.toString(),
    supervisor: activity.supervisor,
    teamMembers: '',
    specialSkills: '',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Assign Team</h2>
              <p className="text-cyan-100 text-sm">{activity.activityNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
            <input
              type="text"
              value={formData.assignedTeam}
              onChange={(e) => setFormData({ ...formData, assignedTeam: e.target.value })}
              placeholder="e.g., Installation Team A"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
              <input
                type="number"
                value={formData.teamSize}
                onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                placeholder="Number of members"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
              <input
                type="text"
                value={formData.supervisor}
                onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                placeholder="Supervisor name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Members</label>
            <textarea
              rows={3}
              value={formData.teamMembers}
              onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
              placeholder="List team member names (one per line)..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Required Special Skills</label>
            <input
              type="text"
              value={formData.specialSkills}
              onChange={(e) => setFormData({ ...formData, specialSkills: e.target.value })}
              placeholder="e.g., Welding, Electrical, HVAC"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={() => onAssign(formData)}
            disabled={!formData.assignedTeam || !formData.supervisor}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Assign Team
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 10. Schedule Activity Modal ====================
interface ScheduleActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (data: any) => void;
  activity: any;
}

export function ScheduleActivityModal({ isOpen, onClose, onSchedule, activity }: ScheduleActivityModalProps) {
  const [formData, setFormData] = useState({
    plannedStartDate: activity.plannedStartDate,
    plannedEndDate: activity.plannedEndDate,
    estimatedDuration: '',
    workingHours: '8',
    shiftType: 'Day',
    remarks: '',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Schedule Activity</h2>
              <p className="text-pink-100 text-sm">{activity.activityNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Planned Start Date</label>
              <input
                type="date"
                value={formData.plannedStartDate}
                onChange={(e) => setFormData({ ...formData, plannedStartDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Planned End Date</label>
              <input
                type="date"
                value={formData.plannedEndDate}
                onChange={(e) => setFormData({ ...formData, plannedEndDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration (days)</label>
              <input
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                placeholder="e.g., 3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours per Day</label>
              <select
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="4">4 hours (Half Day)</option>
                <option value="8">8 hours (Full Day)</option>
                <option value="12">12 hours (Extended)</option>
                <option value="16">16 hours (Double Shift)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shift Type</label>
            <select
              value={formData.shiftType}
              onChange={(e) => setFormData({ ...formData, shiftType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              <option value="Day">Day Shift</option>
              <option value="Night">Night Shift</option>
              <option value="Both">Both Shifts</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scheduling Notes</label>
            <textarea
              rows={3}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Additional scheduling details..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={() => onSchedule(formData)}
            disabled={!formData.plannedStartDate || !formData.plannedEndDate}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 11. Update Materials Modal ====================
interface UpdateMaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  activity: any;
}

export function UpdateMaterialsModal({ isOpen, onClose, onUpdate, activity }: UpdateMaterialsModalProps) {
  const [formData, setFormData] = useState({
    materialAvailability: activity.materialAvailability,
    availableItems: '',
    missingItems: '',
    expectedDelivery: '',
    supplier: '',
    remarks: '',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Update Materials Status</h2>
              <p className="text-teal-100 text-sm">{activity.activityNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material Availability Status</label>
            <select
              value={formData.materialAvailability}
              onChange={(e) => setFormData({ ...formData, materialAvailability: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="Available">All Available</option>
              <option value="Partial">Partially Available</option>
              <option value="Not Available">Not Available</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available Materials</label>
            <textarea
              rows={2}
              value={formData.availableItems}
              onChange={(e) => setFormData({ ...formData, availableItems: e.target.value })}
              placeholder="List available materials..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {formData.materialAvailability !== 'Available' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Missing/Pending Materials</label>
                <textarea
                  rows={2}
                  value={formData.missingItems}
                  onChange={(e) => setFormData({ ...formData, missingItems: e.target.value })}
                  placeholder="List missing materials..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery Date</label>
                  <input
                    type="date"
                    value={formData.expectedDelivery}
                    onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="Supplier name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              rows={2}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Additional notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={() => onUpdate(formData)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Update Materials
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 12. Add Dependencies Modal ====================
interface AddDependenciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  activity: any;
}

export function AddDependenciesModal({ isOpen, onClose, onAdd, activity }: AddDependenciesModalProps) {
  const [selectedDependencies, setSelectedDependencies] = useState<string[]>(activity.dependencies || []);
  const [prerequisitesCompleted, setPrerequisitesCompleted] = useState(activity.prerequisitesCompleted);
  const [remarks, setRemarks] = useState('');

  if (!isOpen) return null;

  const availableActivities = [
    'INST-2025-001',
    'INST-2025-002',
    'INST-2025-003',
    'INST-2025-010',
    'DEMO-2025-001',
  ];

  const toggleDependency = (dep: string) => {
    if (selectedDependencies.includes(dep)) {
      setSelectedDependencies(selectedDependencies.filter(d => d !== dep));
    } else {
      setSelectedDependencies([...selectedDependencies, dep]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-violet-500 to-violet-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Link className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Manage Dependencies</h2>
              <p className="text-violet-100 text-sm">{activity.activityNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Dependent Activities (Must be completed before this activity)
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableActivities.map((dep) => (
                <label
                  key={dep}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedDependencies.includes(dep)}
                    onChange={() => toggleDependency(dep)}
                    className="w-4 h-4 text-violet-600 rounded focus:ring-2 focus:ring-violet-500"
                  />
                  <span className="text-sm text-gray-900">{dep}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={prerequisitesCompleted}
                onChange={(e) => setPrerequisitesCompleted(e.target.checked)}
                className="w-5 h-5 text-violet-600 rounded focus:ring-2 focus:ring-violet-500"
              />
              <span className="text-sm font-medium text-gray-900">
                Mark all prerequisites as completed
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dependency Notes</label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Additional notes about dependencies..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {selectedDependencies.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                Selected Dependencies ({selectedDependencies.length}):
              </p>
              <ul className="space-y-1">
                {selectedDependencies.map((dep, index) => (
                  <li key={index} className="text-sm text-blue-700">• {dep}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={() => onAdd({ dependencies: selectedDependencies, prerequisitesCompleted, remarks })}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            Save Dependencies
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 13. Generate Report Modal ====================
interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: any) => void;
}

export function GenerateReportModal({ isOpen, onClose, onGenerate }: GenerateReportModalProps) {
  const [formData, setFormData] = useState({
    reportType: 'Progress',
    dateFrom: '',
    dateTo: '',
    projects: 'all',
    status: 'all',
    includePhotos: false,
    includeIssues: true,
    format: 'PDF',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Generate Installation Report</h2>
              <p className="text-emerald-100 text-sm">Create comprehensive activity reports</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={formData.reportType}
              onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Progress">Progress Summary</option>
              <option value="Detailed">Detailed Activity Report</option>
              <option value="Issues">Issues & Delays</option>
              <option value="Resource">Resource Utilization</option>
              <option value="Timeline">Timeline Analysis</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
              <input
                type="date"
                value={formData.dateFrom}
                onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
              <input
                type="date"
                value={formData.dateTo}
                onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Project</label>
              <select
                value={formData.projects}
                onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Projects</option>
                <option value="PRJ-2025-001">PRJ-2025-001</option>
                <option value="PRJ-2025-002">PRJ-2025-002</option>
                <option value="PRJ-2025-003">PRJ-2025-003</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Delayed">Delayed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.includePhotos}
                onChange={(e) => setFormData({ ...formData, includePhotos: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Include installation photos</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.includeIssues}
                onChange={(e) => setFormData({ ...formData, includeIssues: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Include issues and delays</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
            <select
              value={formData.format}
              onChange={(e) => setFormData({ ...formData, format: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="PDF">PDF Document</option>
              <option value="Excel">Excel Spreadsheet</option>
              <option value="Word">Word Document</option>
            </select>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={() => onGenerate(formData)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 14. Export Data Modal ====================
interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: any) => void;
}

export function ExportDataModal({ isOpen, onClose, onExport }: ExportDataModalProps) {
  const [formData, setFormData] = useState({
    exportType: 'Current',
    format: 'Excel',
    includeCompleted: true,
    includeInProgress: true,
    includeNotStarted: false,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Export Installation Data</h2>
              <p className="text-amber-100 text-sm">Export activities to file</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Export Scope</label>
            <select
              value={formData.exportType}
              onChange={(e) => setFormData({ ...formData, exportType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="Current">Current View (Filtered)</option>
              <option value="All">All Activities</option>
              <option value="Project">By Project</option>
              <option value="DateRange">By Date Range</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
            <select
              value={formData.format}
              onChange={(e) => setFormData({ ...formData, format: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="Excel">Excel (.xlsx)</option>
              <option value="CSV">CSV (.csv)</option>
              <option value="JSON">JSON (.json)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Include Status:</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.includeCompleted}
                  onChange={(e) => setFormData({ ...formData, includeCompleted: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-700">Completed</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.includeInProgress}
                  onChange={(e) => setFormData({ ...formData, includeInProgress: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-700">In Progress</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.includeNotStarted}
                  onChange={(e) => setFormData({ ...formData, includeNotStarted: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-700">Not Started</span>
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={() => onExport(formData)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 15. View Full Details Modal ====================
interface ViewFullDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: any;
}

export function ViewFullDetailsModal({ isOpen, onClose, activity }: ViewFullDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl  w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{activity.activityNumber}</h2>
              <p className="text-slate-200 text-sm">{activity.equipmentItem}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Project & Location */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-sm text-gray-600">Project</p>
              <p className="font-medium text-gray-900">{activity.projectName}</p>
              <p className="text-sm text-gray-500">{activity.projectId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium text-gray-900">{activity.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Zone</p>
              <p className="font-medium text-gray-900">{activity.zone}</p>
            </div>
          </div>

          {/* Equipment Details */}
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Equipment Details</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-600">Equipment Code</p>
                <p className="font-medium text-gray-900">{activity.equipmentCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Installation Type</p>
                <p className="font-medium text-gray-900">{activity.installationType}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Timeline</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-600">Planned: {activity.plannedStartDate} to {activity.plannedEndDate}</p>
              </div>
              <div>
                {activity.actualStartDate && (
                  <p className="text-sm text-blue-600">
                    Actual: {activity.actualStartDate} {activity.actualEndDate ? `to ${activity.actualEndDate}` : '(ongoing)'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Team & Resources */}
          <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Team & Resources</h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-sm text-gray-600">Team</p>
                <p className="font-medium text-gray-900">{activity.assignedTeam}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Team Size</p>
                <p className="font-medium text-gray-900">{activity.teamSize} members</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Supervisor</p>
                <p className="font-medium text-gray-900">{activity.supervisor}</p>
              </div>
            </div>
          </div>

          {/* Tools Required */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Tools Required</h4>
            <div className="flex flex-wrap gap-2">
              {activity.toolsRequired.map((tool: string, index: number) => (
                <span key={index} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-3 gap-2">
            <div className={`p-4 rounded-lg ${activity.prerequisitesCompleted ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="text-sm text-gray-600">Prerequisites</p>
              <p className={`font-semibold ${activity.prerequisitesCompleted ? 'text-green-600' : 'text-red-600'}`}>
                {activity.prerequisitesCompleted ? 'Completed' : 'Pending'}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${activity.safetyChecklist ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="text-sm text-gray-600">Safety Checklist</p>
              <p className={`font-semibold ${activity.safetyChecklist ? 'text-green-600' : 'text-red-600'}`}>
                {activity.safetyChecklist ? 'Completed' : 'Pending'}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${activity.qualityCheckpoint ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
              <p className="text-sm text-gray-600">Quality Check</p>
              <p className={`font-semibold ${activity.qualityCheckpoint ? 'text-green-600' : 'text-yellow-600'}`}>
                {activity.qualityCheckpoint ? 'Passed' : 'Pending'}
              </p>
            </div>
          </div>

          {/* Material Availability */}
          <div>
            <p className="text-sm text-gray-600 mb-1">Material Availability</p>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              activity.materialAvailability === 'Available' ? 'bg-green-100 text-green-800' :
              activity.materialAvailability === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {activity.materialAvailability}
            </span>
          </div>

          {/* Dependencies */}
          {activity.dependencies.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Dependencies</h4>
              <ul className="space-y-1">
                {activity.dependencies.map((dep: string, index: number) => (
                  <li key={index} className="text-sm text-gray-600">• {dep}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Issues */}
          {activity.issues.length > 0 && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <h4 className="text-sm font-semibold text-red-900 mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Issues ({activity.issues.length})
              </h4>
              <ul className="space-y-1">
                {activity.issues.map((issue: string, index: number) => (
                  <li key={index} className="text-sm text-red-700">• {issue}</li>
                ))}
              </ul>
              {activity.delayReason && (
                <p className="text-sm text-red-700 mt-2">
                  <span className="font-semibold">Delay Reason:</span> {activity.delayReason}
                </p>
              )}
            </div>
          )}

          {/* Photos */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Installation Photos</p>
              <p className="font-medium text-gray-900">{activity.photos} photos uploaded</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              View Photos
            </button>
          </div>

          {/* Remarks */}
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <p className="text-sm font-semibold text-gray-900 mb-1">Remarks:</p>
            <p className="text-sm text-gray-700">{activity.remarks}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
