import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTask } from '../entities/project-task.entity';
import { BOMHeader, BOMStatus } from '../entities/bom-header.entity';
import { BOMDetail } from '../entities/bom-detail.entity';
import { Item } from '../../core/entities/item.entity';

@Injectable()
export class TechnicalDesignService {
    constructor(
        @InjectRepository(ProjectTask)
        private taskRepository: Repository<ProjectTask>,
        @InjectRepository(BOMHeader)
        private bomHeaderRepository: Repository<BOMHeader>,
        @InjectRepository(BOMDetail)
        private bomDetailRepository: Repository<BOMDetail>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
    ) { }

    // --- Timeline Tracking Logic ---

    async getAtRiskDesignTasks(projectId: string): Promise<ProjectTask[]> {
        const now = new Date();
        return this.taskRepository.createQueryBuilder('task')
            .where('task.projectId = :projectId', { projectId })
            .andWhere('task.targetCompletion < :now', { now })
            .andWhere('task.status != :completed', { completed: 'completed' })
            .getMany();
    }

    // --- BOM Management Logic ---

    async createBOMHeader(projectId: string, name: string): Promise<BOMHeader> {
        const header = this.bomHeaderRepository.create({
            projectId,
            name,
            status: BOMStatus.DRAFT,
        });
        return this.bomHeaderRepository.save(header);
    }

    async getBOM(headerId: string): Promise<BOMHeader> {
        const header = await this.bomHeaderRepository.findOne({
            where: { id: headerId },
            relations: ['details', 'details.item', 'details.subDetails'],
        });
        if (!header) throw new NotFoundException('BOM not found');
        return header;
    }

    /**
     * Recursive function to generate BOM details from a prototype composition.
     * In a real system, this would look up the "Recipe" or "Composition" of an item.
     */
    async explodePrototypeToBOM(headerId: string, itemId: string, quantity: number = 1, parentDetailId?: string): Promise<void> {
        const item = await this.itemRepository.findOne({ where: { id: itemId } });
        if (!item) return;

        const detail = this.bomDetailRepository.create({
            headerId,
            itemId,
            quantity,
            uom: item.uom,
            parentDetailId,
        });

        const savedDetail = await this.bomDetailRepository.save(detail);

        // Simulated recursive explosion for known prototype items (e.g., "Steel Shutter Unit")
        if (item.name.includes('Steel Shutter Unit')) {
            // Suppose it has 2 Panels and 4 Screws
            const subItems = await this.itemRepository.find({
                where: [
                    { name: 'Steel Panel' },
                    { name: 'M6 Screw' }
                ]
            });

            for (const subItem of subItems) {
                const subQty = subItem.name.includes('Panel') ? 2 : 4;
                await this.explodePrototypeToBOM(headerId, subItem.id, subQty * quantity, savedDetail.id);
            }
        }
    }

    async verifyAndLockBOM(headerId: string, verifiedBy: string): Promise<BOMHeader> {
        const header = await this.getBOM(headerId);

        // Check for zero quantities or missing items
        for (const detail of header.details) {
            if (detail.quantity <= 0) {
                throw new BadRequestException(`Invalid quantity for item ${detail.itemId}`);
            }
        }

        header.status = BOMStatus.VERIFIED;
        header.verifiedBy = verifiedBy;
        header.verifiedAt = new Date();

        return this.bomHeaderRepository.save(header);
    }

    async releaseBOM(headerId: string): Promise<BOMHeader> {
        const header = await this.getBOM(headerId);
        if (header.status !== BOMStatus.VERIFIED) {
            throw new BadRequestException('BOM must be verified before release');
        }
        header.status = BOMStatus.RELEASED;
        return this.bomHeaderRepository.save(header);
    }
}
