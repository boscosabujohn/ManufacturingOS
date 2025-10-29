'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, X, Mail, Users, Activity, BarChart3, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'webinar' | 'content' | 'event';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  audience: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
  owner: string;
  description?: string;
  goals?: string[];
  channels?: string[];
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Product Launch',
    type: 'email',
    status: 'active',
    startDate: '2024-10-01',
    endDate: '2024-10-31',
    budget: 50000,
    spent: 32500,
    audience: 15000,
    sent: 12000,
    delivered: 11880,
    opened: 4752,
    clicked: 1426,
    converted: 85,
    revenue: 170000,
    owner: 'Sarah Johnson',
    description: 'Launch campaign for our new summer product line featuring email campaigns, social media promotion, and influencer partnerships.',
    goals: [
      'Generate 100+ qualified leads',
      'Achieve 40% email open rate',
      'Drive $150k in revenue',
      'Build brand awareness'
    ],
    channels: ['Email', 'Social Media', 'Blog', 'Paid Ads']
  },
  {
    id: '2',
    name: 'Customer Retention Program',
    type: 'email',
    status: 'active',
    startDate: '2024-09-15',
    budget: 30000,
    spent: 18750,
    audience: 8500,
    sent: 6800,
    delivered: 6732,
    opened: 2693,
    clicked: 943,
    converted: 47,
    revenue: 94000,
    owner: 'Michael Chen',
    description: 'Multi-touch email campaign targeting existing customers to increase retention and upsell premium features.',
    goals: [
      'Reduce churn by 15%',
      'Increase customer lifetime value',
      'Drive upgrade conversions',
      'Improve customer satisfaction'
    ],
    channels: ['Email', 'In-App Messages', 'Push Notifications']
  },
  {
    id: '3',
    name: 'Q4 Webinar Series',
    type: 'webinar',
    status: 'paused',
    startDate: '2024-10-10',
    budget: 15000,
    spent: 4500,
    audience: 5600,
    sent: 2800,
    delivered: 2758,
    opened: 828,
    clicked: 248,
    converted: 12,
    revenue: 24000,
    owner: 'Emily Rodriguez',
    description: 'Educational webinar series showcasing industry best practices and our platform capabilities.',
    goals: [
      'Host 4 webinars',
      'Achieve 200+ attendees per session',
      'Generate 50 SQLs',
      'Position as thought leader'
    ],
    channels: ['Email', 'LinkedIn', 'Website']
  }
];

export default function CampaignEditPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params?.id as string;

  // Find campaign by ID
  const existingCampaign = mockCampaigns.find(c => c.id === campaignId);

  const [formData, setFormData] = useState({
    name: existingCampaign?.name || '',
    type: existingCampaign?.type || 'email',
    status: existingCampaign?.status || 'draft',
    description: existingCampaign?.description || '',
    startDate: existingCampaign?.startDate || '',
    endDate: existingCampaign?.endDate || '',
    budget: existingCampaign?.budget || 0,
    audience: existingCampaign?.audience || 0,
    owner: existingCampaign?.owner || '',
    goals: existingCampaign?.goals || [''],
    channels: existingCampaign?.channels || ['']
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!existingCampaign) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Campaign Not Found</h2>
          <p className="text-gray-600 mb-4">The campaign you're trying to edit doesn't exist.</p>
          <Link href="/crm/campaigns" className="text-blue-600 hover:underline">
            Return to Campaigns
          </Link>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }

    if (!formData.type) {
      newErrors.type = 'Campaign type is required';
    }

    if (!formData.status) {
      newErrors.status = 'Campaign status is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (formData.budget <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    }

    if (formData.audience < 0) {
      newErrors.audience = 'Audience size cannot be negative';
    }

    if (!formData.owner.trim()) {
      newErrors.owner = 'Campaign owner is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // In a real app, this would update the campaign via API
      router.push(`/crm/campaigns/view/${campaignId}`);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const addGoal = () => {
    setFormData({
      ...formData,
      goals: [...formData.goals, '']
    });
  };

  const removeGoal = (index: number) => {
    setFormData({
      ...formData,
      goals: formData.goals.filter((_, i) => i !== index)
    });
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...formData.goals];
    newGoals[index] = value;
    setFormData({
      ...formData,
      goals: newGoals
    });
  };

  const addChannel = () => {
    setFormData({
      ...formData,
      channels: [...formData.channels, '']
    });
  };

  const removeChannel = (index: number) => {
    setFormData({
      ...formData,
      channels: formData.channels.filter((_, i) => i !== index)
    });
  };

  const updateChannel = (index: number, value: string) => {
    const newChannels = [...formData.channels];
    newChannels[index] = value;
    setFormData({
      ...formData,
      channels: newChannels
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-5 h-5" />;
      case 'social':
        return <Users className="w-5 h-5" />;
      case 'webinar':
        return <Activity className="w-5 h-5" />;
      case 'content':
        return <BarChart3 className="w-5 h-5" />;
      case 'event':
        return <Calendar className="w-5 h-5" />;
      default:
        return <Mail className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Campaign</h1>
            <p className="text-gray-600 mt-1">Update campaign details and settings</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

              <div className="space-y-4">
                {/* Campaign Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter campaign name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Campaign Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign Type *
                  </label>
                  <div className="relative">
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                        errors.type ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="email">Email Campaign</option>
                      <option value="social">Social Media</option>
                      <option value="webinar">Webinar</option>
                      <option value="content">Content Marketing</option>
                      <option value="event">Event</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      {getTypeIcon(formData.type)}
                    </div>
                  </div>
                  {errors.type && (
                    <p className="text-sm text-red-600 mt-1">{errors.type}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter campaign description"
                  />
                </div>
              </div>
            </div>

            {/* Campaign Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaign Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                  {errors.status && (
                    <p className="text-sm text-red-600 mt-1">{errors.status}</p>
                  )}
                </div>

                {/* Campaign Owner */}
                <div>
                  <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign Owner *
                  </label>
                  <input
                    type="text"
                    id="owner"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.owner ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter owner name"
                  />
                  {errors.owner && (
                    <p className="text-sm text-red-600 mt-1">{errors.owner}</p>
                  )}
                </div>

                {/* Start Date */}
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.startDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-600 mt-1">{errors.startDate}</p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Budget */}
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                    Budget ($) *
                  </label>
                  <input
                    type="number"
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.budget ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.budget && (
                    <p className="text-sm text-red-600 mt-1">{errors.budget}</p>
                  )}
                </div>

                {/* Target Audience */}
                <div>
                  <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-1">
                    Target Audience Size *
                  </label>
                  <input
                    type="number"
                    id="audience"
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: parseInt(e.target.value) || 0 })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.audience ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.audience && (
                    <p className="text-sm text-red-600 mt-1">{errors.audience}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Campaign Goals */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Campaign Goals</h2>
                <button
                  type="button"
                  onClick={addGoal}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Goal
                </button>
              </div>

              <div className="space-y-3">
                {formData.goals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => updateGoal(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter campaign goal"
                    />
                    {formData.goals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGoal(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Marketing Channels */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Marketing Channels</h2>
                <button
                  type="button"
                  onClick={addChannel}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Channel
                </button>
              </div>

              <div className="space-y-3">
                {formData.channels.map((channel, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={channel}
                      onChange={(e) => updateChannel(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter marketing channel"
                    />
                    {formData.channels.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeChannel(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Current Stats (Read-only) */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Performance</h2>
              <p className="text-sm text-gray-600 mb-4">These stats are read-only and reflect current campaign performance.</p>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Amount Spent</p>
                  <p className="text-xl font-bold text-blue-600">${existingCampaign.spent.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                  <p className="text-xl font-bold text-green-600">${existingCampaign.revenue.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Conversions</p>
                  <p className="text-xl font-bold text-gray-900">{existingCampaign.converted}</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Messages Sent</p>
                  <p className="text-lg font-semibold text-gray-900">{existingCampaign.sent.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Delivered</p>
                  <p className="text-lg font-semibold text-gray-900">{existingCampaign.delivered.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Opened</p>
                  <p className="text-lg font-semibold text-gray-900">{existingCampaign.opened.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Clicked</p>
                  <p className="text-lg font-semibold text-gray-900">{existingCampaign.clicked.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="space-y-3">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
