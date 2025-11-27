import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationTemplate } from '../entities/notification-template.entity';
import { NotificationPreference } from '../entities/notification-preference.entity';
import {
  WorkflowEventType,
  NotificationEventPayload,
} from '../events/event-types';

export interface TeamNotification {
  title: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  data?: Record<string, any>;
  scheduledAt?: Date;
}

export interface UserNotification extends TeamNotification {
  userId: string;
}

// Team definitions - in production, these would come from database
const TEAM_MEMBERS: Record<string, string[]> = {
  sales: ['sales_manager', 'sales_rep_1', 'sales_rep_2'],
  production: ['production_manager', 'production_supervisor'],
  production_planning: ['planning_manager', 'planner_1'],
  shop_floor: ['shop_floor_supervisor', 'operator_lead'],
  warehouse: ['warehouse_manager', 'warehouse_clerk'],
  procurement: ['procurement_manager', 'buyer_1', 'buyer_2'],
  quality: ['quality_manager', 'qc_inspector_1', 'qc_inspector_2'],
  finance: ['finance_manager', 'accountant_1'],
  logistics: ['logistics_manager', 'dispatcher'],
  management: ['ceo', 'coo', 'cfo'],
  hr: ['hr_manager'],
};

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectQueue('notifications') private readonly notificationQueue: Queue,
    @InjectRepository(NotificationTemplate)
    private templateRepository: Repository<NotificationTemplate>,
    @InjectRepository(NotificationPreference)
    private preferenceRepository: Repository<NotificationPreference>,
  ) { }

  /**
   * Send notification to all members of a team
   */
  async notifyTeam(teamName: string, notification: TeamNotification): Promise<void> {
    const members = TEAM_MEMBERS[teamName] || [];

    if (members.length === 0) {
      this.logger.warn(`No members found for team: ${teamName}`);
      return;
    }

    this.logger.log(`Notifying team ${teamName}: ${notification.title}`);

    // Queue notifications for all team members
    await this.notificationQueue.add('send-team-notification', {
      teamName,
      members,
      notification,
    });

    // Also add to in-app notifications
    for (const member of members) {
      await this.notifyUser({
        userId: member,
        ...notification,
      });
    }
  }

  /**
   * Send notification to a specific user
   */
  async notifyUser(notification: UserNotification): Promise<void> {
    // Check preferences
    const preferences = await this.preferenceRepository.find({
      where: { userId: notification.userId },
    });

    // Default to enabled if no preference set
    const inAppEnabled = preferences.find(p => p.channel === 'in_app')?.enabled ?? true;

    if (inAppEnabled) {
      this.logger.log(`Notifying user ${notification.userId}: ${notification.title}`);

      await this.notificationQueue.add('create-in-app-notification', {
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        priority: notification.priority,
        data: notification.data,
        scheduledAt: notification.scheduledAt,
      });
    }

    // Check other channels (email, sms, push) and send if enabled
    // This logic would be expanded based on how we map 'notification' to specific channels
    // For now, we assume 'notifyUser' primarily targets in-app, and specific methods are used for others
  }

  /**
   * Send notification to multiple users
   */
  async notifyUsers(userIds: string[], notification: TeamNotification): Promise<void> {
    this.logger.log(`Notifying ${userIds.length} users: ${notification.title}`);

    for (const userId of userIds) {
      await this.notifyUser({
        ...notification,
        userId,
      });
    }
  }

  /**
   * Send templated notification
   */
  async sendTemplatedNotification(
    userId: string,
    templateCode: string,
    data: Record<string, any>,
    channels: ('email' | 'sms' | 'push' | 'in_app')[] = ['in_app'],
  ): Promise<void> {
    const preferences = await this.preferenceRepository.find({
      where: { userId },
    });

    for (const channel of channels) {
      // Check if channel is enabled for user
      const pref = preferences.find(p => p.channel === channel);
      if (pref && !pref.enabled) continue;

      const template = await this.templateRepository.findOne({
        where: { code: templateCode, channel, isActive: true },
      });

      if (!template) {
        this.logger.warn(`Template ${templateCode} not found for channel ${channel}`);
        continue;
      }

      const subject = this.compileTemplate(template.subjectTemplate, data);
      const body = this.compileTemplate(template.bodyTemplate, data);

      switch (channel) {
        case 'email':
          await this.sendEmail([userId], subject, body, data); // Assuming userId is email or we fetch email
          break;
        case 'sms':
          await this.sendSMS([userId], body, data); // Assuming userId maps to phone
          break;
        case 'push':
          await this.sendPush([userId], subject, body, data);
          break;
        case 'in_app':
          await this.notifyUser({
            userId,
            title: subject || 'Notification',
            message: body,
            priority: 'normal',
            data,
          });
          break;
      }
    }
  }

  private compileTemplate(template: string, data: Record<string, any>): string {
    if (!template) return '';
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match;
    });
  }

  /**
   * Send email notification
   */
  async sendEmail(
    recipients: string[],
    subject: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<void> {
    this.logger.log(`Sending email to ${recipients.length} recipients: ${subject}`);

    await this.notificationQueue.add('send-email', {
      recipients,
      subject,
      body,
      data,
    });
  }

  /**
   * Send SMS notification
   */
  async sendSMS(
    phoneNumbers: string[],
    message: string,
    data?: Record<string, any>,
  ): Promise<void> {
    this.logger.log(`Sending SMS to ${phoneNumbers.length} numbers`);

    await this.notificationQueue.add('send-sms', {
      phoneNumbers,
      message,
      data,
    });
  }

  /**
   * Send push notification
   */
  async sendPush(
    userIds: string[],
    title: string,
    message: string,
    data?: Record<string, any>,
  ): Promise<void> {
    this.logger.log(`Sending push notification to ${userIds.length} users: ${title}`);

    await this.notificationQueue.add('send-push', {
      userIds,
      title,
      message,
      data,
    });
  }

  /**
   * Handle notification event from event bus
   */
  @OnEvent(WorkflowEventType.NOTIFICATION_SEND)
  async handleNotificationEvent(payload: NotificationEventPayload): Promise<void> {
    this.logger.log(`Handling notification event: ${payload.subject}`);

    switch (payload.type) {
      case 'email':
        await this.sendEmail(payload.recipients, payload.subject, payload.message, payload.data);
        break;
      case 'sms':
        await this.sendSMS(payload.recipients, payload.message, payload.data);
        break;
      case 'push':
        await this.sendPush(payload.recipients, payload.subject, payload.message, payload.data);
        break;
      case 'in_app':
        await this.notifyUsers(payload.recipients, {
          title: payload.subject,
          message: payload.message,
          priority: payload.priority,
          data: payload.data,
        });
        break;
      default:
        this.logger.warn(`Unknown notification type: ${payload.type}`);
    }
  }

  /**
   * Schedule a reminder notification
   */
  async scheduleReminder(
    userId: string,
    title: string,
    message: string,
    scheduledAt: Date,
    data?: Record<string, any>,
  ): Promise<void> {
    const delay = scheduledAt.getTime() - Date.now();

    if (delay <= 0) {
      this.logger.warn(`Scheduled time is in the past, sending immediately`);
      await this.notifyUser({
        userId,
        title,
        message,
        priority: 'normal',
        data,
      });
      return;
    }

    await this.notificationQueue.add(
      'send-scheduled-notification',
      {
        userId,
        title,
        message,
        data,
      },
      { delay },
    );

    this.logger.log(`Scheduled notification for ${userId} at ${scheduledAt}`);
  }

  /**
   * Send alert for critical business events
   */
  async sendAlert(
    alertType: 'error' | 'warning' | 'critical',
    title: string,
    message: string,
    affectedTeams: string[],
    data?: Record<string, any>,
  ): Promise<void> {
    const priority = alertType === 'critical' ? 'urgent' : alertType === 'error' ? 'high' : 'normal';

    for (const team of affectedTeams) {
      await this.notifyTeam(team, {
        title: `[${alertType.toUpperCase()}] ${title}`,
        message,
        priority,
        data,
      });
    }

    // Always notify management for critical alerts
    if (alertType === 'critical') {
      await this.notifyTeam('management', {
        title: `[CRITICAL] ${title}`,
        message,
        priority: 'urgent',
        data,
      });
    }
  }
}

