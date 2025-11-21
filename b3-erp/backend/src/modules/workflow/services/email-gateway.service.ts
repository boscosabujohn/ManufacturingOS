import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type EmailProtocol = 'imap' | 'pop3' | 'smtp' | 'exchange';
export type EmailStatus = 'unread' | 'read' | 'processed' | 'failed' | 'archived';
export type EmailDirection = 'inbound' | 'outbound';

export interface EmailAccount {
  id: string;
  name: string;
  email: string;
  protocol: EmailProtocol;
  host: string;
  port: number;
  username: string;
  password: string; // Would be encrypted in production
  useTLS: boolean;
  isActive: boolean;
  lastSyncAt?: string;
  syncIntervalMinutes: number;
  defaultFolder: string;
  processingRules: EmailProcessingRule[];
  createdAt: string;
}

export interface EmailProcessingRule {
  id: string;
  name: string;
  priority: number;
  conditions: EmailCondition[];
  actions: EmailAction[];
  isActive: boolean;
}

export interface EmailCondition {
  field: 'from' | 'to' | 'subject' | 'body' | 'has_attachment' | 'header';
  operator: 'contains' | 'not_contains' | 'equals' | 'starts_with' | 'ends_with' | 'regex';
  value: string;
  headerName?: string;
}

export interface EmailAction {
  type: 'create_ticket' | 'create_lead' | 'forward' | 'auto_reply' | 'tag' | 'move_folder' | 'webhook';
  config: Record<string, string>;
}

export interface EmailMessage {
  id: string;
  accountId: string;
  messageId: string;
  direction: EmailDirection;
  from: EmailAddress;
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  replyTo?: EmailAddress;
  subject: string;
  bodyText?: string;
  bodyHtml?: string;
  attachments: EmailAttachment[];
  headers: Record<string, string>;
  status: EmailStatus;
  processedAt?: string;
  processedAction?: string;
  relatedEntity?: { type: string; id: string };
  folder: string;
  isRead: boolean;
  isStarred: boolean;
  receivedAt: string;
  sentAt?: string;
  createdAt: string;
}

export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailAttachment {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  contentId?: string;
  isInline: boolean;
  url?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
  variables: string[];
  category: string;
  isActive: boolean;
  createdAt: string;
}

export interface EmailSendRequest {
  accountId: string;
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  subject: string;
  bodyHtml?: string;
  bodyText?: string;
  attachments?: { fileName: string; content: string; mimeType: string }[];
  replyToMessageId?: string;
  templateId?: string;
  templateVariables?: Record<string, string>;
  scheduledAt?: string;
}

export interface EmailSyncResult {
  accountId: string;
  newMessages: number;
  processedMessages: number;
  failedMessages: number;
  syncedAt: string;
  errors: string[];
}

@Injectable()
export class EmailGatewayService {
  private accounts: EmailAccount[] = [];
  private messages: EmailMessage[] = [];
  private templates: EmailTemplate[] = [];
  private outboxQueue: EmailSendRequest[] = [];

  constructor() {
    this.seedMockData();
  }

  async createAccount(account: Omit<EmailAccount, 'id' | 'createdAt'>): Promise<EmailAccount> {
    const newAccount: EmailAccount = {
      ...account,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    this.accounts.push(newAccount);
    return newAccount;
  }

  async syncAccount(accountId: string): Promise<EmailSyncResult> {
    const account = this.accounts.find(a => a.id === accountId);
    if (!account) throw new Error(`Account ${accountId} not found`);

    // Simulate email sync (would use actual IMAP/POP3 in production)
    const newMessages = Math.floor(Math.random() * 5);
    const messages: EmailMessage[] = [];

    for (let i = 0; i < newMessages; i++) {
      const message = this.generateMockEmail(account);
      messages.push(message);
      this.messages.push(message);
    }

    // Process messages through rules
    let processedCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (const message of messages) {
      try {
        await this.processMessage(account, message);
        processedCount++;
      } catch (error) {
        failedCount++;
        errors.push(`Message ${message.id}: ${error}`);
      }
    }

    account.lastSyncAt = new Date().toISOString();

    return {
      accountId,
      newMessages,
      processedMessages: processedCount,
      failedMessages: failedCount,
      syncedAt: account.lastSyncAt,
      errors,
    };
  }

  private generateMockEmail(account: EmailAccount): EmailMessage {
    const subjects = [
      'Question about order #12345',
      'Request for quote',
      'Follow up on delivery',
      'Technical support needed',
      'Invoice inquiry',
    ];

    return {
      id: uuidv4(),
      accountId: account.id,
      messageId: `<${uuidv4()}@example.com>`,
      direction: 'inbound',
      from: { email: `customer${Math.floor(Math.random() * 100)}@example.com`, name: 'Customer' },
      to: [{ email: account.email }],
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      bodyText: 'This is a test email message body.',
      bodyHtml: '<p>This is a test email message body.</p>',
      attachments: [],
      headers: {},
      status: 'unread',
      folder: 'INBOX',
      isRead: false,
      isStarred: false,
      receivedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
  }

  private async processMessage(account: EmailAccount, message: EmailMessage): Promise<void> {
    for (const rule of account.processingRules.sort((a, b) => b.priority - a.priority)) {
      if (!rule.isActive) continue;

      const matches = this.evaluateConditions(rule.conditions, message);
      if (matches) {
        await this.executeActions(rule.actions, message);
        message.status = 'processed';
        message.processedAt = new Date().toISOString();
        message.processedAction = rule.name;
        return;
      }
    }
  }

  private evaluateConditions(conditions: EmailCondition[], message: EmailMessage): boolean {
    return conditions.every(cond => {
      let value: string;
      switch (cond.field) {
        case 'from': value = message.from.email; break;
        case 'to': value = message.to.map(t => t.email).join(','); break;
        case 'subject': value = message.subject; break;
        case 'body': value = message.bodyText || message.bodyHtml || ''; break;
        case 'has_attachment': value = message.attachments.length > 0 ? 'true' : 'false'; break;
        case 'header': value = message.headers[cond.headerName || ''] || ''; break;
        default: return false;
      }

      switch (cond.operator) {
        case 'contains': return value.toLowerCase().includes(cond.value.toLowerCase());
        case 'not_contains': return !value.toLowerCase().includes(cond.value.toLowerCase());
        case 'equals': return value.toLowerCase() === cond.value.toLowerCase();
        case 'starts_with': return value.toLowerCase().startsWith(cond.value.toLowerCase());
        case 'ends_with': return value.toLowerCase().endsWith(cond.value.toLowerCase());
        case 'regex': return new RegExp(cond.value).test(value);
        default: return false;
      }
    });
  }

  private async executeActions(actions: EmailAction[], message: EmailMessage): Promise<void> {
    for (const action of actions) {
      switch (action.type) {
        case 'create_ticket':
          message.relatedEntity = {
            type: 'ticket',
            id: `TKT-${Date.now()}`,
          };
          break;
        case 'create_lead':
          message.relatedEntity = {
            type: 'lead',
            id: `LEAD-${Date.now()}`,
          };
          break;
        case 'auto_reply':
          // Would send auto-reply
          break;
        case 'move_folder':
          message.folder = action.config['folder'] || message.folder;
          break;
      }
    }
  }

  async sendEmail(request: EmailSendRequest): Promise<EmailMessage> {
    const account = this.accounts.find(a => a.id === request.accountId);
    if (!account) throw new Error(`Account ${request.accountId} not found`);

    let subject = request.subject;
    let bodyHtml = request.bodyHtml;
    let bodyText = request.bodyText;

    // Apply template if specified
    if (request.templateId) {
      const template = this.templates.find(t => t.id === request.templateId);
      if (template) {
        subject = this.applyVariables(template.subject, request.templateVariables || {});
        bodyHtml = this.applyVariables(template.bodyHtml, request.templateVariables || {});
        bodyText = template.bodyText ? this.applyVariables(template.bodyText, request.templateVariables || {}) : undefined;
      }
    }

    const message: EmailMessage = {
      id: uuidv4(),
      accountId: account.id,
      messageId: `<${uuidv4()}@${account.email.split('@')[1]}>`,
      direction: 'outbound',
      from: { email: account.email },
      to: request.to,
      cc: request.cc,
      bcc: request.bcc,
      subject,
      bodyHtml,
      bodyText,
      attachments: [],
      headers: {},
      status: 'processed',
      folder: 'Sent',
      isRead: true,
      isStarred: false,
      sentAt: new Date().toISOString(),
      receivedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    this.messages.push(message);
    return message;
  }

  private applyVariables(text: string, variables: Record<string, string>): string {
    let result = text;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
  }

  async getMessages(accountId: string, folder?: string, status?: EmailStatus): Promise<EmailMessage[]> {
    let filtered = this.messages.filter(m => m.accountId === accountId);
    if (folder) {
      filtered = filtered.filter(m => m.folder === folder);
    }
    if (status) {
      filtered = filtered.filter(m => m.status === status);
    }
    return filtered.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
  }

  async markAsRead(messageId: string): Promise<EmailMessage> {
    const message = this.messages.find(m => m.id === messageId);
    if (!message) throw new Error(`Message ${messageId} not found`);

    message.isRead = true;
    message.status = 'read';
    return message;
  }

  async createTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt'>): Promise<EmailTemplate> {
    const newTemplate: EmailTemplate = {
      ...template,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    this.templates.push(newTemplate);
    return newTemplate;
  }

  async getEmailStats(accountId: string): Promise<{
    totalMessages: number;
    unread: number;
    processed: number;
    failed: number;
    sent: number;
    byFolder: Record<string, number>;
  }> {
    const accountMessages = this.messages.filter(m => m.accountId === accountId);
    const byFolder: Record<string, number> = {};

    for (const msg of accountMessages) {
      byFolder[msg.folder] = (byFolder[msg.folder] || 0) + 1;
    }

    return {
      totalMessages: accountMessages.length,
      unread: accountMessages.filter(m => !m.isRead).length,
      processed: accountMessages.filter(m => m.status === 'processed').length,
      failed: accountMessages.filter(m => m.status === 'failed').length,
      sent: accountMessages.filter(m => m.direction === 'outbound').length,
      byFolder,
    };
  }

  private seedMockData(): void {
    // Sample email account
    this.accounts = [
      {
        id: uuidv4(),
        name: 'Support Inbox',
        email: 'support@company.com',
        protocol: 'imap',
        host: 'imap.company.com',
        port: 993,
        username: 'support@company.com',
        password: '****',
        useTLS: true,
        isActive: true,
        syncIntervalMinutes: 5,
        defaultFolder: 'INBOX',
        processingRules: [
          {
            id: uuidv4(),
            name: 'Create Ticket from Support Email',
            priority: 100,
            conditions: [
              { field: 'subject', operator: 'contains', value: 'support' },
            ],
            actions: [
              { type: 'create_ticket', config: { category: 'technical', priority: 'medium' } },
            ],
            isActive: true,
          },
          {
            id: uuidv4(),
            name: 'Create Lead from Inquiry',
            priority: 90,
            conditions: [
              { field: 'subject', operator: 'contains', value: 'quote' },
            ],
            actions: [
              { type: 'create_lead', config: { source: 'email' } },
            ],
            isActive: true,
          },
        ],
        createdAt: new Date().toISOString(),
      },
    ];

    // Sample templates
    this.templates = [
      {
        id: uuidv4(),
        name: 'Ticket Created',
        subject: 'Your support ticket {{ticketNumber}} has been created',
        bodyHtml: '<p>Dear {{customerName}},</p><p>Your support ticket has been created with number {{ticketNumber}}.</p><p>We will get back to you within 24 hours.</p>',
        variables: ['customerName', 'ticketNumber'],
        category: 'support',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];
  }
}
