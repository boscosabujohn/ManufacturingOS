import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketStatus = 'new' | 'assigned' | 'in_progress' | 'pending_customer' | 'resolved' | 'closed' | 'reopened';
export type TicketChannel = 'email' | 'phone' | 'chat' | 'web' | 'social';
export type TicketCategory = 'technical' | 'billing' | 'sales' | 'general' | 'complaint' | 'feature_request';

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  channel: TicketChannel;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  assignedTo?: string;
  assignedToName?: string;
  teamId?: string;
  teamName?: string;
  tags: string[];
  relatedDocuments?: { type: string; id: string; number: string }[];
  slaId?: string;
  slaDueDate?: string;
  slaBreached: boolean;
  firstResponseAt?: string;
  firstResponseSLA?: boolean;
  resolutionAt?: string;
  resolutionSLA?: boolean;
  interactions: TicketInteraction[];
  attachments: TicketAttachment[];
  customFields?: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface TicketInteraction {
  id: string;
  type: 'reply' | 'note' | 'status_change' | 'assignment' | 'escalation';
  content: string;
  isPublic: boolean;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  attachments?: TicketAttachment[];
}

export interface TicketAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
}

export interface TicketAssignmentRule {
  id: string;
  name: string;
  priority: number;
  conditions: {
    field: string;
    operator: string;
    value: string | string[];
  }[];
  assignTo: {
    type: 'user' | 'team' | 'round_robin';
    ids?: string[];
  };
  isActive: boolean;
}

export interface TicketTemplate {
  id: string;
  name: string;
  category: TicketCategory;
  subject: string;
  description: string;
  defaultPriority: TicketPriority;
  defaultAssignee?: string;
  defaultTags: string[];
  isActive: boolean;
}

export interface TicketAnalytics {
  totalTickets: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byCategory: Record<string, number>;
  avgResponseTime: number;
  avgResolutionTime: number;
  slaComplianceRate: number;
  customerSatisfaction: number;
  ticketsByChannel: Record<string, number>;
  topAgents: { id: string; name: string; resolved: number; avgTime: number }[];
}

@Injectable()
export class TicketManagementService {
  private tickets: Ticket[] = [];
  private assignmentRules: TicketAssignmentRule[] = [];
  private templates: TicketTemplate[] = [];
  private ticketCounter = 10000;

  constructor() {
    this.seedMockData();
  }

  async createTicket(
    subject: string,
    description: string,
    category: TicketCategory,
    priority: TicketPriority,
    channel: TicketChannel,
    customer: { id: string; name: string; email: string; phone?: string },
    tags?: string[],
    relatedDocuments?: Ticket['relatedDocuments']
  ): Promise<Ticket> {
    const ticket: Ticket = {
      id: uuidv4(),
      ticketNumber: `TKT-${++this.ticketCounter}`,
      subject,
      description,
      category,
      priority,
      status: 'new',
      channel,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      tags: tags || [],
      relatedDocuments,
      slaBreached: false,
      interactions: [],
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Auto-assign based on rules
    const assignment = await this.findAssignment(ticket);
    if (assignment) {
      ticket.assignedTo = assignment.userId;
      ticket.assignedToName = assignment.userName;
      ticket.teamId = assignment.teamId;
      ticket.teamName = assignment.teamName;
      ticket.status = 'assigned';
    }

    this.tickets.push(ticket);
    return ticket;
  }

  private async findAssignment(ticket: Ticket): Promise<{
    userId?: string;
    userName?: string;
    teamId?: string;
    teamName?: string;
  } | null> {
    // Find matching rule
    for (const rule of this.assignmentRules.sort((a, b) => b.priority - a.priority)) {
      if (!rule.isActive) continue;

      const matches = rule.conditions.every(cond => {
        const value = ticket[cond.field as keyof Ticket];
        if (cond.operator === 'equals') return value === cond.value;
        if (cond.operator === 'in') return (cond.value as string[]).includes(value as string);
        return false;
      });

      if (matches) {
        if (rule.assignTo.type === 'user') {
          return {
            userId: rule.assignTo.ids?.[0],
            userName: `Agent ${rule.assignTo.ids?.[0]}`,
          };
        }
        if (rule.assignTo.type === 'team') {
          return {
            teamId: rule.assignTo.ids?.[0],
            teamName: `Team ${rule.assignTo.ids?.[0]}`,
          };
        }
      }
    }

    return null;
  }

  async assignTicket(ticketId: string, userId: string, userName: string): Promise<Ticket> {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error(`Ticket ${ticketId} not found`);

    ticket.assignedTo = userId;
    ticket.assignedToName = userName;
    ticket.status = 'assigned';
    ticket.updatedAt = new Date().toISOString();

    ticket.interactions.push({
      id: uuidv4(),
      type: 'assignment',
      content: `Ticket assigned to ${userName}`,
      isPublic: false,
      createdBy: 'system',
      createdByName: 'System',
      createdAt: new Date().toISOString(),
    });

    return ticket;
  }

  async addReply(
    ticketId: string,
    content: string,
    isPublic: boolean,
    createdBy: string,
    createdByName: string,
    attachments?: TicketAttachment[]
  ): Promise<Ticket> {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error(`Ticket ${ticketId} not found`);

    const interaction: TicketInteraction = {
      id: uuidv4(),
      type: 'reply',
      content,
      isPublic,
      createdBy,
      createdByName,
      createdAt: new Date().toISOString(),
      attachments,
    };

    ticket.interactions.push(interaction);

    // Track first response
    if (!ticket.firstResponseAt && isPublic && createdBy !== ticket.customerId) {
      ticket.firstResponseAt = new Date().toISOString();
    }

    if (ticket.status === 'new' || ticket.status === 'assigned') {
      ticket.status = 'in_progress';
    }

    ticket.updatedAt = new Date().toISOString();
    return ticket;
  }

  async updateStatus(ticketId: string, status: TicketStatus, updatedBy: string): Promise<Ticket> {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error(`Ticket ${ticketId} not found`);

    const previousStatus = ticket.status;
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();

    if (status === 'resolved' || status === 'closed') {
      ticket.resolutionAt = new Date().toISOString();
      if (status === 'closed') {
        ticket.closedAt = new Date().toISOString();
      }
    }

    ticket.interactions.push({
      id: uuidv4(),
      type: 'status_change',
      content: `Status changed from ${previousStatus} to ${status}`,
      isPublic: false,
      createdBy: updatedBy,
      createdByName: `Agent ${updatedBy}`,
      createdAt: new Date().toISOString(),
    });

    return ticket;
  }

  async escalateTicket(ticketId: string, reason: string, escalatedBy: string): Promise<Ticket> {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error(`Ticket ${ticketId} not found`);

    // Increase priority
    const priorities: TicketPriority[] = ['low', 'medium', 'high', 'critical'];
    const currentIndex = priorities.indexOf(ticket.priority);
    if (currentIndex < priorities.length - 1) {
      ticket.priority = priorities[currentIndex + 1];
    }

    ticket.interactions.push({
      id: uuidv4(),
      type: 'escalation',
      content: `Ticket escalated. Reason: ${reason}`,
      isPublic: false,
      createdBy: escalatedBy,
      createdByName: `Agent ${escalatedBy}`,
      createdAt: new Date().toISOString(),
    });

    ticket.updatedAt = new Date().toISOString();
    return ticket;
  }

  async getTicketsByStatus(status: TicketStatus): Promise<Ticket[]> {
    return this.tickets.filter(t => t.status === status);
  }

  async getTicketsByAssignee(userId: string): Promise<Ticket[]> {
    return this.tickets.filter(t => t.assignedTo === userId);
  }

  async getTicketsByCustomer(customerId: string): Promise<Ticket[]> {
    return this.tickets.filter(t => t.customerId === customerId);
  }

  async searchTickets(query: string): Promise<Ticket[]> {
    const lowerQuery = query.toLowerCase();
    return this.tickets.filter(t =>
      t.ticketNumber.toLowerCase().includes(lowerQuery) ||
      t.subject.toLowerCase().includes(lowerQuery) ||
      t.customerName.toLowerCase().includes(lowerQuery)
    );
  }

  async getAnalytics(dateFrom?: string, dateTo?: string): Promise<TicketAnalytics> {
    let filtered = this.tickets;

    if (dateFrom) {
      filtered = filtered.filter(t => t.createdAt >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(t => t.createdAt <= dateTo);
    }

    const byStatus: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    const ticketsByChannel: Record<string, number> = {};

    let totalResponseTime = 0;
    let responseCount = 0;
    let totalResolutionTime = 0;
    let resolutionCount = 0;
    let slaCompliant = 0;

    for (const ticket of filtered) {
      byStatus[ticket.status] = (byStatus[ticket.status] || 0) + 1;
      byPriority[ticket.priority] = (byPriority[ticket.priority] || 0) + 1;
      byCategory[ticket.category] = (byCategory[ticket.category] || 0) + 1;
      ticketsByChannel[ticket.channel] = (ticketsByChannel[ticket.channel] || 0) + 1;

      if (ticket.firstResponseAt) {
        const responseTime = new Date(ticket.firstResponseAt).getTime() - new Date(ticket.createdAt).getTime();
        totalResponseTime += responseTime;
        responseCount++;
      }

      if (ticket.resolutionAt) {
        const resolutionTime = new Date(ticket.resolutionAt).getTime() - new Date(ticket.createdAt).getTime();
        totalResolutionTime += resolutionTime;
        resolutionCount++;
      }

      if (!ticket.slaBreached) {
        slaCompliant++;
      }
    }

    return {
      totalTickets: filtered.length,
      byStatus,
      byPriority,
      byCategory,
      avgResponseTime: responseCount > 0 ? Math.round(totalResponseTime / responseCount / 60000) : 0,
      avgResolutionTime: resolutionCount > 0 ? Math.round(totalResolutionTime / resolutionCount / 60000) : 0,
      slaComplianceRate: filtered.length > 0 ? Math.round((slaCompliant / filtered.length) * 100) : 0,
      customerSatisfaction: 4.2,
      ticketsByChannel,
      topAgents: [],
    };
  }

  async getDashboard(): Promise<{
    openTickets: number;
    unassignedTickets: number;
    overdueTickets: number;
    avgResponseTime: number;
    ticketsToday: number;
    resolvedToday: number;
  }> {
    const today = new Date().toISOString().split('T')[0];

    return {
      openTickets: this.tickets.filter(t => !['resolved', 'closed'].includes(t.status)).length,
      unassignedTickets: this.tickets.filter(t => !t.assignedTo && t.status === 'new').length,
      overdueTickets: this.tickets.filter(t => t.slaBreached).length,
      avgResponseTime: 15,
      ticketsToday: this.tickets.filter(t => t.createdAt.startsWith(today)).length,
      resolvedToday: this.tickets.filter(t => t.resolutionAt?.startsWith(today)).length,
    };
  }

  private seedMockData(): void {
    // Assignment rules
    this.assignmentRules = [
      {
        id: uuidv4(),
        name: 'Technical to Tech Team',
        priority: 100,
        conditions: [
          { field: 'category', operator: 'equals', value: 'technical' },
        ],
        assignTo: { type: 'team', ids: ['tech-team'] },
        isActive: true,
      },
      {
        id: uuidv4(),
        name: 'Billing to Finance Team',
        priority: 90,
        conditions: [
          { field: 'category', operator: 'equals', value: 'billing' },
        ],
        assignTo: { type: 'team', ids: ['finance-team'] },
        isActive: true,
      },
    ];

    // Templates
    this.templates = [
      {
        id: uuidv4(),
        name: 'General Inquiry',
        category: 'general',
        subject: 'General Inquiry',
        description: '',
        defaultPriority: 'medium',
        defaultTags: ['inquiry'],
        isActive: true,
      },
    ];
  }
}
