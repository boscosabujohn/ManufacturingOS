
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProjectPhase } from '../entities/project-phase.entity';
import { PhaseTransition } from '../entities/phase-transition.entity';
import { QualityGateService } from './quality-gate.service';
import { DocumentService } from './document.service';

@Injectable()
export class StateMachineService {
    constructor(
        @InjectRepository(ProjectPhase)
        private phaseRepository: Repository<ProjectPhase>,
        @InjectRepository(PhaseTransition)
        private transitionRepository: Repository<PhaseTransition>,
        private eventEmitter: EventEmitter2,
        private qualityGateService: QualityGateService,
        private documentService: DocumentService,
    ) { }

    // ... (rest of the class)

    async validateTransition(projectId: string, fromPhase: number, toPhase: number): Promise<boolean> {
        // Basic validation: sequential progression
        if (toPhase !== fromPhase + 1 && toPhase !== fromPhase - 1) {
            if (toPhase > fromPhase + 1) {
                throw new BadRequestException(`Cannot skip phases. Current: ${fromPhase}, Target: ${toPhase}`);
            }
        }

        // Phase-specific validation rules
        switch (toPhase) {
            case 2: // Site & Design
                // Requirement: Project must be initiated (implicit if we are in phase 1)
                break;
            case 3: // Technical
                // Requirement: Site measurements must be uploaded
                const hasMeasurements = await this.documentService.checkDocumentExists(projectId, 'site_measurements');
                if (!hasMeasurements) {
                    throw new BadRequestException('Site measurements document is required for Technical phase.');
                }
                break;
            case 4: // Procurement
                // Requirement: BOM and Technical Drawings must be ready
                const hasBOM = await this.documentService.checkDocumentExists(projectId, 'bom');
                const hasDrawings = await this.documentService.checkDocumentExists(projectId, 'technical_drawings');

                if (!hasBOM || !hasDrawings) {
                    throw new BadRequestException('BOM and Technical Drawings are required for Procurement phase.');
                }
                break;
            case 5: // Production
                // Requirement: POs issued and materials received (at least partially)
                // Check Material QA Gate
                await this.checkQualityGate(projectId, 4, 'material_qa');
                break;
            case 6: // Quality
                // Requirement: Production completed
                // Check Production QC Gate
                await this.checkQualityGate(projectId, 5, 'production_qc');
                break;
            case 7: // Logistics
                // Requirement: QC passed
                // Check Final QC Gate
                await this.checkQualityGate(projectId, 6, 'final_qc');
                break;
            case 8: // Installation
                // Requirement: Items dispatched/delivered
                // Check for Installation Guide or similar
                const hasInstallationGuide = await this.documentService.checkDocumentExists(projectId, 'installation_guide');
                if (!hasInstallationGuide) {
                    throw new BadRequestException('Installation Guide is required for Installation phase.');
                }
                break;
            default:
                break;
        }

        return true;
    }

    async getCurrentPhase(projectId: string): Promise<ProjectPhase> {
        let phase = await this.phaseRepository.findOne({ where: { projectId } });
        if (!phase) {
            phase = await this.initializeProject(projectId);
        }
        return phase;
    }

    async initializeProject(projectId: string): Promise<ProjectPhase> {
        const phase = this.phaseRepository.create({
            projectId,
            currentPhase: 1, // Planning
            status: 'active',
            startDate: new Date(),
        });
        return this.phaseRepository.save(phase);
    }

    async transitionPhase(projectId: string, toPhase: number, triggeredBy?: string): Promise<ProjectPhase> {
        const currentPhaseRecord = await this.getCurrentPhase(projectId);
        const fromPhase = currentPhaseRecord.currentPhase;

        if (fromPhase === toPhase) {
            return currentPhaseRecord;
        }

        // Validate transition
        await this.validateTransition(projectId, fromPhase, toPhase);

        // Execute pre-transition actions
        await this.executePhaseActions(projectId, toPhase, 'pre');

        // Record transition
        const transition = this.transitionRepository.create({
            projectId,
            fromPhase,
            toPhase,
            transitionType: 'manual', // or 'automatic' based on logic
            triggeredBy,
            triggeredAt: new Date(),
        });
        await this.transitionRepository.save(transition);

        // Update current phase
        currentPhaseRecord.currentPhase = toPhase;
        currentPhaseRecord.actualCompletionDate = new Date(); // Mark previous phase as done (simplification)

        const updatedPhase = await this.phaseRepository.save(currentPhaseRecord);

        // Execute post-transition actions
        await this.executePhaseActions(projectId, toPhase, 'post');

        // Emit event
        this.eventEmitter.emit('workflow.phase.changed', {
            projectId,
            fromPhase,
            toPhase,
            timestamp: new Date(),
        });

        return updatedPhase;
    }

    private async executePhaseActions(projectId: string, phase: number, timing: 'pre' | 'post') {
        // Placeholder for executing actions defined in configuration
        // e.g., send notifications, create tasks, etc.
        // This could call RuleEngineService
    }

    async validateTransition(projectId: string, fromPhase: number, toPhase: number): Promise<boolean> {
        // Basic validation: sequential progression
        if (toPhase !== fromPhase + 1 && toPhase !== fromPhase - 1) {
            if (toPhase > fromPhase + 1) {
                throw new BadRequestException(`Cannot skip phases. Current: ${fromPhase}, Target: ${toPhase}`);
            }
        }

        // Phase-specific validation rules
        switch (toPhase) {
            case 2: // Site & Design
                // Requirement: Project must be initiated
                break;
            case 3: // Technical
                // Requirement: Site measurements and initial drawings must be approved
                break;
            case 4: // Procurement
                // Requirement: BOM and Technical Drawings must be ready
                break;
            case 5: // Production
                // Requirement: POs issued and materials received (at least partially)
                // Check Material QA Gate
                await this.checkQualityGate(projectId, 4, 'material_qa');
                break;
            case 6: // Quality
                // Requirement: Production completed
                // Check Production QC Gate
                await this.checkQualityGate(projectId, 5, 'production_qc');
                break;
            case 7: // Logistics
                // Requirement: QC passed
                // Check Final QC Gate
                await this.checkQualityGate(projectId, 6, 'final_qc');
                break;
            case 8: // Installation
                // Requirement: Items dispatched/delivered
                break;
            default:
                break;
        }

        return true;
    }

    private async checkQualityGate(projectId: string, phase: number, gateType: string) {
        const gates = await this.qualityGateService.getProjectQualityGates(projectId);
        const relevantGate = gates.find(g => g.phase === phase && g.gateType === gateType);

        if (relevantGate && relevantGate.status !== 'passed') {
            throw new BadRequestException(`Quality Gate '${gateType}' for phase ${phase} has not passed.`);
        }
        // If no gate exists, we assume it's not required or hasn't been created yet (which might be an issue depending on strictness)
        // For now, we enforce it only if it exists, or we could enforce existence.
        // Let's enforce existence for critical gates if we want to be strict.
    }
}
```
