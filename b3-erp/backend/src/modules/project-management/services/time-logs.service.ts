import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeLog } from '../entities/time-log.entity';
import { CreateTimeLogDto, UpdateTimeLogDto } from '../dto/time-log.dto';

@Injectable()
export class TimeLogsService {
    constructor(
        @InjectRepository(TimeLog)
        private timeLogRepository: Repository<TimeLog>,
    ) { }

    async create(createTimeLogDto: CreateTimeLogDto): Promise<TimeLog> {
        const timeLog = this.timeLogRepository.create(createTimeLogDto);
        return this.timeLogRepository.save(timeLog);
    }

    async findAll(projectId: string, userId?: string): Promise<TimeLog[]> {
        const where: any = { projectId };
        if (userId) {
            where.userId = userId;
        }
        return this.timeLogRepository.find({
            where,
            order: { date: 'DESC' },
            relations: ['task']
        });
    }

    async findOne(id: string): Promise<TimeLog> {
        const timeLog = await this.timeLogRepository.findOne({ where: { id }, relations: ['task'] });
        if (!timeLog) {
            throw new NotFoundException(`TimeLog with ID ${id} not found`);
        }
        return timeLog;
    }

    async update(id: string, updateTimeLogDto: UpdateTimeLogDto): Promise<TimeLog> {
        const timeLog = await this.findOne(id);
        Object.assign(timeLog, updateTimeLogDto);
        return this.timeLogRepository.save(timeLog);
    }

    async remove(id: string): Promise<void> {
        const result = await this.timeLogRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`TimeLog with ID ${id} not found`);
        }
    }
}
