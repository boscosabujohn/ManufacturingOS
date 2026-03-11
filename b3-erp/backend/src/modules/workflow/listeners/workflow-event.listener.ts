import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationService } from '../services/notification.service';
import { SLAService } from '../services/sla.service';
import { WorkflowEventType, ApprovalEventPayload, WorkOrderEventPayload } from '../events/event-types';
import { WorkflowHistory, HistoryEventType } from '../entities/workflow-history.entity';

@Injectable()
export class WorkflowEventListener {
    private readonly logger = new Logger(WorkflowEventListener.name);

    constructor(
        private readonly notificationService: NotificationService,
        private readonly slaService: SLAService,
        @InjectRepository(WorkflowHistory)
        private historyRepository: Repository<WorkflowHistory>,
        @InjectQueue('workflow')
        private workflowQueue: Queue,
    ) { }

    @OnEvent('workflow.event')
    async handleAllEvents(payload: { type: string; payload: any }) {
        // Persist event to history
        try {
            const historyEntry = this.historyRepository.create({
                eventType: payload.type as HistoryEventType, // Cast or map if needed
                message: `Event ${payload.type} occurred`,
                eventData: payload.payload,
                userId: payload.payload.userId,
                createdAt: new Date(),
                // Map other fields if available in payload
                instanceId: payload.payload.instanceId, // Assuming payload has instanceId
            });

            await this.historyRepository.save(historyEntry);
        } catch (error) {
            this.logger.error(`Failed to persist event ${payload.type}: ${error.message} `, error.stack);
        }
    }

    @OnEvent('workflow.phase.changed')
    async handlePhaseChange(payload: any) {
        this.logger.log(`Phase changed for project ${payload.projectId}: ${payload.fromPhase} -> ${payload.toPhase} `);

        // Example: Send notification to project manager
        await this.notificationService.notifyUser({
            userId: 'project-manager-id', // This should be dynamic
            title: 'Project Phase Changed',
            message: `Project ${payload.projectId} has moved to phase ${payload.toPhase} `,
            priority: 'normal',
            data: payload,
        });
    }

    @OnEvent(WorkflowEventType.ORDER_CREATED)
    async handleOrderCreated(payload: any) {
        this.logger.log(`Order created: ${payload.orderId} `);
        // Trigger initial workflow steps for the order
    }

    @OnEvent(WorkflowEventType.APPROVAL_REQUIRED)
    async handleApprovalRequired(payload: ApprovalEventPayload) {
        this.logger.log(`Approval required for ${payload.entityType} ${payload.entityId}`);

        // Start SLA tracking (default 24 hours for now)
        this.slaService.startSLATracking(payload.approvalId, payload.currentLevel, 24);

        // Notify approvers
        for (const userId of payload.requiredApprovers) {
            await this.notificationService.notifyApprovalAssigned(
                userId,
                payload.approvalId,
                payload.entityType,
                payload.entityId
            );
        }
    }

    @OnEvent(WorkflowEventType.APPROVAL_GRANTED)
    async handleApprovalGranted(payload: ApprovalEventPayload) {
        this.logger.log(`Approval granted for ${payload.entityType} ${payload.entityId}`);

        // Stop SLA tracking
        this.slaService.stopSLATracking(payload.approvalId, payload.currentLevel);

        // Notify requester
        await this.notificationService.notifyApprovalApproved(
            payload.userId, // This is the approver, we need requesterId in payload usually
            payload.approvalId,
            'Approver', // Should be dynamic
            payload.entityType
        );
    }

    @OnEvent(WorkflowEventType.APPROVAL_REJECTED)
    async handleApprovalRejected(payload: ApprovalEventPayload) {
        this.logger.log(`Approval rejected for ${payload.entityType} ${payload.entityId}`);

        // Stop SLA tracking
        this.slaService.stopSLATracking(payload.approvalId, payload.currentLevel);

        // Notify requester
        await this.notificationService.notifyApprovalRejected(
            payload.userId,
            payload.approvalId,
            'Approver',
            payload.entityType,
            payload.comments || 'No reason provided'
        );
    }

    @OnEvent(WorkflowEventType.WORK_ORDER_COMPLETED)
    async handleWorkOrderCompleted(payload: WorkOrderEventPayload) {
        this.logger.log(`Work Order completed: ${payload.workOrderNumber}`);

        // Enqueue Finished Goods Receipt job
        await this.workflowQueue.add('receive-finished-goods', {
            workOrderId: payload.workOrderId,
            workOrderNumber: payload.workOrderNumber,
            itemId: payload.itemId,
            itemName: payload.itemName,
            quantity: payload.quantity,
            userId: payload.userId,
        });

        this.logger.log(`Enqueued receive-finished-goods job for WO ${payload.workOrderNumber}`);
    }

    // Add more handlers as needed
}
