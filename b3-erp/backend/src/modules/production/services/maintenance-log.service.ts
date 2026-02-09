import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MachineMaintenanceLog, MaintenanceStatus } from '../entities/machine-maintenance-log.entity';
import { WorkCenter } from '../entities/work-center.entity';

@Injectable()
export class MaintenanceLogService {
    constructor(
        @InjectRepository(MachineMaintenanceLog)
        private readonly maintenanceLogRepository: Repository<MachineMaintenanceLog>,
        @InjectRepository(WorkCenter)
        private readonly workCenterRepository: Repository<WorkCenter>,
    ) { }

    async create(createDto: Partial<MachineMaintenanceLog>): Promise<MachineMaintenanceLog> {
        const workCenter = await this.workCenterRepository.findOne({ where: { id: createDto.workCenterId } });
        if (!workCenter) {
            throw new NotFoundException(`Work Center with ID ${createDto.workCenterId} not found`);
        }

        const log = this.maintenanceLogRepository.create({
            ...createDto,
            equipmentCode: workCenter.workCenterCode,
            equipmentName: workCenter.workCenterName,
        });

        const savedLog = await this.maintenanceLogRepository.save(log);

        // Update work center status if breakdown or current maintenance
        if (log.maintenanceType === 'Breakdown' || log.status === MaintenanceStatus.IN_PROGRESS) {
            workCenter.status = log.maintenanceType === 'Breakdown' ? 'Breakdown' as any : 'Maintenance' as any;
            if (log.maintenanceType === 'Breakdown') {
                workCenter.totalBreakdowns = (workCenter.totalBreakdowns || 0) + 1;
                workCenter.lastBreakdownDate = new Date();
            }
            await this.workCenterRepository.save(workCenter);
        }

        return savedLog;
    }

    async findAll(filters?: { workCenterId?: string; status?: MaintenanceStatus }): Promise<MachineMaintenanceLog[]> {
        const query = this.maintenanceLogRepository.createQueryBuilder('log');

        if (filters?.workCenterId) {
            query.andWhere('log.workCenterId = :workCenterId', { workCenterId: filters.workCenterId });
        }

        if (filters?.status) {
            query.andWhere('log.status = :status', { status: filters.status });
        }

        query.orderBy('log.scheduledDate', 'DESC');
        return await query.getMany();
    }

    async findOne(id: string): Promise<MachineMaintenanceLog> {
        const log = await this.maintenanceLogRepository.findOne({ where: { id }, relations: ['workCenter'] });
        if (!log) {
            throw new NotFoundException(`Maintenance log with ID ${id} not found`);
        }
        return log;
    }

    async update(id: string, updateDto: Partial<MachineMaintenanceLog>): Promise<MachineMaintenanceLog> {
        const log = await this.findOne(id);
        Object.assign(log, updateDto);

        const savedLog = await this.maintenanceLogRepository.save(log);

        // If status changed to COMPLETED, update work center back to AVAILABLE
        if (updateDto.status === MaintenanceStatus.COMPLETED) {
            const workCenter = await this.workCenterRepository.findOne({ where: { id: log.workCenterId } });
            if (workCenter) {
                workCenter.status = 'Available' as any;
                workCenter.lastMaintenanceDate = new Date();
                // Update total downtime if applicable
                if (log.startDate && log.endDate) {
                    const downtimeHours = (log.endDate.getTime() - log.startDate.getTime()) / (1000 * 60 * 60);
                    workCenter.totalDowntimeHours = (workCenter.totalDowntimeHours || 0) + downtimeHours;
                }
                await this.workCenterRepository.save(workCenter);
            }
        }

        return savedLog;
    }

    async remove(id: string): Promise<void> {
        const log = await this.findOne(id);
        await this.maintenanceLogRepository.remove(log);
    }
}
