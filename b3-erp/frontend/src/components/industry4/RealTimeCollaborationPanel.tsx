'use client';

import React, { useState, useEffect } from 'react';

// Types
export type UserStatus = 'online' | 'away' | 'busy' | 'offline';
export type ActivityType = 'viewing' | 'editing' | 'commenting' | 'approving';
export type ResourceType = 'work_order' | 'project' | 'document' | 'drawing' | 'bom' | 'schedule';

export interface ActiveUser {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  status: UserStatus;
  lastActive: Date;
  currentActivity: {
    type: ActivityType;
    resourceType: ResourceType;
    resourceId: string;
    resourceName: string;
    startedAt: Date;
  } | null;
}

export interface ResourceActivity {
  resourceId: string;
  resourceName: string;
  resourceType: ResourceType;
  viewers: ActiveUser[];
  editors: ActiveUser[];
  lastModified: Date;
  modifiedBy: string;
}

export interface RecentActivity {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  resourceType: ResourceType;
  resourceId?: string;
  resourceName: string;
  timestamp: Date;
  details?: string;
}

interface RealTimeCollaborationPanelProps {
  className?: string;
  compact?: boolean;
}

// Mock data generators
const generateActiveUsers = (): ActiveUser[] => [
  {
    id: 'u1',
    name: 'Sarah Chen',
    avatar: 'SC',
    role: 'Production Manager',
    department: 'Production',
    status: 'online',
    lastActive: new Date(),
    currentActivity: {
      type: 'viewing',
      resourceType: 'work_order',
      resourceId: 'WO-2024-1547',
      resourceName: 'Assembly Order #1547',
      startedAt: new Date(Date.now() - 15 * 60 * 1000)
    }
  },
  {
    id: 'u2',
    name: 'Mike Rodriguez',
    avatar: 'MR',
    role: 'Quality Engineer',
    department: 'Quality',
    status: 'online',
    lastActive: new Date(),
    currentActivity: {
      type: 'editing',
      resourceType: 'document',
      resourceId: 'DOC-QC-445',
      resourceName: 'Inspection Report #445',
      startedAt: new Date(Date.now() - 5 * 60 * 1000)
    }
  },
  {
    id: 'u3',
    name: 'Emily Watson',
    avatar: 'EW',
    role: 'Supply Chain Lead',
    department: 'Supply Chain',
    status: 'busy',
    lastActive: new Date(Date.now() - 2 * 60 * 1000),
    currentActivity: {
      type: 'approving',
      resourceType: 'bom',
      resourceId: 'BOM-2024-089',
      resourceName: 'Product BOM Rev C',
      startedAt: new Date(Date.now() - 8 * 60 * 1000)
    }
  },
  {
    id: 'u4',
    name: 'James Park',
    avatar: 'JP',
    role: 'Shop Floor Supervisor',
    department: 'Production',
    status: 'online',
    lastActive: new Date(),
    currentActivity: {
      type: 'viewing',
      resourceType: 'schedule',
      resourceId: 'SCH-W48',
      resourceName: 'Week 48 Schedule',
      startedAt: new Date(Date.now() - 3 * 60 * 1000)
    }
  },
  {
    id: 'u5',
    name: 'Lisa Thompson',
    avatar: 'LT',
    role: 'Design Engineer',
    department: 'Engineering',
    status: 'away',
    lastActive: new Date(Date.now() - 15 * 60 * 1000),
    currentActivity: null
  },
  {
    id: 'u6',
    name: 'David Kim',
    avatar: 'DK',
    role: 'Maintenance Tech',
    department: 'Maintenance',
    status: 'online',
    lastActive: new Date(),
    currentActivity: {
      type: 'commenting',
      resourceType: 'work_order',
      resourceId: 'WO-2024-1542',
      resourceName: 'Maintenance Order #1542',
      startedAt: new Date(Date.now() - 1 * 60 * 1000)
    }
  },
  {
    id: 'u7',
    name: 'Anna Martinez',
    avatar: 'AM',
    role: 'Planner',
    department: 'Planning',
    status: 'offline',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    currentActivity: null
  }
];

const generateResourceActivities = (): ResourceActivity[] => [
  {
    resourceId: 'WO-2024-1547',
    resourceName: 'Assembly Order #1547',
    resourceType: 'work_order',
    viewers: generateActiveUsers().filter(u => u.id === 'u1'),
    editors: [],
    lastModified: new Date(Date.now() - 30 * 60 * 1000),
    modifiedBy: 'James Park'
  },
  {
    resourceId: 'DOC-QC-445',
    resourceName: 'Inspection Report #445',
    resourceType: 'document',
    viewers: [],
    editors: generateActiveUsers().filter(u => u.id === 'u2'),
    lastModified: new Date(Date.now() - 5 * 60 * 1000),
    modifiedBy: 'Mike Rodriguez'
  },
  {
    resourceId: 'PRJ-2024-022',
    resourceName: 'Customer Project Alpha',
    resourceType: 'project',
    viewers: generateActiveUsers().filter(u => ['u1', 'u4'].includes(u.id)),
    editors: generateActiveUsers().filter(u => u.id === 'u3'),
    lastModified: new Date(Date.now() - 1 * 60 * 60 * 1000),
    modifiedBy: 'Emily Watson'
  }
];

const generateRecentActivities = (): RecentActivity[] => [
  {
    id: 'ra1',
    userId: 'u2',
    userName: 'Mike Rodriguez',
    userAvatar: 'MR',
    action: 'updated',
    resourceType: 'document',
    resourceName: 'Inspection Report #445',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    details: 'Added quality measurements'
  },
  {
    id: 'ra2',
    userId: 'u3',
    userName: 'Emily Watson',
    userAvatar: 'EW',
    action: 'approved',
    resourceType: 'bom',
    resourceName: 'Product BOM Rev C',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    details: 'Approved for production'
  },
  {
    id: 'ra3',
    userId: 'u4',
    userName: 'James Park',
    userAvatar: 'JP',
    action: 'completed',
    resourceType: 'work_order',
    resourceId: 'WO-2024-1545',
    resourceName: 'Work Order #1545',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    details: '150 units completed'
  },
  {
    id: 'ra4',
    userId: 'u6',
    userName: 'David Kim',
    userAvatar: 'DK',
    action: 'commented on',
    resourceType: 'work_order',
    resourceName: 'Maintenance Order #1542',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    details: 'Parts received, starting repair'
  },
  {
    id: 'ra5',
    userId: 'u1',
    userName: 'Sarah Chen',
    userAvatar: 'SC',
    action: 'created',
    resourceType: 'schedule',
    resourceName: 'Week 49 Schedule',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    details: 'Draft schedule for review'
  },
  {
    id: 'ra6',
    userId: 'u5',
    userName: 'Lisa Thompson',
    userAvatar: 'LT',
    action: 'uploaded',
    resourceType: 'drawing',
    resourceName: 'Assembly Drawing v2.3',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    details: 'Updated tolerances'
  }
];

const RealTimeCollaborationPanel: React.FC<RealTimeCollaborationPanelProps> = ({ className = '', compact = false }) => {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [resourceActivities, setResourceActivities] = useState<ResourceActivity[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'resources' | 'activity'>('users');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  useEffect(() => {
    setActiveUsers(generateActiveUsers());
    setResourceActivities(generateResourceActivities());
    setRecentActivities(generateRecentActivities());

    // Simulate real-time updates
    const interval = setInterval(() => {
      setActiveUsers(prev => prev.map(user => ({
        ...user,
        lastActive: user.status === 'online' ? new Date() : user.lastActive
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: UserStatus): string => {
    switch (status) {
      case 'online': return '#22c55e';
      case 'away': return '#eab308';
      case 'busy': return '#dc2626';
      case 'offline': return '#9ca3af';
    }
  };

  const getActivityColor = (type: ActivityType): string => {
    switch (type) {
      case 'viewing': return '#3b82f6';
      case 'editing': return '#f59e0b';
      case 'commenting': return '#8b5cf6';
      case 'approving': return '#22c55e';
    }
  };

  const getResourceIcon = (type: ResourceType): string => {
    switch (type) {
      case 'work_order': return '📋';
      case 'project': return '📁';
      case 'document': return '📄';
      case 'drawing': return '📐';
      case 'bom': return '📦';
      case 'schedule': return '📅';
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const departments = ['all', ...Array.from(new Set(activeUsers.map(u => u.department)))];
  const filteredUsers = activeUsers.filter(u =>
    selectedDepartment === 'all' || u.department === selectedDepartment
  );

  const onlineCount = activeUsers.filter(u => u.status === 'online').length;
  const busyCount = activeUsers.filter(u => u.status === 'busy').length;

  const renderUsers = () => (
    <div className="space-y-3">
      {/* Department Filter */}
      <div className="flex gap-1 flex-wrap">
        {departments.map(dept => (
          <button
            key={dept}
            onClick={() => setSelectedDepartment(dept)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              selectedDepartment === dept
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {dept === 'all' ? 'All Teams' : dept}
          </button>
        ))}
      </div>

      {/* User List */}
      <div className="space-y-2">
        {filteredUsers.map(user => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                {user.avatar}
              </div>
              <div
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
                style={{ backgroundColor: getStatusColor(user.status) }}
              ></div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-gray-800 truncate">{user.name}</span>
                {user.currentActivity && (
                  <span
                    className="px-1.5 py-0.5 rounded text-xs font-medium text-white"
                    style={{ backgroundColor: getActivityColor(user.currentActivity.type) }}
                  >
                    {user.currentActivity.type}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {user.currentActivity ? (
                  <span className="flex items-center gap-1">
                    <span>{getResourceIcon(user.currentActivity.resourceType)}</span>
                    {user.currentActivity.resourceName}
                  </span>
                ) : (
                  <span>{user.role} • {formatTimeAgo(user.lastActive)}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1">
              <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-3">
      {resourceActivities.map(resource => (
        <div
          key={resource.resourceId}
          className="bg-white border border-gray-200 rounded-lg p-3"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getResourceIcon(resource.resourceType)}</span>
              <div>
                <div className="font-medium text-sm text-gray-800">{resource.resourceName}</div>
                <div className="text-xs text-gray-500">{resource.resourceId}</div>
              </div>
            </div>
          </div>

          {/* Active Users on Resource */}
          <div className="flex items-center gap-2 mt-2">
            {resource.editors.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-amber-600 font-medium">Editing:</span>
                <div className="flex -space-x-2">
                  {resource.editors.map(user => (
                    <div
                      key={user.id}
                      className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                      title={user.name}
                    >
                      {user.avatar}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {resource.viewers.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-blue-600 font-medium">Viewing:</span>
                <div className="flex -space-x-2">
                  {resource.viewers.map(user => (
                    <div
                      key={user.id}
                      className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                      title={user.name}
                    >
                      {user.avatar}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-400 mt-2">
            Last modified by {resource.modifiedBy} • {formatTimeAgo(resource.lastModified)}
          </div>
        </div>
      ))}
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-2">
      {recentActivities.map(activity => (
        <div
          key={activity.id}
          className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            {activity.userAvatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm">
              <span className="font-medium text-gray-800">{activity.userName}</span>
              <span className="text-gray-600"> {activity.action} </span>
              <span className="font-medium text-blue-600">{activity.resourceName}</span>
            </div>
            {activity.details && (
              <div className="text-xs text-gray-500 mt-0.5">{activity.details}</div>
            )}
            <div className="text-xs text-gray-400 mt-0.5">{formatTimeAgo(activity.timestamp)}</div>
          </div>
          <span className="text-lg flex-shrink-0">{getResourceIcon(activity.resourceType)}</span>
        </div>
      ))}
    </div>
  );

  if (compact) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Team Activity</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">{onlineCount} online</span>
            </div>
          </div>
        </div>
        <div className="flex -space-x-2">
          {activeUsers.filter(u => u.status === 'online').slice(0, 5).map(user => (
            <div
              key={user.id}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
              title={`${user.name} - ${user.currentActivity?.resourceName || 'Active'}`}
            >
              {user.avatar}
            </div>
          ))}
          {onlineCount > 5 && (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
              +{onlineCount - 5}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Real-Time Collaboration</h2>
          <p className="text-sm text-gray-600">See who&apos;s working on what right now</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <span className="text-gray-600">{onlineCount} online</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <span className="text-gray-600">{busyCount} busy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(['users', 'resources', 'activity'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab === 'users' && '👥 Team'}
            {tab === 'resources' && '📁 Resources'}
            {tab === 'activity' && '📊 Activity'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'resources' && renderResources()}
        {activeTab === 'activity' && renderActivity()}
      </div>
    </div>
  );
};

export default RealTimeCollaborationPanel;
