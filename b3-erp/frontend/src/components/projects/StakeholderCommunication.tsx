'use client'

import { useState } from 'react'
import { MessageSquare, Send, Bell, Users, FileText, Calendar, CheckCircle, AlertCircle, Mail } from 'lucide-react'

export type StakeholderRole = 'sponsor' | 'customer' | 'team-member' | 'vendor' | 'management' | 'end-user';
export type CommunicationType = 'update' | 'milestone' | 'issue' | 'change-request' | 'risk-alert' | 'meeting-notes';
export type Priority = 'high' | 'medium' | 'low';

export interface Stakeholder {
  id: string;
  name: string;
  email: string;
  role: StakeholderRole;
  organization: string;
  projectIds: string[];
  preferredChannel: 'email' | 'phone' | 'meeting';
  notificationPreferences: {
    updates: boolean;
    milestones: boolean;
    issues: boolean;
    changeRequests: boolean;
  };
}

export interface Communication {
  id: string;
  projectId: string;
  projectName: string;
  type: CommunicationType;
  subject: string;
  message: string;
  sender: string;
  recipients: string[];
  priority: Priority;
  sentDate: string;
  readBy: string[];
  responses: {
    respondent: string;
    message: string;
    timestamp: string;
  }[];
}

export interface MeetingNote {
  id: string;
  projectId: string;
  projectName: string;
  meetingDate: string;
  attendees: string[];
  agenda: string[];
  discussions: string[];
  decisions: string[];
  actionItems: {
    item: string;
    assignedTo: string;
    dueDate: string;
    status: 'pending' | 'in-progress' | 'completed';
  }[];
}

export default function StakeholderCommunication() {
  const [viewMode, setViewMode] = useState<'communications' | 'stakeholders' | 'meetings'>('communications');
  const [filterType, setFilterType] = useState<string>('all');

  const [stakeholders] = useState<Stakeholder[]>([
    {
      id: 'STK-001',
      name: 'ABC Manufacturing Ltd',
      email: 'procurement@abcmfg.com',
      role: 'customer',
      organization: 'ABC Manufacturing',
      projectIds: ['PRJ-2025-001'],
      preferredChannel: 'email',
      notificationPreferences: {
        updates: true,
        milestones: true,
        issues: true,
        changeRequests: true
      }
    },
    {
      id: 'STK-002',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@company.com',
      role: 'team-member',
      organization: 'Internal',
      projectIds: ['PRJ-2025-001', 'PRJ-2025-002'],
      preferredChannel: 'email',
      notificationPreferences: {
        updates: true,
        milestones: true,
        issues: true,
        changeRequests: false
      }
    },
    {
      id: 'STK-003',
      name: 'Finance Director',
      email: 'finance@company.com',
      role: 'management',
      organization: 'Internal',
      projectIds: ['PRJ-2025-001', 'PRJ-2025-002', 'PRJ-2025-003', 'PRJ-2025-004'],
      preferredChannel: 'meeting',
      notificationPreferences: {
        updates: false,
        milestones: true,
        issues: true,
        changeRequests: true
      }
    },
    {
      id: 'STK-004',
      name: 'Tech Solutions Pvt Ltd',
      email: 'pm@techsolutions.com',
      role: 'customer',
      organization: 'Tech Solutions',
      projectIds: ['PRJ-2025-003'],
      preferredChannel: 'email',
      notificationPreferences: {
        updates: true,
        milestones: true,
        issues: true,
        changeRequests: true
      }
    },
    {
      id: 'STK-005',
      name: 'Premium Parts Supplier',
      email: 'sales@premiumparts.com',
      role: 'vendor',
      organization: 'Premium Parts Inc',
      projectIds: ['PRJ-2025-001', 'PRJ-2025-002'],
      preferredChannel: 'phone',
      notificationPreferences: {
        updates: false,
        milestones: false,
        issues: true,
        changeRequests: true
      }
    }
  ]);

  const [communications] = useState<Communication[]>([
    {
      id: 'COMM-001',
      projectId: 'PRJ-2025-001',
      projectName: 'Hydraulic Press Installation',
      type: 'milestone',
      subject: 'Milestone Achieved: Site Preparation Complete',
      message: 'We are pleased to inform that the site preparation phase has been completed ahead of schedule. All electrical work, foundation, and safety installations are now ready for equipment installation.',
      sender: 'Project Manager',
      recipients: ['ABC Manufacturing Ltd', 'Finance Director'],
      priority: 'medium',
      sentDate: '2025-10-10',
      readBy: ['ABC Manufacturing Ltd'],
      responses: [
        {
          respondent: 'ABC Manufacturing Ltd',
          message: 'Excellent progress! Looking forward to the installation phase.',
          timestamp: '2025-10-10 14:30'
        }
      ]
    },
    {
      id: 'COMM-002',
      projectId: 'PRJ-2025-003',
      projectName: 'Automation System',
      type: 'issue',
      subject: 'Critical Issue: Integration Testing Delays',
      message: 'We have identified 8 critical defects during integration testing. This will require an additional 2 weeks for resolution and retesting. Detailed defect report attached.',
      sender: 'Priya Sharma',
      recipients: ['Tech Solutions Pvt Ltd', 'Finance Director', 'Project Steering Committee'],
      priority: 'high',
      sentDate: '2025-10-18',
      readBy: ['Finance Director'],
      responses: []
    },
    {
      id: 'COMM-003',
      projectId: 'PRJ-2025-002',
      projectName: 'CNC Machine Upgrade',
      type: 'update',
      subject: 'Weekly Progress Update - Week 42',
      message: 'Project is progressing as planned. Hardware procurement completed. Installation team mobilization scheduled for next week. Budget utilization at 45% with no overruns.',
      sender: 'Sunita Verma',
      recipients: ['XYZ Industries Inc', 'Finance Director'],
      priority: 'low',
      sentDate: '2025-10-15',
      readBy: ['XYZ Industries Inc', 'Finance Director'],
      responses: []
    },
    {
      id: 'COMM-004',
      projectId: 'PRJ-2025-001',
      projectName: 'Hydraulic Press Installation',
      type: 'change-request',
      subject: 'Change Request Approved: Vibration Monitoring System',
      message: 'The change request CR-001 for adding vibration monitoring system has been approved by the steering committee. Budget increased by ₹25L, timeline extended by 7 days.',
      sender: 'Project Manager',
      recipients: ['ABC Manufacturing Ltd', 'Finance Director', 'Rajesh Kumar'],
      priority: 'high',
      sentDate: '2025-10-08',
      readBy: ['ABC Manufacturing Ltd', 'Finance Director', 'Rajesh Kumar'],
      responses: [
        {
          respondent: 'ABC Manufacturing Ltd',
          message: 'Thank you for the update. We agree with the approved changes.',
          timestamp: '2025-10-08 16:00'
        }
      ]
    },
    {
      id: 'COMM-005',
      projectId: 'PRJ-2025-004',
      projectName: 'Production Line Setup',
      type: 'risk-alert',
      subject: 'Risk Alert: Resource Shortage',
      message: 'Current team size may be insufficient to meet project timeline. Recommend adding 2 additional engineers to prevent delays.',
      sender: 'Project Manager C',
      recipients: ['Finance Director', 'HR Head'],
      priority: 'high',
      sentDate: '2025-10-20',
      readBy: [],
      responses: []
    }
  ]);

  const [meetingNotes] = useState<MeetingNote[]>([
    {
      id: 'MTG-001',
      projectId: 'PRJ-2025-001',
      projectName: 'Hydraulic Press Installation',
      meetingDate: '2025-10-15',
      attendees: ['Project Manager', 'ABC Manufacturing Ltd', 'Rajesh Kumar', 'Amit Patel'],
      agenda: [
        'Review site preparation completion',
        'Discuss equipment installation timeline',
        'Address customer feedback on vibration monitoring'
      ],
      discussions: [
        'Site preparation completed 2 days ahead of schedule',
        'Equipment delivery confirmed for Oct 25',
        'Customer very satisfied with vibration monitoring addition',
        'Electrical team performance was excellent'
      ],
      decisions: [
        'Proceed with equipment installation on Oct 25',
        'Allocate Amit Patel full-time for installation phase',
        'Schedule weekly progress reviews with customer'
      ],
      actionItems: [
        { item: 'Finalize installation schedule', assignedTo: 'Project Manager', dueDate: '2025-10-18', status: 'completed' },
        { item: 'Order vibration sensors', assignedTo: 'Rajesh Kumar', dueDate: '2025-10-20', status: 'in-progress' },
        { item: 'Prepare safety briefing for installation team', assignedTo: 'Amit Patel', dueDate: '2025-10-22', status: 'pending' }
      ]
    },
    {
      id: 'MTG-002',
      projectId: 'PRJ-2025-003',
      projectName: 'Automation System',
      meetingDate: '2025-10-19',
      attendees: ['Priya Sharma', 'Tech Solutions Pvt Ltd', 'QA Team', 'Finance Director'],
      agenda: [
        'Review integration testing defects',
        'Discuss timeline extension request',
        'Budget impact analysis'
      ],
      discussions: [
        '8 critical defects identified - 5 in PLC integration, 3 in SCADA interface',
        'Additional 2 weeks needed for defect resolution and retesting',
        'Customer concerned about delay but prioritizes quality',
        'Budget impact: ₹15L for extended testing period'
      ],
      decisions: [
        'Approve 2-week timeline extension',
        'Assign additional QA resource',
        'Daily defect review meetings until resolution',
        'Prepare detailed quality report for customer'
      ],
      actionItems: [
        { item: 'Create defect resolution plan', assignedTo: 'Priya Sharma', dueDate: '2025-10-20', status: 'completed' },
        { item: 'Submit change request for timeline extension', assignedTo: 'Priya Sharma', dueDate: '2025-10-20', status: 'completed' },
        { item: 'Prepare customer communication', assignedTo: 'Project Manager', dueDate: '2025-10-21', status: 'in-progress' }
      ]
    }
  ]);

  const getRoleColor = (role: StakeholderRole) => {
    switch (role) {
      case 'sponsor':
        return 'bg-purple-100 text-purple-700';
      case 'customer':
        return 'bg-blue-100 text-blue-700';
      case 'team-member':
        return 'bg-green-100 text-green-700';
      case 'vendor':
        return 'bg-orange-100 text-orange-700';
      case 'management':
        return 'bg-red-100 text-red-700';
      case 'end-user':
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: CommunicationType) => {
    switch (type) {
      case 'update':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'milestone':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'issue':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'change-request':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'risk-alert':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'meeting-notes':
        return 'bg-purple-100 text-purple-700 border-purple-300';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
    }
  };

  const getActionStatusColor = (status: 'pending' | 'in-progress' | 'completed') => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const filteredCommunications = filterType === 'all'
    ? communications
    : communications.filter(c => c.type === filterType);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-white shadow-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-teal-600" />
              Stakeholder Communication Hub
            </h2>
            <p className="text-gray-600 mt-1">Centralized communication and engagement platform</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('communications')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'communications'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Communications
            </button>
            <button
              onClick={() => setViewMode('stakeholders')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'stakeholders'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Stakeholders
            </button>
            <button
              onClick={() => setViewMode('meetings')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'meetings'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Meetings
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'communications' && (
        <>
          {/* Filter */}
          <div className="bg-white shadow-md p-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Filter by Type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="all">All Communications</option>
                <option value="update">Updates</option>
                <option value="milestone">Milestones</option>
                <option value="issue">Issues</option>
                <option value="change-request">Change Requests</option>
                <option value="risk-alert">Risk Alerts</option>
              </select>
            </div>
          </div>

          {/* Communications */}
          <div className="bg-white shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50">
              <h3 className="text-lg font-semibold text-gray-900">
                Communications ({filteredCommunications.length})
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-2">
                {filteredCommunications.map((comm) => (
                  <div key={comm.id} className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    {/* Communication Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getTypeColor(comm.type)}`}>
                            {comm.type.toUpperCase()}
                          </span>
                          <span className={`text-xs font-bold ${getPriorityColor(comm.priority)}`}>
                            {comm.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">{comm.subject}</h4>
                        <p className="text-sm text-gray-600 mt-1">{comm.projectName}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{comm.sentDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="p-4 bg-gray-50 rounded-lg mb-3">
                      <p className="text-sm text-gray-700">{comm.message}</p>
                    </div>

                    {/* Recipients & Read Status */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Recipients:</p>
                        <div className="flex flex-wrap gap-1">
                          {comm.recipients.map((recipient, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                              {recipient}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">
                          {comm.readBy.length}/{comm.recipients.length} read
                        </p>
                      </div>
                    </div>

                    {/* Responses */}
                    {comm.responses.length > 0 && (
                      <div className="border-t border-gray-200 pt-3">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Responses ({comm.responses.length}):</p>
                        <div className="space-y-2">
                          {comm.responses.map((response, idx) => (
                            <div key={idx} className="p-3 bg-teal-50 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm text-gray-900">{response.respondent}</span>
                                <span className="text-xs text-gray-600">{response.timestamp}</span>
                              </div>
                              <p className="text-sm text-gray-700">{response.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sender Info */}
                    <div className="mt-3 text-xs text-gray-600">
                      From: <span className="font-medium">{comm.sender}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {viewMode === 'stakeholders' && (
        <div className="bg-white shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Stakeholders ({stakeholders.length})
            </h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {stakeholders.map((stakeholder) => (
                <div key={stakeholder.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{stakeholder.name}</h4>
                      <p className="text-sm text-gray-600">{stakeholder.organization}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(stakeholder.role)}`}>
                      {stakeholder.role.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{stakeholder.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Bell className="h-4 w-4 text-gray-500" />
                      <span className="capitalize">Prefers: {stakeholder.preferredChannel}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Projects:</p>
                    <div className="flex flex-wrap gap-1">
                      {stakeholder.projectIds.map((projectId, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">
                          {projectId}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Notification Preferences:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(stakeholder.notificationPreferences).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-1">
                          {value ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-gray-400" />
                          )}
                          <span className="text-xs text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'meetings' && (
        <div className="bg-white shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Meeting Notes ({meetingNotes.length})
            </h3>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {meetingNotes.map((meeting) => (
                <div key={meeting.id} className="p-5 border border-gray-200 rounded-lg">
                  {/* Meeting Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{meeting.projectName}</h4>
                      <p className="text-sm text-gray-600">{meeting.id}</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{meeting.meetingDate}</span>
                    </div>
                  </div>

                  {/* Attendees */}
                  <div className="mb-2">
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Attendees:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {meeting.attendees.map((attendee, idx) => (
                        <span key={idx} className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded">
                          {attendee}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Agenda */}
                  <div className="mb-2">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Agenda:</p>
                    <ul className="space-y-1">
                      {meeting.agenda.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-teal-600 font-bold">{idx + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Discussions */}
                  <div className="mb-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-semibold text-blue-700 mb-2">Key Discussions:</p>
                    <ul className="space-y-1">
                      {meeting.discussions.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <MessageSquare className="h-3 w-3 text-blue-600 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Decisions */}
                  <div className="mb-2 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-semibold text-green-700 mb-2">Decisions Made:</p>
                    <ul className="space-y-1">
                      {meeting.decisions.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Items */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Action Items:</p>
                    <div className="space-y-2">
                      {meeting.actionItems.map((action, idx) => (
                        <div key={idx} className="p-3 bg-white border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-medium text-gray-900 flex-1">{action.item}</p>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getActionStatusColor(action.status)}`}>
                              {action.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Assigned to: <span className="font-medium">{action.assignedTo}</span></span>
                            <span>Due: {action.dueDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
