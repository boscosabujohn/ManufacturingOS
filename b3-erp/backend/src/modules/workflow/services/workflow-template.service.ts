import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export interface WorkflowTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    type: 'sequential' | 'parallel' | 'conditional';
    steps: WorkflowTemplateStep[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface WorkflowTemplateStep {
    stepNumber: number;
    name: string;
    approverRole?: string;
    approverId?: string;
    condition?: string;
    actions?: string[];
    slaHours?: number;
}

@Injectable()
export class WorkflowTemplateService {
    // In-memory templates (in production, these would be in database)
    private templates: Map<string, WorkflowTemplate> = new Map();

    constructor() {
        this.initializeDefaultTemplates();
    }

    private initializeDefaultTemplates() {
        // Purchase Requisition Approval
        this.createTemplate({
            id: 'pr-approval',
            name: 'Purchase Requisition Approval',
            description: 'Standard approval workflow for purchase requisitions',
            category: 'procurement',
            type: 'sequential',
            isActive: true,
            steps: [
                {
                    stepNumber: 1,
                    name: 'Department Head Approval',
                    approverRole: 'DEPARTMENT_HEAD',
                    slaHours: 24,
                },
                {
                    stepNumber: 2,
                    name: 'Finance Approval',
                    approverRole: 'FINANCE_MANAGER',
                    condition: 'amount > 10000',
                    slaHours: 48,
                },
                {
                    stepNumber: 3,
                    name: 'CEO Approval',
                    approverRole: 'CEO',
                    condition: 'amount > 100000',
                    slaHours: 72,
                },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Leave Approval
        this.createTemplate({
            id: 'leave-approval',
            name: 'Leave Request Approval',
            description: 'Employee leave request workflow',
            category: 'hr',
            type: 'sequential',
            isActive: true,
            steps: [
                {
                    stepNumber: 1,
                    name: 'Manager Approval',
                    approverRole: 'MANAGER',
                    slaHours: 24,
                },
                {
                    stepNumber: 2,
                    name: 'HR Approval',
                    approverRole: 'HR_MANAGER',
                    condition: 'days > 5',
                    slaHours: 48,
                },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Sales Order Approval
        this.createTemplate({
            id: 'sales-order-approval',
            name: 'Sales Order Approval',
            description: 'Approval workflow for sales orders',
            category: 'sales',
            type: 'sequential',
            isActive: true,
            steps: [
                {
                    stepNumber: 1,
                    name: 'Sales Manager Approval',
                    approverRole: 'SALES_MANAGER',
                    slaHours: 24,
                },
                {
                    stepNumber: 2,
                    name: 'Finance Approval',
                    approverRole: 'FINANCE_MANAGER',
                    condition: 'totalAmount > 50000',
                    slaHours: 48,
                },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Project Approval
        this.createTemplate({
            id: 'project-approval',
            name: 'Project Initiation Approval',
            description: 'Multi-level project approval workflow',
            category: 'project',
            type: 'sequential',
            isActive: true,
            steps: [
                {
                    stepNumber: 1,
                    name: 'Project Manager Review',
                    approverRole: 'PROJECT_MANAGER',
                    slaHours: 48,
                },
                {
                    stepNumber: 2,
                    name: 'Technical Review',
                    approverRole: 'TECHNICAL_HEAD',
                    slaHours: 72,
                },
                {
                    stepNumber: 3,
                    name: 'Finance Review',
                    approverRole: 'FINANCE_MANAGER',
                    slaHours: 48,
                },
                {
                    stepNumber: 4,
                    name: 'Executive Approval',
                    approverRole: 'CEO',
                    condition: 'budget > 500000',
                    slaHours: 96,
                },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Emergency Spare Approval (Maker-Checker)
        this.createTemplate({
            id: 'emergency-spare-approval',
            name: 'Emergency Spare Request',
            description: 'Maker-checker workflow for emergency spare parts',
            category: 'project',
            type: 'sequential',
            isActive: true,
            steps: [
                {
                    stepNumber: 1,
                    name: 'Checker Approval',
                    approverRole: 'INVENTORY_MANAGER',
                    slaHours: 4,
                },
                {
                    stepNumber: 2,
                    name: 'Procurement Approval',
                    approverRole: 'PROCUREMENT_HEAD',
                    condition: 'urgency === "critical"',
                    slaHours: 8,
                },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    createTemplate(template: Omit<WorkflowTemplate, 'id'> & { id?: string }): WorkflowTemplate {
        const id = template.id || `template-${Date.now()}`;
        const fullTemplate: WorkflowTemplate = {
            ...template,
            id,
            createdAt: template.createdAt || new Date(),
            updatedAt: new Date(),
        };
        this.templates.set(id, fullTemplate);
        return fullTemplate;
    }

    getAllTemplates(): WorkflowTemplate[] {
        return Array.from(this.templates.values()).filter(t => t.isActive);
    }

    getTemplateById(id: string): WorkflowTemplate {
        const template = this.templates.get(id);
        if (!template) {
            throw new NotFoundException(`Workflow template ${id} not found`);
        }
        return template;
    }

    getTemplatesByCategory(category: string): WorkflowTemplate[] {
        return Array.from(this.templates.values()).filter(
            t => t.category === category && t.isActive
        );
    }

    updateTemplate(id: string, updates: Partial<WorkflowTemplate>): WorkflowTemplate {
        const template = this.getTemplateById(id);
        const updated = {
            ...template,
            ...updates,
            id, // Prevent ID change
            updatedAt: new Date(),
        };
        this.templates.set(id, updated);
        return updated;
    }

    deleteTemplate(id: string): void {
        const template = this.getTemplateById(id);
        template.isActive = false;
        template.updatedAt = new Date();
        this.templates.set(id, template);
    }

    instantiateTemplate(
        templateId: string,
        context: Record<string, any>
    ): {
        workflowType: 'sequential' | 'parallel' | 'conditional';
        steps: Array<{ approverId?: string; approverRole: string; stepNumber: number; slaHours?: number }>;
    } {
        const template = this.getTemplateById(templateId);

        // Filter steps based on conditions
        const applicableSteps = template.steps.filter(step => {
            if (!step.condition) return true;
            return this.evaluateCondition(step.condition, context);
        });

        return {
            workflowType: template.type,
            steps: applicableSteps.map(step => ({
                approverId: step.approverId,
                approverRole: step.approverRole || 'APPROVER',
                stepNumber: step.stepNumber,
                slaHours: step.slaHours,
            })),
        };
    }

    private evaluateCondition(condition: string, context: Record<string, any>): boolean {
        try {
            // Simple condition evaluation (in production, use a proper expression parser)
            // Examples: "amount > 10000", "days > 5", "urgency === 'critical'"
            const safeContext = JSON.parse(JSON.stringify(context));
            const func = new Function(...Object.keys(safeContext), `return ${condition}`);
            return func(...Object.values(safeContext));
        } catch (error) {
            console.error('Condition evaluation error:', error);
            return false;
        }
    }
}
