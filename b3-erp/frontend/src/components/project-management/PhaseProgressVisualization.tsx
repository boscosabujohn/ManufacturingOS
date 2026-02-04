'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
  Ruler,
  Cog,
  ShoppingCart,
  Factory,
  PackageCheck,
  Truck,
  Home,
  Users,
  Calendar,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

// Types
interface PhaseTask {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending' | 'blocked';
  progress: number;
  assignee?: string;
  dueDate?: Date;
}

interface Phase {
  id: string;
  number: number;
  name: string;
  shortName: string;
  description: string;
  icon: React.ElementType;
  status: 'completed' | 'in-progress' | 'pending' | 'blocked';
  progress: number;
  startDate?: Date;
  endDate?: Date;
  tasks: PhaseTask[];
  color: string;
}

interface PhaseProgressVisualizationProps {
  projectId?: string;
  projectName?: string;
  phases?: Phase[];
  currentPhase?: number;
  onPhaseClick?: (phaseId: string) => void;
  onTaskClick?: (phaseId: string, taskId: string) => void;
  variant?: 'horizontal' | 'vertical' | 'compact';
  showDetails?: boolean;
}

// Default 8-phase manufacturing workflow
const defaultPhases: Phase[] = [
  {
    id: 'phase-1',
    number: 1,
    name: 'Project Initiation',
    shortName: 'Initiation',
    description: 'Project setup, document upload, and sales handover',
    icon: FileText,
    status: 'completed',
    progress: 100,
    startDate: new Date('2025-01-02'),
    endDate: new Date('2025-01-05'),
    color: 'blue',
    tasks: [
      { id: 't1-1', name: 'Project Setup', status: 'completed', progress: 100 },
      { id: 't1-2', name: 'Upload BOQ', status: 'completed', progress: 100 },
      { id: 't1-3', name: 'Upload Drawings', status: 'completed', progress: 100 },
      { id: 't1-4', name: 'Sales Handover', status: 'completed', progress: 100 },
    ],
  },
  {
    id: 'phase-2',
    number: 2,
    name: 'Design & Site Assessment',
    shortName: 'Site Assessment',
    description: 'Site verification, measurements, and design validation',
    icon: Ruler,
    status: 'completed',
    progress: 100,
    startDate: new Date('2025-01-06'),
    endDate: new Date('2025-01-12'),
    color: 'indigo',
    tasks: [
      { id: 't2-1', name: 'Drawing Verification', status: 'completed', progress: 100 },
      { id: 't2-2', name: 'BOQ Cross-Check', status: 'completed', progress: 100 },
      { id: 't2-3', name: 'Site Visit', status: 'completed', progress: 100 },
      { id: 't2-4', name: 'Site Measurements', status: 'completed', progress: 100 },
      { id: 't2-5', name: 'Revise Drawings', status: 'completed', progress: 100 },
    ],
  },
  {
    id: 'phase-3',
    number: 3,
    name: 'Technical Design & BOM',
    shortName: 'Technical Design',
    description: 'Technical drawings and bill of materials creation',
    icon: Cog,
    status: 'completed',
    progress: 100,
    startDate: new Date('2025-01-13'),
    endDate: new Date('2025-01-20'),
    color: 'purple',
    tasks: [
      { id: 't3-1', name: 'Technical Drawings', status: 'completed', progress: 100 },
      { id: 't3-2', name: 'Accessories BOM', status: 'completed', progress: 100 },
      { id: 't3-3', name: 'Shutter Specs', status: 'completed', progress: 100 },
      { id: 't3-4', name: 'BOM Validation', status: 'completed', progress: 100 },
    ],
  },
  {
    id: 'phase-4',
    number: 4,
    name: 'Procurement',
    shortName: 'Procurement',
    description: 'Material procurement and vendor management',
    icon: ShoppingCart,
    status: 'in-progress',
    progress: 75,
    startDate: new Date('2025-01-21'),
    endDate: new Date('2025-02-05'),
    color: 'orange',
    tasks: [
      { id: 't4-1', name: 'BOM Reception', status: 'completed', progress: 100 },
      { id: 't4-2', name: 'Stock Check', status: 'completed', progress: 100 },
      { id: 't4-3', name: 'Generate PR', status: 'completed', progress: 100 },
      { id: 't4-4', name: 'Vendor Tracking', status: 'in-progress', progress: 60, assignee: 'Sarah M.' },
      { id: 't4-5', name: 'Material Receipt', status: 'pending', progress: 0 },
    ],
  },
  {
    id: 'phase-5',
    number: 5,
    name: 'Production',
    shortName: 'Production',
    description: 'Manufacturing execution across all work centers',
    icon: Factory,
    status: 'in-progress',
    progress: 45,
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-02-28'),
    color: 'red',
    tasks: [
      { id: 't5-1', name: 'Laser Cutting', status: 'completed', progress: 100 },
      { id: 't5-2', name: 'Bending', status: 'in-progress', progress: 80, assignee: 'Team A' },
      { id: 't5-3', name: 'Fabrication', status: 'in-progress', progress: 40, assignee: 'Team B' },
      { id: 't5-4', name: 'Welding', status: 'pending', progress: 0 },
      { id: 't5-5', name: 'Buffing', status: 'pending', progress: 0 },
      { id: 't5-6', name: 'Shutter Work', status: 'pending', progress: 0 },
    ],
  },
  {
    id: 'phase-6',
    number: 6,
    name: 'Quality & Packaging',
    shortName: 'QC & Packaging',
    description: 'Quality control inspections and packaging',
    icon: PackageCheck,
    status: 'pending',
    progress: 0,
    startDate: new Date('2025-02-25'),
    endDate: new Date('2025-03-05'),
    color: 'green',
    tasks: [
      { id: 't6-1', name: 'Inspection Checklists', status: 'pending', progress: 0 },
      { id: 't6-2', name: 'NCR Management', status: 'pending', progress: 0 },
      { id: 't6-3', name: 'Packaging', status: 'pending', progress: 0 },
      { id: 't6-4', name: 'Labeling', status: 'pending', progress: 0 },
    ],
  },
  {
    id: 'phase-7',
    number: 7,
    name: 'Logistics & Delivery',
    shortName: 'Logistics',
    description: 'Dispatch planning and delivery coordination',
    icon: Truck,
    status: 'pending',
    progress: 0,
    startDate: new Date('2025-03-06'),
    endDate: new Date('2025-03-10'),
    color: 'cyan',
    tasks: [
      { id: 't7-1', name: 'Dispatch Planning', status: 'pending', progress: 0 },
      { id: 't7-2', name: 'Load Optimization', status: 'pending', progress: 0 },
      { id: 't7-3', name: 'Delivery Tracking', status: 'pending', progress: 0 },
      { id: 't7-4', name: 'Site Delivery', status: 'pending', progress: 0 },
    ],
  },
  {
    id: 'phase-8',
    number: 8,
    name: 'Installation & Handover',
    shortName: 'Installation',
    description: 'Site installation and customer handover',
    icon: Home,
    status: 'pending',
    progress: 0,
    startDate: new Date('2025-03-11'),
    endDate: new Date('2025-03-20'),
    color: 'emerald',
    tasks: [
      { id: 't8-1', name: 'Site Preparation', status: 'pending', progress: 0 },
      { id: 't8-2', name: 'Installation', status: 'pending', progress: 0 },
      { id: 't8-3', name: 'Testing', status: 'pending', progress: 0 },
      { id: 't8-4', name: 'Customer Training', status: 'pending', progress: 0 },
      { id: 't8-5', name: 'Handover', status: 'pending', progress: 0 },
    ],
  },
];

// Color mapping
const colorClasses = {
  blue: { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-500' },
  indigo: { bg: 'bg-indigo-500', light: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-500' },
  purple: { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-500' },
  orange: { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-500' },
  red: { bg: 'bg-red-500', light: 'bg-red-100', text: 'text-red-700', border: 'border-red-500' },
  green: { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-700', border: 'border-green-500' },
  cyan: { bg: 'bg-cyan-500', light: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-500' },
  emerald: { bg: 'bg-emerald-500', light: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-500' },
};

/**
 * PhaseProgressVisualization - Visual progress through 8 manufacturing phases
 * Shows phase status, progress, and task details
 */
export function PhaseProgressVisualization({
  projectId,
  projectName = 'Project PRJ-2025-001',
  phases = defaultPhases,
  currentPhase = 5,
  onPhaseClick,
  onTaskClick,
  variant = 'horizontal',
  showDetails = true,
}: PhaseProgressVisualizationProps) {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  // Calculate overall progress
  const overallProgress = Math.round(
    phases.reduce((sum, p) => sum + p.progress, 0) / phases.length
  );

  // Get status icon
  const getStatusIcon = (status: string, size = 'w-5 h-5') => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className={`${size} text-green-500`} />;
      case 'in-progress':
        return <Clock className={`${size} text-blue-500 animate-pulse`} />;
      case 'blocked':
        return <AlertTriangle className={`${size} text-red-500`} />;
      default:
        return <Circle className={`${size} text-gray-300`} />;
    }
  };

  const togglePhase = (phaseId: string) => {
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
  };

  // Horizontal Timeline View
  if (variant === 'horizontal') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Phase Progress
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{projectName}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{overallProgress}%</div>
            <div className="text-sm text-gray-500">Overall Progress</div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-8">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Phase Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700" />
          <div
            className="absolute top-8 left-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
            style={{ width: `${((currentPhase - 1) / (phases.length - 1)) * 100}%` }}
          />

          {/* Phase Nodes */}
          <div className="relative flex justify-between">
            {phases.map((phase, index) => {
              const colors = colorClasses[phase.color as keyof typeof colorClasses];
              const isActive = phase.number === currentPhase;
              const isPast = phase.number < currentPhase;
              const PhaseIcon = phase.icon;

              return (
                <div
                  key={phase.id}
                  className="flex flex-col items-center"
                  style={{ width: `${100 / phases.length}%` }}
                >
                  {/* Phase Circle */}
                  <button
                    onClick={() => {
                      onPhaseClick?.(phase.id);
                      togglePhase(phase.id);
                    }}
                    className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? `${colors.bg} text-white ring-4 ring-offset-2 ring-${phase.color}-300 scale-110`
                        : isPast
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    } hover:scale-105 cursor-pointer`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-8 h-8" />
                    ) : (
                      <PhaseIcon className="w-7 h-7" />
                    )}

                    {/* Phase Number Badge */}
                    <span className={`absolute -top-1 -right-1 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                      isActive || isPast ? 'bg-white text-gray-900' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {phase.number}
                    </span>
                  </button>

                  {/* Phase Name */}
                  <div className="mt-3 text-center">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {phase.shortName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{phase.progress}%</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full max-w-[80px] mt-2">
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${isPast ? 'bg-green-500' : colors.bg} rounded-full transition-all duration-500`}
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expanded Phase Details */}
        {showDetails && expandedPhase && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            {phases
              .filter(p => p.id === expandedPhase)
              .map(phase => {
                const colors = colorClasses[phase.color as keyof typeof colorClasses];
                const PhaseIcon = phase.icon;

                return (
                  <div key={phase.id} className={`rounded-lg border-l-4 ${colors.border} ${colors.light} dark:bg-gray-700/50 p-3`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${colors.bg} text-white flex items-center justify-center`}>
                          <PhaseIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Phase {phase.number}: {phase.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{phase.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${colors.text}`}>{phase.progress}%</div>
                        <div className="text-sm text-gray-500">
                          {phase.tasks.filter(t => t.status === 'completed').length}/{phase.tasks.length} tasks
                        </div>
                      </div>
                    </div>

                    {/* Tasks Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                      {phase.tasks.map(task => (
                        <button
                          key={task.id}
                          onClick={() => onTaskClick?.(phase.id, task.id)}
                          className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:shadow-sm transition-all text-left"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(task.status, 'w-4 h-4')}
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {task.name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex-1 mr-2">
                              <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full">
                                <div
                                  className={`h-full rounded-full ${
                                    task.status === 'completed' ? 'bg-green-500' :
                                    task.status === 'in-progress' ? 'bg-blue-500' :
                                    'bg-gray-300'
                                  }`}
                                  style={{ width: `${task.progress}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">{task.progress}%</span>
                          </div>
                          {task.assignee && (
                            <p className="text-xs text-gray-400 mt-1 truncate">{task.assignee}</p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Phase Status Summary */}
        <div className="mt-6 grid grid-cols-4 gap-2">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{phases.filter(p => p.status === 'completed').length}</div>
            <div className="text-xs text-green-700 dark:text-green-400">Completed</div>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{phases.filter(p => p.status === 'in-progress').length}</div>
            <div className="text-xs text-blue-700 dark:text-blue-400">In Progress</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">{phases.filter(p => p.status === 'pending').length}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Pending</div>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{phases.filter(p => p.status === 'blocked').length}</div>
            <div className="text-xs text-red-700 dark:text-red-400">Blocked</div>
          </div>
        </div>
      </div>
    );
  }

  // Compact View
  if (variant === 'compact') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {phases.map((phase, index) => {
            const isPast = phase.number < currentPhase;
            const isActive = phase.number === currentPhase;
            const PhaseIcon = phase.icon;

            return (
              <React.Fragment key={phase.id}>
                <button
                  onClick={() => onPhaseClick?.(phase.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : isPast
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {isPast ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <PhaseIcon className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">{phase.shortName}</span>
                  <span className="text-xs opacity-75">{phase.progress}%</span>
                </button>
                {index < phases.length - 1 && (
                  <ArrowRight className={`w-4 h-4 flex-shrink-0 ${
                    isPast ? 'text-green-400' : 'text-gray-300'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical View
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Phase Progress</h2>
        <span className="text-2xl font-bold text-blue-600">{overallProgress}%</span>
      </div>

      <div className="space-y-2">
        {phases.map((phase, index) => {
          const colors = colorClasses[phase.color as keyof typeof colorClasses];
          const isExpanded = expandedPhase === phase.id;
          const PhaseIcon = phase.icon;

          return (
            <div key={phase.id} className="relative">
              {/* Connector Line */}
              {index < phases.length - 1 && (
                <div className={`absolute left-5 top-12 w-0.5 h-8 ${
                  phase.status === 'completed' ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}

              <button
                onClick={() => togglePhase(phase.id)}
                className={`w-full flex items-center gap-2 p-3 rounded-lg border transition-all ${
                  isExpanded
                    ? `${colors.light} ${colors.border} border-l-4`
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  phase.status === 'completed' ? 'bg-green-500 text-white' :
                  phase.status === 'in-progress' ? `${colors.bg} text-white` :
                  'bg-gray-200 dark:bg-gray-600 text-gray-500'
                }`}>
                  {phase.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <PhaseIcon className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">{phase.name}</span>
                    {phase.status === 'in-progress' && (
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">Active</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 max-w-[200px]">
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full">
                        <div
                          className={`h-full rounded-full ${phase.status === 'completed' ? 'bg-green-500' : colors.bg}`}
                          style={{ width: `${phase.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{phase.progress}%</span>
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Expanded Tasks */}
              {isExpanded && (
                <div className="ml-14 mt-2 space-y-2">
                  {phase.tasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => onTaskClick?.(phase.id, task.id)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      {getStatusIcon(task.status, 'w-4 h-4')}
                      <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{task.name}</span>
                      <span className="text-xs text-gray-500">{task.progress}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PhaseProgressVisualization;
