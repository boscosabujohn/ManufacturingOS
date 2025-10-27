'use client';

import { useState, useMemo } from 'react';
import { Clock, TrendingUp, AlertCircle, CheckCircle, Calendar } from 'lucide-react';

interface SuccessionPlan {
  id: string;
  planId: string;
  positionTitle: string;
  department: string;
  currentHolder: string;
  status: 'active' | 'on_track' | 'at_risk' | 'delayed' | 'completed';
  progress: number;
  successors: number;
  readySuccessors: number;
  startDate: string;
  targetDate: string;
  lastUpdated: string;
  milestones: {
    name: string;
    completed: boolean;
    dueDate: string;
  }[];
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const mockPlans: SuccessionPlan[] = [
    {
      id: '1',
      planId: 'SP-2024-001',
      positionTitle: 'Chief Technology Officer',
      department: 'IT',
      currentHolder: 'Rajesh Kumar',
      status: 'on_track',
      progress: 75,
      successors: 3,
      readySuccessors: 1,
      startDate: '2024-01-15',
      targetDate: '2025-06-30',
      lastUpdated: '2024-10-20',
      milestones: [
        { name: 'Identify successors', completed: true, dueDate: '2024-03-01' },
        { name: 'Assessment complete', completed: true, dueDate: '2024-06-01' },
        { name: 'Development plans created', completed: true, dueDate: '2024-08-01' },
        { name: 'Training in progress', completed: false, dueDate: '2025-03-01' },
        { name: 'Ready for transition', completed: false, dueDate: '2025-06-01' }
      ]
    },
    {
      id: '2',
      planId: 'SP-2024-002',
      positionTitle: 'VP Sales',
      department: 'Sales',
      currentHolder: 'Priya Sharma',
      status: 'at_risk',
      progress: 45,
      successors: 2,
      readySuccessors: 0,
      startDate: '2024-02-01',
      targetDate: '2025-03-31',
      lastUpdated: '2024-10-18',
      milestones: [
        { name: 'Identify successors', completed: true, dueDate: '2024-04-01' },
        { name: 'Assessment complete', completed: true, dueDate: '2024-07-01' },
        { name: 'Development plans created', completed: false, dueDate: '2024-09-01' },
        { name: 'Training in progress', completed: false, dueDate: '2025-01-01' },
        { name: 'Ready for transition', completed: false, dueDate: '2025-03-01' }
      ]
    },
    {
      id: '3',
      planId: 'SP-2024-003',
      positionTitle: 'Finance Manager',
      department: 'Finance',
      currentHolder: 'Neha Gupta',
      status: 'completed',
      progress: 100,
      successors: 2,
      readySuccessors: 2,
      startDate: '2023-10-01',
      targetDate: '2024-09-30',
      lastUpdated: '2024-09-30',
      milestones: [
        { name: 'Identify successors', completed: true, dueDate: '2023-12-01' },
        { name: 'Assessment complete', completed: true, dueDate: '2024-03-01' },
        { name: 'Development plans created', completed: true, dueDate: '2024-05-01' },
        { name: 'Training in progress', completed: true, dueDate: '2024-08-01' },
        { name: 'Ready for transition', completed: true, dueDate: '2024-09-30' }
      ]
    },
    {
      id: '4',
      planId: 'SP-2024-004',
      positionTitle: 'Operations Lead',
      department: 'Operations',
      currentHolder: 'Vikram Singh',
      status: 'delayed',
      progress: 30,
      successors: 1,
      readySuccessors: 0,
      startDate: '2024-03-01',
      targetDate: '2024-12-31',
      lastUpdated: '2024-10-15',
      milestones: [
        { name: 'Identify successors', completed: true, dueDate: '2024-05-01' },
        { name: 'Assessment complete', completed: false, dueDate: '2024-07-01' },
        { name: 'Development plans created', completed: false, dueDate: '2024-09-01' },
        { name: 'Training in progress', completed: false, dueDate: '2024-11-01' },
        { name: 'Ready for transition', completed: false, dueDate: '2024-12-31' }
      ]
    },
    {
      id: '5',
      planId: 'SP-2024-005',
      positionTitle: 'HR Manager',
      department: 'HR',
      currentHolder: 'Sunita Reddy',
      status: 'on_track',
      progress: 60,
      successors: 2,
      readySuccessors: 1,
      startDate: '2024-04-01',
      targetDate: '2025-09-30',
      lastUpdated: '2024-10-22',
      milestones: [
        { name: 'Identify successors', completed: true, dueDate: '2024-06-01' },
        { name: 'Assessment complete', completed: true, dueDate: '2024-08-01' },
        { name: 'Development plans created', completed: true, dueDate: '2024-10-01' },
        { name: 'Training in progress', completed: false, dueDate: '2025-06-01' },
        { name: 'Ready for transition', completed: false, dueDate: '2025-09-30' }
      ]
    }
  ];

  const filteredPlans = mockPlans.filter(plan => {
    if (selectedStatus !== 'all' && plan.status !== selectedStatus) return false;
    if (selectedDepartment !== 'all' && plan.department !== selectedDepartment) return false;
    return true;
  });

  const stats = useMemo(() => ({
    total: mockPlans.length,
    onTrack: mockPlans.filter(p => p.status === 'on_track').length,
    atRisk: mockPlans.filter(p => p.status === 'at_risk').length,
    delayed: mockPlans.filter(p => p.status === 'delayed').length,
    completed: mockPlans.filter(p => p.status === 'completed').length
  }), [mockPlans]);

  const statusColors = {
    active: 'bg-blue-100 text-blue-700',
    on_track: 'bg-green-100 text-green-700',
    at_risk: 'bg-yellow-100 text-yellow-700',
    delayed: 'bg-red-100 text-red-700',
    completed: 'bg-gray-100 text-gray-700'
  };

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="h-6 w-6 text-teal-600" />
          Succession Plan Tracking
        </h1>
        <p className="text-sm text-gray-600 mt-1">Monitor progress of succession plans</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Total Plans</p>
          <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm font-medium text-green-600">On Track</p>
          <p className="text-2xl font-bold text-green-900">{stats.onTrack}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm font-medium text-yellow-600">At Risk</p>
          <p className="text-2xl font-bold text-yellow-900">{stats.atRisk}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <p className="text-sm font-medium text-red-600">Delayed</p>
          <p className="text-2xl font-bold text-red-900">{stats.delayed}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="all">All Status</option>
              <option value="on_track">On Track</option>
              <option value="at_risk">At Risk</option>
              <option value="delayed">Delayed</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="all">All Departments</option>
              <option value="IT">IT</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
              <option value="HR">HR</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredPlans.map(plan => {
          const daysRemaining = getDaysRemaining(plan.targetDate);
          const completedMilestones = plan.milestones.filter(m => m.completed).length;
          const totalMilestones = plan.milestones.length;

          return (
            <div key={plan.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{plan.positionTitle}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[plan.status]}`}>
                      {plan.status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{plan.planId} • {plan.currentHolder} • {plan.department}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-teal-600">{plan.progress}%</p>
                  <p className="text-xs text-gray-500">Complete</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-600 uppercase font-medium mb-1">Successors</p>
                  <p className="text-lg font-bold text-blue-900">{plan.successors}</p>
                  <p className="text-xs text-blue-600">{plan.readySuccessors} ready now</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-600 uppercase font-medium mb-1">Milestones</p>
                  <p className="text-lg font-bold text-green-900">{completedMilestones}/{totalMilestones}</p>
                  <p className="text-xs text-green-600">Completed</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-purple-600 uppercase font-medium mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Target Date
                  </p>
                  <p className="text-sm font-bold text-purple-900">
                    {new Date(plan.targetDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className={`rounded-lg p-3 ${daysRemaining < 30 ? 'bg-red-50' : daysRemaining < 90 ? 'bg-yellow-50' : 'bg-gray-50'}`}>
                  <p className={`text-xs uppercase font-medium mb-1 ${daysRemaining < 30 ? 'text-red-600' : daysRemaining < 90 ? 'text-yellow-600' : 'text-gray-600'}`}>
                    Days Remaining
                  </p>
                  <p className={`text-lg font-bold ${daysRemaining < 30 ? 'text-red-900' : daysRemaining < 90 ? 'text-yellow-900' : 'text-gray-900'}`}>
                    {daysRemaining}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500 uppercase font-medium">Progress</p>
                  <p className="text-xs text-gray-600">{plan.progress}% complete</p>
                </div>
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full ${
                      plan.status === 'completed' ? 'bg-gray-500' :
                      plan.status === 'on_track' ? 'bg-green-500' :
                      plan.status === 'at_risk' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${plan.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Milestones</h4>
                <div className="space-y-2">
                  {plan.milestones.map((milestone, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      {milestone.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                      )}
                      <div className="flex-1">
                        <p className={`text-sm ${milestone.completed ? 'text-gray-700 line-through' : 'text-gray-900 font-medium'}`}>
                          {milestone.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Due: {new Date(milestone.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {plan.status === 'at_risk' && (
                <div className="bg-yellow-50 rounded-lg p-3 mb-4 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <p className="text-xs text-yellow-700 uppercase font-medium">Action Required</p>
                  </div>
                  <p className="text-sm text-yellow-900">Plan is at risk. Review development activities and timeline.</p>
                </div>
              )}

              {plan.status === 'delayed' && (
                <div className="bg-red-50 rounded-lg p-3 mb-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <p className="text-xs text-red-700 uppercase font-medium">Delayed</p>
                  </div>
                  <p className="text-sm text-red-900">Plan is behind schedule. Immediate attention required.</p>
                </div>
              )}

              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                  View Details
                </button>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm">
                  Update Progress
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
