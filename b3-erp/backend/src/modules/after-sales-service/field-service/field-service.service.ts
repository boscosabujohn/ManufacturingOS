import { Injectable } from '@nestjs/common';
import { CreateFieldServiceJobDto } from '../dto/create-field-service-job.dto';
import { UpdateFieldServiceJobDto } from '../dto/update-field-service-job.dto';
import {
  FieldServiceJob,
  FieldServiceStatus,
  ServiceReport,
} from '../entities/field-service.entity';

@Injectable()
export class FieldServiceService {
  private jobs: FieldServiceJob[] = [];
  private reports: ServiceReport[] = [];
  private jobIdCounter = 1;
  private reportIdCounter = 1;

  createJob(createFieldServiceJobDto: CreateFieldServiceJobDto): FieldServiceJob {
    const job: FieldServiceJob = {
      id: `FSJ-${String(this.jobIdCounter++).padStart(6, '0')}`,
      jobNumber: `FS-${new Date().getFullYear()}-${String(this.jobIdCounter).padStart(6, '0')}`,
      status: FieldServiceStatus.SCHEDULED,
      ...createFieldServiceJobDto,
      travelDistance: 0,
      totalPartsValue: 0,
      totalLaborCost: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.jobs.push(job);
    return job;
  }

  findAllJobs(filters?: {
    status?: string;
    engineerId?: string;
    customerId?: string;
  }): FieldServiceJob[] {
    let filtered = [...this.jobs];

    if (filters?.status) {
      filtered = filtered.filter((j) => j.status === filters.status);
    }
    if (filters?.engineerId) {
      filtered = filtered.filter((j) => j.engineerId === filters.engineerId);
    }
    if (filters?.customerId) {
      filtered = filtered.filter((j) => j.customerId === filters.customerId);
    }

    return filtered;
  }

  findOneJob(id: string): FieldServiceJob | null {
    return this.jobs.find((j) => j.id === id) || null;
  }

  updateJob(
    id: string,
    updateFieldServiceJobDto: UpdateFieldServiceJobDto,
  ): FieldServiceJob | null {
    const index = this.jobs.findIndex((j) => j.id === id);
    if (index === -1) return null;

    this.jobs[index] = {
      ...this.jobs[index],
      ...updateFieldServiceJobDto,
      updatedAt: new Date(),
    };

    return this.jobs[index];
  }

  assignEngineer(
    id: string,
    engineerId: string,
    engineerName: string,
    assignedBy: string,
  ): FieldServiceJob | null {
    const job = this.findOneJob(id);
    if (!job) return null;

    job.engineerId = engineerId;
    job.engineerName = engineerName;
    job.assignmentDate = new Date();
    job.updatedBy = assignedBy;
    job.updatedAt = new Date();

    return job;
  }

  dispatchJob(id: string, dispatchedBy: string): FieldServiceJob | null {
    const job = this.findOneJob(id);
    if (!job) return null;

    job.status = FieldServiceStatus.DISPATCHED;
    job.dispatchTime = new Date();
    job.updatedBy = dispatchedBy;
    job.updatedAt = new Date();

    return job;
  }

  checkIn(
    id: string,
    engineerId: string,
    location?: { latitude: number; longitude: number },
    notes?: string,
  ): FieldServiceJob | null {
    const job = this.findOneJob(id);
    if (!job) return null;

    if (job.engineerId !== engineerId) {
      throw new Error('Only assigned engineer can check in');
    }

    const now = new Date();
    job.status = FieldServiceStatus.IN_PROGRESS;
    job.checkInTime = now;
    job.checkInLocation = location;
    job.actualStartTime = now;
    job.updatedAt = now;

    return job;
  }

  checkOut(
    id: string,
    engineerId: string,
    location?: { latitude: number; longitude: number },
    workSummary?: string,
  ): FieldServiceJob | null {
    const job = this.findOneJob(id);
    if (!job) return null;

    if (job.engineerId !== engineerId) {
      throw new Error('Only assigned engineer can check out');
    }

    const now = new Date();
    job.checkOutTime = now;
    job.checkOutLocation = location;
    job.actualEndTime = now;
    job.updatedAt = now;

    // Calculate actual duration
    if (job.actualStartTime) {
      const duration =
        (now.getTime() - job.actualStartTime.getTime()) / (1000 * 60 * 60); // in hours
      job.actualDuration = duration;
    }

    return job;
  }

  recordPartsConsumed(
    id: string,
    parts: Array<{
      partId: string;
      partName: string;
      quantity: number;
      unitPrice: number;
    }>,
    recordedBy: string,
  ): FieldServiceJob | null {
    const job = this.findOneJob(id);
    if (!job) return null;

    job.partsConsumed = parts;
    job.totalPartsValue = parts.reduce(
      (sum, part) => sum + part.quantity * part.unitPrice,
      0,
    );
    job.updatedBy = recordedBy;
    job.updatedAt = new Date();

    return job;
  }

  submitServiceReport(
    id: string,
    reportData: {
      workPerformed: string;
      partsReplaced?: string[];
      issuesFound?: string[];
      recommendations?: string[];
      customerSignature?: string;
      customerFeedback?: string;
      photos?: string[];
      submittedBy: string;
    },
  ): ServiceReport {
    const job = this.findOneJob(id);
    if (!job) {
      throw new Error('Job not found');
    }

    const report: ServiceReport = {
      id: `SR-${String(this.reportIdCounter++).padStart(6, '0')}`,
      reportNumber: `SRPT-${new Date().getFullYear()}-${String(this.reportIdCounter).padStart(6, '0')}`,
      jobId: id,
      jobNumber: job.jobNumber,
      engineerId: job.engineerId!,
      engineerName: job.engineerName!,
      customerId: job.customerId,
      customerName: job.customerName,
      serviceDate: job.actualStartTime || new Date(),
      ...reportData,
      reportStatus: 'submitted',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.reports.push(report);

    // Update job with report reference
    job.serviceReportId = report.id;
    job.updatedAt = new Date();

    return report;
  }

  completeJob(
    id: string,
    completedBy: string,
    completionNotes?: string,
  ): FieldServiceJob | null {
    const job = this.findOneJob(id);
    if (!job) return null;

    job.status = FieldServiceStatus.COMPLETED;
    job.completionDate = new Date();
    job.completionNotes = completionNotes;
    job.updatedBy = completedBy;
    job.updatedAt = new Date();

    return job;
  }

  cancelJob(
    id: string,
    cancellationReason: string,
    cancelledBy: string,
  ): FieldServiceJob | null {
    const job = this.findOneJob(id);
    if (!job) return null;

    job.status = FieldServiceStatus.CANCELLED;
    job.cancellationDate = new Date();
    job.cancellationReason = cancellationReason;
    job.updatedBy = cancelledBy;
    job.updatedAt = new Date();

    return job;
  }

  getScheduledJobs(engineerId?: string, date?: Date): FieldServiceJob[] {
    let filtered = this.jobs.filter(
      (job) =>
        job.status === FieldServiceStatus.SCHEDULED ||
        job.status === FieldServiceStatus.DISPATCHED,
    );

    if (engineerId) {
      filtered = filtered.filter((job) => job.engineerId === engineerId);
    }

    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      filtered = filtered.filter((job) => {
        if (!job.scheduledDate) return false;
        const jobDate = new Date(job.scheduledDate);
        jobDate.setHours(0, 0, 0, 0);
        return jobDate >= targetDate && jobDate < nextDay;
      });
    }

    return filtered.sort(
      (a, b) =>
        (a.scheduledDate?.getTime() || 0) - (b.scheduledDate?.getTime() || 0),
    );
  }

  getEngineerSchedule(
    engineerId: string,
    startDate?: Date,
    endDate?: Date,
  ): FieldServiceJob[] {
    let filtered = this.jobs.filter((job) => job.engineerId === engineerId);

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

  getEngineerPerformance(engineerId: string) {
    const engineerJobs = this.jobs.filter((job) => job.engineerId === engineerId);
    const completedJobs = engineerJobs.filter(
      (job) => job.status === FieldServiceStatus.COMPLETED,
    );

    // Calculate average job duration
    const jobsWithDuration = completedJobs.filter(
      (job) => job.actualDuration !== undefined,
    );
    const averageJobDuration =
      jobsWithDuration.length > 0
        ? jobsWithDuration.reduce((sum, job) => sum + (job.actualDuration || 0), 0) /
          jobsWithDuration.length
        : 0;

    // Calculate on-time completion rate
    const onTimeJobs = completedJobs.filter((job) => {
      if (!job.scheduledDate || !job.completionDate) return false;
      const scheduledEnd = new Date(job.scheduledDate);
      scheduledEnd.setHours(
        scheduledEnd.getHours() + (job.estimatedDuration || 0),
      );
      return job.completionDate <= scheduledEnd;
    });

    // Get engineer's service reports
    const engineerReports = this.reports.filter(
      (report) => report.engineerId === engineerId,
    );

    return {
      totalJobs: engineerJobs.length,
      completedJobs: completedJobs.length,
      inProgressJobs: engineerJobs.filter(
        (job) => job.status === FieldServiceStatus.IN_PROGRESS,
      ).length,
      scheduledJobs: engineerJobs.filter(
        (job) => job.status === FieldServiceStatus.SCHEDULED,
      ).length,
      completionRate:
        engineerJobs.length > 0
          ? (completedJobs.length / engineerJobs.length) * 100
          : 0,
      onTimeCompletionRate:
        completedJobs.length > 0
          ? (onTimeJobs.length / completedJobs.length) * 100
          : 0,
      averageJobDuration,
      totalReports: engineerReports.length,
    };
  }

  getStatistics() {
    const total = this.jobs.length;
    const scheduled = this.jobs.filter(
      (j) => j.status === FieldServiceStatus.SCHEDULED,
    ).length;
    const dispatched = this.jobs.filter(
      (j) => j.status === FieldServiceStatus.DISPATCHED,
    ).length;
    const inProgress = this.jobs.filter(
      (j) => j.status === FieldServiceStatus.IN_PROGRESS,
    ).length;
    const completed = this.jobs.filter(
      (j) => j.status === FieldServiceStatus.COMPLETED,
    ).length;

    // Calculate average job duration
    const jobsWithDuration = this.jobs.filter(
      (j) => j.actualDuration !== undefined,
    );
    const averageJobDuration =
      jobsWithDuration.length > 0
        ? jobsWithDuration.reduce((sum, j) => sum + (j.actualDuration || 0), 0) /
          jobsWithDuration.length
        : 0;

    // Total parts value
    const totalPartsValue = this.jobs.reduce(
      (sum, j) => sum + (j.totalPartsValue || 0),
      0,
    );

    return {
      totalJobs: total,
      scheduledJobs: scheduled,
      dispatchedJobs: dispatched,
      inProgressJobs: inProgress,
      completedJobs: completed,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      averageJobDuration,
      totalServiceReports: this.reports.length,
      totalPartsValue,
    };
  }

  removeJob(id: string): { message: string } {
    const index = this.jobs.findIndex((j) => j.id === id);
    if (index === -1) {
      return { message: 'Field service job not found' };
    }

    this.jobs.splice(index, 1);
    return { message: 'Field service job deleted successfully' };
  }
}
