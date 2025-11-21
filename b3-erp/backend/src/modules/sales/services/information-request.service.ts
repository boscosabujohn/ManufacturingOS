import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type RFIStatus = 'received' | 'assigned' | 'in_progress' | 'pending_approval' | 'responded' | 'closed' | 'cancelled';
export type RFIPriority = 'low' | 'normal' | 'high' | 'urgent';
export type QuestionCategory = 'technical' | 'commercial' | 'delivery' | 'quality' | 'compliance' | 'general';

export interface RFIQuestion {
  id: string;
  questionNumber: number;
  category: QuestionCategory;
  question: string;
  context?: string;
  attachments?: string[];
  assignedToId?: string;
  assignedToName?: string;
  status: 'pending' | 'assigned' | 'answered' | 'approved';
  response?: string;
  respondedAt?: string;
  respondedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface RFIDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface RFICommunication {
  id: string;
  type: 'email_received' | 'email_sent' | 'call' | 'meeting' | 'internal_note';
  subject: string;
  content: string;
  from: string;
  to: string[];
  cc?: string[];
  date: string;
  attachments?: string[];
}

export interface InformationRequest {
  id: string;
  rfiNumber: string;
  status: RFIStatus;
  priority: RFIPriority;

  // Source
  source: 'email' | 'portal' | 'phone' | 'meeting' | 'rfp';
  sourceReference?: string; // email ID, portal ticket #, etc.

  // Customer Info
  customerId?: string;
  customerName: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  companyName?: string;

  // RFI Details
  title: string;
  description?: string;
  questions: RFIQuestion[];
  documents: RFIDocument[];

  // Dates & SLA
  receivedDate: string;
  dueDate: string;
  respondedDate?: string;
  closedDate?: string;
  slaHours: number;
  slaStatus: 'within_sla' | 'at_risk' | 'breached';

  // Assignment
  assignedToId?: string;
  assignedToName?: string;
  teamId?: string;
  teamName?: string;

  // Response
  responseDocument?: string;
  responseSummary?: string;

  // Related
  relatedRFPId?: string;
  relatedQuoteId?: string;
  leadId?: string;

  // Communication
  communications: RFICommunication[];

  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;

  // Tags & Notes
  tags?: string[];
  internalNotes?: string;
}

export interface RFIStatistics {
  total: number;
  byStatus: Record<RFIStatus, number>;
  byPriority: Record<RFIPriority, number>;
  byCategory: Record<QuestionCategory, number>;
  averageResponseTime: number; // hours
  slaCompliance: number; // percentage
  openRFIs: number;
  overdueRFIs: number;
}

@Injectable()
export class InformationRequestService {
  private informationRequests: InformationRequest[] = [];

  // SLA configuration (hours)
  private readonly slaByPriority: Record<RFIPriority, number> = {
    low: 72,
    normal: 48,
    high: 24,
    urgent: 8,
  };

  constructor() {
    this.seedMockData();
  }

  async create(createDto: Partial<InformationRequest>): Promise<InformationRequest> {
    const rfiNumber = await this.generateRFINumber();
    const priority = createDto.priority || 'normal';

    const rfi: InformationRequest = {
      id: uuidv4(),
      rfiNumber,
      status: 'received',
      priority,
      source: createDto.source || 'email',
      customerName: createDto.customerName || '',
      contactPerson: createDto.contactPerson || '',
      contactEmail: createDto.contactEmail || '',
      title: createDto.title || '',
      questions: [],
      documents: [],
      receivedDate: new Date().toISOString(),
      dueDate: this.calculateDueDate(priority),
      slaHours: this.slaByPriority[priority],
      slaStatus: 'within_sla',
      communications: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: createDto.createdBy || 'system',
      updatedBy: createDto.updatedBy || 'system',
      ...createDto,
    };

    // Auto-assign question numbers
    rfi.questions.forEach((q, index) => {
      if (!q.id) q.id = uuidv4();
      q.questionNumber = index + 1;
      if (!q.status) q.status = 'pending';
    });

    this.informationRequests.push(rfi);

    return rfi;
  }

  async findOne(id: string): Promise<InformationRequest> {
    const rfi = this.informationRequests.find(r => r.id === id);
    if (!rfi) {
      throw new NotFoundException(`RFI ${id} not found`);
    }

    // Update SLA status
    rfi.slaStatus = this.calculateSLAStatus(rfi);

    return rfi;
  }

  async findAll(filters?: {
    status?: RFIStatus;
    priority?: RFIPriority;
    customerId?: string;
    assignedToId?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<InformationRequest[]> {
    let result = [...this.informationRequests];

    if (filters?.status) {
      result = result.filter(r => r.status === filters.status);
    }
    if (filters?.priority) {
      result = result.filter(r => r.priority === filters.priority);
    }
    if (filters?.customerId) {
      result = result.filter(r => r.customerId === filters.customerId);
    }
    if (filters?.assignedToId) {
      result = result.filter(r => r.assignedToId === filters.assignedToId);
    }
    if (filters?.fromDate) {
      result = result.filter(r => r.receivedDate >= filters.fromDate!);
    }
    if (filters?.toDate) {
      result = result.filter(r => r.receivedDate <= filters.toDate!);
    }

    // Update SLA status for all results
    result.forEach(rfi => {
      rfi.slaStatus = this.calculateSLAStatus(rfi);
    });

    return result.sort((a, b) =>
      new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime()
    );
  }

  async assignRFI(
    id: string,
    assignedToId: string,
    assignedToName: string,
    assignedBy: string
  ): Promise<InformationRequest> {
    const rfi = await this.findOne(id);

    rfi.assignedToId = assignedToId;
    rfi.assignedToName = assignedToName;
    rfi.status = 'assigned';
    rfi.updatedAt = new Date().toISOString();
    rfi.updatedBy = assignedBy;

    // Add internal note
    rfi.communications.push({
      id: uuidv4(),
      type: 'internal_note',
      subject: 'RFI Assigned',
      content: `RFI assigned to ${assignedToName}`,
      from: assignedBy,
      to: [assignedToId],
      date: new Date().toISOString(),
    });

    return rfi;
  }

  async assignQuestion(
    rfiId: string,
    questionId: string,
    assignedToId: string,
    assignedToName: string
  ): Promise<RFIQuestion> {
    const rfi = await this.findOne(rfiId);
    const question = rfi.questions.find(q => q.id === questionId);

    if (!question) {
      throw new NotFoundException(`Question ${questionId} not found`);
    }

    question.assignedToId = assignedToId;
    question.assignedToName = assignedToName;
    question.status = 'assigned';

    rfi.updatedAt = new Date().toISOString();

    // Check if all questions are assigned - update RFI status
    if (rfi.questions.every(q => q.status !== 'pending')) {
      rfi.status = 'in_progress';
    }

    return question;
  }

  async answerQuestion(
    rfiId: string,
    questionId: string,
    response: string,
    respondedBy: string
  ): Promise<RFIQuestion> {
    const rfi = await this.findOne(rfiId);
    const question = rfi.questions.find(q => q.id === questionId);

    if (!question) {
      throw new NotFoundException(`Question ${questionId} not found`);
    }

    question.response = response;
    question.respondedAt = new Date().toISOString();
    question.respondedBy = respondedBy;
    question.status = 'answered';

    rfi.updatedAt = new Date().toISOString();

    return question;
  }

  async approveResponse(
    rfiId: string,
    questionId: string,
    approvedBy: string
  ): Promise<RFIQuestion> {
    const rfi = await this.findOne(rfiId);
    const question = rfi.questions.find(q => q.id === questionId);

    if (!question) {
      throw new NotFoundException(`Question ${questionId} not found`);
    }

    if (question.status !== 'answered') {
      throw new BadRequestException('Question must be answered before approval');
    }

    question.approvedAt = new Date().toISOString();
    question.approvedBy = approvedBy;
    question.status = 'approved';

    rfi.updatedAt = new Date().toISOString();

    // Check if all questions are approved
    if (rfi.questions.every(q => q.status === 'approved')) {
      rfi.status = 'pending_approval';
    }

    return question;
  }

  async submitResponse(
    rfiId: string,
    responseSummary: string,
    responseDocument: string,
    submittedBy: string
  ): Promise<InformationRequest> {
    const rfi = await this.findOne(rfiId);

    // Validate all questions are approved
    const unapprovedQuestions = rfi.questions.filter(q => q.status !== 'approved');
    if (unapprovedQuestions.length > 0) {
      throw new BadRequestException(
        `${unapprovedQuestions.length} question(s) pending approval`
      );
    }

    rfi.responseSummary = responseSummary;
    rfi.responseDocument = responseDocument;
    rfi.respondedDate = new Date().toISOString();
    rfi.status = 'responded';
    rfi.updatedAt = new Date().toISOString();
    rfi.updatedBy = submittedBy;

    return rfi;
  }

  async closeRFI(id: string, closedBy: string, notes?: string): Promise<InformationRequest> {
    const rfi = await this.findOne(id);

    rfi.status = 'closed';
    rfi.closedDate = new Date().toISOString();
    rfi.updatedAt = new Date().toISOString();
    rfi.updatedBy = closedBy;

    if (notes) {
      rfi.communications.push({
        id: uuidv4(),
        type: 'internal_note',
        subject: 'RFI Closed',
        content: notes,
        from: closedBy,
        to: [],
        date: new Date().toISOString(),
      });
    }

    return rfi;
  }

  async addCommunication(
    rfiId: string,
    communication: Partial<RFICommunication>
  ): Promise<RFICommunication> {
    const rfi = await this.findOne(rfiId);

    const newCommunication: RFICommunication = {
      id: uuidv4(),
      type: communication.type || 'email_sent',
      subject: communication.subject || '',
      content: communication.content || '',
      from: communication.from || '',
      to: communication.to || [],
      cc: communication.cc,
      date: communication.date || new Date().toISOString(),
      attachments: communication.attachments,
    };

    rfi.communications.push(newCommunication);
    rfi.updatedAt = new Date().toISOString();

    return newCommunication;
  }

  async addDocument(
    rfiId: string,
    document: Partial<RFIDocument>
  ): Promise<RFIDocument> {
    const rfi = await this.findOne(rfiId);

    const newDocument: RFIDocument = {
      id: uuidv4(),
      name: document.name || '',
      type: document.type || 'application/pdf',
      size: document.size || 0,
      url: document.url || '',
      uploadedAt: new Date().toISOString(),
      uploadedBy: document.uploadedBy || 'system',
    };

    rfi.documents.push(newDocument);
    rfi.updatedAt = new Date().toISOString();

    return newDocument;
  }

  async addQuestion(
    rfiId: string,
    question: Partial<RFIQuestion>
  ): Promise<RFIQuestion> {
    const rfi = await this.findOne(rfiId);

    const newQuestion: RFIQuestion = {
      id: uuidv4(),
      questionNumber: rfi.questions.length + 1,
      category: question.category || 'general',
      question: question.question || '',
      context: question.context,
      status: 'pending',
    };

    rfi.questions.push(newQuestion);
    rfi.updatedAt = new Date().toISOString();

    return newQuestion;
  }

  async getOverdueRFIs(): Promise<InformationRequest[]> {
    const now = new Date();
    return this.informationRequests.filter(rfi => {
      if (['responded', 'closed', 'cancelled'].includes(rfi.status)) {
        return false;
      }
      return new Date(rfi.dueDate) < now;
    });
  }

  async getAtRiskRFIs(): Promise<InformationRequest[]> {
    const now = new Date();
    return this.informationRequests.filter(rfi => {
      if (['responded', 'closed', 'cancelled'].includes(rfi.status)) {
        return false;
      }
      const dueDate = new Date(rfi.dueDate);
      const hoursRemaining = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursRemaining > 0 && hoursRemaining < 8; // Less than 8 hours remaining
    });
  }

  async getStatistics(): Promise<RFIStatistics> {
    const byStatus: Record<RFIStatus, number> = {
      received: 0,
      assigned: 0,
      in_progress: 0,
      pending_approval: 0,
      responded: 0,
      closed: 0,
      cancelled: 0,
    };

    const byPriority: Record<RFIPriority, number> = {
      low: 0,
      normal: 0,
      high: 0,
      urgent: 0,
    };

    const byCategory: Record<QuestionCategory, number> = {
      technical: 0,
      commercial: 0,
      delivery: 0,
      quality: 0,
      compliance: 0,
      general: 0,
    };

    let totalResponseTime = 0;
    let respondedCount = 0;
    let withinSLACount = 0;
    let openCount = 0;
    let overdueCount = 0;

    const now = new Date();

    for (const rfi of this.informationRequests) {
      byStatus[rfi.status]++;
      byPriority[rfi.priority]++;

      for (const question of rfi.questions) {
        byCategory[question.category]++;
      }

      if (['received', 'assigned', 'in_progress', 'pending_approval'].includes(rfi.status)) {
        openCount++;
        if (new Date(rfi.dueDate) < now) {
          overdueCount++;
        }
      }

      if (rfi.respondedDate) {
        const responseTime = (
          new Date(rfi.respondedDate).getTime() - new Date(rfi.receivedDate).getTime()
        ) / (1000 * 60 * 60);
        totalResponseTime += responseTime;
        respondedCount++;

        if (responseTime <= rfi.slaHours) {
          withinSLACount++;
        }
      }
    }

    return {
      total: this.informationRequests.length,
      byStatus,
      byPriority,
      byCategory,
      averageResponseTime: respondedCount > 0
        ? Math.round(totalResponseTime / respondedCount)
        : 0,
      slaCompliance: respondedCount > 0
        ? Math.round((withinSLACount / respondedCount) * 100)
        : 100,
      openRFIs: openCount,
      overdueRFIs: overdueCount,
    };
  }

  async getPendingByUser(userId: string): Promise<{
    assignedRFIs: InformationRequest[];
    assignedQuestions: Array<{ rfi: InformationRequest; question: RFIQuestion }>;
  }> {
    const assignedRFIs: InformationRequest[] = [];
    const assignedQuestions: Array<{ rfi: InformationRequest; question: RFIQuestion }> = [];

    for (const rfi of this.informationRequests) {
      if (rfi.assignedToId === userId && !['responded', 'closed', 'cancelled'].includes(rfi.status)) {
        assignedRFIs.push(rfi);
      }

      for (const question of rfi.questions) {
        if (question.assignedToId === userId && question.status === 'assigned') {
          assignedQuestions.push({ rfi, question });
        }
      }
    }

    return { assignedRFIs, assignedQuestions };
  }

  async convertToRFP(rfiId: string): Promise<string> {
    const rfi = await this.findOne(rfiId);

    // In a real implementation, this would create an RFP
    // For now, return a mock RFP ID
    const rfpId = uuidv4();

    rfi.relatedRFPId = rfpId;
    rfi.updatedAt = new Date().toISOString();

    rfi.communications.push({
      id: uuidv4(),
      type: 'internal_note',
      subject: 'Converted to RFP',
      content: `RFI converted to RFP ${rfpId}`,
      from: 'system',
      to: [],
      date: new Date().toISOString(),
    });

    return rfpId;
  }

  private calculateDueDate(priority: RFIPriority): string {
    const now = new Date();
    const hours = this.slaByPriority[priority];
    now.setHours(now.getHours() + hours);
    return now.toISOString();
  }

  private calculateSLAStatus(rfi: InformationRequest): 'within_sla' | 'at_risk' | 'breached' {
    if (['responded', 'closed', 'cancelled'].includes(rfi.status)) {
      // Check if was within SLA when responded
      if (rfi.respondedDate) {
        const responseTime = (
          new Date(rfi.respondedDate).getTime() - new Date(rfi.receivedDate).getTime()
        ) / (1000 * 60 * 60);
        return responseTime <= rfi.slaHours ? 'within_sla' : 'breached';
      }
      return 'within_sla';
    }

    const now = new Date();
    const dueDate = new Date(rfi.dueDate);
    const hoursRemaining = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursRemaining < 0) {
      return 'breached';
    } else if (hoursRemaining < 8) {
      return 'at_risk';
    }
    return 'within_sla';
  }

  private async generateRFINumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const sequence = String(this.informationRequests.length + 1).padStart(4, '0');
    return `RFI-${year}${month}-${sequence}`;
  }

  private seedMockData(): void {
    this.create({
      source: 'email',
      customerId: 'cust-001',
      customerName: 'Acme Manufacturing',
      contactPerson: 'Rajesh Kumar',
      contactEmail: 'rajesh.kumar@acme.com',
      contactPhone: '+91-9876543210',
      title: 'Technical specifications for Industrial Motor',
      description: 'Customer requesting detailed technical specifications and pricing for bulk motor order',
      priority: 'high',
      questions: [
        {
          id: uuidv4(),
          questionNumber: 1,
          category: 'technical',
          question: 'What is the maximum RPM rating for the 5HP motor?',
          status: 'pending',
        },
        {
          id: uuidv4(),
          questionNumber: 2,
          category: 'technical',
          question: 'Is the motor suitable for continuous duty operation?',
          status: 'pending',
        },
        {
          id: uuidv4(),
          questionNumber: 3,
          category: 'commercial',
          question: 'What are the volume discounts for orders above 50 units?',
          status: 'pending',
        },
        {
          id: uuidv4(),
          questionNumber: 4,
          category: 'delivery',
          question: 'What is the typical lead time for 100 units?',
          status: 'pending',
        },
      ],
      communications: [
        {
          id: uuidv4(),
          type: 'email_received',
          subject: 'RFI - Motor Specifications',
          content: 'Please provide technical specifications and pricing for 5HP industrial motors',
          from: 'rajesh.kumar@acme.com',
          to: ['sales@company.com'],
          date: new Date().toISOString(),
        },
      ],
      createdBy: 'system',
    });
  }
}
