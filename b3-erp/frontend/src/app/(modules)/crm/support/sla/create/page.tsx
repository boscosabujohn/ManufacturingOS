'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle, Plus, X, Clock, Target } from 'lucide-react';

export default function CreateSLAPolicyPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'medium' as 'critical' | 'high' | 'medium' | 'low',
    category: 'all' as 'technical' | 'billing' | 'general' | 'all',
    firstResponseTime: '',
    resolutionTime: '',
    businessHoursOnly: false,
    isActive: true,
  });

  const [appliesTo, setAppliesTo] = useState<string[]>(['']);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.firstResponseTime) newErrors.firstResponseTime = 'First response time is required';
    if (!formData.resolutionTime) newErrors.resolutionTime = 'Resolution time is required';
    if (appliesTo.filter(a => a.trim()).length === 0) newErrors.appliesTo = 'At least one application is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    router.push('/crm/support/sla');
  };

  const addAppliesTo = () => {
    setAppliesTo([...appliesTo, '']);
  };

  const removeAppliesTo = (index: number) => {
    if (appliesTo.length > 1) {
      setAppliesTo(appliesTo.filter((_, i) => i !== index));
    }
  };

  const updateAppliesTo = (index: number, value: string) => {
    const newAppliesTo = [...appliesTo];
    newAppliesTo[index] = value;
    setAppliesTo(newAppliesTo);
  };

  const formatTime = (minutes: string) => {
    if (!minutes) return '-';
    const num = parseInt(minutes);
    if (num < 60) return `${num}m`;
    const hours = Math.floor(num / 60);
    const mins = num % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to SLA Management
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create SLA Policy</h1>
          <p className="text-gray-600 mt-2">Define service level agreement targets and response times</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Policy Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Critical Issues - Enterprise"
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Describe when this SLA policy applies and its purpose"
                    />
                    {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority Level *
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Categories</option>
                        <option value="technical">Technical</option>
                        <option value="billing">Billing</option>
                        <option value="general">General</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* SLA Targets */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">SLA Targets</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Response Time (minutes) *
                      </label>
                      <input
                        type="number"
                        value={formData.firstResponseTime}
                        onChange={(e) => setFormData({ ...formData, firstResponseTime: e.target.value })}
                        min="1"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.firstResponseTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="15"
                      />
                      {errors.firstResponseTime && <p className="text-red-600 text-sm mt-1">{errors.firstResponseTime}</p>}
                      <p className="text-xs text-gray-500 mt-1">Time to first customer response</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resolution Time (hours) *
                      </label>
                      <input
                        type="number"
                        value={formData.resolutionTime}
                        onChange={(e) => setFormData({ ...formData, resolutionTime: e.target.value })}
                        min="1"
                        step="0.5"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.resolutionTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="4"
                      />
                      {errors.resolutionTime && <p className="text-red-600 text-sm mt-1">{errors.resolutionTime}</p>}
                      <p className="text-xs text-gray-500 mt-1">Time to issue resolution</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.businessHoursOnly}
                        onChange={(e) => setFormData({ ...formData, businessHoursOnly: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-blue-900">Business Hours Only</span>
                        <p className="text-xs text-blue-700">Calculate SLA times only during business hours (9 AM - 5 PM, Mon-Fri)</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Applies To */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Applies To *</h2>
                  <button
                    type="button"
                    onClick={addAppliesTo}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Application
                  </button>
                </div>
                <div className="space-y-3">
                  {appliesTo.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateAppliesTo(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Enterprise Plan, Premium Support"
                      />
                      {appliesTo.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAppliesTo(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {errors.appliesTo && <p className="text-red-600 text-sm mt-2">{errors.appliesTo}</p>}
                <p className="text-xs text-gray-500 mt-2">Specify customer tiers, plans, or segments this SLA applies to</p>
              </div>

              {/* Status */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Policy Status</h2>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Active Policy</span>
                    <p className="text-xs text-gray-500">Policy will be enforced immediately when active</p>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Create SLA Policy
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">SLA Best Practices</h3>
                    <ul className="text-sm text-blue-700 space-y-2">
                      <li>• Set realistic targets you can meet</li>
                      <li>• Critical issues need fastest response</li>
                      <li>• Monitor compliance regularly</li>
                      <li>• Consider business hours for non-critical</li>
                      <li>• Align with customer expectations</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Policy Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Summary</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Priority</div>
                    <div className="text-gray-900 capitalize font-medium">
                      {formData.priority}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">Category</div>
                    <div className="text-gray-900 capitalize">
                      {formData.category === 'all' ? 'All Categories' : formData.category}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">First Response</div>
                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(formData.firstResponseTime)}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">Resolution Time</div>
                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                      <Target className="w-4 h-4" />
                      <span>{formData.resolutionTime ? `${formData.resolutionTime}h` : '-'}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">Coverage</div>
                    <div className="text-gray-900">
                      {formData.businessHoursOnly ? 'Business Hours Only' : '24/7'}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">Status</div>
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                      formData.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Response Time Guide */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Guide</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium text-red-700">Critical</div>
                    <div className="text-gray-600">15-30 min response, 2-4h resolution</div>
                  </div>
                  <div>
                    <div className="font-medium text-orange-700">High</div>
                    <div className="text-gray-600">1h response, 4-8h resolution</div>
                  </div>
                  <div>
                    <div className="font-medium text-yellow-700">Medium</div>
                    <div className="text-gray-600">2-4h response, 24h resolution</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Low</div>
                    <div className="text-gray-600">4-8h response, 48-72h resolution</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
