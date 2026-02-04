'use client';

import React, { useState, useEffect } from 'react';

// Types
export type DisruptionType = 'supplier_failure' | 'demand_surge' | 'logistics_delay' | 'natural_disaster' | 'equipment_breakdown' | 'labor_shortage' | 'raw_material_shortage' | 'cyber_attack';
export type ImpactSeverity = 'catastrophic' | 'major' | 'moderate' | 'minor';
export type ScenarioStatus = 'draft' | 'analyzing' | 'completed' | 'archived';

export interface ScenarioParameter {
  id: string;
  name: string;
  type: 'percentage' | 'days' | 'count' | 'currency';
  value: number;
  min: number;
  max: number;
  unit: string;
}

export interface ImpactResult {
  category: string;
  metric: string;
  baselineValue: number;
  impactedValue: number;
  change: number;
  changePercent: number;
  severity: ImpactSeverity;
}

export interface MitigationAction {
  id: string;
  action: string;
  effectiveness: number; // percentage
  cost: number;
  timeToImplement: number; // days
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  disruptionType: DisruptionType;
  status: ScenarioStatus;
  probability: number; // percentage
  parameters: ScenarioParameter[];
  impacts: ImpactResult[];
  mitigations: MitigationAction[];
  createdAt: Date;
  lastAnalyzed: Date | null;
  overallImpact: ImpactSeverity;
  estimatedLoss: number;
  recoveryTime: number; // days
}

interface ScenarioPlanningToolProps {
  className?: string;
}

// Disruption templates
const disruptionTemplates: Record<DisruptionType, { name: string; description: string; icon: string; defaultParameters: Omit<ScenarioParameter, 'id'>[] }> = {
  supplier_failure: {
    name: 'Supplier Failure',
    description: 'Complete or partial failure of a key supplier',
    icon: '🏭',
    defaultParameters: [
      { name: 'Affected Suppliers', type: 'count', value: 1, min: 1, max: 10, unit: 'suppliers' },
      { name: 'Supply Reduction', type: 'percentage', value: 100, min: 10, max: 100, unit: '%' },
      { name: 'Duration', type: 'days', value: 30, min: 7, max: 180, unit: 'days' }
    ]
  },
  demand_surge: {
    name: 'Demand Surge',
    description: 'Unexpected increase in customer demand',
    icon: '📈',
    defaultParameters: [
      { name: 'Demand Increase', type: 'percentage', value: 50, min: 10, max: 200, unit: '%' },
      { name: 'Affected Products', type: 'count', value: 5, min: 1, max: 20, unit: 'products' },
      { name: 'Duration', type: 'days', value: 60, min: 14, max: 365, unit: 'days' }
    ]
  },
  logistics_delay: {
    name: 'Logistics Delay',
    description: 'Transportation and shipping disruptions',
    icon: '🚚',
    defaultParameters: [
      { name: 'Delay Duration', type: 'days', value: 14, min: 1, max: 90, unit: 'days' },
      { name: 'Affected Routes', type: 'percentage', value: 30, min: 10, max: 100, unit: '%' },
      { name: 'Cost Increase', type: 'percentage', value: 25, min: 5, max: 100, unit: '%' }
    ]
  },
  natural_disaster: {
    name: 'Natural Disaster',
    description: 'Earthquake, flood, hurricane affecting operations',
    icon: '🌪️',
    defaultParameters: [
      { name: 'Facility Damage', type: 'percentage', value: 40, min: 10, max: 100, unit: '%' },
      { name: 'Recovery Time', type: 'days', value: 45, min: 14, max: 365, unit: 'days' },
      { name: 'Insurance Coverage', type: 'percentage', value: 70, min: 0, max: 100, unit: '%' }
    ]
  },
  equipment_breakdown: {
    name: 'Equipment Breakdown',
    description: 'Critical machinery failure or malfunction',
    icon: '⚙️',
    defaultParameters: [
      { name: 'Affected Machines', type: 'count', value: 2, min: 1, max: 10, unit: 'machines' },
      { name: 'Capacity Loss', type: 'percentage', value: 35, min: 10, max: 100, unit: '%' },
      { name: 'Repair Time', type: 'days', value: 7, min: 1, max: 60, unit: 'days' }
    ]
  },
  labor_shortage: {
    name: 'Labor Shortage',
    description: 'Workforce unavailability or skill gaps',
    icon: '👷',
    defaultParameters: [
      { name: 'Staff Reduction', type: 'percentage', value: 25, min: 5, max: 80, unit: '%' },
      { name: 'Affected Areas', type: 'count', value: 3, min: 1, max: 10, unit: 'departments' },
      { name: 'Duration', type: 'days', value: 30, min: 7, max: 180, unit: 'days' }
    ]
  },
  raw_material_shortage: {
    name: 'Raw Material Shortage',
    description: 'Scarcity of critical raw materials',
    icon: '📦',
    defaultParameters: [
      { name: 'Material Availability', type: 'percentage', value: 40, min: 0, max: 100, unit: '%' },
      { name: 'Price Increase', type: 'percentage', value: 50, min: 10, max: 300, unit: '%' },
      { name: 'Duration', type: 'days', value: 90, min: 30, max: 365, unit: 'days' }
    ]
  },
  cyber_attack: {
    name: 'Cyber Attack',
    description: 'Ransomware or system breach affecting operations',
    icon: '🔒',
    defaultParameters: [
      { name: 'Systems Affected', type: 'percentage', value: 60, min: 10, max: 100, unit: '%' },
      { name: 'Downtime', type: 'days', value: 5, min: 1, max: 30, unit: 'days' },
      { name: 'Data Recovery', type: 'percentage', value: 85, min: 0, max: 100, unit: '%' }
    ]
  }
};

// Mock scenarios
const generateScenarios = (): Scenario[] => [
  {
    id: 'sc1',
    name: 'Critical Semiconductor Supplier Failure',
    description: 'What-if scenario for ChipMaster Semiconductors going offline',
    disruptionType: 'supplier_failure',
    status: 'completed',
    probability: 15,
    parameters: [
      { id: 'p1', name: 'Affected Suppliers', type: 'count', value: 1, min: 1, max: 10, unit: 'suppliers' },
      { id: 'p2', name: 'Supply Reduction', type: 'percentage', value: 100, min: 10, max: 100, unit: '%' },
      { id: 'p3', name: 'Duration', type: 'days', value: 60, min: 7, max: 180, unit: 'days' }
    ],
    impacts: [
      { category: 'Production', metric: 'Output Volume', baselineValue: 10000, impactedValue: 6500, change: -3500, changePercent: -35, severity: 'major' },
      { category: 'Revenue', metric: 'Monthly Revenue', baselineValue: 2500000, impactedValue: 1625000, change: -875000, changePercent: -35, severity: 'major' },
      { category: 'Customer', metric: 'On-Time Delivery', baselineValue: 95, impactedValue: 72, change: -23, changePercent: -24, severity: 'major' },
      { category: 'Inventory', metric: 'Stock Availability', baselineValue: 90, impactedValue: 45, change: -45, changePercent: -50, severity: 'catastrophic' }
    ],
    mitigations: [
      { id: 'm1', action: 'Qualify secondary supplier immediately', effectiveness: 70, cost: 50000, timeToImplement: 90, priority: 'critical' },
      { id: 'm2', action: 'Increase buffer stock levels', effectiveness: 40, cost: 200000, timeToImplement: 30, priority: 'high' },
      { id: 'm3', action: 'Redesign products for alternative components', effectiveness: 80, cost: 150000, timeToImplement: 180, priority: 'high' }
    ],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    lastAnalyzed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    overallImpact: 'major',
    estimatedLoss: 2625000,
    recoveryTime: 90
  },
  {
    id: 'sc2',
    name: 'Q4 Holiday Demand Surge',
    description: 'Modeling 80% demand increase during peak season',
    disruptionType: 'demand_surge',
    status: 'completed',
    probability: 75,
    parameters: [
      { id: 'p1', name: 'Demand Increase', type: 'percentage', value: 80, min: 10, max: 200, unit: '%' },
      { id: 'p2', name: 'Affected Products', type: 'count', value: 12, min: 1, max: 20, unit: 'products' },
      { id: 'p3', name: 'Duration', type: 'days', value: 45, min: 14, max: 365, unit: 'days' }
    ],
    impacts: [
      { category: 'Production', metric: 'Capacity Utilization', baselineValue: 75, impactedValue: 135, change: 60, changePercent: 80, severity: 'major' },
      { category: 'Customer', metric: 'Backorder Rate', baselineValue: 5, impactedValue: 28, change: 23, changePercent: 460, severity: 'major' },
      { category: 'Labor', metric: 'Overtime Hours', baselineValue: 200, impactedValue: 850, change: 650, changePercent: 325, severity: 'moderate' },
      { category: 'Quality', metric: 'Defect Rate', baselineValue: 1.2, impactedValue: 2.1, change: 0.9, changePercent: 75, severity: 'moderate' }
    ],
    mitigations: [
      { id: 'm1', action: 'Pre-build inventory starting October', effectiveness: 60, cost: 300000, timeToImplement: 60, priority: 'high' },
      { id: 'm2', action: 'Arrange temporary workforce', effectiveness: 50, cost: 120000, timeToImplement: 14, priority: 'high' },
      { id: 'm3', action: 'Negotiate expedited shipping with carriers', effectiveness: 35, cost: 80000, timeToImplement: 7, priority: 'medium' }
    ],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    lastAnalyzed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    overallImpact: 'major',
    estimatedLoss: 450000,
    recoveryTime: 60
  },
  {
    id: 'sc3',
    name: 'Facility Flood Event',
    description: 'Impact assessment for warehouse flooding scenario',
    disruptionType: 'natural_disaster',
    status: 'analyzing',
    probability: 8,
    parameters: [
      { id: 'p1', name: 'Facility Damage', type: 'percentage', value: 25, min: 10, max: 100, unit: '%' },
      { id: 'p2', name: 'Recovery Time', type: 'days', value: 21, min: 14, max: 365, unit: 'days' },
      { id: 'p3', name: 'Insurance Coverage', type: 'percentage', value: 80, min: 0, max: 100, unit: '%' }
    ],
    impacts: [],
    mitigations: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    lastAnalyzed: null,
    overallImpact: 'moderate',
    estimatedLoss: 0,
    recoveryTime: 21
  }
];

const ScenarioPlanningTool: React.FC<ScenarioPlanningToolProps> = ({ className = '' }) => {
  const [activeView, setActiveView] = useState<'scenarios' | 'create' | 'analyze'>('scenarios');
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [newScenario, setNewScenario] = useState<Partial<Scenario> | null>(null);

  useEffect(() => {
    setScenarios(generateScenarios());
  }, []);

  const getSeverityColor = (severity: ImpactSeverity): string => {
    switch (severity) {
      case 'catastrophic': return '#7f1d1d';
      case 'major': return '#dc2626';
      case 'moderate': return '#f59e0b';
      case 'minor': return '#22c55e';
    }
  };

  const getStatusColor = (status: ScenarioStatus): string => {
    switch (status) {
      case 'draft': return '#6b7280';
      case 'analyzing': return '#3b82f6';
      case 'completed': return '#22c55e';
      case 'archived': return '#9ca3af';
    }
  };

  const getPriorityColor = (priority: MitigationAction['priority']): string => {
    switch (priority) {
      case 'critical': return '#dc2626';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#22c55e';
    }
  };

  const handleCreateScenario = (type: DisruptionType) => {
    const template = disruptionTemplates[type];
    setNewScenario({
      id: `sc${Date.now()}`,
      name: '',
      description: '',
      disruptionType: type,
      status: 'draft',
      probability: 50,
      parameters: template.defaultParameters.map((p, idx) => ({ ...p, id: `p${idx}` })),
      impacts: [],
      mitigations: [],
      createdAt: new Date(),
      lastAnalyzed: null,
      overallImpact: 'moderate',
      estimatedLoss: 0,
      recoveryTime: 30
    });
    setActiveView('create');
  };

  const renderScenariosList = () => (
    <div className="space-y-3">
      {/* Disruption Type Cards */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Create New Scenario</h3>
        <div className="grid grid-cols-4 gap-3">
          {(Object.entries(disruptionTemplates) as [DisruptionType, typeof disruptionTemplates[DisruptionType]][]).map(([type, template]) => (
            <button
              key={type}
              onClick={() => handleCreateScenario(type)}
              className="bg-white border border-gray-200 rounded-lg p-3 text-left hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="text-2xl mb-2">{template.icon}</div>
              <div className="font-medium text-sm text-gray-800">{template.name}</div>
              <div className="text-xs text-gray-500 mt-1">{template.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Existing Scenarios */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Saved Scenarios</h3>
        <div className="space-y-3">
          {scenarios.map(scenario => (
            <div
              key={scenario.id}
              className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedScenario(scenario);
                setActiveView('analyze');
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{disruptionTemplates[scenario.disruptionType].icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{scenario.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        {disruptionTemplates[scenario.disruptionType].name}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                        {scenario.probability}% probability
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className="px-2 py-1 rounded text-xs font-medium text-white"
                    style={{ backgroundColor: getStatusColor(scenario.status) }}
                  >
                    {scenario.status.charAt(0).toUpperCase() + scenario.status.slice(1)}
                  </span>
                  {scenario.status === 'completed' && (
                    <span
                      className="px-2 py-1 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: getSeverityColor(scenario.overallImpact) }}
                    >
                      {scenario.overallImpact.toUpperCase()} Impact
                    </span>
                  )}
                </div>
              </div>

              {scenario.status === 'completed' && (
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">
                      ${(scenario.estimatedLoss / 1000000).toFixed(2)}M
                    </div>
                    <div className="text-xs text-gray-500">Estimated Loss</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-amber-600">
                      {scenario.recoveryTime} days
                    </div>
                    <div className="text-xs text-gray-500">Recovery Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {scenario.mitigations.length}
                    </div>
                    <div className="text-xs text-gray-500">Mitigations</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCreateScenario = () => {
    if (!newScenario) return null;
    const template = disruptionTemplates[newScenario.disruptionType!];

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => {
              setNewScenario(null);
              setActiveView('scenarios');
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
          <div className="text-2xl">{template.icon}</div>
          <div>
            <h3 className="font-semibold text-gray-800">{template.name} Scenario</h3>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scenario Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter scenario name..."
              value={newScenario.name || ''}
              onChange={(e) => setNewScenario({ ...newScenario, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              placeholder="Describe the scenario..."
              value={newScenario.description || ''}
              onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Probability of Occurrence: {newScenario.probability}%
            </label>
            <input
              type="range"
              className="w-full"
              min={1}
              max={100}
              value={newScenario.probability || 50}
              onChange={(e) => setNewScenario({ ...newScenario, probability: parseInt(e.target.value) })}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Unlikely (1%)</span>
              <span>Very Likely (100%)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Scenario Parameters</label>
            <div className="space-y-2">
              {newScenario.parameters?.map((param, idx) => (
                <div key={param.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm text-gray-700">{param.name}</span>
                    <span className="text-sm font-bold text-blue-600">
                      {param.value} {param.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="w-full"
                    min={param.min}
                    max={param.max}
                    value={param.value}
                    onChange={(e) => {
                      const newParams = [...(newScenario.parameters || [])];
                      newParams[idx] = { ...param, value: parseInt(e.target.value) };
                      setNewScenario({ ...newScenario, parameters: newParams });
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{param.min} {param.unit}</span>
                    <span>{param.max} {param.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => {
                setNewScenario(null);
                setActiveView('scenarios');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Save as Draft
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Run Analysis
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalyzeScenario = () => {
    if (!selectedScenario) return null;
    const template = disruptionTemplates[selectedScenario.disruptionType];

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedScenario(null);
                setActiveView('scenarios');
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>
            <div className="text-2xl">{template.icon}</div>
            <div>
              <h3 className="font-semibold text-gray-800">{selectedScenario.name}</h3>
              <p className="text-sm text-gray-600">{selectedScenario.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span
              className="px-3 py-1 rounded text-sm font-medium text-white"
              style={{ backgroundColor: getStatusColor(selectedScenario.status) }}
            >
              {selectedScenario.status.charAt(0).toUpperCase() + selectedScenario.status.slice(1)}
            </span>
            <span
              className="px-3 py-1 rounded text-sm font-medium text-white"
              style={{ backgroundColor: getSeverityColor(selectedScenario.overallImpact) }}
            >
              {selectedScenario.overallImpact.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Parameters Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Scenario Parameters</h4>
          <div className="grid grid-cols-3 gap-2">
            {selectedScenario.parameters.map(param => (
              <div key={param.id} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-800">{param.value}</div>
                <div className="text-xs text-gray-500">{param.name}</div>
                <div className="text-xs text-gray-400">{param.unit}</div>
              </div>
            ))}
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{selectedScenario.probability}%</div>
              <div className="text-xs text-blue-700">Probability</div>
            </div>
          </div>
        </div>

        {/* Impact Analysis */}
        {selectedScenario.impacts.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Impact Analysis</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2 text-xs font-semibold text-gray-600">Category</th>
                    <th className="text-left p-2 text-xs font-semibold text-gray-600">Metric</th>
                    <th className="text-right p-2 text-xs font-semibold text-gray-600">Baseline</th>
                    <th className="text-right p-2 text-xs font-semibold text-gray-600">Impacted</th>
                    <th className="text-right p-2 text-xs font-semibold text-gray-600">Change</th>
                    <th className="text-center p-2 text-xs font-semibold text-gray-600">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedScenario.impacts.map((impact, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2 text-sm font-medium">{impact.category}</td>
                      <td className="p-2 text-sm">{impact.metric}</td>
                      <td className="p-2 text-sm text-right">{impact.baselineValue.toLocaleString()}</td>
                      <td className="p-2 text-sm text-right font-medium">{impact.impactedValue.toLocaleString()}</td>
                      <td className="p-2 text-right">
                        <span className={impact.change > 0 ? 'text-red-600' : 'text-red-600'}>
                          {impact.change > 0 ? '+' : ''}{impact.changePercent.toFixed(0)}%
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: getSeverityColor(impact.severity) }}
                        >
                          {impact.severity.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t">
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <div className="text-3xl font-bold text-red-600">
                  ${(selectedScenario.estimatedLoss / 1000000).toFixed(2)}M
                </div>
                <div className="text-sm text-red-700">Estimated Financial Impact</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <div className="text-3xl font-bold text-amber-600">
                  {selectedScenario.recoveryTime} days
                </div>
                <div className="text-sm text-amber-700">Estimated Recovery Time</div>
              </div>
            </div>
          </div>
        )}

        {/* Mitigation Actions */}
        {selectedScenario.mitigations.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Recommended Mitigation Actions</h4>
            <div className="space-y-3">
              {selectedScenario.mitigations.map(mitigation => (
                <div
                  key={mitigation.id}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: getPriorityColor(mitigation.priority) }}
                      >
                        {mitigation.priority.toUpperCase()}
                      </span>
                      <span className="font-medium text-gray-800">{mitigation.action}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="text-center bg-green-50 rounded p-2">
                      <div className="text-lg font-bold text-green-600">{mitigation.effectiveness}%</div>
                      <div className="text-xs text-green-700">Effectiveness</div>
                    </div>
                    <div className="text-center bg-blue-50 rounded p-2">
                      <div className="text-lg font-bold text-blue-600">${(mitigation.cost / 1000).toFixed(0)}K</div>
                      <div className="text-xs text-blue-700">Est. Cost</div>
                    </div>
                    <div className="text-center bg-amber-50 rounded p-2">
                      <div className="text-lg font-bold text-amber-600">{mitigation.timeToImplement}d</div>
                      <div className="text-xs text-amber-700">Implementation</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-gray-50 rounded-lg p-3 ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Scenario Planning Tool</h2>
          <p className="text-sm text-gray-600">Interactive what-if analysis for disruption scenarios</p>
        </div>
        {activeView === 'scenarios' && (
          <div className="text-sm text-gray-500">
            {scenarios.length} scenarios • {scenarios.filter(s => s.status === 'completed').length} analyzed
          </div>
        )}
      </div>

      {activeView === 'scenarios' && renderScenariosList()}
      {activeView === 'create' && renderCreateScenario()}
      {activeView === 'analyze' && renderAnalyzeScenario()}
    </div>
  );
};

export default ScenarioPlanningTool;
