import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationService } from '../services/notification.service';
import { WorkflowEventType } from '../events/event-types';
import { WorkflowHistory, HistoryEventType } from '../entities/workflow-history.entity';

@Injectable()
export class WorkflowEventListener {
    private readonly logger = new Logger(WorkflowEventListener.name);

    constructor(
        private readonly notificationService: NotificationService,
        @InjectRepository(WorkflowHistory)
        private historyRepository: Repository<WorkflowHistory>,
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

    @OnEvent(WorkflowEventType.INSPECTION_FAILED)
    async handleInspectionFailed(payload: any) {
        this.logger.log(`Inspection failed for ${payload.inspectionId}`);
        // Trigger NCR creation or alert quality manager
        await this.notificationService.notifyUser({
            userId: 'quality-manager-id',
            title: 'Inspection Failed',
            message: `Inspection ${payload.inspectionId} failed.Please review.`,
            priority: 'high',
            data: payload,
        });
    }

    // Add more handlers as needed
}
