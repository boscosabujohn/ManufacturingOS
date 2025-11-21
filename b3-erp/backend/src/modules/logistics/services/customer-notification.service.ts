import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type NotificationChannel = 'sms' | 'email' | 'whatsapp' | 'push' | 'in_app';
export type NotificationType =
  | 'order_confirmation'
  | 'shipment_created'
  | 'out_for_delivery'
  | 'delivery_completed'
  | 'delivery_failed'
  | 'delivery_rescheduled'
  | 'eta_update'
  | 'feedback_request'
  | 'custom';
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'read';

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  channel: NotificationChannel;
  subject?: string;
  body: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
}

export interface NotificationRequest {
  id: string;
  notificationNumber: string;
  type: NotificationType;
  channel: NotificationChannel;
  templateId?: string;
  recipient: {
    customerId: string;
    customerName: string;
    email?: string;
    phone?: string;
    whatsappNumber?: string;
  };
  subject?: string;
  body: string;
  variables?: Record<string, string>;
  relatedDocument?: {
    type: 'order' | 'shipment' | 'delivery' | 'return';
    id: string;
    number: string;
  };
  status: NotificationStatus;
  scheduledTime?: string;
  sentTime?: string;
  deliveredTime?: string;
  readTime?: string;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
  createdAt: string;
}

export interface NotificationPreference {
  customerId: string;
  channels: {
    sms: boolean;
    email: boolean;
    whatsapp: boolean;
    push: boolean;
  };
  notificationTypes: {
    orderUpdates: boolean;
    deliveryUpdates: boolean;
    promotions: boolean;
    feedbackRequests: boolean;
  };
  quietHours?: {
    start: string;
    end: string;
  };
}

export interface BulkNotificationRequest {
  id: string;
  name: string;
  type: NotificationType;
  channel: NotificationChannel;
  templateId: string;
  recipients: string[];
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  scheduledTime?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface NotificationAnalytics {
  totalSent: number;
  deliveryRate: number;
  readRate: number;
  byChannel: Record<NotificationChannel, { sent: number; delivered: number; failed: number }>;
  byType: Record<string, number>;
  avgDeliveryTime: number;
  topFailureReasons: { reason: string; count: number }[];
}

@Injectable()
export class CustomerNotificationService {
  private templates: NotificationTemplate[] = [];
  private notifications: NotificationRequest[] = [];
  private preferences: NotificationPreference[] = [];
  private bulkRequests: BulkNotificationRequest[] = [];
  private notificationCounter = 1000;

  constructor() {
    this.seedMockData();
  }

  async sendNotification(
    type: NotificationType,
    channel: NotificationChannel,
    recipient: NotificationRequest['recipient'],
    variables: Record<string, string>,
    relatedDocument?: NotificationRequest['relatedDocument']
  ): Promise<NotificationRequest> {
    // Check customer preferences
    const preference = this.preferences.find(p => p.customerId === recipient.customerId);
    if (preference && !preference.channels[channel]) {
      throw new Error(`Customer has disabled ${channel} notifications`);
    }

    // Get template
    const template = this.templates.find(t => t.type === type && t.channel === channel && t.isActive);
    if (!template) {
      throw new Error(`No active template found for ${type} via ${channel}`);
    }

    // Replace variables in template
    let body = template.body;
    let subject = template.subject;
    for (const [key, value] of Object.entries(variables)) {
      body = body.replace(new RegExp(`{{${key}}}`, 'g'), value);
      if (subject) {
        subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
    }

    const notification: NotificationRequest = {
      id: uuidv4(),
      notificationNumber: `NOTIF-${++this.notificationCounter}`,
      type,
      channel,
      templateId: template.id,
      recipient,
      subject,
      body,
      variables,
      relatedDocument,
      status: 'pending',
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date().toISOString(),
    };

    this.notifications.push(notification);

    // Simulate sending
    await this.processNotification(notification);

    return notification;
  }

  private async processNotification(notification: NotificationRequest): Promise<void> {
    // Simulate API call to SMS/Email/WhatsApp gateway
    notification.sentTime = new Date().toISOString();
    notification.status = 'sent';

    // Simulate delivery (would be webhook in production)
    setTimeout(() => {
      notification.status = 'delivered';
      notification.deliveredTime = new Date().toISOString();
    }, 1000);
  }

  async sendDeliveryUpdate(
    deliveryId: string,
    deliveryNumber: string,
    customerId: string,
    customerName: string,
    customerContact: { email?: string; phone?: string; whatsapp?: string },
    updateType: 'out_for_delivery' | 'delivery_completed' | 'delivery_failed' | 'eta_update',
    additionalInfo: Record<string, string>
  ): Promise<NotificationRequest[]> {
    const sentNotifications: NotificationRequest[] = [];
    const preference = this.preferences.find(p => p.customerId === customerId);

    const variables = {
      customerName,
      deliveryNumber,
      ...additionalInfo,
    };

    const channels: NotificationChannel[] = [];
    if (customerContact.email && (!preference || preference.channels.email)) {
      channels.push('email');
    }
    if (customerContact.phone && (!preference || preference.channels.sms)) {
      channels.push('sms');
    }
    if (customerContact.whatsapp && (!preference || preference.channels.whatsapp)) {
      channels.push('whatsapp');
    }

    for (const channel of channels) {
      try {
        const notification = await this.sendNotification(
          updateType,
          channel,
          {
            customerId,
            customerName,
            email: customerContact.email,
            phone: customerContact.phone,
            whatsappNumber: customerContact.whatsapp,
          },
          variables,
          { type: 'delivery', id: deliveryId, number: deliveryNumber }
        );
        sentNotifications.push(notification);
      } catch {
        // Log error but continue with other channels
      }
    }

    return sentNotifications;
  }

  async scheduleNotification(
    type: NotificationType,
    channel: NotificationChannel,
    recipient: NotificationRequest['recipient'],
    variables: Record<string, string>,
    scheduledTime: string
  ): Promise<NotificationRequest> {
    const template = this.templates.find(t => t.type === type && t.channel === channel && t.isActive);
    if (!template) {
      throw new Error(`No active template found for ${type} via ${channel}`);
    }

    let body = template.body;
    let subject = template.subject;
    for (const [key, value] of Object.entries(variables)) {
      body = body.replace(new RegExp(`{{${key}}}`, 'g'), value);
      if (subject) {
        subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
    }

    const notification: NotificationRequest = {
      id: uuidv4(),
      notificationNumber: `NOTIF-${++this.notificationCounter}`,
      type,
      channel,
      templateId: template.id,
      recipient,
      subject,
      body,
      variables,
      status: 'pending',
      scheduledTime,
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date().toISOString(),
    };

    this.notifications.push(notification);
    return notification;
  }

  async createBulkNotification(
    name: string,
    type: NotificationType,
    channel: NotificationChannel,
    templateId: string,
    recipientIds: string[]
  ): Promise<BulkNotificationRequest> {
    const bulk: BulkNotificationRequest = {
      id: uuidv4(),
      name,
      type,
      channel,
      templateId,
      recipients: recipientIds,
      totalRecipients: recipientIds.length,
      sentCount: 0,
      deliveredCount: 0,
      failedCount: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.bulkRequests.push(bulk);
    return bulk;
  }

  async updatePreferences(
    customerId: string,
    preferences: Partial<NotificationPreference>
  ): Promise<NotificationPreference> {
    let existing = this.preferences.find(p => p.customerId === customerId);

    if (!existing) {
      existing = {
        customerId,
        channels: { sms: true, email: true, whatsapp: true, push: true },
        notificationTypes: {
          orderUpdates: true,
          deliveryUpdates: true,
          promotions: false,
          feedbackRequests: true,
        },
      };
      this.preferences.push(existing);
    }

    if (preferences.channels) {
      existing.channels = { ...existing.channels, ...preferences.channels };
    }
    if (preferences.notificationTypes) {
      existing.notificationTypes = { ...existing.notificationTypes, ...preferences.notificationTypes };
    }
    if (preferences.quietHours) {
      existing.quietHours = preferences.quietHours;
    }

    return existing;
  }

  async getNotificationHistory(customerId: string): Promise<NotificationRequest[]> {
    return this.notifications.filter(n => n.recipient.customerId === customerId);
  }

  async getNotificationAnalytics(dateFrom?: string, dateTo?: string): Promise<NotificationAnalytics> {
    let filtered = this.notifications;

    if (dateFrom) {
      filtered = filtered.filter(n => n.createdAt >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(n => n.createdAt <= dateTo);
    }

    const byChannel: Record<NotificationChannel, { sent: number; delivered: number; failed: number }> = {
      sms: { sent: 0, delivered: 0, failed: 0 },
      email: { sent: 0, delivered: 0, failed: 0 },
      whatsapp: { sent: 0, delivered: 0, failed: 0 },
      push: { sent: 0, delivered: 0, failed: 0 },
      in_app: { sent: 0, delivered: 0, failed: 0 },
    };

    const byType: Record<string, number> = {};
    const failureReasons: Record<string, number> = {};
    let deliveredCount = 0;
    let readCount = 0;
    let totalDeliveryTime = 0;

    for (const notif of filtered) {
      byChannel[notif.channel].sent++;
      byType[notif.type] = (byType[notif.type] || 0) + 1;

      if (notif.status === 'delivered' || notif.status === 'read') {
        byChannel[notif.channel].delivered++;
        deliveredCount++;

        if (notif.sentTime && notif.deliveredTime) {
          const time = new Date(notif.deliveredTime).getTime() - new Date(notif.sentTime).getTime();
          totalDeliveryTime += time;
        }
      }

      if (notif.status === 'read') {
        readCount++;
      }

      if (notif.status === 'failed') {
        byChannel[notif.channel].failed++;
        const reason = notif.failureReason || 'Unknown';
        failureReasons[reason] = (failureReasons[reason] || 0) + 1;
      }
    }

    const topFailureReasons = Object.entries(failureReasons)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalSent: filtered.length,
      deliveryRate: filtered.length > 0 ? Math.round((deliveredCount / filtered.length) * 100) : 0,
      readRate: deliveredCount > 0 ? Math.round((readCount / deliveredCount) * 100) : 0,
      byChannel,
      byType,
      avgDeliveryTime: deliveredCount > 0 ? Math.round(totalDeliveryTime / deliveredCount / 1000) : 0,
      topFailureReasons,
    };
  }

  async getTemplates(): Promise<NotificationTemplate[]> {
    return this.templates;
  }

  async createTemplate(template: Omit<NotificationTemplate, 'id' | 'createdAt'>): Promise<NotificationTemplate> {
    const newTemplate: NotificationTemplate = {
      ...template,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    this.templates.push(newTemplate);
    return newTemplate;
  }

  private seedMockData(): void {
    // Notification templates
    this.templates = [
      {
        id: uuidv4(),
        name: 'Order Confirmation Email',
        type: 'order_confirmation',
        channel: 'email',
        subject: 'Order Confirmed - {{orderNumber}}',
        body: 'Dear {{customerName}},\n\nYour order {{orderNumber}} has been confirmed.\n\nOrder Total: {{orderTotal}}\nEstimated Delivery: {{estimatedDelivery}}\n\nThank you for your order!',
        variables: ['customerName', 'orderNumber', 'orderTotal', 'estimatedDelivery'],
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Out for Delivery SMS',
        type: 'out_for_delivery',
        channel: 'sms',
        body: 'Your order {{orderNumber}} is out for delivery. Expected by {{eta}}. Track: {{trackingLink}}',
        variables: ['orderNumber', 'eta', 'trackingLink'],
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Out for Delivery WhatsApp',
        type: 'out_for_delivery',
        channel: 'whatsapp',
        body: 'Hi {{customerName}}! 🚚\n\nYour order {{orderNumber}} is out for delivery!\n\n📍 Track your delivery: {{trackingLink}}\n⏰ Expected: {{eta}}\n\nDriver: {{driverName}}\nContact: {{driverPhone}}',
        variables: ['customerName', 'orderNumber', 'trackingLink', 'eta', 'driverName', 'driverPhone'],
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Delivery Completed SMS',
        type: 'delivery_completed',
        channel: 'sms',
        body: 'Your order {{orderNumber}} has been delivered. Thank you for choosing us! Rate your experience: {{feedbackLink}}',
        variables: ['orderNumber', 'feedbackLink'],
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Delivery Failed SMS',
        type: 'delivery_failed',
        channel: 'sms',
        body: 'Delivery attempt failed for order {{orderNumber}}. Reason: {{failureReason}}. We will retry tomorrow. Reschedule: {{rescheduleLink}}',
        variables: ['orderNumber', 'failureReason', 'rescheduleLink'],
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'ETA Update SMS',
        type: 'eta_update',
        channel: 'sms',
        body: 'Update: Your order {{orderNumber}} will arrive by {{newEta}} (was {{oldEta}}). Reason: {{reason}}',
        variables: ['orderNumber', 'newEta', 'oldEta', 'reason'],
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];
  }
}
