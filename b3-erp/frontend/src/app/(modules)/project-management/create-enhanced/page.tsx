'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  User,
  Calendar,
  Users,
  Package,
  FileText,
  Save,
  X,
  Plus,
  Trash2,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
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

// Field help content
const FIELD_HELP = {
  projectName: {
    title: 'Project Name',
    content: 'Enter a unique, descriptive name that identifies this project. Include client name and project type for easy recognition.',
  },
  projectType: {
    title: 'Project Type',
    content: 'Select the primary category of this project. This determines the default workflow phases and resource requirements.',
  },
  salesOrderNumber: {
    title: 'Sales Order Number',
    content: 'Reference to the approved sales order. This links the project to financial and customer information.',
  },
  priority: {
    title: 'Priority Level',
    content: 'P1-Critical: Immediate attention required. P2-High: Important timeline. P3-Medium: Standard delivery. P4-Low: Flexible timeline.',
  },
  estimatedBudget: {
    title: 'Estimated Budget',
    content: 'Internal cost estimate including materials, labor, and overhead. Used for profit margin calculations.',
  },
  contractValue: {
    title: 'Contract Value',
    content: 'Agreed value with the customer. The difference between contract value and budget represents projected profit.',
  },
  teamAllocation: {
    title: 'Team Allocation %',
    content: 'Percentage of working hours this team member will dedicate to the project. 100% = Full-time.',
  },
};

// Types
interface TeamMember {
  id: string;
  role: string;
  name: string;
  allocation: number;
}

interface Deliverable {
  id: string;
  name: string;
  type: string;
  plannedDate: string;
}

interface FormData {
  // Basic Information
  projectName: string;
  projectType: string;
  salesOrderNumber: string;
  customerId: string;
  customerName: string;
  location: string;
  description: string;
  // Timeline & Budget
  startDate: string;
  endDate: string;
  estimatedBudget: string;
  contractValue: string;
  currency: string;
  // Project Management
  projectManager: string;
  priority: string;
  department: string;
  // Team & Deliverables
  teamMembers: TeamMember[];
  deliverables: Deliverable[];
  // Scope
  scope: string;
  specialRequirements: string;
  safetyRequirements: string;
}

const STEPS = [
  { id: 'basic', label: 'Basic Info', description: 'Project details', icon: Building2 },
  { id: 'timeline', label: 'Timeline & Budget', description: 'Schedule and costs', icon: Calendar },
  { id: 'team', label: 'Team', description: 'Assign team members', icon: Users },
  { id: 'deliverables', label: 'Deliverables', description: 'Key milestones', icon: Package },
  { id: 'scope', label: 'Scope', description: 'Requirements', icon: FileText },
  { id: 'review', label: 'Review', description: 'Confirm and create', icon: CheckCircle },
];

const initialFormData: FormData = {
  projectName: '',
  projectType: 'Commercial Kitchen',
  salesOrderNumber: '',
  customerId: '',
  customerName: '',
  location: '',
  description: '',
  startDate: '',
  endDate: '',
  estimatedBudget: '',
  contractValue: '',
  currency: 'INR',
  projectManager: '',
  priority: 'P2',
  department: 'Project Management',
  teamMembers: [{ id: '1', role: 'Project Manager', name: '', allocation: 100 }],
  deliverables: [{ id: '1', name: '', type: 'Equipment', plannedDate: '' }],
  scope: '',
  specialRequirements: '',
  safetyRequirements: '',
};

export default function CreateProjectEnhancedPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);

  // Auto-save draft
  const { lastSaved, isSaving, hasDraft, clearDraft, restoreDraft } = useAutoSaveDraft(
    formData,
    {
      key: 'project-create-form',
      debounceMs: 3000,
    }
  );

  // Unsaved changes warning
  const hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData);
  useUnsavedChangesWarning(hasUnsavedChanges && !isSubmitting);

  // Handle draft restoration
  const handleRestoreDraft = () => {
    const draft = restoreDraft();
    if (draft) {
      setFormData(draft as FormData);
      setDraftRestored(true);
    }
  };

  // Form field definitions for progress indicator
  const formFields = useMemo(() => [
    { name: 'projectName', required: true },
    { name: 'projectType', required: true },
    { name: 'salesOrderNumber', required: true },
    { name: 'customerName', required: true },
    { name: 'location', required: true },
    { name: 'startDate', required: true },
    { name: 'endDate', required: true },
    { name: 'estimatedBudget', required: true },
    { name: 'contractValue', required: true },
    { name: 'projectManager', required: true },
  ], []);

  // Calculate project duration
  const duration = useMemo(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? `${diff} days` : 'Invalid';
    }
    return '';
  }, [formData.startDate, formData.endDate]);

  // Calculate profit margin
  const profitMargin = useMemo(() => {
    const budget = parseFloat(formData.estimatedBudget) || 0;
    const contract = parseFloat(formData.contractValue) || 0;
    if (contract > 0 && budget > 0) {
      const profit = contract - budget;
      const percentage = ((profit / contract) * 100).toFixed(2);
      return { profit, percentage };
    }
    return null;
  }, [formData.estimatedBudget, formData.contractValue]);

  // Currency formatter
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Update form data
  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Team member functions
  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        { id: Date.now().toString(), role: '', name: '', allocation: 100 },
      ],
    }));
  };

  const removeTeamMember = (id: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(m => m.id !== id),
    }));
  };

  const updateTeamMember = (id: string, field: keyof TeamMember, value: any) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(m =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    }));
  };

  // Deliverable functions
  const addDeliverable = () => {
    setFormData(prev => ({
      ...prev,
      deliverables: [
        ...prev.deliverables,
        { id: Date.now().toString(), name: '', type: 'Equipment', plannedDate: '' },
      ],
    }));
  };

  const removeDeliverable = (id: string) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter(d => d.id !== id),
    }));
  };

  const updateDeliverable = (id: string, field: keyof Deliverable, value: any) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.map(d =>
        d.id === id ? { ...d, [field]: value } : d
      ),
    }));
  };

  // Step validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Basic Info
        if (!formData.projectName.trim()) newErrors.projectName = 'Project name is required';
        if (!formData.salesOrderNumber.trim()) newErrors.salesOrderNumber = 'Sales order number is required';
        if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        break;
      case 1: // Timeline & Budget
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (!formData.estimatedBudget) newErrors.estimatedBudget = 'Budget is required';
        if (!formData.contractValue) newErrors.contractValue = 'Contract value is required';
        if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
          newErrors.endDate = 'End date must be after start date';
        }
        break;
      case 2: // Team
        if (!formData.projectManager) newErrors.projectManager = 'Project manager is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const goToPrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  // Submit
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Project created:', formData);
      clearDraft();
      router.push('/project-management');
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  Project Name <span className="text-red-500">*</span>
                  <HelpIcon content={FIELD_HELP.projectName.content} title={FIELD_HELP.projectName.title} />
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => updateFormData('projectName', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.projectName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Taj Hotel Commercial Kitchen Installation"
                />
                {errors.projectName && <p className="mt-1 text-sm text-red-500">{errors.projectName}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  Project Type <span className="text-red-500">*</span>
                  <HelpIcon content={FIELD_HELP.projectType.content} title={FIELD_HELP.projectType.title} />
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => updateFormData('projectType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Commercial Kitchen">Commercial Kitchen</option>
                  <option value="Cold Room">Cold Room</option>
                  <option value="Switchgear">Switchgear</option>
                  <option value="HVAC System">HVAC System</option>
                  <option value="Modular Kitchen">Modular Kitchen</option>
                  <option value="Food Processing">Food Processing</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  Sales Order Number <span className="text-red-500">*</span>
                  <HelpIcon content={FIELD_HELP.salesOrderNumber.content} title={FIELD_HELP.salesOrderNumber.title} />
                </label>
                <input
                  type="text"
                  value={formData.salesOrderNumber}
                  onChange={(e) => updateFormData('salesOrderNumber', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.salesOrderNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="SO-2024-XXX"
                />
                {errors.salesOrderNumber && <p className="mt-1 text-sm text-red-500">{errors.salesOrderNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer ID</label>
                <input
                  type="text"
                  value={formData.customerId}
                  onChange={(e) => updateFormData('customerId', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="CUST-XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => updateFormData('customerName', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Taj Hotels Limited"
                />
                {errors.customerName && <p className="mt-1 text-sm text-red-500">{errors.customerName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Mumbai, Maharashtra"
                />
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the project scope and objectives..."
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Timeline & Budget</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateFormData('startDate', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => updateFormData('endDate', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
              </div>

              {duration && (
                <div className="md:col-span-2">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Project Duration:</span> {duration}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  Estimated Budget <span className="text-red-500">*</span>
                  <HelpIcon content={FIELD_HELP.estimatedBudget.content} title={FIELD_HELP.estimatedBudget.title} />
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={formData.estimatedBudget}
                    onChange={(e) => updateFormData('estimatedBudget', e.target.value)}
                    className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.estimatedBudget ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                </div>
                {errors.estimatedBudget && <p className="mt-1 text-sm text-red-500">{errors.estimatedBudget}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  Contract Value <span className="text-red-500">*</span>
                  <HelpIcon content={FIELD_HELP.contractValue.content} title={FIELD_HELP.contractValue.title} />
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={formData.contractValue}
                    onChange={(e) => updateFormData('contractValue', e.target.value)}
                    className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.contractValue ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                </div>
                {errors.contractValue && <p className="mt-1 text-sm text-red-500">{errors.contractValue}</p>}
              </div>

              {profitMargin && (
                <div className="md:col-span-2">
                  <div className={`rounded-lg p-4 ${profitMargin.profit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                    <p className={`text-sm ${profitMargin.profit >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                      <span className="font-semibold">Estimated Profit Margin:</span>{' '}
                      {profitMargin.percentage}% ({formatCurrency(profitMargin.profit)})
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Project Team</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Manager <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.projectManager}
                  onChange={(e) => updateFormData('projectManager', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.projectManager ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Manager</option>
                  <option value="Rajesh Kumar">Rajesh Kumar</option>
                  <option value="Priya Sharma">Priya Sharma</option>
                  <option value="Amit Patel">Amit Patel</option>
                  <option value="Sunita Reddy">Sunita Reddy</option>
                </select>
                {errors.projectManager && <p className="mt-1 text-sm text-red-500">{errors.projectManager}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  Priority
                  <HelpIcon content={FIELD_HELP.priority.content} title={FIELD_HELP.priority.title} />
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => updateFormData('priority', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="P1">P1 - Critical</option>
                  <option value="P2">P2 - High</option>
                  <option value="P3">P3 - Medium</option>
                  <option value="P4">P4 - Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => updateFormData('department', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Project Management">Project Management</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Operations">Operations</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  <Plus className="w-4 h-4" />
                  Add Member
                </button>
              </div>

              <div className="space-y-3">
                {formData.teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="e.g., Site Supervisor"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Employee name"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
                          Allocation (%)
                          <HelpIcon content={FIELD_HELP.teamAllocation.content} size="sm" />
                        </label>
                        <input
                          type="number"
                          value={member.allocation}
                          onChange={(e) => updateTeamMember(member.id, 'allocation', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                    {formData.teamMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTeamMember(member.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Key Deliverables</h2>
              </div>
              <button
                type="button"
                onClick={addDeliverable}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                <Plus className="w-4 h-4" />
                Add Deliverable
              </button>
            </div>

            <div className="space-y-3">
              {formData.deliverables.map((deliverable) => (
                <div key={deliverable.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Deliverable Name</label>
                      <input
                        type="text"
                        value={deliverable.name}
                        onChange={(e) => updateDeliverable(deliverable.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="e.g., Equipment Installation"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={deliverable.type}
                        onChange={(e) => updateDeliverable(deliverable.id, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="Equipment">Equipment</option>
                        <option value="Installation">Installation</option>
                        <option value="Documentation">Documentation</option>
                        <option value="Training">Training</option>
                        <option value="Service">Service</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Planned Date</label>
                      <input
                        type="date"
                        value={deliverable.plannedDate}
                        onChange={(e) => updateDeliverable(deliverable.id, 'plannedDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  {formData.deliverables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDeliverable(deliverable.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Scope & Requirements</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Scope</label>
                <textarea
                  value={formData.scope}
                  onChange={(e) => updateFormData('scope', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Define the project scope, inclusions, and exclusions..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
                <textarea
                  value={formData.specialRequirements}
                  onChange={(e) => updateFormData('specialRequirements', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any special client requirements, certifications needed, etc..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Safety Requirements</label>
                <textarea
                  value={formData.safetyRequirements}
                  onChange={(e) => updateFormData('safetyRequirements', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Safety protocols, PPE requirements, site restrictions..."
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Review & Create Project</h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              {/* Basic Info Summary */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Project Name:</span>
                    <p className="font-medium text-gray-900">{formData.projectName || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Project Type:</span>
                    <p className="font-medium text-gray-900">{formData.projectType}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Customer:</span>
                    <p className="font-medium text-gray-900">{formData.customerName || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <p className="font-medium text-gray-900">{formData.location || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Timeline & Budget Summary */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Timeline & Budget</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <p className="font-medium text-gray-900">
                      {formData.startDate} to {formData.endDate} ({duration})
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Budget:</span>
                    <p className="font-medium text-gray-900">
                      {formData.estimatedBudget ? formatCurrency(parseFloat(formData.estimatedBudget)) : '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Contract Value:</span>
                    <p className="font-medium text-gray-900">
                      {formData.contractValue ? formatCurrency(parseFloat(formData.contractValue)) : '-'}
                    </p>
                  </div>
                  {profitMargin && (
                    <div>
                      <span className="text-gray-500">Profit Margin:</span>
                      <p className={`font-medium ${profitMargin.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profitMargin.percentage}%
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Team Summary */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Team</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Project Manager:</span>
                    <p className="font-medium text-gray-900">{formData.projectManager || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Priority:</span>
                    <p className="font-medium text-gray-900">{formData.priority}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Team Members:</span>
                    <p className="font-medium text-gray-900">
                      {formData.teamMembers.filter(m => m.name).map(m => m.name).join(', ') || 'No members assigned'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Deliverables Summary */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Deliverables</h3>
                {formData.deliverables.filter(d => d.name).length > 0 ? (
                  <ul className="space-y-2">
                    {formData.deliverables.filter(d => d.name).map((d) => (
                      <li key={d.id} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-900">{d.name}</span>
                        <span className="text-gray-500">({d.type})</span>
                        {d.plannedDate && <span className="text-gray-400">- {d.plannedDate}</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No deliverables defined</p>
                )}
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
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
              <p className="text-sm text-gray-600 mt-1">Phase 1: Project Initiation</p>
            </div>
            <div className="flex items-center gap-4">
              <AutoSaveIndicator lastSaved={lastSaved} isSaving={isSaving} />
              <FormProgressIndicator
                fields={formFields}
                values={formData}
                variant="circular"
                size="md"
              />
            </div>
          </div>

          {/* Draft Recovery Banner */}
          {hasDraft && !draftRestored && (
            <DraftRecoveryBanner
              hasDraft={hasDraft}
              onRestore={handleRestoreDraft}
              onDiscard={clearDraft}
            />
          )}
        </div>

        {/* Step Indicator */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <StepIndicator
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
            variant="default"
          />
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push('/project-management')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goToPrevStep}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  currentStep === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>

              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Create Project
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
