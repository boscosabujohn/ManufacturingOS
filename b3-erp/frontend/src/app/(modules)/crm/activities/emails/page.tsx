'use client';

import { useState } from 'react';
import { Mail, Plus, Search, Send, Inbox, Archive, Star, Clock, User, CheckCircle, XCircle, Eye, TrendingUp, BarChart3, Calendar, Edit, Trash2, FileText, Paperclip } from 'lucide-react';

interface Email {
  id: string;
  subject: string;
  body: string;
  type: 'sent' | 'received' | 'draft';
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'draft';
  from: string;
  to: string[];
  cc?: string[];
  timestamp: string;
  relatedTo: string;
  relatedType: 'lead' | 'opportunity' | 'customer' | 'internal';
  priority: 'high' | 'medium' | 'low';
  hasAttachments: boolean;
  attachmentCount?: number;
  openCount?: number;
  clickCount?: number;
  firstOpenedAt?: string;
  lastOpenedAt?: string;
  tags: string[];
  campaign?: string;
}

const mockEmails: Email[] = [
  {
    id: '1',
    subject: 'Re: Enterprise Implementation Timeline',
    body: 'Thank you for the detailed proposal. We would like to schedule a call next week to discuss the implementation timeline and resource requirements.',
    type: 'received',
    status: 'delivered',
    from: 'john.anderson@enterprise.com',
    to: ['michael.chen@company.com'],
    timestamp: '2024-10-20T14:30:00',
    relatedTo: 'Enterprise Solutions Ltd.',
    relatedType: 'opportunity',
    priority: 'high',
    hasAttachments: false,
    tags: ['Response', 'Implementation'],
  },
  {
    id: '2',
    subject: 'Product Demo Follow-up & Proposal',
    body: 'Hi Sarah,\n\nThank you for taking the time to meet with us yesterday. As discussed, I have attached our comprehensive proposal including pricing, timeline, and implementation plan.\n\nKey highlights:\n- 25% discount for annual commitment\n- Dedicated success manager\n- 24/7 premium support\n\nPlease let me know if you have any questions.\n\nBest regards,\nMichael',
    type: 'sent',
    status: 'opened',
    from: 'michael.chen@company.com',
    to: ['sarah.j@techcorp.com'],
    cc: ['team@techcorp.com'],
    timestamp: '2024-10-19T16:45:00',
    relatedTo: 'TechCorp Global Inc.',
    relatedType: 'opportunity',
    priority: 'high',
    hasAttachments: true,
    attachmentCount: 2,
    openCount: 5,
    clickCount: 3,
    firstOpenedAt: '2024-10-19T17:30:00',
    lastOpenedAt: '2024-10-20T10:15:00',
    tags: ['Proposal', 'Follow-up'],
  },
  {
    id: '3',
    subject: 'Q4 Newsletter - New Features & Updates',
    body: 'Check out our latest product updates and upcoming webinar series...',
    type: 'sent',
    status: 'sent',
    from: 'marketing@company.com',
    to: ['newsletter@list.com'],
    timestamp: '2024-10-18T09:00:00',
    relatedTo: 'Marketing Campaign',
    relatedType: 'internal',
    priority: 'low',
    hasAttachments: false,
    openCount: 1248,
    clickCount: 342,
    tags: ['Newsletter', 'Marketing'],
    campaign: 'Q4 Newsletter',
  },
  {
    id: '4',
    subject: 'Urgent: Contract Review Required',
    body: 'Please review the updated contract terms by EOD. Legal team has made several revisions based on our last discussion.',
    type: 'sent',
    status: 'opened',
    from: 'emily.r@company.com',
    to: ['robert.davis@globalmfg.com'],
    cc: ['legal@company.com'],
    timestamp: '2024-10-20T11:20:00',
    relatedTo: 'GlobalManufacturing Corp',
    relatedType: 'customer',
    priority: 'high',
    hasAttachments: true,
    attachmentCount: 1,
    openCount: 2,
    firstOpenedAt: '2024-10-20T11:45:00',
    lastOpenedAt: '2024-10-20T13:20:00',
    tags: ['Contract', 'Urgent', 'Legal'],
  },
  {
    id: '5',
    subject: 'Welcome to [Company] - Getting Started Guide',
    body: 'Welcome aboard! We are excited to have you as a customer. This email contains everything you need to get started...',
    type: 'sent',
    status: 'clicked',
    from: 'success@company.com',
    to: ['new.customer@startup.io'],
    timestamp: '2024-10-19T10:00:00',
    relatedTo: 'StartupTech Inc.',
    relatedType: 'customer',
    priority: 'medium',
    hasAttachments: true,
    attachmentCount: 3,
    openCount: 3,
    clickCount: 8,
    firstOpenedAt: '2024-10-19T10:15:00',
    tags: ['Onboarding', 'Welcome'],
  },
  {
    id: '6',
    subject: 'Draft: Q4 Sales Strategy Presentation',
    body: 'Draft content for Q4 sales strategy presentation to leadership team...',
    type: 'draft',
    status: 'draft',
    from: 'sarah.j@company.com',
    to: ['leadership@company.com'],
    timestamp: '2024-10-20T15:30:00',
    relatedTo: 'Internal Planning',
    relatedType: 'internal',
    priority: 'medium',
    hasAttachments: false,
    tags: ['Draft', 'Internal', 'Planning'],
  },
  {
    id: '7',
    subject: 'Thank You for Attending Our Webinar',
    body: 'Thank you for attending our AI Innovation webinar. As promised, here are the recording and slides...',
    type: 'sent',
    status: 'opened',
    from: 'webinar@company.com',
    to: ['attendees@list.com'],
    timestamp: '2024-10-17T14:00:00',
    relatedTo: 'AI Webinar Series',
    relatedType: 'internal',
    priority: 'low',
    hasAttachments: true,
    attachmentCount: 2,
    openCount: 456,
    clickCount: 189,
    tags: ['Webinar', 'Follow-up', 'Marketing'],
    campaign: 'AI Webinar Series',
  },
  {
    id: '8',
    subject: 'Payment Failed - Action Required',
    body: 'Your recent payment attempt was unsuccessful. Please update your payment information to continue service.',
    type: 'sent',
    status: 'bounced',
    from: 'billing@company.com',
    to: ['billing@customer.com'],
    timestamp: '2024-10-20T08:00:00',
    relatedTo: 'Customer Account',
    relatedType: 'customer',
    priority: 'high',
    hasAttachments: false,
    tags: ['Billing', 'Alert'],
  },
];

export default function EmailsPage() {
  const [emails] = useState<Email[]>(mockEmails);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'sent' | 'received' | 'draft'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'draft'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'opens' | 'clicks'>('date');

  const filteredEmails = emails
    .filter(email => {
      const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          email.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          email.relatedTo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || email.type === filterType;
      const matchesStatus = filterStatus === 'all' || email.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || email.priority === filterPriority;
      return matchesSearch && matchesType && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'opens':
          return (b.openCount || 0) - (a.openCount || 0);
        case 'clicks':
          return (b.clickCount || 0) - (a.clickCount || 0);
        default:
          return 0;
      }
    });

  const stats = {
    total: emails.length,
    sent: emails.filter(e => e.type === 'sent').length,
    received: emails.filter(e => e.type === 'received').length,
    draft: emails.filter(e => e.type === 'draft').length,
    opened: emails.filter(e => e.status === 'opened' || e.status === 'clicked').length,
    totalOpens: emails.reduce((sum, e) => sum + (e.openCount || 0), 0),
    totalClicks: emails.reduce((sum, e) => sum + (e.clickCount || 0), 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'opened':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'clicked':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'bounced':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sent':
        return <Send className="w-4 h-4" />;
      case 'received':
        return <Inbox className="w-4 h-4" />;
      case 'draft':
        return <FileText className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 ">
      <div className="mb-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Mail className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-blue-100">Total Emails</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Send className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.sent}</div>
            <div className="text-green-100">Sent</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Inbox className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.received}</div>
            <div className="text-purple-100">Received</div>
          </div>

          <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.draft}</div>
            <div className="text-gray-100">Drafts</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.opened}</div>
            <div className="text-orange-100">Opened</div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalOpens}</div>
            <div className="text-teal-100">Total Opens</div>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalClicks}</div>
            <div className="text-pink-100">Total Clicks</div>
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
                  placeholder="Search emails..."
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
                <option value="sent">Sent</option>
                <option value="received">Received</option>
                <option value="draft">Draft</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="sent">Sent</option>
                <option value="delivered">Delivered</option>
                <option value="opened">Opened</option>
                <option value="clicked">Clicked</option>
                <option value="bounced">Bounced</option>
                <option value="draft">Draft</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="opens">Sort by Opens</option>
                <option value="clicks">Sort by Clicks</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Emails List */}
      <div className="space-y-4">
        {filteredEmails.map((email) => (
          <div key={email.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{email.subject}</h3>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(email.status)}`}>
                    {getTypeIcon(email.type)}
                    {email.status}
                  </span>
                  <span className={`text-xs font-medium ${getPriorityColor(email.priority)}`}>
                    {email.priority.toUpperCase()} Priority
                  </span>
                  {email.hasAttachments && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      <Paperclip className="w-3 h-3" />
                      {email.attachmentCount} attachment{email.attachmentCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{email.body}</p>

                {/* Email Details Grid */}
                <div className="grid grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-1 text-gray-600 text-sm mb-1">
                      <User className="w-4 h-4" />
                      From
                    </div>
                    <div className="font-medium text-gray-900 text-sm">{email.from}</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-gray-600 text-sm mb-1">
                      <Send className="w-4 h-4" />
                      To
                    </div>
                    <div className="text-sm text-gray-900">
                      {email.to.length > 2 ? `${email.to.slice(0, 2).join(', ')} +${email.to.length - 2}` : email.to.join(', ')}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-gray-600 text-sm mb-1">
                      <Calendar className="w-4 h-4" />
                      Date
                    </div>
                    <div className="text-sm text-gray-900">
                      {new Date(email.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-600">
                      {new Date(email.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-600 text-sm mb-1">Related To</div>
                    <div className="font-medium text-gray-900 text-sm">{email.relatedTo}</div>
                    <div className="text-xs text-gray-500">{email.relatedType}</div>
                  </div>
                </div>

                {/* Engagement Metrics */}
                {(email.openCount || email.clickCount) && (
                  <div className="flex items-center gap-6 mb-3 pt-3 border-t border-gray-100">
                    {email.openCount !== undefined && (
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-600">
                          <span className="font-bold text-purple-600">{email.openCount}</span> opens
                        </span>
                      </div>
                    )}
                    {email.clickCount !== undefined && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-teal-600" />
                        <span className="text-sm text-gray-600">
                          <span className="font-bold text-teal-600">{email.clickCount}</span> clicks
                        </span>
                      </div>
                    )}
                    {email.firstOpenedAt && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">
                          First opened: {new Date(email.firstOpenedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {email.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                  {email.campaign && (
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                      Campaign: {email.campaign}
                    </span>
                  )}
                </div>

                {/* CC Recipients */}
                {email.cc && email.cc.length > 0 && (
                  <div className="text-xs text-gray-600">
                    CC: {email.cc.join(', ')}
                  </div>
                )}
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  aria-label="View"
                 
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  aria-label="Edit"
                 
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  className="p-2 border border-red-300 rounded-lg hover:bg-red-50"
                  aria-label="Delete"
                 
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEmails.length === 0 && (
        <div className="text-center py-12">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No emails found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
