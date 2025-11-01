'use client';

import { useState } from 'react';
import { X, ClipboardCheck, CheckCircle, XCircle, AlertTriangle, FileText, Upload, Camera, Edit, Users, TrendingUp, Calendar, Shield, Eye, Download } from 'lucide-react';

// ============================================================================
// 1. Schedule Inspection Modal (Blue gradient)
// ============================================================================

interface ScheduleInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (data: any) => void;
}

export function ScheduleInspectionModal({ isOpen, onClose, onSchedule }: ScheduleInspectionModalProps) {
  const [formData, setFormData] = useState({
    projectId: '',
    inspectionType: 'During Installation',
    phase: '',
    workPackage: '',
    inspectionDate: '',
    inspectorName: '',
    inspectorId: '',
    checklistTemplate: '',
  });

  const isFormValid = formData.projectId && formData.inspectionDate && formData.inspectorName;

  const handleSubmit = () => {
    if (isFormValid) {
      onSchedule(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Schedule Quality Inspection</h2>
              <p className="text-blue-100 text-sm">Plan and schedule inspection activities</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Project</option>
                  <option value="PRJ-2025-001">PRJ-2025-001 - Taj Hotels Kitchen</option>
                  <option value="PRJ-2025-002">PRJ-2025-002 - BigBasket Cold Room</option>
                  <option value="PRJ-2025-003">PRJ-2025-003 - L&T Campus Kitchen</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inspection Type</label>
                <select
                  value={formData.inspectionType}
                  onChange={(e) => setFormData({ ...formData, inspectionType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pre-Installation">Pre-Installation</option>
                  <option value="During Installation">During Installation</option>
                  <option value="Post-Installation">Post-Installation</option>
                  <option value="Final Inspection">Final Inspection</option>
                  <option value="Periodic">Periodic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phase</label>
                <input
                  type="text"
                  value={formData.phase}
                  onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                  placeholder="e.g., Equipment Installation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Package</label>
                <input
                  type="text"
                  value={formData.workPackage}
                  onChange={(e) => setFormData({ ...formData, workPackage: e.target.value })}
                  placeholder="e.g., WP-001 - Cooking Equipment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inspection Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.inspectionDate}
                  onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Checklist Template</label>
                <select
                  value={formData.checklistTemplate}
                  onChange={(e) => setFormData({ ...formData, checklistTemplate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Template</option>
                  <option value="KITCHEN">Commercial Kitchen Standard</option>
                  <option value="COLDROOM">Cold Room Installation</option>
                  <option value="HVAC">HVAC System</option>
                  <option value="ELECTRICAL">Electrical Works</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inspector Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.inspectorName}
                  onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
                  placeholder="Quality inspector name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inspector ID</label>
                <input
                  type="text"
                  value={formData.inspectorId}
                  onChange={(e) => setFormData({ ...formData, inspectorId: e.target.value })}
                  placeholder="EMP-QC-XXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Schedule Inspection
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. Edit Inspection Modal (Green gradient)
// ============================================================================

interface EditInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (data: any) => void;
  inspection: any;
}

export function EditInspectionModal({ isOpen, onClose, onEdit, inspection }: EditInspectionModalProps) {
  const [formData, setFormData] = useState({
    inspectionType: inspection?.inspectionType || 'During Installation',
    phase: inspection?.phase || '',
    workPackage: inspection?.workPackage || '',
    inspectionDate: inspection?.inspectionDate || '',
    remarks: inspection?.remarks || '',
  });

  const handleSubmit = () => {
    onEdit(formData);
  };

  if (!isOpen || !inspection) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Edit className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit Inspection</h2>
              <p className="text-green-100 text-sm">{inspection.inspectionNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inspection Type</label>
            <select
              value={formData.inspectionType}
              onChange={(e) => setFormData({ ...formData, inspectionType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="Pre-Installation">Pre-Installation</option>
              <option value="During Installation">During Installation</option>
              <option value="Post-Installation">Post-Installation</option>
              <option value="Final Inspection">Final Inspection</option>
              <option value="Periodic">Periodic</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phase</label>
            <input
              type="text"
              value={formData.phase}
              onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Work Package</label>
            <input
              type="text"
              value={formData.workPackage}
              onChange={(e) => setFormData({ ...formData, workPackage: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inspection Date</label>
            <input
              type="date"
              value={formData.inspectionDate}
              onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. Update Checklist Modal (Purple gradient)
// ============================================================================

interface UpdateChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  inspection: any;
}

export function UpdateChecklistModal({ isOpen, onClose, onUpdate, inspection }: UpdateChecklistModalProps) {
  const [checklist, setChecklist] = useState(inspection?.checklist || []);

  const handleResultChange = (index: number, result: string) => {
    const updated = [...checklist];
    updated[index].result = result;
    setChecklist(updated);
  };

  const handleRemarksChange = (index: number, remarks: string) => {
    const updated = [...checklist];
    updated[index].remarks = remarks;
    setChecklist(updated);
  };

  const handleSubmit = () => {
    onUpdate({ checklist });
  };

  if (!isOpen || !inspection) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <ClipboardCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Update Inspection Checklist</h2>
              <p className="text-purple-100 text-sm">{inspection.inspectionNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-4">
            {checklist.map((item: any, index: number) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-5">
                    <p className="text-sm font-semibold text-gray-900">{item.checkPoint}</p>
                    <p className="text-xs text-gray-600 mt-1">Criteria: {item.criteria}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Result</label>
                    <select
                      value={item.result}
                      onChange={(e) => handleResultChange(index, e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                      <option value="NA">N/A</option>
                    </select>
                  </div>
                  <div className="col-span-5">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Remarks</label>
                    <input
                      type="text"
                      value={item.remarks}
                      onChange={(e) => handleRemarksChange(index, e.target.value)}
                      placeholder="Add remarks..."
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
            Save Checklist
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. Add Defect Modal (Red gradient)
// ============================================================================

interface AddDefectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  inspection: any;
}

export function AddDefectModal({ isOpen, onClose, onAdd, inspection }: AddDefectModalProps) {
  const [formData, setFormData] = useState({
    defectType: 'Quality',
    severity: 'Minor',
    checkPoint: '',
    description: '',
    location: '',
    rectificationRequired: '',
    responsibleParty: '',
    targetDate: '',
  });

  const isFormValid = formData.description && formData.rectificationRequired;

  const handleSubmit = () => {
    if (isFormValid) {
      onAdd(formData);
    }
  };

  if (!isOpen || !inspection) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Report Defect</h2>
              <p className="text-red-100 text-sm">Document quality defect or non-conformance</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Defect Type</label>
              <select
                value={formData.defectType}
                onChange={(e) => setFormData({ ...formData, defectType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="Quality">Quality Defect</option>
                <option value="Workmanship">Workmanship</option>
                <option value="Material">Material Defect</option>
                <option value="Dimension">Dimensional Error</option>
                <option value="Safety">Safety Issue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="Critical">Critical</option>
                <option value="Major">Major</option>
                <option value="Minor">Minor</option>
                <option value="Cosmetic">Cosmetic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Related Checkpoint</label>
              <select
                value={formData.checkPoint}
                onChange={(e) => setFormData({ ...formData, checkPoint: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select checkpoint</option>
                {inspection.checklist?.map((item: any) => (
                  <option key={item.id} value={item.id}>{item.checkPoint}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Specific location of defect"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Defect Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the defect..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rectification Required <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.rectificationRequired}
              onChange={(e) => setFormData({ ...formData, rectificationRequired: e.target.value })}
              placeholder="Actions required to rectify this defect..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsible Party</label>
              <input
                type="text"
                value={formData.responsibleParty}
                onChange={(e) => setFormData({ ...formData, responsibleParty: e.target.value })}
                placeholder="Contractor/Team responsible"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Rectification Date</label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
          >
            Report Defect
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. Upload Photos Modal (Orange gradient)
// ============================================================================

interface UploadPhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: any) => void;
  inspection: any;
}

export function UploadPhotosModal({ isOpen, onClose, onUpload, inspection }: UploadPhotosModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [photoCategory, setPhotoCategory] = useState('General');

  const handleFileSelect = () => {
    setSelectedFiles(['photo1.jpg', 'photo2.jpg', 'photo3.jpg']);
  };

  const handleSubmit = () => {
    onUpload({ files: selectedFiles, category: photoCategory });
  };

  if (!isOpen || !inspection) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Upload Inspection Photos</h2>
              <p className="text-orange-100 text-sm">{inspection.inspectionNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo Category</label>
            <select
              value={photoCategory}
              onChange={(e) => setPhotoCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="General">General View</option>
              <option value="Before">Before Work</option>
              <option value="Progress">Work in Progress</option>
              <option value="Completed">Completed Work</option>
              <option value="Defect">Defect Evidence</option>
              <option value="Measurement">Measurements</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors cursor-pointer">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-900 mb-1">Click to upload photos</p>
            <p className="text-xs text-gray-500">JPG, PNG (max 10MB each)</p>
            <button
              onClick={handleFileSelect}
              className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
            >
              Select Photos
            </button>
          </div>

          {selectedFiles.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Photos ({selectedFiles.length})</h4>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Camera className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-900">{file}</span>
                    </div>
                    <button className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <p className="text-sm text-orange-800">
              <span className="font-semibold">Current photos:</span> {inspection.photos} files
            </p>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedFiles.length === 0}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium disabled:opacity-50"
          >
            Upload Photos
          </button>
        </div>
      </div>
    </div>
  );
}

// Note: Continuing with remaining 10 modals in compact format due to token limits

// 6-15: Sign Off, Update Status, Assign Inspector, Add Checklist Item,
// Generate Report, Export Data, Re-Inspection, View Details, Add Corrective Action, Schedule Next

export function SignOffModal({ isOpen, onClose, onSignOff, inspection }: any) {
  const [signOffData, setSignOffData] = useState({ signOffBy: '', password: '', remarks: '' });

  if (!isOpen || !inspection) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Sign Off Inspection</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm font-medium">Inspection: {inspection.inspectionNumber}</p>
            <p className="text-sm text-gray-600">Status: {inspection.overallStatus}</p>
            <p className="text-sm text-gray-600">Passed: {inspection.passed}/{inspection.totalCheckPoints}</p>
          </div>
          <input
            type="text"
            placeholder="Your name"
            value={signOffData.signOffBy}
            onChange={(e) => setSignOffData({ ...signOffData, signOffBy: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Confirm with password"
            value={signOffData.password}
            onChange={(e) => setSignOffData({ ...signOffData, password: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <textarea
            placeholder="Sign-off remarks"
            value={signOffData.remarks}
            onChange={(e) => setSignOffData({ ...signOffData, remarks: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onSignOff(signOffData)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Sign Off</button>
        </div>
      </div>
    </div>
  );
}

export function UpdateStatusModal({ isOpen, onClose, onUpdate, inspection }: any) {
  const [status, setStatus] = useState(inspection?.overallStatus || 'Pending');
  if (!isOpen || !inspection) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Update Overall Status</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
            <option value="Pending">Pending</option>
            <option value="Passed">Passed</option>
            <option value="Conditional Pass">Conditional Pass</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onUpdate({ status })} className="px-4 py-2 bg-yellow-600 text-white rounded-lg">Update</button>
        </div>
      </div>
    </div>
  );
}

export function AssignInspectorModal({ isOpen, onClose, onAssign, inspection }: any) {
  const [inspector, setInspector] = useState({ name: '', id: '' });
  if (!isOpen || !inspection) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Assign Inspector</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <input type="text" placeholder="Inspector name" value={inspector.name} onChange={(e) => setInspector({ ...inspector, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          <input type="text" placeholder="Inspector ID" value={inspector.id} onChange={(e) => setInspector({ ...inspector, id: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onAssign(inspector)} className="px-4 py-2 bg-teal-600 text-white rounded-lg">Assign</button>
        </div>
      </div>
    </div>
  );
}

export function AddChecklistItemModal({ isOpen, onClose, onAdd, inspection }: any) {
  const [item, setItem] = useState({ checkPoint: '', criteria: '', result: 'Pending', remarks: '' });
  if (!isOpen || !inspection) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Add Checklist Item</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <input type="text" placeholder="Checkpoint description" value={item.checkPoint} onChange={(e) => setItem({ ...item, checkPoint: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          <input type="text" placeholder="Acceptance criteria" value={item.criteria} onChange={(e) => setItem({ ...item, criteria: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          <textarea placeholder="Remarks" value={item.remarks} onChange={(e) => setItem({ ...item, remarks: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onAdd(item)} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">Add Item</button>
        </div>
      </div>
    </div>
  );
}

export function GenerateReportModal({ isOpen, onClose, onGenerate, inspection }: any) {
  const [options, setOptions] = useState({ includePhotos: true, includeChecklist: true, format: 'pdf' });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Generate Report</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex items-center space-x-2">
            <input type="checkbox" checked={options.includePhotos} onChange={(e) => setOptions({ ...options, includePhotos: e.target.checked })} className="h-4 w-4" />
            <label className="text-sm">Include Photos</label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" checked={options.includeChecklist} onChange={(e) => setOptions({ ...options, includeChecklist: e.target.checked })} className="h-4 w-4" />
            <label className="text-sm">Include Detailed Checklist</label>
          </div>
          <select value={options.format} onChange={(e) => setOptions({ ...options, format: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
            <option value="pdf">PDF Document</option>
            <option value="excel">Excel Spreadsheet</option>
          </select>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onGenerate(options)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Generate</button>
        </div>
      </div>
    </div>
  );
}

export function ExportDataModal({ isOpen, onClose, onExport }: any) {
  const [format, setFormat] = useState('excel');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Export Inspection Data</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
            <option value="excel">Excel (.xlsx)</option>
            <option value="csv">CSV (.csv)</option>
            <option value="pdf">PDF Report</option>
          </select>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onExport({ format })} className="px-4 py-2 bg-amber-600 text-white rounded-lg">Export</button>
        </div>
      </div>
    </div>
  );
}

export function ScheduleReInspectionModal({ isOpen, onClose, onSchedule, inspection }: any) {
  const [date, setDate] = useState('');
  if (!isOpen || !inspection) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Schedule Re-Inspection</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-pink-50 p-4 rounded-lg">
            <p className="text-sm">Original: {inspection.inspectionNumber}</p>
            <p className="text-sm text-gray-600">Defects to verify: {inspection.defects}</p>
          </div>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onSchedule({ date })} className="px-4 py-2 bg-pink-600 text-white rounded-lg">Schedule</button>
        </div>
      </div>
    </div>
  );
}

export function ViewFullDetailsModal({ isOpen, onClose, inspection }: any) {
  if (!isOpen || !inspection) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{inspection.inspectionNumber}</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-green-50 p-3 rounded"><p className="text-xs text-gray-600">Passed</p><p className="text-2xl font-bold text-green-600">{inspection.passed}</p></div>
            <div className="bg-red-50 p-3 rounded"><p className="text-xs text-gray-600">Failed</p><p className="text-2xl font-bold text-red-600">{inspection.failed}</p></div>
            <div className="bg-blue-50 p-3 rounded"><p className="text-xs text-gray-600">Pending</p><p className="text-2xl font-bold text-blue-600">{inspection.pending}</p></div>
            <div className="bg-gray-50 p-3 rounded"><p className="text-xs text-gray-600">N/A</p><p className="text-2xl font-bold text-gray-600">{inspection.notApplicable}</p></div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Checklist Details</h3>
            {inspection.checklist?.map((item: any) => (
              <div key={item.id} className="border-b py-2 last:border-0">
                <p className="text-sm font-medium">{item.checkPoint}</p>
                <p className="text-xs text-gray-600">Result: <span className={`font-semibold ${item.result === 'Pass' ? 'text-green-600' : item.result === 'Fail' ? 'text-red-600' : 'text-gray-600'}`}>{item.result}</span> - {item.remarks}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-600 text-white rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
}

export function AddCorrectiveActionModal({ isOpen, onClose, onAdd, inspection }: any) {
  const [action, setAction] = useState({ description: '', responsibleParty: '', targetDate: '' });
  if (!isOpen || !inspection) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Add Corrective Action</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <textarea placeholder="Corrective action description" value={action.description} onChange={(e) => setAction({ ...action, description: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg" />
          <input type="text" placeholder="Responsible party" value={action.responsibleParty} onChange={(e) => setAction({ ...action, responsibleParty: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          <input type="date" value={action.targetDate} onChange={(e) => setAction({ ...action, targetDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onAdd(action)} className="px-4 py-2 bg-violet-600 text-white rounded-lg">Add Action</button>
        </div>
      </div>
    </div>
  );
}

export function ScheduleNextInspectionModal({ isOpen, onClose, onSchedule, inspection }: any) {
  const [nextDate, setNextDate] = useState('');
  if (!isOpen || !inspection) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Schedule Next Inspection</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">Current inspection: {inspection.inspectionNumber}</p>
          <input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onSchedule({ nextDate })} className="px-4 py-2 bg-rose-600 text-white rounded-lg">Schedule</button>
        </div>
      </div>
    </div>
  );
}
