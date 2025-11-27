import { Injectable } from '@nestjs/common';
import { CreateInstallationJobDto } from '../dto/create-installation-job.dto';
import { UpdateInstallationJobDto } from '../dto/update-installation-job.dto';
import {
  Installation as InstallationJob,
  InstallationStatus,
} from '../entities/installation.entity';

@Injectable()
export class InstallationsService {
  private jobs: InstallationJob[] = [];
  private idCounter = 1;

  create(createInstallationJobDto: CreateInstallationJobDto): InstallationJob {
    const job: InstallationJob = {
      id: `INSTALL-${String(this.idCounter++).padStart(6, '0')}`,
      installationNumber: `INS-${new Date().getFullYear()}-${String(this.idCounter).padStart(5, '0')}`,
      status: InstallationStatus.SCHEDULED,
      ...createInstallationJobDto,
      teamMembers: (createInstallationJobDto.teamMembers as any[]).map(m => typeof m === 'string' ? { engineerId: m, engineerName: 'Unknown', role: 'member' } : m),
      siteSurveyCompleted: false,
      siteReadiness: InstallationStatus.SCHEDULED as any, // Placeholder
      electricalReady: false,
      waterSupplyReady: false,
      gasSupplyReady: false,
      spaceReady: false,
      ventilationReady: false,
      drainageReady: false,
      siteSurveyRequired: true,
      unpackingCompleted: false,
      positioningCompleted: false,
      levelingCompleted: false,
      electricalConnectionCompleted: false,
      waterConnectionCompleted: false,
      gasConnectionCompleted: false,
      drainageConnectionCompleted: false,
      ventilationCompleted: false,
      functionalTestCompleted: false,
      performanceTestCompleted: false,
      safetyTestCompleted: false,
      trainingProvided: false,
      demonstrationCompleted: false,
      customerAcceptance: false,
      handoverCompleted: false,
      warrantyActivated: false,
      supportPeriod: 0,
      installationCost: 0,
      totalCost: 0,
      rescheduledCount: 0,
      createdBy: 'system',
      installationProgress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.jobs.push(job);
    return job;
  }

  findAll(filters?: {
    status?: string;
    customerId?: string;
    teamLeaderId?: string;
  }): InstallationJob[] {
    let filtered = [...this.jobs];

    if (filters?.status) {
      filtered = filtered.filter((j) => j.status === filters.status);
    }
    if (filters?.customerId) {
      filtered = filtered.filter((j) => j.customerId === filters.customerId);
    }
    if (filters?.teamLeaderId) {
      filtered = filtered.filter(
        (j) => j.teamLeaderId === filters.teamLeaderId,
      );
    }

    return filtered;
  }

  findOne(id: string): InstallationJob | null {
    return this.jobs.find((j) => j.id === id) || null;
  }

  update(
    id: string,
    updateInstallationJobDto: UpdateInstallationJobDto,
  ): InstallationJob | null {
    const index = this.jobs.findIndex((j) => j.id === id);
    if (index === -1) return null;

    this.jobs[index] = {
      ...this.jobs[index],
      ...updateInstallationJobDto,
      teamMembers: updateInstallationJobDto.teamMembers ? (updateInstallationJobDto.teamMembers as any[]).map(m => typeof m === 'string' ? { engineerId: m, engineerName: 'Unknown', role: 'member' } : m) : this.jobs[index].teamMembers,
      updatedAt: new Date(),
    };

    return this.jobs[index];
  }

  completeSiteSurvey(
    id: string,
    surveyedBy: string,
    siteReadiness: Record<string, any>,
    recommendations: string[],
  ): InstallationJob | null {
    const job = this.findOne(id);
    if (!job) return null;

    job.siteSurveyCompleted = true;
    job.siteSurveyDate = new Date();
    job.siteSurveyedBy = surveyedBy;
    job.siteReadiness = siteReadiness;
    job.sitePreparationRecommendations = recommendations;
    job.updatedAt = new Date();

    return job;
  }

  scheduleInstallation(
    id: string,
    scheduledDate: Date,
    estimatedDuration: number,
    teamLeaderId: string,
    teamLeaderName: string,
    teamMembers: string[],
    updatedBy: string,
  ): InstallationJob | null {
    const job = this.findOne(id);
    if (!job) return null;

    job.status = InstallationStatus.SCHEDULED;
    job.scheduledDate = scheduledDate;
    job.estimatedDuration = estimatedDuration;
    job.teamLeaderId = teamLeaderId;
    job.teamLeaderName = teamLeaderName;
    job.teamMembers = teamMembers.map(m => ({ engineerId: m, engineerName: 'Unknown', role: 'member' }));
    job.updatedBy = updatedBy;
    job.updatedAt = new Date();

    return job;
  }

  startInstallation(id: string, startedBy: string): InstallationJob | null {
    const job = this.findOne(id);
    if (!job) return null;

    job.status = InstallationStatus.IN_PROGRESS;
    job.actualStartDate = new Date();
    job.updatedBy = startedBy;
    job.updatedAt = new Date();

    return job;
  }

  completeInstallation(
    id: string,
    completedBy: string,
    testResults?: Record<string, any>,
    commissioningNotes?: string,
    trainingProvided?: boolean,
    documentationHandedOver?: string[],
  ): InstallationJob | null {
    const job = this.findOne(id);
    if (!job) return null;

    const now = new Date();
    job.status = InstallationStatus.COMPLETED;
    job.actualCompletionDate = now;
    job.installationProgress = 100;
    job.testResults = testResults;
    job.commissioningDate = now;
    job.commissioningNotes = commissioningNotes;
    job.trainingProvided = trainingProvided;
    job.documentationHandedOver = documentationHandedOver;
    job.updatedBy = completedBy;
    job.updatedAt = now;

    // Calculate actual duration
    if (job.actualStartDate) {
      const duration =
        (now.getTime() - job.actualStartDate.getTime()) / (1000 * 60 * 60); // in hours
      job.actualDuration = duration;
    }

    return job;
  }

  handoverToCustomer(
    id: string,
    customerSignature: string,
    customerFeedback?: string,
    handedOverBy?: string,
  ): InstallationJob | null {
    const job = this.findOne(id);
    if (!job) return null;

    job.status = InstallationStatus.HANDED_OVER;
    job.handoverDate = new Date();
    job.customerSignature = customerSignature;
    job.customerFeedback = customerFeedback;
    job.handedOverBy = handedOverBy;
    job.updatedAt = new Date();

    return job;
  }

  cancelInstallation(
    id: string,
    cancellationReason: string,
    cancelledBy: string,
  ): InstallationJob | null {
    const job = this.findOne(id);
    if (!job) return null;

    job.status = InstallationStatus.CANCELLED;
    job.cancellationDate = new Date();
    job.cancellationReason = cancellationReason;
    job.updatedBy = cancelledBy;
    job.updatedAt = new Date();

    return job;
  }

  getScheduledJobs(startDate?: Date, endDate?: Date): InstallationJob[] {
    let filtered = this.jobs.filter(
      (job) =>
        job.status === InstallationStatus.SCHEDULED && job.scheduledDate,
    );

    if (startDate) {
      filtered = filtered.filter(
        (job) => job.scheduledDate && job.scheduledDate >= startDate,
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (job) => job.scheduledDate && job.scheduledDate <= endDate,
      );
    }

    return filtered.sort(
      (a, b) =>
        (a.scheduledDate?.getTime() || 0) - (b.scheduledDate?.getTime() || 0),
    );
  }

  getStatistics() {
    const total = this.jobs.length;
    const scheduled = this.jobs.filter(
      (j) => j.status === InstallationStatus.SCHEDULED,
    ).length;
    const inProgress = this.jobs.filter(
      (j) => j.status === InstallationStatus.IN_PROGRESS,
    ).length;
    const completed = this.jobs.filter(
      (j) => j.status === InstallationStatus.COMPLETED,
    ).length;
    const handedOver = this.jobs.filter(
      (j) => j.status === InstallationStatus.HANDED_OVER,
    ).length;

    // Calculate average installation time
    const completedJobs = this.jobs.filter(
      (j) => j.actualDuration !== undefined,
    );
    const averageInstallationTime =
      completedJobs.length > 0
        ? completedJobs.reduce((sum, j) => sum + (j.actualDuration || 0), 0) /
        completedJobs.length
        : 0;

    // Calculate on-time completion rate
    const jobsWithSchedule = this.jobs.filter(
      (j) =>
        j.scheduledDate &&
        j.actualCompletionDate &&
        j.status === InstallationStatus.COMPLETED,
    );
    const onTimeJobs = jobsWithSchedule.filter((j) => {
      if (!j.scheduledDate || !j.actualCompletionDate) return false;
      const scheduledEnd = new Date(j.scheduledDate);
      scheduledEnd.setHours(
        scheduledEnd.getHours() + (j.estimatedDuration || 0),
      );
      return j.actualCompletionDate <= scheduledEnd;
    });

    return {
      totalJobs: total,
      scheduledJobs: scheduled,
      inProgressJobs: inProgress,
      completedJobs: completed,
      handedOverJobs: handedOver,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      onTimeCompletionRate:
        jobsWithSchedule.length > 0
          ? (onTimeJobs.length / jobsWithSchedule.length) * 100
          : 0,
      averageInstallationTime,
      siteSurveyCompletionRate:
        total > 0
          ? (this.jobs.filter((j) => j.siteSurveyCompleted).length / total) *
          100
          : 0,
    };
  }

  remove(id: string): { message: string } {
    const index = this.jobs.findIndex((j) => j.id === id);
    if (index === -1) {
      return { message: 'Installation job not found' };
    }

    this.jobs.splice(index, 1);
    return { message: 'Installation job deleted successfully' };
  }
}
