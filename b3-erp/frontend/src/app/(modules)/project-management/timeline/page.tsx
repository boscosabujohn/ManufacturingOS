'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Circle,
  Download,
  Filter,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  type: 'milestone' | 'task' | 'issue' | 'approval' | 'delivery';
  status: 'completed' | 'in-progress' | 'pending' | 'delayed';
  assignee?: string;
  phase: string;
  details?: {
    label: string;
    value: string;
  }[];
}

const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    date: '2024-01-15',
    time: '09:00 AM',
    title: 'Project Kickoff Meeting',
    description: 'Initial project kickoff with stakeholders and team members',
    type: 'milestone',
    status: 'completed',
    assignee: 'Rajesh Kumar',
    phase: 'Initiation',
    details: [
      { label: 'Attendees', value: '12 members' },
      { label: 'Duration', value: '2 hours' },
    ],
  },
  {
    id: '2',
    date: '2024-01-18',
    time: '02:30 PM',
    title: 'Site Survey Completed',
    description: 'Comprehensive site assessment and measurements completed',
    type: 'task',
    status: 'completed',
    assignee: 'Ramesh Nair',
    phase: 'Initiation',
    details: [
      { label: 'Area Covered', value: '5000 sq ft' },
      { label: 'Report Status', value: 'Submitted' },
    ],
  },
  {
    id: '3',
    date: '2024-01-25',
    time: '11:00 AM',
    title: 'Design Approval',
    description: 'Kitchen layout and equipment placement approved by client',
    type: 'approval',
    status: 'completed',
    assignee: 'Anjali Verma',
    phase: 'Planning',
    details: [
      { label: 'Revisions', value: '2' },
      { label: 'Approved By', value: 'Client & Safety Officer' },
    ],
  },
  {
    id: '4',
    date: '2024-02-01',
    time: '10:00 AM',
    title: 'Equipment Procurement Started',
    description: 'Purchase orders issued for all major kitchen equipment',
    type: 'task',
    status: 'completed',
    assignee: 'Procurement Team',
    phase: 'Procurement',
    details: [
      { label: 'Items Ordered', value: '45' },
      { label: 'Total Value', value: '₹35,00,000' },
    ],
  },
  {
    id: '5',
    date: '2024-02-15',
    time: '09:30 AM',
    title: 'First Equipment Delivery',
    description: 'Initial batch of cooking equipment arrived at warehouse',
    type: 'delivery',
    status: 'completed',
    assignee: 'Logistics Team',
    phase: 'Procurement',
    details: [
      { label: 'Items Received', value: '15' },
      { label: 'Condition', value: 'Good' },
    ],
  },
  {
    id: '6',
    date: '2024-02-28',
    time: '03:00 PM',
    title: 'Quality Inspection Issue',
    description: 'Minor defect found in refrigeration unit - replacement requested',
    type: 'issue',
    status: 'completed',
    assignee: 'Quality Team',
    phase: 'Procurement',
    details: [
      { label: 'Issue Type', value: 'Manufacturing Defect' },
      { label: 'Resolution Time', value: '5 days' },
    ],
  },
  {
    id: '7',
    date: '2024-03-05',
    time: '08:00 AM',
    title: 'Civil Work Completed',
    description: 'Floor preparation, drainage, and electrical infrastructure completed',
    type: 'milestone',
    status: 'completed',
    assignee: 'Civil Team',
    phase: 'Civil Work',
    details: [
      { label: 'Inspection Status', value: 'Passed' },
      { label: 'Completion', value: '100%' },
    ],
  },
  {
    id: '8',
    date: '2024-03-10',
    time: '10:30 AM',
    title: 'Cooking Equipment Installation',
    description: 'Installation of ranges, ovens, and grills in progress',
    type: 'task',
    status: 'in-progress',
    assignee: 'Installation Team A',
    phase: 'Installation',
    details: [
      { label: 'Progress', value: '85%' },
      { label: 'Expected Completion', value: '15-Mar-2024' },
    ],
  },
  {
    id: '9',
    date: '2024-03-15',
    time: '02:00 PM',
    title: 'Refrigeration Setup',
    description: 'Walk-in coolers and freezers installation ongoing',
    type: 'task',
    status: 'in-progress',
    assignee: 'Installation Team B',
    phase: 'Installation',
    details: [
      { label: 'Progress', value: '60%' },
      { label: 'Expected Completion', value: '20-Mar-2024' },
    ],
  },
  {
    id: '10',
    date: '2024-03-20',
    time: '09:00 AM',
    title: 'Exhaust System Delay',
    description: 'Custom exhaust hood delivery delayed by manufacturer',
    type: 'issue',
    status: 'delayed',
    assignee: 'HVAC Team',
    phase: 'Installation',
    details: [
      { label: 'Delay Duration', value: '5 days' },
      { label: 'Impact', value: 'Medium' },
    ],
  },
  {
    id: '11',
    date: '2024-03-26',
    time: '11:00 AM',
    title: 'Equipment Testing Phase',
    description: 'Begin comprehensive testing of all installed equipment',
    type: 'milestone',
    status: 'pending',
    assignee: 'Test Team',
    phase: 'Testing',
    details: [
      { label: 'Equipment Count', value: '45 items' },
      { label: 'Duration', value: '10 days' },
    ],
  },
  {
    id: '12',
    date: '2024-04-05',
    time: '10:00 AM',
    title: 'Safety Compliance Testing',
    description: 'Fire safety, gas leak detection, and emergency shutdown tests',
    type: 'task',
    status: 'pending',
    assignee: 'Safety Team',
    phase: 'Testing',
    details: [
      { label: 'Test Count', value: '12' },
      { label: 'Certification Required', value: 'Yes' },
    ],
  },
  {
    id: '13',
    date: '2024-04-13',
    time: '09:00 AM',
    title: 'Final Commissioning',
    description: 'Complete system commissioning and handover preparation',
    type: 'milestone',
    status: 'pending',
    assignee: 'Commissioning Team',
    phase: 'Commissioning',
    details: [
      { label: 'Checklist Items', value: '25' },
      { label: 'Duration', value: '7 days' },
    ],
  },
  {
    id: '14',
    date: '2024-04-21',
    time: '10:00 AM',
    title: 'Staff Training Program',
    description: 'Training kitchen staff on equipment operation and maintenance',
    type: 'task',
    status: 'pending',
    assignee: 'Training Team',
    phase: 'Handover',
    details: [
      { label: 'Trainees', value: '20 staff members' },
      { label: 'Duration', value: '5 days' },
    ],
  },
  {
    id: '15',
    date: '2024-04-30',
    time: '03:00 PM',
    title: 'Project Handover',
    description: 'Final documentation handover and project closure',
    type: 'milestone',
    status: 'pending',
    assignee: 'Rajesh Kumar',
    phase: 'Handover',
    details: [
      { label: 'Documents', value: 'Complete Set' },
      { label: 'Warranty Period', value: '2 years' },
    ],
  },
];

export default function TimelinePage() {
  const [filterPhase, setFilterPhase] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const phases = Array.from(new Set(mockTimelineEvents.map((e) => e.phase)));
  const types = Array.from(new Set(mockTimelineEvents.map((e) => e.type)));

  const filteredEvents = mockTimelineEvents.filter((event) => {
    if (filterPhase !== 'All' && event.phase !== filterPhase) return false;
    if (filterType !== 'All' && event.type !== filterType) return false;
    return true;
  });

  const toggleEventExpansion = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <CheckCircle className="w-5 h-5" />;
      case 'task':
        return <Circle className="w-5 h-5" />;
      case 'issue':
        return <AlertCircle className="w-5 h-5" />;
      case 'approval':
        return <CheckCircle className="w-5 h-5" />;
      case 'delivery':
        return <Circle className="w-5 h-5" />;
      default:
        return <Circle className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'milestone':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'task':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'issue':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'approval':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'delivery':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'delayed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Circle className="w-4 h-4 text-gray-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'delayed':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'pending':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="w-full h-screen overflow-y-auto overflow-x-hidden">
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Actions */}
        <div className="flex justify-end mb-4">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          <select
            value={filterPhase}
            onChange={(e) => setFilterPhase(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="All">All Phases</option>
            {phases.map((phase) => (
              <option key={phase} value={phase}>
                {phase}
              </option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="All">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

          {/* Timeline Events */}
          <div className="space-y-6">
            {filteredEvents.map((event, index) => {
              const isExpanded = expandedEvents.has(event.id);
              return (
                <div key={event.id} className="relative pl-20">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-6 w-5 h-5 rounded-full border-4 ${
                      event.status === 'completed'
                        ? 'bg-green-500 border-green-200'
                        : event.status === 'in-progress'
                        ? 'bg-blue-500 border-blue-200'
                        : event.status === 'delayed'
                        ? 'bg-red-500 border-red-200'
                        : 'bg-gray-300 border-gray-100'
                    }`}
                    style={{ top: '1.5rem' }}
                  ></div>

                  {/* Event Card */}
                  <div className="bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => toggleEventExpansion(event.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span className="font-medium">
                                {new Date(event.date).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                              <Clock className="w-4 h-4 ml-2" />
                              <span>{event.time}</span>
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium border ${getTypeColor(
                                event.type
                              )}`}
                            >
                              {event.type.charAt(0).toUpperCase() +
                                event.type.slice(1)}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadge(
                                event.status
                              )}`}
                            >
                              {event.status.charAt(0).toUpperCase() +
                                event.status.slice(1)}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {event.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              <strong>Phase:</strong> {event.phase}
                            </span>
                            {event.assignee && (
                              <span>
                                <strong>Assignee:</strong> {event.assignee}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && event.details && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Additional Details
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {event.details.map((detail, idx) => (
                              <div key={idx} className="text-sm">
                                <span className="text-gray-600">
                                  {detail.label}:
                                </span>{' '}
                                <span className="font-medium text-gray-900">
                                  {detail.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Events</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {filteredEvents.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {filteredEvents.filter((e) => e.status === 'completed').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {filteredEvents.filter((e) => e.status === 'in-progress').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Delayed</p>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {filteredEvents.filter((e) => e.status === 'delayed').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {filteredEvents.filter((e) => e.status === 'pending').length}
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
