import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowApproval } from '../entities/workflow-approval.entity';
import { ApprovalStep } from '../entities/approval-step.entity';

export interface UserTask {
    id: string;
    taskType: 'approval' | 'action' | 'review';
    title: string;
    description: string;
    module: string; // e.g., 'sales', 'project', 'procurement'
    moduleUrl: string; // Direct link to the item requiring action
    referenceId: string; // ID of the item (order, project, PR, etc.)
    referenceNumber: string; // Human-readable number
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'in-progress' | 'completed';
    assignedTo: string; // User ID
    assignedBy: string; // User ID
    dueDate?: Date;
    slaDueDate?: Date;
    slaStatus?: 'on-track' | 'warning' | 'breached';
    createdAt: Date;
    actions: TaskAction[];
    relatedDocuments?: Document[];
    comments?: TaskComment[];
}

export interface TaskAction {
    id: string;
    label: string;
    action: 'approve' | 'reject' | 'send-back' | 'escalate' | 'custom';
    requiresComment: boolean;
    buttonClass?: string; // 'primary', 'danger', 'warning'
}

export interface TaskComment {
    id: string;
    userId: string;
    userName: string;
    comment: string;
    createdAt: Date;
}

export interface Document {
    id: string;
    name: string;
    type: string;
    url: string;
}

@Injectable()
export class UserTaskService {
    private readonly logger = new Logger(UserTaskService.name);
    private tasks: Map<string, UserTask> = new Map();

    constructor(
        @InjectRepository(WorkflowApproval)
        private approvalRepository: Repository<WorkflowApproval>,
        @InjectRepository(ApprovalStep)
        private stepRepository: Repository<ApprovalStep>
    ) { }

    async getUserInbox(userId: string, filters?: {
        status?: string;
        priority?: string;
        module?: string;
        taskType?: string;
    }): Promise<UserTask[]> {
        // Get all tasks for user from database
        const approvals = await this.approvalRepository.createQueryBuilder('approval')
            .leftJoinAndSelect('approval.steps', 'steps')
            .where('steps.approverId = :userId', { userId })
            .andWhere('steps.status = :status', { status: 'pending' })
            .getMany();

        // Convert to user tasks
        const tasks: UserTask[] = approvals.map(approval => this.convertToUserTask(approval, userId));

        // Merge withany in-memory tasks
        const allTasks = [...tasks, ...Array.from(this.tasks.values()).filter(t => t.assignedTo === userId)];

        // Apply filters
        let filtered = allTasks;
        if (filters?.status) {
            filtered = filtered.filter(t => t.status === filters.status);
        }
        if (filters?.priority) {
            filtered = filtered.filter(t => t.priority === filters.priority);
        }
        if (filters?.module) {
            filtered = filtered.filter(t => t.module === filters.module);
        }
        if (filters?.taskType) {
            filtered = filtered.filter(t => t.taskType === filters.taskType);
        }

        // Sort by priority and due date
        return filtered.sort((a, b) => {
            const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
            const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
            if (priorityDiff !== 0) return priorityDiff;

            if (a.dueDate && b.dueDate) {
                return a.dueDate.getTime() - b.dueDate.getTime();
            }
            return 0;
        });
    }

    async getTaskById(taskId: string): Promise<UserTask | null> {
        // Try in-memory first
        const memTask = this.tasks.get(taskId);
        if (memTask) return memTask;

        // Try database
        const approval = await this.approvalRepository.findOne({
            where: { id: taskId },
            relations: ['steps'],
        });

        if (!approval) return null;

        return this.convertToUserTask(approval, approval.steps[0]?.approverId);
    }

    async createTask(task: Omit<UserTask, 'id' | 'createdAt' | 'status'>): Promise<UserTask> {
        const newTask: UserTask = {
            ...task,
            id: `task-${Date.now()}`,
            status: 'pending',
            createdAt: new Date(),
        };

        this.tasks.set(newTask.id, newTask);
        this.logger.log(`Created task ${newTask.id} for user ${newTask.assignedTo}`);

        return newTask;
    }

    async updateTaskStatus(
        taskId: string,
        userId: string,
        action: string,
        comment?: string
    ): Promise<UserTask> {
        const task = await this.getTaskById(taskId);
        if (!task) {
            throw new Error(`Task ${taskId} not found`);
        }

        if (task.assignedTo !== userId) {
            throw new Error(`Task ${taskId} is not assigned to user ${userId}`);
        }

        // Update task status based on action
        if (action === 'approve') {
            task.status = 'completed';
        } else if (action === 'reject' || action === 'send-back') {
            task.status = 'completed';
        }

        // Add comment if provided
        if (comment) {
            if (!task.comments) task.comments = [];
            task.comments.push({
                id: `comment-${Date.now()}`,
                userId,
                userName: `User ${userId}`,
                comment,
                createdAt: new Date(),
            });
        }

        this.tasks.set(taskId, task);
        this.logger.log(`User ${userId} performed action ${action} on task ${taskId}`);

        return task;
    }

    async getTaskCounts(userId: string): Promise<{
        total: number;
        pending: number;
        inProgress: number;
        overdue: number;
        critical: number;
    }> {
        const tasks = await this.getUserInbox(userId);
        const now = new Date();

        return {
            total: tasks.length,
            pending: tasks.filter(t => t.status === 'pending').length,
            inProgress: tasks.filter(t => t.status === 'in-progress').length,
            overdue: tasks.filter(t => t.dueDate && t.dueDate < now).length,
            critical: tasks.filter(t => t.priority === 'critical').length,
        };
    }

    private convertToUserTask(approval: WorkflowApproval, userId: string): UserTask {
        const currentStep = approval.steps.find(s => s.approverId === userId && s.status === 'pending');

        return {
            id: approval.id,
            taskType: 'approval',
            title: `${approval.approvalType} Approval Required`,
            description: approval.description || `Please review and approve ${approval.approvalType}`,
            module: this.getModuleFromType(approval.approvalType),
            moduleUrl: this.getModuleUrl(approval.approvalType, approval.referenceId),
            referenceId: approval.referenceId,
            referenceNumber: approval.referenceId,
            priority: this.calculatePriority(approval),
            status: 'pending',
            assignedTo: userId,
            assignedBy: approval.createdBy,
            dueDate: currentStep?.decidedAt, // Would come from SLA
            createdAt: approval.createdAt,
            actions: [
                {
                    id: 'approve',
                    label: 'Approve',
                    action: 'approve',
                    requiresComment: false,
                    buttonClass: 'primary',
                },
                {
                    id: 'reject',
                    label: 'Reject',
                    action: 'reject',
                    requiresComment: true,
                    buttonClass: 'danger',
                },
                {
                    id: 'send-back',
                    label: 'Send Back',
                    action: 'send-back',
                    requiresComment: true,
                    buttonClass: 'warning',
                },
            ],
        };
    }

    private getModuleFromType(approvalType: string): string {
        const mapping: Record<string, string> = {
            'purchase-requisition': 'procurement',
            'purchase-order': 'procurement',
            'sales-order': 'sales',
            'quotation': 'sales',
            'project': 'project-management',
            'leave-request': 'hr',
            'expense-claim': 'hr',
        };
        return mapping[approvalType] || 'workflow';
    }

    private getModuleUrl(approvalType: string, referenceId: string): string {
        const urlMapping: Record<string, string> = {
            'purchase-requisition': `/procurement/requisitions/${referenceId}`,
            'purchase-order': `/procurement/orders/${referenceId}`,
            'sales-order': `/sales/orders/${referenceId}`,
            'quotation': `/sales/quotations/${referenceId}`,
            'project': `/project-management/projects/${referenceId}`,
            'leave-request': `/hr/leave/${referenceId}`,
        };
        return urlMapping[approvalType] || `/workflow/approvals/${referenceId}`;
    }

    private calculatePriority(approval: WorkflowApproval): 'low' | 'medium' | 'high' | 'critical' {
        // Simple priority logic based on approval type and age
        const hoursSinceCreation = (Date.now() - approval.createdAt.getTime()) / (1000 * 60 * 60);

        if (hoursSinceCreation > 48) return 'critical';
        if (hoursSinceCreation > 24) return 'high';
        if (approval.approvalType.includes('emergency')) return 'critical';
        return 'medium';
    }
}
