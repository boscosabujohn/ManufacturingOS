'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Camera, FileText, AlertTriangle, CheckCircle, MapPin, Ruler, Upload, Download, Eye } from 'lucide-react';

// ==================== 1. Schedule Survey Modal ====================
interface ScheduleSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (data: any) => void;
}

export function ScheduleSurveyModal({ isOpen, onClose, onSchedule }: ScheduleSurveyModalProps) {
  const [formData, setFormData] = useState({
    projectId: '',
    surveyDate: '',
    siteName: '',
    siteAddress: '',
    city: '',
    state: '',
    surveyorName: '',
    surveyorContact: '',
    floorLevel: '',
    accessibility: 'Good',
    remarks: '',
  });

  if (!isOpen) return null;

  const isValid = formData.projectId && formData.surveyDate && formData.siteName && formData.siteAddress && formData.surveyorName;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl  w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Schedule Site Survey</h2>
              <p className="text-blue-100 text-sm">Plan pre-installation site assessment</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Survey Date *</label>
              <input
                type="date"
                value={formData.surveyDate}
                onChange={(e) => setFormData({ ...formData, surveyDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name *</label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                placeholder="e.g., Main Kitchen Area"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Address *</label>
              <input
                type="text"
                value={formData.siteAddress}
                onChange={(e) => setFormData({ ...formData, siteAddress: e.target.value })}
                placeholder="Complete address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Surveyor Name *</label>
              <input
                type="text"
                value={formData.surveyorName}
                onChange={(e) => setFormData({ ...formData, surveyorName: e.target.value })}
                placeholder="Site engineer name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                type="tel"
                value={formData.surveyorContact}
                onChange={(e) => setFormData({ ...formData, surveyorContact: e.target.value })}
                placeholder="+91-XXXXXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Floor Level</label>
              <input
                type="text"
                value={formData.floorLevel}
                onChange={(e) => setFormData({ ...formData, floorLevel: e.target.value })}
                placeholder="e.g., Ground Floor, 2nd Floor"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Accessibility</label>
              <select
                value={formData.accessibility}
                onChange={(e) => setFormData({ ...formData, accessibility: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Good">Good</option>
                <option value="Moderate">Moderate</option>
                <option value="Difficult">Difficult</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                rows={3}
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Any special instructions or notes..."
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
            onClick={() => onSchedule(formData)}
            disabled={!isValid}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Schedule Survey
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 2. Edit Survey Modal ====================
interface EditSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (data: any) => void;
  survey: any;
}

export function EditSurveyModal({ isOpen, onClose, onEdit, survey }: EditSurveyModalProps) {
  const [formData, setFormData] = useState({
    surveyDate: survey?.surveyDate || '',
    siteName: survey?.siteName || '',
    siteAddress: survey?.siteAddress || '',
    city: survey?.city || '',
    state: survey?.state || '',
    surveyorName: survey?.surveyorName || '',
    surveyorContact: survey?.surveyorContact || '',
    floorLevel: survey?.floorLevel || '',
    accessibility: survey?.accessibility || 'Good',
  });

  useEffect(() => {
    if (survey) {
      setFormData({
        surveyDate: survey.surveyDate || '',
        siteName: survey.siteName || '',
        siteAddress: survey.siteAddress || '',
        city: survey.city || '',
        state: survey.state || '',
        surveyorName: survey.surveyorName || '',
        surveyorContact: survey.surveyorContact || '',
        floorLevel: survey.floorLevel || '',
        accessibility: survey.accessibility || 'Good',
      });
    }
  }, [survey]);

  if (!isOpen || !survey) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl  w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit Site Survey</h2>
              <p className="text-green-100 text-sm">{survey.surveyNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Survey Date</label>
              <input
                type="date"
                value={formData.surveyDate}
                onChange={(e) => setFormData({ ...formData, surveyDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Floor Level</label>
              <input
                type="text"
                value={formData.floorLevel}
                onChange={(e) => setFormData({ ...formData, floorLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Address</label>
              <input
                type="text"
                value={formData.siteAddress}
                onChange={(e) => setFormData({ ...formData, siteAddress: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Surveyor Name</label>
              <input
                type="text"
                value={formData.surveyorName}
                onChange={(e) => setFormData({ ...formData, surveyorName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                type="tel"
                value={formData.surveyorContact}
                onChange={(e) => setFormData({ ...formData, surveyorContact: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Accessibility</label>
              <select
                value={formData.accessibility}
                onChange={(e) => setFormData({ ...formData, accessibility: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="Good">Good</option>
                <option value="Moderate">Moderate</option>
                <option value="Difficult">Difficult</option>
              </select>
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

// ==================== 3. Update Measurements Modal ====================
interface UpdateMeasurementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  survey: any;
}

export function UpdateMeasurementsModal({ isOpen, onClose, onUpdate, survey }: UpdateMeasurementsModalProps) {
  const [formData, setFormData] = useState({
    length: survey?.measurements?.length?.toString() || '',
    width: survey?.measurements?.width?.toString() || '',
    height: survey?.measurements?.height?.toString() || '',
    ceilingType: survey?.ceilingType || '',
    wallCondition: survey?.wallCondition || '',
    ventilation: survey?.ventilation || '',
    naturalLight: survey?.naturalLight || '',
  });

  useEffect(() => {
    if (survey) {
      setFormData({
        length: survey.measurements?.length?.toString() || '',
        width: survey.measurements?.width?.toString() || '',
        height: survey.measurements?.height?.toString() || '',
        ceilingType: survey.ceilingType || '',
        wallCondition: survey.wallCondition || '',
        ventilation: survey.ventilation || '',
        naturalLight: survey.naturalLight || '',
      });
    }
  }, [survey]);

  if (!isOpen || !survey) return null;

  const calculateArea = () => {
    const area = parseFloat(formData.length) * parseFloat(formData.width);
    return isNaN(area) ? 0 : area.toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Ruler className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Update Measurements</h2>
              <p className="text-purple-100 text-sm">{survey.surveyNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-3">Site Dimensions</h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Length (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.length}
                  onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Width (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.width}
                  onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Calculated Area</p>
              <p className="text-2xl font-bold text-purple-600">{calculateArea()} m²</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ceiling Type</label>
            <input
              type="text"
              value={formData.ceilingType}
              onChange={(e) => setFormData({ ...formData, ceilingType: e.target.value })}
              placeholder="e.g., RCC Slab with false ceiling"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wall Condition</label>
            <input
              type="text"
              value={formData.wallCondition}
              onChange={(e) => setFormData({ ...formData, wallCondition: e.target.value })}
              placeholder="e.g., Good - Plastered and painted"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ventilation</label>
            <input
              type="text"
              value={formData.ventilation}
              onChange={(e) => setFormData({ ...formData, ventilation: e.target.value })}
              placeholder="Describe ventilation system"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Natural Light</label>
            <input
              type="text"
              value={formData.naturalLight}
              onChange={(e) => setFormData({ ...formData, naturalLight: e.target.value })}
              placeholder="Describe natural lighting"
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
            Update Measurements
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
  survey: any;
}

export function UploadPhotosModal({ isOpen, onClose, onUpload, survey }: UploadPhotosModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [category, setCategory] = useState('General');

  if (!isOpen || !survey) return null;

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
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Upload Site Photos</h2>
              <p className="text-orange-100 text-sm">{survey.surveyNumber} - Current: {survey.photosCount} photos</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="General">General Site View</option>
              <option value="Measurements">Measurements & Dimensions</option>
              <option value="Equipment">Existing Equipment</option>
              <option value="Infrastructure">Infrastructure (Power, Water, Drainage)</option>
              <option value="Obstacles">Obstacles & Challenges</option>
              <option value="Access">Access Points</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Camera className="w-12 h-12 text-gray-400 mb-2" />
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
              <ul className="space-y-1 text-sm text-gray-600 max-h-40 overflow-y-auto">
                {Array.from(selectedFiles).map((file, index) => (
                  <li key={index}>• {file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tips:</strong> Capture clear photos of site layout, measurements, existing conditions, utilities, and any obstacles or challenges.
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
            Upload Photos ({selectedFiles ? selectedFiles.length : 0})
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 5. Add Drawings Modal ====================
interface AddDrawingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (files: FileList) => void;
  survey: any;
}

export function AddDrawingsModal({ isOpen, onClose, onAdd, survey }: AddDrawingsModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [drawingType, setDrawingType] = useState('Floor Plan');

  if (!isOpen || !survey) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Site Drawings</h2>
              <p className="text-indigo-100 text-sm">{survey.surveyNumber} - Current: {survey.drawingsCount} drawings</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drawing Type</label>
            <select
              value={drawingType}
              onChange={(e) => setDrawingType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Floor Plan">Floor Plan</option>
              <option value="Elevation">Elevation Drawing</option>
              <option value="Electrical">Electrical Layout</option>
              <option value="Plumbing">Plumbing Layout</option>
              <option value="HVAC">HVAC Layout</option>
              <option value="Section">Section Drawing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Upload CAD files, PDFs, or images of site drawings
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg"
              onChange={handleFileSelect}
              className="hidden"
              id="drawing-upload"
            />
            <label
              htmlFor="drawing-upload"
              className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
            >
              Select Files
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Supported: PDF, DWG, DXF, PNG, JPG
            </p>
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
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={() => selectedFiles && onAdd(selectedFiles)}
            disabled={!selectedFiles}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload Drawings ({selectedFiles ? selectedFiles.length : 0})
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 6. Record Site Conditions Modal ====================
interface RecordSiteConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecord: (data: any) => void;
  survey: any;
}

export function RecordSiteConditionsModal({ isOpen, onClose, onRecord, survey }: RecordSiteConditionsModalProps) {
  const [formData, setFormData] = useState({
    powerAvailable: survey?.powerAvailable || false,
    waterAvailable: survey?.waterAvailable || false,
    drainageAvailable: survey?.drainageAvailable || false,
    existingEquipment: survey?.existingEquipment || '',
    obstacles: survey?.obstacles || '',
    specialRequirements: survey?.specialRequirements || '',
    estimatedBudget: survey?.estimatedBudget?.toString() || '',
  });

  useEffect(() => {
    if (survey) {
      setFormData({
        powerAvailable: survey.powerAvailable || false,
        waterAvailable: survey.waterAvailable || false,
        drainageAvailable: survey.drainageAvailable || false,
        existingEquipment: survey.existingEquipment || '',
        obstacles: survey.obstacles || '',
        specialRequirements: survey.specialRequirements || '',
        estimatedBudget: survey.estimatedBudget?.toString() || '',
      });
    }
  }, [survey]);

  if (!isOpen || !survey) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Record Site Conditions</h2>
              <p className="text-teal-100 text-sm">{survey.surveyNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Utility Availability</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.powerAvailable}
                  onChange={(e) => setFormData({ ...formData, powerAvailable: e.target.checked })}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-900">Power Available</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.waterAvailable}
                  onChange={(e) => setFormData({ ...formData, waterAvailable: e.target.checked })}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-900">Water Supply Available</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.drainageAvailable}
                  onChange={(e) => setFormData({ ...formData, drainageAvailable: e.target.checked })}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-900">Drainage System Available</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Existing Equipment</label>
            <textarea
              rows={2}
              value={formData.existingEquipment}
              onChange={(e) => setFormData({ ...formData, existingEquipment: e.target.value })}
              placeholder="Describe any existing equipment on site..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Obstacles & Challenges</label>
            <textarea
              rows={2}
              value={formData.obstacles}
              onChange={(e) => setFormData({ ...formData, obstacles: e.target.value })}
              placeholder="Describe any obstacles or challenges..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
            <textarea
              rows={3}
              value={formData.specialRequirements}
              onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
              placeholder="Any special requirements or considerations..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Budget (₹)</label>
            <input
              type="number"
              value={formData.estimatedBudget}
              onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
              placeholder="Enter estimated budget"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={() => onRecord(formData)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Save Conditions
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 7. Add Issues Modal ====================
interface AddIssuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (issue: string) => void;
  survey: any;
}

export function AddIssuesModal({ isOpen, onClose, onAdd, survey }: AddIssuesModalProps) {
  const [issue, setIssue] = useState('');
  const [severity, setSeverity] = useState('Medium');

  if (!isOpen || !survey) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Site Issue</h2>
              <p className="text-red-100 text-sm">{survey.surveyNumber} - Current issues: {survey.issues.length}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="Low">Low - Minor inconvenience</option>
              <option value="Medium">Medium - Moderate impact</option>
              <option value="High">High - Significant impact</option>
              <option value="Critical">Critical - Blocks progress</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Description</label>
            <textarea
              rows={4}
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>

          {survey.issues.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 mb-2">Existing Issues:</p>
              <ul className="space-y-1 text-sm text-gray-700">
                {survey.issues.map((iss: string, index: number) => (
                  <li key={index}>• {iss}</li>
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
            onClick={() => onAdd(issue)}
            disabled={!issue.trim()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Issue
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 8. Add Recommendations Modal ====================
interface AddRecommendationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (recommendation: string) => void;
  survey: any;
}

export function AddRecommendationsModal({ isOpen, onClose, onAdd, survey }: AddRecommendationsModalProps) {
  const [recommendation, setRecommendation] = useState('');
  const [category, setCategory] = useState('General');

  if (!isOpen || !survey) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Recommendation</h2>
              <p className="text-green-100 text-sm">{survey.surveyNumber} - Current: {survey.recommendations.length}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="General">General</option>
              <option value="Structural">Structural Changes</option>
              <option value="Electrical">Electrical Work</option>
              <option value="Plumbing">Plumbing</option>
              <option value="HVAC">HVAC</option>
              <option value="Safety">Safety Measures</option>
              <option value="Equipment">Equipment Selection</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recommendation</label>
            <textarea
              rows={4}
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              placeholder="Describe your recommendation..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {survey.recommendations.length > 0 && (
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 mb-2">Existing Recommendations:</p>
              <ul className="space-y-1 text-sm text-gray-700">
                {survey.recommendations.map((rec: string, index: number) => (
                  <li key={index}>• {rec}</li>
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
            onClick={() => onAdd(recommendation)}
            disabled={!recommendation.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Recommendation
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 9. Update Status Modal ====================
interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  survey: any;
}

export function UpdateStatusModal({ isOpen, onClose, onUpdate, survey }: UpdateStatusModalProps) {
  const [formData, setFormData] = useState({
    status: survey?.status || 'Scheduled',
    completionPercent: survey?.completionPercent?.toString() || '0',
    remarks: '',
  });

  useEffect(() => {
    if (survey) {
      setFormData({
        status: survey.status || 'Scheduled',
        completionPercent: survey.completionPercent?.toString() || '0',
        remarks: '',
      });
    }
  }, [survey]);

  if (!isOpen || !survey) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full">
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Update Survey Status</h2>
              <p className="text-yellow-100 text-sm">{survey.surveyNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Survey Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Completion: {formData.completionPercent}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.completionPercent}
              onChange={(e) => setFormData({ ...formData, completionPercent: e.target.value })}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Update Notes</label>
            <textarea
              rows={3}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Add any notes about this status update..."
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

// ==================== 10. Generate Report Modal ====================
interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: any) => void;
}

export function GenerateReportModal({ isOpen, onClose, onGenerate }: GenerateReportModalProps) {
  const [formData, setFormData] = useState({
    reportType: 'Full Survey',
    includeMeasurements: true,
    includePhotos: true,
    includeDrawings: true,
    includeIssues: true,
    includeRecommendations: true,
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
              <h2 className="text-xl font-bold text-white">Generate Survey Report</h2>
              <p className="text-emerald-100 text-sm">Create comprehensive survey documentation</p>
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
              <option value="Full Survey">Full Survey Report</option>
              <option value="Summary">Summary Report</option>
              <option value="Technical">Technical Details Only</option>
              <option value="Issues">Issues & Recommendations</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Include in Report:</label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.includeMeasurements}
                onChange={(e) => setFormData({ ...formData, includeMeasurements: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Site measurements and dimensions</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.includePhotos}
                onChange={(e) => setFormData({ ...formData, includePhotos: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Site photographs</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.includeDrawings}
                onChange={(e) => setFormData({ ...formData, includeDrawings: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Technical drawings</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.includeIssues}
                onChange={(e) => setFormData({ ...formData, includeIssues: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Identified issues</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.includeRecommendations}
                onChange={(e) => setFormData({ ...formData, includeRecommendations: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Recommendations</span>
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
              <option value="Word">Word Document</option>
              <option value="Excel">Excel Spreadsheet</option>
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

// ==================== 11. Export Data Modal ====================
interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: any) => void;
}

export function ExportDataModal({ isOpen, onClose, onExport }: ExportDataModalProps) {
  const [formData, setFormData] = useState({
    exportScope: 'All',
    format: 'Excel',
    includeCompleted: true,
    includeInProgress: true,
    includeScheduled: true,
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
              <h2 className="text-xl font-bold text-white">Export Survey Data</h2>
              <p className="text-amber-100 text-sm">Export surveys to file</p>
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
              value={formData.exportScope}
              onChange={(e) => setFormData({ ...formData, exportScope: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="All">All Surveys</option>
              <option value="Current">Current View (Filtered)</option>
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
                  checked={formData.includeScheduled}
                  onChange={(e) => setFormData({ ...formData, includeScheduled: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-700">Scheduled</span>
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

// ==================== 12. View Full Details Modal ====================
interface ViewFullDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  survey: any;
}

export function ViewFullDetailsModal({ isOpen, onClose, survey }: ViewFullDetailsModalProps) {
  if (!isOpen || !survey) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl  w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{survey.surveyNumber} - Survey Details</h2>
              <p className="text-slate-200 text-sm">{survey.projectName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Site Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Site Information</h3>
            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Site Name</p>
                <p className="font-medium text-gray-900">{survey.siteName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Full Address</p>
                <p className="font-medium text-gray-900">{survey.siteAddress}, {survey.city}, {survey.state}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Floor Level</p>
                <p className="font-medium text-gray-900">{survey.floorLevel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Accessibility</p>
                <p className="font-medium text-gray-900">{survey.accessibility}</p>
              </div>
            </div>
          </div>

          {/* Measurements */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Measurements</h3>
            <div className="grid grid-cols-4 gap-2 bg-blue-50 p-3 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Length</p>
                <p className="text-xl font-bold text-gray-900">{survey.measurements.length} m</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Width</p>
                <p className="text-xl font-bold text-gray-900">{survey.measurements.width} m</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Height</p>
                <p className="text-xl font-bold text-gray-900">{survey.measurements.height} m</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Area</p>
                <p className="text-xl font-bold text-blue-600">{survey.measurements.area} m²</p>
              </div>
            </div>
          </div>

          {/* Utilities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Utility Availability</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className={`p-4 rounded-lg ${survey.powerAvailable ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="text-sm text-gray-600">Power</p>
                <p className={`font-semibold ${survey.powerAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {survey.powerAvailable ? 'Available' : 'Not Available'}
                </p>
              </div>
              <div className={`p-4 rounded-lg ${survey.waterAvailable ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="text-sm text-gray-600">Water Supply</p>
                <p className={`font-semibold ${survey.waterAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {survey.waterAvailable ? 'Available' : 'Not Available'}
                </p>
              </div>
              <div className={`p-4 rounded-lg ${survey.drainageAvailable ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="text-sm text-gray-600">Drainage</p>
                <p className={`font-semibold ${survey.drainageAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {survey.drainageAvailable ? 'Available' : 'Not Available'}
                </p>
              </div>
            </div>
          </div>

          {/* Physical Conditions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Physical Conditions</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Ceiling Type</p>
                <p className="font-medium text-gray-900">{survey.ceilingType}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Wall Condition</p>
                <p className="font-medium text-gray-900">{survey.wallCondition}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Ventilation</p>
                <p className="font-medium text-gray-900">{survey.ventilation}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Natural Light</p>
                <p className="font-medium text-gray-900">{survey.naturalLight}</p>
              </div>
            </div>
          </div>

          {/* Existing Conditions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Existing Conditions</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Existing Equipment</p>
                <p className="text-gray-900">{survey.existingEquipment}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Obstacles</p>
                <p className="text-gray-900">{survey.obstacles}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Special Requirements</p>
                <p className="text-gray-900">{survey.specialRequirements}</p>
              </div>
            </div>
          </div>

          {/* Issues & Recommendations */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span>Issues Identified</span>
              </h3>
              <ul className="space-y-2">
                {survey.issues.map((issue: string, index: number) => (
                  <li key={index} className="bg-yellow-50 p-3 rounded-lg text-sm text-gray-900">
                    {index + 1}. {issue}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Recommendations</span>
              </h3>
              <ul className="space-y-2">
                {survey.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="bg-green-50 p-3 rounded-lg text-sm text-gray-900">
                    {index + 1}. {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Documentation */}
          <div className="grid grid-cols-3 gap-2 bg-purple-50 p-3 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Photos</p>
              <p className="text-2xl font-bold text-purple-600">{survey.photosCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Drawings</p>
              <p className="text-2xl font-bold text-purple-600">{survey.drawingsCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated Budget</p>
              <p className="text-2xl font-bold text-purple-600">₹{(survey.estimatedBudget / 100000).toFixed(2)}L</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-3 bg-gray-50">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </button>
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
