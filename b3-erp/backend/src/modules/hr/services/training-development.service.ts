import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TrainingDevelopmentService {
  constructor(private prisma: PrismaService) {}

  // ==========================================================================
  // TRAINING PROGRAMS
  // ==========================================================================

  async createTrainingProgram(data: {
    programCode: string;
    programName: string;
    description?: string;
    programType: string;
    category: string;
    subCategory?: string;
    deliveryMode: string;
    language?: string;
    durationHours: number;
    durationDays?: number;
    minParticipants?: number;
    maxParticipants?: number;
    prerequisites?: any;
    targetAudience?: any;
    objectives?: any;
    curriculum?: any;
    materials?: any;
    resourceUrls?: string[];
    hasAssessment?: boolean;
    passingScore?: number;
    certificationAwarded?: boolean;
    certificationName?: string;
    certificationValidity?: number;
    providerId?: string;
    providerName?: string;
    providerContact?: string;
    costPerParticipant?: number;
    totalBudget?: number;
    currency?: string;
    companyId: string;
  }) {
    return this.prisma.trainingProgram.create({
      data: {
        ...data,
        status: 'draft',
      },
    });
  }

  async getTrainingPrograms(companyId: string, options?: {
    programType?: string;
    category?: string;
    status?: string;
    deliveryMode?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (options?.programType) where.programType = options.programType;
    if (options?.category) where.category = options.category;
    if (options?.status) where.status = options.status;
    if (options?.deliveryMode) where.deliveryMode = options.deliveryMode;

    return this.prisma.trainingProgram.findMany({
      where,
      include: {
        schedules: { where: { isActive: true }, take: 5 },
        _count: {
          select: {
            enrollments: true,
            schedules: true,
          },
        },
      },
      orderBy: { programName: 'asc' },
    });
  }

  async getTrainingProgramById(id: string) {
    return this.prisma.trainingProgram.findUnique({
      where: { id },
      include: {
        schedules: {
          where: { isActive: true },
          orderBy: { startDate: 'desc' },
        },
        enrollments: { take: 10 },
        feedbacks: { take: 10 },
        assessments: true,
      },
    });
  }

  async publishTrainingProgram(id: string) {
    return this.prisma.trainingProgram.update({
      where: { id },
      data: { status: 'active' },
    });
  }

  // ==========================================================================
  // TRAINING SCHEDULES
  // ==========================================================================

  async createTrainingSchedule(data: {
    scheduleCode: string;
    programId: string;
    batchName?: string;
    startDate: Date;
    endDate: Date;
    startTime?: string;
    endTime?: string;
    timezone?: string;
    locationType: string;
    venue?: string;
    address?: string;
    meetingLink?: string;
    meetingId?: string;
    maxParticipants: number;
    trainerId?: string;
    trainerName?: string;
    trainerType?: string;
    trainerEmail?: string;
    trainerPhone?: string;
    registrationStartDate?: Date;
    registrationEndDate?: Date;
    autoConfirm?: boolean;
    requiresApproval?: boolean;
    companyId: string;
  }) {
    return this.prisma.trainingSchedule.create({
      data: {
        ...data,
        status: 'scheduled',
        registeredCount: 0,
        attendedCount: 0,
        waitlistCount: 0,
      },
    });
  }

  async getTrainingSchedules(companyId: string, options?: {
    programId?: string;
    status?: string;
    fromDate?: Date;
    toDate?: Date;
    trainerId?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (options?.programId) where.programId = options.programId;
    if (options?.status) where.status = options.status;
    if (options?.trainerId) where.trainerId = options.trainerId;
    if (options?.fromDate || options?.toDate) {
      where.startDate = {};
      if (options.fromDate) where.startDate.gte = options.fromDate;
      if (options.toDate) where.startDate.lte = options.toDate;
    }

    return this.prisma.trainingSchedule.findMany({
      where,
      include: {
        program: true,
        _count: {
          select: {
            enrollments: true,
            waitlist: true,
          },
        },
      },
      orderBy: { startDate: 'asc' },
    });
  }

  async updateScheduleStatus(scheduleId: string, status: string, notes?: string) {
    const data: any = { status };
    if (status === 'completed') {
      data.completionDate = new Date();
      data.completionNotes = notes;
    }
    return this.prisma.trainingSchedule.update({
      where: { id: scheduleId },
      data,
    });
  }

  // ==========================================================================
  // ENROLLMENT MANAGEMENT
  // ==========================================================================

  async enrollInTraining(data: {
    enrollmentCode: string;
    programId: string;
    scheduleId?: string;
    employeeId: string;
    employeeName: string;
    employeeCode: string;
    department?: string;
    designation?: string;
    managerId?: string;
    managerName?: string;
    enrollmentType?: string;
    nominatedBy?: string;
    nominatedByName?: string;
    priority?: string;
    companyId: string;
  }) {
    const schedule = data.scheduleId
      ? await this.prisma.trainingSchedule.findUnique({
          where: { id: data.scheduleId },
        })
      : null;

    // Check capacity
    if (schedule && schedule.registeredCount >= schedule.maxParticipants) {
      // Add to waitlist instead
      return this.addToWaitlist({
        waitlistCode: `WL-${data.enrollmentCode}`,
        scheduleId: data.scheduleId!,
        employeeId: data.employeeId,
        employeeName: data.employeeName,
        employeeCode: data.employeeCode,
        department: data.department,
        requestedBy: data.nominatedBy,
        priority: data.priority,
        companyId: data.companyId,
      });
    }

    const enrollment = await this.prisma.trainingEnrollment.create({
      data: {
        ...data,
        status: 'enrolled',
        approvalStatus: 'pending',
      },
    });

    // Update schedule count
    if (data.scheduleId) {
      await this.prisma.trainingSchedule.update({
        where: { id: data.scheduleId },
        data: { registeredCount: { increment: 1 } },
      });
    }

    return enrollment;
  }

  async getEnrollments(companyId: string, options?: {
    employeeId?: string;
    programId?: string;
    scheduleId?: string;
    status?: string;
    approvalStatus?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (options?.employeeId) where.employeeId = options.employeeId;
    if (options?.programId) where.programId = options.programId;
    if (options?.scheduleId) where.scheduleId = options.scheduleId;
    if (options?.status) where.status = options.status;
    if (options?.approvalStatus) where.approvalStatus = options.approvalStatus;

    return this.prisma.trainingEnrollment.findMany({
      where,
      include: {
        program: true,
        schedule: true,
      },
      orderBy: { enrollmentDate: 'desc' },
    });
  }

  async approveEnrollment(enrollmentId: string, approvedById: string, approvedByName: string) {
    return this.prisma.trainingEnrollment.update({
      where: { id: enrollmentId },
      data: {
        approvalStatus: 'approved',
        approvedById,
        approvedByName,
        approvedAt: new Date(),
      },
    });
  }

  async rejectEnrollment(enrollmentId: string, approvedById: string, reason: string) {
    const enrollment = await this.prisma.trainingEnrollment.update({
      where: { id: enrollmentId },
      data: {
        approvalStatus: 'rejected',
        approvedById,
        approvedAt: new Date(),
        rejectionReason: reason,
        status: 'cancelled',
      },
    });

    // Update schedule count
    if (enrollment.scheduleId) {
      await this.prisma.trainingSchedule.update({
        where: { id: enrollment.scheduleId },
        data: { registeredCount: { decrement: 1 } },
      });
    }

    return enrollment;
  }

  async completeEnrollment(enrollmentId: string, data: {
    completionStatus: string;
    assessmentScore?: number;
    assessmentPassed?: boolean;
    attendancePercent?: number;
    totalSessions?: number;
    attendedSessions?: number;
  }) {
    return this.prisma.trainingEnrollment.update({
      where: { id: enrollmentId },
      data: {
        ...data,
        status: 'completed',
        completionDate: new Date(),
      },
    });
  }

  async issueCertificate(enrollmentId: string, certificateNumber: string, certificateUrl?: string) {
    return this.prisma.trainingEnrollment.update({
      where: { id: enrollmentId },
      data: {
        certificateIssued: true,
        certificateNumber,
        certificateUrl,
        certificateIssuedAt: new Date(),
      },
    });
  }

  // ==========================================================================
  // TRAINING ATTENDANCE
  // ==========================================================================

  async markAttendance(data: {
    scheduleId: string;
    employeeId: string;
    employeeName: string;
    employeeCode: string;
    sessionDate: Date;
    sessionNumber?: number;
    sessionTopic?: string;
    status: string;
    checkInTime?: Date;
    checkOutTime?: Date;
    duration?: number;
    remarks?: string;
    markedBy?: string;
    companyId: string;
  }) {
    return this.prisma.trainingAttendance.upsert({
      where: {
        scheduleId_employeeId_sessionDate: {
          scheduleId: data.scheduleId,
          employeeId: data.employeeId,
          sessionDate: data.sessionDate,
        },
      },
      create: data,
      update: {
        status: data.status,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        duration: data.duration,
        remarks: data.remarks,
        markedBy: data.markedBy,
      },
    });
  }

  async getAttendance(companyId: string, options?: {
    scheduleId?: string;
    employeeId?: string;
    sessionDate?: Date;
  }) {
    const where: any = { companyId, isActive: true };
    if (options?.scheduleId) where.scheduleId = options.scheduleId;
    if (options?.employeeId) where.employeeId = options.employeeId;
    if (options?.sessionDate) where.sessionDate = options.sessionDate;

    return this.prisma.trainingAttendance.findMany({
      where,
      include: {
        schedule: { include: { program: true } },
      },
      orderBy: { sessionDate: 'desc' },
    });
  }

  // ==========================================================================
  // WAITLIST MANAGEMENT
  // ==========================================================================

  async addToWaitlist(data: {
    waitlistCode: string;
    scheduleId: string;
    employeeId: string;
    employeeName: string;
    employeeCode: string;
    department?: string;
    requestedBy?: string;
    priority?: string;
    reason?: string;
    companyId: string;
  }) {
    // Get current position
    const currentCount = await this.prisma.trainingWaitlist.count({
      where: { scheduleId: data.scheduleId, status: 'waiting' },
    });

    const waitlistEntry = await this.prisma.trainingWaitlist.create({
      data: {
        ...data,
        position: currentCount + 1,
        status: 'waiting',
      },
    });

    // Update schedule waitlist count
    await this.prisma.trainingSchedule.update({
      where: { id: data.scheduleId },
      data: { waitlistCount: { increment: 1 } },
    });

    return waitlistEntry;
  }

  async getWaitlist(companyId: string, scheduleId: string) {
    return this.prisma.trainingWaitlist.findMany({
      where: { companyId, scheduleId, isActive: true },
      include: {
        schedule: { include: { program: true } },
      },
      orderBy: { position: 'asc' },
    });
  }

  async offerWaitlistSpot(waitlistId: string, expiresAt: Date) {
    return this.prisma.trainingWaitlist.update({
      where: { id: waitlistId },
      data: {
        status: 'offered',
        offeredAt: new Date(),
        expiresAt,
      },
    });
  }

  async acceptWaitlistOffer(waitlistId: string, enrollmentCode: string, companyId: string) {
    const waitlistEntry = await this.prisma.trainingWaitlist.findUnique({
      where: { id: waitlistId },
      include: { schedule: true },
    });

    if (!waitlistEntry) throw new Error('Waitlist entry not found');

    // Create enrollment
    const enrollment = await this.enrollInTraining({
      enrollmentCode,
      programId: waitlistEntry.schedule.programId,
      scheduleId: waitlistEntry.scheduleId,
      employeeId: waitlistEntry.employeeId,
      employeeName: waitlistEntry.employeeName,
      employeeCode: waitlistEntry.employeeCode,
      department: waitlistEntry.department || undefined,
      enrollmentType: 'waitlist',
      companyId,
    });

    // Update waitlist status
    await this.prisma.trainingWaitlist.update({
      where: { id: waitlistId },
      data: {
        status: 'enrolled',
        respondedAt: new Date(),
      },
    });

    return enrollment;
  }

  // ==========================================================================
  // SKILL ASSESSMENT
  // ==========================================================================

  async createSkillAssessment(data: {
    assessmentCode: string;
    employeeId: string;
    employeeName: string;
    employeeCode: string;
    department?: string;
    designation?: string;
    assessmentType: string;
    assessmentPurpose: string;
    assessmentDate: Date;
    skillRatings: any;
    overallRating?: number;
    strengths?: any;
    developmentAreas?: any;
    recommendations?: string;
    assessedById?: string;
    assessedByName?: string;
    assessedByRole?: string;
    companyId: string;
  }) {
    return this.prisma.skillAssessment.create({
      data: {
        ...data,
        status: 'completed',
      },
    });
  }

  async getSkillAssessments(companyId: string, options?: {
    employeeId?: string;
    assessmentType?: string;
    assessmentPurpose?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (options?.employeeId) where.employeeId = options.employeeId;
    if (options?.assessmentType) where.assessmentType = options.assessmentType;
    if (options?.assessmentPurpose) where.assessmentPurpose = options.assessmentPurpose;

    return this.prisma.skillAssessment.findMany({
      where,
      orderBy: { assessmentDate: 'desc' },
    });
  }

  async acknowledgeSkillAssessment(assessmentId: string, comments?: string) {
    return this.prisma.skillAssessment.update({
      where: { id: assessmentId },
      data: {
        employeeAcknowledged: true,
        employeeAcknowledgedAt: new Date(),
        employeeComments: comments,
      },
    });
  }

  // ==========================================================================
  // CERTIFICATION TRACKING
  // ==========================================================================

  async createCertificationTracking(data: {
    trackingCode: string;
    employeeId: string;
    employeeName: string;
    employeeCode: string;
    department?: string;
    certificationName: string;
    certificationBody?: string;
    certificationId?: string;
    credentialId?: string;
    credentialUrl?: string;
    category: string;
    isRequired?: boolean;
    requiredFor?: string;
    earnedDate?: Date;
    expiryDate?: Date;
    renewalDate?: Date;
    status?: string;
    examCost?: number;
    renewalCost?: number;
    certificateUrl?: string;
    attachments?: any;
    companyId: string;
  }) {
    return this.prisma.certificationTracking.create({
      data: {
        ...data,
        verified: false,
        remindersSent: 0,
      },
    });
  }

  async getCertifications(companyId: string, options?: {
    employeeId?: string;
    category?: string;
    status?: string;
    expiringWithinDays?: number;
  }) {
    const where: any = { companyId, isActive: true };
    if (options?.employeeId) where.employeeId = options.employeeId;
    if (options?.category) where.category = options.category;
    if (options?.status) where.status = options.status;
    if (options?.expiringWithinDays) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + options.expiringWithinDays);
      where.expiryDate = { lte: futureDate, gte: new Date() };
    }

    return this.prisma.certificationTracking.findMany({
      where,
      orderBy: { expiryDate: 'asc' },
    });
  }

  async verifyCertification(certificationId: string, verifiedBy: string, notes?: string) {
    return this.prisma.certificationTracking.update({
      where: { id: certificationId },
      data: {
        verified: true,
        verifiedBy,
        verifiedAt: new Date(),
        verificationNotes: notes,
      },
    });
  }

  async renewCertification(certificationId: string, data: {
    newExpiryDate: Date;
    renewalCost?: number;
    certificateUrl?: string;
  }) {
    return this.prisma.certificationTracking.update({
      where: { id: certificationId },
      data: {
        expiryDate: data.newExpiryDate,
        renewalDate: new Date(),
        renewalCost: data.renewalCost,
        certificateUrl: data.certificateUrl,
        status: 'renewed',
        remindersSent: 0,
      },
    });
  }

  // ==========================================================================
  // TRAINING FEEDBACK
  // ==========================================================================

  async submitTrainingFeedback(data: {
    feedbackCode: string;
    programId: string;
    employeeId: string;
    employeeName?: string;
    isAnonymous?: boolean;
    scheduleId?: string;
    batchName?: string;
    trainingDate?: Date;
    overallRating: number;
    contentRating?: number;
    trainerRating?: number;
    materialRating?: number;
    venueRating?: number;
    relevanceRating?: number;
    detailedRatings?: any;
    whatWorkedWell?: string;
    whatCouldImprove?: string;
    suggestions?: string;
    additionalComments?: string;
    learningAchieved?: boolean;
    skillsGained?: string[];
    applicability?: string;
    recommendToOthers?: boolean;
    npsScore?: number;
    companyId: string;
  }) {
    const feedback = await this.prisma.trainingFeedback.create({
      data: {
        ...data,
        feedbackDate: new Date(),
      },
    });

    // Update enrollment feedback status
    if (data.scheduleId) {
      await this.prisma.trainingEnrollment.updateMany({
        where: {
          programId: data.programId,
          scheduleId: data.scheduleId,
          employeeId: data.employeeId,
        },
        data: {
          feedbackSubmitted: true,
          feedbackSubmittedAt: new Date(),
        },
      });
    }

    return feedback;
  }

  async getTrainingFeedback(companyId: string, options?: {
    programId?: string;
    scheduleId?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (options?.programId) where.programId = options.programId;
    if (options?.scheduleId) where.scheduleId = options.scheduleId;

    return this.prisma.trainingFeedback.findMany({
      where,
      include: {
        program: true,
      },
      orderBy: { feedbackDate: 'desc' },
    });
  }

  async getFeedbackSummary(companyId: string, programId: string) {
    const feedbacks = await this.prisma.trainingFeedback.findMany({
      where: { companyId, programId, isActive: true },
    });

    if (feedbacks.length === 0) return null;

    const avgOverall = feedbacks.reduce((sum, f) => sum + Number(f.overallRating), 0) / feedbacks.length;
    const avgContent = feedbacks.filter(f => f.contentRating).reduce((sum, f) => sum + Number(f.contentRating), 0) / feedbacks.filter(f => f.contentRating).length || 0;
    const avgTrainer = feedbacks.filter(f => f.trainerRating).reduce((sum, f) => sum + Number(f.trainerRating), 0) / feedbacks.filter(f => f.trainerRating).length || 0;
    const recommendPercent = (feedbacks.filter(f => f.recommendToOthers).length / feedbacks.length) * 100;
    const avgNPS = feedbacks.filter(f => f.npsScore !== null).reduce((sum, f) => sum + (f.npsScore || 0), 0) / feedbacks.filter(f => f.npsScore !== null).length || 0;

    return {
      totalResponses: feedbacks.length,
      averageOverallRating: avgOverall,
      averageContentRating: avgContent,
      averageTrainerRating: avgTrainer,
      recommendationPercent: recommendPercent,
      averageNPS: avgNPS,
    };
  }

  // ==========================================================================
  // TRAINING ASSESSMENTS
  // ==========================================================================

  async createTrainingAssessment(data: {
    assessmentCode: string;
    programId: string;
    assessmentName: string;
    assessmentType: string;
    description?: string;
    totalQuestions: number;
    totalMarks: number;
    passingMarks: number;
    passingPercent?: number;
    duration?: number;
    maxAttempts?: number;
    shuffleQuestions?: boolean;
    showResults?: boolean;
    questions?: any;
    availableFrom?: Date;
    availableTo?: Date;
    companyId: string;
  }) {
    return this.prisma.trainingAssessment.create({
      data: {
        ...data,
        status: 'active',
      },
    });
  }

  async startAssessmentAttempt(data: {
    attemptCode: string;
    assessmentId: string;
    employeeId: string;
    employeeName: string;
    employeeCode: string;
    attemptNumber: number;
    companyId: string;
  }) {
    const assessment = await this.prisma.trainingAssessment.findUnique({
      where: { id: data.assessmentId },
    });

    if (!assessment) throw new Error('Assessment not found');

    return this.prisma.trainingAssessmentAttempt.create({
      data: {
        ...data,
        startedAt: new Date(),
        totalMarks: assessment.totalMarks,
        status: 'in_progress',
      },
    });
  }

  async submitAssessmentAttempt(attemptId: string, responses: any) {
    const attempt = await this.prisma.trainingAssessmentAttempt.findUnique({
      where: { id: attemptId },
      include: { assessment: true },
    });

    if (!attempt) throw new Error('Attempt not found');

    // Calculate score (simplified - in real implementation, evaluate each response)
    let marksObtained = 0;
    const gradedResponses = responses.map((r: any) => {
      const isCorrect = r.isCorrect || false; // Should be evaluated based on correct answer
      if (isCorrect) marksObtained += r.marks || 0;
      return { ...r, isCorrect, marksObtained: isCorrect ? r.marks : 0 };
    });

    const percentage = (marksObtained / Number(attempt.totalMarks)) * 100;
    const isPassed = marksObtained >= Number(attempt.assessment.passingMarks);

    const startTime = new Date(attempt.startedAt).getTime();
    const duration = Math.round((Date.now() - startTime) / 60000);

    return this.prisma.trainingAssessmentAttempt.update({
      where: { id: attemptId },
      data: {
        responses: gradedResponses,
        submittedAt: new Date(),
        duration,
        marksObtained,
        percentage,
        isPassed,
        status: 'submitted',
      },
    });
  }

  // ==========================================================================
  // E-LEARNING COURSES
  // ==========================================================================

  async createELearningCourse(data: {
    courseCode: string;
    courseName: string;
    description?: string;
    category: string;
    subCategory?: string;
    difficultyLevel?: string;
    tags?: string[];
    durationHours: number;
    totalModules?: number;
    totalLessons?: number;
    curriculum?: any;
    thumbnailUrl?: string;
    previewUrl?: string;
    contentType?: string;
    instructorId?: string;
    instructorName?: string;
    instructorBio?: string;
    prerequisites?: any;
    targetAudience?: string[];
    hasAssessment?: boolean;
    passingScore?: number;
    certificateAwarded?: boolean;
    certificateName?: string;
    isFree?: boolean;
    price?: number;
    currency?: string;
    companyId: string;
  }) {
    return this.prisma.eLearningCourse.create({
      data: {
        ...data,
        status: 'draft',
        averageRating: 0,
        totalRatings: 0,
        totalEnrollments: 0,
        totalCompletions: 0,
      },
    });
  }

  async getELearningCourses(companyId: string, options?: {
    category?: string;
    difficultyLevel?: string;
    status?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (options?.category) where.category = options.category;
    if (options?.difficultyLevel) where.difficultyLevel = options.difficultyLevel;
    if (options?.status) where.status = options.status;

    return this.prisma.eLearningCourse.findMany({
      where,
      orderBy: { courseName: 'asc' },
    });
  }

  async enrollInCourse(courseId: string, employeeId: string, employeeName: string, employeeCode: string, enrollmentType: string, companyId: string) {
    const progress = await this.prisma.courseProgress.create({
      data: {
        courseId,
        employeeId,
        employeeName,
        employeeCode,
        enrollmentType,
        status: 'not_started',
        progressPercent: 0,
        completedModules: 0,
        completedLessons: 0,
        totalTimeSpent: 0,
        companyId,
      },
    });

    // Update course enrollment count
    await this.prisma.eLearningCourse.update({
      where: { id: courseId },
      data: { totalEnrollments: { increment: 1 } },
    });

    return progress;
  }

  async updateCourseProgress(progressId: string, data: {
    progressPercent?: number;
    completedModules?: number;
    completedLessons?: number;
    totalTimeSpent?: number;
    moduleProgress?: any;
    lessonProgress?: any;
    currentPosition?: any;
  }) {
    const progress = await this.prisma.courseProgress.update({
      where: { id: progressId },
      data: {
        ...data,
        status: data.progressPercent === 100 ? 'completed' : 'in_progress',
        startedAt: data.progressPercent && data.progressPercent > 0 ? new Date() : undefined,
        completedAt: data.progressPercent === 100 ? new Date() : undefined,
        lastAccessedAt: new Date(),
      },
    });

    // Update course completion count if completed
    if (data.progressPercent === 100) {
      await this.prisma.eLearningCourse.update({
        where: { id: progress.courseId },
        data: { totalCompletions: { increment: 1 } },
      });
    }

    return progress;
  }

  async getMyCourses(companyId: string, employeeId: string) {
    return this.prisma.courseProgress.findMany({
      where: { companyId, employeeId, isActive: true },
      include: {
        course: true,
      },
      orderBy: { lastAccessedAt: 'desc' },
    });
  }

  // ==========================================================================
  // TRAINING BUDGET
  // ==========================================================================

  async createTrainingBudget(data: {
    budgetCode: string;
    budgetType: string;
    departmentId?: string;
    departmentName?: string;
    employeeId?: string;
    employeeName?: string;
    fiscalYear: string;
    periodType?: string;
    periodStart: Date;
    periodEnd: Date;
    allocatedAmount: number;
    breakdown?: any;
    approvedBy?: string;
    notes?: string;
    companyId: string;
  }) {
    return this.prisma.trainingBudget.create({
      data: {
        ...data,
        utilizedAmount: 0,
        remainingAmount: data.allocatedAmount,
        reservedAmount: 0,
        status: 'active',
        approvedAt: data.approvedBy ? new Date() : undefined,
      },
    });
  }

  async getTrainingBudgets(companyId: string, options?: {
    budgetType?: string;
    departmentId?: string;
    fiscalYear?: string;
    status?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (options?.budgetType) where.budgetType = options.budgetType;
    if (options?.departmentId) where.departmentId = options.departmentId;
    if (options?.fiscalYear) where.fiscalYear = options.fiscalYear;
    if (options?.status) where.status = options.status;

    return this.prisma.trainingBudget.findMany({
      where,
      include: {
        costs: { orderBy: { costDate: 'desc' }, take: 10 },
      },
      orderBy: { periodStart: 'desc' },
    });
  }

  async recordTrainingCost(data: {
    costCode: string;
    budgetId?: string;
    costType: string;
    description: string;
    programId?: string;
    programName?: string;
    scheduleId?: string;
    employeeId?: string;
    employeeName?: string;
    departmentId?: string;
    departmentName?: string;
    amount: number;
    currency?: string;
    taxAmount?: number;
    vendorId?: string;
    vendorName?: string;
    invoiceNumber?: string;
    invoiceDate?: Date;
    costDate: Date;
    fiscalYear: string;
    attachments?: any;
    companyId: string;
  }) {
    const totalAmount = data.amount + (data.taxAmount || 0);

    const cost = await this.prisma.trainingCost.create({
      data: {
        ...data,
        totalAmount,
        status: 'incurred',
        paymentStatus: 'pending',
      },
    });

    // Update budget utilization
    if (data.budgetId) {
      await this.prisma.trainingBudget.update({
        where: { id: data.budgetId },
        data: {
          utilizedAmount: { increment: totalAmount },
          remainingAmount: { decrement: totalAmount },
        },
      });
    }

    return cost;
  }

  async approveCost(costId: string, approvedBy: string) {
    return this.prisma.trainingCost.update({
      where: { id: costId },
      data: {
        status: 'approved',
        paymentStatus: 'approved',
        approvedBy,
        approvedAt: new Date(),
      },
    });
  }

  // ==========================================================================
  // DASHBOARD & REPORTS
  // ==========================================================================

  async getTrainingDashboard(companyId: string, employeeId?: string) {
    const [
      activePrograms,
      upcomingSchedules,
      myEnrollments,
      pendingApprovals,
      certifications,
      coursesInProgress,
    ] = await Promise.all([
      this.prisma.trainingProgram.count({
        where: { companyId, isActive: true, status: 'active' },
      }),
      this.prisma.trainingSchedule.count({
        where: {
          companyId,
          isActive: true,
          status: 'scheduled',
          startDate: { gte: new Date() },
        },
      }),
      employeeId
        ? this.prisma.trainingEnrollment.count({
            where: {
              companyId,
              employeeId,
              isActive: true,
              status: { in: ['enrolled', 'in_progress'] },
            },
          })
        : 0,
      this.prisma.trainingEnrollment.count({
        where: { companyId, isActive: true, approvalStatus: 'pending' },
      }),
      employeeId
        ? this.prisma.certificationTracking.count({
            where: { companyId, employeeId, isActive: true, status: 'active' },
          })
        : 0,
      employeeId
        ? this.prisma.courseProgress.count({
            where: { companyId, employeeId, isActive: true, status: 'in_progress' },
          })
        : 0,
    ]);

    return {
      activePrograms,
      upcomingSchedules,
      myEnrollments,
      pendingApprovals,
      certifications,
      coursesInProgress,
    };
  }

  async getTrainingSummaryReport(companyId: string, fiscalYear: string) {
    const [programs, enrollments, completions, costs] = await Promise.all([
      this.prisma.trainingProgram.count({
        where: { companyId, isActive: true },
      }),
      this.prisma.trainingEnrollment.count({
        where: { companyId, isActive: true },
      }),
      this.prisma.trainingEnrollment.count({
        where: { companyId, isActive: true, status: 'completed' },
      }),
      this.prisma.trainingCost.aggregate({
        where: { companyId, isActive: true, fiscalYear },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      totalPrograms: programs,
      totalEnrollments: enrollments,
      totalCompletions: completions,
      completionRate: enrollments > 0 ? (completions / enrollments) * 100 : 0,
      totalCost: costs._sum.totalAmount || 0,
    };
  }

  async getEmployeeTrainingReport(companyId: string, employeeId: string) {
    const [enrollments, certifications, courses] = await Promise.all([
      this.prisma.trainingEnrollment.findMany({
        where: { companyId, employeeId, isActive: true },
        include: { program: true },
        orderBy: { enrollmentDate: 'desc' },
      }),
      this.prisma.certificationTracking.findMany({
        where: { companyId, employeeId, isActive: true },
        orderBy: { earnedDate: 'desc' },
      }),
      this.prisma.courseProgress.findMany({
        where: { companyId, employeeId, isActive: true },
        include: { course: true },
        orderBy: { lastAccessedAt: 'desc' },
      }),
    ]);

    const totalHours = enrollments.reduce((sum, e) => sum + Number(e.program?.durationHours || 0), 0);
    const completedCount = enrollments.filter((e) => e.status === 'completed').length;

    return {
      trainings: enrollments,
      certifications,
      courses,
      totalHours,
      completedTrainings: completedCount,
      activeCertifications: certifications.filter((c) => c.status === 'active').length,
    };
  }

  async getDepartmentTrainingReport(companyId: string, departmentId: string) {
    const enrollments = await this.prisma.trainingEnrollment.groupBy({
      by: ['status'],
      where: { companyId, department: departmentId, isActive: true },
      _count: true,
    });

    const byProgram = await this.prisma.trainingEnrollment.groupBy({
      by: ['programId'],
      where: { companyId, department: departmentId, isActive: true },
      _count: true,
    });

    return {
      enrollmentsByStatus: enrollments,
      enrollmentsByProgram: byProgram,
    };
  }
}
