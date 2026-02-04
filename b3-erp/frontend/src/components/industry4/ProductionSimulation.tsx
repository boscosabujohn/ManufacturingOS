'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Sliders,
  TrendingUp,
  TrendingDown,
  Clock,
  Package,
  Users,
  Zap,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Settings,
  Save,
  Download,
  ArrowRight,
  Cpu,
  Calendar,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  parameters: SimulationParameters;
  results?: SimulationResults;
}

export interface SimulationParameters {
  productionRate: number; // units per hour
  workforce: number;
  shiftHours: number;
  machineEfficiency: number; // percentage
  defectRate: number; // percentage
  materialCost: number; // per unit
  laborCost: number; // per hour
  overheadRate: number; // percentage
  demandForecast: number; // units
  leadTime: number; // days
}

export interface SimulationResults {
  totalOutput: number;
  totalCost: number;
  unitCost: number;
  profit: number;
  efficiency: number;
  utilizationRate: number;
  bottlenecks: string[];
  recommendations: string[];
  timeline: TimelinePoint[];
}

export interface TimelinePoint {
  day: number;
  production: number;
  inventory: number;
  cost: number;
  demand: number;
}

export interface ProductionSimulationProps {
  onScenarioSave?: (scenario: SimulationScenario) => void;
  onExport?: (results: SimulationResults) => void;
}

// ============================================================================
// Parameter Slider Component
// ============================================================================

function ParameterSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  icon: Icon,
  onChange,
  highlight,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  icon: React.ElementType;
  onChange: (value: number) => void;
  highlight?: 'increase' | 'decrease';
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Icon className="w-4 h-4 text-gray-400" />
          {label}
        </label>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${
            highlight === 'increase' ? 'text-green-600' :
            highlight === 'decrease' ? 'text-red-600' : 'text-gray-900 dark:text-white'
          }`}>
            {value.toLocaleString()}{unit}
          </span>
          {highlight && (
            highlight === 'increase' ?
              <TrendingUp className="w-4 h-4 text-green-500" /> :
              <TrendingDown className="w-4 h-4 text-red-500" />
          )}
        </div>
      </div>
      <div className="relative">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              highlight === 'increase' ? 'bg-green-500' :
              highlight === 'decrease' ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{min.toLocaleString()}{unit}</span>
        <span>{max.toLocaleString()}{unit}</span>
      </div>
    </div>
  );
}

// ============================================================================
// Results Card Component
// ============================================================================

function ResultCard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  color: string;
}) {
  return (
    <div className={`p-4 rounded-xl border-2 ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5 text-gray-500" />
        {trend && (
          trend === 'up' ?
            <TrendingUp className="w-4 h-4 text-green-500" /> :
            <TrendingDown className="w-4 h-4 text-red-500" />
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {typeof value === 'number' ? value.toLocaleString() : value}{unit}
      </p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

// ============================================================================
// Timeline Chart Component
// ============================================================================

function TimelineChart({ data }: { data: TimelinePoint[] }) {
  if (data.length === 0) return null;

  const maxProduction = Math.max(...data.map(d => d.production));
  const maxDemand = Math.max(...data.map(d => d.demand));
  const maxValue = Math.max(maxProduction, maxDemand);

  return (
    <div className="h-48 flex items-end gap-1">
      {data.map((point, index) => {
        const prodHeight = (point.production / maxValue) * 100;
        const demandHeight = (point.demand / maxValue) * 100;

        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end gap-0.5 h-40">
              <div
                className="flex-1 bg-blue-500 rounded-t transition-all duration-300"
                style={{ height: `${prodHeight}%` }}
                title={`Production: ${point.production}`}
              />
              <div
                className="flex-1 bg-purple-500 rounded-t transition-all duration-300"
                style={{ height: `${demandHeight}%` }}
                title={`Demand: ${point.demand}`}
              />
            </div>
            <span className="text-[10px] text-gray-400">D{point.day}</span>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Production Simulation Component
// ============================================================================

export function ProductionSimulation({
  onScenarioSave,
  onExport,
}: ProductionSimulationProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentDay, setCurrentDay] = useState(0);
  const [scenarioName, setScenarioName] = useState('New Scenario');

  const [baseParams] = useState<SimulationParameters>({
    productionRate: 100,
    workforce: 50,
    shiftHours: 8,
    machineEfficiency: 85,
    defectRate: 2,
    materialCost: 25,
    laborCost: 35,
    overheadRate: 20,
    demandForecast: 25000,
    leadTime: 14,
  });

  const [params, setParams] = useState<SimulationParameters>({ ...baseParams });
  const [results, setResults] = useState<SimulationResults | null>(null);

  // Calculate simulation results
  const calculateResults = useCallback((p: SimulationParameters): SimulationResults => {
    const daysInPeriod = 30;
    const dailyOutput = p.productionRate * p.shiftHours * (p.machineEfficiency / 100) * (1 - p.defectRate / 100);
    const totalOutput = Math.floor(dailyOutput * daysInPeriod);

    const dailyLaborCost = p.workforce * p.laborCost * p.shiftHours;
    const dailyMaterialCost = dailyOutput * p.materialCost;
    const dailyOverhead = (dailyLaborCost + dailyMaterialCost) * (p.overheadRate / 100);
    const totalCost = (dailyLaborCost + dailyMaterialCost + dailyOverhead) * daysInPeriod;

    const unitCost = totalCost / totalOutput;
    const sellingPrice = unitCost * 1.3; // 30% margin
    const profit = (sellingPrice - unitCost) * Math.min(totalOutput, p.demandForecast);

    const utilizationRate = Math.min(100, (totalOutput / p.demandForecast) * 100);

    const bottlenecks: string[] = [];
    if (p.machineEfficiency < 80) bottlenecks.push('Low machine efficiency');
    if (p.defectRate > 3) bottlenecks.push('High defect rate');
    if (totalOutput < p.demandForecast) bottlenecks.push('Production below demand');
    if (p.workforce < p.productionRate / 3) bottlenecks.push('Understaffed workforce');

    const recommendations: string[] = [];
    if (p.machineEfficiency < 85) recommendations.push('Schedule preventive maintenance to improve efficiency');
    if (p.defectRate > 2) recommendations.push('Implement quality control checkpoints');
    if (totalOutput < p.demandForecast) recommendations.push('Consider adding a second shift');
    if (profit < totalCost * 0.1) recommendations.push('Review material sourcing for cost reduction');

    // Generate timeline data
    const timeline: TimelinePoint[] = [];
    let cumulativeProduction = 0;
    let inventory = 0;
    for (let day = 1; day <= daysInPeriod; day++) {
      const dayProduction = dailyOutput * (0.9 + Math.random() * 0.2);
      cumulativeProduction += dayProduction;
      const dayDemand = p.demandForecast / daysInPeriod * (0.8 + Math.random() * 0.4);
      inventory = Math.max(0, inventory + dayProduction - dayDemand);

      timeline.push({
        day,
        production: Math.floor(dayProduction),
        inventory: Math.floor(inventory),
        cost: Math.floor((dailyLaborCost + dailyMaterialCost + dailyOverhead) * day),
        demand: Math.floor(dayDemand),
      });
    }

    return {
      totalOutput,
      totalCost: Math.floor(totalCost),
      unitCost: Math.round(unitCost * 100) / 100,
      profit: Math.floor(profit),
      efficiency: Math.round(p.machineEfficiency * (1 - p.defectRate / 100)),
      utilizationRate: Math.round(utilizationRate),
      bottlenecks,
      recommendations,
      timeline,
    };
  }, []);

  // Run simulation
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentDay(prev => {
        if (prev >= 30) {
          setIsRunning(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [isRunning, speed]);

  // Calculate results when params change
  useEffect(() => {
    setResults(calculateResults(params));
  }, [params, calculateResults]);

  const updateParam = (key: keyof SimulationParameters, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const resetSimulation = () => {
    setParams({ ...baseParams });
    setCurrentDay(0);
    setIsRunning(false);
  };

  const getParamHighlight = (key: keyof SimulationParameters) => {
    const diff = params[key] - baseParams[key];
    if (diff > 0) return 'increase';
    if (diff < 0) return 'decrease';
    return undefined;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Virtual Production Simulation</h2>
              <p className="text-sm text-violet-100">What-if scenario analysis</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Simulation Controls */}
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="p-1.5 hover:bg-white/20 rounded transition-colors"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={resetSimulation}
                className="p-1.5 hover:bg-white/20 rounded transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSpeed(speed === 1 ? 2 : speed === 2 ? 4 : 1)}
                className="p-1.5 hover:bg-white/20 rounded transition-colors"
              >
                <FastForward className="w-4 h-4" />
                <span className="text-xs ml-1">{speed}x</span>
              </button>
            </div>

            <span className="text-sm">Day {currentDay}/30</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-3">
        {/* Parameters Panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-400" />
              Simulation Parameters
            </h3>
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              className="text-sm px-2 py-1 border border-gray-300 rounded"
              placeholder="Scenario name"
            />
          </div>

          <div className="space-y-5">
            <ParameterSlider
              label="Production Rate"
              value={params.productionRate}
              min={50}
              max={200}
              step={5}
              unit=" u/hr"
              icon={Cpu}
              onChange={(v) => updateParam('productionRate', v)}
              highlight={getParamHighlight('productionRate')}
            />

            <ParameterSlider
              label="Workforce Size"
              value={params.workforce}
              min={20}
              max={100}
              step={1}
              unit=" workers"
              icon={Users}
              onChange={(v) => updateParam('workforce', v)}
              highlight={getParamHighlight('workforce')}
            />

            <ParameterSlider
              label="Shift Hours"
              value={params.shiftHours}
              min={4}
              max={12}
              step={1}
              unit="h"
              icon={Clock}
              onChange={(v) => updateParam('shiftHours', v)}
              highlight={getParamHighlight('shiftHours')}
            />

            <ParameterSlider
              label="Machine Efficiency"
              value={params.machineEfficiency}
              min={50}
              max={100}
              step={1}
              unit="%"
              icon={Zap}
              onChange={(v) => updateParam('machineEfficiency', v)}
              highlight={getParamHighlight('machineEfficiency')}
            />

            <ParameterSlider
              label="Defect Rate"
              value={params.defectRate}
              min={0}
              max={10}
              step={0.5}
              unit="%"
              icon={AlertTriangle}
              onChange={(v) => updateParam('defectRate', v)}
              highlight={getParamHighlight('defectRate')}
            />

            <ParameterSlider
              label="Material Cost"
              value={params.materialCost}
              min={10}
              max={50}
              step={1}
              unit="$/unit"
              icon={Package}
              onChange={(v) => updateParam('materialCost', v)}
              highlight={getParamHighlight('materialCost')}
            />

            <ParameterSlider
              label="Demand Forecast"
              value={params.demandForecast}
              min={10000}
              max={50000}
              step={1000}
              unit=" units"
              icon={BarChart3}
              onChange={(v) => updateParam('demandForecast', v)}
              highlight={getParamHighlight('demandForecast')}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onScenarioSave?.({ id: Date.now().toString(), name: scenarioName, description: '', parameters: params, results: results || undefined })}
              className="flex-1 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Scenario
            </button>
            <button
              onClick={() => results && onExport?.(results)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-3">
          {results && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <ResultCard
                  label="Total Output"
                  value={results.totalOutput}
                  unit=" units"
                  icon={Package}
                  color="border-blue-200 bg-blue-50"
                />
                <ResultCard
                  label="Total Cost"
                  value={results.totalCost}
                  unit="$"
                  icon={DollarSign}
                  color="border-orange-200 bg-orange-50"
                />
                <ResultCard
                  label="Profit"
                  value={results.profit}
                  unit="$"
                  icon={TrendingUp}
                  trend={results.profit > 0 ? 'up' : 'down'}
                  color="border-green-200 bg-green-50"
                />
                <ResultCard
                  label="Utilization"
                  value={results.utilizationRate}
                  unit="%"
                  icon={BarChart3}
                  color="border-purple-200 bg-purple-50"
                />
              </div>

              {/* Timeline Chart */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    30-Day Production vs Demand
                  </h4>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 bg-blue-500 rounded" />
                      <span className="text-gray-500">Production</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 bg-purple-500 rounded" />
                      <span className="text-gray-500">Demand</span>
                    </div>
                  </div>
                </div>
                <TimelineChart data={results.timeline.slice(0, currentDay || 30)} />
              </div>

              {/* Bottlenecks & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Bottlenecks */}
                <div className="p-4 border border-red-200 bg-red-50 rounded-xl">
                  <h4 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Identified Bottlenecks
                  </h4>
                  {results.bottlenecks.length > 0 ? (
                    <ul className="space-y-2">
                      {results.bottlenecks.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                          <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-red-600">No bottlenecks identified</p>
                  )}
                </div>

                {/* Recommendations */}
                <div className="p-4 border border-green-200 bg-green-50 rounded-xl">
                  <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Recommendations
                  </h4>
                  {results.recommendations.length > 0 ? (
                    <ul className="space-y-2">
                      {results.recommendations.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                          <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-green-600">Production is optimized!</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductionSimulation;
