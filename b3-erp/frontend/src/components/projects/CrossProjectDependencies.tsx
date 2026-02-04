'use client'

import { useState } from 'react'
import { GitBranch, Link2, AlertTriangle, CheckCircle, Clock, ArrowRight, Zap, Calendar } from 'lucide-react'

export type DependencyType = 'finish-to-start' | 'start-to-start' | 'finish-to-finish' | 'start-to-finish';
export type DependencyStatus = 'active' | 'at-risk' | 'blocked' | 'completed';

export interface ProjectDependency {
  id: string;
  predecessorProject: string;
  predecessorTask: string;
  successorProject: string;
  successorTask: string;
  type: DependencyType;
  status: DependencyStatus;
  lagDays: number; // Positive = lag, Negative = lead
  criticalPath: boolean;
  impact: 'high' | 'medium' | 'low';
  ownerPredecessor: string;
  ownerSuccessor: string;
  scheduledDate: string;
  actualDate?: string;
}

export interface DependencyChain {
  chainId: string;
  chainName: string;
  projects: string[];
  totalTasks: number;
  completedTasks: number;
  atRiskTasks: number;
  criticalPathLength: number; // in days
  overallStatus: 'on-track' | 'at-risk' | 'delayed';
}

export default function CrossProjectDependencies() {
  const [viewMode, setViewMode] = useState<'dependencies' | 'chains'>('dependencies');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [dependencies] = useState<ProjectDependency[]>([
    {
      id: 'DEP-001',
      predecessorProject: 'PRJ-2025-001 (Hydraulic Press)',
      predecessorTask: 'Site Preparation Complete',
      successorProject: 'PRJ-2025-002 (CNC Upgrade)',
      successorTask: 'Equipment Installation Start',
      type: 'finish-to-start',
      status: 'completed',
      lagDays: 2,
      criticalPath: true,
      impact: 'high',
      ownerPredecessor: 'Team A',
      ownerSuccessor: 'Team B',
      scheduledDate: '2025-10-10',
      actualDate: '2025-10-09'
    },
    {
      id: 'DEP-002',
      predecessorProject: 'PRJ-2025-002 (CNC Upgrade)',
      predecessorTask: 'Hardware Procurement',
      successorProject: 'PRJ-2025-003 (Automation System)',
      successorTask: 'System Integration',
      type: 'finish-to-start',
      status: 'at-risk',
      lagDays: 0,
      criticalPath: true,
      impact: 'high',
      ownerPredecessor: 'Procurement Team',
      ownerSuccessor: 'Integration Team',
      scheduledDate: '2025-10-20'
    },
    {
      id: 'DEP-003',
      predecessorProject: 'PRJ-2025-001 (Hydraulic Press)',
      predecessorTask: 'Electrical Work Complete',
      successorProject: 'PRJ-2025-004 (Production Line)',
      successorTask: 'Power Systems Installation',
      type: 'finish-to-start',
      status: 'active',
      lagDays: 5,
      criticalPath: false,
      impact: 'medium',
      ownerPredecessor: 'Electrical Team',
      ownerSuccessor: 'Installation Team',
      scheduledDate: '2025-11-01'
    },
    {
      id: 'DEP-004',
      predecessorProject: 'PRJ-2025-003 (Automation System)',
      predecessorTask: 'Software Development',
      successorProject: 'PRJ-2025-002 (CNC Upgrade)',
      successorTask: 'Software Integration',
      type: 'start-to-start',
      status: 'blocked',
      lagDays: -3,
      criticalPath: true,
      impact: 'high',
      ownerPredecessor: 'Dev Team',
      ownerSuccessor: 'Integration Team',
      scheduledDate: '2025-10-15'
    },
    {
      id: 'DEP-005',
      predecessorProject: 'PRJ-2025-004 (Production Line)',
      predecessorTask: 'Equipment Testing',
      successorProject: 'PRJ-2025-001 (Hydraulic Press)',
      successorTask: 'Quality Validation',
      type: 'finish-to-finish',
      status: 'active',
      lagDays: 0,
      criticalPath: false,
      impact: 'low',
      ownerPredecessor: 'QA Team',
      ownerSuccessor: 'QA Team',
      scheduledDate: '2025-11-20'
    },
    {
      id: 'DEP-006',
      predecessorProject: 'PRJ-2025-002 (CNC Upgrade)',
      predecessorTask: 'Machine Calibration',
      successorProject: 'PRJ-2025-003 (Automation System)',
      successorTask: 'Integration Testing',
      type: 'finish-to-start',
      status: 'at-risk',
      lagDays: 1,
      criticalPath: true,
      impact: 'high',
      ownerPredecessor: 'Calibration Team',
      ownerSuccessor: 'Test Team',
      scheduledDate: '2025-10-25'
    }
  ]);

  const [dependencyChains] = useState<DependencyChain[]>([
    {
      chainId: 'CHAIN-001',
      chainName: 'Manufacturing Infrastructure Rollout',
      projects: ['PRJ-2025-001', 'PRJ-2025-002', 'PRJ-2025-003'],
      totalTasks: 24,
      completedTasks: 15,
      atRiskTasks: 3,
      criticalPathLength: 145,
      overallStatus: 'at-risk'
    },
    {
      chainId: 'CHAIN-002',
      chainName: 'Production Line Modernization',
      projects: ['PRJ-2025-001', 'PRJ-2025-004'],
      totalTasks: 18,
      completedTasks: 12,
      atRiskTasks: 1,
      criticalPathLength: 98,
      overallStatus: 'on-track'
    },
    {
      chainId: 'CHAIN-003',
      chainName: 'Automation & Integration Suite',
      projects: ['PRJ-2025-002', 'PRJ-2025-003', 'PRJ-2025-004'],
      totalTasks: 32,
      completedTasks: 8,
      atRiskTasks: 6,
      criticalPathLength: 178,
      overallStatus: 'delayed'
    }
  ]);

  const getDependencyTypeLabel = (type: DependencyType) => {
    switch (type) {
      case 'finish-to-start':
        return 'FS';
      case 'start-to-start':
        return 'SS';
      case 'finish-to-finish':
        return 'FF';
      case 'start-to-finish':
        return 'SF';
    }
  };

  const getDependencyStatusColor = (status: DependencyStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'active':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'blocked':
        return 'bg-red-100 text-red-700 border-red-300';
    }
  };

  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
    }
  };

  const getChainStatusColor = (status: 'on-track' | 'at-risk' | 'delayed') => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'delayed':
        return 'bg-red-100 text-red-700 border-red-300';
    }
  };

  const filteredDependencies = filterStatus === 'all'
    ? dependencies
    : dependencies.filter(d => d.status === filterStatus);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-white shadow-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <GitBranch className="h-8 w-8 text-purple-600" />
              Cross-Project Dependencies
            </h2>
            <p className="text-gray-600 mt-1">Track dependencies and critical paths across all projects</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('dependencies')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'dependencies'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Dependencies View
            </button>
            <button
              onClick={() => setViewMode('chains')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'chains'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Chains View
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'dependencies' && (
        <>
          {/* Filters */}
          <div className="bg-white shadow-md p-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Dependencies</option>
                <option value="active">Active</option>
                <option value="at-risk">At Risk</option>
                <option value="blocked">Blocked</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Dependencies List */}
          <div className="bg-white shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <h3 className="text-lg font-semibold text-gray-900">
                Project Dependencies ({filteredDependencies.length})
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-2">
                {filteredDependencies.map((dep) => (
                  <div key={dep.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    {/* Dependency Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Link2 className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{dep.id}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getDependencyStatusColor(dep.status)}`}>
                              {dep.status.toUpperCase()}
                            </span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              {getDependencyTypeLabel(dep.type)}
                            </span>
                            {dep.criticalPath && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                Critical Path
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Impact</p>
                        <p className={`text-sm font-bold ${getImpactColor(dep.impact)}`}>
                          {dep.impact.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {/* Dependency Flow */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                        {/* Predecessor */}
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Predecessor</p>
                          <p className="font-semibold text-gray-900 text-sm">{dep.predecessorProject}</p>
                          <p className="text-xs text-gray-700 mt-1">{dep.predecessorTask}</p>
                          <p className="text-xs text-blue-600 mt-1">Owner: {dep.ownerPredecessor}</p>
                        </div>

                        {/* Arrow with Lag/Lead */}
                        <div className="flex flex-col items-center justify-center">
                          <ArrowRight className="h-8 w-8 text-purple-600" />
                          <div className="mt-2 text-center">
                            <p className="text-xs text-gray-600">
                              {dep.lagDays > 0 ? 'Lag' : dep.lagDays < 0 ? 'Lead' : 'No Lag'}
                            </p>
                            {dep.lagDays !== 0 && (
                              <p className="text-sm font-semibold text-gray-900">
                                {Math.abs(dep.lagDays)} days
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Successor */}
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Successor</p>
                          <p className="font-semibold text-gray-900 text-sm">{dep.successorProject}</p>
                          <p className="text-xs text-gray-700 mt-1">{dep.successorTask}</p>
                          <p className="text-xs text-blue-600 mt-1">Owner: {dep.ownerSuccessor}</p>
                        </div>
                      </div>
                    </div>

                    {/* Schedule Info */}
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-600" />
                          <span className="text-gray-700">Scheduled: {dep.scheduledDate}</span>
                        </div>
                        {dep.actualDate && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-gray-700">Actual: {dep.actualDate}</span>
                          </div>
                        )}
                      </div>
                      {dep.status === 'blocked' && (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="font-medium">Action Required</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {viewMode === 'chains' && (
        <div className="bg-white shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Dependency Chains ({dependencyChains.length})
            </h3>
          </div>

          <div className="p-6">
            <div className="space-y-2">
              {dependencyChains.map((chain) => (
                <div key={chain.chainId} className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  {/* Chain Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{chain.chainName}</h4>
                      <p className="text-sm text-gray-600 mt-1">{chain.chainId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getChainStatusColor(chain.overallStatus)}`}>
                      {chain.overallStatus.toUpperCase()}
                    </span>
                  </div>

                  {/* Chain Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-2">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600 font-medium">Projects</p>
                      <p className="text-xl font-bold text-blue-900">{chain.projects.length}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 font-medium">Total Tasks</p>
                      <p className="text-xl font-bold text-gray-900">{chain.totalTasks}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-600 font-medium">Completed</p>
                      <p className="text-xl font-bold text-green-900">{chain.completedTasks}</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <p className="text-xs text-yellow-600 font-medium">At Risk</p>
                      <p className="text-xl font-bold text-yellow-900">{chain.atRiskTasks}</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-purple-600 font-medium">Critical Path</p>
                      <p className="text-xl font-bold text-purple-900">{chain.criticalPathLength}d</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Overall Progress</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {Math.round((chain.completedTasks / chain.totalTasks) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(chain.completedTasks / chain.totalTasks) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Involved Projects */}
                  <div className="mt-4">
                    <p className="text-xs text-gray-600 mb-2">Involved Projects:</p>
                    <div className="flex flex-wrap gap-2">
                      {chain.projects.map((projectId) => (
                        <span key={projectId} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {projectId}
                        </span>
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
