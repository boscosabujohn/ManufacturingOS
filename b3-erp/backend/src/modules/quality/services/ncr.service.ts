import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NCR, NCRStatus } from '../entities/ncr.entity';
import { CreateNCRDto, UpdateNCRDto, NCRResponseDto } from '../dto';

@Injectable()
export class NCRService {
    constructor(
        @InjectRepository(NCR)
        private readonly ncrRepository: Repository<NCR>,
    ) { }

    async create(createDto: CreateNCRDto): Promise<NCRResponseDto> {
        const count = await this.ncrRepository.count();
        const ncrNumber = `NCR-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, '0')}`;

        const ncr = this.ncrRepository.create({
            ...createDto,
            ncrNumber,
            status: NCRStatus.OPEN,
        });

        const saved = await this.ncrRepository.save(ncr);
        return this.mapToResponseDto(saved);
    }

    async findAll(filters?: { status?: NCRStatus }): Promise<NCRResponseDto[]> {
        const query = this.ncrRepository.createQueryBuilder('ncr');
        if (filters?.status) {
            query.andWhere('ncr.status = :status', { status: filters.status });
        }
        query.orderBy('ncr.createdAt', 'DESC');
        const results = await query.getMany();
        return results.map((r) => this.mapToResponseDto(r));
    }

    async findOne(id: string): Promise<NCRResponseDto> {
        const ncr = await this.ncrRepository.findOne({ where: { id } });
        if (!ncr) {
            throw new NotFoundException(`NCR with ID ${id} not found`);
        }
        return this.mapToResponseDto(ncr);
    }

    async update(id: string, updateDto: UpdateNCRDto): Promise<NCRResponseDto> {
        const ncr = await this.ncrRepository.findOne({ where: { id } });
        if (!ncr) {
            throw new NotFoundException(`NCR with ID ${id} not found`);
        }

        Object.assign(ncr, updateDto);
        const updated = await this.ncrRepository.save(ncr);
        return this.mapToResponseDto(updated);
    }

    async remove(id: string): Promise<void> {
        const result = await this.ncrRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`NCR with ID ${id} not found`);
        }
    }

    private mapToResponseDto(ncr: NCR): NCRResponseDto {
        return {
            id: ncr.id,
            ncrNumber: ncr.ncrNumber,
            title: ncr.title,
            source: ncr.source,
            severity: ncr.severity,
            status: ncr.status,
            description: ncr.description,
            reportedBy: ncr.reportedBy,
            reportedDate: ncr.reportedDate,
            assignedTo: ncr.assignedTo,
            resolution: ncr.resolution,
            containmentAction: ncr.containmentAction,
            rootCause: ncr.rootCause,
            correctiveAction: ncr.correctiveAction,
            preventiveAction: ncr.preventiveAction,
            closedDate: ncr.closedDate,
            closedBy: ncr.closedBy,
            attachments: ncr.attachments,
            createdAt: ncr.createdAt,
            updatedAt: ncr.updatedAt,
        };
    }
}
