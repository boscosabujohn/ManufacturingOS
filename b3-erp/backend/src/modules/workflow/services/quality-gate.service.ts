
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QualityGate } from '../entities/quality-gate.entity';
import { QualityGateItem } from '../entities/quality-gate-item.entity';
import { Defect } from '../entities/defect.entity';
import { EventBusService } from './event-bus.service';
import { WorkflowEventType, InspectionEventPayload } from '../events/event-types';

@Injectable()
export class QualityGateService {
    private readonly logger = new Logger(QualityGateService.name);

    constructor(
        @InjectRepository(QualityGate)
        private gateRepository: Repository<QualityGate>,
        @InjectRepository(QualityGateItem)
        private itemRepository: Repository<QualityGateItem>,
        @InjectRepository(Defect)
        private defectRepository: Repository<Defect>,
        private readonly eventBusService: EventBusService,
    ) { }

    /**
     * Create a new quality gate
     */
    async createQualityGate(
        projectId: string,
        phase: number,
        gateType: 'material_qa' | 'production_qc' | 'final_qc' | 'installation_review',
        items: { description: string; metadata?: any }[],
        inspectorId?: string,
    ): Promise<QualityGate> {
        const gate = this.gateRepository.create({
            projectId,
            phase,
            gateType,
            inspectorId,
            status: 'pending',
        });

        const savedGate = await this.gateRepository.save(gate);

        const gateItems = items.map((item) =>
            this.itemRepository.create({
                qualityGateId: savedGate.id,
                itemDescription: item.description,
                metadata: item.metadata,
            }),
        );

        await this.itemRepository.save(gateItems);

        return this.getQualityGate(savedGate.id);
    }

    /**
     * Update a checklist item
     */
    async updateChecklistItem(
        itemId: string,
        passed: boolean,
        comments?: string,
        photos?: string[],
    ): Promise<QualityGateItem> {
        const item = await this.itemRepository.findOne({ where: { id: itemId } });
        if (!item) {
            throw new NotFoundException(`Quality gate item ${itemId} not found`);
        }

        item.passed = passed;
        item.comments = comments;
        item.photos = photos;

        return this.itemRepository.save(item);
    }

    /**
     * Finalize quality gate inspection
     */
    async finalizeInspection(gateId: string, passed: boolean, userId: string, comments?: string): Promise<QualityGate> {
        const gate = await this.getQualityGate(gateId);

        // Validate all items are checked if passing
        if (passed) {
            const uncheckedItems = gate.items.filter((i) => i.passed === null || i.passed === undefined);
            if (uncheckedItems.length > 0) {
                throw new BadRequestException('All checklist items must be verified before passing inspection');
            }

            const failedItems = gate.items.filter((i) => i.passed === false);
            if (failedItems.length > 0) {
                throw new BadRequestException('Cannot pass inspection with failed checklist items');
            }
        }

        gate.passed = passed;
        gate.status = passed ? 'passed' : 'failed';
        gate.inspectionDate = new Date();
        gate.comments = comments;

        const savedGate = await this.gateRepository.save(gate);

        // Emit event
        const eventType = passed ? WorkflowEventType.INSPECTION_PASSED : WorkflowEventType.INSPECTION_FAILED;
        await this.eventBusService.emit<InspectionEventPayload>(eventType, {
            inspectionId: gate.id,
            inspectionNumber: gate.id, // Use ID as number for now
            referenceType: 'production', // Simplified
            referenceId: gate.projectId,
            itemId: 'PROJECT', // Simplified
            itemName: 'Project Phase ' + gate.phase,
            quantity: 1,
            unit: 'unit',
            result: passed ? 'passed' : 'failed',
            userId,
        });

        return savedGate;
    }

    /**
     * Report a defect
     */
    async reportDefect(
        projectId: string,
        qualityGateId: string | null,
        severity: 'critical' | 'major' | 'minor',
        description: string,
        location?: string,
        assignedTo?: string,
        photos?: string[],
        userId?: string,
    ): Promise<Defect> {
        const defect = this.defectRepository.create({
            projectId,
            qualityGateId,
            severity,
            description,
            location,
            assignedTo,
            photos,
            status: 'open',
        });

        const savedDefect = await this.defectRepository.save(defect);

        // Emit event
        await this.eventBusService.emit<InspectionEventPayload>(WorkflowEventType.NCR_CREATED, {
            inspectionId: qualityGateId || 'ADHOC',
            inspectionNumber: qualityGateId || 'ADHOC',
            referenceType: 'production',
            referenceId: projectId,
            itemId: 'DEFECT',
            itemName: description,
            quantity: 1,
            unit: 'unit',
            defects: [{ type: description, quantity: 1, severity }],
            userId: userId || 'SYSTEM',
        });

        return savedDefect;
    }

    /**
     * Resolve a defect
     */
    async resolveDefect(
        defectId: string,
        resolutionNotes: string,
        resolvedBy: string,
    ): Promise<Defect> {
        const defect = await this.defectRepository.findOne({ where: { id: defectId } });
        if (!defect) {
            throw new NotFoundException(`Defect ${defectId} not found`);
        }

        defect.status = 'resolved';
        defect.resolutionNotes = resolutionNotes;
        defect.resolvedBy = resolvedBy;
        defect.resolvedAt = new Date();

        const savedDefect = await this.defectRepository.save(defect);

        // Emit event
        await this.eventBusService.emit<InspectionEventPayload>(WorkflowEventType.NCR_RESOLVED, {
            inspectionId: defect.qualityGateId || 'ADHOC',
            inspectionNumber: defect.qualityGateId || 'ADHOC',
            referenceType: 'production',
            referenceId: defect.projectId,
            itemId: 'DEFECT',
            itemName: defect.description,
            quantity: 1,
            unit: 'unit',
            userId: resolvedBy,
        });

        return savedDefect;
    }

    async getQualityGate(id: string): Promise<QualityGate> {
        const gate = await this.gateRepository.findOne({
            where: { id },
            relations: ['items', 'defects'],
        });
        if (!gate) {
            throw new NotFoundException(`Quality gate ${id} not found`);
        }
        return gate;
    }

    async getProjectQualityGates(projectId: string): Promise<QualityGate[]> {
        return this.gateRepository.find({
            where: { projectId },
            relations: ['items', 'defects'],
            order: { phase: 'ASC' },
        });
    }
}
