'use client';

import React, { useState } from 'react';
import {
    X,
    ChevronDown,
    ChevronRight,
    CheckCircle2,
    Circle,
    XCircle,
    AlertCircle,
    ClipboardList,
    Settings,
} from 'lucide-react';
import {
    ProjectChecklist,
    ChecklistPhase,
    ChecklistStep,
    ChecklistItemStatus,
    getChecklistStats,
    updateChecklistStep,
    getStatusIcon,
    getStatusLabel,
} from '@/lib/projectChecklistData';

// ============================================
// PROPS INTERFACES
// ============================================

interface ProjectChecklistModalProps {
    isOpen: boolean;
    onClose: () => void;
    checklist: ProjectChecklist;
    onChecklistChange: (checklist: ProjectChecklist) => void;
    readOnly?: boolean;
}

interface ChecklistConfirmationProps {
    checklist: ProjectChecklist;
    onOpenModal: () => void;
}

// ============================================
// PROJECT CHECKLIST MODAL
// Full-featured modal for viewing and editing the project checklist
// ============================================

export function ProjectChecklistModal({
    isOpen,
    onClose,
    checklist,
    onChecklistChange,
    readOnly = false,
}: ProjectChecklistModalProps) {
    const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(['phase-1']));

    if (!isOpen) return null;

    const stats = getChecklistStats(checklist);

    const togglePhase = (phaseId: string) => {
        const newExpanded = new Set(expandedPhases);
        if (newExpanded.has(phaseId)) {
            newExpanded.delete(phaseId);
        } else {
            newExpanded.add(phaseId);
        }
        setExpandedPhases(newExpanded);
    };

    const handleStatusChange = (phaseId: string, stepId: string, newStatus: ChecklistItemStatus) => {
        const updated = updateChecklistStep(checklist, phaseId, stepId, newStatus);
        onChecklistChange(updated);
    };

    const expandAll = () => {
        setExpandedPhases(new Set(checklist.phases.map(p => p.id)));
    };

    const collapseAll = () => {
        setExpandedPhases(new Set());
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ClipboardList className="w-6 h-6" />
                                <div>
                                    <h2 className="text-lg font-bold">Project Workflow Checklist</h2>
                                    <p className="text-sm text-blue-100">
                                        {checklist.projectType} • {stats.totalPhases} Phases • {stats.applicableSteps} Steps
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="text-gray-600">Required: <span className="font-semibold text-gray-900">{stats.requiredSteps}</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                                    <span className="text-gray-600">Optional: <span className="font-semibold text-gray-900">{stats.optionalSteps}</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="text-gray-600">Completed: <span className="font-semibold text-gray-900">{stats.completedSteps}</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-gray-200" />
                                    <span className="text-gray-600">N/A: <span className="font-semibold text-gray-900">{stats.notApplicableSteps}</span></span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={expandAll}
                                    className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    Expand All
                                </button>
                                <button
                                    onClick={collapseAll}
                                    className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Collapse All
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Phases List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {checklist.phases.map((phase) => (
                            <PhaseCard
                                key={phase.id}
                                phase={phase}
                                isExpanded={expandedPhases.has(phase.id)}
                                onToggle={() => togglePhase(phase.id)}
                                onStatusChange={handleStatusChange}
                                readOnly={readOnly}
                            />
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                            Last modified: {new Date(checklist.lastModified).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {readOnly ? 'Close' : 'Cancel'}
                            </button>
                            {!readOnly && (
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// PHASE CARD SUB-COMPONENT
// ============================================

interface PhaseCardProps {
    phase: ChecklistPhase;
    isExpanded: boolean;
    onToggle: () => void;
    onStatusChange: (phaseId: string, stepId: string, status: ChecklistItemStatus) => void;
    readOnly: boolean;
}

function PhaseCard({ phase, isExpanded, onToggle, onStatusChange, readOnly }: PhaseCardProps) {
    const completedCount = phase.steps.filter(s => s.status === 'completed').length;
    const applicableCount = phase.steps.filter(s => s.status !== 'not_applicable').length;
    const progress = applicableCount > 0 ? Math.round((completedCount / applicableCount) * 100) : 0;

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Phase Header */}
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                        {phase.phaseNumber}
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-gray-900">{phase.name}</h3>
                        <p className="text-xs text-gray-500">{phase.description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-xs text-gray-500 w-12 text-right">
                            {completedCount}/{applicableCount}
                        </span>
                    </div>
                    {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                </div>
            </button>

            {/* Phase Steps */}
            {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50 divide-y divide-gray-100">
                    {phase.steps.map((step) => (
                        <StepRow
                            key={step.id}
                            step={step}
                            phaseId={phase.id}
                            onStatusChange={onStatusChange}
                            readOnly={readOnly}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ============================================
// STEP ROW SUB-COMPONENT
// ============================================

interface StepRowProps {
    step: ChecklistStep;
    phaseId: string;
    onStatusChange: (phaseId: string, stepId: string, status: ChecklistItemStatus) => void;
    readOnly: boolean;
}

function StepRow({ step, phaseId, onStatusChange, readOnly }: StepRowProps) {
    const statusInfo = getStatusIcon(step.status);
    const StatusIcon = statusInfo.icon;

    const statusOptions: ChecklistItemStatus[] = ['required', 'optional', 'not_applicable', 'completed'];

    return (
        <div className={`px-4 py-2.5 flex items-center justify-between ${step.status === 'not_applicable' ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-3">
                <div className={`p-1 rounded ${statusInfo.bg}`}>
                    <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                </div>
                <div>
                    <p className={`text-sm font-medium ${step.status === 'not_applicable' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {step.name}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                </div>
            </div>

            {readOnly ? (
                <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
                    {getStatusLabel(step.status)}
                </span>
            ) : (
                <select
                    value={step.status}
                    onChange={(e) => onStatusChange(phaseId, step.id, e.target.value as ChecklistItemStatus)}
                    className="text-xs px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    {statusOptions.map(status => (
                        <option key={status} value={status}>{getStatusLabel(status)}</option>
                    ))}
                </select>
            )}
        </div>
    );
}

// ============================================
// CHECKLIST CONFIRMATION COMPONENT
// Compact view for the Review step in the wizard
// ============================================

export function ChecklistConfirmation({ checklist, onOpenModal }: ChecklistConfirmationProps) {
    const stats = getChecklistStats(checklist);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <ClipboardList className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900">Workflow Checklist</h4>
                        <p className="text-sm text-gray-600">
                            {stats.totalPhases} Phases • {stats.requiredSteps} Required Steps • {stats.optionalSteps} Optional
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onOpenModal}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                    <Settings className="w-4 h-4" />
                    View & Edit
                </button>
            </div>

            {/* Phase Summary */}
            <div className="px-4 py-3 bg-white border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {checklist.phases.slice(0, 4).map((phase) => {
                        const phaseSteps = phase.steps.filter(s => s.status !== 'not_applicable').length;
                        return (
                            <div key={phase.id} className="flex items-center gap-2 text-sm">
                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                    {phase.phaseNumber}
                                </div>
                                <span className="text-gray-700 truncate">{phase.name}</span>
                                <span className="text-xs text-gray-400">({phaseSteps})</span>
                            </div>
                        );
                    })}
                </div>
                {checklist.phases.length > 4 && (
                    <p className="mt-2 text-xs text-gray-500">
                        + {checklist.phases.length - 4} more phases
                    </p>
                )}
            </div>
        </div>
    );
}
