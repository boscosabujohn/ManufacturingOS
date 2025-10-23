'use client';

import { useState } from 'react';
import { Mail, Users, TrendingUp, Target, Search, Plus, Calendar, BarChart3, Play, Pause, CheckCircle, XCircle, Clock, Eye, Edit, Copy, Trash2, ArrowRight } from 'lucide-react';
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
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Q4 Product Launch Campaign',
    type: 'email',
    status: 'active',
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    budget: 50000,
    spent: 28500,
    audience: 12500,
    sent: 9800,
    delivered: 9650,
    opened: 4825,
    clicked: 1930,
    converted: 245,
    revenue: 856000,
    owner: 'Sarah Johnson',
  },
  {
    id: '2',
    name: 'Enterprise Customer Webinar Series',
    type: 'webinar',
    status: 'active',
    startDate: '2024-09-15',
    endDate: '2024-11-30',
    budget: 35000,
    spent: 24500,
    audience: 3450,
    sent: 3200,
    delivered: 3180,
    opened: 1908,
    clicked: 856,
    converted: 128,
    revenue: 512000,
    owner: 'Michael Chen',
  },
  {
    id: '3',
    name: 'Holiday Promotion 2024',
    type: 'email',
    status: 'scheduled',
    startDate: '2024-11-15',
    endDate: '2024-12-25',
    budget: 75000,
    spent: 5000,
    audience: 25600,
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    revenue: 0,
    owner: 'Emily Rodriguez',
  },
  {
    id: '4',
    name: 'Customer Success Stories',
    type: 'content',
    status: 'active',
    startDate: '2024-08-01',
    endDate: '2024-10-31',
    budget: 25000,
    spent: 22000,
    audience: 18900,
    sent: 15600,
    delivered: 15450,
    opened: 8505,
    clicked: 3401,
    converted: 187,
    revenue: 374000,
    owner: 'David Martinez',
  },
  {
    id: '5',
    name: 'Trade Show Lead Nurture',
    type: 'email',
    status: 'completed',
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    budget: 40000,
    spent: 38500,
    audience: 8700,
    sent: 7800,
    delivered: 7720,
    opened: 4632,
    clicked: 1853,
    converted: 156,
    revenue: 624000,
    owner: 'Sarah Johnson',
  },
  {
    id: '6',
    name: 'LinkedIn Thought Leadership',
    type: 'social',
    status: 'active',
    startDate: '2024-09-01',
    budget: 20000,
    spent: 12000,
    audience: 45000,
    sent: 38000,
    delivered: 38000,
    opened: 11400,
    clicked: 3420,
    converted: 89,
    revenue: 178000,
    owner: 'Michael Chen',
  },
  {
    id: '7',
    name: 'Re-engagement Campaign',
    type: 'email',
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
  },
];

export default function CampaignsPage() {
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'scheduled' | 'active' | 'paused' | 'completed'>('all');
  const [filterType, setFilterType] = useState<'all' | 'email' | 'social' | 'webinar' | 'content' | 'event'>('all');

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus;
    const matchesType = filterType === 'all' || campaign.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    totalCampaigns: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    totalBudget: campaigns.reduce((sum, c) => sum + c.budget, 0),
    totalSpent: campaigns.reduce((sum, c) => sum + c.spent, 0),
    totalRevenue: campaigns.reduce((sum, c) => sum + c.revenue, 0),
    totalConverted: campaigns.reduce((sum, c) => sum + c.converted, 0),
  };

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

  const calculateROI = (revenue: number, spent: number) => {
    if (spent === 0) return 0;
    return ((revenue - spent) / spent) * 100;
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalCampaigns}</div>
            <div className="text-blue-100">Total Campaigns</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Play className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.active}</div>
            <div className="text-green-100">Active</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">${(stats.totalBudget / 1000).toFixed(0)}K</div>
            <div className="text-purple-100">Total Budget</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">${(stats.totalSpent / 1000).toFixed(0)}K</div>
            <div className="text-orange-100">Total Spent</div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalConverted}</div>
            <div className="text-teal-100">Conversions</div>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Mail className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">${(stats.totalRevenue / 1000000).toFixed(2)}M</div>
            <div className="text-pink-100">Revenue</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link href="/crm/campaigns/email">
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <Mail className="w-8 h-8 text-orange-600" />
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Campaigns</h3>
              <p className="text-sm text-gray-600">Create and manage email campaigns</p>
            </div>
          </Link>

          <Link href="/crm/campaigns/performance">
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance</h3>
              <p className="text-sm text-gray-600">View campaign analytics</p>
            </div>
          </Link>

          <Link href="/crm/campaigns/templates">
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <Copy className="w-8 h-8 text-purple-600" />
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Templates</h3>
              <p className="text-sm text-gray-600">Manage email templates</p>
            </div>
          </Link>

          <Link href="/crm/campaigns/automation">
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-green-600" />
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Automation</h3>
              <p className="text-sm text-gray-600">Build automated workflows</p>
            </div>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="email">Email</option>
                <option value="social">Social</option>
                <option value="webinar">Webinar</option>
                <option value="content">Content</option>
                <option value="event">Event</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => {
          const roi = calculateROI(campaign.revenue, campaign.spent);
          const openRate = campaign.sent > 0 ? (campaign.opened / campaign.sent) * 100 : 0;
          const clickRate = campaign.sent > 0 ? (campaign.clicked / campaign.sent) * 100 : 0;
          const conversionRate = campaign.sent > 0 ? (campaign.converted / campaign.sent) * 100 : 0;

          return (
            <div key={campaign.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{campaign.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(campaign.type)}`}>
                      {campaign.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(campaign.startDate).toLocaleDateString()}
                      {campaign.endDate && ` - ${new Date(campaign.endDate).toLocaleDateString()}`}
                    </div>
                    <div>Owner: <span className="font-medium">{campaign.owner}</span></div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-6 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-xs text-blue-600 mb-1">Audience</div>
                      <div className="text-lg font-bold text-blue-900">{campaign.audience.toLocaleString()}</div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-xs text-green-600 mb-1">Open Rate</div>
                      <div className="text-lg font-bold text-green-900">{openRate.toFixed(1)}%</div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-xs text-purple-600 mb-1">Click Rate</div>
                      <div className="text-lg font-bold text-purple-900">{clickRate.toFixed(1)}%</div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="text-xs text-orange-600 mb-1">Conversions</div>
                      <div className="text-lg font-bold text-orange-900">{campaign.converted}</div>
                    </div>

                    <div className="bg-teal-50 rounded-lg p-3">
                      <div className="text-xs text-teal-600 mb-1">Revenue</div>
                      <div className="text-lg font-bold text-teal-900">${(campaign.revenue / 1000).toFixed(0)}K</div>
                    </div>

                    <div className="bg-pink-50 rounded-lg p-3">
                      <div className="text-xs text-pink-600 mb-1">ROI</div>
                      <div className={`text-lg font-bold ${roi >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                        {roi.toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  {/* Budget Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-gray-600">Budget Progress</span>
                      <span className="font-medium text-gray-900">
                        ${(campaign.spent / 1000).toFixed(1)}K / ${(campaign.budget / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          (campaign.spent / campaign.budget) * 100 > 90 ? 'bg-red-600' :
                          (campaign.spent / campaign.budget) * 100 > 75 ? 'bg-yellow-600' :
                          'bg-green-600'
                        }`}
                        style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">View</span>
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Edit className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">Edit</span>
                  </button>
                  {campaign.status === 'active' && (
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-yellow-300 rounded-lg hover:bg-yellow-50 text-sm">
                      <Pause className="w-4 h-4 text-yellow-600" />
                      <span className="text-yellow-600">Pause</span>
                    </button>
                  )}
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-sm">
                    <Trash2 className="w-4 h-4 text-red-600" />
                    <span className="text-red-600">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
