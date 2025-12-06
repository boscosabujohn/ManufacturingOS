'use client';

import React, { useState, useEffect } from 'react';

// Types
export type CapacityStatus = 'underutilized' | 'optimal' | 'strained' | 'overloaded';
export type SurgeLevel = 'none' | 'moderate' | 'high' | 'critical';
export type ResourceType = 'machine' | 'labor' | 'material' | 'tooling';

export interface CapacityResource {
  id: string;
  name: string;
  type: ResourceType;
  department: string;
  baseCapacity: number; // units per day
  currentCapacity: number;
  maxCapacity: number; // with surge/overtime
  currentDemand: number;
  forecastDemand: number; // next 30 days average
  utilizationRate: number; // percentage
  status: CapacityStatus;
  flexibilityScore: number; // 0-100
  surgeAvailable: number; // additional capacity available
  constraints: string[];
}

export interface DemandForecast {
  date: Date;
  demand: number;
  capacity: number;
  surgeCapacity: number;
}

export interface SurgeIndicator {
  id: string;
  resourceId: string;
  resourceName: string;
  triggerDate: Date;
  surgeLevel: SurgeLevel;
  demandIncrease: number; // percentage
  durationDays: number;
  actionRequired: string;
  estimatedCost: number;
}

export interface FlexibilityOption {
  id: string;
  name: string;
  type: 'overtime' | 'shift_add' | 'temp_labor' | 'outsource' | 'equipment_rental' | 'expedite_materials';
  capacityIncrease: number; // percentage
  leadTime: number; // days to implement
  costPerUnit: number;
  maxDuration: number; // days
  availability: 'available' | 'limited' | 'unavailable';
  constraints: string[];
}

interface CapacityFlexibilityViewProps {
  className?: string;
}

// Mock data generators
const generateCapacityResources = (): CapacityResource[] => [
  {
    id: 'cr1',
    name: 'CNC Machining Center',
    type: 'machine',
    department: 'Production',
    baseCapacity: 500,
    currentCapacity: 500,
    maxCapacity: 650,
    currentDemand: 480,
    forecastDemand: 580,
    utilizationRate: 96,
    status: 'strained',
    flexibilityScore: 45,
    surgeAvailable: 150,
    constraints: ['Skilled operator shortage', 'Tooling changeover time']
  },
  {
    id: 'cr2',
    name: 'Assembly Line A',
    type: 'machine',
    department: 'Production',
    baseCapacity: 800,
    currentCapacity: 800,
    maxCapacity: 1000,
    currentDemand: 720,
    forecastDemand: 850,
    utilizationRate: 90,
    status: 'optimal',
    flexibilityScore: 65,
    surgeAvailable: 200,
    constraints: ['Component availability']
  },
  {
    id: 'cr3',
    name: 'Production Operators',
    type: 'labor',
    department: 'Production',
    baseCapacity: 40,
    currentCapacity: 38,
    maxCapacity: 52,
    currentDemand: 42,
    forecastDemand: 48,
    utilizationRate: 110,
    status: 'overloaded',
    flexibilityScore: 55,
    surgeAvailable: 14,
    constraints: ['Training required for new hires', '2 week lead time for temps']
  },
  {
    id: 'cr4',
    name: 'Quality Inspectors',
    type: 'labor',
    department: 'Quality',
    baseCapacity: 12,
    currentCapacity: 12,
    maxCapacity: 15,
    currentDemand: 10,
    forecastDemand: 14,
    utilizationRate: 83,
    status: 'optimal',
    flexibilityScore: 70,
    surgeAvailable: 3,
    constraints: ['Certification requirements']
  },
  {
    id: 'cr5',
    name: 'Raw Material - Steel',
    type: 'material',
    department: 'Supply Chain',
    baseCapacity: 5000,
    currentCapacity: 4200,
    maxCapacity: 6500,
    currentDemand: 4800,
    forecastDemand: 5200,
    utilizationRate: 114,
    status: 'overloaded',
    flexibilityScore: 40,
    surgeAvailable: 2300,
    constraints: ['Supplier capacity limits', '4-week lead time']
  },
  {
    id: 'cr6',
    name: 'Injection Molding',
    type: 'machine',
    department: 'Production',
    baseCapacity: 1200,
    currentCapacity: 1200,
    maxCapacity: 1400,
    currentDemand: 650,
    forecastDemand: 720,
    utilizationRate: 54,
    status: 'underutilized',
    flexibilityScore: 85,
    surgeAvailable: 750,
    constraints: []
  },
  {
    id: 'cr7',
    name: 'Specialized Tooling',
    type: 'tooling',
    department: 'Production',
    baseCapacity: 20,
    currentCapacity: 18,
    maxCapacity: 24,
    currentDemand: 19,
    forecastDemand: 22,
    utilizationRate: 106,
    status: 'strained',
    flexibilityScore: 35,
    surgeAvailable: 6,
    constraints: ['Long lead time for new tools', 'Single supplier']
  }
];

const generateDemandForecast = (): DemandForecast[] => {
  const forecast: DemandForecast[] = [];
  const baseDate = new Date();
  const baseDemand = 4200;
  const baseCapacity = 4500;
  const surgeCapacity = 5500;

  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);

    // Simulate demand variation with a surge around day 15-20
    let demandMultiplier = 1;
    if (i >= 12 && i <= 22) {
      demandMultiplier = 1 + (0.35 * Math.sin((i - 12) * Math.PI / 10));
    }

    forecast.push({
      date,
      demand: Math.round(baseDemand * demandMultiplier * (0.95 + Math.random() * 0.1)),
      capacity: baseCapacity,
      surgeCapacity
    });
  }

  return forecast;
};

const generateSurgeIndicators = (): SurgeIndicator[] => [
  {
    id: 'si1',
    resourceId: 'cr1',
    resourceName: 'CNC Machining Center',
    triggerDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    surgeLevel: 'high',
    demandIncrease: 35,
    durationDays: 14,
    actionRequired: 'Schedule overtime and consider outsourcing',
    estimatedCost: 28000
  },
  {
    id: 'si2',
    resourceId: 'cr3',
    resourceName: 'Production Operators',
    triggerDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    surgeLevel: 'critical',
    demandIncrease: 25,
    durationDays: 21,
    actionRequired: 'Immediate temp staffing needed',
    estimatedCost: 45000
  },
  {
    id: 'si3',
    resourceId: 'cr5',
    resourceName: 'Raw Material - Steel',
    triggerDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    surgeLevel: 'moderate',
    demandIncrease: 15,
    durationDays: 30,
    actionRequired: 'Place expedited order with secondary supplier',
    estimatedCost: 12000
  }
];

const generateFlexibilityOptions = (): FlexibilityOption[] => [
  {
    id: 'fo1',
    name: 'Weekend Overtime',
    type: 'overtime',
    capacityIncrease: 20,
    leadTime: 1,
    costPerUnit: 45,
    maxDuration: 14,
    availability: 'available',
    constraints: ['Union agreement limits', 'Fatigue management required']
  },
  {
    id: 'fo2',
    name: 'Add Third Shift',
    type: 'shift_add',
    capacityIncrease: 33,
    leadTime: 14,
    costPerUnit: 38,
    maxDuration: 90,
    availability: 'limited',
    constraints: ['Supervisor availability', 'Training requirements']
  },
  {
    id: 'fo3',
    name: 'Temporary Workers',
    type: 'temp_labor',
    capacityIncrease: 25,
    leadTime: 10,
    costPerUnit: 42,
    maxDuration: 60,
    availability: 'available',
    constraints: ['Skill verification needed', 'Safety orientation required']
  },
  {
    id: 'fo4',
    name: 'Partner Outsourcing',
    type: 'outsource',
    capacityIncrease: 40,
    leadTime: 21,
    costPerUnit: 55,
    maxDuration: 120,
    availability: 'limited',
    constraints: ['Quality verification', 'IP considerations', 'Logistics coordination']
  },
  {
    id: 'fo5',
    name: 'Equipment Rental',
    type: 'equipment_rental',
    capacityIncrease: 15,
    leadTime: 7,
    costPerUnit: 65,
    maxDuration: 30,
    availability: 'available',
    constraints: ['Operator training', 'Floor space requirements']
  },
  {
    id: 'fo6',
    name: 'Expedited Materials',
    type: 'expedite_materials',
    capacityIncrease: 10,
    leadTime: 3,
    costPerUnit: 25,
    maxDuration: 14,
    availability: 'available',
    constraints: ['Premium freight costs', 'Supplier capacity']
  }
];

const CapacityFlexibilityView: React.FC<CapacityFlexibilityViewProps> = ({ className = '' }) => {
  const [activeView, setActiveView] = useState<'overview' | 'resources' | 'forecast' | 'options'>('overview');
  const [resources, setResources] = useState<CapacityResource[]>([]);
  const [forecast, setForecast] = useState<DemandForecast[]>([]);
  const [surgeIndicators, setSurgeIndicators] = useState<SurgeIndicator[]>([]);
  const [flexibilityOptions, setFlexibilityOptions] = useState<FlexibilityOption[]>([]);
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');

  useEffect(() => {
    setResources(generateCapacityResources());
    setForecast(generateDemandForecast());
    setSurgeIndicators(generateSurgeIndicators());
    setFlexibilityOptions(generateFlexibilityOptions());
  }, []);

  const getStatusColor = (status: CapacityStatus): string => {
    switch (status) {
      case 'underutilized': return '#3b82f6';
      case 'optimal': return '#22c55e';
      case 'strained': return '#f59e0b';
      case 'overloaded': return '#dc2626';
    }
  };

  const getSurgeColor = (level: SurgeLevel): string => {
    switch (level) {
      case 'none': return '#22c55e';
      case 'moderate': return '#eab308';
      case 'high': return '#f59e0b';
      case 'critical': return '#dc2626';
    }
  };

  const getAvailabilityColor = (availability: FlexibilityOption['availability']): string => {
    switch (availability) {
      case 'available': return '#22c55e';
      case 'limited': return '#f59e0b';
      case 'unavailable': return '#dc2626';
    }
  };

  const getResourceTypeIcon = (type: ResourceType): string => {
    switch (type) {
      case 'machine': return '⚙️';
      case 'labor': return '👷';
      case 'material': return '📦';
      case 'tooling': return '🔧';
    }
  };

  const filteredResources = resources.filter(r =>
    selectedType === 'all' || r.type === selectedType
  );

  const statusCounts = {
    underutilized: resources.filter(r => r.status === 'underutilized').length,
    optimal: resources.filter(r => r.status === 'optimal').length,
    strained: resources.filter(r => r.status === 'strained').length,
    overloaded: resources.filter(r => r.status === 'overloaded').length
  };

  const avgUtilization = resources.reduce((sum, r) => sum + r.utilizationRate, 0) / resources.length;
  const avgFlexibility = resources.reduce((sum, r) => sum + r.flexibilityScore, 0) / resources.length;

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Avg Utilization</div>
          <div className="text-3xl font-bold" style={{ color: avgUtilization > 95 ? '#dc2626' : avgUtilization > 85 ? '#f59e0b' : '#22c55e' }}>
            {avgUtilization.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">Across all resources</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Flexibility Score</div>
          <div className="text-3xl font-bold text-blue-600">{avgFlexibility.toFixed(0)}</div>
          <div className="text-xs text-gray-500 mt-1">Average capacity flexibility</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Active Surge Alerts</div>
          <div className="text-3xl font-bold text-amber-600">{surgeIndicators.length}</div>
          <div className="text-xs text-gray-500 mt-1">Upcoming capacity constraints</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Resources at Risk</div>
          <div className="text-3xl font-bold text-red-600">{statusCounts.strained + statusCounts.overloaded}</div>
          <div className="text-xs text-gray-500 mt-1">Strained or overloaded</div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Capacity Status Distribution</h3>
          <div className="space-y-3">
            {(['optimal', 'strained', 'overloaded', 'underutilized'] as CapacityStatus[]).map(status => {
              const count = statusCounts[status];
              const percentage = (count / resources.length) * 100;
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor(status) }}></div>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    <span className="font-medium">{count} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${percentage}%`, backgroundColor: getStatusColor(status) }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resource Types */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Resource Types Capacity</h3>
          <div className="grid grid-cols-2 gap-3">
            {(['machine', 'labor', 'material', 'tooling'] as ResourceType[]).map(type => {
              const typeResources = resources.filter(r => r.type === type);
              const avgUtil = typeResources.length > 0
                ? typeResources.reduce((sum, r) => sum + r.utilizationRate, 0) / typeResources.length
                : 0;
              return (
                <div key={type} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{getResourceTypeIcon(type)}</span>
                    <span className="font-medium text-sm capitalize">{type}</span>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: getStatusColor(avgUtil > 100 ? 'overloaded' : avgUtil > 90 ? 'strained' : 'optimal') }}>
                    {avgUtil.toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-500">{typeResources.length} resources</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Surge Alerts */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-700">Upcoming Surge Indicators</h3>
          <span className="text-xs text-gray-500">Next 30 days</span>
        </div>
        <div className="space-y-3">
          {surgeIndicators.map(indicator => (
            <div
              key={indicator.id}
              className="p-3 rounded-lg border-l-4"
              style={{ borderLeftColor: getSurgeColor(indicator.surgeLevel), backgroundColor: `${getSurgeColor(indicator.surgeLevel)}10` }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{indicator.resourceName}</span>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: getSurgeColor(indicator.surgeLevel) }}
                    >
                      {indicator.surgeLevel.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{indicator.actionRequired}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{indicator.triggerDate.toLocaleDateString()}</div>
                  <div className="text-xs text-gray-500">+{indicator.demandIncrease}% demand for {indicator.durationDays}d</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'machine', 'labor', 'material', 'tooling'] as const).map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
              selectedType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type !== 'all' && <span>{getResourceTypeIcon(type)}</span>}
            {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredResources.map(resource => (
          <div
            key={resource.id}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{getResourceTypeIcon(resource.type)}</span>
                <div>
                  <h4 className="font-semibold text-gray-800">{resource.name}</h4>
                  <p className="text-xs text-gray-500">{resource.department}</p>
                </div>
              </div>
              <span
                className="px-2 py-1 rounded text-xs font-medium text-white"
                style={{ backgroundColor: getStatusColor(resource.status) }}
              >
                {resource.status.toUpperCase()}
              </span>
            </div>

            {/* Capacity Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Capacity Utilization</span>
                <span className="font-medium">{resource.utilizationRate}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden relative">
                {/* Base capacity marker */}
                <div
                  className="absolute h-full w-0.5 bg-gray-400 z-10"
                  style={{ left: `${(resource.baseCapacity / resource.maxCapacity) * 100}%` }}
                ></div>
                {/* Current demand */}
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min((resource.currentDemand / resource.maxCapacity) * 100, 100)}%`,
                    backgroundColor: getStatusColor(resource.status)
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>Base: {resource.baseCapacity}</span>
                <span>Max: {resource.maxCapacity}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3 text-center">
              <div className="bg-gray-50 rounded p-2">
                <div className="text-sm font-bold text-gray-800">{resource.currentDemand}</div>
                <div className="text-xs text-gray-500">Current</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-sm font-bold text-amber-600">{resource.forecastDemand}</div>
                <div className="text-xs text-gray-500">Forecast</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-sm font-bold text-green-600">+{resource.surgeAvailable}</div>
                <div className="text-xs text-gray-500">Surge Avail</div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">Flexibility Score</span>
              <span className="text-sm font-medium">{resource.flexibilityScore}/100</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${resource.flexibilityScore}%` }}
              ></div>
            </div>

            {resource.constraints.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-xs text-gray-500 mb-1">Constraints:</div>
                <div className="flex flex-wrap gap-1">
                  {resource.constraints.map((c, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded">
                      {c}
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

  const renderForecast = () => {
    const maxValue = Math.max(...forecast.map(f => Math.max(f.demand, f.surgeCapacity)));
    const chartHeight = 200;

    return (
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">30-Day Demand vs Capacity Forecast</h3>

          {/* Chart Legend */}
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span className="text-xs text-gray-600">Demand</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-xs text-gray-600">Base Capacity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-500"></div>
              <span className="text-xs text-gray-600">Surge Capacity</span>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="relative" style={{ height: chartHeight + 40 }}>
            <div className="absolute inset-0 flex items-end gap-1">
              {forecast.map((day, idx) => {
                const demandHeight = (day.demand / maxValue) * chartHeight;
                const capacityLine = (day.capacity / maxValue) * chartHeight;
                const surgeCapacityLine = (day.surgeCapacity / maxValue) * chartHeight;
                const isOverCapacity = day.demand > day.capacity;
                const isOverSurge = day.demand > day.surgeCapacity;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                      <div className="bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        <div>{day.date.toLocaleDateString()}</div>
                        <div>Demand: {day.demand.toLocaleString()}</div>
                        <div>Capacity: {day.capacity.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Bar */}
                    <div
                      className={`w-full rounded-t transition-all ${
                        isOverSurge ? 'bg-red-500' : isOverCapacity ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                      style={{ height: demandHeight }}
                    ></div>

                    {/* Day label */}
                    {idx % 5 === 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {day.date.getDate()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Capacity Lines */}
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-green-500"
              style={{ bottom: (4500 / maxValue) * chartHeight + 40 }}
            >
              <span className="absolute right-0 -top-4 text-xs text-green-600 bg-white px-1">Capacity</span>
            </div>
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-amber-500"
              style={{ bottom: (5500 / maxValue) * chartHeight + 40 }}
            >
              <span className="absolute right-0 -top-4 text-xs text-amber-600 bg-white px-1">Surge</span>
            </div>
          </div>
        </div>

        {/* Forecast Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Days Over Capacity</div>
            <div className="text-3xl font-bold text-amber-600">
              {forecast.filter(f => f.demand > f.capacity).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Requiring surge capacity</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Days Over Surge</div>
            <div className="text-3xl font-bold text-red-600">
              {forecast.filter(f => f.demand > f.surgeCapacity).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Capacity exceeded</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Peak Demand</div>
            <div className="text-3xl font-bold text-blue-600">
              {Math.max(...forecast.map(f => f.demand)).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">Maximum forecasted</div>
          </div>
        </div>
      </div>
    );
  };

  const renderOptions = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Available flexibility options to address capacity constraints</p>

      <div className="grid grid-cols-2 gap-4">
        {flexibilityOptions.map(option => (
          <div
            key={option.id}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-800">{option.name}</h4>
                <span className="text-xs text-gray-500 capitalize">{option.type.replace('_', ' ')}</span>
              </div>
              <span
                className="px-2 py-1 rounded text-xs font-medium text-white"
                style={{ backgroundColor: getAvailabilityColor(option.availability) }}
              >
                {option.availability.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-green-50 rounded p-2 text-center">
                <div className="text-xl font-bold text-green-600">+{option.capacityIncrease}%</div>
                <div className="text-xs text-green-700">Capacity Increase</div>
              </div>
              <div className="bg-blue-50 rounded p-2 text-center">
                <div className="text-xl font-bold text-blue-600">{option.leadTime}d</div>
                <div className="text-xs text-blue-700">Lead Time</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-gray-50 rounded p-2 text-center">
                <div className="text-lg font-bold text-gray-800">${option.costPerUnit}</div>
                <div className="text-xs text-gray-500">Cost/Unit</div>
              </div>
              <div className="bg-gray-50 rounded p-2 text-center">
                <div className="text-lg font-bold text-gray-800">{option.maxDuration}d</div>
                <div className="text-xs text-gray-500">Max Duration</div>
              </div>
            </div>

            {option.constraints.length > 0 && (
              <div className="pt-3 border-t">
                <div className="text-xs text-gray-500 mb-1">Constraints:</div>
                <div className="flex flex-wrap gap-1">
                  {option.constraints.map((c, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              disabled={option.availability === 'unavailable'}
              className={`w-full mt-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                option.availability === 'unavailable'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {option.availability === 'unavailable' ? 'Unavailable' : 'Activate Option'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Capacity Flexibility View</h2>
          <p className="text-sm text-gray-600">Monitor available capacity vs demand with surge indicators</p>
        </div>
        <div className="flex gap-2">
          {(['overview', 'resources', 'forecast', 'options'] as const).map(view => (
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

      {activeView === 'overview' && renderOverview()}
      {activeView === 'resources' && renderResources()}
      {activeView === 'forecast' && renderForecast()}
      {activeView === 'options' && renderOptions()}
    </div>
  );
};

export default CapacityFlexibilityView;
