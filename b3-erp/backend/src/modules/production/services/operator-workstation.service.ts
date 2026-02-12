import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperatorWorkstation, WorkstationStatus, WorkstationType } from '../entities/operator-workstation.entity';

@Injectable()
export class OperatorWorkstationService {
  constructor(
    @InjectRepository(OperatorWorkstation)
    private readonly operatorWorkstationRepository: Repository<OperatorWorkstation>,
  ) {}

  async create(createDto: Partial<OperatorWorkstation>): Promise<OperatorWorkstation> {
    const existing = await this.operatorWorkstationRepository.findOne({
      where: { workstationCode: createDto.workstationCode },
    });

    if (existing) {
      throw new BadRequestException(`Operator Workstation ${createDto.workstationCode} already exists`);
    }

    const workstation = this.operatorWorkstationRepository.create(createDto);
    return this.operatorWorkstationRepository.save(workstation);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: WorkstationStatus;
    workstationType?: WorkstationType;
    productionLineId?: string;
  }): Promise<OperatorWorkstation[]> {
    const query = this.operatorWorkstationRepository.createQueryBuilder('workstation');

    if (filters?.companyId) {
      query.andWhere('workstation.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('workstation.status = :status', { status: filters.status });
    }

    if (filters?.workstationType) {
      query.andWhere('workstation.workstationType = :workstationType', { workstationType: filters.workstationType });
    }

    if (filters?.productionLineId) {
      query.andWhere('workstation.productionLineId = :productionLineId', { productionLineId: filters.productionLineId });
    }

    query.orderBy('workstation.workstationName', 'ASC');
    return query.getMany();
  }

  async findOne(id: string): Promise<OperatorWorkstation> {
    const workstation = await this.operatorWorkstationRepository.findOne({ where: { id } });
    if (!workstation) {
      throw new NotFoundException(`Operator Workstation with ID ${id} not found`);
    }
    return workstation;
  }

  async update(id: string, updateDto: Partial<OperatorWorkstation>): Promise<OperatorWorkstation> {
    const workstation = await this.findOne(id);
    Object.assign(workstation, updateDto);
    return this.operatorWorkstationRepository.save(workstation);
  }

  async remove(id: string): Promise<void> {
    const workstation = await this.findOne(id);
    await this.operatorWorkstationRepository.remove(workstation);
  }

  async assignOperator(id: string, operatorId: string, operatorName: string): Promise<OperatorWorkstation> {
    const workstation = await this.findOne(id);
    workstation.currentOperatorId = operatorId;
    workstation.currentOperatorName = operatorName;
    workstation.status = 'active';
    workstation.lastActivityAt = new Date();
    return this.operatorWorkstationRepository.save(workstation);
  }

  async releaseOperator(id: string): Promise<OperatorWorkstation> {
    const workstation = await this.findOne(id);
    workstation.currentOperatorId = null;
    workstation.currentOperatorName = null;
    workstation.status = 'idle';
    return this.operatorWorkstationRepository.save(workstation);
  }

  async assignWorkOrder(id: string, workOrderId: string, operationId: string): Promise<OperatorWorkstation> {
    const workstation = await this.findOne(id);
    workstation.currentWorkOrderId = workOrderId;
    workstation.currentOperationId = operationId;
    workstation.status = 'active';
    workstation.lastActivityAt = new Date();
    return this.operatorWorkstationRepository.save(workstation);
  }

  async updatePerformanceMetrics(id: string, metrics: any): Promise<OperatorWorkstation> {
    const workstation = await this.findOne(id);
    workstation.performanceMetrics = {
      ...workstation.performanceMetrics,
      ...metrics,
    };
    workstation.lastActivityAt = new Date();
    return this.operatorWorkstationRepository.save(workstation);
  }

  async getWorkstationDashboard(companyId: string): Promise<any> {
    const workstations = await this.findAll({ companyId });

    const statusCounts = {
      active: workstations.filter(w => w.status === 'active').length,
      idle: workstations.filter(w => w.status === 'idle').length,
      maintenance: workstations.filter(w => w.status === 'maintenance').length,
      offline: workstations.filter(w => w.status === 'offline').length,
    };

    const avgEfficiency = workstations
      .filter(w => w.performanceMetrics?.efficiency)
      .reduce((sum, w) => sum + (w.performanceMetrics?.efficiency || 0), 0) / (workstations.filter(w => w.performanceMetrics?.efficiency).length || 1);

    return {
      totalWorkstations: workstations.length,
      statusDistribution: statusCounts,
      averageEfficiency: avgEfficiency,
      activeWorkstations: workstations.filter(w => w.status === 'active'),
    };
  }
}
