'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Ruler,
  Cog,
  ShoppingCart,
  Factory,
  PackageCheck,
  Truck,
  Home,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Plus,
  Calendar,
  Package,
  ClipboardCheck,
  Wrench
} from 'lucide-react';

interface WorkflowAction {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
  isEnhanced?: boolean;
}

interface Phase {
  id: string;
  number: number;
  name: string;
  shortName: string;
  icon: React.ElementType;
  color: string;
  actions: WorkflowAction[];
}

const phases: Phase[] = [
  {
    id: 'phase-1',
    number: 1,
    name: 'Project Initiation',
    shortName: 'Initiation',
    icon: FileText,
    color: 'blue',
    actions: [
      {
        id: 'create-project',
        label: 'Create New Project',
        description: 'Multi-step project creation wizard',
        href: '/project-management/create-enhanced',
        icon: Plus,
        isEnhanced: true,
      },
      {
        id: 'upload-boq',
        label: 'Upload BOQ',
        description: 'Bill of Quantities upload wizard',
        href: '/project-management/documents/upload/boq-enhanced',
        icon: FileText,
        isEnhanced: true,
      },
    ],
  },
  {
    id: 'phase-2',
    number: 2,
    name: 'Design & Site Assessment',
    shortName: 'Site Assessment',
    icon: Ruler,
    color: 'indigo',
    actions: [
      {
        id: 'schedule-site-visit',
        label: 'Schedule Site Visit',
        description: 'Plan and schedule site assessments',
        href: '/project-management/site-visit/schedule-enhanced',
        icon: Calendar,
        isEnhanced: true,
      },
    ],
  },
  {
    id: 'phase-3',
    number: 3,
    name: 'Technical Design & BOM',
    shortName: 'Technical Design',
    icon: Cog,
    color: 'purple',
    actions: [
      {
        id: 'accessories-bom',
        label: 'Create Accessories BOM',
        description: 'Bill of Materials for accessories',
        href: '/project-management/technical/bom/accessories-enhanced',
        icon: Package,
        isEnhanced: true,
      },
    ],
  },
  {
    id: 'phase-4',
    number: 4,
    name: 'Procurement',
    shortName: 'Procurement',
    icon: ShoppingCart,
    color: 'orange',
    actions: [
      {
        id: 'create-po',
        label: 'Create Purchase Order',
        description: 'Multi-step PO creation wizard',
        href: '/project-management/procurement/po-creation-enhanced',
        icon: ShoppingCart,
        isEnhanced: true,
      },
    ],
  },
  {
    id: 'phase-5',
    number: 5,
    name: 'Production',
    shortName: 'Production',
    icon: Factory,
    color: 'red',
    actions: [
      {
        id: 'create-work-order',
        label: 'Create Work Order',
        description: 'Production work order wizard',
        href: '/project-management/production/work-order-enhanced',
        icon: Factory,
        isEnhanced: true,
      },
    ],
  },
  {
    id: 'phase-6',
    number: 6,
    name: 'Quality & Packaging',
    shortName: 'QC & Packaging',
    icon: PackageCheck,
    color: 'green',
    actions: [
      {
        id: 'quality-inspection',
        label: 'Quality Inspection',
        description: 'Quality check and inspection form',
        href: '/project-management/quality-inspection-enhanced',
        icon: ClipboardCheck,
        isEnhanced: true,
      },
    ],
  },
  {
    id: 'phase-7',
    number: 7,
    name: 'Logistics & Delivery',
    shortName: 'Logistics',
    icon: Truck,
    color: 'cyan',
    actions: [
      {
        id: 'dispatch-planning',
        label: 'Plan Dispatch',
        description: 'Dispatch planning and scheduling',
        href: '/project-management/dispatch-planning-enhanced',
        icon: Truck,
        isEnhanced: true,
      },
    ],
  },
  {
    id: 'phase-8',
    number: 8,
    name: 'Installation & Handover',
    shortName: 'Installation',
    icon: Home,
    color: 'emerald',
    actions: [
      {
        id: 'installation-tracking',
        label: 'Track Installation',
        description: 'Installation activity tracking',
        href: '/project-management/installation-tracking-enhanced',
        icon: Wrench,
        isEnhanced: true,
      },
    ],
  },
];

const colorClasses: Record<string, { bg: string; light: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  indigo: { bg: 'bg-indigo-500', light: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  purple: { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  orange: { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  red: { bg: 'bg-red-500', light: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  green: { bg: 'bg-green-500', light: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  cyan: { bg: 'bg-cyan-500', light: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  emerald: { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

interface WorkflowQuickActionsProps {
  variant?: 'grid' | 'compact' | 'list';
  showPhaseNumbers?: boolean;
  className?: string;
}

export function WorkflowQuickActions({
  variant = 'grid',
  showPhaseNumbers = true,
  className = '',
}: WorkflowQuickActionsProps) {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  const togglePhase = (phaseId: string) => {
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 ${className}`}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
          <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Enhanced Forms</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {phases.flatMap(phase =>
            phase.actions.map(action => (
              <Link
                key={action.id}
                href={action.href}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-colors ${colorClasses[phase.color].light} ${colorClasses[phase.color].text} hover:opacity-80`}
              >
                <action.icon className="w-3.5 h-3.5" />
                <span>{action.label}</span>
                {action.isEnhanced && <Sparkles className="w-2.5 h-2.5 text-yellow-500" />}
              </Link>
            ))
          )}
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Workflow Quick Actions</h2>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-auto">FormUX Enhanced</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Access enhanced forms with auto-save, draft recovery, and step-by-step wizards
          </p>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {phases.map(phase => {
            const colors = colorClasses[phase.color];
            const PhaseIcon = phase.icon;
            const isExpanded = expandedPhase === phase.id;

            return (
              <div key={phase.id}>
                <button
                  onClick={() => togglePhase(phase.id)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg ${colors.bg} text-white flex items-center justify-center`}>
                    {showPhaseNumbers ? (
                      <span className="font-bold">{phase.number}</span>
                    ) : (
                      <PhaseIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900 dark:text-white">{phase.name}</p>
                    <p className="text-sm text-gray-500">{phase.actions.length} enhanced form(s)</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {isExpanded && (
                  <div className={`p-4 pt-0 ${colors.light}`}>
                    <div className="space-y-2">
                      {phase.actions.map(action => (
                        <Link
                          key={action.id}
                          href={action.href}
                          className={`flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border ${colors.border} hover:shadow-md transition-all`}
                        >
                          <div className={`w-8 h-8 rounded-full ${colors.light} ${colors.text} flex items-center justify-center`}>
                            <action.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                              {action.label}
                              {action.isEnhanced && (
                                <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                  <Sparkles className="w-3 h-3" />
                                  Enhanced
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">{action.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default grid variant
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Workflow Quick Actions</h2>
        </div>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">FormUX Enhanced</span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Quick access to enhanced forms with auto-save, draft recovery, and step-by-step wizards
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {phases.map(phase => {
          const colors = colorClasses[phase.color];
          const PhaseIcon = phase.icon;

          return (
            <div key={phase.id} className={`rounded-lg border ${colors.border} ${colors.light} p-4`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-full ${colors.bg} text-white flex items-center justify-center text-sm font-bold`}>
                  {phase.number}
                </div>
                <div>
                  <p className={`text-sm font-medium ${colors.text}`}>{phase.shortName}</p>
                </div>
              </div>
              <div className="space-y-2">
                {phase.actions.map(action => (
                  <Link
                    key={action.id}
                    href={action.href}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-all text-sm"
                  >
                    <action.icon className={`w-4 h-4 ${colors.text}`} />
                    <span className="text-gray-700 dark:text-gray-300 flex-1 truncate">{action.label}</span>
                    {action.isEnhanced && <Sparkles className="w-3 h-3 text-yellow-500" />}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WorkflowQuickActions;
