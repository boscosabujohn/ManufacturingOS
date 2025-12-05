import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { EmailService } from './email.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface CreateNotificationDto {
    userId: string;
    type: string;
    title: string;
    message: string;
    metadata?: Record<string, any>;
    priority?: string;
    actionUrl?: string;
    sendEmail?: boolean;
}

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
        private emailService: EmailService,
        private eventEmitter: EventEmitter2,
    ) { }

    /**
     * Create a new notification
     */
    async createNotification(dto: CreateNotificationDto): Promise<Notification> {
        const notification = this.notificationRepository.create({
            userId: dto.userId,
            type: dto.type,
            title: dto.title,
            message: dto.message,
            metadata: dto.metadata || {},
            priority: dto.priority || 'info',
            actionUrl: dto.actionUrl,
        });

        const saved = await this.notificationRepository.save(notification);

        // Emit event for real-time updates
        this.eventEmitter.emit('notification.created', {
            userId: dto.userId,
            notification: saved,
        });

        // Send email if requested
        if (dto.sendEmail) {
            await this.emailService.sendNotificationEmail(saved);
        }

        return saved;
    }

    /**
     * Get unread notifications for a user
     */
    async getUnreadNotifications(userId: string): Promise<Notification[]> {
        return this.notificationRepository.find({
            where: { userId, isRead: false },
            order: { createdAt: 'DESC' },
            take: 50,
        });
    }

    /**
     * Get all notifications for a user with pagination
     */
    async getUserNotifications(
        userId: string,
        page: number = 1,
        limit: number = 20,
    ): Promise<{ notifications: Notification[]; total: number }> {
        const [notifications, total] = await this.notificationRepository.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return { notifications, total };
    }

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId: string, userId: string): Promise<boolean> {
        const result = await this.notificationRepository.update(
            { id: notificationId, userId },
            { isRead: true },
        );

        if (result.affected > 0) {
            this.eventEmitter.emit('notification.read', { userId, notificationId });
            return true;
        }
        return false;
    }

    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(userId: string): Promise<number> {
        const result = await this.notificationRepository.update(
            { userId, isRead: false },
            { isRead: true },
        );

        this.eventEmitter.emit('notifications.all_read', { userId });
        return result.affected || 0;
    }

    /**
     * Get unread count
     */
    async getUnreadCount(userId: string): Promise<number> {
        return this.notificationRepository.count({
            where: { userId, isRead: false },
        });
    }

    /**
     * Delete old read notifications
     */
    async cleanupOldNotifications(daysOld: number = 30): Promise<number> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const result = await this.notificationRepository.delete({
            isRead: true,
            createdAt: { $lt: cutoffDate } as any,
        });

        return result.affected || 0;
    }

    /**
     * Helper methods for specific notification types
     */
    async notifyApprovalAssigned(
        userId: string,
        approvalId: string,
        workflowName: string,
        entityId: string,
    ) {
        return this.createNotification({
            userId,
            type: 'approval_assigned',
            title: 'New Approval Request',
            message: `You have a new ${workflowName} approval request for ${entityId}`,
            metadata: { approvalId, workflowName, entityId },
            priority: 'warning',
            actionUrl: `/workflow/approvals?id=${approvalId}`,
            sendEmail: true,
        });
    }

    async notifyApprovalApproved(
        userId: string,
        approvalId: string,
        approverName: string,
        workflowName: string,
    ) {
        return this.createNotification({
            userId,
            type: 'approval_approved',
            title: 'Approval Granted',
            message: `${approverName} approved your ${workflowName} request`,
            metadata: { approvalId, approverName, workflowName },
            priority: 'info',
            actionUrl: `/workflow/approvals?id=${approvalId}`,
            sendEmail: false,
        });
    }

    async notifyApprovalRejected(
        userId: string,
        approvalId: string,
        approverName: string,
        workflowName: string,
        reason: string,
    ) {
        return this.createNotification({
            userId,
            type: 'approval_rejected',
            title: 'Approval Rejected',
            message: `${approverName} rejected your ${workflowName} request: ${reason}`,
            metadata: { approvalId, approverName, workflowName, reason },
            priority: 'urgent',
            actionUrl: `/workflow/approvals?id=${approvalId}`,
            sendEmail: true,
        });
    }

    async notifySLAApproaching(
        userId: string,
        approvalId: string,
        workflowName: string,
        hoursRemaining: number,
    ) {
        return this.createNotification({
            userId,
            type: 'sla_approaching',
            title: 'SLA Deadline Approaching',
            message: `${workflowName} approval due in ${hoursRemaining} hours`,
            metadata: { approvalId, workflowName, hoursRemaining },
            priority: 'warning',
            actionUrl: `/workflow/approvals?id=${approvalId}`,
            sendEmail: true,
        });
    }

    async notifySLABreached(
        userId: string,
        approvalId: string,
        workflowName: string,
    ) {
        return this.createNotification({
            userId,
            type: 'sla_breached',
            title: 'SLA Deadline Breached',
            message: `${workflowName} approval is overdue`,
            metadata: { approvalId, workflowName },
            priority: 'urgent',
            actionUrl: `/workflow/approvals?id=${approvalId}`,
            sendEmail: true,
        });
    }

    async notifyEscalation(
        userId: string,
        approvalId: string,
        workflowName: string,
        originalApprover: string,
    ) {
        return this.createNotification({
            userId,
            type: 'escalation',
            title: 'Approval Escalated to You',
            message: `${workflowName} escalated from ${originalApprover} due to SLA breach`,
            metadata: { approvalId, workflowName, originalApprover },
            priority: 'urgent',
            actionUrl: `/workflow/approvals?id=${approvalId}`,
            sendEmail: true,
        });
    }
}
