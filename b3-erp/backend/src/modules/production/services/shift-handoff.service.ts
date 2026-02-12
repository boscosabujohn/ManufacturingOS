import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShiftHandoff, HandoffStatus, HandoffShiftType } from '../entities/shift-handoff.entity';

@Injectable()
export class ShiftHandoffService {
  constructor(
    @InjectRepository(ShiftHandoff)
    private readonly shiftHandoffRepository: Repository<ShiftHandoff>,
  ) {}

  async create(createDto: Partial<ShiftHandoff>): Promise<ShiftHandoff> {
    const record = this.shiftHandoffRepository.create(createDto);
    record.status = 'pending';
    return this.shiftHandoffRepository.save(record);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: HandoffStatus;
    outgoingShiftType?: HandoffShiftType;
    incomingShiftType?: HandoffShiftType;
    workstationId?: string;
    productionLineId?: string;
    handoffDate?: Date;
  }): Promise<ShiftHandoff[]> {
    const query = this.shiftHandoffRepository.createQueryBuilder('handoff');

    if (filters?.companyId) {
      query.andWhere('handoff.companyId = :companyId', { companyId: filters.companyId });
    }
    if (filters?.status) {
      query.andWhere('handoff.status = :status', { status: filters.status });
    }
    if (filters?.outgoingShiftType) {
      query.andWhere('handoff.outgoingShiftType = :outgoingShiftType', { outgoingShiftType: filters.outgoingShiftType });
    }
    if (filters?.incomingShiftType) {
      query.andWhere('handoff.incomingShiftType = :incomingShiftType', { incomingShiftType: filters.incomingShiftType });
    }
    if (filters?.workstationId) {
      query.andWhere('handoff.workstationId = :workstationId', { workstationId: filters.workstationId });
    }
    if (filters?.productionLineId) {
      query.andWhere('handoff.productionLineId = :productionLineId', { productionLineId: filters.productionLineId });
    }
    if (filters?.handoffDate) {
      query.andWhere('handoff.handoffDate = :handoffDate', { handoffDate: filters.handoffDate });
    }

    query.orderBy('handoff.handoffDate', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<ShiftHandoff> {
    const record = await this.shiftHandoffRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Shift Handoff with ID ${id} not found`);
    }
    return record;
  }

  async update(id: string, updateDto: Partial<ShiftHandoff>): Promise<ShiftHandoff> {
    const record = await this.findOne(id);
    if (record.status === 'completed' || record.status === 'acknowledged') {
      throw new BadRequestException('Cannot modify completed or acknowledged handoffs');
    }
    Object.assign(record, updateDto);
    return this.shiftHandoffRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    if (record.status !== 'pending') {
      throw new BadRequestException('Can only delete pending handoffs');
    }
    await this.shiftHandoffRepository.remove(record);
  }

  async startHandoff(id: string): Promise<ShiftHandoff> {
    const record = await this.findOne(id);
    if (record.status !== 'pending') {
      throw new BadRequestException('Can only start pending handoffs');
    }
    record.status = 'in_progress';
    record.handoffStartedAt = new Date();
    return this.shiftHandoffRepository.save(record);
  }

  async completeHandoff(id: string): Promise<ShiftHandoff> {
    const record = await this.findOne(id);
    if (record.status !== 'in_progress') {
      throw new BadRequestException('Can only complete in-progress handoffs');
    }
    record.status = 'completed';
    record.handoffCompletedAt = new Date();
    return this.shiftHandoffRepository.save(record);
  }

  async acknowledgeHandoff(id: string, incomingUserId: string, incomingUserName: string, notes?: string): Promise<ShiftHandoff> {
    const record = await this.findOne(id);
    if (record.status !== 'completed') {
      throw new BadRequestException('Can only acknowledge completed handoffs');
    }
    record.status = 'acknowledged';
    record.incomingUserId = incomingUserId;
    record.incomingUserName = incomingUserName;
    record.acknowledgedAt = new Date();
    if (notes) {
      record.acknowledgementNotes = notes;
    }
    return this.shiftHandoffRepository.save(record);
  }

  async updateChecklistItem(id: string, itemId: string, isCompleted: boolean, notes?: string, completedBy?: string): Promise<ShiftHandoff> {
    const record = await this.findOne(id);
    if (record.checklistItems) {
      const item = record.checklistItems.find(i => i.id === itemId);
      if (item) {
        item.isCompleted = isCompleted;
        item.notes = notes || item.notes;
        item.completedAt = isCompleted ? new Date() : null as any;
        item.completedBy = isCompleted ? (completedBy || '') : '';
      }
    }
    return this.shiftHandoffRepository.save(record);
  }

  async addActiveIssue(id: string, issue: any): Promise<ShiftHandoff> {
    const record = await this.findOne(id);
    if (!record.activeIssues) {
      record.activeIssues = [];
    }
    record.activeIssues.push({
      ...issue,
      id: `issue-${Date.now()}`,
      reportedAt: new Date(),
      status: 'open',
    });
    return this.shiftHandoffRepository.save(record);
  }

  async resolveIssue(id: string, issueId: string, resolution: string): Promise<ShiftHandoff> {
    const record = await this.findOne(id);
    if (record.activeIssues) {
      const issue = record.activeIssues.find(i => i.id === issueId);
      if (issue) {
        issue.status = 'resolved';
        issue.resolution = resolution;
      }
    }
    return this.shiftHandoffRepository.save(record);
  }

  async getPendingHandoffs(companyId: string): Promise<ShiftHandoff[]> {
    return this.findAll({ companyId, status: 'pending' });
  }

  async getHandoffSummary(companyId: string, startDate: Date, endDate: Date): Promise<any> {
    const handoffs = await this.shiftHandoffRepository
      .createQueryBuilder('handoff')
      .where('handoff.companyId = :companyId', { companyId })
      .andWhere('handoff.handoffDate BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany();

    const byStatus: Record<HandoffStatus, number> = {
      pending: 0, in_progress: 0, completed: 0, acknowledged: 0,
    };

    handoffs.forEach(h => {
      byStatus[h.status]++;
    });

    const avgCompletionTime = handoffs
      .filter(h => h.handoffStartedAt && h.handoffCompletedAt)
      .map(h => new Date(h.handoffCompletedAt!).getTime() - new Date(h.handoffStartedAt!).getTime());

    const totalIssues = handoffs.reduce((sum, h) => sum + (h.activeIssues?.length || 0), 0);
    const openIssues = handoffs.reduce((sum, h) =>
      sum + (h.activeIssues?.filter(i => i.status === 'open').length || 0), 0
    );

    return {
      period: { startDate, endDate },
      totalHandoffs: handoffs.length,
      byStatus,
      averageCompletionTimeMinutes: avgCompletionTime.length > 0
        ? avgCompletionTime.reduce((a, b) => a + b, 0) / avgCompletionTime.length / 60000
        : 0,
      totalIssues,
      openIssues,
      completionRate: handoffs.length > 0
        ? ((byStatus.completed + byStatus.acknowledged) / handoffs.length) * 100
        : 0,
    };
  }
}
