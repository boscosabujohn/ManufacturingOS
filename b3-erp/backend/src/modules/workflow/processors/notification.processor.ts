import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { NotificationService } from '../../notifications/services/notification.service';
import { EmailService } from '../../notifications/services/email.service';

/**
 * NotificationProcessor — Sprint 3.2
 * Implements real processing of BullMQ notification queue jobs.
 * Covers: in-app storage, email dispatch, team broadcasts, and scheduled delivery.
 */
@Processor('notifications')
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly emailService: EmailService,
  ) { }

  /**
   * Send notification to all members of a team
   * Job payload: { teamName, members: string[], notification: { userId, type, title, message, priority, actionUrl } }
   */
  @Process('send-team-notification')
  async sendTeamNotification(job: Job): Promise<void> {
    const { teamName, members, notification } = job.data;
    this.logger.log(`Sending notification to team "${teamName}" (${members.length} members): ${notification.title}`);

    const results = await Promise.allSettled(
      members.map((userId: string) =>
        this.notificationService.createNotification({
          ...notification,
          userId,
        }),
      ),
    );

    const failed = results.filter((r) => r.status === 'rejected');
    if (failed.length > 0) {
      this.logger.warn(`${failed.length}/${members.length} team notifications failed for team "${teamName}"`);
    } else {
      this.logger.log(`Team notification delivered to all ${members.length} members of "${teamName}"`);
    }
  }

  /**
   * Send notification to a single user and persist as in-app notification
   * Job payload: { userId, type, title, message, priority, actionUrl, sendEmail }
   */
  @Process('send-user-notification')
  async sendUserNotification(job: Job): Promise<void> {
    const { userId, type, title, message, priority, actionUrl, sendEmail } = job.data;
    this.logger.log(`Sending notification to user ${userId}: "${title}"`);

    try {
      await this.notificationService.createNotification({
        userId,
        type: type || 'info',
        title,
        message,
        priority,
        actionUrl,
        sendEmail: sendEmail ?? false,
      });

      this.logger.log(`Notification delivered to user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to deliver notification to user ${userId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Create an in-app notification and optionally emit a WebSocket event
   * Job payload: { userId, title, message, priority, data, actionUrl }
   */
  @Process('create-in-app-notification')
  async createInAppNotification(job: Job): Promise<void> {
    const { userId, title, message, priority, data, actionUrl } = job.data;
    this.logger.log(`Creating in-app notification for user ${userId}: "${title}"`);

    try {
      const notification = await this.notificationService.createNotification({
        userId,
        type: 'info',
        title,
        message,
        priority: priority || 'info',
        actionUrl,
        metadata: data || {},
      });

      // notification.created event is emitted inside NotificationService via EventEmitter2,
      // so WebSocket gateway (Sprint 3.2.2) can subscribe to it without coupling here.
      this.logger.log(`In-app notification ${notification.id} created for user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to create in-app notification: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Send a transactional email directly
   * Job payload: { recipients: string[], subject: string, body: string, data?: any }
   */
  @Process('send-email')
  async sendEmail(job: Job): Promise<void> {
    const { recipients, subject, body } = job.data;
    this.logger.log(`Sending email to ${recipients.length} recipient(s): "${subject}"`);

    try {
      // Build a synthetic Notification object suitable for the email template renderer
      const syntheticNotification = {
        id: `email-${Date.now()}`,
        userId: 'system',
        type: 'email',
        title: subject,
        message: body,
        priority: 'info',
        actionUrl: null,
        metadata: {},
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;

      const results = await Promise.allSettled(
        recipients.map(() => this.emailService.sendNotificationEmail(syntheticNotification)),
      );

      const failed = results.filter((r) => r.status === 'rejected').length;
      this.logger.log(
        `Email "${subject}" delivered to ${recipients.length - failed}/${recipients.length} recipients`,
      );

      if (failed > 0) {
        throw new Error(`${failed} of ${recipients.length} emails failed to deliver`);
      }
    } catch (error) {
      this.logger.error(`Failed to send email "${subject}": ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Send SMS via external provider (Twilio)
   * Job payload: { phoneNumbers: string[], message: string, data?: any }
   */
  @Process('send-sms')
  async sendSMS(job: Job): Promise<void> {
    const { phoneNumbers, message } = job.data;
    this.logger.log(`Sending SMS to ${phoneNumbers.length} number(s)`);

    // SMS integration placeholder — wire Twilio client here when TWILIO_ACCOUNT_SID env var is set
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    if (!twilioAccountSid) {
      this.logger.warn('TWILIO_ACCOUNT_SID not configured, skipping SMS delivery');
      return;
    }

    // TODO (Sprint 5): Replace with Twilio SDK call
    this.logger.log(`[STUB] Would send SMS to ${phoneNumbers.length} numbers: "${message}"`);
  }

  /**
   * Send push notification via Firebase FCM
   * Job payload: { userIds: string[], title: string, message: string, data?: any }
   */
  @Process('send-push')
  async sendPush(job: Job): Promise<void> {
    const { userIds, title, message } = job.data;
    this.logger.log(`Sending push notification to ${userIds.length} user(s): "${title}"`);

    const fcmServerKey = process.env.FCM_SERVER_KEY;
    if (!fcmServerKey) {
      this.logger.warn('FCM_SERVER_KEY not configured, skipping push notification');
      return;
    }

    // TODO (Sprint 5): Replace with Firebase Admin SDK call
    this.logger.log(`[STUB] Would send push to ${userIds.length} users: "${title}" — ${message}`);
  }

  /**
   * Deliver a previously enqueued delayed/scheduled notification
   * Job payload: { userId, title, message, data, actionUrl }
   */
  @Process('send-scheduled-notification')
  async sendScheduledNotification(job: Job): Promise<void> {
    const { userId, title, message, actionUrl } = job.data;
    this.logger.log(`Delivering scheduled notification to user ${userId}: "${title}"`);

    try {
      await this.notificationService.createNotification({
        userId,
        type: 'reminder',
        title,
        message,
        actionUrl,
        priority: 'info',
      });
      this.logger.log(`Scheduled notification delivered to user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to deliver scheduled notification: ${error.message}`, error.stack);
      throw error;
    }
  }
}
