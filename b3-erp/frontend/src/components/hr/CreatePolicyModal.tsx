'use client';

import { useState } from 'react';
import { X, Save, Plus, Trash2, AlertCircle } from 'lucide-react';

interface CreatePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (policyData: {
    name: string;
    type: 'working_hours' | 'late_arrival' | 'early_departure' | 'grace_period' | 'half_day' | 'overtime';
    description: string;
    applicableTo: string;
    effectiveFrom: string;
    status: 'active' | 'inactive' | 'draft';
    rules: { key: string; value: string }[];
  }) => void;
}

export function CreatePolicyModal({ isOpen, onClose, onSubmit }: CreatePolicyModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: 'working_hours' as 'working_hours' | 'late_arrival' | 'early_departure' | 'grace_period' | 'half_day' | 'overtime',
    description: '',
    applicableTo: 'All Employees',
    effectiveFrom: new Date().toISOString().split('T')[0],
    status: 'draft' as 'active' | 'inactive' | 'draft'
  });

  const [rules, setRules] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' }
  ]);

  if (!isOpen) return null;

  const isStep1Valid = formData.name.trim() !== '' && formData.description.trim() !== '';
  const isStep2Valid = formData.applicableTo.trim() !== '' && formData.effectiveFrom !== '';
  const isStep3Valid = rules.every(rule => rule.key.trim() !== '' && rule.value.trim() !== '');

  const addRule = () => {
    setRules([...rules, { key: '', value: '' }]);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, field: 'key' | 'value', value: string) => {
    setRules(rules.map((rule, i) => i === index ? { ...rule, [field]: value } : rule));
  };

  const handleSubmit = () => {
    if (!isStep1Valid || !isStep2Valid || !isStep3Valid) return;

    onSubmit({
      ...formData,
      rules: rules.filter(rule => rule.key.trim() !== '' && rule.value.trim() !== '')
    });

    // Reset form
    setFormData({
      name: '',
      type: 'working_hours',
      description: '',
      applicableTo: 'All Employees',
      effectiveFrom: new Date().toISOString().split('T')[0],
      status: 'draft'
    });
    setRules([{ key: '', value: '' }]);
    setCurrentStep(1);
    onClose();
  };

  const policyTypes = [
    { value: 'working_hours', label: 'Working Hours', description: 'Define standard working hours and shift timings' },
    { value: 'late_arrival', label: 'Late Arrival', description: 'Rules and penalties for late arrivals' },
    { value: 'early_departure', label: 'Early Departure', description: 'Guidelines for early departure from work' },
    { value: 'grace_period', label: 'Grace Period', description: 'Daily grace period for attendance marking' },
    { value: 'half_day', label: 'Half Day', description: 'Criteria for marking half-day attendance' },
    { value: 'overtime', label: 'Overtime', description: 'Rules for overtime calculation and approval' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold">Create New Attendance Policy</h2>
            <p className="text-sm text-blue-100 mt-1">Step {currentStep} of 3</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            </div>
            <div className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                2
              </div>
              <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            </div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              3
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-3">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Policy Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Regular Working Hours Policy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Policy Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {policyTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFormData({ ...formData, type: type.value as any })}
                      className={`p-3 border-2 rounded-lg text-left transition-all ${
                        formData.type === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{type.label}</div>
                      <div className="text-xs text-gray-600 mt-1">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the policy..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Step 2: Applicability */}
          {currentStep === 2 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Applicability & Status</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applicable To <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.applicableTo}
                  onChange={(e) => setFormData({ ...formData, applicableTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All Employees">All Employees</option>
                  <option value="Production Staff">Production Staff</option>
                  <option value="Office Staff">Office Staff</option>
                  <option value="IT Department">IT Department</option>
                  <option value="Managers & Above">Managers & Above</option>
                  <option value="Contract Employees">Contract Employees</option>
                  <option value="Custom Group">Custom Group</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Select which employees this policy applies to</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Effective From <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.effectiveFrom}
                  onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Date from which this policy becomes active</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Policy Status
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, status: 'draft' })}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      formData.status === 'draft'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">Draft</div>
                    <div className="text-xs mt-1">Not yet active</div>
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, status: 'active' })}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      formData.status === 'active'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">Active</div>
                    <div className="text-xs mt-1">In effect now</div>
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, status: 'inactive' })}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      formData.status === 'inactive'
                        ? 'border-gray-500 bg-gray-50 text-gray-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">Inactive</div>
                    <div className="text-xs mt-1">Disabled</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Policy Rules */}
          {currentStep === 3 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Policy Rules</h3>
                <button
                  onClick={addRule}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Rule
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {rules.map((rule, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={rule.key}
                        onChange={(e) => updateRule(index, 'key', e.target.value)}
                        placeholder="Rule name (e.g., Start Time, Grace Period)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="text"
                        value={rule.value}
                        onChange={(e) => updateRule(index, 'value', e.target.value)}
                        placeholder="Rule value (e.g., 09:00 AM, 15 minutes)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    {rules.length > 1 && (
                      <button
                        onClick={() => removeRule(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors self-start"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Example Rules</p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li><strong>Working Hours:</strong> Start Time: 09:00 AM, End Time: 06:00 PM</li>
                      <li><strong>Late Arrival:</strong> Grace Period: 15 minutes, Penalty: Salary deduction</li>
                      <li><strong>Overtime:</strong> Minimum Duration: 1 hour, OT Rate: 1.5x hourly rate</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-3 py-2 flex justify-between gap-3 border-t border-gray-200 rounded-b-lg">
          <button
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                onClose();
              }
            }}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
          >
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </button>
          <button
            onClick={() => {
              if (currentStep < 3) {
                if (currentStep === 1 && isStep1Valid) {
                  setCurrentStep(2);
                } else if (currentStep === 2 && isStep2Valid) {
                  setCurrentStep(3);
                }
              } else {
                handleSubmit();
              }
            }}
            disabled={
              (currentStep === 1 && !isStep1Valid) ||
              (currentStep === 2 && !isStep2Valid) ||
              (currentStep === 3 && !isStep3Valid)
            }
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              ((currentStep === 1 && isStep1Valid) ||
               (currentStep === 2 && isStep2Valid) ||
               (currentStep === 3 && isStep3Valid))
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentStep === 3 ? (
              <>
                <Save className="w-4 h-4" />
                Create Policy
              </>
            ) : (
              'Next'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
