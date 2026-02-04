'use client';

import { useState } from 'react';
import { X, FolderKanban, Edit, Copy, Trash2, Settings, Eye, FileText, Tag, Upload } from 'lucide-react';

// ==================== 1. Create Project Type Modal ====================
interface CreateProjectTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}

export function CreateProjectTypeModal({ isOpen, onClose, onCreate }: CreateProjectTypeModalProps) {
  const [formData, setFormData] = useState({
    typeName: '',
    typeCode: '',
    category: 'Manufacturing',
    description: '',
    industry: '',
    defaultDuration: '',
    budgetRange: '',
    requiredApprovals: 1,
    defaultWorkflow: '',
  });

  if (!isOpen) return null;

  const isValid = formData.typeName && formData.typeCode && formData.description && formData.industry;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Project Type</h2>
              <p className="text-blue-100 text-sm">Define a new project type with custom settings</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type Name *</label>
              <input
                type="text"
                value={formData.typeName}
                onChange={(e) => setFormData({ ...formData, typeName: e.target.value })}
                placeholder="e.g., Commercial Kitchen - Full Installation"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type Code *</label>
                <input
                  type="text"
                  value={formData.typeCode}
                  onChange={(e) => setFormData({ ...formData, typeCode: e.target.value })}
                  placeholder="e.g., CK-FULL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Service">Service</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g., Hospitality & F&B"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the project type and its purpose..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Duration</label>
                <input
                  type="text"
                  value={formData.defaultDuration}
                  onChange={(e) => setFormData({ ...formData, defaultDuration: e.target.value })}
                  placeholder="e.g., 3-4 months"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                <input
                  type="text"
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                  placeholder="e.g., ₹50L - ₹1Cr"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required Approvals</label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.requiredApprovals}
                onChange={(e) => setFormData({ ...formData, requiredApprovals: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Workflow</label>
              <input
                type="text"
                value={formData.defaultWorkflow}
                onChange={(e) => setFormData({ ...formData, defaultWorkflow: e.target.value })}
                placeholder="e.g., Design → Approval → Procurement → Installation"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (isValid) {
                onCreate(formData);
              }
            }}
            disabled={!isValid}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Create Project Type
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 2. Edit Project Type Modal ====================
interface EditProjectTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  type: any;
}

export function EditProjectTypeModal({ isOpen, onClose, onSave, type }: EditProjectTypeModalProps) {
  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit Project Type</h2>
              <p className="text-green-100 text-sm">{type.typeName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-gray-600">Edit project type details, workflow, and custom fields.</p>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onSave({})}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 3. Duplicate Project Type Modal ====================
interface DuplicateProjectTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDuplicate: (data: any) => void;
  type: any;
}

export function DuplicateProjectTypeModal({ isOpen, onClose, onDuplicate, type }: DuplicateProjectTypeModalProps) {
  const [newName, setNewName] = useState('');

  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Copy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Duplicate Project Type</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-2">Create a copy of "{type.typeName}"</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Type Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={`${type.typeName} (Copy)`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onDuplicate({ ...type, newName })}
            disabled={!newName}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
          >
            Duplicate
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 4. Delete Project Type Modal ====================
interface DeleteProjectTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  type: any;
}

export function DeleteProjectTypeModal({ isOpen, onClose, onDelete, type }: DeleteProjectTypeModalProps) {
  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Delete Project Type</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete <strong>{type.typeName}</strong>?
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> This action cannot be undone. {type.projectCount} projects are using this type.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={onDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Delete Type
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 5. Manage Custom Fields Modal ====================
interface ManageCustomFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  type: any;
}

export function ManageCustomFieldsModal({ isOpen, onClose, onSave, type }: ManageCustomFieldsModalProps) {
  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Manage Custom Fields</h2>
              <p className="text-orange-100 text-sm">{type.typeName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-2">
            {type.customFields.map((field: any, idx: number) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{field.fieldName}</p>
                      {field.isMandatory && (
                        <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded">Required</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Type: {field.fieldType}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-between bg-gray-50">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            + Add Field
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={() => onSave({})}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== 6. View Type Details Modal ====================
interface ViewTypeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: any;
}

export function ViewTypeDetailsModal({ isOpen, onClose, type }: ViewTypeDetailsModalProps) {
  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl  w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{type.typeName}</h2>
              <p className="text-indigo-100 text-sm">{type.typeCode}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-700">{type.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Industry</h4>
                <p className="text-gray-900">{type.industry}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
                <p className="text-gray-900">{type.category}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Duration</h4>
                <p className="text-gray-900">{type.defaultDuration}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Budget Range</h4>
                <p className="text-gray-900">{type.budgetRange}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Metrics</h3>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">{type.projectCount}</p>
                  <p className="text-xs text-gray-600">Total Projects</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">{type.activeProjects}</p>
                  <p className="text-xs text-gray-600">Active</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-purple-600">{type.avgSuccessRate}%</p>
                  <p className="text-xs text-gray-600">Success Rate</p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-cyan-600">₹{(type.totalRevenue / 10000000).toFixed(1)}Cr</p>
                  <p className="text-xs text-gray-600">Revenue</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 7. Create Category Modal ====================
interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}

export function CreateCategoryModal({ isOpen, onClose, onCreate }: CreateCategoryModalProps) {
  const [formData, setFormData] = useState({
    categoryName: '',
    categoryCode: '',
    description: '',
    color: '#3B82F6',
  });

  if (!isOpen) return null;

  const isValid = formData.categoryName && formData.categoryCode && formData.description;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Category</h2>
              <p className="text-teal-100 text-sm">Define a new project category</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
            <input
              type="text"
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
              placeholder="e.g., Commercial Kitchen Solutions"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category Code *</label>
              <input
                type="text"
                value={formData.categoryCode}
                onChange={(e) => setFormData({ ...formData, categoryCode: e.target.value })}
                placeholder="e.g., CK"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-10 px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the category..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => {
              if (isValid) {
                onCreate(formData);
              }
            }}
            disabled={!isValid}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300"
          >
            Create Category
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 8. Edit Category Modal ====================
interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  category: any;
}

export function EditCategoryModal({ isOpen, onClose, onSave, category }: EditCategoryModalProps) {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit Category</h2>
              <p className="text-yellow-100 text-sm">{category.categoryName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600">Edit category details and linked project types.</p>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onSave({})}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
