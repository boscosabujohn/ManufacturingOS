import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CorrectiveAction, CorrectiveActionStatus } from '../entities/corrective-action.entity';
import { CreateCorrectiveActionDto, UpdateCorrectiveActionDto, CorrectiveActionResponseDto } from '../dto';

@Injectable()
export class CorrectiveActionService {
  constructor(
    @InjectRepository(CorrectiveAction)
    private readonly caRepository: Repository<CorrectiveAction>,
  ) {}

  async create(createDto: CreateCorrectiveActionDto): Promise<CorrectiveActionResponseDto> {
    const ca = this.caRepository.create({ ...createDto, status: CorrectiveActionStatus.DRAFT });
    const saved = await this.caRepository.save(ca);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: { status?: CorrectiveActionStatus }): Promise<CorrectiveActionResponseDto[]> {
    const query = this.caRepository.createQueryBuilder('ca');
    if (filters?.status) query.andWhere('ca.status = :status', { status: filters.status });
    query.orderBy('ca.createdAt', 'DESC');
    const results = await query.getMany();
    return results.map((r) => this.mapToResponseDto(r));
  }

  async findOne(id: string): Promise<CorrectiveActionResponseDto> {
    const ca = await this.caRepository.findOne({ where: { id } });
    if (!ca) throw new NotFoundException(`Corrective Action with ID ${id} not found`);
    return this.mapToResponseDto(ca);
  }

  async update(id: string, updateDto: UpdateCorrectiveActionDto): Promise<CorrectiveActionResponseDto> {
    const ca = await this.caRepository.findOne({ where: { id } });
    if (!ca) throw new NotFoundException(`Corrective Action with ID ${id} not found`);
    Object.assign(ca, updateDto);
    const updated = await this.caRepository.save(ca);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const ca = await this.caRepository.findOne({ where: { id } });
    if (!ca) throw new NotFoundException(`Corrective Action with ID ${id} not found`);
    if (ca.status !== CorrectiveActionStatus.DRAFT) {
      throw new BadRequestException('Only draft corrective actions can be deleted');
    }
    await this.caRepository.remove(ca);
  }

  async submit(id: string, submittedBy: string): Promise<CorrectiveActionResponseDto> {
    const ca = await this.caRepository.findOne({ where: { id } });
    if (!ca) throw new NotFoundException(`Corrective Action with ID ${id} not found`);
    ca.status = CorrectiveActionStatus.SUBMITTED;
    ca.submittedBy = submittedBy;
    ca.submittedAt = new Date();
    const updated = await this.caRepository.save(ca);
    return this.mapToResponseDto(updated);
  }

  async approve(id: string, approvedBy: string): Promise<CorrectiveActionResponseDto> {
    const ca = await this.caRepository.findOne({ where: { id } });
    if (!ca) throw new NotFoundException(`Corrective Action with ID ${id} not found`);
    ca.status = CorrectiveActionStatus.APPROVED;
    ca.approvedBy = approvedBy;
    ca.approvedAt = new Date();
    const updated = await this.caRepository.save(ca);
    return this.mapToResponseDto(updated);
  }

  async implement(id: string, implementedBy: string): Promise<CorrectiveActionResponseDto> {
    const ca = await this.caRepository.findOne({ where: { id } });
    if (!ca) throw new NotFoundException(`Corrective Action with ID ${id} not found`);
    ca.status = CorrectiveActionStatus.IMPLEMENTED;
    ca.implementedBy = implementedBy;
    ca.implementedAt = new Date();
    ca.isImplemented = true;
    const updated = await this.caRepository.save(ca);
    return this.mapToResponseDto(updated);
  }

  async verify(id: string, verifiedBy: string, isEffective: boolean): Promise<CorrectiveActionResponseDto> {
    const ca = await this.caRepository.findOne({ where: { id } });
    if (!ca) throw new NotFoundException(`Corrective Action with ID ${id} not found`);
    ca.status = CorrectiveActionStatus.VERIFIED;
    ca.verifiedBy = verifiedBy;
    ca.verifiedAt = new Date();
    ca.isVerified = true;
    ca.isEffective = isEffective;
    const updated = await this.caRepository.save(ca);
    return this.mapToResponseDto(updated);
  }

  async close(id: string, closedBy: string): Promise<CorrectiveActionResponseDto> {
    const ca = await this.caRepository.findOne({ where: { id } });
    if (!ca) throw new NotFoundException(`Corrective Action with ID ${id} not found`);
    ca.status = CorrectiveActionStatus.CLOSED;
    ca.closedBy = closedBy;
    ca.closedAt = new Date();
    const updated = await this.caRepository.save(ca);
    return this.mapToResponseDto(updated);
  }

  private mapToResponseDto(ca: CorrectiveAction): CorrectiveActionResponseDto {
    return {
      id: ca.id,
      caNumber: ca.caNumber,
      title: ca.title,
      status: ca.status,
      priority: ca.priority,
      problemStatement: ca.problemStatement,
      rootCause: ca.rootCause,
      actionPlan: ca.actionPlan,
      assignedToName: ca.assignedToName,
      targetDate: ca.targetDate,
      isImplemented: ca.isImplemented,
      isVerified: ca.isVerified,
      progressPercentage: ca.progressPercentage,
      createdAt: ca.createdAt,
      updatedAt: ca.updatedAt,
    };
  }
}
