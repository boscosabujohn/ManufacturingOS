'use client';

import React, { useState } from 'react';
import {
  RealTimeCollaborationPanel,
  TeamChatIntegration,
  HandoffChecklists,
  CrossFunctionalTimeline,
  CustomerPortal
} from '@/components/industry4';

type CollaborationTab = 'overview' | 'team' | 'chat' | 'handoff' | 'timeline' | 'customer';

export default function CollaborationDashboardPage() {
  const [activeTab, setActiveTab] = useState<CollaborationTab>('overview');

  const tabs: { id: CollaborationTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'team', label: 'Team Activity', icon: '👥' },
    { id: 'chat', label: 'Team Chat', icon: '💬' },
    { id: 'handoff', label: 'Shift Handoff', icon: '🔄' },
    { id: 'timeline', label: 'Project Timeline', icon: '📅' },
    { id: 'customer', label: 'Customer Portal', icon: '🌐' },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm">Team Online</p>
              <p className="text-4xl font-bold mt-1">12</p>
              <p className="text-blue-100 text-xs mt-2">of 18 team members</p>
            </div>
            <div className="text-3xl opacity-80">👥</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 text-sm">Active Conversations</p>
              <p className="text-4xl font-bold mt-1">8</p>
              <p className="text-green-100 text-xs mt-2">3 unread messages</p>
            </div>
            <div className="text-3xl opacity-80">💬</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-amber-100 text-sm">Pending Handoffs</p>
              <p className="text-4xl font-bold mt-1">2</p>
              <p className="text-amber-100 text-xs mt-2">Next shift in 2h</p>
            </div>
            <div className="text-3xl opacity-80">🔄</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm">Customer Approvals</p>
              <p className="text-4xl font-bold mt-1">3</p>
              <p className="text-purple-100 text-xs mt-2">Awaiting response</p>
            </div>
            <div className="text-3xl opacity-80">✓</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Team Activity - Compact */}
        <div className="col-span-1">
          <RealTimeCollaborationPanel compact />

          {/* Quick Actions */}
          <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('chat')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">💬</div>
                <div>
                  <div className="font-medium text-sm">Start Chat</div>
                  <div className="text-xs text-gray-500">Message your team</div>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('handoff')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-xl">🔄</div>
                <div>
                  <div className="font-medium text-sm">Shift Handoff</div>
                  <div className="text-xs text-gray-500">Start handoff checklist</div>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">📅</div>
                <div>
                  <div className="font-medium text-sm">View Timeline</div>
                  <div className="text-xs text-gray-500">Project milestones</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Activity Feed</h3>
            <div className="space-y-4">
              {[
                { user: 'Sarah Chen', avatar: 'SC', action: 'completed milestone', target: 'Phase 1 Inspection', time: '5m ago', type: 'milestone' },
                { user: 'Mike Rodriguez', avatar: 'MR', action: 'uploaded', target: 'QC Report #547', time: '15m ago', type: 'document' },
                { user: 'James Park', avatar: 'JP', action: 'started shift handoff', target: 'Morning → Afternoon', time: '20m ago', type: 'handoff' },
                { user: 'Emily Watson', avatar: 'EW', action: 'approved', target: 'Material Order #892', time: '35m ago', type: 'approval' },
                { user: 'David Kim', avatar: 'DK', action: 'commented on', target: 'Work Order #1547', time: '45m ago', type: 'comment' },
                { user: 'Lisa Thompson', avatar: 'LT', action: 'updated', target: 'Design Drawing v2.3', time: '1h ago', type: 'update' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                    {activity.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">
                      <span className="font-medium text-gray-800">{activity.user}</span>
                      <span className="text-gray-600"> {activity.action} </span>
                      <span className="font-medium text-blue-600">{activity.target}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{activity.time}</div>
                  </div>
                  <div className="flex-shrink-0">
                    {activity.type === 'milestone' && <span className="text-lg">🎯</span>}
                    {activity.type === 'document' && <span className="text-lg">📄</span>}
                    {activity.type === 'handoff' && <span className="text-lg">🔄</span>}
                    {activity.type === 'approval' && <span className="text-lg">✓</span>}
                    {activity.type === 'comment' && <span className="text-lg">💬</span>}
                    {activity.type === 'update' && <span className="text-lg">📝</span>}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-center text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              View All Activity →
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 gap-6">
        <div
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setActiveTab('timeline')}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">📅</div>
            <div>
              <h3 className="font-semibold text-gray-800">Cross-Functional Timeline</h3>
              <p className="text-sm text-gray-500">Unified view of all project milestones</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">5</div>
              <div className="text-xs text-gray-500">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">12</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-amber-600">3</div>
              <div className="text-xs text-gray-500">Upcoming</div>
            </div>
          </div>
        </div>

        <div
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setActiveTab('customer')}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">🌐</div>
            <div>
              <h3 className="font-semibold text-gray-800">Customer Portal</h3>
              <p className="text-sm text-gray-500">Client-facing project status & approvals</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">8</div>
              <div className="text-xs text-gray-500">Active Orders</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-amber-600">3</div>
              <div className="text-xs text-gray-500">Pending Approvals</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">15</div>
              <div className="text-xs text-gray-500">Documents Shared</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Production</span>
          <span>/</span>
          <span className="text-gray-800">Collaborative Manufacturing</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Collaborative Manufacturing</h1>
            <p className="text-gray-600 mt-1">Real-time team collaboration, communication, and customer engagement</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['SC', 'MR', 'JP', 'EW', 'DK'].map((avatar, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                >
                  {avatar}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                +7
              </div>
            </div>
            <span className="text-sm text-gray-500">12 online</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'team' && <RealTimeCollaborationPanel />}
      {activeTab === 'chat' && <TeamChatIntegration />}
      {activeTab === 'handoff' && <HandoffChecklists />}
      {activeTab === 'timeline' && <CrossFunctionalTimeline />}
      {activeTab === 'customer' && <CustomerPortal />}
    </div>
  );
}
