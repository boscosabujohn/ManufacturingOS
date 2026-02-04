'use client';

import React, { useState, useEffect } from 'react';

// Types
export type MilestoneType = 'sales' | 'engineering' | 'procurement' | 'production' | 'quality' | 'shipping' | 'delivery';
export type MilestoneStatus = 'completed' | 'in_progress' | 'upcoming' | 'delayed' | 'at_risk';

export interface Milestone {
  id: string;
  name: string;
  description: string;
  type: MilestoneType;
  status: MilestoneStatus;
  plannedDate: Date;
  actualDate?: Date;
  owner: string;
  ownerAvatar: string;
  department: string;
  dependencies: string[];
  progress: number; // 0-100
  notes?: string;
  attachments?: number;
  comments?: number;
}

export interface Project {
  id: string;
  name: string;
  customer: string;
  startDate: Date;
  endDate: Date;
  status: 'on_track' | 'at_risk' | 'delayed';
  milestones: Milestone[];
  overallProgress: number;
}

interface CrossFunctionalTimelineProps {
  className?: string;
  projectId?: string;
}

// Mock data
const generateProject = (): Project => ({
  id: 'PRJ-2024-022',
  name: 'Customer Project Alpha',
  customer: 'Acme Corporation',
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  status: 'on_track',
  overallProgress: 58,
  milestones: [
    {
      id: 'ms1',
      name: 'Order Confirmation',
      description: 'Sales order finalized and confirmed with customer',
      type: 'sales',
      status: 'completed',
      plannedDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      actualDate: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
      owner: 'Lisa Chen',
      ownerAvatar: 'LC',
      department: 'Sales',
      dependencies: [],
      progress: 100,
      notes: 'Signed ahead of schedule'
    },
    {
      id: 'ms2',
      name: 'Design Review',
      description: 'Engineering design review and approval',
      type: 'engineering',
      status: 'completed',
      plannedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      actualDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      owner: 'Tom Wright',
      ownerAvatar: 'TW',
      department: 'Engineering',
      dependencies: ['ms1'],
      progress: 100,
      attachments: 5
    },
    {
      id: 'ms3',
      name: 'Material Procurement',
      description: 'All materials ordered and delivery scheduled',
      type: 'procurement',
      status: 'completed',
      plannedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      actualDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      owner: 'Emily Watson',
      ownerAvatar: 'EW',
      department: 'Procurement',
      dependencies: ['ms2'],
      progress: 100,
      notes: '2 days delay due to supplier lead time'
    },
    {
      id: 'ms4',
      name: 'Production Start',
      description: 'Manufacturing production begins',
      type: 'production',
      status: 'completed',
      plannedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      actualDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      owner: 'James Park',
      ownerAvatar: 'JP',
      department: 'Production',
      dependencies: ['ms3'],
      progress: 100
    },
    {
      id: 'ms5',
      name: 'Phase 1 Complete',
      description: 'First batch production completed',
      type: 'production',
      status: 'in_progress',
      plannedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      owner: 'James Park',
      ownerAvatar: 'JP',
      department: 'Production',
      dependencies: ['ms4'],
      progress: 75,
      notes: 'On track for completion',
      comments: 3
    },
    {
      id: 'ms6',
      name: 'Quality Inspection',
      description: 'Full quality inspection and testing',
      type: 'quality',
      status: 'upcoming',
      plannedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      owner: 'Mike Rodriguez',
      ownerAvatar: 'MR',
      department: 'Quality',
      dependencies: ['ms5'],
      progress: 0
    },
    {
      id: 'ms7',
      name: 'Phase 2 Complete',
      description: 'Final batch production completed',
      type: 'production',
      status: 'upcoming',
      plannedDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      owner: 'James Park',
      ownerAvatar: 'JP',
      department: 'Production',
      dependencies: ['ms6'],
      progress: 0
    },
    {
      id: 'ms8',
      name: 'Final QC & Packaging',
      description: 'Final quality check and packaging for shipment',
      type: 'quality',
      status: 'upcoming',
      plannedDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      owner: 'Mike Rodriguez',
      ownerAvatar: 'MR',
      department: 'Quality',
      dependencies: ['ms7'],
      progress: 0
    },
    {
      id: 'ms9',
      name: 'Shipment',
      description: 'Products shipped to customer',
      type: 'shipping',
      status: 'upcoming',
      plannedDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      owner: 'Sarah Chen',
      ownerAvatar: 'SC',
      department: 'Logistics',
      dependencies: ['ms8'],
      progress: 0
    },
    {
      id: 'ms10',
      name: 'Customer Delivery',
      description: 'Delivery confirmed at customer site',
      type: 'delivery',
      status: 'upcoming',
      plannedDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
      owner: 'Lisa Chen',
      ownerAvatar: 'LC',
      department: 'Sales',
      dependencies: ['ms9'],
      progress: 0
    }
  ]
});

const CrossFunctionalTimeline: React.FC<CrossFunctionalTimelineProps> = ({ className = '' }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'list' | 'gantt'>('timeline');
  const [filterType, setFilterType] = useState<MilestoneType | 'all'>('all');
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    setProject(generateProject());
  }, []);

  const getMilestoneTypeColor = (type: MilestoneType): string => {
    switch (type) {
      case 'sales': return '#8b5cf6';
      case 'engineering': return '#3b82f6';
      case 'procurement': return '#f59e0b';
      case 'production': return '#22c55e';
      case 'quality': return '#06b6d4';
      case 'shipping': return '#ec4899';
      case 'delivery': return '#10b981';
    }
  };

  const getMilestoneTypeIcon = (type: MilestoneType): string => {
    switch (type) {
      case 'sales': return '💼';
      case 'engineering': return '📐';
      case 'procurement': return '📦';
      case 'production': return '🏭';
      case 'quality': return '✓';
      case 'shipping': return '🚚';
      case 'delivery': return '📍';
    }
  };

  const getStatusColor = (status: MilestoneStatus): string => {
    switch (status) {
      case 'completed': return '#22c55e';
      case 'in_progress': return '#3b82f6';
      case 'upcoming': return '#9ca3af';
      case 'delayed': return '#dc2626';
      case 'at_risk': return '#f59e0b';
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDaysFromNow = (date: Date): number => {
    return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  if (!project) return null;

  const filteredMilestones = project.milestones.filter(m =>
    filterType === 'all' || m.type === filterType
  );

  const milestoneTypes: MilestoneType[] = ['sales', 'engineering', 'procurement', 'production', 'quality', 'shipping', 'delivery'];

  const renderTimeline = () => (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

      {/* Milestones */}
      <div className="space-y-3">
        {filteredMilestones.map((milestone, idx) => {
          const daysFromNow = getDaysFromNow(milestone.plannedDate);
          const isToday = daysFromNow === 0;
          const isPast = daysFromNow < 0;

          return (
            <div
              key={milestone.id}
              className="relative flex gap-3 cursor-pointer"
              onClick={() => setSelectedMilestone(milestone)}
            >
              {/* Timeline Node */}
              <div className="relative z-10">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-4 border-white shadow-lg ${
                    milestone.status === 'completed' ? 'bg-green-500' :
                    milestone.status === 'in_progress' ? 'bg-blue-500' :
                    'bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: milestone.status === 'completed' || milestone.status === 'in_progress'
                      ? getMilestoneTypeColor(milestone.type)
                      : undefined
                  }}
                >
                  {milestone.status === 'completed' ? (
                    <span className="text-white text-xl">✓</span>
                  ) : (
                    getMilestoneTypeIcon(milestone.type)
                  )}
                </div>

                {/* Progress ring for in-progress */}
                {milestone.status === 'in_progress' && (
                  <svg className="absolute inset-0 w-16 h-16 -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="white"
                      strokeWidth="4"
                      strokeDasharray={`${milestone.progress * 1.76} 176`}
                      opacity="0.5"
                    />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-800">{milestone.name}</h4>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: getStatusColor(milestone.status) }}
                      >
                        {milestone.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      isToday ? 'text-blue-600' : isPast ? 'text-gray-500' : 'text-gray-700'
                    }`}>
                      {formatDate(milestone.plannedDate)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {isToday ? 'Today' : isPast ? `${Math.abs(daysFromNow)}d ago` : `In ${daysFromNow}d`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-medium">
                        {milestone.ownerAvatar}
                      </div>
                      <span className="text-xs text-gray-600">{milestone.owner}</span>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: `${getMilestoneTypeColor(milestone.type)}20`,
                        color: getMilestoneTypeColor(milestone.type)
                      }}
                    >
                      {milestone.department}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {milestone.attachments && (
                      <span>📎 {milestone.attachments}</span>
                    )}
                    {milestone.comments && (
                      <span>💬 {milestone.comments}</span>
                    )}
                    {milestone.status === 'in_progress' && (
                      <span className="font-medium text-blue-600">{milestone.progress}%</span>
                    )}
                  </div>
                </div>

                {milestone.notes && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                    📝 {milestone.notes}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderList = () => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-3 text-xs font-semibold text-gray-600">Milestone</th>
            <th className="text-left p-3 text-xs font-semibold text-gray-600">Department</th>
            <th className="text-left p-3 text-xs font-semibold text-gray-600">Owner</th>
            <th className="text-center p-3 text-xs font-semibold text-gray-600">Planned Date</th>
            <th className="text-center p-3 text-xs font-semibold text-gray-600">Status</th>
            <th className="text-center p-3 text-xs font-semibold text-gray-600">Progress</th>
          </tr>
        </thead>
        <tbody>
          {filteredMilestones.map(milestone => (
            <tr
              key={milestone.id}
              className="border-t hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedMilestone(milestone)}
            >
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <span>{getMilestoneTypeIcon(milestone.type)}</span>
                  <span className="font-medium text-sm">{milestone.name}</span>
                </div>
              </td>
              <td className="p-3">
                <span
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: `${getMilestoneTypeColor(milestone.type)}20`,
                    color: getMilestoneTypeColor(milestone.type)
                  }}
                >
                  {milestone.department}
                </span>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-medium">
                    {milestone.ownerAvatar}
                  </div>
                  <span className="text-sm">{milestone.owner}</span>
                </div>
              </td>
              <td className="p-3 text-center text-sm">
                {formatDate(milestone.plannedDate)}
              </td>
              <td className="p-3 text-center">
                <span
                  className="px-2 py-1 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: getStatusColor(milestone.status) }}
                >
                  {milestone.status.replace('_', ' ')}
                </span>
              </td>
              <td className="p-3">
                <div className="w-full max-w-[100px]">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{milestone.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${milestone.progress}%`,
                        backgroundColor: getStatusColor(milestone.status)
                      }}
                    ></div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderGantt = () => {
    const startDate = project.startDate;
    const endDate = project.endDate;
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const today = new Date();
    const todayPosition = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header with dates */}
          <div className="flex border-b">
            <div className="w-48 flex-shrink-0 p-3 bg-gray-50 font-semibold text-sm text-gray-700">
              Milestone
            </div>
            <div className="flex-1 relative">
              <div className="flex">
                {Array.from({ length: Math.ceil(totalDays / 7) + 1 }).map((_, i) => {
                  const date = new Date(startDate);
                  date.setDate(date.getDate() + i * 7);
                  return (
                    <div key={i} className="flex-1 p-2 text-center text-xs text-gray-500 border-l">
                      {formatDate(date)}
                    </div>
                  );
                })}
              </div>
              {/* Today marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                style={{ left: `${(todayPosition / totalDays) * 100}%` }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] text-red-500 font-medium bg-white px-1">
                  Today
                </div>
              </div>
            </div>
          </div>

          {/* Milestones */}
          {filteredMilestones.map(milestone => {
            const milestoneDay = Math.ceil((milestone.plannedDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            const position = (milestoneDay / totalDays) * 100;

            return (
              <div key={milestone.id} className="flex border-b hover:bg-gray-50">
                <div className="w-48 flex-shrink-0 p-3 flex items-center gap-2">
                  <span>{getMilestoneTypeIcon(milestone.type)}</span>
                  <span className="text-sm truncate">{milestone.name}</span>
                </div>
                <div className="flex-1 relative py-3">
                  <div
                    className="absolute h-6 rounded-full flex items-center justify-center text-white text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      left: `${Math.max(0, position - 5)}%`,
                      width: milestone.status === 'completed' ? '40px' : '80px',
                      backgroundColor: getMilestoneTypeColor(milestone.type),
                      opacity: milestone.status === 'upcoming' ? 0.5 : 1
                    }}
                    onClick={() => setSelectedMilestone(milestone)}
                  >
                    {milestone.status === 'completed' ? '✓' : `${milestone.progress}%`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-gray-50 rounded-lg p-3 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Cross-Functional Timeline</h2>
          <p className="text-sm text-gray-600">Unified view of sales, production, and delivery milestones</p>
        </div>
        <div className="flex gap-2">
          {(['timeline', 'list', 'gantt'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {mode === 'timeline' && '📅 Timeline'}
              {mode === 'list' && '📋 List'}
              {mode === 'gantt' && '📊 Gantt'}
            </button>
          ))}
        </div>
      </div>

      {/* Project Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-800">{project.name}</h3>
            <p className="text-sm text-gray-500">Customer: {project.customer}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{project.overallProgress}%</div>
              <div className="text-xs text-gray-500">Overall Progress</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">{formatDate(project.startDate)} - {formatDate(project.endDate)}</div>
              <div className="text-xs text-gray-500">Project Duration</div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              project.status === 'on_track' ? 'bg-green-100 text-green-700' :
              project.status === 'at_risk' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              {project.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${project.overallProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filter by Type */}
      <div className="flex gap-2 mb-2 flex-wrap">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            filterType === 'all'
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          All
        </button>
        {milestoneTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
              filterType === type
                ? 'text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            style={{
              backgroundColor: filterType === type ? getMilestoneTypeColor(type) : undefined
            }}
          >
            {getMilestoneTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {viewMode === 'timeline' && renderTimeline()}
      {viewMode === 'list' && renderList()}
      {viewMode === 'gantt' && renderGantt()}

      {/* Milestone Detail Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedMilestone(null)}>
          <div className="bg-white rounded-lg p-3 max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${getMilestoneTypeColor(selectedMilestone.type)}20` }}
                >
                  {getMilestoneTypeIcon(selectedMilestone.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedMilestone.name}</h3>
                  <p className="text-sm text-gray-500">{selectedMilestone.department}</p>
                </div>
              </div>
              <button onClick={() => setSelectedMilestone(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-2">{selectedMilestone.description}</p>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <div className="text-xs text-gray-500">Planned Date</div>
                <div className="font-medium">{formatDate(selectedMilestone.plannedDate)}</div>
              </div>
              {selectedMilestone.actualDate && (
                <div>
                  <div className="text-xs text-gray-500">Actual Date</div>
                  <div className="font-medium">{formatDate(selectedMilestone.actualDate)}</div>
                </div>
              )}
              <div>
                <div className="text-xs text-gray-500">Owner</div>
                <div className="font-medium">{selectedMilestone.owner}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Status</div>
                <span
                  className="px-2 py-0.5 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: getStatusColor(selectedMilestone.status) }}
                >
                  {selectedMilestone.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {selectedMilestone.notes && (
              <div className="p-3 bg-gray-50 rounded-lg mb-2">
                <div className="text-xs text-gray-500 mb-1">Notes</div>
                <p className="text-sm">{selectedMilestone.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                View Details
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrossFunctionalTimeline;
