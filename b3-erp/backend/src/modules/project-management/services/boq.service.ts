
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BOQ } from '../../project/entities/boq.entity';
import { BOQItem } from '../../project/entities/boq-item.entity';
import { Item } from '../../core/entities/item.entity';

@Injectable()
export class BOQService {
    constructor(
        @InjectRepository(BOQ)
        private boqRepository: Repository<BOQ>,
        @InjectRepository(BOQItem)
        private boqItemRepository: Repository<BOQItem>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
    ) { }

    async createBOQ(data: Partial<BOQ>): Promise<BOQ> {
        const boq = this.boqRepository.create(data);
        return this.boqRepository.save(boq);
    }

    async getProjectBOQ(projectId: string): Promise<BOQ[]> {
        return this.boqRepository.find({
            where: { projectId },
            relations: ['items'],
            order: { createdAt: 'DESC' },
        });
    }

    async getBOQ(id: string): Promise<BOQ> {
        const boq = await this.boqRepository.findOne({
            where: { id },
            relations: ['items'],
        });

        if (!boq) {
            throw new NotFoundException(`BOQ with ID ${id} not found`);
        }

        return boq;
    }

    async addItem(boqId: string, itemData: Partial<BOQItem>): Promise<BOQItem> {
        const boq = await this.getBOQ(boqId);
        const item = this.boqItemRepository.create({
            ...itemData,
            boq: { id: boqId } as any,
        });

        const savedItem = await this.boqItemRepository.save(item);

        // Update total amount
        await this.calculateTotal(boqId);

        return savedItem;
    }

    async updateItem(itemId: string, itemData: Partial<BOQItem>): Promise<BOQItem> {
        const item = await this.boqItemRepository.findOne({ where: { id: itemId }, relations: ['boq'] });
        if (!item) {
            throw new NotFoundException(`BOQ Item with ID ${itemId} not found`);
        }

        Object.assign(item, itemData);
        const savedItem = await this.boqItemRepository.save(item);

        // Update total amount
        await this.calculateTotal(item.boq.id);

        return savedItem;
    }

    async removeItem(itemId: string): Promise<void> {
        const item = await this.boqItemRepository.findOne({ where: { id: itemId }, relations: ['boq'] });
        if (!item) {
            throw new NotFoundException(`BOQ Item with ID ${itemId} not found`);
        }

        const boqId = item.boq.id;
        await this.boqItemRepository.remove(item);

        // Update total amount
        await this.calculateTotal(boqId);
    }

    private async calculateTotal(boqId: string): Promise<void> {
        const boq = await this.getBOQ(boqId);
        const total = boq.items.reduce((sum, item) => sum + Number(item.amount), 0);

        boq.totalAmount = total;
        await this.boqRepository.save(boq);
    }

    async syncWithInventory(boqId: string): Promise<BOQItem[]> {
        const boqItems = await this.boqItemRepository.find({ where: { boq: { id: boqId } } });

        for (const boqItem of boqItems) {
            // Try to find item by code or description
            const item = await this.itemRepository.findOne({
                where: [
                    { itemCode: boqItem.itemCode },
                    { itemName: boqItem.description }
                ]
            });

            if (item) {
                boqItem.itemId = item.id;
                boqItem.itemCode = item.itemCode;
                boqItem.itemName = item.itemName;
                await this.boqItemRepository.save(boqItem);
            }
        }

        return this.boqItemRepository.find({ where: { boq: { id: boqId } }, relations: ['item'] });
    }
}
