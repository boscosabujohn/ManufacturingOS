import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BOQ, BOQItem } from './entities/boq.entity';
import { CreateBOQDto } from './dto/create-boq.dto';
import { UpdateBOQDto } from './dto/update-boq.dto';

@Injectable()
export class EstimationService {
    constructor(
        @InjectRepository(BOQ)
        private boqRepository: Repository<BOQ>,
        @InjectRepository(BOQItem)
        private boqItemRepository: Repository<BOQItem>,
    ) { }

    async create(createBOQDto: CreateBOQDto): Promise<BOQ> {
        const boqNumber = await this.generateBOQNumber();

        // Calculate total estimated value from items
        const estimatedValue = createBOQDto.items.reduce(
            (sum, item) => sum + item.quantity * item.unitRate,
            0
        );

        const boq = this.boqRepository.create({
            ...createBOQDto,
            boqNumber,
            estimatedValue,
            items: undefined, // Remove items from BOQ creation
        });

        const savedBOQ = await this.boqRepository.save(boq);

        // Create BOQ items
        const boqItems = createBOQDto.items.map((item) => {
            const totalAmount = item.quantity * item.unitRate;
            return this.boqItemRepository.create({
                ...item,
                boqId: savedBOQ.id,
                totalAmount,
            });
        });

        await this.boqItemRepository.save(boqItems);

        return savedBOQ;
    }

    async findAll(): Promise<BOQ[]> {
        return this.boqRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<BOQ> {
        const boq = await this.boqRepository.findOne({ where: { id } });
        if (!boq) {
            throw new NotFoundException(`BOQ with ID ${id} not found`);
        }
        return boq;
    }

    async findItemsByBOQId(boqId: string): Promise<BOQItem[]> {
        return this.boqItemRepository.find({
            where: { boqId },
            order: { itemNo: 'ASC' },
        });
    }

    async update(id: string, updateBOQDto: UpdateBOQDto): Promise<BOQ> {
        const boq = await this.findOne(id);

        // If items are being updated, handle them separately
        if (updateBOQDto.items) {
            // Delete existing items
            await this.boqItemRepository.delete({ boqId: id });

            // Create new items
            const boqItems = updateBOQDto.items.map((item) => {
                const totalAmount = item.quantity * item.unitRate;
                return this.boqItemRepository.create({
                    ...item,
                    boqId: id,
                    totalAmount,
                });
            });
            await this.boqItemRepository.save(boqItems);

            // Recalculate estimated value
            const estimatedValue = updateBOQDto.items.reduce(
                (sum, item) => sum + item.quantity * item.unitRate,
                0
            );
            updateBOQDto.estimatedValue = estimatedValue;
        }

        Object.assign(boq, updateBOQDto);
        return this.boqRepository.save(boq);
    }

    async remove(id: string): Promise<void> {
        const result = await this.boqRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`BOQ with ID ${id} not found`);
        }
    }

    private async generateBOQNumber(): Promise<string> {
        const count = await this.boqRepository.count();
        const year = new Date().getFullYear();
        return `BOQ-${year}-${String(count + 1).padStart(4, '0')}`;
    }
}
