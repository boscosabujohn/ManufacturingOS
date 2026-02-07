import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductionLog, OperationType } from '../entities/production-log.entity';
import { NestingAsset } from '../entities/nesting-asset.entity';
import { TrialReport } from '../entities/trial-report.entity';

@Injectable()
export class ProductionService {
    constructor(
        @InjectRepository(ProductionLog)
        private logRepository: Repository<ProductionLog>,
        @InjectRepository(NestingAsset)
        private nestingRepository: Repository<NestingAsset>,
        @InjectRepository(TrialReport)
        private trialRepository: Repository<TrialReport>,
    ) { }

    // --- Production Logging & Governance ---

    async logOperation(data: Partial<ProductionLog>): Promise<ProductionLog> {
        // Governance: Rule 5.6 & 5.7
        // If bending (5.7) is requested, check if etching (5.6) is completed
        if (data.operationType === OperationType.BENDING) {
            const etchingComplete = await this.logRepository.findOne({
                where: {
                    projectId: data.projectId,
                    operationType: OperationType.ETCHING,
                }
            });

            if (!etchingComplete) {
                throw new BadRequestException('HARD GATE: Logo Etching (Operation 5.6) must be verified before Bending.');
            }
        }

        const log = this.logRepository.create(data);
        return this.logRepository.save(log);
    }

    // --- OEE Calculation Logic ---

    async calculateMachineOEE(machineId: string, startDate: Date, endDate: Date): Promise<any> {
        const logs = await this.logRepository.find({
            where: { machineId }
        });

        // Simple mock OEE calculation
        const totalLogs = logs.length;
        if (totalLogs === 0) return { availability: 0, performance: 0, quality: 0, oee: 0 };

        const totalYield = logs.reduce((sum, log) => sum + log.yieldCount, 0);
        const totalRejects = logs.reduce((sum, log) => sum + log.rejectCount, 0);

        const availability = 0.92; // Mock: 92% uptime
        const performance = 0.88; // Mock: 88% speed
        const quality = totalYield / (totalYield + totalRejects) || 1;

        const oee = availability * performance * quality;

        return {
            availability: availability * 100,
            performance: performance * 100,
            quality: quality * 100,
            oee: oee * 100
        };
    }

    // --- Nesting & Drawings ---

    async getNestingAssets(projectId: string): Promise<NestingAsset[]> {
        return this.nestingRepository.find({ where: { projectId }, order: { revision: 'DESC' } });
    }

    // --- Trial Reports ---

    async createTrialReport(projectId: string, inspectedBy: string): Promise<TrialReport> {
        const report = this.trialRepository.create({ projectId, inspectedBy });
        return this.trialRepository.save(report);
    }

    async updateTrialResult(id: string, result: string, notes: string): Promise<TrialReport> {
        const report = await this.trialRepository.findOne({ where: { id } });
        if (!report) throw new NotFoundException('Trial report not found');
        report.result = result;
        report.notes = notes;
        return this.trialRepository.save(report);
    }
}
