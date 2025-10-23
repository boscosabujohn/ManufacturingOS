'use client';

import { useState } from 'react';
import { Users, Plus, Search, Calendar, Clock, MapPin, Video, User, CheckCircle, XCircle, AlertCircle, BarChart3, TrendingUp, Edit, Trash2, Eye, FileText } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  description: string;
  type: 'demo' | 'discovery' | 'negotiation' | 'review' | 'internal' | 'training';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  startTime: string;
  endTime: string;
  duration: number;
  location: string;
  meetingLink?: string;
  organizer: string;
  attendees: string[];
  relatedTo: string;
  relatedType: 'lead' | 'opportunity' | 'customer' | 'internal';
  outcome?: string;
  nextSteps?: string[];
  recordingUrl?: string;
  notes?: string;
}

const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Product Demo - Enterprise Solutions',
    description: 'Demonstrate new features and capabilities to potential enterprise client',
    type: 'demo',
    status: 'scheduled',
    startTime: '2024-10-21T14:00:00',
    endTime: '2024-10-21T15:00:00',
    duration: 60,
    location: 'Virtual',
    meetingLink: 'https://zoom.us/j/meeting123',
    organizer: 'Michael Chen',
    attendees: ['John Anderson (CTO)', 'Lisa Thompson (VP Eng)', 'Robert Chang (Dir IT)'],
    relatedTo: 'Enterprise Solutions Ltd.',
    relatedType: 'opportunity',
  },
  {
    id: '2',
    title: 'Q4 Strategic Planning Session',
    description: 'Review Q3 performance and plan Q4 initiatives',
    type: 'internal',
    status: 'scheduled',
    startTime: '2024-10-23T09:00:00',
    endTime: '2024-10-23T11:00:00',
    duration: 120,
    location: 'Board Room',
    organizer: 'Sarah Johnson',
    attendees: ['Michael Chen', 'Emily Rodriguez', 'David Martinez', 'Leadership Team'],
    relatedTo: 'Sales Department',
    relatedType: 'internal',
  },
  {
    id: '3',
    title: 'Discovery Call - FinanceHub',
    description: 'Understand pain points, requirements, and decision-making process',
    type: 'discovery',
    status: 'completed',
    startTime: '2024-10-20T10:00:00',
    endTime: '2024-10-20T10:45:00',
    duration: 45,
    location: 'Virtual',
    meetingLink: 'https://zoom.us/j/meeting456',
    organizer: 'Emily Rodriguez',
    attendees: ['Elizabeth Wilson (CFO)', 'David Anderson (Dir Investment)'],
    relatedTo: 'FinanceHub International',
    relatedType: 'opportunity',
    outcome: 'Positive - identified 3 key pain points, budget approved for Q4',
    nextSteps: ['Send proposal by Oct 25', 'Schedule technical demo', 'Connect with IT team'],
    recordingUrl: 'https://recordings.zoom.us/meeting456',
    notes: 'Client is looking for robust security features and multi-region support.',
  },
  {
    id: '4',
    title: 'Contract Negotiation - TechCorp',
    description: 'Finalize terms, pricing, and implementation timeline',
    type: 'negotiation',
    status: 'scheduled',
    startTime: '2024-10-22T15:00:00',
    endTime: '2024-10-22T16:30:00',
    duration: 90,
    location: 'Virtual',
    meetingLink: 'https://zoom.us/j/meeting789',
    organizer: 'Sarah Johnson',
    attendees: ['Sarah Johnson (CTO)', 'Legal Team', 'Procurement Manager'],
    relatedTo: 'TechCorp Global Inc.',
    relatedType: 'opportunity',
  },
  {
    id: '5',
    title: 'Quarterly Business Review - GlobalMfg',
    description: 'Review usage metrics, ROI, and expansion opportunities',
    type: 'review',
    status: 'scheduled',
    startTime: '2024-10-24T13:00:00',
    endTime: '2024-10-24T14:00:00',
    duration: 60,
    location: 'Client Office',
    organizer: 'David Martinez',
    attendees: ['Robert Davis (VP Ops)', 'Account Team'],
    relatedTo: 'GlobalManufacturing Corp',
    relatedType: 'customer',
  },
  {
    id: '6',
    title: 'Weekly Team Sync',
    description: 'Review pipeline, blockers, and team updates',
    type: 'internal',
    status: 'completed',
    startTime: '2024-10-20T09:00:00',
    endTime: '2024-10-20T10:00:00',
    duration: 60,
    location: 'Conference Room A',
    organizer: 'Sarah Johnson',
    attendees: ['Michael Chen', 'Emily Rodriguez', 'David Martinez'],
    relatedTo: 'Sales Team',
    relatedType: 'internal',
    outcome: 'Pipeline review completed, 3 deals moving to negotiation',
    nextSteps: ['Follow up on Q4 forecasts', 'Prepare customer success stories'],
  },
  {
    id: '7',
    title: 'Product Training - New Features',
    description: 'Train team on Q4 product releases',
    type: 'training',
    status: 'completed',
    startTime: '2024-10-18T14:00:00',
    endTime: '2024-10-18T16:00:00',
    duration: 120,
    location: 'Virtual',
    meetingLink: 'https://zoom.us/j/training101',
    organizer: 'Product Team',
    attendees: ['All Sales Team', 'Customer Success Team'],
    relatedTo: 'Product Launch',
    relatedType: 'internal',
    outcome: 'Team trained on 5 new features and demo scenarios',
    recordingUrl: 'https://recordings.zoom.us/training101',
  },
  {
    id: '8',
    title: 'Executive Briefing - StartupTech',
    description: 'Present solution to C-level executives',
    type: 'demo',
    status: 'cancelled',
    startTime: '2024-10-19T11:00:00',
    endTime: '2024-10-19T12:00:00',
    duration: 60,
    location: 'Virtual',
    organizer: 'Michael Chen',
    attendees: ['CEO', 'CTO', 'CFO'],
    relatedTo: 'StartupTech Inc.',
    relatedType: 'lead',
    notes: 'Rescheduled to next week due to client emergency',
  },
];

export default function MeetingsPage() {
  const [meetings] = useState<Meeting[]>(mockMeetings);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [filterType, setFilterType] = useState<'all' | 'demo' | 'discovery' | 'negotiation' | 'review' | 'internal' | 'training'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'type'>('date');

  const filteredMeetings = meetings
    .filter(meeting => {
      const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          meeting.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          meeting.relatedTo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || meeting.status === filterStatus;
      const matchesType = filterType === 'all' || meeting.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
        case 'duration':
          return b.duration - a.duration;
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

  const stats = {
    total: meetings.length,
    scheduled: meetings.filter(m => m.status === 'scheduled').length,
    completed: meetings.filter(m => m.status === 'completed').length,
    cancelled: meetings.filter(m => m.status === 'cancelled').length,
    totalHours: meetings.filter(m => m.status === 'completed').reduce((sum, m) => sum + m.duration, 0) / 60,
    avgDuration: meetings.reduce((sum, m) => sum + m.duration, 0) / meetings.length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'demo':
        return 'bg-purple-100 text-purple-700';
      case 'discovery':
        return 'bg-blue-100 text-blue-700';
      case 'negotiation':
        return 'bg-orange-100 text-orange-700';
      case 'review':
        return 'bg-green-100 text-green-700';
      case 'internal':
        return 'bg-gray-100 text-gray-700';
      case 'training':
        return 'bg-teal-100 text-teal-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-purple-100">Total Meetings</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.scheduled}</div>
            <div className="text-blue-100">Scheduled</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.completed}</div>
            <div className="text-green-100">Completed</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.cancelled}</div>
            <div className="text-red-100">Cancelled</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalHours.toFixed(1)}h</div>
            <div className="text-orange-100">Total Hours</div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.avgDuration.toFixed(0)}m</div>
            <div className="text-teal-100">Avg Duration</div>
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
                  placeholder="Search meetings..."
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
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="demo">Demo</option>
                <option value="discovery">Discovery</option>
                <option value="negotiation">Negotiation</option>
                <option value="review">Review</option>
                <option value="internal">Internal</option>
                <option value="training">Training</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="duration">Sort by Duration</option>
                <option value="type">Sort by Type</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.map((meeting) => (
          <div key={meeting.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{meeting.title}</h3>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(meeting.status)}`}>
                    {getStatusIcon(meeting.status)}
                    {meeting.status}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(meeting.type)}`}>
                    {meeting.type}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{meeting.description}</p>

                {/* Meeting Details Grid */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-1 text-gray-600 text-sm mb-1">
                      <Calendar className="w-4 h-4" />
                      Date & Time
                    </div>
                    <div className="font-medium text-gray-900">
                      {new Date(meeting.startTime).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(meeting.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} -
                      {new Date(meeting.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-gray-600 text-sm mb-1">
                      <Clock className="w-4 h-4" />
                      Duration
                    </div>
                    <div className="font-medium text-gray-900">{meeting.duration} minutes</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-gray-600 text-sm mb-1">
                      <MapPin className="w-4 h-4" />
                      Location
                    </div>
                    <div className="font-medium text-gray-900">{meeting.location}</div>
                    {meeting.meetingLink && (
                      <a href={meeting.meetingLink} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        Join Meeting
                      </a>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-gray-600 text-sm mb-1">
                      <User className="w-4 h-4" />
                      Organizer
                    </div>
                    <div className="font-medium text-gray-900">{meeting.organizer}</div>
                  </div>
                </div>

                {/* Attendees */}
                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">Attendees ({meeting.attendees.length}):</div>
                  <div className="flex flex-wrap gap-2">
                    {meeting.attendees.map((attendee, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {attendee}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Related To */}
                <div className="text-sm">
                  <span className="text-gray-600">Related to: </span>
                  <span className="font-medium text-gray-900">{meeting.relatedTo}</span>
                  <span className="text-gray-500"> ({meeting.relatedType})</span>
                </div>

                {/* Outcome & Next Steps (for completed meetings) */}
                {meeting.outcome && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">Outcome: </span>
                      <span className="text-sm text-gray-900">{meeting.outcome}</span>
                    </div>
                    {meeting.nextSteps && meeting.nextSteps.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Next Steps:</div>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {meeting.nextSteps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {meeting.recordingUrl && (
                      <a href={meeting.recordingUrl} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-2">
                        <Video className="w-4 h-4" />
                        View Recording
                      </a>
                    )}
                  </div>
                )}

                {meeting.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-600">
                    <span className="font-medium">Note: </span>{meeting.notes}
                  </div>
                )}
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
                <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-sm">
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span className="text-red-600">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMeetings.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
