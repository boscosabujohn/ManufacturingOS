'use client';

import { useState } from 'react';
import { Activity, CheckSquare, Calendar, Phone, Mail, Users, Clock, TrendingUp, Target, AlertCircle, CheckCircle, XCircle, BarChart3, PieChart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ActivityStats {
  type: string;
  count: number;
  completed: number;
  pending: number;
  overdue: number;
  icon: any;
  color: string;
  href: string;
}

interface RecentActivity {
  id: string;
  type: 'task' | 'meeting' | 'call' | 'email';
  title: string;
  description: string;
  assignedTo: string;
  relatedTo: string;
  status: 'completed' | 'pending' | 'overdue' | 'scheduled';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completedDate?: string;
  duration?: number;
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  tasksCompleted: number;
  tasksTotal: number;
  meetingsToday: number;
  callsToday: number;
  emailsSent: number;
  productivityScore: number;
}

const activityStats: ActivityStats[] = [
  {
    type: 'Tasks',
    count: 342,
    completed: 256,
    pending: 68,
    overdue: 18,
    icon: CheckSquare,
    color: 'blue',
    href: '/crm/activities/tasks',
  },
  {
    type: 'Meetings',
    count: 127,
    completed: 89,
    pending: 35,
    overdue: 3,
    icon: Users,
    color: 'purple',
    href: '/crm/activities/meetings',
  },
  {
    type: 'Calls',
    count: 456,
    completed: 398,
    pending: 52,
    overdue: 6,
    icon: Phone,
    color: 'green',
    href: '/crm/activities/calls',
  },
  {
    type: 'Emails',
    count: 1284,
    completed: 1203,
    pending: 81,
    overdue: 0,
    icon: Mail,
    color: 'orange',
    href: '/crm/activities/emails',
  },
];

const mockRecentActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'task',
    title: 'Follow up with TechCorp on proposal',
    description: 'Send detailed pricing breakdown and timeline',
    assignedTo: 'Sarah Johnson',
    relatedTo: 'TechCorp Global Inc.',
    status: 'overdue',
    priority: 'high',
    dueDate: '2024-10-18T15:00:00',
  },
  {
    id: '2',
    type: 'meeting',
    title: 'Product Demo - Enterprise Solutions',
    description: 'Demonstrate new features to potential client',
    assignedTo: 'Michael Chen',
    relatedTo: 'Enterprise Solutions Ltd.',
    status: 'scheduled',
    priority: 'high',
    dueDate: '2024-10-21T14:00:00',
    duration: 60,
  },
  {
    id: '3',
    type: 'call',
    title: 'Discovery Call - FinanceHub',
    description: 'Understand requirements and pain points',
    assignedTo: 'Emily Rodriguez',
    relatedTo: 'FinanceHub International',
    status: 'completed',
    priority: 'medium',
    dueDate: '2024-10-20T10:00:00',
    completedDate: '2024-10-20T10:35:00',
    duration: 35,
  },
  {
    id: '4',
    type: 'email',
    title: 'Contract Review Request',
    description: 'Send updated contract for legal review',
    assignedTo: 'David Martinez',
    relatedTo: 'GlobalMfg Corp',
    status: 'pending',
    priority: 'high',
    dueDate: '2024-10-21T09:00:00',
  },
  {
    id: '5',
    type: 'task',
    title: 'Prepare Q4 sales presentation',
    description: 'Create slides and gather metrics',
    assignedTo: 'Sarah Johnson',
    relatedTo: 'Internal',
    status: 'pending',
    priority: 'medium',
    dueDate: '2024-10-22T17:00:00',
  },
  {
    id: '6',
    type: 'meeting',
    title: 'Weekly Team Sync',
    description: 'Review pipeline and goals',
    assignedTo: 'Team',
    relatedTo: 'Internal',
    status: 'completed',
    priority: 'low',
    dueDate: '2024-10-20T09:00:00',
    completedDate: '2024-10-20T10:00:00',
    duration: 60,
  },
  {
    id: '7',
    type: 'call',
    title: 'Follow-up Call - StartupTech',
    description: 'Discuss pricing and next steps',
    assignedTo: 'Michael Chen',
    relatedTo: 'StartupTech Inc.',
    status: 'pending',
    priority: 'medium',
    dueDate: '2024-10-21T11:00:00',
    duration: 30,
  },
  {
    id: '8',
    type: 'email',
    title: 'Monthly Newsletter',
    description: 'Send product updates to customer list',
    assignedTo: 'Emily Rodriguez',
    relatedTo: 'Marketing',
    status: 'completed',
    priority: 'low',
    dueDate: '2024-10-19T12:00:00',
    completedDate: '2024-10-19T11:45:00',
  },
];

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'SJ',
    role: 'Senior Sales Executive',
    tasksCompleted: 42,
    tasksTotal: 48,
    meetingsToday: 3,
    callsToday: 5,
    emailsSent: 28,
    productivityScore: 94,
  },
  {
    id: '2',
    name: 'Michael Chen',
    avatar: 'MC',
    role: 'Account Manager',
    tasksCompleted: 38,
    tasksTotal: 45,
    meetingsToday: 2,
    callsToday: 7,
    emailsSent: 32,
    productivityScore: 88,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    avatar: 'ER',
    role: 'Sales Representative',
    tasksCompleted: 35,
    tasksTotal: 42,
    meetingsToday: 4,
    callsToday: 6,
    emailsSent: 25,
    productivityScore: 86,
  },
  {
    id: '4',
    name: 'David Martinez',
    avatar: 'DM',
    role: 'Business Development',
    tasksCompleted: 31,
    tasksTotal: 40,
    meetingsToday: 2,
    callsToday: 4,
    emailsSent: 19,
    productivityScore: 82,
  },
];

export default function ActivitiesPage() {
  const [activities] = useState<RecentActivity[]>(mockRecentActivities);
  const [teamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('week');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task':
        return CheckSquare;
      case 'meeting':
        return Users;
      case 'call':
        return Phone;
      case 'email':
        return Mail;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'task':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'meeting':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'call':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'email':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 border-blue-200';
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

  const getProductivityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const totalStats = {
    totalActivities: activityStats.reduce((sum, stat) => sum + stat.count, 0),
    totalCompleted: activityStats.reduce((sum, stat) => sum + stat.completed, 0),
    totalPending: activityStats.reduce((sum, stat) => sum + stat.pending, 0),
    totalOverdue: activityStats.reduce((sum, stat) => sum + stat.overdue, 0),
    completionRate: (activityStats.reduce((sum, stat) => sum + stat.completed, 0) / activityStats.reduce((sum, stat) => sum + stat.count, 0)) * 100,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activities Overview</h1>
            <p className="text-gray-600 mt-1">Track and manage all CRM activities</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeFilter('today')}
              className={`px-4 py-2 rounded-lg ${timeFilter === 'today' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-4 py-2 rounded-lg ${timeFilter === 'week' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-4 py-2 rounded-lg ${timeFilter === 'month' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
            >
              This Month
            </button>
          </div>
        </div>

        {/* Overall Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{totalStats.totalActivities}</div>
            <div className="text-blue-100">Total Activities</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{totalStats.totalCompleted}</div>
            <div className="text-green-100">Completed</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{totalStats.totalPending}</div>
            <div className="text-yellow-100">Pending</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{totalStats.totalOverdue}</div>
            <div className="text-red-100">Overdue</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{totalStats.completionRate.toFixed(1)}%</div>
            <div className="text-purple-100">Completion Rate</div>
          </div>
        </div>

        {/* Activity Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {activityStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.type} href={stat.href}>
                <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${getActivityColor(stat.type.toLowerCase())}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{stat.type}</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total</span>
                      <span className="text-lg font-bold text-gray-900">{stat.count}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-600">Completed</span>
                      <span className="text-lg font-bold text-green-600">{stat.completed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-yellow-600">Pending</span>
                      <span className="text-lg font-bold text-yellow-600">{stat.pending}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-red-600">Overdue</span>
                      <span className="text-lg font-bold text-red-600">{stat.overdue}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Completion Rate</span>
                      <span className="text-xs font-bold text-gray-900">
                        {((stat.completed / stat.count) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(stat.completed / stat.count) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
              <Link href="/crm/activities/calendar" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Calendar
              </Link>
            </div>

            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{activity.title}</h3>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>👤 {activity.assignedTo}</span>
                          <span>•</span>
                          <span>🏢 {activity.relatedTo}</span>
                          <span>•</span>
                          <span className={`font-medium ${getPriorityColor(activity.priority)}`}>
                            {activity.priority.toUpperCase()} Priority
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Due: {new Date(activity.dueDate).toLocaleString()}
                          </span>
                          {activity.completedDate && (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-3 h-3" />
                              Completed: {new Date(activity.completedDate).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Team Performance */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Team Performance</h2>

            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {member.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-xs text-gray-600">{member.role}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tasks</span>
                      <span className="font-medium">{member.tasksCompleted}/{member.tasksTotal}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${(member.tasksCompleted / member.tasksTotal) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center mb-3">
                    <div className="bg-purple-50 rounded p-2">
                      <div className="text-xs text-purple-600 mb-1">Meetings</div>
                      <div className="text-lg font-bold text-purple-900">{member.meetingsToday}</div>
                    </div>
                    <div className="bg-green-50 rounded p-2">
                      <div className="text-xs text-green-600 mb-1">Calls</div>
                      <div className="text-lg font-bold text-green-900">{member.callsToday}</div>
                    </div>
                    <div className="bg-orange-50 rounded p-2">
                      <div className="text-xs text-orange-600 mb-1">Emails</div>
                      <div className="text-lg font-bold text-orange-900">{member.emailsSent}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-600">Productivity Score</span>
                    <span className={`text-lg font-bold ${getProductivityColor(member.productivityScore)}`}>
                      {member.productivityScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
