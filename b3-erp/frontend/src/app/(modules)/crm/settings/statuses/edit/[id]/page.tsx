'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Circle, CheckCircle, XCircle, Clock, AlertCircle, Pause } from 'lucide-react';

interface StatusFormData {
  name: string;
  description: string;
  category: 'opportunity' | 'lead' | 'customer' | 'contact' | 'ticket' | 'contract';
  color: string;
  type: 'open' | 'in_progress' | 'won' | 'lost' | 'on_hold' | 'custom';
  icon: 'circle' | 'check-circle' | 'x-circle' | 'clock' | 'alert-circle' | 'pause';
  isActive: boolean;
  isDefault: boolean;
}

const statusIcons = [
  { value: 'circle', label: 'Circle', icon: Circle },
  { value: 'check-circle', label: 'Check Circle', icon: CheckCircle },
  { value: 'x-circle', label: 'X Circle', icon: XCircle },
  { value: 'clock', label: 'Clock', icon: Clock },
  { value: 'alert-circle', label: 'Alert Circle', icon: AlertCircle },
  { value: 'pause', label: 'Pause', icon: Pause },
];

const predefinedColors = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Gray', value: '#6B7280' },
];

export default function EditStatusPage() {
  const router = useRouter();
  const params = useParams();
  const statusId = params.id as string;

  const [formData, setFormData] = useState<StatusFormData>({
    name: '',
    description: '',
    category: 'opportunity',
    color: '#3B82F6',
    type: 'open',
    icon: 'circle',
    isActive: true,
    isDefault: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // In a real app, fetch the status data by ID
    // For now, using mock data
    setFormData({
      name: 'Proposal Sent',
      description: 'Proposal has been sent to customer',
      category: 'opportunity',
      color: '#8B5CF6',
      type: 'in_progress',
      icon: 'clock',
      isActive: true,
      isDefault: false,
    });
  }, [statusId]);

  const handleChange = (field: keyof StatusFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Status name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // In a real app, send update request to API
    console.log('Updating status:', statusId, formData);
    router.push('/crm/settings/statuses');
  };

  const handleCancel = () => {
    router.push('/crm/settings/statuses');
  };

  const SelectedIcon = statusIcons.find(i => i.value === formData.icon)?.icon || Circle;

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Statuses
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Status</h1>
          <p className="text-gray-600 mt-2">Update the status configuration and settings</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 space-y-6">
            {/* Status Name & Category */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Proposal Sent"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value as StatusFormData['category'])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="opportunity">Opportunity</option>
                  <option value="lead">Lead</option>
                  <option value="customer">Customer</option>
                  <option value="contact">Contact</option>
                  <option value="ticket">Ticket</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe when this status should be used..."
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Type & Icon */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value as StatusFormData['type'])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                  <option value="on_hold">On Hold</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {statusIcons.map((iconOption) => {
                    const IconComponent = iconOption.icon;
                    return (
                      <button
                        key={iconOption.value}
                        type="button"
                        onClick={() => handleChange('icon', iconOption.value)}
                        className={`p-3 border rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
                          formData.icon === iconOption.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="text-xs">{iconOption.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="grid grid-cols-9 gap-2">
                  {predefinedColors.map((colorOption) => (
                    <button
                      key={colorOption.value}
                      type="button"
                      onClick={() => handleChange('color', colorOption.value)}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        formData.color === colorOption.value
                          ? 'ring-2 ring-blue-500 ring-offset-2'
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: colorOption.value }}
                      title={colorOption.name}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 font-mono">{formData.color}</span>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: formData.color + '20' }}
                  >
                    <SelectedIcon className="w-6 h-6" style={{ color: formData.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{formData.name || 'Status Name'}</h3>
                    <p className="text-sm text-gray-600">{formData.description || 'Status description...'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Active Status</span>
                  <p className="text-xs text-gray-500">This status will be available for use</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => handleChange('isDefault', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Default Status</span>
                  <p className="text-xs text-gray-500">New records will use this status by default</p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
