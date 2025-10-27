'use client';

import { useState } from 'react';
import { List, Users, Mail, Phone, Filter as FilterIcon, TrendingUp, Target, Calendar, Search, Plus, Edit, Trash2, Eye, Download, Upload, CheckCircle, XCircle, Clock, BarChart3, Send, UserPlus, Copy, Archive } from 'lucide-react';

interface ContactList {
  id: string;
  name: string;
  description: string;
  contactCount: number;
  type: 'static' | 'dynamic' | 'smart';
  category: string;
  filters: string[];
  emailsSent: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
  lastUpdated: string;
  createdDate: string;
  owner: string;
  status: 'active' | 'archived' | 'draft';
  color: string;
  tags: string[];
}

interface ListContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  addedDate: string;
  lastEngagement: string;
  engagementScore: number;
  status: 'subscribed' | 'unsubscribed' | 'bounced';
}

const mockLists: ContactList[] = [
  {
    id: '1',
    name: 'Enterprise Prospects 2024',
    description: 'High-value enterprise prospects for Q4 outreach campaign',
    contactCount: 487,
    type: 'static',
    category: 'Prospects',
    filters: ['Revenue > $10M', 'Employees > 500', 'Tech Industry'],
    emailsSent: 1245,
    openRate: 42.5,
    clickRate: 18.3,
    unsubscribeRate: 1.2,
    lastUpdated: '2024-10-18',
    createdDate: '2024-01-15',
    owner: 'Sarah Johnson',
    status: 'active',
    color: 'purple',
    tags: ['Enterprise', 'High Priority', 'Technology'],
  },
  {
    id: '2',
    name: 'Active Customers - Premium',
    description: 'Premium tier customers with active subscriptions',
    contactCount: 1243,
    type: 'dynamic',
    category: 'Customers',
    filters: ['Plan = Premium', 'Status = Active', 'MRR > $5000'],
    emailsSent: 3890,
    openRate: 58.7,
    clickRate: 31.2,
    unsubscribeRate: 0.4,
    lastUpdated: '2024-10-20',
    createdDate: '2024-02-10',
    owner: 'Michael Chen',
    status: 'active',
    color: 'blue',
    tags: ['Customers', 'Premium', 'Active'],
  },
  {
    id: '3',
    name: 'Webinar Attendees - AI Series',
    description: 'Contacts who attended AI webinar series in Q3',
    contactCount: 856,
    type: 'static',
    category: 'Events',
    filters: ['Webinar = AI Series', 'Attended = Yes', 'Date >= Q3 2024'],
    emailsSent: 2140,
    openRate: 51.3,
    clickRate: 24.7,
    unsubscribeRate: 2.1,
    lastUpdated: '2024-10-15',
    createdDate: '2024-07-01',
    owner: 'Emily Rodriguez',
    status: 'active',
    color: 'green',
    tags: ['Events', 'Webinar', 'AI'],
  },
  {
    id: '4',
    name: 'At-Risk Customers',
    description: 'Customers showing signs of churn risk - high priority retention',
    contactCount: 156,
    type: 'smart',
    category: 'Retention',
    filters: ['NPS < 6', 'Last Login > 30 days', 'Support Tickets > 5'],
    emailsSent: 468,
    openRate: 38.2,
    clickRate: 15.8,
    unsubscribeRate: 3.5,
    lastUpdated: '2024-10-19',
    createdDate: '2024-03-20',
    owner: 'David Martinez',
    status: 'active',
    color: 'red',
    tags: ['Churn Risk', 'High Priority', 'Retention'],
  },
  {
    id: '5',
    name: 'Newsletter Subscribers',
    description: 'Weekly newsletter subscribers - general audience',
    contactCount: 12450,
    type: 'dynamic',
    category: 'Marketing',
    filters: ['Newsletter = Yes', 'Status = Subscribed'],
    emailsSent: 49800,
    openRate: 28.4,
    clickRate: 8.2,
    unsubscribeRate: 0.8,
    lastUpdated: '2024-10-20',
    createdDate: '2023-06-01',
    owner: 'Sarah Johnson',
    status: 'active',
    color: 'yellow',
    tags: ['Newsletter', 'Marketing', 'General'],
  },
  {
    id: '6',
    name: 'Product Launch - Beta Testers',
    description: 'Selected beta testers for new product launch',
    contactCount: 234,
    type: 'static',
    category: 'Product',
    filters: ['Beta = Yes', 'NPS > 8', 'Tech Savvy = Yes'],
    emailsSent: 702,
    openRate: 72.5,
    clickRate: 48.3,
    unsubscribeRate: 0.2,
    lastUpdated: '2024-10-17',
    createdDate: '2024-09-01',
    owner: 'Michael Chen',
    status: 'active',
    color: 'orange',
    tags: ['Beta', 'Product', 'Early Access'],
  },
  {
    id: '7',
    name: 'SMB Growth Segment',
    description: 'Small-medium businesses with growth potential',
    contactCount: 2340,
    type: 'smart',
    category: 'Prospects',
    filters: ['Employees 50-500', 'Growth Rate > 15%', 'No Active Deal'],
    emailsSent: 7020,
    openRate: 35.8,
    clickRate: 12.4,
    unsubscribeRate: 1.8,
    lastUpdated: '2024-10-18',
    createdDate: '2024-04-15',
    owner: 'Emily Rodriguez',
    status: 'active',
    color: 'teal',
    tags: ['SMB', 'Growth', 'Prospects'],
  },
  {
    id: '8',
    name: 'Inactive Leads - Nurture',
    description: 'Leads that went cold but have reengagement potential',
    contactCount: 1876,
    type: 'static',
    category: 'Nurture',
    filters: ['Last Contact > 90 days', 'Initial Interest = High'],
    emailsSent: 5628,
    openRate: 22.1,
    clickRate: 6.8,
    unsubscribeRate: 2.9,
    lastUpdated: '2024-10-10',
    createdDate: '2024-05-20',
    owner: 'David Martinez',
    status: 'active',
    color: 'gray',
    tags: ['Nurture', 'Reengagement', 'Cold Leads'],
  },
  {
    id: '9',
    name: 'Executive Decision Makers',
    description: 'C-level and VP contacts across all accounts',
    contactCount: 543,
    type: 'dynamic',
    category: 'Executives',
    filters: ['Title = C-Level OR VP', 'Decision Maker = Yes'],
    emailsSent: 1629,
    openRate: 45.8,
    clickRate: 22.6,
    unsubscribeRate: 0.9,
    lastUpdated: '2024-10-19',
    createdDate: '2024-01-10',
    owner: 'Sarah Johnson',
    status: 'active',
    color: 'indigo',
    tags: ['Executives', 'Decision Makers', 'C-Level'],
  },
  {
    id: '10',
    name: 'Q3 Trade Show Leads',
    description: 'Leads collected from Q3 trade shows and conferences',
    contactCount: 678,
    type: 'static',
    category: 'Events',
    filters: ['Source = Trade Show', 'Date = Q3 2024'],
    emailsSent: 0,
    openRate: 0,
    clickRate: 0,
    unsubscribeRate: 0,
    lastUpdated: '2024-09-30',
    createdDate: '2024-09-30',
    owner: 'Michael Chen',
    status: 'draft',
    color: 'pink',
    tags: ['Trade Show', 'Events', 'New Leads'],
  },
];

const mockContacts: ListContact[] = [
  {
    id: '1',
    name: 'John Anderson',
    email: 'john.anderson@enterprise.com',
    phone: '+1 (555) 123-4567',
    company: 'Enterprise Corp',
    title: 'CTO',
    addedDate: '2024-08-15',
    lastEngagement: '2024-10-18',
    engagementScore: 85,
    status: 'subscribed',
  },
  {
    id: '2',
    name: 'Lisa Thompson',
    email: 'lisa.t@techventures.com',
    phone: '+1 (555) 234-5678',
    company: 'TechVentures',
    title: 'VP Engineering',
    addedDate: '2024-07-20',
    lastEngagement: '2024-10-15',
    engagementScore: 72,
    status: 'subscribed',
  },
  {
    id: '3',
    name: 'Robert Chang',
    email: 'robert.chang@innovate.io',
    phone: '+1 (555) 345-6789',
    company: 'Innovate Systems',
    title: 'Director of IT',
    addedDate: '2024-09-05',
    lastEngagement: '2024-10-10',
    engagementScore: 58,
    status: 'subscribed',
  },
];

export default function ContactListsPage() {
  const [lists] = useState<ContactList[]>(mockLists);
  const [contacts] = useState<ListContact[]>(mockContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'static' | 'dynamic' | 'smart'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'contacts' | 'openRate' | 'updated'>('updated');
  const [selectedList, setSelectedList] = useState<ContactList | null>(null);

  const categories = ['all', ...Array.from(new Set(lists.map(l => l.category)))];

  const filteredLists = lists
    .filter(list => {
      const matchesSearch = list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          list.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          list.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || list.type === filterType;
      const matchesCategory = filterCategory === 'all' || list.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || list.status === filterStatus;
      return matchesSearch && matchesType && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'contacts':
          return b.contactCount - a.contactCount;
        case 'openRate':
          return b.openRate - a.openRate;
        case 'updated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return 0;
      }
    });

  const stats = {
    totalLists: lists.filter(l => l.status === 'active').length,
    totalContacts: lists.reduce((sum, l) => sum + l.contactCount, 0),
    avgOpenRate: lists.filter(l => l.emailsSent > 0).reduce((sum, l) => sum + l.openRate, 0) / lists.filter(l => l.emailsSent > 0).length,
    avgClickRate: lists.filter(l => l.emailsSent > 0).reduce((sum, l) => sum + l.clickRate, 0) / lists.filter(l => l.emailsSent > 0).length,
    totalEmailsSent: lists.reduce((sum, l) => sum + l.emailsSent, 0),
    avgUnsubscribeRate: lists.filter(l => l.emailsSent > 0).reduce((sum, l) => sum + l.unsubscribeRate, 0) / lists.filter(l => l.emailsSent > 0).length,
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'static':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'dynamic':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'smart':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'archived':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getEngagementColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceColor = (rate: number, type: 'open' | 'click' | 'unsub') => {
    if (type === 'unsub') {
      if (rate < 1) return 'text-green-600';
      if (rate < 2) return 'text-yellow-600';
      return 'text-red-600';
    }
    if (rate >= 40) return 'text-green-600';
    if (rate >= 25) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <List className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalLists}</div>
            <div className="text-purple-100">Active Lists</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{(stats.totalContacts / 1000).toFixed(1)}K</div>
            <div className="text-blue-100">Total Contacts</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Mail className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{(stats.totalEmailsSent / 1000).toFixed(0)}K</div>
            <div className="text-green-100">Emails Sent</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.avgOpenRate.toFixed(1)}%</div>
            <div className="text-orange-100">Avg Open Rate</div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.avgClickRate.toFixed(1)}%</div>
            <div className="text-teal-100">Avg Click Rate</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.avgUnsubscribeRate.toFixed(1)}%</div>
            <div className="text-red-100">Avg Unsub Rate</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search lists, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="static">Static</option>
                <option value="dynamic">Dynamic</option>
                <option value="smart">Smart</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="draft">Draft</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="updated">Sort by Updated</option>
                <option value="name">Sort by Name</option>
                <option value="contacts">Sort by Contacts</option>
                <option value="openRate">Sort by Open Rate</option>
              </select>

              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lists Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredLists.map((list) => (
          <div key={list.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{list.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(list.type)}`}>
                      {list.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(list.status)}`}>
                      {list.status}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {list.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{list.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {list.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Filters */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-600 mb-2">Applied Filters:</div>
                    <div className="flex flex-wrap gap-2">
                      {list.filters.map((filter, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {filter}
                        </span>
                      ))}
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
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Copy className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">Copy</span>
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-sm">
                    <Trash2 className="w-4 h-4 text-red-600" />
                    <span className="text-red-600">Delete</span>
                  </button>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-6 gap-4 mb-4 pt-4 border-t border-gray-100">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
                    <Users className="w-4 h-4" />
                    Contacts
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {list.contactCount.toLocaleString()}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
                    <Mail className="w-4 h-4" />
                    Emails Sent
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    {list.emailsSent.toLocaleString()}
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-orange-600 text-sm mb-1">
                    <Target className="w-4 h-4" />
                    Open Rate
                  </div>
                  <div className={`text-2xl font-bold ${getPerformanceColor(list.openRate, 'open')}`}>
                    {list.openRate.toFixed(1)}%
                  </div>
                </div>

                <div className="bg-teal-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-teal-600 text-sm mb-1">
                    <TrendingUp className="w-4 h-4" />
                    Click Rate
                  </div>
                  <div className={`text-2xl font-bold ${getPerformanceColor(list.clickRate, 'click')}`}>
                    {list.clickRate.toFixed(1)}%
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-600 text-sm mb-1">
                    <XCircle className="w-4 h-4" />
                    Unsub Rate
                  </div>
                  <div className={`text-2xl font-bold ${getPerformanceColor(list.unsubscribeRate, 'unsub')}`}>
                    {list.unsubscribeRate.toFixed(1)}%
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-purple-600 text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    Updated
                  </div>
                  <div className="text-sm font-bold text-purple-900">
                    {new Date(list.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setSelectedList(list)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Eye className="w-4 h-4" />
                  View Contacts
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <Send className="w-4 h-4" />
                  Send Campaign
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <UserPlus className="w-4 h-4" />
                  Add Contacts
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>

              {/* Metadata */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                <span>Owner: {list.owner}</span>
                <span>Created: {new Date(list.createdDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* List Contacts Modal */}
      {selectedList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedList.name}</h2>
                  <p className="text-gray-600">{selectedList.contactCount.toLocaleString()} contacts in this list</p>
                </div>
                <button
                  onClick={() => setSelectedList(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            contact.status === 'subscribed' ? 'bg-green-100 text-green-700' :
                            contact.status === 'unsubscribed' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {contact.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {contact.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {contact.phone}
                          </div>
                          <div>
                            <span className="font-medium">{contact.company}</span> • {contact.title}
                          </div>
                          <div>
                            Last engagement: {new Date(contact.lastEngagement).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-600 mb-1">Engagement Score</div>
                        <div className={`text-2xl font-bold ${getEngagementColor(contact.engagementScore)}`}>
                          {contact.engagementScore}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {contacts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No contacts to display
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
