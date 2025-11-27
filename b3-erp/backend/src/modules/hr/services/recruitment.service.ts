import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EventBusService } from '../../workflow/services/event-bus.service';
import { WorkflowEventType } from '../../workflow/events/event-types';

export enum RequisitionStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  FILLED = 'filled',
  CANCELLED = 'cancelled',
}

export enum CandidateStatus {
  NEW = 'new',
  SCREENING = 'screening',
  SHORTLISTED = 'shortlisted',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  INTERVIEWED = 'interviewed',
  SELECTED = 'selected',
  OFFER_EXTENDED = 'offer_extended',
  OFFER_ACCEPTED = 'offer_accepted',
  OFFER_DECLINED = 'offer_declined',
  HIRED = 'hired',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

export interface JobRequisition {
  id: string;
  requisitionNumber: string;
  jobTitle: string;
  departmentId: string;
  departmentName: string;
  reportingTo: string;
  positionType: 'permanent' | 'contract' | 'temporary' | 'intern';
  numberOfOpenings: number;
  filledPositions: number;
  status: RequisitionStatus;

  // Job Details
  jobDescription: string;
  responsibilities: string[];
  qualifications: string[];
  skills: string[];
  experience: {
    minimum: number;
    maximum: number;
    unit: 'years' | 'months';
  };
  education: string;

  // Compensation
  salaryRange: {
    minimum: number;
    maximum: number;
    currency: string;
  };
  benefits?: string[];

  // Location
  location: string;
  workType: 'on-site' | 'remote' | 'hybrid';

  // Timeline
  targetHireDate: string;
  postingDate?: string;
  closingDate?: string;

  // Approval
  requestedBy: string;
  approvedBy?: string;
  approvedAt?: string;

  // Tracking
  totalApplications: number;
  shortlistedCount: number;
  interviewedCount: number;
  offeredCount: number;

  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Candidate {
  id: string;
  requisitionId: string;
  candidateNumber: string;
  status: CandidateStatus;

  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;

  // Professional Information
  currentCompany?: string;
  currentDesignation?: string;
  totalExperience: number;
  relevantExperience: number;
  currentSalary?: number;
  expectedSalary?: number;
  noticePeriod?: number; // in days
  availableFrom?: string;

  // Documents
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
  coverLetter?: string;

  // Assessment
  screeningScore?: number;
  interviewScore?: number;
  technicalScore?: number;
  overallRating?: number;
  notes?: string;

  // Source
  source: 'job_portal' | 'referral' | 'linkedin' | 'company_website' | 'agency' | 'walk_in' | 'internal';
  referredBy?: string;
  agencyName?: string;

  // Tracking
  appliedAt: string;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  requisitionId: string;
  interviewType: 'phone_screening' | 'technical' | 'hr' | 'panel' | 'final';
  round: number;
  scheduledAt: string;
  duration: number; // minutes
  location?: string;
  meetingLink?: string;
  interviewers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show';
  feedback?: {
    rating: number;
    strengths: string[];
    weaknesses: string[];
    recommendation: 'strong_hire' | 'hire' | 'no_hire' | 'strong_no_hire';
    comments: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OfferLetter {
  id: string;
  candidateId: string;
  requisitionId: string;
  offerNumber: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'accepted' | 'declined' | 'expired' | 'withdrawn';

  // Offer Details
  jobTitle: string;
  department: string;
  reportingTo: string;
  joiningDate: string;
  probationPeriod: number; // months

  // Compensation
  baseSalary: number;
  variablePay?: number;
  signingBonus?: number;
  currency: string;
  benefits: string[];

  // Terms
  expiryDate: string;
  specialConditions?: string;

  // Response
  sentAt?: string;
  respondedAt?: string;
  responseComments?: string;

  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

@Injectable()
export class RecruitmentService {
  private requisitions: JobRequisition[] = [];
  private candidates: Candidate[] = [];
  private interviews: Interview[] = [];
  private offers: OfferLetter[] = [];

  constructor(private readonly eventBusService: EventBusService) {
    this.seedMockData();
  }

  // Job Requisition Methods
  async createRequisition(data: Partial<JobRequisition>): Promise<JobRequisition> {
    const requisitionNumber = await this.generateRequisitionNumber();

    const requisition: JobRequisition = {
      id: uuidv4(),
      requisitionNumber,
      jobTitle: data.jobTitle || '',
      departmentId: data.departmentId || '',
      departmentName: data.departmentName || '',
      reportingTo: data.reportingTo || '',
      positionType: data.positionType || 'permanent',
      numberOfOpenings: data.numberOfOpenings || 1,
      filledPositions: 0,
      status: RequisitionStatus.DRAFT,
      jobDescription: data.jobDescription || '',
      responsibilities: data.responsibilities || [],
      qualifications: data.qualifications || [],
      skills: data.skills || [],
      experience: data.experience || { minimum: 0, maximum: 5, unit: 'years' },
      education: data.education || '',
      salaryRange: data.salaryRange || { minimum: 0, maximum: 0, currency: 'INR' },
      location: data.location || '',
      workType: data.workType || 'on-site',
      targetHireDate: data.targetHireDate || '',
      requestedBy: data.requestedBy || '',
      totalApplications: 0,
      shortlistedCount: 0,
      interviewedCount: 0,
      offeredCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: data.createdBy || 'system',
    };

    this.requisitions.push(requisition);

    await this.eventBusService.emit<any>(WorkflowEventType.JOB_REQUISITION_CREATED, {
      requisitionId: requisition.id,
      requisitionNumber,
      userId: requisition.createdBy,
    });

    return requisition;
  }

  async approveRequisition(id: string, approvedBy: string): Promise<JobRequisition> {
    const requisition = this.requisitions.find(r => r.id === id);
    if (!requisition) {
      throw new NotFoundException(`Requisition ${id} not found`);
    }

    requisition.status = RequisitionStatus.APPROVED;
    requisition.approvedBy = approvedBy;
    requisition.approvedAt = new Date().toISOString();
    requisition.updatedAt = new Date().toISOString();

    await this.eventBusService.emit<any>(WorkflowEventType.JOB_REQUISITION_APPROVED, {
      requisitionId: id,
      approvedBy,
      userId: approvedBy,
    });

    return requisition;
  }

  async postRequisition(id: string): Promise<JobRequisition> {
    const requisition = this.requisitions.find(r => r.id === id);
    if (!requisition) {
      throw new NotFoundException(`Requisition ${id} not found`);
    }

    if (requisition.status !== RequisitionStatus.APPROVED) {
      throw new BadRequestException('Requisition must be approved before posting');
    }

    requisition.status = RequisitionStatus.OPEN;
    requisition.postingDate = new Date().toISOString();
    requisition.updatedAt = new Date().toISOString();

    return requisition;
  }

  // Candidate Methods
  async addCandidate(data: Partial<Candidate>): Promise<Candidate> {
    const candidateNumber = await this.generateCandidateNumber();

    const candidate: Candidate = {
      id: uuidv4(),
      requisitionId: data.requisitionId || '',
      candidateNumber,
      status: CandidateStatus.NEW,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      totalExperience: data.totalExperience || 0,
      relevantExperience: data.relevantExperience || 0,
      source: data.source || 'company_website',
      appliedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };

    this.candidates.push(candidate);

    // Update requisition count
    const requisition = this.requisitions.find(r => r.id === candidate.requisitionId);
    if (requisition) {
      requisition.totalApplications++;
    }

    await this.eventBusService.emit<any>(WorkflowEventType.CANDIDATE_APPLIED, {
      candidateId: candidate.id,
      requisitionId: candidate.requisitionId,
      userId: 'SYSTEM',
    });

    return candidate;
  }

  async updateCandidateStatus(id: string, status: CandidateStatus, notes?: string): Promise<Candidate> {
    const candidate = this.candidates.find(c => c.id === id);
    if (!candidate) {
      throw new NotFoundException(`Candidate ${id} not found`);
    }

    const previousStatus = candidate.status;
    candidate.status = status;
    candidate.lastActivityAt = new Date().toISOString();
    candidate.updatedAt = new Date().toISOString();
    if (notes) {
      candidate.notes = (candidate.notes || '') + `\n[${new Date().toISOString()}] ${notes}`;
    }

    // Update requisition counts
    const requisition = this.requisitions.find(r => r.id === candidate.requisitionId);
    if (requisition) {
      if (status === CandidateStatus.SHORTLISTED) {
        requisition.shortlistedCount++;
      } else if (status === CandidateStatus.INTERVIEWED) {
        requisition.interviewedCount++;
      } else if (status === CandidateStatus.OFFER_EXTENDED) {
        requisition.offeredCount++;
      } else if (status === CandidateStatus.HIRED) {
        requisition.filledPositions++;
        if (requisition.filledPositions >= requisition.numberOfOpenings) {
          requisition.status = RequisitionStatus.FILLED;
        }
      }
    }

    await this.eventBusService.emit<any>(WorkflowEventType.CANDIDATE_STATUS_CHANGED, {
      candidateId: id,
      previousStatus,
      newStatus: status,
      userId: 'SYSTEM',
    });

    return candidate;
  }

  async screenCandidate(id: string, score: number, notes: string): Promise<Candidate> {
    const candidate = this.candidates.find(c => c.id === id);
    if (!candidate) {
      throw new NotFoundException(`Candidate ${id} not found`);
    }

    candidate.screeningScore = score;
    candidate.status = score >= 60 ? CandidateStatus.SHORTLISTED : CandidateStatus.REJECTED;
    candidate.notes = (candidate.notes || '') + `\nScreening: Score ${score}/100 - ${notes}`;
    candidate.lastActivityAt = new Date().toISOString();
    candidate.updatedAt = new Date().toISOString();

    return candidate;
  }

  // Interview Methods
  async scheduleInterview(data: Partial<Interview>): Promise<Interview> {
    const interview: Interview = {
      id: uuidv4(),
      candidateId: data.candidateId || '',
      requisitionId: data.requisitionId || '',
      interviewType: data.interviewType || 'technical',
      round: data.round || 1,
      scheduledAt: data.scheduledAt || '',
      duration: data.duration || 60,
      interviewers: data.interviewers || [],
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };

    this.interviews.push(interview);

    // Update candidate status
    await this.updateCandidateStatus(interview.candidateId, CandidateStatus.INTERVIEW_SCHEDULED);

    await this.eventBusService.emit<any>(WorkflowEventType.INTERVIEW_SCHEDULED, {
      interviewId: interview.id,
      candidateId: interview.candidateId,
      scheduledAt: interview.scheduledAt,
      userId: 'SYSTEM',
    });

    return interview;
  }

  async submitInterviewFeedback(
    interviewId: string,
    feedback: Interview['feedback']
  ): Promise<Interview> {
    const interview = this.interviews.find(i => i.id === interviewId);
    if (!interview) {
      throw new NotFoundException(`Interview ${interviewId} not found`);
    }

    interview.feedback = feedback;
    interview.status = 'completed';
    interview.updatedAt = new Date().toISOString();

    // Update candidate
    const candidate = this.candidates.find(c => c.id === interview.candidateId);
    if (candidate) {
      candidate.interviewScore = feedback.rating;
      candidate.status = CandidateStatus.INTERVIEWED;
      candidate.lastActivityAt = new Date().toISOString();
    }

    return interview;
  }

  // Offer Methods
  async createOffer(data: Partial<OfferLetter>): Promise<OfferLetter> {
    const offerNumber = await this.generateOfferNumber();

    const offer: OfferLetter = {
      id: uuidv4(),
      candidateId: data.candidateId || '',
      requisitionId: data.requisitionId || '',
      offerNumber,
      status: 'draft',
      jobTitle: data.jobTitle || '',
      department: data.department || '',
      reportingTo: data.reportingTo || '',
      joiningDate: data.joiningDate || '',
      probationPeriod: data.probationPeriod || 3,
      baseSalary: data.baseSalary || 0,
      currency: data.currency || 'INR',
      benefits: data.benefits || [],
      expiryDate: data.expiryDate || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: data.createdBy || 'system',
      ...data,
    };

    this.offers.push(offer);

    return offer;
  }

  async sendOffer(id: string): Promise<OfferLetter> {
    const offer = this.offers.find(o => o.id === id);
    if (!offer) {
      throw new NotFoundException(`Offer ${id} not found`);
    }

    offer.status = 'sent';
    offer.sentAt = new Date().toISOString();
    offer.updatedAt = new Date().toISOString();

    // Update candidate status
    await this.updateCandidateStatus(offer.candidateId, CandidateStatus.OFFER_EXTENDED);

    await this.eventBusService.emit<any>(WorkflowEventType.OFFER_SENT, {
      offerId: id,
      candidateId: offer.candidateId,
      userId: 'SYSTEM',
    });

    return offer;
  }

  async respondToOffer(id: string, accepted: boolean, comments?: string): Promise<OfferLetter> {
    const offer = this.offers.find(o => o.id === id);
    if (!offer) {
      throw new NotFoundException(`Offer ${id} not found`);
    }

    offer.status = accepted ? 'accepted' : 'declined';
    offer.respondedAt = new Date().toISOString();
    offer.responseComments = comments;
    offer.updatedAt = new Date().toISOString();

    // Update candidate status
    await this.updateCandidateStatus(
      offer.candidateId,
      accepted ? CandidateStatus.OFFER_ACCEPTED : CandidateStatus.OFFER_DECLINED
    );

    await this.eventBusService.emit<any>(accepted ? WorkflowEventType.OFFER_ACCEPTED : WorkflowEventType.OFFER_DECLINED, {
      offerId: id,
      candidateId: offer.candidateId,
      userId: 'SYSTEM',
    });

    return offer;
  }

  // Query Methods
  async findAllRequisitions(filters?: { status?: RequisitionStatus; departmentId?: string }): Promise<JobRequisition[]> {
    let result = [...this.requisitions];
    if (filters?.status) {
      result = result.filter(r => r.status === filters.status);
    }
    if (filters?.departmentId) {
      result = result.filter(r => r.departmentId === filters.departmentId);
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findCandidatesByRequisition(requisitionId: string): Promise<Candidate[]> {
    return this.candidates
      .filter(c => c.requisitionId === requisitionId)
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
  }

  async getRecruitmentMetrics(): Promise<{
    openPositions: number;
    totalApplications: number;
    timeToHire: number;
    offerAcceptanceRate: number;
    sourceBreakdown: Record<string, number>;
  }> {
    const openPositions = this.requisitions
      .filter(r => r.status === RequisitionStatus.OPEN || r.status === RequisitionStatus.IN_PROGRESS)
      .reduce((sum, r) => sum + (r.numberOfOpenings - r.filledPositions), 0);

    const totalApplications = this.candidates.length;

    const acceptedOffers = this.offers.filter(o => o.status === 'accepted').length;
    const totalOffers = this.offers.filter(o => o.status !== 'draft').length;
    const offerAcceptanceRate = totalOffers > 0 ? (acceptedOffers / totalOffers) * 100 : 0;

    const sourceBreakdown: Record<string, number> = {};
    this.candidates.forEach(c => {
      sourceBreakdown[c.source] = (sourceBreakdown[c.source] || 0) + 1;
    });

    return {
      openPositions,
      totalApplications,
      timeToHire: 30, // Mock average
      offerAcceptanceRate,
      sourceBreakdown,
    };
  }

  private async generateRequisitionNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const sequence = String(this.requisitions.length + 1).padStart(4, '0');
    return `JR-${year}-${sequence}`;
  }

  private async generateCandidateNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const sequence = String(this.candidates.length + 1).padStart(5, '0');
    return `CAN-${year}-${sequence}`;
  }

  private async generateOfferNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const sequence = String(this.offers.length + 1).padStart(4, '0');
    return `OFR-${year}${month}-${sequence}`;
  }

  private seedMockData(): void {
    // Seed a sample requisition
    this.createRequisition({
      jobTitle: 'Senior Software Engineer',
      departmentId: 'dept-001',
      departmentName: 'Engineering',
      reportingTo: 'Engineering Manager',
      positionType: 'permanent',
      numberOfOpenings: 2,
      jobDescription: 'Design and develop manufacturing software solutions',
      responsibilities: ['Design systems', 'Write code', 'Code review', 'Mentoring'],
      qualifications: ['B.Tech/M.Tech in Computer Science'],
      skills: ['TypeScript', 'Node.js', 'React', 'PostgreSQL'],
      experience: { minimum: 5, maximum: 10, unit: 'years' },
      education: 'Bachelor\'s degree in Computer Science',
      salaryRange: { minimum: 1500000, maximum: 2500000, currency: 'INR' },
      location: 'Bangalore',
      workType: 'hybrid',
      targetHireDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      requestedBy: 'engineering-manager',
      createdBy: 'system',
    });
  }
}
