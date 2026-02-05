'use client';

import { CheckCircle2, Circle, XCircle } from 'lucide-react';

// ============================================
// TYPES & INTERFACES
// ============================================

export type ChecklistItemStatus = 'required' | 'optional' | 'not_applicable' | 'completed';

export interface ChecklistStep {
    id: string;
    name: string;
    description: string;
    href: string;
    status: ChecklistItemStatus;
    order: number;
}

export interface ChecklistPhase {
    id: string;
    phaseNumber: number;
    name: string;
    description: string;
    steps: ChecklistStep[];
}

export interface ProjectChecklist {
    phases: ChecklistPhase[];
    projectType: string;
    createdAt: string;
    lastModified: string;
}

// ============================================
// MASTER WORKFLOW DATA (extracted from Sidebar)
// ============================================

export const WORKFLOW_PHASES: Omit<ChecklistPhase, 'steps'>[] = [
    { id: 'phase-1', phaseNumber: 1, name: 'Project Initiation', description: 'Project setup & handover' },
    { id: 'phase-2', phaseNumber: 2, name: 'Design & Site Assessment', description: 'Site verification & design' },
    { id: 'phase-3', phaseNumber: 3, name: 'Technical Design & BOM', description: 'Technical drawings & BOM' },
    { id: 'phase-4', phaseNumber: 4, name: 'Procurement', description: 'Material procurement' },
    { id: 'phase-5', phaseNumber: 5, name: 'Production', description: 'Manufacturing execution' },
    { id: 'phase-6', phaseNumber: 6, name: 'Quality & Packaging', description: 'QC & packaging' },
    { id: 'phase-7', phaseNumber: 7, name: 'Logistics & Delivery', description: 'Dispatch & delivery' },
    { id: 'phase-8', phaseNumber: 8, name: 'Installation & Handover', description: 'Site installation & handover' },
];

export const MASTER_CHECKLIST_STEPS: Record<string, Omit<ChecklistStep, 'status' | 'order'>[]> = {
    'phase-1': [
        { id: 'p1-project-setup', name: 'Project Setup', description: 'Create & configure project', href: '/project-management' },
        { id: 'p1-upload-boq', name: 'Upload BOQ', description: 'Bill of Quantities', href: '/project-management/documents/upload/boq' },
        { id: 'p1-upload-drawings', name: 'Upload Drawings', description: 'Technical Drawings', href: '/project-management/documents/upload/drawings' },
        { id: 'p1-upload-renders', name: 'Upload Renders', description: '3D Visualizations', href: '/project-management/documents/upload/renders' },
        { id: 'p1-sales-handover', name: 'Sales Handover', description: 'Sales to project team', href: '/sales/handover' },
    ],
    'phase-2': [
        { id: 'p2-drawing-verification', name: 'Drawing Verification', description: 'Verify layout vs BOQ', href: '/project-management/documents/verification' },
        { id: 'p2-boq-check', name: 'BOQ Cross-Check', description: 'Verify quantities', href: '/project-management/boq/check' },
        { id: 'p2-discrepancies', name: 'Log Discrepancies', description: 'Record mismatches', href: '/project-management/discrepancies' },
        { id: 'p2-site-visit', name: 'Schedule Site Visit', description: 'Coordinate access', href: '/project-management/site-visit/schedule' },
        { id: 'p2-measurements', name: 'Site Measurements', description: 'Capture dimensions', href: '/project-management/site-visit/measurements' },
        { id: 'p2-photos', name: 'Photo Documentation', description: 'Site photos', href: '/project-management/site-visit/photos' },
        { id: 'p2-revise-drawings', name: 'Revise Drawings', description: 'Update based on site', href: '/project-management/documents/revisions' },
        { id: 'p2-mep', name: 'Create MEP Drawings', description: 'MEP coordination', href: '/project-management/mep' },
        { id: 'p2-cabinet-marking', name: 'Cabinet Marking', description: 'Physical marking', href: '/project-management/cabinet-marking' },
        { id: 'p2-timeline', name: 'Calculate Timeline', description: 'Duration estimation', href: '/project-management/timeline' },
        { id: 'p2-supervisor', name: 'Assign Supervisor', description: 'Allocate supervisor', href: '/project-management/team/assign' },
        { id: 'p2-readiness', name: 'Site Readiness Check', description: 'Decision point', href: '/project-management/site-readiness' },
    ],
    'phase-3': [
        { id: 'p3-share', name: 'Share Documents', description: 'Share docs with technical', href: '/project-management/technical/share' },
        { id: 'p3-briefing', name: 'Layout Briefing', description: 'Conduct team briefings', href: '/project-management/technical/briefing' },
        { id: 'p3-timeline', name: 'Drawing Timeline', description: 'Calculate timelines', href: '/project-management/technical/timeline' },
        { id: 'p3-drawings', name: 'Technical Drawings', description: 'Create drawings', href: '/project-management/technical/drawings' },
        { id: 'p3-bom-acc', name: 'Accessories BOM', description: 'Fittings & hardware', href: '/project-management/technical/bom/accessories' },
        { id: 'p3-shutter-specs', name: 'Shutter Specs', description: 'Door specifications', href: '/project-management/technical/specs/shutters' },
        { id: 'p3-validation', name: 'BOM Validation', description: 'Verify completeness', href: '/project-management/technical/validation' },
    ],
    'phase-4': [
        { id: 'p4-bom-reception', name: 'BOM Reception', description: 'Receive BOMs from Technical', href: '/project-management/procurement/bom-reception' },
        { id: 'p4-stock-check', name: 'Stock Check', description: 'Check inventory availability', href: '/project-management/procurement/stock-check' },
        { id: 'p4-pr-generation', name: 'Generate PR', description: 'Create purchase requisitions', href: '/project-management/procurement/pr-generation' },
        { id: 'p4-approvals', name: 'Approvals', description: 'Approve PRs & POs', href: '/project-management/procurement/approvals' },
        { id: 'p4-po-creation', name: 'Create PO', description: 'Issue purchase orders', href: '/project-management/procurement/po-creation' },
        { id: 'p4-vendor-tracking', name: 'Vendor Tracking', description: 'Track shipments', href: '/project-management/procurement/vendor-tracking' },
        { id: 'p4-payments', name: 'Payments', description: 'Process vendor payments', href: '/project-management/procurement/payments' },
        { id: 'p4-grn', name: 'GRN Entry', description: 'Goods receipt & QC', href: '/project-management/procurement/grn' },
    ],
    'phase-5': [
        { id: 'p5-laser-cutting', name: 'Laser Cutting', description: 'Laser cutting & logo etch', href: '/project-management/production/laser-cutting' },
        { id: 'p5-bending', name: 'Bending', description: 'Bending & forming', href: '/project-management/production/bending' },
        { id: 'p5-fabrication', name: 'Fabrication', description: 'Assembly & fabrication', href: '/project-management/production/fabrication' },
        { id: 'p5-welding', name: 'Welding', description: 'Welding & joining', href: '/project-management/production/welding' },
        { id: 'p5-buffing', name: 'Buffing', description: 'Buffing & finishing', href: '/project-management/production/buffing' },
        { id: 'p5-shutter-work', name: 'Shutter Work', description: 'Glass & wood shutters', href: '/project-management/production/shutter-work' },
        { id: 'p5-trial-wall', name: 'Trial Wall', description: 'Trial installation', href: '/project-management/production/trial-wall' },
    ],
    'phase-6': [
        { id: 'p6-qc-inspection', name: 'Inspection Checklists', description: 'Quality checks', href: '/quality/inspections' },
        { id: 'p6-ncr', name: 'Non-Conformance (NCR)', description: 'Manage NCRs', href: '/quality/ncr' },
        { id: 'p6-capa', name: 'CAPA', description: 'Corrective Actions', href: '/quality/capa' },
        { id: 'p6-log-defects', name: 'Log Defects', description: 'Rework routing', href: '/quality/defects' },
        { id: 'p6-rework-loop', name: 'Rework Loop', description: 'Defect corrections', href: '/quality/rework' },
        { id: 'p6-qc-approval', name: 'QC Manager Approval', description: 'Manager approval', href: '/quality/approvals' },
        { id: 'p6-check-materials', name: 'Check Packing Materials', description: 'Material availability', href: '/packaging/materials' },
        { id: 'p6-package-products', name: 'Package Products', description: 'Packing & labeling', href: '/packaging/operations' },
        { id: 'p6-generate-shipping', name: 'Generate Shipping Bill', description: 'Bill generation', href: '/packaging/shipping-bill' },
        { id: 'p6-staging', name: 'Dispatch Staging', description: 'Ready to ship', href: '/packaging/staging' },
    ],
    'phase-7': [
        { id: 'p7-payment-check', name: 'Payment Check', description: 'Check payment status before release', href: '/finance/payment-verification' },
        { id: 'p7-billing-details', name: 'Billing to Accounts', description: 'Invoice generation and tracking', href: '/finance/billing' },
        { id: 'p7-transport-selection', name: 'Transport Selection', description: 'Choose method based on location', href: '/logistics/transport-selection' },
        { id: 'p7-site-location', name: 'Site Location Sharing', description: 'Address, contact, timing details', href: '/logistics/site-location' },
        { id: 'p7-transporter-notify', name: 'Transporter Notification', description: 'Alert with pickup details', href: '/logistics/transporter-notification' },
        { id: 'p7-loading', name: 'Loading & Documentation', description: 'Proper packing & bill generation', href: '/logistics/loading' },
        { id: 'p7-gps-tracking', name: 'GPS Tracking', description: 'Real-time delivery tracking', href: '/logistics/tracking' },
        { id: 'p7-delivery-confirm', name: 'Delivery Confirmation', description: 'Unloading and receipt sign-off', href: '/logistics/delivery-confirmation' },
        { id: 'p7-site-contact-notify', name: 'Site Contact Notification', description: 'Alert installation team', href: '/logistics/site-notification' },
    ],
    'phase-8': [
        { id: 'p8-tool-prep', name: 'Tool Prep', description: 'Tool list preparation', href: '/installation/tool-prep' },
        { id: 'p8-tool-dispatch', name: 'Tool Dispatch', description: 'Tools to site', href: '/installation/tool-dispatch' },
        { id: 'p8-team-assignment', name: 'Team Assignment', description: 'Cabinet align', href: '/installation/team-assignment' },
        { id: 'p8-cabinet-align', name: 'Cabinet Align', description: 'Trial wall & buffing', href: '/installation/cabinet-align' },
        { id: 'p8-trial-wall', name: 'Trial Wall', description: 'Accessory fix', href: '/installation/trial-wall' },
        { id: 'p8-accessory-fix', name: 'Accessory Fix', description: 'Final align', href: '/installation/accessory-fix' },
        { id: 'p8-final-align', name: 'Final Align', description: 'Photo doc', href: '/installation/final-align' },
        { id: 'p8-photo-doc', name: 'Photo Doc', description: 'Issue reporting with images', href: '/installation/photo-doc' },
        { id: 'p8-final-inspection', name: 'Final Inspection', description: 'Inspection complete', href: '/installation/final-inspection' },
        { id: 'p8-kitchen-cleaning', name: 'Kitchen Cleaning', description: 'Kitchen cleaning done', href: '/installation/kitchen-cleaning' },
        { id: 'p8-client-handover', name: 'Client Handover', description: 'E-signature', href: '/installation/handover' },
        { id: 'p8-project-closure', name: 'Project Closure', description: 'Project closure', href: '/installation/project-closure' },
    ],
};

// ============================================
// PROJECT TYPE CONFIGURATIONS
// All project types get the full 8-phase workflow by default
// Each type can have steps marked as required/optional/not_applicable
// ============================================

type StepStatusOverride = Record<string, ChecklistItemStatus>;
type PhaseConfig = { enabled: boolean; stepOverrides?: StepStatusOverride };

export const PROJECT_TYPE_CHECKLIST_CONFIG: Record<string, Record<string, PhaseConfig>> = {
    'Commercial Kitchen': {
        'phase-1': { enabled: true },
        'phase-2': { enabled: true },
        'phase-3': { enabled: true },
        'phase-4': { enabled: true },
        'phase-5': { enabled: true },
        'phase-6': { enabled: true },
        'phase-7': { enabled: true },
        'phase-8': { enabled: true },
    },
    'Cold Room': {
        'phase-1': { enabled: true },
        'phase-2': { enabled: true },
        'phase-3': { enabled: true },
        'phase-4': { enabled: true },
        'phase-5': { enabled: true, stepOverrides: { 'p5-shutter-work': 'not_applicable' } },
        'phase-6': { enabled: true },
        'phase-7': { enabled: true },
        'phase-8': { enabled: true },
    },
    'Switchgear': {
        'phase-1': { enabled: true },
        'phase-2': { enabled: true },
        'phase-3': { enabled: true },
        'phase-4': { enabled: true },
        'phase-5': { enabled: true },
        'phase-6': { enabled: true },
        'phase-7': { enabled: true },
        'phase-8': { enabled: true, stepOverrides: { 'p8-kitchen-cleaning': 'not_applicable' } },
    },
    'HVAC System': {
        'phase-1': { enabled: true },
        'phase-2': { enabled: true },
        'phase-3': { enabled: true },
        'phase-4': { enabled: true },
        'phase-5': { enabled: true },
        'phase-6': { enabled: true },
        'phase-7': { enabled: true },
        'phase-8': { enabled: true, stepOverrides: { 'p8-kitchen-cleaning': 'not_applicable' } },
    },
    'Modular Kitchen': {
        'phase-1': { enabled: true },
        'phase-2': { enabled: true },
        'phase-3': { enabled: true },
        'phase-4': { enabled: true },
        'phase-5': { enabled: true },
        'phase-6': { enabled: true },
        'phase-7': { enabled: true },
        'phase-8': { enabled: true },
    },
    'Food Processing': {
        'phase-1': { enabled: true },
        'phase-2': { enabled: true },
        'phase-3': { enabled: true },
        'phase-4': { enabled: true },
        'phase-5': { enabled: true },
        'phase-6': { enabled: true },
        'phase-7': { enabled: true },
        'phase-8': { enabled: true },
    },
};

// ============================================
// UTILITIES
// ============================================

/**
 * Generate a default checklist for a given project type
 */
export function getDefaultChecklist(projectType: string): ProjectChecklist {
    const config = PROJECT_TYPE_CHECKLIST_CONFIG[projectType] || PROJECT_TYPE_CHECKLIST_CONFIG['Commercial Kitchen'];

    const phases: ChecklistPhase[] = WORKFLOW_PHASES
        .filter(phase => config[phase.id]?.enabled !== false)
        .map(phase => {
            const phaseConfig = config[phase.id] || { enabled: true };
            const masterSteps = MASTER_CHECKLIST_STEPS[phase.id] || [];

            const steps: ChecklistStep[] = masterSteps.map((step, index) => ({
                ...step,
                order: index + 1,
                status: phaseConfig.stepOverrides?.[step.id] || 'required' as ChecklistItemStatus,
            }));

            return {
                ...phase,
                steps,
            };
        });

    return {
        phases,
        projectType,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
    };
}

/**
 * Count enabled steps in a checklist
 */
export function getChecklistStats(checklist: ProjectChecklist) {
    let totalSteps = 0;
    let requiredSteps = 0;
    let optionalSteps = 0;
    let completedSteps = 0;
    let notApplicableSteps = 0;

    checklist.phases.forEach(phase => {
        phase.steps.forEach(step => {
            totalSteps++;
            switch (step.status) {
                case 'required': requiredSteps++; break;
                case 'optional': optionalSteps++; break;
                case 'completed': completedSteps++; break;
                case 'not_applicable': notApplicableSteps++; break;
            }
        });
    });

    return {
        totalPhases: checklist.phases.length,
        totalSteps,
        requiredSteps,
        optionalSteps,
        completedSteps,
        notApplicableSteps,
        applicableSteps: totalSteps - notApplicableSteps,
    };
}

/**
 * Update checklist step status
 */
export function updateChecklistStep(
    checklist: ProjectChecklist,
    phaseId: string,
    stepId: string,
    newStatus: ChecklistItemStatus
): ProjectChecklist {
    return {
        ...checklist,
        lastModified: new Date().toISOString(),
        phases: checklist.phases.map(phase => {
            if (phase.id !== phaseId) return phase;
            return {
                ...phase,
                steps: phase.steps.map(step => {
                    if (step.id !== stepId) return step;
                    return { ...step, status: newStatus };
                }),
            };
        }),
    };
}

/**
 * Get status icon component
 */
export function getStatusIcon(status: ChecklistItemStatus) {
    switch (status) {
        case 'completed':
            return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' };
        case 'required':
            return { icon: Circle, color: 'text-blue-600', bg: 'bg-blue-100' };
        case 'optional':
            return { icon: Circle, color: 'text-gray-400', bg: 'bg-gray-100' };
        case 'not_applicable':
            return { icon: XCircle, color: 'text-gray-300', bg: 'bg-gray-50' };
        default:
            return { icon: Circle, color: 'text-gray-400', bg: 'bg-gray-100' };
    }
}

/**
 * Get human-readable status label
 */
export function getStatusLabel(status: ChecklistItemStatus): string {
    switch (status) {
        case 'completed': return 'Completed';
        case 'required': return 'Required';
        case 'optional': return 'Optional';
        case 'not_applicable': return 'N/A';
        default: return status;
    }
}

// ============================================
// SIDEBAR INTEGRATION HELPERS
// ============================================

/**
 * Check if a phase is applicable (has at least one non-N/A step)
 */
export function isPhaseApplicable(checklist: ProjectChecklist, phaseId: string): boolean {
    const phase = checklist.phases.find(p => p.id === phaseId);
    if (!phase) return true;
    return phase.steps.some(step => step.status !== 'not_applicable');
}

/**
 * Check if a specific step is applicable
 */
export function isStepApplicable(checklist: ProjectChecklist, stepId: string): boolean {
    for (const phase of checklist.phases) {
        const step = phase.steps.find(s => s.id === stepId);
        if (step) {
            return step.status !== 'not_applicable';
        }
    }
    return true;
}

/**
 * Get phase status for visual indicators in sidebar
 */
export function getPhaseWorkflowStatus(
    checklist: ProjectChecklist,
    phaseId: string
): 'pending' | 'completed' | 'not_applicable' | 'in_progress' {
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
}

/**
 * Find a step by its href (for matching with current route)
 */
export function getStepByHref(checklist: ProjectChecklist, href: string): ChecklistStep | null {
    for (const phase of checklist.phases) {
        const step = phase.steps.find(s => href.startsWith(s.href) || s.href.startsWith(href));
        if (step) return step;
    }
    return null;
}

/**
 * Get phase by its ID
 */
export function getPhaseById(checklist: ProjectChecklist, phaseId: string): ChecklistPhase | null {
    return checklist.phases.find(p => p.id === phaseId) || null;
}

/**
 * Map sidebar phase names to checklist phase IDs
 */
export const SIDEBAR_PHASE_MAPPING: Record<string, string> = {
    'Project Initiation': 'phase-1',
    'Design & Site Assessment': 'phase-2',
    'Technical Design': 'phase-3',
    'Procurement': 'phase-4',
    'Production': 'phase-5',
    'Quality & Packing': 'phase-6',
    'Logistics': 'phase-7',
    'Installation & Handover': 'phase-8',
    // Prefixed names from Sidebar
    'Phase 1: Project Initiation': 'phase-1',
    'Phase 2: Design & Site Assessment': 'phase-2',
    'Phase 3: Technical Design & BOM': 'phase-3',
    'Phase 4: Procurement': 'phase-4',
    'Phase 5: Production': 'phase-5',
    'Phase 6: Quality & Packaging': 'phase-6',
    'Phase 7: Logistics & Delivery': 'phase-7',
    'Phase 8: Installation & Handover': 'phase-8',
    // Alternative names
    'Technical Design & BOM': 'phase-3',
    'Quality & Packaging': 'phase-6',
    'Logistics & Delivery': 'phase-7',
};
