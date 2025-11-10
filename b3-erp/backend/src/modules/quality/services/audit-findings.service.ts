import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditFindings, FindingStatus } from '../entities/audit-findings.entity';
import { CreateAuditFindingsDto, UpdateAuditFindingsDto, AuditFindingsResponseDto } from '../dto';

@Injectable()
export class AuditFindingsService {
  constructor(
    @InjectRepository(AuditFindings)
    private readonly findingsRepository: Repository<AuditFindings>,
  ) {}

  async create(createDto: CreateAuditFindingsDto): Promise<AuditFindingsResponseDto> {
    const finding = this.findingsRepository.create({ ...createDto, status: FindingStatus.OPEN });
    const saved = await this.findingsRepository.save(finding);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: { auditPlanId?: string; status?: FindingStatus }): Promise<AuditFindingsResponseDto[]> {
    const query = this.findingsRepository.createQueryBuilder('af');
    if (filters?.auditPlanId) query.andWhere('af.auditPlanId = :auditPlanId', { auditPlanId: filters.auditPlanId });
    if (filters?.status) query.andWhere('af.status = :status', { status: filters.status });
    query.orderBy('af.createdAt', 'DESC');
    const results = await query.getMany();
    return results.map((r) => this.mapToResponseDto(r));
  }

  async findOne(id: string): Promise<AuditFindingsResponseDto> {
    const finding = await this.findingsRepository.findOne({ where: { id } });
    if (!finding) throw new NotFoundException(`Audit Finding with ID ${id} not found`);
    return this.mapToResponseDto(finding);
  }

  async update(id: string, updateDto: UpdateAuditFindingsDto): Promise<AuditFindingsResponseDto> {
    const finding = await this.findingsRepository.findOne({ where: { id } });
    if (!finding) throw new NotFoundException(`Audit Finding with ID ${id} not found`);
    Object.assign(finding, updateDto);
    const updated = await this.findingsRepository.save(finding);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const finding = await this.findingsRepository.findOne({ where: { id } });
    if (!finding) throw new NotFoundException(`Audit Finding with ID ${id} not found`);
    await this.findingsRepository.remove(finding);
  }

  async acknowledge(id: string, acknowledgedBy: string): Promise<AuditFindingsResponseDto> {
    const finding = await this.findingsRepository.findOne({ where: { id } });
    if (!finding) throw new NotFoundException(`Audit Finding with ID ${id} not found`);
    finding.status = FindingStatus.ACKNOWLEDGED;
    finding.acknowledgedBy = acknowledgedBy;
    finding.acknowledgedAt = new Date();
    const updated = await this.findingsRepository.save(finding);
    return this.mapToResponseDto(updated);
  }

  async verify(id: string, verifiedBy: string, isEffective: boolean): Promise<AuditFindingsResponseDto> {
    const finding = await this.findingsRepository.findOne({ where: { id } });
    if (!finding) throw new NotFoundException(`Audit Finding with ID ${id} not found`);
    finding.status = FindingStatus.VERIFIED;
    finding.verifiedBy = verifiedBy;
    finding.verificationDate = new Date();
    finding.isVerified = true;
    finding.isEffective = isEffective;
    const updated = await this.findingsRepository.save(finding);
    return this.mapToResponseDto(updated);
  }

  async close(id: string, closedBy: string): Promise<AuditFindingsResponseDto> {
    const finding = await this.findingsRepository.findOne({ where: { id } });
    if (!finding) throw new NotFoundException(`Audit Finding with ID ${id} not found`);
    finding.status = FindingStatus.CLOSED;
    finding.closedBy = closedBy;
    finding.closedAt = new Date();
    const updated = await this.findingsRepository.save(finding);
    return this.mapToResponseDto(updated);
  }

  private mapToResponseDto(finding: AuditFindings): AuditFindingsResponseDto {
    return {
      id: finding.id,
      auditPlanId: finding.auditPlanId,
      findingNumber: finding.findingNumber,
      title: finding.title,
      findingType: finding.findingType,
      severity: finding.severity,
      status: finding.status,
      findingDate: finding.findingDate,
      standardReference: finding.standardReference,
      clauseNumber: finding.clauseNumber,
      evidence: finding.evidence,
      auditorName: finding.auditorName,
      assignedToName: finding.assignedToName,
      targetCompletionDate: finding.targetCompletionDate,
      requiresCAPA: finding.requiresCAPA,
      capaNumber: finding.capaNumber,
      isVerified: finding.isVerified,
      createdAt: finding.createdAt,
      updatedAt: finding.updatedAt,
    };
  }
}
