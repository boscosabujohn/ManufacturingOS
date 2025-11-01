'use client';

import React, { useState } from 'react';
import { X, Save, Plus, Trash2, CheckCircle, AlertTriangle, FileText, Calendar, Clipboard } from 'lucide-react';

export interface QualityPlan {
  id: string;
  planNumber: string;
  planName: string;
  productCode: string;
  productName: string;
  category: string;
  version: string;
  qualityStandard: string;
  testingFrequency: string;
  samplingSize: number;
  inspectionPoints: InspectionPoint[];
  acceptanceCriteria: string[];
  status: 'draft' | 'under_review' | 'approved' | 'active' | 'inactive';
  createdDate: string;
  effectiveDate?: string;
  approvedBy?: string;
  approvedDate?: string;
}

export interface InspectionPoint {
  id: string;
  stage: string;
  parameter: string;
  specification: string;
  measuringTool: string;
  tolerance: string;
  critical: boolean;
}

interface CreateQualityPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<QualityPlan>, saveType: 'draft' | 'review') => void;
}

interface EditQualityPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<QualityPlan>, saveType: 'draft' | 'review' | 'activate') => void;
  plan: QualityPlan | null;
}

interface ApproveQualityPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (decision: 'approve' | 'reject' | 'request_changes', comments: string, effectiveDate?: string, signature?: string) => void;
  plan: QualityPlan | null;
}

// Create Quality Plan Modal
export const CreateQualityPlanModal: React.FC<CreateQualityPlanModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    planName: '',
    productCode: '',
    productName: '',
    category: 'Raw Materials',
    version: '1.0',
    qualityStandard: 'ISO 9001',
    testingFrequency: '',
    samplingSize: 10,
  });

  const [inspectionPoints, setInspectionPoints] = useState<InspectionPoint[]>([
    {
      id: `IP-${Date.now()}`,
      stage: '',
      parameter: '',
      specification: '',
      measuringTool: '',
      tolerance: '',
      critical: false,
    },
  ]);

  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>(['']);

  const handleAddInspectionPoint = () => {
    setInspectionPoints([
      ...inspectionPoints,
      {
        id: `IP-${Date.now()}`,
        stage: '',
        parameter: '',
        specification: '',
        measuringTool: '',
        tolerance: '',
        critical: false,
      },
    ]);
  };

  const handleRemoveInspectionPoint = (index: number) => {
    if (inspectionPoints.length > 1) {
      setInspectionPoints(inspectionPoints.filter((_, i) => i !== index));
    }
  };

  const handleInspectionPointChange = (index: number, field: keyof InspectionPoint, value: string | boolean) => {
    const updated = [...inspectionPoints];
    (updated[index] as any)[field] = value;
    setInspectionPoints(updated);
  };

  const handleAddCriteria = () => {
    setAcceptanceCriteria([...acceptanceCriteria, '']);
  };

  const handleRemoveCriteria = (index: number) => {
    if (acceptanceCriteria.length > 1) {
      setAcceptanceCriteria(acceptanceCriteria.filter((_, i) => i !== index));
    }
  };

  const handleCriteriaChange = (index: number, value: string) => {
    const updated = [...acceptanceCriteria];
    updated[index] = value;
    setAcceptanceCriteria(updated);
  };

  const handleSubmit = (saveType: 'draft' | 'review') => {
    const planData: Partial<QualityPlan> = {
      planNumber: `QP-${Date.now()}`,
      ...formData,
      inspectionPoints,
      acceptanceCriteria: acceptanceCriteria.filter(c => c.trim() !== ''),
      status: saveType === 'draft' ? 'draft' : 'under_review',
      createdDate: new Date().toISOString().split('T')[0],
    };
    onSave(planData, saveType);
    onClose();
  };

  if (!isOpen) return null;

  const categories = [
    'Raw Materials',
    'Components',
    'Sub-Assemblies',
    'Final Products',
    'Packaging',
    'Finished Goods',
  ];

  const qualityStandards = [
    'ISO 9001',
    'NSF/ANSI',
    'AS9100',
    'ISO 13485',
    'IATF 16949',
    'ISO 17025',
    'GMP',
    'FDA 21 CFR Part 11',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Create New Quality Plan</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Number (Auto-generated)</label>
                <input
                  type="text"
                  value={`QP-${Date.now()}`}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
                <input
                  type="text"
                  value={formData.planName}
                  onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Premium Kitchen Cabinet Quality Plan"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Code *</label>
                <input
                  type="text"
                  value={formData.productCode}
                  onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="PROD-001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Premium Modular Kitchen Cabinet"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="1.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quality Standard *</label>
                <select
                  value={formData.qualityStandard}
                  onChange={(e) => setFormData({ ...formData, qualityStandard: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  {qualityStandards.map((std) => (
                    <option key={std} value={std}>{std}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Testing Frequency *</label>
                <input
                  type="text"
                  value={formData.testingFrequency}
                  onChange={(e) => setFormData({ ...formData, testingFrequency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Every Batch / Daily / Weekly"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sampling Size *</label>
                <input
                  type="number"
                  value={formData.samplingSize}
                  onChange={(e) => setFormData({ ...formData, samplingSize: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="10"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Inspection Points Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Inspection Points</h3>
              <button
                type="button"
                onClick={handleAddInspectionPoint}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Inspection Point</span>
              </button>
            </div>

            <div className="space-y-4">
              {inspectionPoints.map((point, index) => (
                <div key={point.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">Inspection Point {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveInspectionPoint(index)}
                      disabled={inspectionPoints.length === 1}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Stage</label>
                      <input
                        type="text"
                        value={point.stage}
                        onChange={(e) => handleInspectionPointChange(index, 'stage', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        placeholder="Incoming / In-Process / Final"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Parameter</label>
                      <input
                        type="text"
                        value={point.parameter}
                        onChange={(e) => handleInspectionPointChange(index, 'parameter', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        placeholder="Dimension / Weight / Color"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Specification</label>
                      <input
                        type="text"
                        value={point.specification}
                        onChange={(e) => handleInspectionPointChange(index, 'specification', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        placeholder="600mm x 400mm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Measuring Tool</label>
                      <input
                        type="text"
                        value={point.measuringTool}
                        onChange={(e) => handleInspectionPointChange(index, 'measuringTool', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        placeholder="Vernier Caliper / Scale"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Tolerance</label>
                      <input
                        type="text"
                        value={point.tolerance}
                        onChange={(e) => handleInspectionPointChange(index, 'tolerance', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        placeholder="±2mm"
                      />
                    </div>

                    <div className="flex items-end">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={point.critical}
                          onChange={(e) => handleInspectionPointChange(index, 'critical', e.target.checked)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Critical Point</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acceptance Criteria Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Acceptance Criteria</h3>
              <button
                type="button"
                onClick={handleAddCriteria}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Criteria</span>
              </button>
            </div>

            <div className="space-y-3">
              {acceptanceCriteria.map((criteria, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="flex-1">
                    <textarea
                      value={criteria}
                      onChange={(e) => handleCriteriaChange(index, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      rows={2}
                      placeholder="Enter acceptance criterion (e.g., All dimensions must be within ±2mm tolerance)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCriteria(index)}
                    disabled={acceptanceCriteria.length === 1}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save as Draft</span>
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('review')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Submit for Review</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit Quality Plan Modal
export const EditQualityPlanModal: React.FC<EditQualityPlanModalProps> = ({ isOpen, onClose, onSave, plan }) => {
  const [formData, setFormData] = useState({
    planName: plan?.planName || '',
    productCode: plan?.productCode || '',
    productName: plan?.productName || '',
    category: plan?.category || 'Raw Materials',
    version: plan?.version || '1.0',
    qualityStandard: plan?.qualityStandard || 'ISO 9001',
    testingFrequency: plan?.testingFrequency || '',
    samplingSize: plan?.samplingSize || 10,
  });

  const [inspectionPoints, setInspectionPoints] = useState<InspectionPoint[]>(
    plan?.inspectionPoints || [
      {
        id: `IP-${Date.now()}`,
        stage: '',
        parameter: '',
        specification: '',
        measuringTool: '',
        tolerance: '',
        critical: false,
      },
    ]
  );

  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>(
    plan?.acceptanceCriteria && plan.acceptanceCriteria.length > 0 ? plan.acceptanceCriteria : ['']
  );

  const [changeNote, setChangeNote] = useState('');
  const [createNewVersion, setCreateNewVersion] = useState(false);

  React.useEffect(() => {
    if (plan) {
      setFormData({
        planName: plan.planName,
        productCode: plan.productCode,
        productName: plan.productName,
        category: plan.category,
        version: plan.version,
        qualityStandard: plan.qualityStandard,
        testingFrequency: plan.testingFrequency,
        samplingSize: plan.samplingSize,
      });
      setInspectionPoints(plan.inspectionPoints);
      setAcceptanceCriteria(plan.acceptanceCriteria && plan.acceptanceCriteria.length > 0 ? plan.acceptanceCriteria : ['']);
    }
  }, [plan]);

  const handleAddInspectionPoint = () => {
    setInspectionPoints([
      ...inspectionPoints,
      {
        id: `IP-${Date.now()}`,
        stage: '',
        parameter: '',
        specification: '',
        measuringTool: '',
        tolerance: '',
        critical: false,
      },
    ]);
  };

  const handleRemoveInspectionPoint = (index: number) => {
    if (inspectionPoints.length > 1) {
      setInspectionPoints(inspectionPoints.filter((_, i) => i !== index));
    }
  };

  const handleInspectionPointChange = (index: number, field: keyof InspectionPoint, value: string | boolean) => {
    const updated = [...inspectionPoints];
    (updated[index] as any)[field] = value;
    setInspectionPoints(updated);
  };

  const handleAddCriteria = () => {
    setAcceptanceCriteria([...acceptanceCriteria, '']);
  };

  const handleRemoveCriteria = (index: number) => {
    if (acceptanceCriteria.length > 1) {
      setAcceptanceCriteria(acceptanceCriteria.filter((_, i) => i !== index));
    }
  };

  const handleCriteriaChange = (index: number, value: string) => {
    const updated = [...acceptanceCriteria];
    updated[index] = value;
    setAcceptanceCriteria(updated);
  };

  const handleSubmit = (saveType: 'draft' | 'review' | 'activate') => {
    const newVersion = createNewVersion
      ? `${parseFloat(formData.version) + 0.1}`.slice(0, 3)
      : formData.version;

    const planData: Partial<QualityPlan> = {
      ...formData,
      version: newVersion,
      inspectionPoints,
      acceptanceCriteria: acceptanceCriteria.filter(c => c.trim() !== ''),
      status: saveType === 'draft' ? 'draft' : saveType === 'review' ? 'under_review' : 'active',
    };
    onSave(planData, saveType);
    onClose();
  };

  if (!isOpen || !plan) return null;

  const categories = [
    'Raw Materials',
    'Components',
    'Sub-Assemblies',
    'Final Products',
    'Packaging',
    'Finished Goods',
  ];

  const qualityStandards = [
    'ISO 9001',
    'NSF/ANSI',
    'AS9100',
    'ISO 13485',
    'IATF 16949',
    'ISO 17025',
    'GMP',
    'FDA 21 CFR Part 11',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Edit Quality Plan</h2>
            <p className="text-sm opacity-90">{plan.planNumber} - Current Version: {plan.version}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Version Control */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-3">Version Control</h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={createNewVersion}
                  onChange={(e) => setCreateNewVersion(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-blue-900">
                  Create New Version (Current: {plan.version} → New: {createNewVersion ? `${parseFloat(formData.version) + 0.1}`.slice(0, 3) : formData.version})
                </span>
              </label>
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Number</label>
                <input
                  type="text"
                  value={plan.planNumber}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
                <input
                  type="text"
                  value={formData.planName}
                  onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Premium Kitchen Cabinet Quality Plan"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Code *</label>
                <input
                  type="text"
                  value={formData.productCode}
                  onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="PROD-001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Premium Modular Kitchen Cabinet"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                <input
                  type="text"
                  value={createNewVersion ? `${parseFloat(formData.version) + 0.1}`.slice(0, 3) : formData.version}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quality Standard *</label>
                <select
                  value={formData.qualityStandard}
                  onChange={(e) => setFormData({ ...formData, qualityStandard: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {qualityStandards.map((std) => (
                    <option key={std} value={std}>{std}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Testing Frequency *</label>
                <input
                  type="text"
                  value={formData.testingFrequency}
                  onChange={(e) => setFormData({ ...formData, testingFrequency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Every Batch / Daily / Weekly"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sampling Size *</label>
                <input
                  type="number"
                  value={formData.samplingSize}
                  onChange={(e) => setFormData({ ...formData, samplingSize: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Inspection Points Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Inspection Points</h3>
              <button
                type="button"
                onClick={handleAddInspectionPoint}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Inspection Point</span>
              </button>
            </div>

            <div className="space-y-4">
              {inspectionPoints.map((point, index) => (
                <div key={point.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">Inspection Point {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveInspectionPoint(index)}
                      disabled={inspectionPoints.length === 1}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Stage</label>
                      <input
                        type="text"
                        value={point.stage}
                        onChange={(e) => handleInspectionPointChange(index, 'stage', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Incoming / In-Process / Final"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Parameter</label>
                      <input
                        type="text"
                        value={point.parameter}
                        onChange={(e) => handleInspectionPointChange(index, 'parameter', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Dimension / Weight / Color"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Specification</label>
                      <input
                        type="text"
                        value={point.specification}
                        onChange={(e) => handleInspectionPointChange(index, 'specification', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="600mm x 400mm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Measuring Tool</label>
                      <input
                        type="text"
                        value={point.measuringTool}
                        onChange={(e) => handleInspectionPointChange(index, 'measuringTool', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Vernier Caliper / Scale"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Tolerance</label>
                      <input
                        type="text"
                        value={point.tolerance}
                        onChange={(e) => handleInspectionPointChange(index, 'tolerance', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="±2mm"
                      />
                    </div>

                    <div className="flex items-end">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={point.critical}
                          onChange={(e) => handleInspectionPointChange(index, 'critical', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Critical Point</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acceptance Criteria Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Acceptance Criteria</h3>
              <button
                type="button"
                onClick={handleAddCriteria}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Criteria</span>
              </button>
            </div>

            <div className="space-y-3">
              {acceptanceCriteria.map((criteria, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="flex-1">
                    <textarea
                      value={criteria}
                      onChange={(e) => handleCriteriaChange(index, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      rows={2}
                      placeholder="Enter acceptance criterion (e.g., All dimensions must be within ±2mm tolerance)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCriteria(index)}
                    disabled={acceptanceCriteria.length === 1}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Change History Note */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change History Note</h3>
            <textarea
              value={changeNote}
              onChange={(e) => setChangeNote(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe the reason for this update..."
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save as Draft</span>
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('review')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Submit for Review</span>
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('activate')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Activate Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Approve Quality Plan Modal
export const ApproveQualityPlanModal: React.FC<ApproveQualityPlanModalProps> = ({ isOpen, onClose, onApprove, plan }) => {
  const [decision, setDecision] = useState<'approve' | 'reject' | 'request_changes'>('approve');
  const [comments, setComments] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [signature, setSignature] = useState('');

  const handleSubmit = () => {
    onApprove(decision, comments, decision === 'approve' ? effectiveDate : undefined, decision === 'approve' ? signature : undefined);
    onClose();
  };

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Approve Quality Plan</h2>
            <p className="text-sm opacity-90">{plan.planNumber} - {plan.planName}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Plan Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Summary (Read-Only)</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-600">Plan Number</p>
                  <p className="text-sm font-semibold text-gray-900">{plan.planNumber}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Version</p>
                  <p className="text-sm font-semibold text-gray-900">{plan.version}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Product Code</p>
                  <p className="text-sm font-semibold text-gray-900">{plan.productCode}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Product Name</p>
                  <p className="text-sm font-semibold text-gray-900">{plan.productName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Category</p>
                  <p className="text-sm font-semibold text-gray-900">{plan.category}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Quality Standard</p>
                  <p className="text-sm font-semibold text-gray-900">{plan.qualityStandard}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Testing Frequency</p>
                  <p className="text-sm font-semibold text-gray-900">{plan.testingFrequency}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Sampling Size</p>
                  <p className="text-sm font-semibold text-gray-900">{plan.samplingSize}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-300">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs font-medium text-blue-600">Inspection Points</p>
                  <p className="text-2xl font-bold text-blue-900">{plan.inspectionPoints.length}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-xs font-medium text-green-600">Acceptance Criteria</p>
                  <p className="text-2xl font-bold text-green-900">{plan.acceptanceCriteria.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Approval Decision */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Decision *</h3>
            <div className="space-y-2">
              <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors border-gray-300 has-[:checked]:border-green-500 has-[:checked]:bg-green-50">
                <input
                  type="radio"
                  name="decision"
                  value="approve"
                  checked={decision === 'approve'}
                  onChange={(e) => setDecision(e.target.value as 'approve')}
                  className="text-green-600 focus:ring-green-500"
                />
                <div className="ml-3">
                  <p className="font-semibold text-gray-900 flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Approve</span>
                  </p>
                  <p className="text-sm text-gray-600">Approve and activate this quality plan</p>
                </div>
              </label>

              <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors border-gray-300 has-[:checked]:border-red-500 has-[:checked]:bg-red-50">
                <input
                  type="radio"
                  name="decision"
                  value="reject"
                  checked={decision === 'reject'}
                  onChange={(e) => setDecision(e.target.value as 'reject')}
                  className="text-red-600 focus:ring-red-500"
                />
                <div className="ml-3">
                  <p className="font-semibold text-gray-900 flex items-center space-x-2">
                    <X className="h-5 w-5 text-red-600" />
                    <span>Reject</span>
                  </p>
                  <p className="text-sm text-gray-600">Reject this quality plan</p>
                </div>
              </label>

              <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors border-gray-300 has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50">
                <input
                  type="radio"
                  name="decision"
                  value="request_changes"
                  checked={decision === 'request_changes'}
                  onChange={(e) => setDecision(e.target.value as 'request_changes')}
                  className="text-orange-600 focus:ring-orange-500"
                />
                <div className="ml-3">
                  <p className="font-semibold text-gray-900 flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span>Request Changes</span>
                  </p>
                  <p className="text-sm text-gray-600">Request modifications before approval</p>
                </div>
              </label>
            </div>
          </div>

          {/* Approver Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Approver Comments *</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={4}
              placeholder="Provide feedback, comments, or required changes..."
              required
            />
          </div>

          {/* Effective Date (only shown if approved) */}
          {decision === 'approve' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date *</label>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Approval Signature *</label>
                <div className="flex items-center space-x-2">
                  <Clipboard className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Type your full name as digital signature"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">By typing your name, you digitally sign this approval</p>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!comments.trim() || (decision === 'approve' && (!signature.trim() || !effectiveDate))}
              className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                decision === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : decision === 'reject'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {decision === 'approve' ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Approve Plan</span>
                </>
              ) : decision === 'reject' ? (
                <>
                  <X className="h-4 w-4" />
                  <span>Reject Plan</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  <span>Request Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
