import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiscrepancyLog, DiscrepancyStatus } from '../../project/entities/discrepancy-log.entity';
import { SiteSurvey } from '../../project/entities/site-survey.entity';
import { ExternalApproval, ApprovalStatus } from '../../project/entities/external-approval.entity';
import { Project } from '../../project/entities/project.entity';
import { BOQItem } from '../../project/entities/boq-item.entity';
import * as crypto from 'crypto';

@Injectable()
export class DesignVerificationService {
    constructor(
        @InjectRepository(DiscrepancyLog)
        private discrepancyRepository: Repository<DiscrepancyLog>,
        @InjectRepository(SiteSurvey)
        private surveyRepository: Repository<SiteSurvey>,
        @InjectRepository(ExternalApproval)
        private approvalRepository: Repository<ExternalApproval>,
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        @InjectRepository(BOQItem)
        private boqItemRepository: Repository<BOQItem>,
    ) { }

    // --- Discrepancy Log Methods ---

    async getDiscrepancies(projectId: string): Promise<DiscrepancyLog[]> {
        return this.discrepancyRepository.find({
            where: { projectId },
            order: { createdAt: 'DESC' },
        });
    }

    async createDiscrepancy(data: Partial<DiscrepancyLog>): Promise<DiscrepancyLog> {
        const log = this.discrepancyRepository.create(data);
        return this.discrepancyRepository.save(log);
    }

    async resolveDiscrepancy(id: string, resolvedBy: string, notes: string): Promise<DiscrepancyLog> {
        const log = await this.discrepancyRepository.findOne({ where: { id } });
        if (!log) throw new NotFoundException('Discrepancy log not found');

        log.status = DiscrepancyStatus.RESOLVED;
        log.resolvedBy = resolvedBy;
        log.resolvedAt = new Date();
        log.resolutionNotes = notes;

        return this.discrepancyRepository.save(log);
    }

    // --- Site Survey Methods ---

    async getSurveys(projectId: string): Promise<SiteSurvey[]> {
        return this.surveyRepository.find({
            where: { projectId },
            order: { date: 'DESC' },
        });
    }

    async createSurvey(data: Partial<SiteSurvey>): Promise<SiteSurvey> {
        const survey = this.surveyRepository.create(data);
        return this.surveyRepository.save(survey);
    }

    // --- External Approval Methods ---

    async createApprovalRequest(projectId: string, attachmentId: string, clientEmail: string): Promise<ExternalApproval> {
        const magicToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

        const approval = this.approvalRepository.create({
            projectId,
            attachmentId,
            clientEmail,
            magicToken,
            status: ApprovalStatus.SENT,
            expiresAt,
        });

        return this.approvalRepository.save(approval);
    }

    async getApprovalByToken(token: string): Promise<ExternalApproval> {
        const approval = await this.approvalRepository.findOne({
            where: { magicToken: token },
            relations: ['project'],
        });

        if (!approval) throw new NotFoundException('Invalid or expired approval token');

        if (approval.status === ApprovalStatus.SENT) {
            approval.status = ApprovalStatus.VIEWED;
            await this.approvalRepository.save(approval);
        }

        return approval;
    }

    async submitApproval(token: string, status: ApprovalStatus, signatureUrl?: string, comments?: string): Promise<ExternalApproval> {
        const approval = await this.approvalRepository.findOne({ where: { magicToken: token } });
        if (!approval) throw new NotFoundException('Invalid token');

        approval.status = status;
        approval.signatureUrl = signatureUrl;
        approval.comments = comments;

        return this.approvalRepository.save(approval);
    }

    // --- Automated Detection (Simplified) ---

    async detectDiscrepancies(projectId: string): Promise<number> {
        const boqItems = await this.boqItemRepository.find({ where: { boq: { projectId } } });
        // Simplified detection logic: Flag if any item has quantity 0 or rate 0
        let found = 0;
        for (const item of boqItems) {
            if (item.quantity <= 0 || item.rate <= 0) {
                await this.createDiscrepancy({
                    projectId,
                    type: 'BOQ_VS_DWG' as any,
                    description: `Invalid BOQ Item: ${item.description}. Qty: ${item.quantity}, Rate: ${item.rate}`,
                    severity: 'HIGH' as any,
                });
                found++;
            }
        }
        return found;
    }
}
