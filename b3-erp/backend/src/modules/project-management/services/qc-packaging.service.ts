import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QCRecord, QCResult } from '../entities/qc-record.entity';
import { PackagingCrate, CrateStatus } from '../entities/packaging-crate.entity';
import { PackagingItem } from '../entities/packaging-item.entity';
import { ProjectTask } from '../entities/project-task.entity';

@Injectable()
export class QCPackagingService {
    constructor(
        @InjectRepository(QCRecord)
        private qcRepository: Repository<QCRecord>,
        @InjectRepository(PackagingCrate)
        private crateRepository: Repository<PackagingCrate>,
        @InjectRepository(PackagingItem)
        private packageItemRepository: Repository<PackagingItem>,
        @InjectRepository(ProjectTask)
        private taskRepository: Repository<ProjectTask>,
    ) { }

    // --- QC & Rework Logic ---

    async recordQC(data: Partial<QCRecord>): Promise<QCRecord> {
        const record = this.qcRepository.create(data);
        const saved = await this.qcRepository.save(record);

        // If REWORK, find the relevant production task and reset progress
        if (data.result === QCResult.REWORK) {
            const task = await this.taskRepository.findOne({
                where: {
                    projectId: data.projectId,
                    name: data.reworkOperation || 'Production'
                }
            });
            if (task) {
                task.progress = 50; // Reset to 50% for rework
                await this.taskRepository.save(task);
            }
        }

        return saved;
    }

    // --- Packaging & Weight Verification ---

    async createCrate(projectId: string, crateNumber: string, designWeight: number): Promise<PackagingCrate> {
        const crate = this.crateRepository.create({
            projectId,
            crateNumber,
            designWeight,
            qrCode: `QR-CRATE-${crateNumber}-${Date.now()}`,
            status: CrateStatus.OPEN,
        });
        return this.crateRepository.save(crate);
    }

    async packItem(crateId: string, itemId: string, quantity: number): Promise<PackagingItem> {
        const item = this.packageItemRepository.create({ crateId, itemId, quantityPacked: quantity });
        return this.packageItemRepository.save(item);
    }

    async sealCrate(crateId: string, actualWeight: number): Promise<PackagingCrate> {
        const crate = await this.crateRepository.findOne({ where: { id: crateId } });
        if (!crate) throw new NotFoundException('Crate not found');

        // Rule 6.8: Weight Verification Gate
        const deviation = Math.abs(actualWeight - crate.designWeight) / crate.designWeight;
        if (deviation > 0.05) {
            throw new BadRequestException(`HARD GATE: Weight deviation ${(deviation * 100).toFixed(1)}% exceeds 5% limit. Re-verify contents.`);
        }

        crate.actualWeight = actualWeight;
        crate.status = CrateStatus.SEALED;
        return this.crateRepository.save(crate);
    }

    async getCrates(projectId: string): Promise<PackagingCrate[]> {
        return this.crateRepository.find({ where: { projectId }, relations: ['items', 'items.item'] });
    }
}
