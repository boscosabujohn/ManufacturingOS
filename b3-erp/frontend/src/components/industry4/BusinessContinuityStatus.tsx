'use client';

import React, { useState, useEffect } from 'react';

// Types
export type HealthStatus = 'healthy' | 'degraded' | 'at_risk' | 'critical';
export type ProcessCategory = 'production' | 'supply_chain' | 'it_systems' | 'workforce' | 'facilities' | 'logistics';
export type RecoveryPriority = 'critical' | 'high' | 'medium' | 'low';

export interface CriticalProcess {
  id: string;
  name: string;
  category: ProcessCategory;
  description: string;
  status: HealthStatus;
  healthScore: number; // 0-100
  rto: number; // Recovery Time Objective in hours
  rpo: number; // Recovery Point Objective in hours
  mtpd: number; // Maximum Tolerable Period of Disruption in hours
  lastTested: Date;
  recoveryPriority: RecoveryPriority;
  dependencies: string[];
  backupProcedure: string;
  responsibleTeam: string;
  metrics: {
    uptime: number; // percentage
    incidentCount: number; // last 30 days
    avgRecoveryTime: number; // hours
  };
}

export interface IncidentHistory {
  id: string;
  processId: string;
  processName: string;
  type: 'outage' | 'degradation' | 'near_miss' | 'drill';
  severity: HealthStatus;
  startTime: Date;
  endTime: Date | null;
  duration: number; // hours
  rootCause: string;
  lessonsLearned: string;
  resolved: boolean;
}

export interface RecoveryPlan {
  id: string;
  processId: string;
  processName: string;
  steps: {
    order: number;
    action: string;
    responsible: string;
    estimatedTime: number; // minutes
    completed: boolean;
  }[];
  lastUpdated: Date;
  approvedBy: string;
}

export interface ContinuityMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

interface BusinessContinuityStatusProps {
  className?: string;
}

// Mock data generators
const generateCriticalProcesses = (): CriticalProcess[] => [
  {
    id: 'cp1',
    name: 'ERP System',
    category: 'it_systems',
    description: 'Core enterprise resource planning system for all operations',
    status: 'healthy',
    healthScore: 98,
    rto: 4,
    rpo: 1,
    mtpd: 24,
    lastTested: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    recoveryPriority: 'critical',
    dependencies: ['Database Server', 'Network Infrastructure', 'Cloud Services'],
    backupProcedure: 'Failover to DR site with automated replication',
    responsibleTeam: 'IT Operations',
    metrics: { uptime: 99.9, incidentCount: 1, avgRecoveryTime: 0.5 }
  },
  {
    id: 'cp2',
    name: 'Production Line Alpha',
    category: 'production',
    description: 'Primary assembly line for flagship products',
    status: 'healthy',
    healthScore: 92,
    rto: 8,
    rpo: 2,
    mtpd: 48,
    lastTested: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    recoveryPriority: 'critical',
    dependencies: ['ERP System', 'MES', 'Power Supply', 'Raw Materials'],
    backupProcedure: 'Switch to Production Line Beta with manual changeover',
    responsibleTeam: 'Production Operations',
    metrics: { uptime: 96.5, incidentCount: 3, avgRecoveryTime: 2.5 }
  },
  {
    id: 'cp3',
    name: 'Supplier Portal',
    category: 'supply_chain',
    description: 'Electronic interface for supplier orders and communication',
    status: 'degraded',
    healthScore: 72,
    rto: 12,
    rpo: 4,
    mtpd: 72,
    lastTested: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    recoveryPriority: 'high',
    dependencies: ['ERP System', 'Email Server', 'EDI Gateway'],
    backupProcedure: 'Manual order processing via email and phone',
    responsibleTeam: 'Supply Chain Management',
    metrics: { uptime: 94.2, incidentCount: 5, avgRecoveryTime: 4.0 }
  },
  {
    id: 'cp4',
    name: 'Warehouse Management',
    category: 'logistics',
    description: 'Inventory tracking and warehouse operations system',
    status: 'healthy',
    healthScore: 95,
    rto: 6,
    rpo: 2,
    mtpd: 36,
    lastTested: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    recoveryPriority: 'critical',
    dependencies: ['ERP System', 'Barcode Scanners', 'Network'],
    backupProcedure: 'Paper-based tracking with post-incident reconciliation',
    responsibleTeam: 'Warehouse Operations',
    metrics: { uptime: 99.1, incidentCount: 2, avgRecoveryTime: 1.5 }
  },
  {
    id: 'cp5',
    name: 'HVAC Systems',
    category: 'facilities',
    description: 'Climate control for production and storage areas',
    status: 'at_risk',
    healthScore: 58,
    rto: 2,
    rpo: 0,
    mtpd: 8,
    lastTested: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    recoveryPriority: 'high',
    dependencies: ['Power Supply', 'Building Management System'],
    backupProcedure: 'Portable cooling units and reduced operations',
    responsibleTeam: 'Facilities Management',
    metrics: { uptime: 91.5, incidentCount: 8, avgRecoveryTime: 3.0 }
  },
  {
    id: 'cp6',
    name: 'Quality Control Lab',
    category: 'production',
    description: 'Product testing and quality assurance facility',
    status: 'healthy',
    healthScore: 88,
    rto: 24,
    rpo: 8,
    mtpd: 72,
    lastTested: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    recoveryPriority: 'high',
    dependencies: ['Lab Equipment', 'LIMS', 'Power Supply'],
    backupProcedure: 'Third-party lab partnership for emergency testing',
    responsibleTeam: 'Quality Assurance',
    metrics: { uptime: 98.2, incidentCount: 2, avgRecoveryTime: 2.0 }
  },
  {
    id: 'cp7',
    name: 'Workforce Scheduling',
    category: 'workforce',
    description: 'Employee scheduling and time tracking system',
    status: 'critical',
    healthScore: 35,
    rto: 12,
    rpo: 4,
    mtpd: 48,
    lastTested: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    recoveryPriority: 'medium',
    dependencies: ['HR System', 'ERP System'],
    backupProcedure: 'Manual scheduling with spreadsheet backup',
    responsibleTeam: 'Human Resources',
    metrics: { uptime: 82.5, incidentCount: 12, avgRecoveryTime: 6.0 }
  },
  {
    id: 'cp8',
    name: 'Customer Order Portal',
    category: 'it_systems',
    description: 'B2B customer ordering and tracking system',
    status: 'healthy',
    healthScore: 94,
    rto: 4,
    rpo: 1,
    mtpd: 24,
    lastTested: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    recoveryPriority: 'critical',
    dependencies: ['ERP System', 'CDN', 'Payment Gateway'],
    backupProcedure: 'Phone/email order processing with dedicated team',
    responsibleTeam: 'IT Operations',
    metrics: { uptime: 99.5, incidentCount: 1, avgRecoveryTime: 0.8 }
  }
];

const generateIncidentHistory = (): IncidentHistory[] => [
  {
    id: 'ih1',
    processId: 'cp7',
    processName: 'Workforce Scheduling',
    type: 'outage',
    severity: 'critical',
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
    duration: 6,
    rootCause: 'Database corruption due to failed update',
    lessonsLearned: 'Implement pre-update backup verification',
    resolved: true
  },
  {
    id: 'ih2',
    processId: 'cp5',
    processName: 'HVAC Systems',
    type: 'degradation',
    severity: 'at_risk',
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
    duration: 4,
    rootCause: 'Compressor failure in Zone B',
    lessonsLearned: 'Increase preventive maintenance frequency',
    resolved: true
  },
  {
    id: 'ih3',
    processId: 'cp3',
    processName: 'Supplier Portal',
    type: 'near_miss',
    severity: 'degraded',
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    duration: 2,
    rootCause: 'Certificate expiration detected before outage',
    lessonsLearned: 'Implement certificate monitoring alerts',
    resolved: true
  },
  {
    id: 'ih4',
    processId: 'cp1',
    processName: 'ERP System',
    type: 'drill',
    severity: 'healthy',
    startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 + 0.5 * 60 * 60 * 1000),
    duration: 0.5,
    rootCause: 'Scheduled DR failover test',
    lessonsLearned: 'DR site recovered within RTO, no issues identified',
    resolved: true
  }
];

const generateContinuityMetrics = (): ContinuityMetric[] => [
  { name: 'Overall BCP Score', value: 78, target: 90, unit: '%', trend: 'up', status: 'warning' },
  { name: 'Critical Process Uptime', value: 97.2, target: 99, unit: '%', trend: 'stable', status: 'warning' },
  { name: 'Avg Recovery Time', value: 2.8, target: 4, unit: 'hrs', trend: 'down', status: 'good' },
  { name: 'Plans Tested (90d)', value: 6, target: 8, unit: '', trend: 'up', status: 'warning' },
  { name: 'Open Incidents', value: 2, target: 0, unit: '', trend: 'stable', status: 'warning' },
  { name: 'Staff Trained', value: 92, target: 95, unit: '%', trend: 'up', status: 'warning' }
];

const BusinessContinuityStatus: React.FC<BusinessContinuityStatusProps> = ({ className = '' }) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'processes' | 'incidents' | 'drills'>('dashboard');
  const [processes, setProcesses] = useState<CriticalProcess[]>([]);
  const [incidents, setIncidents] = useState<IncidentHistory[]>([]);
  const [metrics, setMetrics] = useState<ContinuityMetric[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProcessCategory | 'all'>('all');

  useEffect(() => {
    setProcesses(generateCriticalProcesses());
    setIncidents(generateIncidentHistory());
    setMetrics(generateContinuityMetrics());
  }, []);

  const getHealthColor = (status: HealthStatus): string => {
    switch (status) {
      case 'healthy': return '#22c55e';
      case 'degraded': return '#eab308';
      case 'at_risk': return '#f59e0b';
      case 'critical': return '#dc2626';
    }
  };

  const getPriorityColor = (priority: RecoveryPriority): string => {
    switch (priority) {
      case 'critical': return '#dc2626';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#22c55e';
    }
  };

  const getCategoryIcon = (category: ProcessCategory): string => {
    switch (category) {
      case 'production': return '🏭';
      case 'supply_chain': return '🔗';
      case 'it_systems': return '💻';
      case 'workforce': return '👥';
      case 'facilities': return '🏢';
      case 'logistics': return '🚚';
    }
  };

  const getIncidentTypeColor = (type: IncidentHistory['type']): string => {
    switch (type) {
      case 'outage': return '#dc2626';
      case 'degradation': return '#f59e0b';
      case 'near_miss': return '#eab308';
      case 'drill': return '#3b82f6';
    }
  };

  const filteredProcesses = processes.filter(p =>
    selectedCategory === 'all' || p.category === selectedCategory
  );

  const statusCounts = {
    healthy: processes.filter(p => p.status === 'healthy').length,
    degraded: processes.filter(p => p.status === 'degraded').length,
    at_risk: processes.filter(p => p.status === 'at_risk').length,
    critical: processes.filter(p => p.status === 'critical').length
  };

  const overallHealth = processes.reduce((sum, p) => sum + p.healthScore, 0) / processes.length;

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Overall Health Gauge */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">Overall BCP Health</h3>
          <div className="relative w-40 h-40 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="12" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={getHealthColor(overallHealth >= 80 ? 'healthy' : overallHealth >= 60 ? 'degraded' : overallHealth >= 40 ? 'at_risk' : 'critical')}
                strokeWidth="12"
                strokeDasharray={`${overallHealth * 2.51} 251`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">{overallHealth.toFixed(0)}%</div>
                <div className="text-xs text-gray-500">Health Score</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Process Status Summary</h3>
          <div className="grid grid-cols-4 gap-3">
            {(['healthy', 'degraded', 'at_risk', 'critical'] as HealthStatus[]).map(status => (
              <div
                key={status}
                className="rounded-lg p-4 text-center"
                style={{ backgroundColor: `${getHealthColor(status)}15` }}
              >
                <div className="text-3xl font-bold" style={{ color: getHealthColor(status) }}>
                  {statusCounts[status]}
                </div>
                <div className="text-xs font-medium capitalize" style={{ color: getHealthColor(status) }}>
                  {status.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Process Health Distribution</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
              {(['healthy', 'degraded', 'at_risk', 'critical'] as HealthStatus[]).map(status => {
                const width = (statusCounts[status] / processes.length) * 100;
                return width > 0 ? (
                  <div
                    key={status}
                    className="h-full transition-all"
                    style={{ width: `${width}%`, backgroundColor: getHealthColor(status) }}
                  ></div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-6 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">{metric.name}</div>
            <div className="flex items-end gap-2">
              <span className={`text-2xl font-bold ${
                metric.status === 'good' ? 'text-green-600' :
                metric.status === 'warning' ? 'text-amber-600' : 'text-red-600'
              }`}>
                {metric.value}{metric.unit}
              </span>
              <span className="text-xs text-gray-400 mb-1">/ {metric.target}{metric.unit}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              {metric.trend === 'up' && <span className="text-green-500">↑</span>}
              {metric.trend === 'down' && <span className="text-red-500">↓</span>}
              {metric.trend === 'stable' && <span className="text-gray-400">→</span>}
              <span className="text-xs text-gray-500">{metric.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Critical Processes Quick View */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-700">Critical Process Status</h3>
          <button
            onClick={() => setActiveView('processes')}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            View All →
          </button>
        </div>
        <div className="space-y-3">
          {processes.filter(p => p.recoveryPriority === 'critical').map(process => (
            <div
              key={process.id}
              className="flex items-center justify-between p-3 rounded-lg border"
              style={{ borderColor: getHealthColor(process.status) }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{getCategoryIcon(process.category)}</span>
                <div>
                  <div className="font-medium text-sm">{process.name}</div>
                  <div className="text-xs text-gray-500">{process.responsibleTeam}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold" style={{ color: getHealthColor(process.status) }}>
                    {process.healthScore}%
                  </div>
                  <div className="text-xs text-gray-500">Health</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-800">{process.rto}h</div>
                  <div className="text-xs text-gray-500">RTO</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-800">{process.metrics.uptime}%</div>
                  <div className="text-xs text-gray-500">Uptime</div>
                </div>
                <span
                  className="px-2 py-1 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: getHealthColor(process.status) }}
                >
                  {process.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-700">Recent Incidents & Drills</h3>
          <button
            onClick={() => setActiveView('incidents')}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            View History →
          </button>
        </div>
        <div className="space-y-2">
          {incidents.slice(0, 3).map(incident => (
            <div
              key={incident.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span
                  className="px-2 py-0.5 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: getIncidentTypeColor(incident.type) }}
                >
                  {incident.type.replace('_', ' ').toUpperCase()}
                </span>
                <div>
                  <div className="font-medium text-sm">{incident.processName}</div>
                  <div className="text-xs text-gray-500">{incident.rootCause}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{incident.duration}h duration</div>
                <div className="text-xs text-gray-500">{incident.startTime.toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProcesses = () => (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'production', 'supply_chain', 'it_systems', 'workforce', 'facilities', 'logistics'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat !== 'all' && <span>{getCategoryIcon(cat)}</span>}
            {cat === 'all' ? 'All' : cat.replace('_', ' ').charAt(0).toUpperCase() + cat.replace('_', ' ').slice(1)}
          </button>
        ))}
      </div>

      {/* Process Cards */}
      <div className="grid grid-cols-2 gap-4">
        {filteredProcesses.map(process => (
          <div
            key={process.id}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{getCategoryIcon(process.category)}</span>
                <div>
                  <h4 className="font-semibold text-gray-800">{process.name}</h4>
                  <p className="text-xs text-gray-500">{process.responsibleTeam}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span
                  className="px-2 py-1 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: getPriorityColor(process.recoveryPriority) }}
                >
                  {process.recoveryPriority.toUpperCase()}
                </span>
                <span
                  className="px-2 py-1 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: getHealthColor(process.status) }}
                >
                  {process.healthScore}%
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-3">{process.description}</p>

            {/* Health Bar */}
            <div className="mb-3">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${process.healthScore}%`, backgroundColor: getHealthColor(process.status) }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center mb-3">
              <div className="bg-gray-50 rounded p-2">
                <div className="text-sm font-bold text-gray-800">{process.rto}h</div>
                <div className="text-xs text-gray-500">RTO</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-sm font-bold text-gray-800">{process.rpo}h</div>
                <div className="text-xs text-gray-500">RPO</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-sm font-bold text-gray-800">{process.metrics.uptime}%</div>
                <div className="text-xs text-gray-500">Uptime</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-sm font-bold text-gray-800">{process.metrics.incidentCount}</div>
                <div className="text-xs text-gray-500">Incidents</div>
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-2">
              <span className="font-medium">Last Tested:</span> {process.lastTested.toLocaleDateString()}
            </div>

            {process.dependencies.length > 0 && (
              <div className="pt-2 border-t">
                <div className="text-xs text-gray-500 mb-1">Dependencies:</div>
                <div className="flex flex-wrap gap-1">
                  {process.dependencies.map((dep, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderIncidents = () => (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 text-xs font-semibold text-gray-600">Type</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-600">Process</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-600">Root Cause</th>
              <th className="text-center p-3 text-xs font-semibold text-gray-600">Duration</th>
              <th className="text-center p-3 text-xs font-semibold text-gray-600">Date</th>
              <th className="text-center p-3 text-xs font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map(incident => (
              <tr key={incident.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <span
                    className="px-2 py-1 rounded text-xs font-medium text-white"
                    style={{ backgroundColor: getIncidentTypeColor(incident.type) }}
                  >
                    {incident.type.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="p-3">
                  <div className="font-medium text-sm">{incident.processName}</div>
                </td>
                <td className="p-3">
                  <div className="text-sm text-gray-600">{incident.rootCause}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    <span className="font-medium">Lessons:</span> {incident.lessonsLearned}
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span className="font-medium">{incident.duration}h</span>
                </td>
                <td className="p-3 text-center text-sm">
                  {incident.startTime.toLocaleDateString()}
                </td>
                <td className="p-3 text-center">
                  {incident.resolved ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Resolved</span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDrills = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Drills Completed (YTD)</div>
          <div className="text-3xl font-bold text-blue-600">12</div>
          <div className="text-xs text-gray-500 mt-1">Target: 16</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Avg Recovery Time</div>
          <div className="text-3xl font-bold text-green-600">2.1h</div>
          <div className="text-xs text-gray-500 mt-1">Target RTO: 4h</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Success Rate</div>
          <div className="text-3xl font-bold text-green-600">92%</div>
          <div className="text-xs text-gray-500 mt-1">Target: 95%</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Drill Schedule</h3>
        <div className="space-y-3">
          {processes.slice(0, 4).map(process => {
            const nextDrill = new Date(process.lastTested);
            nextDrill.setDate(nextDrill.getDate() + 90);
            const daysUntil = Math.ceil((nextDrill.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            const overdue = daysUntil < 0;

            return (
              <div key={process.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getCategoryIcon(process.category)}</span>
                  <div>
                    <div className="font-medium text-sm">{process.name}</div>
                    <div className="text-xs text-gray-500">
                      Last tested: {process.lastTested.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`text-sm font-medium ${overdue ? 'text-red-600' : daysUntil < 14 ? 'text-amber-600' : 'text-gray-800'}`}>
                      {overdue ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days until next`}
                    </div>
                    <div className="text-xs text-gray-500">Next: {nextDrill.toLocaleDateString()}</div>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                    Schedule
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Recovery Plan Templates</h3>
        <div className="grid grid-cols-2 gap-4">
          {['IT System Failover', 'Production Line Switch', 'Supplier Contingency', 'Facility Evacuation'].map((template, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-3 hover:border-blue-500 cursor-pointer transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm">{template}</div>
                  <div className="text-xs text-gray-500">Last updated: {new Date(Date.now() - idx * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Business Continuity Status</h2>
          <p className="text-sm text-gray-600">Visual health check of critical business processes</p>
        </div>
        <div className="flex gap-2">
          {(['dashboard', 'processes', 'incidents', 'drills'] as const).map(view => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === view
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeView === 'dashboard' && renderDashboard()}
      {activeView === 'processes' && renderProcesses()}
      {activeView === 'incidents' && renderIncidents()}
      {activeView === 'drills' && renderDrills()}
    </div>
  );
};

export default BusinessContinuityStatus;
