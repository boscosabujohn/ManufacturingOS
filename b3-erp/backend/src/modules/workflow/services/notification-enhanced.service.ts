import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface NotificationPayload {
    userId: string;
    type: 'task-assigned' | 'task-due' | 'task-overdue' | 'approval-required' | 'approval-granted' | 'approval-rejected';
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    actionUrl?: string;
    metadata?: Record<string, any>;
}

export interface UserNotification {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    priority: string;
    actionUrl?: string;
    read: boolean;
    createdAt: Date;
    readAt?: Date;
}

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);
    private notifications: Map<string, UserNotification> = new Map();

    constructor(private eventEmitter: EventEmitter2) { }

    async sendNotification(payload: NotificationPayload): Promise<UserNotification> {
        const notification: UserNotification = {
            id: `notif-${Date.now()}`,
            userId: payload.userId,
            type: payload.type,
            title: payload.title,
            message: payload.message,
            priority: payload.priority,
            actionUrl: payload.actionUrl,
            read: false,
            createdAt: new Date(),
        };

        this.notifications.set(notification.id, notification);

        // Emit real-time event for WebSocket/SSE
        this.eventEmitter.emit('notification.created', notification);

        this.logger.log(`Sent ${payload.type} notification to user ${payload.userId}`);

        // In production, also send email, SMS, etc.
        if (payload.priority === 'critical') {
            this.logger.warn(`CRITICAL notification for user ${payload.userId}: ${payload.title}`);
        }

        return notification;
    }

    async notifyTaskAssigned(
        userId: string,
        taskTitle: string,
        taskUrl: string,
        assignedBy: string,
        dueDate?: Date
    ): Promise<void> {
        await this.sendNotification({
            userId,
            type: 'task-assigned',
            title: 'New Task Assigned',
            message: `You have been assigned: ${taskTitle}${dueDate ? ` (Due: ${dueDate.toLocaleDateString()})` : ''}`,
            priority: 'medium',
            actionUrl: taskUrl,
            metadata: { assignedBy, dueDate },
        });
    }

    async notifyApprovalRequired(
        userId: string,
        approvalType: string,
        referenceNumber: string,
        actionUrl: string
    ): Promise<void> {
        await this.sendNotification({
            userId,
            type: 'approval-required',
            title: 'Approval Required',
            message: `${approvalType} ${referenceNumber} requires your approval`,
            priority: 'high',
            actionUrl,
        });
    }

    async notifyTaskDue(userId: string, taskTitle: string, taskUrl: string, hoursRemaining: number): Promise<void> {
        await this.sendNotification({
            userId,
            type: 'task-due',
            title: 'Task Due Soon',
            message: `"${taskTitle}" is due in ${hoursRemaining} hours`,
            priority: hoursRemaining < 4 ? 'high' : 'medium',
            actionUrl: taskUrl,
        });
    }

    async notifyTaskOverdue(userId: string, taskTitle: string, taskUrl: string): Promise<void> {
        await this.sendNotification({
            userId,
            type: 'task-overdue',
            title: 'Task Overdue',
            message: `"${taskTitle}" is now overdue`,
            priority: 'critical',
            actionUrl: taskUrl,
        });
    }

    async getUserNotifications(userId: string, unreadOnly: boolean = false): Promise<UserNotification[]> {
        const userNotifications = Array.from(this.notifications.values())
            .filter(n => n.userId === userId);

        if (unreadOnly) {
            return userNotifications.filter(n => !n.read);
        }

        return userNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async markAsRead(notificationId: string): Promise<void> {
        const notification = this.notifications.get(notificationId);
        if (notification) {
            notification.read = true;
            notification.readAt = new Date();
            this.notifications.set(notificationId, notification);
        }
    }

    async markAllAsRead(userId: string): Promise<void> {
        const userNotifications = Array.from(this.notifications.values())
            .filter(n => n.userId === userId && !n.read);

        userNotifications.forEach(n => {
            n.read = true;
            n.readAt = new Date();
            this.notifications.set(n.id, n);
        });

        this.logger.log(`Marked ${userNotifications.length} notifications as read for user ${userId}`);
    }

    async getUnreadCount(userId: string): Promise<number> {
        return Array.from(this.notifications.values())
            .filter(n => n.userId === userId && !n.read)
            .length;
    }
}
