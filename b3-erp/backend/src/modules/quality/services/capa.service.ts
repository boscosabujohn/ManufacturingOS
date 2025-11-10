import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CAPA, CAPAStatus } from '../entities/capa.entity';
import { CreateCAPADto, UpdateCAPADto, CAPAResponseDto } from '../dto';

@Injectable()
export class CAPAService {
  constructor(
    @InjectRepository(CAPA)
    private readonly capaRepository: Repository<CAPA>,
  ) {}

  async create(createDto: CreateCAPADto): Promise<CAPAResponseDto> {
    const capa = this.capaRepository.create({ ...createDto, status: CAPAStatus.DRAFT });
    const saved = await this.capaRepository.save(capa);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: { status?: CAPAStatus }): Promise<CAPAResponseDto[]> {
    const query = this.capaRepository.createQueryBuilder('capa');
    if (filters?.status) query.andWhere('capa.status = :status', { status: filters.status });
    query.orderBy('capa.createdAt', 'DESC');
    const results = await query.getMany();
    return results.map((r) => this.mapToResponseDto(r));
  }

  async findOne(id: string): Promise<CAPAResponseDto> {
    const capa = await this.capaRepository.findOne({ where: { id } });
    if (!capa) throw new NotFoundException(`CAPA with ID ${id} not found`);
    return this.mapToResponseDto(capa);
  }

  async update(id: string, updateDto: UpdateCAPADto): Promise<CAPAResponseDto> {
    const capa = await this.capaRepository.findOne({ where: { id } });
    if (!capa) throw new NotFoundException(`CAPA with ID ${id} not found`);
    Object.assign(capa, updateDto);
    const updated = await this.capaRepository.save(capa);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const capa = await this.capaRepository.findOne({ where: { id } });
    if (!capa) throw new NotFoundException(`CAPA with ID ${id} not found`);
    if (capa.status !== CAPAStatus.DRAFT) {
      throw new BadRequestException('Only draft CAPAs can be deleted');
    }
    await this.capaRepository.remove(capa);
  }

  async initiate(id: string, initiatedBy: string): Promise<CAPAResponseDto> {
    const capa = await this.capaRepository.findOne({ where: { id } });
    if (!capa) throw new NotFoundException(`CAPA with ID ${id} not found`);
    capa.status = CAPAStatus.SUBMITTED;
    capa.initiatedBy = initiatedBy;
    capa.initiatedAt = new Date();
    const updated = await this.capaRepository.save(capa);
    return this.mapToResponseDto(updated);
  }

  async implement(id: string, implementedBy: string): Promise<CAPAResponseDto> {
    const capa = await this.capaRepository.findOne({ where: { id } });
    if (!capa) throw new NotFoundException(`CAPA with ID ${id} not found`);
    capa.status = CAPAStatus.IMPLEMENTED;
    capa.implementedBy = implementedBy;
    capa.implementedAt = new Date();
    capa.isImplemented = true;
    const updated = await this.capaRepository.save(capa);
    return this.mapToResponseDto(updated);
  }

  async verify(id: string, verifiedBy: string, isEffective: boolean): Promise<CAPAResponseDto> {
    const capa = await this.capaRepository.findOne({ where: { id } });
    if (!capa) throw new NotFoundException(`CAPA with ID ${id} not found`);
    capa.status = CAPAStatus.VERIFIED;
    capa.verifiedBy = verifiedBy;
    capa.verifiedAt = new Date();
    capa.isVerified = true;
    capa.isEffective = isEffective;
    const updated = await this.capaRepository.save(capa);
    return this.mapToResponseDto(updated);
  }

  async close(id: string, closedBy: string): Promise<CAPAResponseDto> {
    const capa = await this.capaRepository.findOne({ where: { id } });
    if (!capa) throw new NotFoundException(`CAPA with ID ${id} not found`);
    capa.status = CAPAStatus.CLOSED;
    capa.closedBy = closedBy;
    capa.closedAt = new Date();
    const updated = await this.capaRepository.save(capa);
    return this.mapToResponseDto(updated);
  }

  private mapToResponseDto(capa: CAPA): CAPAResponseDto {
    return {
      id: capa.id,
      capaNumber: capa.capaNumber,
      title: capa.title,
      status: capa.status,
      priority: capa.priority,
      capaType: capa.capaType,
      problemStatement: capa.problemStatement,
      rootCauseAnalysis: capa.rootCauseAnalysis,
      actionPlan: capa.actionPlan,
      ownerName: capa.ownerName,
      targetDate: capa.targetDate,
      isImplemented: capa.isImplemented,
      isVerified: capa.isVerified,
      isEffective: capa.isEffective,
      progressPercentage: capa.progressPercentage,
      createdAt: capa.createdAt,
      updatedAt: capa.updatedAt,
    };
  }
}
