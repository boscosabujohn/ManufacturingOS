import {
    ApprovalRequest,
    ApprovalHistory,
    ApprovalStatus,
    ApprovalAction,
    ApprovalPriority,
    UserTask,
    TaskType,
    TaskStatus,
    SLAStatus,
    ApprovalChain,
    ApprovalLevel
} from '../../src/modules/approvals/entities';

export class WorkflowFactory {
    private static requestCounter = 0;
    private static historyCounter = 0;
    private static taskCounter = 0;
    private static chainCounter = 0;
    private static levelCounter = 0;

    static createApprovalRequest(overrides: Partial<ApprovalRequest> = {}): ApprovalRequest {
        this.requestCounter++;
        const request = new ApprovalRequest();
        request.id = overrides.id || `req-uuid-${this.requestCounter}`;
        request.title = overrides.title || `Approval Request ${this.requestCounter}`;
        request.description = overrides.description || 'Test Description';
        request.entityType = overrides.entityType || 'purchase_order';
        request.entityId = overrides.entityId || 'po-1';
        request.referenceNumber = overrides.referenceNumber || `REF-${this.requestCounter}`;
        request.amount = overrides.amount || 1000;
        request.status = overrides.status || ApprovalStatus.PENDING;
        request.priority = overrides.priority || ApprovalPriority.MEDIUM;
        request.currentLevel = overrides.currentLevel || 1;
        request.totalLevels = overrides.totalLevels || 3;
        request.chainId = overrides.chainId || 'chain-1';
        request.requestedBy = overrides.requestedBy || 'user-1';

        request.deadline = overrides.deadline || new Date();

        return Object.assign(request, overrides);
    }

    static createApprovalChain(overrides: Partial<ApprovalChain> = {}): ApprovalChain {
        this.chainCounter++;
        const chain = new ApprovalChain();
        chain.id = overrides.id || `chain-uuid-${this.chainCounter}`;
        chain.name = overrides.name || `Chain ${this.chainCounter}`;
        chain.entityType = overrides.entityType || 'purchase_order';
        chain.isActive = overrides.isActive !== undefined ? overrides.isActive : true;
        chain.levels = overrides.levels || [];

        return Object.assign(chain, overrides);
    }

    static createApprovalLevel(overrides: Partial<ApprovalLevel> = {}): ApprovalLevel {
        this.levelCounter++;
        const level = new ApprovalLevel();
        level.id = overrides.id || `level-uuid-${this.levelCounter}`;
        level.sequence = overrides.sequence || 1;
        level.approverType = overrides.approverType || 'role';
        level.approverIds = overrides.approverIds || ['manager-1'];
        level.requiredCount = overrides.requiredCount || 1;
        level.slaHours = overrides.slaHours || 24;

        return Object.assign(level, overrides);
    }

    static createApprovalHistory(overrides: Partial<ApprovalHistory> = {}): ApprovalHistory {
        this.historyCounter++;
        const history = new ApprovalHistory();
        history.id = overrides.id || `hist-uuid-${this.historyCounter}`;
        history.requestId = overrides.requestId || 'req-1';
        history.level = overrides.level || 1;
        history.approverId = overrides.approverId || 'user-1';
        history.action = overrides.action || ApprovalAction.APPROVED;
        history.timestamp = overrides.timestamp || new Date();

        return Object.assign(history, overrides);
    }

    static createUserTask(overrides: Partial<UserTask> = {}): UserTask {
        this.taskCounter++;
        const task = new UserTask();
        task.id = overrides.id || `task-uuid-${this.taskCounter}`;
        task.userId = overrides.userId || 'user-1';
        task.taskType = overrides.taskType || TaskType.APPROVAL;
        task.status = overrides.status || TaskStatus.PENDING;

        return Object.assign(task, overrides);
    }

    static resetCounters() {
        this.requestCounter = 0;
        this.historyCounter = 0;
        this.taskCounter = 0;
        this.chainCounter = 0;
        this.levelCounter = 0;
    }
}
