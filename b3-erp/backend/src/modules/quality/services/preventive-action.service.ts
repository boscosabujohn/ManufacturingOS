import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreventiveAction, PreventiveActionStatus } from '../entities/preventive-action.entity';
import { CreatePreventiveActionDto, UpdatePreventiveActionDto, PreventiveActionResponseDto } from '../dto';

@Injectable()
export class PreventiveActionService {
  constructor(
    @InjectRepository(PreventiveAction)
    private readonly paRepository: Repository<PreventiveAction>,
  ) {}

  async create(createDto: CreatePreventiveActionDto): Promise<PreventiveActionResponseDto> {
    const pa = this.paRepository.create({ ...createDto, status: PreventiveActionStatus.DRAFT });
    const saved = await this.paRepository.save(pa);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: { status?: PreventiveActionStatus }): Promise<PreventiveActionResponseDto[]> {
    const query = this.paRepository.createQueryBuilder('pa');
    if (filters?.status) query.andWhere('pa.status = :status', { status: filters.status });
    query.orderBy('pa.createdAt', 'DESC');
    const results = await query.getMany();
    return results.map((r) => this.mapToResponseDto(r));
  }

  async findOne(id: string): Promise<PreventiveActionResponseDto> {
    const pa = await this.paRepository.findOne({ where: { id } });
    if (!pa) throw new NotFoundException(`Preventive Action with ID ${id} not found`);
    return this.mapToResponseDto(pa);
  }

  async update(id: string, updateDto: UpdatePreventiveActionDto): Promise<PreventiveActionResponseDto> {
    const pa = await this.paRepository.findOne({ where: { id } });
    if (!pa) throw new NotFoundException(`Preventive Action with ID ${id} not found`);
    Object.assign(pa, updateDto);
    const updated = await this.paRepository.save(pa);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const pa = await this.paRepository.findOne({ where: { id } });
    if (!pa) throw new NotFoundException(`Preventive Action with ID ${id} not found`);
    if (pa.status !== PreventiveActionStatus.DRAFT) {
      throw new BadRequestException('Only draft preventive actions can be deleted');
    }
    await this.paRepository.remove(pa);
  }

  async submit(id: string, submittedBy: string): Promise<PreventiveActionResponseDto> {
    const pa = await this.paRepository.findOne({ where: { id } });
    if (!pa) throw new NotFoundException(`Preventive Action with ID ${id} not found`);
    pa.status = PreventiveActionStatus.SUBMITTED;
    pa.submittedBy = submittedBy;
    pa.submittedAt = new Date();
    const updated = await this.paRepository.save(pa);
    return this.mapToResponseDto(updated);
  }

  async implement(id: string, implementedBy: string): Promise<PreventiveActionResponseDto> {
    const pa = await this.paRepository.findOne({ where: { id } });
    if (!pa) throw new NotFoundException(`Preventive Action with ID ${id} not found`);
    pa.status = PreventiveActionStatus.IMPLEMENTED;
    pa.implementedBy = implementedBy;
    pa.implementedAt = new Date();
    pa.isImplemented = true;
    const updated = await this.paRepository.save(pa);
    return this.mapToResponseDto(updated);
  }

  async verify(id: string, verifiedBy: string, isEffective: boolean): Promise<PreventiveActionResponseDto> {
    const pa = await this.paRepository.findOne({ where: { id } });
    if (!pa) throw new NotFoundException(`Preventive Action with ID ${id} not found`);
    pa.status = PreventiveActionStatus.VERIFIED;
    pa.verifiedBy = verifiedBy;
    pa.verifiedAt = new Date();
    pa.isVerified = true;
    pa.isEffective = isEffective;
    const updated = await this.paRepository.save(pa);
    return this.mapToResponseDto(updated);
  }

  async close(id: string, closedBy: string): Promise<PreventiveActionResponseDto> {
    const pa = await this.paRepository.findOne({ where: { id } });
    if (!pa) throw new NotFoundException(`Preventive Action with ID ${id} not found`);
    pa.status = PreventiveActionStatus.CLOSED;
    pa.closedBy = closedBy;
    pa.closedAt = new Date();
    const updated = await this.paRepository.save(pa);
    return this.mapToResponseDto(updated);
  }

  private mapToResponseDto(pa: PreventiveAction): PreventiveActionResponseDto {
    return {
      id: pa.id,
      paNumber: pa.paNumber,
      title: pa.title,
      status: pa.status,
      priority: pa.priority,
      actionType: pa.actionType,
      riskOpportunity: pa.riskOpportunity,
      actionPlan: pa.actionPlan,
      assignedToName: pa.assignedToName,
      targetDate: pa.targetDate,
      isImplemented: pa.isImplemented,
      isVerified: pa.isVerified,
      progressPercentage: pa.progressPercentage,
      createdAt: pa.createdAt,
      updatedAt: pa.updatedAt,
    };
  }
}
