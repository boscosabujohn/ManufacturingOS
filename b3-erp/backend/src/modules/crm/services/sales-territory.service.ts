import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesTerritory } from '../entities/sales-territory.entity';

@Injectable()
export class SalesTerritoryService {
    constructor(
        @InjectRepository(SalesTerritory)
        private readonly territoryRepository: Repository<SalesTerritory>,
    ) { }

    async findAll(): Promise<SalesTerritory[]> {
        return await this.territoryRepository.find({
            order: { priority: 'DESC' },
        });
    }

    async findOne(id: string): Promise<SalesTerritory> {
        const territory = await this.territoryRepository.findOne({ where: { id } });
        if (!territory) {
            throw new NotFoundException(`Territory with ID ${id} not found`);
        }
        return territory;
    }

    async create(data: Partial<SalesTerritory>): Promise<SalesTerritory> {
        const territory = this.territoryRepository.create(data);
        return await this.territoryRepository.save(territory);
    }

    async update(id: string, data: Partial<SalesTerritory>): Promise<SalesTerritory> {
        const territory = await this.findOne(id);
        Object.assign(territory, data);
        return await this.territoryRepository.save(territory);
    }

    async remove(id: string): Promise<void> {
        const territory = await this.findOne(id);
        await this.territoryRepository.remove(territory);
    }
}
