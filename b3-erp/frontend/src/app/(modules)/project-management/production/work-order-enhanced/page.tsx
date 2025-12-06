'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Factory,
  Wrench,
  Package,
  Clock,
  Users,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Save,
  X,
  Plus,
  Trash2,
  AlertTriangle,
  Cog,
} from 'lucide-react';
import { StepIndicator } from '@/components/ui/StepIndicator';
import {
  useAutoSaveDraft,
  AutoSaveIndicator,
  DraftRecoveryBanner,
  useUnsavedChangesWarning,
  HelpIcon,
  FormProgressIndicator,
} from '@/components/ui/FormUX';

// Field help
const FIELD_HELP = {
  priority: {
    title: 'Production Priority',
    content: 'Urgent: Start immediately. High: Schedule within 24 hours. Normal: Standard queue. Low: Can be delayed.',
  },
  workCenter: {
    title: 'Work Center',
    content: 'Primary production area for this work order. Operations will be scheduled on this work center.',
  },
  operations: {
    title: 'Operations Sequence',
    content: 'Define the sequence of manufacturing operations. Each operation can be assigned to different work centers.',
  },
};

// Types
interface Operation {
  id: string;
  sequence: number;
  name: string;
  workCenter: string;
  setupTime: number;
  runTime: number;
  status: 'pending' | 'in-progress' | 'completed';
}

interface Material {
  id: string;
  itemCode: string;
  description: string;
  quantity: number;
  unit: string;
  available: number;
  reserved: number;
}

interface FormData {
  // Basic Info
  project: string;
  projectName: string;
  woNumber: string;
  productCode: string;
  productName: string;
  quantity: number;
  unit: string;
  // Schedule
  plannedStart: string;
  plannedEnd: string;
  priority: string;
  workCenter: string;
  // Operations
  operations: Operation[];
  // Materials
  materials: Material[];
  // Notes
  instructions: string;
  qualityNotes: string;
}

const STEPS = [
  { id: 'product', label: 'Product', description: 'Select product', icon: Package },
  { id: 'schedule', label: 'Schedule', description: 'Plan dates', icon: Clock },
  { id: 'operations', label: 'Operations', description: 'Define steps', icon: Cog },
  { id: 'materials', label: 'Materials', description: 'Allocate items', icon: Wrench },
  { id: 'review', label: 'Review', description: 'Confirm order', icon: CheckCircle },
];

const defaultOperations: Operation[] = [
  { id: '1', sequence: 10, name: 'Laser Cutting', workCenter: 'Laser-01', setupTime: 30, runTime: 120, status: 'pending' },
  { id: '2', sequence: 20, name: 'Bending', workCenter: 'Bend-01', setupTime: 15, runTime: 90, status: 'pending' },
  { id: '3', sequence: 30, name: 'Welding', workCenter: 'Weld-01', setupTime: 20, runTime: 180, status: 'pending' },
  { id: '4', sequence: 40, name: 'Buffing/Finishing', workCenter: 'Buff-01', setupTime: 10, runTime: 60, status: 'pending' },
];

const defaultMaterials: Material[] = [
  { id: '1', itemCode: 'SS304-2MM', description: 'Stainless Steel 304 Sheet 2mm', quantity: 10, unit: 'sheets', available: 25, reserved: 5 },
  { id: '2', itemCode: 'WELD-ROD', description: 'Welding Rod SS 308L', quantity: 5, unit: 'kg', available: 20, reserved: 8 },
];

const initialFormData: FormData = {
  project: '',
  projectName: '',
  woNumber: `WO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
  productCode: '',
  productName: '',
  quantity: 1,
  unit: 'pcs',
  plannedStart: '',
  plannedEnd: '',
  priority: 'Normal',
  workCenter: '',
  operations: defaultOperations,
  materials: defaultMaterials,
  instructions: '',
  qualityNotes: '',
};

export default function ProductionWorkOrderEnhancedPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-save
  const { lastSaved, isSaving, hasDraft, clearDraft, restoreDraft } = useAutoSaveDraft(
    formData,
    { key: 'production-work-order-form', debounceMs: 3000 }
  );

  const hasUnsavedChanges = formData.project !== '' || formData.productName !== '';
  useUnsavedChangesWarning(hasUnsavedChanges && !isSubmitting);

  const handleRestoreDraft = () => {
    const draft = restoreDraft();
    if (draft) setFormData(draft as FormData);
  };

  const formFields = useMemo(() => [
    { name: 'project', required: true },
    { name: 'productName', required: true },
    { name: 'plannedStart', required: true },
    { name: 'plannedEnd', required: true },
    { name: 'workCenter', required: true },
  ], []);

  // Calculate totals
  const totals = useMemo(() => {
    const totalSetup = formData.operations.reduce((sum, op) => sum + op.setupTime, 0);
    const totalRun = formData.operations.reduce((sum, op) => sum + op.runTime, 0);
    return {
      operationCount: formData.operations.length,
      totalSetupTime: totalSetup,
      totalRunTime: totalRun,
      totalTime: totalSetup + totalRun,
      materialCount: formData.materials.length,
    };
  }, [formData.operations, formData.materials]);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Operations
  const addOperation = () => {
    const maxSeq = Math.max(...formData.operations.map(o => o.sequence), 0);
    const newOp: Operation = {
      id: Date.now().toString(),
      sequence: maxSeq + 10,
      name: '',
      workCenter: '',
      setupTime: 0,
      runTime: 0,
      status: 'pending',
    };
    setFormData(prev => ({ ...prev, operations: [...prev.operations, newOp] }));
  };

  const updateOperation = (id: string, field: keyof Operation, value: any) => {
    setFormData(prev => ({
      ...prev,
      operations: prev.operations.map(op => op.id === id ? { ...op, [field]: value } : op),
    }));
  };

  const removeOperation = (id: string) => {
    setFormData(prev => ({ ...prev, operations: prev.operations.filter(op => op.id !== id) }));
  };

  // Materials
  const addMaterial = () => {
    const newMat: Material = {
      id: Date.now().toString(),
      itemCode: '',
      description: '',
      quantity: 0,
      unit: 'pcs',
      available: 0,
      reserved: 0,
    };
    setFormData(prev => ({ ...prev, materials: [...prev.materials, newMat] }));
  };

  const updateMaterial = (id: string, field: keyof Material, value: any) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.map(m => m.id === id ? { ...m, [field]: value } : m),
    }));
  };

  const removeMaterial = (id: string) => {
    setFormData(prev => ({ ...prev, materials: prev.materials.filter(m => m.id !== id) }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    switch (step) {
      case 0:
        if (!formData.project) newErrors.project = 'Select a project';
        if (!formData.productName) newErrors.productName = 'Enter product name';
        if (formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
        break;
      case 1:
        if (!formData.plannedStart) newErrors.plannedStart = 'Start date is required';
        if (!formData.plannedEnd) newErrors.plannedEnd = 'End date is required';
        if (!formData.workCenter) newErrors.workCenter = 'Work center is required';
        break;
      case 2:
        if (formData.operations.length === 0) newErrors.operations = 'At least one operation required';
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const goToPrevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Work Order Created:', formData);
      clearDraft();
      router.push('/project-management/production/laser-cutting');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Product Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.project}
                  onChange={(e) => {
                    const names: Record<string, string> = {
                      'PRJ-001': 'Taj Hotels - Commercial Kitchen',
                      'PRJ-002': 'BigBasket - Cold Room',
                    };
                    updateFormData('project', e.target.value);
                    updateFormData('projectName', names[e.target.value] || '');
                  }}
                  className={`w-full px-4 py-2 border rounded-lg ${errors.project ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select project</option>
                  <option value="PRJ-001">PRJ-001 - Taj Hotels - Commercial Kitchen</option>
                  <option value="PRJ-002">PRJ-002 - BigBasket - Cold Room</option>
                </select>
                {errors.project && <p className="mt-1 text-sm text-red-500">{errors.project}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Order Number</label>
                <input
                  type="text"
                  value={formData.woNumber}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Code
                </label>
                <input
                  type="text"
                  value={formData.productCode}
                  onChange={(e) => updateFormData('productCode', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., COOK-RANGE-6B"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => updateFormData('productName', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg ${errors.productName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., 6-Burner Gas Cooking Range"
                />
                {errors.productName && <p className="mt-1 text-sm text-red-500">{errors.productName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => updateFormData('quantity', parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-2 border rounded-lg ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                  min="1"
                />
                {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => updateFormData('unit', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="pcs">Pieces</option>
                  <option value="sets">Sets</option>
                  <option value="units">Units</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Schedule & Priority</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planned Start <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.plannedStart}
                  onChange={(e) => updateFormData('plannedStart', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg ${errors.plannedStart ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.plannedStart && <p className="mt-1 text-sm text-red-500">{errors.plannedStart}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planned End <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.plannedEnd}
                  onChange={(e) => updateFormData('plannedEnd', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg ${errors.plannedEnd ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.plannedEnd && <p className="mt-1 text-sm text-red-500">{errors.plannedEnd}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  Priority
                  <HelpIcon content={FIELD_HELP.priority.content} title={FIELD_HELP.priority.title} />
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => updateFormData('priority', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Normal">Normal</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  Work Center <span className="text-red-500">*</span>
                  <HelpIcon content={FIELD_HELP.workCenter.content} title={FIELD_HELP.workCenter.title} />
                </label>
                <select
                  value={formData.workCenter}
                  onChange={(e) => updateFormData('workCenter', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg ${errors.workCenter ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select work center</option>
                  <option value="Laser-01">Laser Cutting - Line 1</option>
                  <option value="Laser-02">Laser Cutting - Line 2</option>
                  <option value="Fab-01">Fabrication - Bay 1</option>
                  <option value="Assembly-01">Assembly Line 1</option>
                </select>
                {errors.workCenter && <p className="mt-1 text-sm text-red-500">{errors.workCenter}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cog className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Operations Sequence</h2>
                <HelpIcon content={FIELD_HELP.operations.content} title={FIELD_HELP.operations.title} />
              </div>
              <button
                type="button"
                onClick={addOperation}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Operation
              </button>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between text-sm">
                <span>Total Operations: <strong>{totals.operationCount}</strong></span>
                <span>Setup Time: <strong>{formatTime(totals.totalSetupTime)}</strong></span>
                <span>Run Time: <strong>{formatTime(totals.totalRunTime)}</strong></span>
                <span>Total Time: <strong className="text-blue-600">{formatTime(totals.totalTime)}</strong></span>
              </div>
            </div>

            <div className="space-y-3">
              {formData.operations.map((op) => (
                <div key={op.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
                  <div className="w-16">
                    <label className="block text-xs text-gray-500 mb-1">Seq</label>
                    <input
                      type="number"
                      value={op.sequence}
                      onChange={(e) => updateOperation(op.id, 'sequence', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Operation Name</label>
                    <input
                      type="text"
                      value={op.name}
                      onChange={(e) => updateOperation(op.id, 'name', e.target.value)}
                      className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                      placeholder="e.g., Laser Cutting"
                    />
                  </div>
                  <div className="w-36">
                    <label className="block text-xs text-gray-500 mb-1">Work Center</label>
                    <select
                      value={op.workCenter}
                      onChange={(e) => updateOperation(op.id, 'workCenter', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="">Select</option>
                      <option value="Laser-01">Laser-01</option>
                      <option value="Bend-01">Bend-01</option>
                      <option value="Weld-01">Weld-01</option>
                      <option value="Buff-01">Buff-01</option>
                    </select>
                  </div>
                  <div className="w-20">
                    <label className="block text-xs text-gray-500 mb-1">Setup (min)</label>
                    <input
                      type="number"
                      value={op.setupTime}
                      onChange={(e) => updateOperation(op.id, 'setupTime', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs text-gray-500 mb-1">Run (min)</label>
                    <input
                      type="number"
                      value={op.runTime}
                      onChange={(e) => updateOperation(op.id, 'runTime', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOperation(op.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {errors.operations && <p className="text-sm text-red-500">{errors.operations}</p>}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Material Requirements</h2>
              </div>
              <button
                type="button"
                onClick={addMaterial}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Material
              </button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Item Code</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Description</th>
                    <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">Required</th>
                    <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">Available</th>
                    <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formData.materials.map((mat) => {
                    const shortfall = mat.quantity > mat.available - mat.reserved;
                    return (
                      <tr key={mat.id} className={shortfall ? 'bg-red-50' : ''}>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={mat.itemCode}
                            onChange={(e) => updateMaterial(mat.id, 'itemCode', e.target.value)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={mat.description}
                            onChange={(e) => updateMaterial(mat.id, 'description', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <input
                            type="number"
                            value={mat.quantity}
                            onChange={(e) => updateMaterial(mat.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                          />
                        </td>
                        <td className="px-4 py-2 text-center text-sm text-gray-600">
                          {mat.available} ({mat.reserved} reserved)
                        </td>
                        <td className="px-4 py-2 text-center">
                          {shortfall ? (
                            <span className="flex items-center justify-center gap-1 text-red-600 text-xs">
                              <AlertTriangle className="w-3 h-3" /> Shortfall
                            </span>
                          ) : (
                            <span className="text-green-600 text-xs">Available</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button onClick={() => removeMaterial(mat.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Production Instructions</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => updateFormData('instructions', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Special instructions for production..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quality Notes</label>
                <textarea
                  value={formData.qualityNotes}
                  onChange={(e) => updateFormData('qualityNotes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Quality requirements and checkpoints..."
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Review Work Order</h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Product</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">WO Number:</span>
                    <p className="font-medium text-gray-900">{formData.woNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Product:</span>
                    <p className="font-medium text-gray-900">{formData.productName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Quantity:</span>
                    <p className="font-medium text-gray-900">{formData.quantity} {formData.unit}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Schedule</h3>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Start:</span>
                    <p className="font-medium text-gray-900">{formData.plannedStart}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">End:</span>
                    <p className="font-medium text-gray-900">{formData.plannedEnd}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Priority:</span>
                    <p className={`font-medium ${formData.priority === 'Urgent' ? 'text-red-600' : 'text-gray-900'}`}>
                      {formData.priority}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Work Center:</span>
                    <p className="font-medium text-gray-900">{formData.workCenter}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Summary</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-2xl font-bold text-gray-900">{totals.operationCount}</p>
                    <p className="text-sm text-gray-500">Operations</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-2xl font-bold text-gray-900">{totals.materialCount}</p>
                    <p className="text-sm text-gray-500">Materials</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-lg font-bold text-gray-900">{formatTime(totals.totalSetupTime)}</p>
                    <p className="text-sm text-gray-500">Setup Time</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-lg font-bold text-blue-600">{formatTime(totals.totalTime)}</p>
                    <p className="text-sm text-blue-700">Total Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Create Production Work Order</h1>
              <p className="text-sm text-gray-600 mt-1">Phase 5: Production</p>
            </div>
            <div className="flex items-center gap-4">
              <AutoSaveIndicator lastSaved={lastSaved} isSaving={isSaving} />
              <FormProgressIndicator fields={formFields} values={formData} variant="circular" size="md" />
            </div>
          </div>
          {hasDraft && currentStep === 0 && (
            <DraftRecoveryBanner hasDraft={hasDraft} onRestore={handleRestoreDraft} onDiscard={clearDraft} />
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <StepIndicator steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} variant="default" />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {renderStepContent()}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <button onClick={() => router.push('/project-management/production')} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" /> Cancel
            </button>
            <div className="flex items-center gap-3">
              <button onClick={goToPrevStep} disabled={currentStep === 0} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentStep === 0 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}>
                <ArrowLeft className="w-5 h-5" /> Previous
              </button>
              {currentStep < STEPS.length - 1 ? (
                <button onClick={goToNextStep} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Next <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                  {isSubmitting ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating...</> : <><Save className="w-5 h-5" /> Create Work Order</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
