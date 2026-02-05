'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
    ProjectChecklist,
    ChecklistStep,
    ChecklistPhase,
    getDefaultChecklist,
} from '@/lib/projectChecklistData';

// ============================================
// TYPES
// ============================================

export interface Project {
    id: string;
    name: string;
    projectType: string;
    customerId?: string;
    customerName?: string;
    status?: string;
}

interface ProjectContextType {
    // Active project
    activeProject: Project | null;
    setActiveProject: (project: Project | null) => void;

    // Project checklist
    checklist: ProjectChecklist | null;
    setChecklist: (checklist: ProjectChecklist | null) => void;

    // Checklist utilities
    isPhaseApplicable: (phaseId: string) => boolean;
    isStepApplicable: (stepId: string) => boolean;
    getPhaseStatus: (phaseId: string) => 'pending' | 'completed' | 'not_applicable' | 'in_progress';
    getStepByHref: (href: string) => ChecklistStep | null;

    // Load project with default checklist
    loadProject: (project: Project) => void;
    clearProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

// ============================================
// PROVIDER COMPONENT
// ============================================

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [checklist, setChecklist] = useState<ProjectChecklist | null>(null);

    // Load project and auto-populate checklist
    const loadProject = useCallback((project: Project) => {
        setActiveProject(project);
        const defaultChecklist = getDefaultChecklist(project.projectType);
        setChecklist(defaultChecklist);
    }, []);

    // Clear project context
    const clearProject = useCallback(() => {
        setActiveProject(null);
        setChecklist(null);
    }, []);

    // Check if a phase is applicable (not marked as not_applicable)
    const isPhaseApplicable = useCallback((phaseId: string): boolean => {
        if (!checklist) return true; // Default to applicable if no checklist

        const phase = checklist.phases.find(p => p.id === phaseId);
        if (!phase) return true;

        // A phase is applicable if at least one step is not "not_applicable"
        return phase.steps.some(step => step.status !== 'not_applicable');
    }, [checklist]);

    // Check if a specific step is applicable
    const isStepApplicable = useCallback((stepId: string): boolean => {
        if (!checklist) return true;

        for (const phase of checklist.phases) {
            const step = phase.steps.find(s => s.id === stepId);
            if (step) {
                return step.status !== 'not_applicable';
            }
        }
        return true;
    }, [checklist]);

    // Get phase status for visual indicators
    const getPhaseStatus = useCallback((phaseId: string): 'pending' | 'completed' | 'not_applicable' | 'in_progress' => {
        if (!checklist) return 'pending';

        const phase = checklist.phases.find(p => p.id === phaseId);
        if (!phase) return 'pending';

        const applicableSteps = phase.steps.filter(s => s.status !== 'not_applicable');

        if (applicableSteps.length === 0) {
            return 'not_applicable';
        }

        const completedSteps = applicableSteps.filter(s => s.status === 'completed');

        if (completedSteps.length === applicableSteps.length) {
            return 'completed';
        }

        if (completedSteps.length > 0) {
            return 'in_progress';
        }

        return 'pending';
    }, [checklist]);

    // Find a step by its href (for matching with current route)
    const getStepByHref = useCallback((href: string): ChecklistStep | null => {
        if (!checklist) return null;

        for (const phase of checklist.phases) {
            const step = phase.steps.find(s => href.startsWith(s.href) || s.href.startsWith(href));
            if (step) return step;
        }
        return null;
    }, [checklist]);

    const value = useMemo(() => ({
        activeProject,
        setActiveProject,
        checklist,
        setChecklist,
        isPhaseApplicable,
        isStepApplicable,
        getPhaseStatus,
        getStepByHref,
        loadProject,
        clearProject,
    }), [
        activeProject,
        checklist,
        isPhaseApplicable,
        isStepApplicable,
        getPhaseStatus,
        getStepByHref,
        loadProject,
        clearProject,
    ]);

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
}

// ============================================
// HOOK
// ============================================

export function useProjectContext() {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProjectContext must be used within a ProjectProvider');
    }
    return context;
}

// Optional hook that doesn't throw if outside provider
export function useProjectContextOptional() {
    return useContext(ProjectContext);
}
