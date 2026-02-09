import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KnowledgeBase, KnowledgeCategory } from '../entities/knowledge-base.entity';
import { SparePart } from '../entities/spare-part.entity';

@Injectable()
export class AfterSalesService {
    constructor(
        @InjectRepository(KnowledgeBase)
        private readonly kbRepository: Repository<KnowledgeBase>,
        @InjectRepository(SparePart)
        private readonly partsRepository: Repository<SparePart>,
    ) { }

    // Knowledge Base methods
    async findAllKnowledge(filters?: { category?: KnowledgeCategory; search?: string }): Promise<KnowledgeBase[]> {
        const query = this.kbRepository.createQueryBuilder('kb');

        if (filters?.category) {
            query.andWhere('kb.category = :category', { category: filters.category });
        }

        if (filters?.search) {
            query.andWhere('(kb.title ILIKE :search OR kb.content ILIKE :search)', { search: `%${filters.search}%` });
        }

        query.andWhere('kb.isActive = true');
        return query.getMany();
    }

    async findKnowledgeById(id: string): Promise<KnowledgeBase> {
        const kb = await this.kbRepository.findOne({ where: { id, isActive: true } });
        if (!kb) throw new NotFoundException('Knowledge base article not found');

        kb.viewCount += 1;
        await this.kbRepository.save(kb);
        return kb;
    }

    // Spare Parts methods
    async findAllParts(filters?: { category?: string; search?: string }): Promise<SparePart[]> {
        const query = this.partsRepository.createQueryBuilder('part');

        if (filters?.category) {
            query.andWhere('part.category = :category', { category: filters.category });
        }

        if (filters?.search) {
            query.andWhere('(part.name ILIKE :search OR part.partNumber ILIKE :search)', { search: `%${filters.search}%` });
        }

        query.andWhere('part.isActive = true');
        return query.getMany();
    }

    async orderSparePart(partId: string, quantity: number, customerId: string): Promise<any> {
        const part = await this.partsRepository.findOne({ where: { id: partId } });
        if (!part) throw new NotFoundException('Spare part not found');

        // Simulate order processing - in a real app, this would create a SalesOrder or InventoryRequisition
        return {
            success: true,
            orderId: `SP-ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            partName: part.name,
            quantity,
            estimatedDelivery: new Date(Date.now() + 86400000 * (part.leadTimeDays || 3)),
            totalAmount: part.price * quantity,
        };
    }
}
