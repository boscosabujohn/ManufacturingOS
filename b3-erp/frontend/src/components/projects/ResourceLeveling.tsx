'use client'

import { useState } from 'react'
import { Users, TrendingUp, AlertTriangle, CheckCircle, Calendar, Zap, Activity, UserCheck } from 'lucide-react'

export type AllocationStatus = 'available' | 'allocated' | 'overallocated' | 'underutilized';
export type ResourceType = 'engineer' | 'technician' | 'manager' | 'specialist' | 'contractor';

export interface ResourceAllocation {
  resourceId: string;
  resourceName: string;
  type: ResourceType;
  skillSet: string[];
  totalCapacity: number; // hours per week
  allocatedHours: number;
  availableHours: number;
  utilizationPercent: number;
  status: AllocationStatus;
  projects: {
    projectId: string;
    projectName: string;
    allocatedHours: number;
    startDate: string;
    endDate: string;
  }[];
}

export interface ResourceConflict {
  id: string;
  resourceName: string;
  conflictType: 'overallocation' | 'skill-gap' | 'timing-conflict';
  severity: 'high' | 'medium' | 'low';
  affectedProjects: string[];
  description: string;
  suggestedResolution: string;
}

export interface ResourceDemand {
  projectId: string;
  projectName: string;
  requiredSkills: string[];
  requiredHours: number;
  startDate: string;
  endDate: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  fulfillmentPercent: number;
}

export default function ResourceLeveling() {
  const [viewMode, setViewMode] = useState<'allocations' | 'conflicts' | 'demand'>('allocations');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [resourceAllocations] = useState<ResourceAllocation[]>([
    {
      resourceId: 'RES-001',
      resourceName: 'Rajesh Kumar',
      type: 'engineer',
      skillSet: ['Mechanical Design', 'CAD', 'Project Management'],
      totalCapacity: 40,
      allocatedHours: 45,
      availableHours: -5,
      utilizationPercent: 112.5,
      status: 'overallocated',
      projects: [
        { projectId: 'PRJ-2025-001', projectName: 'Hydraulic Press', allocatedHours: 25, startDate: '2025-10-01', endDate: '2025-11-30' },
        { projectId: 'PRJ-2025-002', projectName: 'CNC Upgrade', allocatedHours: 20, startDate: '2025-10-15', endDate: '2025-12-15' }
      ]
    },
    {
      resourceId: 'RES-002',
      resourceName: 'Priya Sharma',
      type: 'specialist',
      skillSet: ['Automation', 'PLC Programming', 'SCADA'],
      totalCapacity: 40,
      allocatedHours: 40,
      availableHours: 0,
      utilizationPercent: 100,
      status: 'allocated',
      projects: [
        { projectId: 'PRJ-2025-003', projectName: 'Automation System', allocatedHours: 40, startDate: '2025-09-01', endDate: '2025-12-31' }
      ]
    },
    {
      resourceId: 'RES-003',
      resourceName: 'Amit Patel',
      type: 'technician',
      skillSet: ['Electrical', 'Installation', 'Troubleshooting'],
      totalCapacity: 40,
      allocatedHours: 52,
      availableHours: -12,
      utilizationPercent: 130,
      status: 'overallocated',
      projects: [
        { projectId: 'PRJ-2025-001', projectName: 'Hydraulic Press', allocatedHours: 30, startDate: '2025-10-01', endDate: '2025-11-30' },
        { projectId: 'PRJ-2025-004', projectName: 'Production Line', allocatedHours: 22, startDate: '2025-10-01', endDate: '2026-03-31' }
      ]
    },
    {
      resourceId: 'RES-004',
      resourceName: 'Sunita Verma',
      type: 'manager',
      skillSet: ['Project Management', 'Stakeholder Management', 'Risk Management'],
      totalCapacity: 40,
      allocatedHours: 35,
      availableHours: 5,
      utilizationPercent: 87.5,
      status: 'allocated',
      projects: [
        { projectId: 'PRJ-2025-002', projectName: 'CNC Upgrade', allocatedHours: 20, startDate: '2025-09-15', endDate: '2025-12-15' },
        { projectId: 'PRJ-2025-003', projectName: 'Automation System', allocatedHours: 15, startDate: '2025-09-01', endDate: '2025-12-31' }
      ]
    },
    {
      resourceId: 'RES-005',
      resourceName: 'Vikram Singh',
      type: 'engineer',
      skillSet: ['Hydraulics', 'Mechanical', 'Quality Control'],
      totalCapacity: 40,
      allocatedHours: 15,
      availableHours: 25,
      utilizationPercent: 37.5,
      status: 'underutilized',
      projects: [
        { projectId: 'PRJ-2025-001', projectName: 'Hydraulic Press', allocatedHours: 15, startDate: '2025-10-01', endDate: '2025-11-30' }
      ]
    },
    {
      resourceId: 'RES-006',
      resourceName: 'Neha Gupta',
      type: 'contractor',
      skillSet: ['Software Development', 'Integration', 'Testing'],
      totalCapacity: 40,
      allocatedHours: 0,
      availableHours: 40,
      utilizationPercent: 0,
      status: 'available',
      projects: []
    }
  ]);

  const [resourceConflicts] = useState<ResourceConflict[]>([
    {
      id: 'CONF-001',
      resourceName: 'Rajesh Kumar',
      conflictType: 'overallocation',
      severity: 'high',
      affectedProjects: ['PRJ-2025-001', 'PRJ-2025-002'],
      description: 'Allocated 45 hours/week against 40 hour capacity (112.5% utilization)',
      suggestedResolution: 'Reduce allocation on PRJ-2025-002 by 5 hours or assign contractor support'
    },
    {
      id: 'CONF-002',
      resourceName: 'Amit Patel',
      conflictType: 'overallocation',
      severity: 'high',
      affectedProjects: ['PRJ-2025-001', 'PRJ-2025-004'],
      description: 'Allocated 52 hours/week against 40 hour capacity (130% utilization)',
      suggestedResolution: 'Critical overallocation - hire additional technician or reduce scope on one project'
    },
    {
      id: 'CONF-003',
      resourceName: 'Production Line Setup',
      conflictType: 'skill-gap',
      severity: 'medium',
      affectedProjects: ['PRJ-2025-004'],
      description: 'Requires 2 additional software developers with SCADA expertise',
      suggestedResolution: 'Engage contractors Neha Gupta or recruit external specialists'
    },
    {
      id: 'CONF-004',
      resourceName: 'Automation System',
      conflictType: 'timing-conflict',
      severity: 'medium',
      affectedProjects: ['PRJ-2025-003'],
      description: 'Integration phase requires 3 resources simultaneously but only 1 available',
      suggestedResolution: 'Stagger integration tasks or postpone start by 2 weeks'
    }
  ]);

  const [resourceDemand] = useState<ResourceDemand[]>([
    {
      projectId: 'PRJ-2025-001',
      projectName: 'Hydraulic Press Installation',
      requiredSkills: ['Mechanical Design', 'Electrical', 'Installation'],
      requiredHours: 70,
      startDate: '2025-10-01',
      endDate: '2025-11-30',
      priority: 'critical',
      fulfillmentPercent: 100
    },
    {
      projectId: 'PRJ-2025-002',
      projectName: 'CNC Machine Upgrade',
      requiredSkills: ['Mechanical', 'CAD', 'Project Management'],
      requiredHours: 40,
      startDate: '2025-09-15',
      endDate: '2025-12-15',
      priority: 'high',
      fulfillmentPercent: 100
    },
    {
      projectId: 'PRJ-2025-003',
      projectName: 'Automation System',
      requiredSkills: ['Automation', 'PLC Programming', 'Software Development'],
      requiredHours: 55,
      startDate: '2025-09-01',
      endDate: '2025-12-31',
      priority: 'critical',
      fulfillmentPercent: 72.7
    },
    {
      projectId: 'PRJ-2025-004',
      projectName: 'Production Line Setup',
      requiredSkills: ['Electrical', 'Mechanical', 'Software', 'Integration'],
      requiredHours: 22,
      startDate: '2025-10-01',
      endDate: '2026-03-31',
      priority: 'medium',
      fulfillmentPercent: 100
    }
  ]);

  const getAllocationStatusColor = (status: AllocationStatus) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'allocated':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'overallocated':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'underutilized':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
  };

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const getPriorityColor = (priority: 'critical' | 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
    }
  };

  const getUtilizationColor = (percent: number) => {
    if (percent > 100) return 'text-red-600';
    if (percent >= 80) return 'text-green-600';
    if (percent >= 50) return 'text-blue-600';
    return 'text-yellow-600';
  };

  const getUtilizationBarColor = (percent: number) => {
    if (percent > 100) return 'bg-red-500';
    if (percent >= 80) return 'bg-green-500';
    if (percent >= 50) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  const filteredResources = filterStatus === 'all'
    ? resourceAllocations
    : resourceAllocations.filter(r => r.status === filterStatus);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-white shadow-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="h-8 w-8 text-indigo-600" />
              Resource Leveling & Optimization
            </h2>
            <p className="text-gray-600 mt-1">Balance resource allocation across projects</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('allocations')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'allocations'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Allocations
            </button>
            <button
              onClick={() => setViewMode('conflicts')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'conflicts'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Conflicts
            </button>
            <button
              onClick={() => setViewMode('demand')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'demand'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Demand
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'allocations' && (
        <>
          {/* Filter */}
          <div className="bg-white shadow-md p-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Resources</option>
                <option value="available">Available</option>
                <option value="allocated">Allocated</option>
                <option value="overallocated">Overallocated</option>
                <option value="underutilized">Underutilized</option>
              </select>
            </div>
          </div>

          {/* Resource Allocations */}
          <div className="bg-white shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <h3 className="text-lg font-semibold text-gray-900">
                Resource Allocations ({filteredResources.length})
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-2">
                {filteredResources.map((resource) => (
                  <div key={resource.resourceId} className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    {/* Resource Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 rounded-full">
                          <UserCheck className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{resource.resourceName}</h4>
                          <p className="text-sm text-gray-600 capitalize">{resource.type} • {resource.resourceId}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {resource.skillSet.map((skill, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getAllocationStatusColor(resource.status)}`}>
                        {resource.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Utilization Metrics */}
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium">Capacity</p>
                        <p className="text-lg font-bold text-blue-900">{resource.totalCapacity}h</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-purple-600 font-medium">Allocated</p>
                        <p className="text-lg font-bold text-purple-900">{resource.allocatedHours}h</p>
                      </div>
                      <div className={`text-center p-3 rounded-lg ${
                        resource.availableHours >= 0 ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        <p className={`text-xs font-medium ${resource.availableHours >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          Available
                        </p>
                        <p className={`text-lg font-bold ${resource.availableHours >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                          {resource.availableHours}h
                        </p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 font-medium">Utilization</p>
                        <p className={`text-lg font-bold ${getUtilizationColor(resource.utilizationPercent)}`}>
                          {resource.utilizationPercent}%
                        </p>
                      </div>
                    </div>

                    {/* Utilization Bar */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Capacity Utilization</span>
                        {resource.utilizationPercent > 100 && (
                          <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Overallocated
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${getUtilizationBarColor(resource.utilizationPercent)}`}
                          style={{ width: `${Math.min(resource.utilizationPercent, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Project Allocations */}
                    {resource.projects.length > 0 ? (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Project Allocations:</p>
                        <div className="space-y-2">
                          {resource.projects.map((project, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{project.projectName}</p>
                                <p className="text-xs text-gray-600">{project.projectId}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">{project.allocatedHours}h/week</p>
                                <p className="text-xs text-gray-600">{project.startDate} - {project.endDate}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                        <p className="text-sm text-green-700 font-medium">Available for allocation</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {viewMode === 'conflicts' && (
        <div className="bg-white shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              Resource Conflicts ({resourceConflicts.length})
            </h3>
          </div>

          <div className="p-6">
            <div className="space-y-2">
              {resourceConflicts.map((conflict) => (
                <div key={conflict.id} className="p-5 border-2 border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{conflict.resourceName}</h4>
                      <p className="text-sm text-gray-600 capitalize">{conflict.conflictType.replace('-', ' ')}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(conflict.severity)}`}>
                      {conflict.severity.toUpperCase()} SEVERITY
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-700 mb-2">{conflict.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-gray-600">Affected Projects:</span>
                      {conflict.affectedProjects.map((projectId, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-gray-300">
                          {projectId}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-green-300">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-green-700">Suggested Resolution:</p>
                        <p className="text-sm text-gray-700 mt-1">{conflict.suggestedResolution}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'demand' && (
        <div className="bg-white shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="h-6 w-6 text-indigo-600" />
              Resource Demand Forecast
            </h3>
          </div>

          <div className="p-6">
            <div className="space-y-2">
              {resourceDemand.map((demand) => (
                <div key={demand.projectId} className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{demand.projectName}</h4>
                      <p className="text-sm text-gray-600">{demand.projectId}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold ${getPriorityColor(demand.priority)}`}>
                        {demand.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600 font-medium">Required Hours/Week</p>
                      <p className="text-xl font-bold text-blue-900">{demand.requiredHours}h</p>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      demand.fulfillmentPercent >= 100 ? 'bg-green-50' : 'bg-yellow-50'
                    }`}>
                      <p className={`text-xs font-medium ${
                        demand.fulfillmentPercent >= 100 ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        Fulfillment
                      </p>
                      <p className={`text-xl font-bold ${
                        demand.fulfillmentPercent >= 100 ? 'text-green-900' : 'text-yellow-900'
                      }`}>
                        {demand.fulfillmentPercent.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Fulfillment Status</span>
                      {demand.fulfillmentPercent < 100 && (
                        <span className="text-xs text-yellow-600 font-medium flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Resource gap
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          demand.fulfillmentPercent >= 100 ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${demand.fulfillmentPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600">Required Skills:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {demand.requiredSkills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs">{demand.startDate} - {demand.endDate}</span>
                      </div>
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
