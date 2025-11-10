import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditPlan, AuditStatus } from '../entities/audit-plan.entity';
import { CreateAuditPlanDto, UpdateAuditPlanDto, AuditPlanResponseDto } from '../dto';

@Injectable()
export class AuditPlanService {
  constructor(
    @InjectRepository(AuditPlan)
    private readonly auditPlanRepository: Repository<AuditPlan>,
  ) {}

  async create(createDto: CreateAuditPlanDto): Promise<AuditPlanResponseDto> {
    const audit = this.auditPlanRepository.create({ ...createDto, status: AuditStatus.DRAFT });
    const saved = await this.auditPlanRepository.save(audit);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: { status?: AuditStatus; auditType?: string }): Promise<AuditPlanResponseDto[]> {
    const query = this.auditPlanRepository.createQueryBuilder('ap');
    if (filters?.status) query.andWhere('ap.status = :status', { status: filters.status });
    if (filters?.auditType) query.andWhere('ap.auditType = :auditType', { auditType: filters.auditType });
    query.orderBy('ap.createdAt', 'DESC');
    const results = await query.getMany();
    return results.map((r) => this.mapToResponseDto(r));
  }

  async findOne(id: string): Promise<AuditPlanResponseDto> {
    const audit = await this.auditPlanRepository.findOne({ where: { id }, relations: ['findings'] });
    if (!audit) throw new NotFoundException(`Audit Plan with ID ${id} not found`);
    return this.mapToResponseDto(audit);
  }

  async update(id: string, updateDto: UpdateAuditPlanDto): Promise<AuditPlanResponseDto> {
    const audit = await this.auditPlanRepository.findOne({ where: { id } });
    if (!audit) throw new NotFoundException(`Audit Plan with ID ${id} not found`);
    Object.assign(audit, updateDto);
    const updated = await this.auditPlanRepository.save(audit);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const audit = await this.auditPlanRepository.findOne({ where: { id } });
    if (!audit) throw new NotFoundException(`Audit Plan with ID ${id} not found`);
    if (audit.status !== AuditStatus.DRAFT) {
      throw new BadRequestException('Only draft audit plans can be deleted');
    }
    await this.auditPlanRepository.remove(audit);
  }

  async schedule(id: string): Promise<AuditPlanResponseDto> {
    const audit = await this.auditPlanRepository.findOne({ where: { id } });
    if (!audit) throw new NotFoundException(`Audit Plan with ID ${id} not found`);
    audit.status = AuditStatus.SCHEDULED;
    const updated = await this.auditPlanRepository.save(audit);
    return this.mapToResponseDto(updated);
  }

  async start(id: string, startedBy: string): Promise<AuditPlanResponseDto> {
    const audit = await this.auditPlanRepository.findOne({ where: { id } });
    if (!audit) throw new NotFoundException(`Audit Plan with ID ${id} not found`);
    audit.status = AuditStatus.IN_PROGRESS;
    audit.actualStartDate = new Date();
    const updated = await this.auditPlanRepository.save(audit);
    return this.mapToResponseDto(updated);
  }

  async complete(id: string, completedBy: string): Promise<AuditPlanResponseDto> {
    const audit = await this.auditPlanRepository.findOne({ where: { id } });
    if (!audit) throw new NotFoundException(`Audit Plan with ID ${id} not found`);
    audit.status = AuditStatus.COMPLETED;
    audit.completedBy = completedBy;
    audit.completedAt = new Date();
    audit.actualEndDate = new Date();
    const updated = await this.auditPlanRepository.save(audit);
    return this.mapToResponseDto(updated);
  }

  async close(id: string, closedBy: string): Promise<AuditPlanResponseDto> {
    const audit = await this.auditPlanRepository.findOne({ where: { id } });
    if (!audit) throw new NotFoundException(`Audit Plan with ID ${id} not found`);
    audit.status = AuditStatus.CLOSED;
    audit.closedBy = closedBy;
    audit.closedAt = new Date();
    const updated = await this.auditPlanRepository.save(audit);
    return this.mapToResponseDto(updated);
  }

  private mapToResponseDto(audit: AuditPlan): AuditPlanResponseDto {
    return {
      id: audit.id,
      auditNumber: audit.auditNumber,
      auditTitle: audit.auditTitle,
      auditType: audit.auditType,
      status: audit.status,
      priority: audit.priority,
      auditScope: audit.auditScope,
      leadAuditorName: audit.leadAuditorName,
      plannedStartDate: audit.plannedStartDate,
      plannedEndDate: audit.plannedEndDate,
      totalFindings: audit.totalFindings,
      criticalFindings: audit.criticalFindings,
      majorFindings: audit.majorFindings,
      minorFindings: audit.minorFindings,
      overallRating: audit.overallRating,
      createdAt: audit.createdAt,
      updatedAt: audit.updatedAt,
    };
  }
}
