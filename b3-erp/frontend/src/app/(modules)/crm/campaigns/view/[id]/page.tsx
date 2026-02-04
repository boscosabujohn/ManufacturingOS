'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Mail, Users, TrendingUp, Target, Calendar, DollarSign, BarChart3, Play, Pause, CheckCircle, ExternalLink, Clock, Activity } from 'lucide-react';
import Link from 'next/link';
import { ConfirmDialog } from '@/components/ui';

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

export default function CampaignViewPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params?.id as string;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Find campaign by ID
  const campaign = mockCampaigns.find(c => c.id === campaignId);

  if (!campaign) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Campaign Not Found</h2>
          <p className="text-gray-600 mb-2">The campaign you're looking for doesn't exist.</p>
          <Link href="/crm/campaigns" className="text-blue-600 hover:underline">
            Return to Campaigns
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'draft':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'bg-orange-100 text-orange-700';
      case 'social':
        return 'bg-blue-100 text-blue-700';
      case 'webinar':
        return 'bg-purple-100 text-purple-700';
      case 'content':
        return 'bg-green-100 text-green-700';
      case 'event':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
        return <Target className="w-5 h-5" />;
    }
  };

  const calculateROI = (revenue: number, spent: number) => {
    if (spent === 0) return 0;
    return ((revenue - spent) / spent) * 100;
  };

  const calculateRate = (numerator: number, denominator: number) => {
    if (denominator === 0) return 0;
    return (numerator / denominator) * 100;
  };

  const handleEdit = () => {
    router.push(`/crm/campaigns/edit/${campaign.id}`);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    router.push('/crm/campaigns');
  };

  const handleStatusToggle = () => {
    // This would update the status in a real application
    if (campaign.status === 'active') {
      campaign.status = 'paused';
    } else if (campaign.status === 'paused') {
      campaign.status = 'active';
    }
  };

  const roi = calculateROI(campaign.revenue, campaign.spent);
  const deliveryRate = calculateRate(campaign.delivered, campaign.sent);
  const openRate = calculateRate(campaign.opened, campaign.delivered);
  const clickRate = calculateRate(campaign.clicked, campaign.opened);
  const conversionRate = calculateRate(campaign.converted, campaign.clicked);
  const budgetUsed = (campaign.spent / campaign.budget) * 100;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-3">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Campaigns</span>
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border ${getStatusColor(campaign.status)}`}>
                {campaign.status === 'active' && <CheckCircle className="w-4 h-4" />}
                {campaign.status === 'paused' && <Pause className="w-4 h-4" />}
                {campaign.status === 'scheduled' && <Clock className="w-4 h-4" />}
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${getTypeColor(campaign.type)}`}>
                {getTypeIcon(campaign.type)}
                {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}
              </span>
            </div>
            <p className="text-gray-600">{campaign.description}</p>
          </div>

          <div className="flex items-center gap-2">
            {(campaign.status === 'active' || campaign.status === 'paused') && (
              <button
                onClick={handleStatusToggle}
                className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 ${
                  campaign.status === 'active'
                    ? 'border-yellow-300 text-yellow-600'
                    : 'border-green-300 text-green-600'
                }`}
              >
                {campaign.status === 'active' ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Resume</span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-red-600"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-900">Total Revenue</p>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900">${campaign.revenue.toLocaleString()}</p>
          <p className="text-sm text-blue-700 mt-1">ROI: {roi.toFixed(1)}%</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-green-900">Conversions</p>
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">{campaign.converted}</p>
          <p className="text-sm text-green-700 mt-1">Rate: {conversionRate.toFixed(1)}%</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-900">Audience Reached</p>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-900">{campaign.audience.toLocaleString()}</p>
          <p className="text-sm text-purple-700 mt-1">Delivered: {campaign.delivered.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-orange-900">Budget Used</p>
            <BarChart3 className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-900">${campaign.spent.toLocaleString()}</p>
          <p className="text-sm text-orange-700 mt-1">of ${campaign.budget.toLocaleString()} ({budgetUsed.toFixed(0)}%)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-3">
          {/* Campaign Performance */}
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Campaign Performance</h2>

            <div className="space-y-2">
              {/* Sent */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Sent</span>
                  <span className="text-sm font-semibold text-gray-900">{campaign.sent.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* Delivered */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Delivered</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {campaign.delivered.toLocaleString()} ({deliveryRate.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${deliveryRate}%` }}></div>
                </div>
              </div>

              {/* Opened */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Opened</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {campaign.opened.toLocaleString()} ({openRate.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${openRate}%` }}></div>
                </div>
              </div>

              {/* Clicked */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Clicked</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {campaign.clicked.toLocaleString()} ({clickRate.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${clickRate}%` }}></div>
                </div>
              </div>

              {/* Converted */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Converted</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {campaign.converted} ({conversionRate.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${conversionRate}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Goals */}
          {campaign.goals && campaign.goals.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-3">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Campaign Goals</h2>
              <ul className="space-y-3">
                {campaign.goals.map((goal, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Marketing Channels */}
          {campaign.channels && campaign.channels.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-3">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Marketing Channels</h2>
              <div className="flex flex-wrap gap-2">
                {campaign.channels.map((channel, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm border border-gray-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {channel}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          {/* Campaign Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Campaign Details</h2>

            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500 mb-1">Campaign ID</p>
                <p className="text-sm font-medium text-gray-900">{campaign.id}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Campaign Type</p>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm ${getTypeColor(campaign.type)}`}>
                  {getTypeIcon(campaign.type)}
                  {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm border ${getStatusColor(campaign.status)}`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Campaign Owner</p>
                <p className="text-sm font-medium text-gray-900">{campaign.owner}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Start Date</p>
                <p className="text-sm font-medium text-gray-900">{campaign.startDate}</p>
              </div>

              {campaign.endDate && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">End Date</p>
                  <p className="text-sm font-medium text-gray-900">{campaign.endDate}</p>
                </div>
              )}
            </div>
          </div>

          {/* Budget Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Budget Information</h2>

            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Budget</p>
                <p className="text-xl font-bold text-gray-900">${campaign.budget.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Amount Spent</p>
                <p className="text-xl font-bold text-blue-600">${campaign.spent.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Remaining</p>
                <p className="text-xl font-bold text-green-600">${(campaign.budget - campaign.spent).toLocaleString()}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Budget Usage</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${budgetUsed > 90 ? 'bg-red-500' : budgetUsed > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">{budgetUsed.toFixed(1)}% used</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Campaign"
        message={`Are you sure you want to delete "${campaign.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
