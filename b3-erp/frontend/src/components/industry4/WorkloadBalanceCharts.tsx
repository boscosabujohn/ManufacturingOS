'use client';

import React, { useState, useMemo } from 'react';

// Types
export type WorkloadStatus = 'underloaded' | 'optimal' | 'overloaded' | 'critical';
export type TimeframeType = 'day' | 'week' | 'month';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  capacity: number; // hours available
  allocated: number; // hours allocated
  completed: number; // hours completed
  efficiency: number; // percentage
}

export interface WorkloadTask {
  id: string;
  name: string;
  assignedTo: string;
  estimatedHours: number;
  completedHours: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface TeamWorkload {
  teamId: string;
  teamName: string;
  members: TeamMember[];
  totalCapacity: number;
  totalAllocated: number;
  avgEfficiency: number;
}

export interface WorkloadBalanceChartsProps {
  teams?: TeamWorkload[];
  tasks?: WorkloadTask[];
  timeframe?: TimeframeType;
  onMemberClick?: (member: TeamMember) => void;
  onRebalance?: (fromMember: TeamMember, toMember: TeamMember, hours: number) => void;
  className?: string;
}

// Mock data generators
const generateMockTeams = (): TeamWorkload[] => [
  {
    teamId: 't1',
    teamName: 'CNC Department',
    totalCapacity: 320,
    totalAllocated: 295,
    avgEfficiency: 92,
    members: [
      { id: 'm1', name: 'John Smith', role: 'Senior Machinist', department: 'CNC', capacity: 40, allocated: 45, completed: 38, efficiency: 95 },
      { id: 'm2', name: 'Mike Johnson', role: 'CNC Operator', department: 'CNC', capacity: 40, allocated: 42, completed: 35, efficiency: 88 },
      { id: 'm3', name: 'David Lee', role: 'CNC Operator', department: 'CNC', capacity: 40, allocated: 38, completed: 36, efficiency: 92 },
      { id: 'm4', name: 'Chris Brown', role: 'Junior Operator', department: 'CNC', capacity: 40, allocated: 32, completed: 28, efficiency: 85 },
      { id: 'm5', name: 'Alex Turner', role: 'CNC Operator', department: 'CNC', capacity: 40, allocated: 44, completed: 40, efficiency: 94 },
      { id: 'm6', name: 'James Wilson', role: 'Lead Machinist', department: 'CNC', capacity: 40, allocated: 48, completed: 45, efficiency: 96 },
      { id: 'm7', name: 'Robert Davis', role: 'CNC Operator', department: 'CNC', capacity: 40, allocated: 28, completed: 25, efficiency: 82 },
      { id: 'm8', name: 'Thomas Moore', role: 'CNC Operator', department: 'CNC', capacity: 40, allocated: 18, completed: 16, efficiency: 78 },
    ],
  },
  {
    teamId: 't2',
    teamName: 'Assembly Line',
    totalCapacity: 280,
    totalAllocated: 268,
    avgEfficiency: 89,
    members: [
      { id: 'm9', name: 'Maria Garcia', role: 'Assembly Lead', department: 'Assembly', capacity: 40, allocated: 42, completed: 39, efficiency: 93 },
      { id: 'm10', name: 'Lisa Chen', role: 'Assembler', department: 'Assembly', capacity: 40, allocated: 40, completed: 36, efficiency: 90 },
      { id: 'm11', name: 'Sarah Kim', role: 'Assembler', department: 'Assembly', capacity: 40, allocated: 38, completed: 34, efficiency: 88 },
      { id: 'm12', name: 'Emma White', role: 'Assembler', department: 'Assembly', capacity: 40, allocated: 50, completed: 42, efficiency: 91 },
      { id: 'm13', name: 'Nancy Black', role: 'Junior Assembler', department: 'Assembly', capacity: 40, allocated: 35, completed: 30, efficiency: 84 },
      { id: 'm14', name: 'Amy Green', role: 'Assembler', department: 'Assembly', capacity: 40, allocated: 38, completed: 35, efficiency: 87 },
      { id: 'm15', name: 'Kate Miller', role: 'Assembler', department: 'Assembly', capacity: 40, allocated: 25, completed: 22, efficiency: 80 },
    ],
  },
  {
    teamId: 't3',
    teamName: 'Quality Control',
    totalCapacity: 160,
    totalAllocated: 148,
    avgEfficiency: 94,
    members: [
      { id: 'm16', name: 'Peter Zhang', role: 'QC Manager', department: 'Quality', capacity: 40, allocated: 38, completed: 36, efficiency: 95 },
      { id: 'm17', name: 'Sandra Lopez', role: 'QC Inspector', department: 'Quality', capacity: 40, allocated: 42, completed: 40, efficiency: 96 },
      { id: 'm18', name: 'Kevin Park', role: 'QC Inspector', department: 'Quality', capacity: 40, allocated: 36, completed: 34, efficiency: 93 },
      { id: 'm19', name: 'Helen Wang', role: 'QC Technician', department: 'Quality', capacity: 40, allocated: 32, completed: 30, efficiency: 91 },
    ],
  },
];

const MOCK_NOW = new Date('2024-03-10T09:00:00');

const generateMockTasks = (): WorkloadTask[] => [
  { id: 'task1', name: 'WO-2024-1847 Setup', assignedTo: 'm1', estimatedHours: 4, completedHours: 4, priority: 'high', dueDate: MOCK_NOW, status: 'completed' },
  { id: 'task2', name: 'WO-2024-1847 Production', assignedTo: 'm1', estimatedHours: 16, completedHours: 12, priority: 'high', dueDate: MOCK_NOW, status: 'in_progress' },
  { id: 'task3', name: 'WO-2024-1848 Production', assignedTo: 'm2', estimatedHours: 20, completedHours: 15, priority: 'medium', dueDate: new Date(MOCK_NOW.getTime() + 86400000), status: 'in_progress' },
  { id: 'task4', name: 'WO-2024-1849 Setup', assignedTo: 'm3', estimatedHours: 3, completedHours: 0, priority: 'low', dueDate: new Date(MOCK_NOW.getTime() + 172800000), status: 'pending' },
  { id: 'task5', name: 'Urgent Order Assembly', assignedTo: 'm12', estimatedHours: 24, completedHours: 18, priority: 'urgent', dueDate: MOCK_NOW, status: 'in_progress' },
];

export function WorkloadBalanceCharts({
  teams: initialTeams,
  tasks: initialTasks,
  timeframe = 'week',
  onMemberClick,
  onRebalance,
  className = '',
}: WorkloadBalanceChartsProps) {
  const teams = useMemo(() => initialTeams || generateMockTeams(), [initialTeams]);
  const tasks = useMemo(() => initialTasks || generateMockTasks(), [initialTasks]);

  const [selectedTeam, setSelectedTeam] = useState<string | null>(teams[0]?.teamId || null);
  const [view, setView] = useState<'overview' | 'detailed' | 'tasks'>('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeType>(timeframe);
  const [showRebalanceModal, setShowRebalanceModal] = useState<{ from: TeamMember; to?: TeamMember } | null>(null);

  const currentTeam = useMemo(
    () => teams.find(t => t.teamId === selectedTeam),
    [teams, selectedTeam]
  );

  const getWorkloadStatus = (member: TeamMember): WorkloadStatus => {
    const ratio = member.allocated / member.capacity;
    if (ratio < 0.7) return 'underloaded';
    if (ratio <= 1.0) return 'optimal';
    if (ratio <= 1.2) return 'overloaded';
    return 'critical';
  };

  const getStatusColor = (status: WorkloadStatus) => {
    switch (status) {
      case 'underloaded': return { bg: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-600' };
      case 'optimal': return { bg: 'bg-green-600', text: 'text-green-400', border: 'border-green-600' };
      case 'overloaded': return { bg: 'bg-yellow-600', text: 'text-yellow-400', border: 'border-yellow-600' };
      case 'critical': return { bg: 'bg-red-600', text: 'text-red-400', border: 'border-red-600' };
    }
  };

  const allMembers = useMemo(() => teams.flatMap(t => t.members), [teams]);

  const workloadStats = useMemo(() => {
    const underloaded = allMembers.filter(m => getWorkloadStatus(m) === 'underloaded').length;
    const optimal = allMembers.filter(m => getWorkloadStatus(m) === 'optimal').length;
    const overloaded = allMembers.filter(m => getWorkloadStatus(m) === 'overloaded').length;
    const critical = allMembers.filter(m => getWorkloadStatus(m) === 'critical').length;
    return { underloaded, optimal, overloaded, critical, total: allMembers.length };
  }, [allMembers]);

  const renderOverview = () => (
    <div className="space-y-3">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-3xl">📉</span>
            <span className="text-3xl font-bold text-blue-400">{workloadStats.underloaded}</span>
          </div>
          <p className="text-gray-400 mt-2">Underloaded</p>
          <p className="text-xs text-blue-400">&lt; 70% capacity</p>
        </div>
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-3xl">✅</span>
            <span className="text-3xl font-bold text-green-400">{workloadStats.optimal}</span>
          </div>
          <p className="text-gray-400 mt-2">Optimal</p>
          <p className="text-xs text-green-400">70-100% capacity</p>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-3xl">⚠️</span>
            <span className="text-3xl font-bold text-yellow-400">{workloadStats.overloaded}</span>
          </div>
          <p className="text-gray-400 mt-2">Overloaded</p>
          <p className="text-xs text-yellow-400">100-120% capacity</p>
        </div>
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-3xl">🚨</span>
            <span className="text-3xl font-bold text-red-400">{workloadStats.critical}</span>
          </div>
          <p className="text-gray-400 mt-2">Critical</p>
          <p className="text-xs text-red-400">&gt; 120% capacity</p>
        </div>
      </div>

      {/* Team Comparison Chart */}
      <div className="bg-gray-800 rounded-lg p-3">
        <h3 className="text-lg font-semibold text-white mb-2">Team Workload Comparison</h3>
        <div className="space-y-2">
          {teams.map(team => {
            const utilizationPercent = Math.round((team.totalAllocated / team.totalCapacity) * 100);
            return (
              <div
                key={team.teamId}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedTeam === team.teamId ? 'bg-gray-700 ring-2 ring-blue-500' : 'bg-gray-700/50 hover:bg-gray-700'
                  }`}
                onClick={() => setSelectedTeam(team.teamId)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {team.teamName.includes('CNC') ? '⚙️' :
                        team.teamName.includes('Assembly') ? '🔧' : '✅'}
                    </span>
                    <div>
                      <p className="text-white font-medium">{team.teamName}</p>
                      <p className="text-sm text-gray-400">{team.members.length} members</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{utilizationPercent}%</p>
                    <p className="text-sm text-gray-400">
                      {team.totalAllocated}h / {team.totalCapacity}h
                    </p>
                  </div>
                </div>
                <div className="h-3 bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${utilizationPercent > 100 ? 'bg-red-600' :
                        utilizationPercent > 90 ? 'bg-yellow-600' : 'bg-green-600'
                      }`}
                    style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                  />
                </div>
                {utilizationPercent > 100 && (
                  <p className="text-xs text-red-400 mt-1">
                    ⚠️ {utilizationPercent - 100}% over capacity
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Balance Recommendations */}
      <div className="bg-gray-800 rounded-lg p-3">
        <h3 className="text-lg font-semibold text-white mb-2">Balance Recommendations</h3>
        <div className="space-y-3">
          {allMembers
            .filter(m => getWorkloadStatus(m) === 'critical' || getWorkloadStatus(m) === 'overloaded')
            .slice(0, 3)
            .map(member => {
              const potentialHelpers = allMembers.filter(
                m => m.id !== member.id &&
                  getWorkloadStatus(m) === 'underloaded' &&
                  m.department === member.department
              );
              const excessHours = member.allocated - member.capacity;

              return (
                <div key={member.id} className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-sm text-yellow-400">
                          {excessHours > 0 ? `${excessHours}h over capacity` : 'Approaching capacity'}
                        </p>
                      </div>
                    </div>
                    {potentialHelpers.length > 0 && (
                      <button
                        onClick={() => setShowRebalanceModal({ from: member })}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Rebalance
                      </button>
                    )}
                  </div>
                  {potentialHelpers.length > 0 && (
                    <p className="text-sm text-gray-400 mt-2">
                      💡 Suggest transferring work to: {potentialHelpers.slice(0, 2).map(h => h.name).join(', ')}
                    </p>
                  )}
                </div>
              );
            })}
          {workloadStats.overloaded + workloadStats.critical === 0 && (
            <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg text-center">
              <span className="text-2xl">✅</span>
              <p className="text-green-400 mt-2">All team members have balanced workloads!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDetailed = () => {
    if (!currentTeam) return null;

    return (
      <div className="space-y-3">
        {/* Team Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{currentTeam.teamName}</h3>
            <p className="text-gray-400">{currentTeam.members.length} team members</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm text-gray-400">Team Utilization</p>
              <p className="text-2xl font-bold text-white">
                {Math.round((currentTeam.totalAllocated / currentTeam.totalCapacity) * 100)}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Avg Efficiency</p>
              <p className="text-2xl font-bold text-green-400">{currentTeam.avgEfficiency}%</p>
            </div>
          </div>
        </div>

        {/* Member Workload Bars */}
        <div className="bg-gray-800 rounded-lg p-3">
          <h4 className="text-lg font-semibold text-white mb-2">Individual Workload</h4>
          <div className="space-y-2">
            {currentTeam.members.map(member => {
              const status = getWorkloadStatus(member);
              const colors = getStatusColor(status);
              const utilization = Math.round((member.allocated / member.capacity) * 100);

              return (
                <div
                  key={member.id}
                  className={`p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-650 transition-colors border-l-4 ${colors.border}`}
                  onClick={() => onMemberClick?.(member)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${colors.bg} rounded-full flex items-center justify-center text-white font-bold`}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-sm text-gray-400">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${colors.text}`}>
                        {utilization}%
                      </p>
                      <p className="text-xs text-gray-400">
                        {member.allocated}h / {member.capacity}h
                      </p>
                    </div>
                  </div>

                  {/* Stacked Bar */}
                  <div className="h-6 bg-gray-600 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-green-600 transition-all"
                      style={{ width: `${(member.completed / member.capacity) * 100}%` }}
                      title={`Completed: ${member.completed}h`}
                    />
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${((member.allocated - member.completed) / member.capacity) * 100}%` }}
                      title={`Remaining: ${member.allocated - member.completed}h`}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-green-600 rounded" />
                        <span className="text-gray-400">Completed: {member.completed}h</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-blue-600 rounded" />
                        <span className="text-gray-400">Remaining: {member.allocated - member.completed}h</span>
                      </span>
                    </div>
                    <span className="text-gray-400">Efficiency: {member.efficiency}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Distribution Chart */}
        <div className="bg-gray-800 rounded-lg p-3">
          <h4 className="text-lg font-semibold text-white mb-2">Workload Distribution</h4>
          <div className="flex items-end justify-around h-48 px-4">
            {currentTeam.members.map(member => {
              const height = (member.allocated / 50) * 100;
              const status = getWorkloadStatus(member);
              const colors = getStatusColor(status);

              return (
                <div key={member.id} className="flex-1 flex flex-col items-center gap-2 max-w-16">
                  <div className="relative w-full">
                    <div
                      className={`w-full ${colors.bg} rounded-t transition-all`}
                      style={{ height: `${Math.min(height, 100)}%`, minHeight: '20px' }}
                    />
                    {member.allocated > 40 && (
                      <div
                        className="absolute bottom-full w-full bg-red-600/50 rounded-t border-t-2 border-red-500"
                        style={{ height: `${((member.allocated - 40) / 50) * 100}%` }}
                      />
                    )}
                    <div
                      className="absolute bottom-0 w-full border-t-2 border-dashed border-gray-400"
                      style={{ bottom: `${(40 / 50) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 truncate w-full text-center" title={member.name}>
                    {member.name.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-700">
            <span className="text-xs text-gray-400">--- 40h capacity line</span>
          </div>
        </div>
      </div>
    );
  };

  const renderTasks = () => (
    <div className="space-y-3">
      <div className="bg-gray-800 rounded-lg p-3">
        <h3 className="text-lg font-semibold text-white mb-2">Active Tasks</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-3 text-left text-gray-400 font-medium">Task</th>
                <th className="p-3 text-left text-gray-400 font-medium">Assigned To</th>
                <th className="p-3 text-center text-gray-400 font-medium">Progress</th>
                <th className="p-3 text-center text-gray-400 font-medium">Priority</th>
                <th className="p-3 text-center text-gray-400 font-medium">Due</th>
                <th className="p-3 text-center text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => {
                const assignee = allMembers.find(m => m.id === task.assignedTo);
                const progress = Math.round((task.completedHours / task.estimatedHours) * 100);

                return (
                  <tr key={task.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="p-3">
                      <p className="text-white font-medium">{task.name}</p>
                      <p className="text-xs text-gray-400">{task.estimatedHours}h estimated</p>
                    </td>
                    <td className="p-3">
                      {assignee && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {assignee.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-white">{assignee.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-white text-sm">{progress}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${task.priority === 'urgent' ? 'bg-red-600 text-white' :
                          task.priority === 'high' ? 'bg-orange-600 text-white' :
                            task.priority === 'medium' ? 'bg-yellow-600 text-white' :
                              'bg-gray-600 text-white'
                        }`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-center text-white">
                      {task.dueDate.toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${task.status === 'completed' ? 'bg-green-600 text-white' :
                          task.status === 'in_progress' ? 'bg-blue-600 text-white' :
                            'bg-gray-600 text-white'
                        }`}>
                        {task.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-900 rounded-xl p-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Workload Balance</h2>
          <p className="text-gray-400">Team workload distribution and optimization</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe Selector */}
          <select
            value={selectedTimeframe}
            onChange={e => setSelectedTimeframe(e.target.value as TimeframeType)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-blue-500 outline-none"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          {/* View Tabs */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'detailed', label: 'Detailed', icon: '👥' },
              { id: 'tasks', label: 'Tasks', icon: '📋' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as typeof view)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${view === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Team Selector (for detailed view) */}
      {view === 'detailed' && (
        <div className="flex gap-2 mb-3">
          {teams.map(team => (
            <button
              key={team.teamId}
              onClick={() => setSelectedTeam(team.teamId)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedTeam === team.teamId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
            >
              {team.teamName}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {view === 'overview' && renderOverview()}
      {view === 'detailed' && renderDetailed()}
      {view === 'tasks' && renderTasks()}

      {/* Rebalance Modal */}
      {showRebalanceModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3">
          <div className="bg-gray-800 rounded-xl p-3 w-full max-w-lg">
            <h3 className="text-xl font-bold text-white mb-2">Rebalance Workload</h3>

            <div className="mb-2">
              <label className="text-gray-400 text-sm">Transfer from</label>
              <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg mt-1">
                <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold">
                  {showRebalanceModal.from.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-white font-medium">{showRebalanceModal.from.name}</p>
                  <p className="text-sm text-gray-400">
                    {showRebalanceModal.from.allocated}h / {showRebalanceModal.from.capacity}h
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <label className="text-gray-400 text-sm">Transfer to</label>
              <div className="space-y-2 mt-1">
                {allMembers
                  .filter(m =>
                    m.id !== showRebalanceModal.from.id &&
                    getWorkloadStatus(m) === 'underloaded' &&
                    m.department === showRebalanceModal.from.department
                  )
                  .map(member => (
                    <button
                      key={member.id}
                      onClick={() => setShowRebalanceModal({ ...showRebalanceModal, to: member })}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${showRebalanceModal.to?.id === member.id
                          ? 'bg-blue-600'
                          : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                    >
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-left">
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-sm text-gray-400">
                          {member.allocated}h / {member.capacity}h ({member.capacity - member.allocated}h available)
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRebalanceModal(null)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (showRebalanceModal.to) {
                    onRebalance?.(showRebalanceModal.from, showRebalanceModal.to, 4);
                    setShowRebalanceModal(null);
                  }
                }}
                disabled={!showRebalanceModal.to}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                Rebalance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkloadBalanceCharts;
