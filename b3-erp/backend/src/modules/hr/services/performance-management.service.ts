import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PerformanceManagementService {
  constructor(private prisma: PrismaService) {}

  // ==========================================================================
  // GOAL MANAGEMENT
  // ==========================================================================

  async createGoal(data: {
    goalCode: string;
    title: string;
    description?: string;
    goalType: string;
    category?: string;
    ownerId: string;
    ownerName: string;
    ownerDepartment?: string;
    teamId?: string;
    departmentId?: string;
    parentGoalId?: string;
    keyResults?: any;
    measurementType?: string;
    targetValue?: number;
    weightage?: number;
    startDate: Date;
    dueDate: Date;
    priority?: string;
    reviewCycleId?: string;
    companyId: string;
  }) {
    return this.prisma.goal.create({
      data: {
        ...data,
        status: 'not_started',
        progress: 0,
        currentValue: 0,
      },
    });
  }

  async getGoals(companyId: string, options?: {
    goalType?: string;
    ownerId?: string;
    departmentId?: string;
    status?: string;
    reviewCycleId?: string;
    parentGoalId?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (options?.goalType) where.goalType = options.goalType;
    if (options?.ownerId) where.ownerId = options.ownerId;
    if (options?.departmentId) where.departmentId = options.departmentId;
    if (options?.status) where.status = options.status;
    if (options?.reviewCycleId) where.reviewCycleId = options.reviewCycleId;
    if (options?.parentGoalId) where.parentGoalId = options.parentGoalId;

    return this.prisma.goal.findMany({
      where,
      include: {
        parentGoal: true,
        childGoals: true,
        alignments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getGoalById(id: string) {
    return this.prisma.goal.findUnique({
      where: { id },
      include: {
        parentGoal: true,
        childGoals: true,
        alignments: {
          include: { targetGoal: true },
        },
        alignedTo: {
          include: { sourceGoal: true },
        },
      },
    });
  }

  async updateGoalProgress(id: string, data: {
    currentValue?: number;
    progress?: number;
    status?: string;
    comments?: any;
    lastUpdatedBy: string;
  }) {
    return this.prisma.goal.update({
      where: { id },
      data: {
        ...data,
        lastUpdatedAt: new Date(),
      },
    });
  }

  async completeGoal(id: string, completedBy: string) {
    return this.prisma.goal.update({
      where: { id },
      data: {
        status: 'completed',
        progress: 100,
        completedDate: new Date(),
        lastUpdatedBy: completedBy,
        lastUpdatedAt: new Date(),
      },
    });
  }

  async createGoalAlignment(data: {
    sourceGoalId: string;
    targetGoalId: string;
    alignmentType: string;
    weightage?: number;
    createdBy: string;
    companyId: string;
  }) {
    return this.prisma.goalAlignment.create({ data });
  }

  // ==========================================================================
  // PERFORMANCE REVIEW CYCLES
  // ==========================================================================

  async createReviewCycle(data: {
    cycleCode: string;
    cycleName: string;
    description?: string;
    cycleType: string;
    fiscalYear: string;
    startDate: Date;
    endDate: Date;
    goalSettingStart?: Date;
    goalSettingEnd?: Date;
    selfAppraisalStart?: Date;
    selfAppraisalEnd?: Date;
    managerReviewStart?: Date;
    managerReviewEnd?: Date;
    peerReviewStart?: Date;
    peerReviewEnd?: Date;
    calibrationStart?: Date;
    calibrationEnd?: Date;
    includeSelfAppraisal?: boolean;
    includeManagerReview?: boolean;
    includePeerReview?: boolean;
    include360Review?: boolean;
    includeGoals?: boolean;
    includeCompetencies?: boolean;
    goalsWeightage?: number;
    competenciesWeightage?: number;
    ratingScale?: string;
    ratingLabels?: any;
    companyId: string;
  }) {
    return this.prisma.performanceReviewCycle.create({
      data: {
        ...data,
        status: 'draft',
      },
    });
  }

  async getReviewCycles(companyId: string, options?: {
    status?: string;
    fiscalYear?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (options?.status) where.status = options.status;
    if (options?.fiscalYear) where.fiscalYear = options.fiscalYear;

    return this.prisma.performanceReviewCycle.findMany({
      where,
      include: {
        reviews: { take: 10 },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async activateReviewCycle(id: string) {
    return this.prisma.performanceReviewCycle.update({
      where: { id },
      data: { status: 'active' },
    });
  }

  // ==========================================================================
  // PERFORMANCE REVIEWS
  // ==========================================================================

  async createPerformanceReview(data: {
    reviewCode: string;
    reviewCycleId: string;
    employeeId: string;
    employeeName: string;
    employeeCode: string;
    department?: string;
    designation?: string;
    reportingManagerId?: string;
    reportingManagerName?: string;
    reviewType?: string;
    companyId: string;
  }) {
    return this.prisma.performanceReview.create({
      data: {
        ...data,
        status: 'not_started',
        selfAppraisalStatus: 'pending',
        managerReviewStatus: 'pending',
        peerReviewStatus: 'not_applicable',
      },
    });
  }

  async getPerformanceReviews(companyId: string, options?: {
    reviewCycleId?: string;
    employeeId?: string;
    managerId?: string;
    status?: string;
    department?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (options?.reviewCycleId) where.reviewCycleId = options.reviewCycleId;
    if (options?.employeeId) where.employeeId = options.employeeId;
    if (options?.managerId) where.reportingManagerId = options.managerId;
    if (options?.status) where.status = options.status;
    if (options?.department) where.department = options.department;

    return this.prisma.performanceReview.findMany({
      where,
      include: {
        reviewCycle: true,
        reviewMeetings: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async submitSelfAppraisal(reviewId: string, data: {
    selfAppraisalComments?: string;
    selfGoalRatings?: any;
    selfCompetencyRatings?: any;
    selfOverallRating?: number;
    selfStrengths?: string;
    selfImprovementAreas?: string;
  }) {
    return this.prisma.performanceReview.update({
      where: { id: reviewId },
      data: {
        ...data,
        selfAppraisalStatus: 'submitted',
        selfAppraisalDate: new Date(),
        status: 'manager_review',
      },
    });
  }

  async submitManagerReview(reviewId: string, data: {
    managerComments?: string;
    managerGoalRatings?: any;
    managerCompetencyRatings?: any;
    managerOverallRating?: number;
    managerStrengths?: string;
    managerImprovementAreas?: string;
    managerRecommendations?: string;
  }) {
    return this.prisma.performanceReview.update({
      where: { id: reviewId },
      data: {
        ...data,
        managerReviewStatus: 'submitted',
        managerReviewDate: new Date(),
        status: 'calibration',
      },
    });
  }

  async submitFinalRating(reviewId: string, data: {
    finalRating: number;
    finalRatingLabel?: string;
    calibratedRating?: number;
    calibrationNotes?: string;
  }) {
    return this.prisma.performanceReview.update({
      where: { id: reviewId },
      data: {
        ...data,
        status: 'completed',
        completedDate: new Date(),
      },
    });
  }

  async acknowledgeReview(reviewId: string, comments?: string) {
    return this.prisma.performanceReview.update({
      where: { id: reviewId },
      data: {
        employeeAcknowledged: true,
        employeeAcknowledgedAt: new Date(),
        employeeAcknowledgmentComments: comments,
      },
    });
  }

  // ==========================================================================
  // REVIEW MEETINGS
  // ==========================================================================

  async createReviewMeeting(data: {
    meetingCode: string;
    reviewId: string;
    meetingType: string;
    scheduledDate: Date;
    scheduledTime?: string;
    duration?: number;
    location?: string;
    meetingLink?: string;
    organizerId: string;
    organizerName: string;
    attendees?: any;
    agenda?: string;
    companyId: string;
  }) {
    return this.prisma.reviewMeeting.create({
      data: {
        ...data,
        status: 'scheduled',
      },
    });
  }

  async completeReviewMeeting(meetingId: string, data: {
    discussionPoints?: any;
    actionItems?: any;
    meetingNotes?: string;
    outcomes?: string;
    completedBy: string;
  }) {
    return this.prisma.reviewMeeting.update({
      where: { id: meetingId },
      data: {
        ...data,
        status: 'completed',
        actualDate: new Date(),
      },
    });
  }

  // ==========================================================================
  // CONTINUOUS FEEDBACK
  // ==========================================================================

  async createFeedback(data: {
    feedbackCode: string;
    feedbackType: string;
    direction: string;
    fromEmployeeId: string;
    fromEmployeeName: string;
    fromDepartment?: string;
    toEmployeeId: string;
    toEmployeeName: string;
    toDepartment?: string;
    subject?: string;
    feedback: string;
    category?: string;
    isAnonymous?: boolean;
    visibility?: string;
    tags?: string[];
    relatedGoalId?: string;
    relatedProjectId?: string;
    companyId: string;
  }) {
    return this.prisma.continuousFeedback.create({
      data: {
        ...data,
        feedbackDate: new Date(),
      },
    });
  }

  async getFeedback(companyId: string, options?: {
    employeeId?: string;
    direction?: 'given' | 'received';
    feedbackType?: string;
    fromDate?: Date;
    toDate?: Date;
  }) {
    const where: any = { companyId, isActive: true };

    if (options?.employeeId) {
      if (options?.direction === 'given') {
        where.fromEmployeeId = options.employeeId;
      } else if (options?.direction === 'received') {
        where.toEmployeeId = options.employeeId;
      } else {
        where.OR = [
          { fromEmployeeId: options.employeeId },
          { toEmployeeId: options.employeeId },
        ];
      }
    }

    if (options?.feedbackType) where.feedbackType = options.feedbackType;

    return this.prisma.continuousFeedback.findMany({
      where,
      orderBy: { feedbackDate: 'desc' },
    });
  }

  async acknowledgeFeedback(feedbackId: string, responseMessage?: string) {
    return this.prisma.continuousFeedback.update({
      where: { id: feedbackId },
      data: {
        acknowledgedAt: new Date(),
        responseMessage,
      },
    });
  }

  // ==========================================================================
  // FEEDBACK REQUESTS
  // ==========================================================================

  async createFeedbackRequest(data: {
    requestCode: string;
    requesterId: string;
    requesterName: string;
    requesterDepartment?: string;
    requestType: string;
    subject: string;
    description?: string;
    questionTemplate?: any;
    reviewers: any;
    dueDate?: Date;
    anonymizeResponses?: boolean;
    companyId: string;
  }) {
    return this.prisma.feedbackRequest.create({
      data: {
        ...data,
        status: 'pending',
        completedCount: 0,
        totalReviewers: Array.isArray(data.reviewers) ? data.reviewers.length : 0,
      },
    });
  }

  async submitFeedbackResponse(requestId: string, reviewerId: string, response: any) {
    const request = await this.prisma.feedbackRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) throw new Error('Feedback request not found');

    const reviewers = (request.reviewers as any[]) || [];
    const updatedReviewers = reviewers.map((r: any) => {
      if (r.employeeId === reviewerId) {
        return { ...r, status: 'submitted', submittedAt: new Date(), response };
      }
      return r;
    });

    const completedCount = updatedReviewers.filter((r: any) => r.status === 'submitted').length;
    const status = completedCount === updatedReviewers.length ? 'completed' : 'partially_completed';

    return this.prisma.feedbackRequest.update({
      where: { id: requestId },
      data: {
        reviewers: updatedReviewers,
        completedCount,
        status,
      },
    });
  }

  // ==========================================================================
  // RECOGNITION
  // ==========================================================================

  async createRecognition(data: {
    recognitionCode: string;
    giverId: string;
    giverName: string;
    giverDepartment?: string;
    receiverId: string;
    receiverName: string;
    receiverDepartment?: string;
    recognitionType: string;
    category?: string;
    title: string;
    message: string;
    badgeId?: string;
    badgeName?: string;
    visibility?: string;
    pointsAwarded?: number;
    rewardId?: string;
    rewardValue?: number;
    requiresApproval?: boolean;
    companyId: string;
  }) {
    return this.prisma.recognition.create({
      data: {
        ...data,
        recognitionDate: new Date(),
        likes: 0,
        approvalStatus: data.requiresApproval ? 'pending' : 'approved',
      },
    });
  }

  async getRecognitions(companyId: string, options?: {
    receiverId?: string;
    giverId?: string;
    recognitionType?: string;
    visibility?: string;
    fromDate?: Date;
    toDate?: Date;
  }) {
    const where: any = { companyId, isActive: true };
    if (options?.receiverId) where.receiverId = options.receiverId;
    if (options?.giverId) where.giverId = options.giverId;
    if (options?.recognitionType) where.recognitionType = options.recognitionType;
    if (options?.visibility) where.visibility = options.visibility;

    return this.prisma.recognition.findMany({
      where,
      orderBy: { recognitionDate: 'desc' },
    });
  }

  async likeRecognition(recognitionId: string) {
    return this.prisma.recognition.update({
      where: { id: recognitionId },
      data: {
        likes: { increment: 1 },
      },
    });
  }

  // ==========================================================================
  // KPI MANAGEMENT
  // ==========================================================================

  async createKPIMaster(data: {
    kpiCode: string;
    kpiName: string;
    description?: string;
    category: string;
    kpiType: string;
    measurementUnit?: string;
    measurementFrequency?: string;
    targetType?: string;
    defaultTarget?: number;
    minValue?: number;
    maxValue?: number;
    dataSource?: string;
    calculationFormula?: string;
    linkedMetric?: string;
    applicableTo?: string[];
    applicableDepartments?: string[];
    applicableDesignations?: string[];
    companyId: string;
  }) {
    return this.prisma.kPIMaster.create({ data });
  }

  async getKPIMasters(companyId: string, options?: {
    category?: string;
    kpiType?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (options?.category) where.category = options.category;
    if (options?.kpiType) where.kpiType = options.kpiType;

    return this.prisma.kPIMaster.findMany({
      where,
      include: {
        assignments: { take: 10 },
      },
      orderBy: { kpiName: 'asc' },
    });
  }

  async assignKPI(data: {
    assignmentCode: string;
    kpiId: string;
    assigneeType: string;
    assigneeId: string;
    assigneeName: string;
    department?: string;
    periodType: string;
    periodStart: Date;
    periodEnd: Date;
    fiscalYear?: string;
    targetValue: number;
    stretchTarget?: number;
    weightage?: number;
    assignedBy: string;
    notes?: string;
    companyId: string;
  }) {
    return this.prisma.kPIAssignment.create({
      data: {
        ...data,
        status: 'active',
      },
    });
  }

  async getKPIAssignments(companyId: string, options?: {
    assigneeId?: string;
    kpiId?: string;
    periodType?: string;
    status?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (options?.assigneeId) where.assigneeId = options.assigneeId;
    if (options?.kpiId) where.kpiId = options.kpiId;
    if (options?.periodType) where.periodType = options.periodType;
    if (options?.status) where.status = options.status;

    return this.prisma.kPIAssignment.findMany({
      where,
      include: {
        kpi: true,
        trackingRecords: { orderBy: { trackingDate: 'desc' }, take: 10 },
      },
      orderBy: { periodStart: 'desc' },
    });
  }

  async trackKPI(data: {
    trackingCode: string;
    assignmentId: string;
    trackingDate: Date;
    periodStart: Date;
    periodEnd: Date;
    targetValue: number;
    actualValue: number;
    previousValue?: number;
    evidenceUrl?: string;
    attachments?: any;
    comments?: string;
    enteredBy: string;
    companyId: string;
  }) {
    const variance = data.actualValue - data.targetValue;
    const variancePercent = data.targetValue > 0 ? (variance / data.targetValue) * 100 : 0;
    const achievementPercent = data.targetValue > 0 ? (data.actualValue / data.targetValue) * 100 : 0;

    let trend = 'stable';
    if (data.previousValue !== undefined) {
      if (data.actualValue > data.previousValue) trend = 'improving';
      else if (data.actualValue < data.previousValue) trend = 'declining';
    }

    return this.prisma.kPITracking.create({
      data: {
        ...data,
        variance,
        variancePercent,
        achievementPercent,
        trend,
      },
    });
  }

  // ==========================================================================
  // PERFORMANCE IMPROVEMENT PLANS (PIP)
  // ==========================================================================

  async createPIP(data: {
    pipCode: string;
    employeeId: string;
    employeeName: string;
    employeeCode: string;
    department?: string;
    designation?: string;
    managerId: string;
    managerName: string;
    reason: string;
    performanceGap: string;
    expectedOutcome: string;
    startDate: Date;
    endDate: Date;
    reviewFrequency?: string;
    improvementAreas: any;
    supportProvided?: any;
    trainingRequired?: any;
    hrRepId?: string;
    hrRepName?: string;
    companyId: string;
  }) {
    return this.prisma.performanceImprovementPlan.create({
      data: {
        ...data,
        status: 'draft',
        acknowledgmentStatus: 'pending',
      },
    });
  }

  async getPIPs(companyId: string, options?: {
    employeeId?: string;
    managerId?: string;
    status?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (options?.employeeId) where.employeeId = options.employeeId;
    if (options?.managerId) where.managerId = options.managerId;
    if (options?.status) where.status = options.status;

    return this.prisma.performanceImprovementPlan.findMany({
      where,
      include: {
        pipReviews: { orderBy: { reviewDate: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async activatePIP(pipId: string) {
    return this.prisma.performanceImprovementPlan.update({
      where: { id: pipId },
      data: { status: 'active' },
    });
  }

  async acknowledgePIP(pipId: string, disputed: boolean = false) {
    return this.prisma.performanceImprovementPlan.update({
      where: { id: pipId },
      data: {
        acknowledgmentStatus: disputed ? 'disputed' : 'acknowledged',
        acknowledgmentDate: new Date(),
      },
    });
  }

  async createPIPReview(data: {
    reviewCode: string;
    pipId: string;
    reviewNumber: number;
    reviewDate: Date;
    reviewType: string;
    overallProgress: string;
    progressPercent?: number;
    areasProgress?: any;
    managerComments?: string;
    employeeComments?: string;
    hrComments?: string;
    actionItems?: any;
    supportNeeded?: string;
    obstacles?: string;
    recommendation?: string;
    nextReviewDate?: Date;
    reviewedBy: string;
    companyId: string;
  }) {
    return this.prisma.pIPReview.create({ data });
  }

  async concludePIP(pipId: string, outcome: string) {
    const statusMap: Record<string, string> = {
      improved: 'successful',
      partially_improved: 'completed',
      not_improved: 'unsuccessful',
    };

    return this.prisma.performanceImprovementPlan.update({
      where: { id: pipId },
      data: {
        status: statusMap[outcome] || 'completed',
        outcome,
      },
    });
  }

  // ==========================================================================
  // DASHBOARD & REPORTS
  // ==========================================================================

  async getPerformanceDashboard(companyId: string, employeeId?: string) {
    const [
      activeGoals,
      pendingReviews,
      pendingFeedback,
      recognitionsReceived,
      kpiAssignments,
      activePIPs,
    ] = await Promise.all([
      this.prisma.goal.count({
        where: {
          companyId,
          isActive: true,
          status: { in: ['not_started', 'in_progress', 'on_track', 'at_risk'] },
          ...(employeeId ? { ownerId: employeeId } : {}),
        },
      }),
      this.prisma.performanceReview.count({
        where: {
          companyId,
          isActive: true,
          status: { notIn: ['completed'] },
          ...(employeeId ? { employeeId } : {}),
        },
      }),
      this.prisma.feedbackRequest.count({
        where: {
          companyId,
          isActive: true,
          status: 'pending',
          ...(employeeId ? { requesterId: employeeId } : {}),
        },
      }),
      this.prisma.recognition.count({
        where: {
          companyId,
          isActive: true,
          ...(employeeId ? { receiverId: employeeId } : {}),
        },
      }),
      this.prisma.kPIAssignment.count({
        where: {
          companyId,
          isActive: true,
          status: 'active',
          ...(employeeId ? { assigneeId: employeeId } : {}),
        },
      }),
      this.prisma.performanceImprovementPlan.count({
        where: {
          companyId,
          isActive: true,
          status: 'active',
          ...(employeeId ? { employeeId } : {}),
        },
      }),
    ]);

    return {
      activeGoals,
      pendingReviews,
      pendingFeedback,
      recognitionsReceived,
      kpiAssignments,
      activePIPs,
    };
  }

  async getRatingDistribution(companyId: string, reviewCycleId: string) {
    const reviews = await this.prisma.performanceReview.findMany({
      where: {
        companyId,
        reviewCycleId,
        status: 'completed',
        finalRating: { not: null },
      },
      select: {
        finalRating: true,
        finalRatingLabel: true,
        department: true,
      },
    });

    const distribution: Record<string, number> = {};
    const departmentDistribution: Record<string, Record<string, number>> = {};

    reviews.forEach((review) => {
      const label = review.finalRatingLabel || String(review.finalRating);
      distribution[label] = (distribution[label] || 0) + 1;

      if (review.department) {
        if (!departmentDistribution[review.department]) {
          departmentDistribution[review.department] = {};
        }
        departmentDistribution[review.department][label] =
          (departmentDistribution[review.department][label] || 0) + 1;
      }
    });

    return {
      overall: distribution,
      byDepartment: departmentDistribution,
      totalReviews: reviews.length,
    };
  }

  async getDepartmentPerformance(companyId: string, reviewCycleId: string) {
    const reviews = await this.prisma.performanceReview.groupBy({
      by: ['department'],
      where: {
        companyId,
        reviewCycleId,
        status: 'completed',
        finalRating: { not: null },
      },
      _avg: { finalRating: true },
      _count: true,
    });

    return reviews.map((r) => ({
      department: r.department,
      averageRating: r._avg.finalRating,
      employeeCount: r._count,
    }));
  }
}
