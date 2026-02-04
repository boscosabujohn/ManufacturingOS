'use client';

import React, { useState, useMemo } from 'react';

// Types
export type UserRole = 'operator' | 'supervisor' | 'manager' | 'executive';

export interface RoleConfig {
  id: UserRole;
  name: string;
  description: string;
  icon: string;
  primaryColor: string;
  features: string[];
  restrictions: string[];
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: string;
  color: string;
  roles: UserRole[];
}

export interface DashboardSection {
  id: string;
  title: string;
  type: 'metrics' | 'chart' | 'list' | 'actions' | 'alerts';
  roles: UserRole[];
  priority: number;
  content: React.ReactNode;
}

export interface RoleBasedViewsProps {
  currentRole?: UserRole;
  userName?: string;
  onRoleChange?: (role: UserRole) => void;
  onActionClick?: (action: QuickAction) => void;
  className?: string;
}

// Role configurations
const roleConfigs: RoleConfig[] = [
  {
    id: 'operator',
    name: 'Operator',
    description: 'Shop floor production tasks',
    icon: '🔧',
    primaryColor: 'blue',
    features: [
      'View assigned work orders',
      'Log production data',
      'Report quality issues',
      'Request materials',
      'View machine status',
    ],
    restrictions: [
      'Cannot modify schedules',
      'Cannot approve orders',
      'Limited reporting access',
    ],
  },
  {
    id: 'supervisor',
    name: 'Supervisor',
    description: 'Team and shift management',
    icon: '👷',
    primaryColor: 'green',
    features: [
      'All operator features',
      'Assign work orders',
      'Manage team schedules',
      'Approve time entries',
      'View shift performance',
      'Escalate issues',
    ],
    restrictions: [
      'Cannot modify production plans',
      'Limited financial access',
    ],
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Production planning and oversight',
    icon: '📊',
    primaryColor: 'purple',
    features: [
      'All supervisor features',
      'Production planning',
      'Resource allocation',
      'Performance analytics',
      'Quality management',
      'Maintenance scheduling',
    ],
    restrictions: ['Limited executive reporting'],
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Strategic overview and decisions',
    icon: '🎯',
    primaryColor: 'amber',
    features: [
      'Full system access',
      'Strategic dashboards',
      'Financial analytics',
      'Cross-plant visibility',
      'Executive reporting',
      'Budget approval',
    ],
    restrictions: [],
  },
];

// Quick actions per role
const quickActions: QuickAction[] = [
  // Operator actions
  { id: 'start-job', label: 'Start Job', icon: '▶️', action: 'startJob', color: 'green', roles: ['operator', 'supervisor'] },
  { id: 'pause-job', label: 'Pause Job', icon: '⏸️', action: 'pauseJob', color: 'yellow', roles: ['operator', 'supervisor'] },
  { id: 'complete-job', label: 'Complete Job', icon: '✅', action: 'completeJob', color: 'blue', roles: ['operator', 'supervisor'] },
  { id: 'log-defect', label: 'Log Defect', icon: '⚠️', action: 'logDefect', color: 'red', roles: ['operator', 'supervisor', 'manager'] },
  { id: 'request-material', label: 'Request Material', icon: '📦', action: 'requestMaterial', color: 'purple', roles: ['operator', 'supervisor'] },
  { id: 'call-maintenance', label: 'Call Maintenance', icon: '🔧', action: 'callMaintenance', color: 'orange', roles: ['operator', 'supervisor'] },

  // Supervisor actions
  { id: 'assign-work', label: 'Assign Work', icon: '📋', action: 'assignWork', color: 'green', roles: ['supervisor', 'manager'] },
  { id: 'approve-time', label: 'Approve Time', icon: '⏰', action: 'approveTime', color: 'blue', roles: ['supervisor', 'manager'] },
  { id: 'shift-report', label: 'Shift Report', icon: '📝', action: 'shiftReport', color: 'purple', roles: ['supervisor', 'manager'] },

  // Manager actions
  { id: 'create-schedule', label: 'Create Schedule', icon: '📅', action: 'createSchedule', color: 'green', roles: ['manager', 'executive'] },
  { id: 'view-analytics', label: 'View Analytics', icon: '📊', action: 'viewAnalytics', color: 'blue', roles: ['manager', 'executive'] },
  { id: 'manage-resources', label: 'Manage Resources', icon: '👥', action: 'manageResources', color: 'purple', roles: ['manager', 'executive'] },

  // Executive actions
  { id: 'strategic-view', label: 'Strategic View', icon: '🎯', action: 'strategicView', color: 'amber', roles: ['executive'] },
  { id: 'financial-dashboard', label: 'Financial Dashboard', icon: '💰', action: 'financialDashboard', color: 'green', roles: ['executive'] },
  { id: 'cross-plant', label: 'Cross-Plant View', icon: '🏭', action: 'crossPlantView', color: 'blue', roles: ['executive'] },
];

// Mock data generators
const generateOperatorMetrics = () => ({
  currentJob: {
    id: 'WO-2024-1847',
    product: 'Assembly Unit A-7',
    progress: 67,
    target: 150,
    completed: 101,
    timeRemaining: '2h 15m',
  },
  todayStats: {
    jobsCompleted: 4,
    unitsProduced: 423,
    efficiency: 94.2,
    qualityRate: 98.7,
  },
  machineStatus: 'running',
  nextBreak: '45 min',
});

const generateSupervisorMetrics = () => ({
  teamSize: 12,
  activeOperators: 10,
  shiftProgress: 65,
  openIssues: 3,
  pendingApprovals: 5,
  todayOutput: 2847,
  targetOutput: 3200,
  efficiency: 89.0,
  topPerformer: 'John D.',
  bottomPerformer: 'Mike S.',
});

const generateManagerMetrics = () => ({
  weeklyOEE: 84.5,
  qualityRate: 97.8,
  deliveryOnTime: 92.3,
  laborUtilization: 88.7,
  maintenanceBacklog: 12,
  openNCRs: 4,
  inventoryTurns: 6.2,
  costVariance: -2.4,
});

const generateExecutiveMetrics = () => ({
  revenueYTD: 24.7,
  revenueGrowth: 12.3,
  grossMargin: 34.5,
  operatingMargin: 18.2,
  plantsOperational: 4,
  totalHeadcount: 847,
  customerSatisfaction: 94,
  marketShare: 23.5,
});

export function RoleBasedViews({
  currentRole = 'operator',
  userName = 'User',
  onRoleChange,
  onActionClick,
  className = '',
}: RoleBasedViewsProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const currentRoleConfig = useMemo(
    () => roleConfigs.find(r => r.id === selectedRole) || roleConfigs[0],
    [selectedRole]
  );

  const availableActions = useMemo(
    () => quickActions.filter(a => a.roles.includes(selectedRole)),
    [selectedRole]
  );

  const operatorData = useMemo(() => generateOperatorMetrics(), []);
  const supervisorData = useMemo(() => generateSupervisorMetrics(), []);
  const managerData = useMemo(() => generateManagerMetrics(), []);
  const executiveData = useMemo(() => generateExecutiveMetrics(), []);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setShowRoleSelector(false);
    onRoleChange?.(role);
  };

  const handleActionClick = (action: QuickAction) => {
    onActionClick?.(action);
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-600 hover:bg-blue-700',
      green: 'bg-green-600 hover:bg-green-700',
      yellow: 'bg-yellow-600 hover:bg-yellow-700',
      red: 'bg-red-600 hover:bg-red-700',
      purple: 'bg-purple-600 hover:bg-purple-700',
      orange: 'bg-orange-600 hover:bg-orange-700',
      amber: 'bg-amber-600 hover:bg-amber-700',
    };
    return colors[color] || colors.blue;
  };

  // Render role-specific dashboard content
  const renderOperatorView = () => (
    <div className="space-y-3">
      {/* Current Job */}
      <div className="bg-gray-800 rounded-lg p-3">
        <h3 className="text-lg font-semibold text-white mb-2">Current Job</h3>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-2xl font-bold text-white">{operatorData.currentJob.id}</p>
            <p className="text-gray-400">{operatorData.currentJob.product}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Time Remaining</p>
            <p className="text-xl font-semibold text-blue-400">{operatorData.currentJob.timeRemaining}</p>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Progress</span>
            <span className="text-white">{operatorData.currentJob.completed} / {operatorData.currentJob.target} units</span>
          </div>
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${operatorData.currentJob.progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-400">{operatorData.todayStats.efficiency}%</p>
            <p className="text-xs text-gray-400">Efficiency</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-400">{operatorData.todayStats.qualityRate}%</p>
            <p className="text-xs text-gray-400">Quality</p>
          </div>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="bg-gray-800 rounded-lg p-3">
        <h3 className="text-lg font-semibold text-white mb-2">Today&apos;s Stats</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{operatorData.todayStats.jobsCompleted}</p>
            <p className="text-sm text-gray-400">Jobs Completed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{operatorData.todayStats.unitsProduced}</p>
            <p className="text-sm text-gray-400">Units Produced</p>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
          <span className="text-gray-400">Machine</span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 font-medium">Running</span>
          </span>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
          <span className="text-gray-400">Next Break</span>
          <span className="text-white font-medium">{operatorData.nextBreak}</span>
        </div>
      </div>
    </div>
  );

  const renderSupervisorView = () => (
    <div className="space-y-3">
      {/* Team Overview */}
      <div className="bg-gray-800 rounded-lg p-3">
        <h3 className="text-lg font-semibold text-white mb-2">Team Overview</h3>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{supervisorData.activeOperators}/{supervisorData.teamSize}</p>
            <p className="text-sm text-gray-400">Active Operators</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-400">{supervisorData.openIssues}</p>
            <p className="text-sm text-gray-400">Open Issues</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400">{supervisorData.pendingApprovals}</p>
            <p className="text-sm text-gray-400">Pending Approvals</p>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Shift Progress</span>
            <span className="text-white">{supervisorData.shiftProgress}%</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 rounded-full"
              style={{ width: `${supervisorData.shiftProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Production Status */}
      <div className="bg-gray-800 rounded-lg p-3">
        <h3 className="text-lg font-semibold text-white mb-2">Shift Production</h3>
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-4xl font-bold text-white">{supervisorData.todayOutput.toLocaleString()}</p>
            <p className="text-gray-400">of {supervisorData.targetOutput.toLocaleString()} target</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-400">{supervisorData.efficiency}%</p>
            <p className="text-sm text-gray-400">Efficiency</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-green-400">🏆</span>
            <div>
              <p className="text-sm text-gray-400">Top Performer</p>
              <p className="text-white font-medium">{supervisorData.topPerformer}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">⚡</span>
            <div>
              <p className="text-sm text-gray-400">Needs Support</p>
              <p className="text-white font-medium">{supervisorData.bottomPerformer}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-gray-800 rounded-lg p-3">
        <h3 className="text-lg font-semibold text-white mb-2">Recent Alerts</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
            <span className="text-yellow-400">⚠️</span>
            <div className="flex-1">
              <p className="text-white text-sm">Machine MC-04 efficiency below target</p>
              <p className="text-xs text-gray-400">5 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
            <span className="text-blue-400">📋</span>
            <div className="flex-1">
              <p className="text-white text-sm">New work order WO-2024-1852 assigned</p>
              <p className="text-xs text-gray-400">12 minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderManagerView = () => (
    <div className="space-y-3">
      {/* KPI Overview */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-sm text-gray-400 mb-1">Weekly OEE</p>
          <p className="text-2xl font-bold text-green-400">{managerData.weeklyOEE}%</p>
          <p className="text-xs text-green-400">+2.3% vs last week</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-sm text-gray-400 mb-1">Quality Rate</p>
          <p className="text-2xl font-bold text-blue-400">{managerData.qualityRate}%</p>
          <p className="text-xs text-blue-400">Target: 98%</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-sm text-gray-400 mb-1">On-Time Delivery</p>
          <p className="text-2xl font-bold text-purple-400">{managerData.deliveryOnTime}%</p>
          <p className="text-xs text-yellow-400">-1.2% vs target</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-sm text-gray-400 mb-1">Labor Utilization</p>
          <p className="text-2xl font-bold text-amber-400">{managerData.laborUtilization}%</p>
          <p className="text-xs text-gray-400">87 active workers</p>
        </div>
      </div>

      {/* Production Chart Placeholder */}
      <div className="bg-gray-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Weekly Production Trend</h3>
          <select className="bg-gray-700 text-white text-sm rounded-lg px-3 py-1 border border-gray-600">
            <option>This Week</option>
            <option>Last Week</option>
            <option>This Month</option>
          </select>
        </div>
        <div className="h-48 flex items-end justify-around gap-2 px-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const heights = [65, 78, 82, 71, 88, 45, 30];
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-blue-600 rounded-t transition-all duration-300"
                  style={{ height: `${heights[i]}%` }}
                />
                <span className="text-xs text-gray-400">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Issues & Actions */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800 rounded-lg p-3">
          <h3 className="text-lg font-semibold text-white mb-2">Open Issues</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-red-400">🔴</span>
                <span className="text-white">Maintenance Backlog</span>
              </div>
              <span className="text-red-400 font-bold">{managerData.maintenanceBacklog}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-yellow-400">🟡</span>
                <span className="text-white">Open NCRs</span>
              </div>
              <span className="text-yellow-400 font-bold">{managerData.openNCRs}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-blue-400">🔵</span>
                <span className="text-white">Inventory Turns</span>
              </div>
              <span className="text-blue-400 font-bold">{managerData.inventoryTurns}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3">
          <h3 className="text-lg font-semibold text-white mb-2">Cost Analysis</h3>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Budget Variance</span>
                <span className={managerData.costVariance < 0 ? 'text-green-400' : 'text-red-400'}>
                  {managerData.costVariance}%
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${managerData.costVariance < 0 ? 'bg-green-600' : 'bg-red-600'}`}
                  style={{ width: `${Math.abs(managerData.costVariance) * 10}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-400">
              {managerData.costVariance < 0
                ? `Under budget by ${Math.abs(managerData.costVariance)}%`
                : `Over budget by ${managerData.costVariance}%`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExecutiveView = () => (
    <div className="space-y-3">
      {/* Financial Overview */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-700 rounded-lg p-3">
          <p className="text-sm text-green-300 mb-1">Revenue YTD</p>
          <p className="text-3xl font-bold text-white">${executiveData.revenueYTD}M</p>
          <p className="text-sm text-green-400">+{executiveData.revenueGrowth}% YoY</p>
        </div>
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700 rounded-lg p-3">
          <p className="text-sm text-blue-300 mb-1">Gross Margin</p>
          <p className="text-3xl font-bold text-white">{executiveData.grossMargin}%</p>
          <p className="text-sm text-blue-400">Target: 35%</p>
        </div>
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700 rounded-lg p-3">
          <p className="text-sm text-purple-300 mb-1">Operating Margin</p>
          <p className="text-3xl font-bold text-white">{executiveData.operatingMargin}%</p>
          <p className="text-sm text-purple-400">+1.2% vs plan</p>
        </div>
        <div className="bg-gradient-to-br from-amber-900/50 to-amber-800/30 border border-amber-700 rounded-lg p-3">
          <p className="text-sm text-amber-300 mb-1">Market Share</p>
          <p className="text-3xl font-bold text-white">{executiveData.marketShare}%</p>
          <p className="text-sm text-amber-400">+0.8% QoQ</p>
        </div>
      </div>

      {/* Strategic Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-800 rounded-lg p-3">
          <h3 className="text-lg font-semibold text-white mb-2">Operations</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Plants Operational</span>
              <span className="text-2xl font-bold text-green-400">{executiveData.plantsOperational}/4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Headcount</span>
              <span className="text-2xl font-bold text-white">{executiveData.totalHeadcount}</span>
            </div>
            <div className="h-px bg-gray-700" />
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-700 rounded p-2 text-center">
                <p className="text-xs text-gray-400">Plant 1</p>
                <p className="text-green-400 font-medium">98.2%</p>
              </div>
              <div className="bg-gray-700 rounded p-2 text-center">
                <p className="text-xs text-gray-400">Plant 2</p>
                <p className="text-green-400 font-medium">96.7%</p>
              </div>
              <div className="bg-gray-700 rounded p-2 text-center">
                <p className="text-xs text-gray-400">Plant 3</p>
                <p className="text-yellow-400 font-medium">87.4%</p>
              </div>
              <div className="bg-gray-700 rounded p-2 text-center">
                <p className="text-xs text-gray-400">Plant 4</p>
                <p className="text-green-400 font-medium">94.1%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3">
          <h3 className="text-lg font-semibold text-white mb-2">Customer Metrics</h3>
          <div className="flex flex-col items-center justify-center h-40">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="8"
                  strokeDasharray={`${executiveData.customerSatisfaction * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{executiveData.customerSatisfaction}</span>
                <span className="text-xs text-gray-400">CSAT Score</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3">
          <h3 className="text-lg font-semibold text-white mb-2">Strategic Initiatives</h3>
          <div className="space-y-3">
            <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-sm">Digital Transformation</span>
                <span className="text-green-400 text-sm">78%</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
            <div className="p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-sm">Sustainability Goals</span>
                <span className="text-blue-400 text-sm">62%</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '62%' }} />
              </div>
            </div>
            <div className="p-3 bg-purple-900/30 border border-purple-700 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-sm">Market Expansion</span>
                <span className="text-purple-400 text-sm">45%</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboardContent = () => {
    switch (selectedRole) {
      case 'operator':
        return renderOperatorView();
      case 'supervisor':
        return renderSupervisorView();
      case 'manager':
        return renderManagerView();
      case 'executive':
        return renderExecutiveView();
      default:
        return renderOperatorView();
    }
  };

  return (
    <div className={`bg-gray-900 rounded-xl p-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowRoleSelector(!showRoleSelector)}
              className="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-3 hover:bg-gray-700 transition-colors"
            >
              <span className="text-2xl">{currentRoleConfig.icon}</span>
              <div className="text-left">
                <p className="text-white font-semibold">{userName}</p>
                <p className="text-sm text-gray-400">{currentRoleConfig.name} View</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Role Selector Dropdown */}
            {showRoleSelector && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                {roleConfigs.map(role => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleChange(role.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      selectedRole === role.id ? 'bg-gray-700' : ''
                    }`}
                  >
                    <span className="text-xl">{role.icon}</span>
                    <div className="text-left">
                      <p className="text-white font-medium">{role.name}</p>
                      <p className="text-xs text-gray-400">{role.description}</p>
                    </div>
                    {selectedRole === role.id && (
                      <svg className="w-5 h-5 text-green-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-gray-700" />

          <div>
            <p className="text-sm text-gray-400">Dashboard optimized for</p>
            <p className="text-white font-medium">{currentRoleConfig.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Last updated:</span>
          <span className="text-white">Just now</span>
          <button className="ml-4 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-3">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          {availableActions.map(action => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors ${getColorClass(action.color)}`}
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Role-Specific Dashboard */}
      {renderDashboardContent()}

      {/* Role Features Footer */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Available Features</h4>
            <div className="flex flex-wrap gap-2">
              {currentRoleConfig.features.slice(0, 4).map((feature, i) => (
                <span key={i} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">
                  {feature}
                </span>
              ))}
              {currentRoleConfig.features.length > 4 && (
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-400">
                  +{currentRoleConfig.features.length - 4} more
                </span>
              )}
            </div>
          </div>
          {currentRoleConfig.restrictions.length > 0 && (
            <div className="text-right">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Restrictions</h4>
              <p className="text-xs text-gray-500">{currentRoleConfig.restrictions[0]}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoleBasedViews;
