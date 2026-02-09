import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DispatchRecord, DispatchStatus } from '../entities/dispatch-record.entity';
import { SiteReadiness, ReadinessStatus } from '../entities/site-readiness.entity';
import { InstallationTask, InstallationStatus } from '../entities/installation-task.entity';
import { PackagingCrate, CrateStatus } from '../entities/packaging-crate.entity';
import { DailyInstallReport } from '../entities/daily-install-report.entity';

@Injectable()
export class LogisticsInstallationService {
    constructor(
        @InjectRepository(DispatchRecord)
        private dispatchRepository: Repository<DispatchRecord>,
        @InjectRepository(SiteReadiness)
        private readinessRepository: Repository<SiteReadiness>,
        @InjectRepository(InstallationTask)
        private installationRepository: Repository<InstallationTask>,
        @InjectRepository(PackagingCrate)
        private crateRepository: Repository<PackagingCrate>,
        @InjectRepository(DailyInstallReport)
        private dailyReportRepository: Repository<DailyInstallReport>,
    ) { }

    // --- Site Readiness ---

    async getReadiness(projectId: string): Promise<SiteReadiness[]> {
        return this.readinessRepository.find({ where: { projectId } });
    }

    async updateReadiness(id: string, status: ReadinessStatus, verifiedBy: string): Promise<SiteReadiness> {
        const check = await this.readinessRepository.findOne({ where: { id } });
        if (!check) throw new NotFoundException('Readiness check not found');
        check.status = status;
        check.verifiedBy = verifiedBy;
        return this.readinessRepository.save(check);
    }

    // --- Dispatch Logic ---

    async checkReadinessForDispatch(projectId: string): Promise<boolean> {
        const checks = await this.readinessRepository.find({ where: { projectId } });
        return checks.every(c => c.status === ReadinessStatus.READY);
    }

    async createDispatch(data: Partial<DispatchRecord>): Promise<DispatchRecord> {
        if (!data.projectId) throw new BadRequestException('Project ID is required');
        const ready = await this.checkReadinessForDispatch(data.projectId);
        if (!ready) {
            throw new BadRequestException('HARD GATE: Site is not READY for dispatch. Please complete all readiness checks.');
        }

        const record = this.dispatchRepository.create(data);
        const saved = await this.dispatchRepository.save(record);

        // Transition project crates to In Transit
        await this.crateRepository.update({ projectId: data.projectId }, { status: CrateStatus.DISPATCHED });

        return saved;
    }

    // --- Field Installation ---

    async getInstallerTasks(projectId: string): Promise<InstallationTask[]> {
        return this.installationRepository.find({ where: { projectId }, order: { createdAt: 'ASC' } });
    }

    async updateInstallationProgress(id: string, progress: number, status: InstallationStatus): Promise<InstallationTask> {
        const task = await this.installationRepository.findOne({ where: { id } });
        if (!task) throw new NotFoundException('Task not found');
        task.progress = progress;
        task.status = status;
        return this.installationRepository.save(task);
    }

    // --- Daily Progress & Cleaning ---

    async createDailyReport(data: Partial<DailyInstallReport>): Promise<DailyInstallReport> {
        const report = this.dailyReportRepository.create(data);
        const saved = await this.dailyReportRepository.save(report);

        if (data.isClientNotified) {
            await this.notifyClientOfProgress(saved.id);
        }

        return saved;
    }

    async getDailyReports(projectId: string): Promise<DailyInstallReport[]> {
        return this.dailyReportRepository.find({
            where: { projectId },
            order: { reportDate: 'DESC' },
        });
    }

    async notifyClientOfProgress(reportId: string): Promise<void> {
        const report = await this.dailyReportRepository.findOne({
            where: { id: reportId },
            relations: ['project']
        });
        if (!report) throw new NotFoundException('Report not found');

        // Simulate notification (e.g., sending an email/portal update)
        console.log(`[SIMULATION] Sending daily digest to client ${report.project?.clientContactEmail} for project ${report.project?.name}`);

        report.isClientNotified = true;
        await this.dailyReportRepository.save(report);
    }
}
