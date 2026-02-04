'use client';

import { useState } from 'react';
import { X, Plus, Edit, Copy, Trash2, Star, FileText, Settings, Share2, Archive } from 'lucide-react';

// Modal 1: Create Template Modal (Blue Gradient)
interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}

export function CreateTemplateModal({ isOpen, onClose, onCreate }: CreateTemplateModalProps) {
  const [formData, setFormData] = useState({
    templateName: '',
    projectType: 'Commercial Kitchen',
    category: 'Standard',
    complexity: 'Medium',
    description: '',
    estimatedDuration: '',
    estimatedBudget: '',
  });

  if (!isOpen) return null;

  const isValid = formData.templateName && formData.description && formData.estimatedDuration && formData.estimatedBudget;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Plus className="h-5 w-5 text-white" />
            <h2 className="text-xl font-semibold text-white">Create New Template</h2>
          </div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template Name *</label>
            <input type="text" value={formData.templateName} onChange={(e) => setFormData({ ...formData, templateName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., Commercial Kitchen - Full Installation" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Type *</label>
              <select value={formData.projectType} onChange={(e) => setFormData({ ...formData, projectType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>Commercial Kitchen</option>
                <option>Cold Room</option>
                <option>Switchgear</option>
                <option>Industrial Kitchen</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>Standard</option>
                <option>Custom</option>
                <option>Industry</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Complexity *</label>
            <select value={formData.complexity} onChange={(e) => setFormData({ ...formData, complexity: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option>Simple</option>
              <option>Medium</option>
              <option>Complex</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Describe the template purpose..." />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration *</label>
              <input type="text" value={formData.estimatedDuration} onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., 3-4 months" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Budget *</label>
              <input type="text" value={formData.estimatedBudget} onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., ₹50L - ₹1Cr" />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={() => onCreate(formData)} disabled={!isValid} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300">Create Template</button>
        </div>
      </div>
    </div>
  );
}

// Remaining 9 modals (compact implementations)
interface EditTemplateModalProps { isOpen: boolean; onClose: () => void; onUpdate: (data: any) => void; template: any; }
export function EditTemplateModal({ isOpen, onClose, onUpdate, template }: EditTemplateModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3"><Edit className="h-5 w-5 text-white" /><h2 className="text-xl font-semibold text-white">Edit Template</h2></div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6"><p className="text-gray-700">Editing: {template?.templateName}</p></div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={() => onUpdate({})} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

interface DuplicateTemplateModalProps { isOpen: boolean; onClose: () => void; onDuplicate: (data: any) => void; template: any; }
export function DuplicateTemplateModal({ isOpen, onClose, onDuplicate, template }: DuplicateTemplateModalProps) {
  const [newName, setNewName] = useState('');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3"><Copy className="h-5 w-5 text-white" /><h2 className="text-xl font-semibold text-white">Duplicate Template</h2></div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">New Template Name</label>
          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder={`Copy of ${template?.templateName}`} />
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={() => onDuplicate({ newName })} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Duplicate</button>
        </div>
      </div>
    </div>
  );
}

interface DeleteTemplateModalProps { isOpen: boolean; onClose: () => void; onDelete: () => void; template: any; }
export function DeleteTemplateModal({ isOpen, onClose, onDelete, template }: DeleteTemplateModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3"><Trash2 className="h-5 w-5 text-white" /><h2 className="text-xl font-semibold text-white">Delete Template</h2></div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <p className="text-gray-700">Are you sure you want to delete "{template?.templateName}"? This action cannot be undone.</p>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={onDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
}

interface TemplateSettingsModalProps { isOpen: boolean; onClose: () => void; onSave: (data: any) => void; template: any; }
export function TemplateSettingsModal({ isOpen, onClose, onSave, template }: TemplateSettingsModalProps) {
  const [settings, setSettings] = useState({
    budgetApprovalRequired: true,
    qualityChecksRequired: true,
    riskAssessmentRequired: false,
    documentationMandatory: true,
  });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3"><Settings className="h-5 w-5 text-white" /><h2 className="text-xl font-semibold text-white">Template Settings</h2></div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-3">
          {Object.entries(settings).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <input type="checkbox" checked={value} onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })} className="rounded" />
            </label>
          ))}
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={() => onSave(settings)} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Save Settings</button>
        </div>
      </div>
    </div>
  );
}

interface ShareTemplateModalProps { isOpen: boolean; onClose: () => void; onShare: (data: any) => void; template: any; }
export function ShareTemplateModal({ isOpen, onClose, onShare, template }: ShareTemplateModalProps) {
  const [shareWith, setShareWith] = useState('team');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3"><Share2 className="h-5 w-5 text-white" /><h2 className="text-xl font-semibold text-white">Share Template</h2></div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Share With</label>
          <select value={shareWith} onChange={(e) => setShareWith(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="team">My Team</option>
            <option value="department">My Department</option>
            <option value="organization">Entire Organization</option>
          </select>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={() => onShare({ shareWith })} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Share</button>
        </div>
      </div>
    </div>
  );
}

interface ExportTemplateModalProps { isOpen: boolean; onClose: () => void; onExport: (data: any) => void; template: any; }
export function ExportTemplateModal({ isOpen, onClose, onExport, template }: ExportTemplateModalProps) {
  const [format, setFormat] = useState('json');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3"><FileText className="h-5 w-5 text-white" /><h2 className="text-xl font-semibold text-white">Export Template</h2></div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="json">JSON</option>
            <option value="excel">Excel (XLSX)</option>
            <option value="pdf">PDF</option>
          </select>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={() => onExport({ format })} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Export</button>
        </div>
      </div>
    </div>
  );
}

interface ImportTemplateModalProps { isOpen: boolean; onClose: () => void; onImport: (file: File | null) => void; }
export function ImportTemplateModal({ isOpen, onClose, onImport }: ImportTemplateModalProps) {
  const [file, setFile] = useState<File | null>(null);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3"><FileText className="h-5 w-5 text-white" /><h2 className="text-xl font-semibold text-white">Import Template</h2></div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} accept=".json,.xlsx" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          {file && <p className="text-sm text-green-600 mt-2">Selected: {file.name}</p>}
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={() => onImport(file)} disabled={!file} className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-300">Import</button>
        </div>
      </div>
    </div>
  );
}

interface ArchiveTemplateModalProps { isOpen: boolean; onClose: () => void; onArchive: () => void; template: any; }
export function ArchiveTemplateModal({ isOpen, onClose, onArchive, template }: ArchiveTemplateModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3"><Archive className="h-5 w-5 text-white" /><h2 className="text-xl font-semibold text-white">Archive Template</h2></div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <p className="text-gray-700">Archive "{template?.templateName}"? You can restore it later.</p>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={onArchive} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Archive</button>
        </div>
      </div>
    </div>
  );
}

interface FavoriteTemplateModalProps { isOpen: boolean; onClose: () => void; onToggleFavorite: () => void; template: any; }
export function FavoriteTemplateModal({ isOpen, onClose, onToggleFavorite, template }: FavoriteTemplateModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3"><Star className="h-5 w-5 text-white" /><h2 className="text-xl font-semibold text-white">Manage Favorite</h2></div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <p className="text-gray-700">{template?.isFavorite ? 'Remove from' : 'Add to'} favorites: "{template?.templateName}"</p>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={onToggleFavorite} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">{template?.isFavorite ? 'Remove' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
}
