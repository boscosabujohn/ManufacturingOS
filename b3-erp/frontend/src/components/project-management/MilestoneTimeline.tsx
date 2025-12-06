'use client';

import React, { useState, useMemo } from 'react';
import {
  Flag,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Target,
  TrendingUp,
  Circle,
  Diamond,
  Star,
  Zap,
  Package,
  Truck,
  FileCheck,
  Users,
  PartyPopper,
  Filter,
  Download
} from 'lucide-react';

// Types
interface Milestone {
  id: string;
  name: string;
  description: string;
  date: Date;
  status: 'completed' | 'on-track' | 'at-risk' | 'delayed' | 'upcoming';
  type: 'major' | 'minor' | 'phase-gate' | 'delivery' | 'review';
  phase?: string;
  phaseNumber?: number;
  owner?: string;
  dependencies?: string[];
  deliverables?: string[];
  notes?: string;
  percentComplete?: number;
  actualDate?: Date;
}

interface MilestoneTimelineProps {
  milestones?: Milestone[];
  projectStartDate?: Date;
  projectEndDate?: Date;
  onMilestoneClick?: (milestoneId: string) => void;
  variant?: 'horizontal' | 'vertical' | 'calendar';
  showPhases?: boolean;
  highlightUpcoming?: boolean;
}

// Sample milestones for manufacturing project
const generateSampleMilestones = (): Milestone[] => {
  const baseDate = new Date('2025-01-06');

  return [
    {
      id: 'm1',
      name: 'Project Kickoff',
      description: 'Official project start and team onboarding',
      date: new Date(baseDate),
      status: 'completed',
      type: 'major',
      phase: 'Project Initiation',
      phaseNumber: 1,
      owner: 'Project Manager',
      deliverables: ['Project charter', 'Team assignments', 'Initial schedule'],
      actualDate: new Date(baseDate),
      percentComplete: 100,
    },
    {
      id: 'm2',
      name: 'Design Approval',
      description: 'Customer sign-off on final designs',
      date: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000),
      status: 'completed',
      type: 'phase-gate',
      phase: 'Design & Site Assessment',
      phaseNumber: 2,
      owner: 'Design Lead',
      deliverables: ['Approved drawings', 'Customer signature', 'Revision log'],
      actualDate: new Date(baseDate.getTime() + 11 * 24 * 60 * 60 * 1000),
      percentComplete: 100,
    },
    {
      id: 'm3',
      name: 'BOM Finalization',
      description: 'Complete bill of materials approved for procurement',
      date: new Date(baseDate.getTime() + 18 * 24 * 60 * 60 * 1000),
      status: 'completed',
      type: 'phase-gate',
      phase: 'Technical Design & BOM',
      phaseNumber: 3,
      owner: 'Technical Manager',
      deliverables: ['Final BOM', 'Material specifications', 'Vendor list'],
      actualDate: new Date(baseDate.getTime() + 18 * 24 * 60 * 60 * 1000),
      percentComplete: 100,
    },
    {
      id: 'm4',
      name: 'Material Receipt Complete',
      description: 'All critical materials received and inspected',
      date: new Date(baseDate.getTime() + 32 * 24 * 60 * 60 * 1000),
      status: 'on-track',
      type: 'major',
      phase: 'Procurement',
      phaseNumber: 4,
      owner: 'Procurement Manager',
      deliverables: ['Goods receipt', 'QC inspection reports', 'Inventory update'],
      percentComplete: 75,
    },
    {
      id: 'm5',
      name: 'Production Start',
      description: 'Manufacturing begins on shop floor',
      date: new Date(baseDate.getTime() + 35 * 24 * 60 * 60 * 1000),
      status: 'on-track',
      type: 'major',
      phase: 'Production',
      phaseNumber: 5,
      owner: 'Production Manager',
      deliverables: ['Work orders released', 'Resource allocation', 'Schedule confirmed'],
      percentComplete: 60,
    },
    {
      id: 'm6',
      name: 'Mid-Production Review',
      description: 'Quality check and progress assessment',
      date: new Date(baseDate.getTime() + 50 * 24 * 60 * 60 * 1000),
      status: 'upcoming',
      type: 'review',
      phase: 'Production',
      phaseNumber: 5,
      owner: 'Quality Manager',
      deliverables: ['Progress report', 'Quality metrics', 'Risk assessment'],
      percentComplete: 0,
    },
    {
      id: 'm7',
      name: 'Production Complete',
      description: 'All manufacturing operations finished',
      date: new Date(baseDate.getTime() + 65 * 24 * 60 * 60 * 1000),
      status: 'upcoming',
      type: 'phase-gate',
      phase: 'Production',
      phaseNumber: 5,
      owner: 'Production Manager',
      deliverables: ['Completed units', 'Production report', 'Scrap analysis'],
      percentComplete: 0,
    },
    {
      id: 'm8',
      name: 'Final QC Approval',
      description: 'Quality control sign-off for shipment',
      date: new Date(baseDate.getTime() + 72 * 24 * 60 * 60 * 1000),
      status: 'upcoming',
      type: 'phase-gate',
      phase: 'Quality & Packaging',
      phaseNumber: 6,
      owner: 'Quality Manager',
      deliverables: ['QC certificates', 'Test reports', 'Compliance docs'],
      percentComplete: 0,
    },
    {
      id: 'm9',
      name: 'Ready for Shipment',
      description: 'Products packaged and staged for delivery',
      date: new Date(baseDate.getTime() + 78 * 24 * 60 * 60 * 1000),
      status: 'upcoming',
      type: 'delivery',
      phase: 'Logistics & Delivery',
      phaseNumber: 7,
      owner: 'Logistics Manager',
      deliverables: ['Packing list', 'Shipping labels', 'Delivery schedule'],
      percentComplete: 0,
    },
    {
      id: 'm10',
      name: 'Site Delivery',
      description: 'Products delivered to installation site',
      date: new Date(baseDate.getTime() + 82 * 24 * 60 * 60 * 1000),
      status: 'upcoming',
      type: 'delivery',
      phase: 'Logistics & Delivery',
      phaseNumber: 7,
      owner: 'Logistics Manager',
      deliverables: ['Delivery confirmation', 'Damage inspection', 'Inventory check'],
      percentComplete: 0,
    },
    {
      id: 'm11',
      name: 'Installation Complete',
      description: 'All products installed and tested at site',
      date: new Date(baseDate.getTime() + 95 * 24 * 60 * 60 * 1000),
      status: 'upcoming',
      type: 'major',
      phase: 'Installation & Handover',
      phaseNumber: 8,
      owner: 'Installation Lead',
      deliverables: ['Installation report', 'Test results', 'Punch list'],
      percentComplete: 0,
    },
    {
      id: 'm12',
      name: 'Customer Handover',
      description: 'Final acceptance and project closure',
      date: new Date(baseDate.getTime() + 100 * 24 * 60 * 60 * 1000),
      status: 'upcoming',
      type: 'major',
      phase: 'Installation & Handover',
      phaseNumber: 8,
      owner: 'Project Manager',
      deliverables: ['Acceptance certificate', 'Training complete', 'Warranty docs'],
      percentComplete: 0,
    },
  ];
};

// Icon mapping for milestone types
const getMilestoneIcon = (type: string) => {
  switch (type) {
    case 'major':
      return Star;
    case 'phase-gate':
      return Flag;
    case 'delivery':
      return Truck;
    case 'review':
      return FileCheck;
    default:
      return Circle;
  }
};

// Status colors
const getStatusStyles = (status: string) => {
  switch (status) {
    case 'completed':
      return {
        bg: 'bg-green-500',
        light: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-400',
        border: 'border-green-500',
        ring: 'ring-green-200',
      };
    case 'on-track':
      return {
        bg: 'bg-blue-500',
        light: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-500',
        ring: 'ring-blue-200',
      };
    case 'at-risk':
      return {
        bg: 'bg-orange-500',
        light: 'bg-orange-100 dark:bg-orange-900/30',
        text: 'text-orange-700 dark:text-orange-400',
        border: 'border-orange-500',
        ring: 'ring-orange-200',
      };
    case 'delayed':
      return {
        bg: 'bg-red-500',
        light: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-500',
        ring: 'ring-red-200',
      };
    default:
      return {
        bg: 'bg-gray-400',
        light: 'bg-gray-100 dark:bg-gray-700',
        text: 'text-gray-600 dark:text-gray-400',
        border: 'border-gray-400',
        ring: 'ring-gray-200',
      };
  }
};

/**
 * MilestoneTimeline - Clear milestone visualization for projects
 * Shows key project milestones with status, dates, and deliverables
 */
export function MilestoneTimeline({
  milestones: propMilestones,
  projectStartDate,
  projectEndDate,
  onMilestoneClick,
  variant = 'horizontal',
  showPhases = true,
  highlightUpcoming = true,
}: MilestoneTimelineProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const milestones = propMilestones || generateSampleMilestones();

  // Filter milestones
  const filteredMilestones = useMemo(() => {
    if (filterStatus === 'all') return milestones;
    return milestones.filter(m => m.status === filterStatus);
  }, [milestones, filterStatus]);

  // Group by phase
  const phaseGroups = useMemo(() => {
    const groups: Record<number, Milestone[]> = {};
    milestones.forEach(m => {
      const phase = m.phaseNumber || 0;
      if (!groups[phase]) groups[phase] = [];
      groups[phase].push(m);
    });
    return groups;
  }, [milestones]);

  // Stats
  const stats = useMemo(() => ({
    total: milestones.length,
    completed: milestones.filter(m => m.status === 'completed').length,
    onTrack: milestones.filter(m => m.status === 'on-track').length,
    atRisk: milestones.filter(m => m.status === 'at-risk').length,
    delayed: milestones.filter(m => m.status === 'delayed').length,
    upcoming: milestones.filter(m => m.status === 'upcoming').length,
  }), [milestones]);

  // Next upcoming milestone
  const nextMilestone = useMemo(() => {
    const today = new Date();
    return milestones
      .filter(m => m.date >= today && m.status !== 'completed')
      .sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  }, [milestones]);

  // Days until next milestone
  const daysUntilNext = nextMilestone
    ? Math.ceil((nextMilestone.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const handleMilestoneClick = (milestoneId: string) => {
    setSelectedMilestone(selectedMilestone === milestoneId ? null : milestoneId);
    onMilestoneClick?.(milestoneId);
  };

  // Horizontal Timeline View
  if (variant === 'horizontal') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Flag className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Milestone Timeline</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stats.completed} of {stats.total} milestones completed
                </p>
              </div>
            </div>

            {/* Next Milestone Highlight */}
            {nextMilestone && highlightUpcoming && (
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Zap className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Next: {nextMilestone.name}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {daysUntilNext} days ({nextMilestone.date.toLocaleDateString()})
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-xs text-green-700 dark:text-green-400">Completed</div>
            </div>
            <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{stats.onTrack}</div>
              <div className="text-xs text-blue-700 dark:text-blue-400">On Track</div>
            </div>
            <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-xl font-bold text-orange-600">{stats.atRisk}</div>
              <div className="text-xs text-orange-700 dark:text-orange-400">At Risk</div>
            </div>
            <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-xl font-bold text-red-600">{stats.delayed}</div>
              <div className="text-xs text-red-700 dark:text-red-400">Delayed</div>
            </div>
            <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-xl font-bold text-gray-600 dark:text-gray-300">{stats.upcoming}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Upcoming</div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-6 overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Phase Headers */}
            {showPhases && (
              <div className="flex mb-4">
                {Object.entries(phaseGroups).map(([phase, phaseMilestones]) => (
                  <div
                    key={phase}
                    className="flex-1 text-center px-2"
                    style={{ flexBasis: `${(phaseMilestones.length / milestones.length) * 100}%` }}
                  >
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      Phase {phase}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Timeline Track */}
            <div className="relative">
              {/* Background Track */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />

              {/* Progress Track */}
              <div
                className="absolute top-6 left-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${(stats.completed / stats.total) * 100}%` }}
              />

              {/* Milestone Points */}
              <div className="relative flex justify-between">
                {milestones.map((milestone, index) => {
                  const styles = getStatusStyles(milestone.status);
                  const Icon = getMilestoneIcon(milestone.type);
                  const isSelected = selectedMilestone === milestone.id;
                  const isNext = milestone.id === nextMilestone?.id;

                  return (
                    <div
                      key={milestone.id}
                      className="flex flex-col items-center"
                      style={{ width: `${100 / milestones.length}%` }}
                    >
                      {/* Milestone Point */}
                      <button
                        onClick={() => handleMilestoneClick(milestone.id)}
                        className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          milestone.status === 'completed'
                            ? 'bg-green-500 text-white'
                            : isNext
                            ? `${styles.bg} text-white ring-4 ${styles.ring} scale-110`
                            : `bg-white dark:bg-gray-700 border-2 ${styles.border} ${styles.text}`
                        } hover:scale-110 cursor-pointer shadow-md`}
                      >
                        {milestone.status === 'completed' ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}

                        {/* Type indicator for major milestones */}
                        {milestone.type === 'major' && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Star className="w-2.5 h-2.5 text-yellow-900" />
                          </span>
                        )}
                      </button>

                      {/* Milestone Info */}
                      <div className="mt-3 text-center px-1">
                        <p className={`text-xs font-medium ${
                          isNext ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                        } line-clamp-2`}>
                          {milestone.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {milestone.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <span className={`inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-xs ${styles.light} ${styles.text}`}>
                          {milestone.status === 'completed' && <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />}
                          {milestone.status === 'at-risk' && <AlertTriangle className="w-2.5 h-2.5 mr-0.5" />}
                          {milestone.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Milestone Details */}
        {selectedMilestone && (
          <div className="px-6 pb-6">
            {milestones.filter(m => m.id === selectedMilestone).map(milestone => {
              const styles = getStatusStyles(milestone.status);
              const Icon = getMilestoneIcon(milestone.type);

              return (
                <div
                  key={milestone.id}
                  className={`p-4 rounded-lg border-l-4 ${styles.border} ${styles.light}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${styles.bg} text-white flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{milestone.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{milestone.description}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles.light} ${styles.text}`}>
                      {milestone.status.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Target Date</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {milestone.date.toLocaleDateString()}
                      </p>
                    </div>
                    {milestone.actualDate && (
                      <div>
                        <p className="text-xs text-gray-500">Actual Date</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {milestone.actualDate.toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500">Owner</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{milestone.owner}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phase</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{milestone.phase}</p>
                    </div>
                  </div>

                  {milestone.deliverables && milestone.deliverables.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-2">Deliverables</p>
                      <div className="flex flex-wrap gap-2">
                        {milestone.deliverables.map((d, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {milestone.percentComplete !== undefined && milestone.status !== 'completed' && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{milestone.percentComplete}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                        <div
                          className={`h-full rounded-full ${styles.bg}`}
                          style={{ width: `${milestone.percentComplete}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="px-6 pb-6">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="text-gray-500 font-medium">Type:</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600 dark:text-gray-400">Major</span>
            </div>
            <div className="flex items-center gap-1">
              <Flag className="w-4 h-4 text-purple-500" />
              <span className="text-gray-600 dark:text-gray-400">Phase Gate</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-cyan-500" />
              <span className="text-gray-600 dark:text-gray-400">Delivery</span>
            </div>
            <div className="flex items-center gap-1">
              <FileCheck className="w-4 h-4 text-indigo-500" />
              <span className="text-gray-600 dark:text-gray-400">Review</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vertical Timeline View
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Flag className="w-5 h-5 text-purple-500" />
          Milestone Timeline
        </h2>
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="on-track">On Track</option>
            <option value="at-risk">At Risk</option>
            <option value="delayed">Delayed</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        {/* Milestones */}
        <div className="space-y-6">
          {filteredMilestones.map((milestone, index) => {
            const styles = getStatusStyles(milestone.status);
            const Icon = getMilestoneIcon(milestone.type);
            const isNext = milestone.id === nextMilestone?.id;

            return (
              <div
                key={milestone.id}
                onClick={() => handleMilestoneClick(milestone.id)}
                className={`relative flex gap-4 cursor-pointer group`}
              >
                {/* Milestone Point */}
                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                  milestone.status === 'completed'
                    ? 'bg-green-500 text-white'
                    : isNext
                    ? `${styles.bg} text-white ring-4 ${styles.ring}`
                    : `bg-white dark:bg-gray-700 border-2 ${styles.border} ${styles.text}`
                } shadow-md`}>
                  {milestone.status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 pb-6 border-b border-gray-100 dark:border-gray-700 ${
                  index === filteredMilestones.length - 1 ? 'border-b-0' : ''
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {milestone.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{milestone.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {milestone.date.toLocaleDateString()}
                      </p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles.light} ${styles.text}`}>
                        {milestone.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {milestone.owner}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" />
                      Phase {milestone.phaseNumber}
                    </span>
                    {milestone.deliverables && (
                      <span className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5" />
                        {milestone.deliverables.length} deliverables
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MilestoneTimeline;
