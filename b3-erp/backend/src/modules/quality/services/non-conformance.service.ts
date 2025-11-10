import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NonConformance, NCRStatus } from '../entities/non-conformance.entity';
import { CreateNonConformanceDto, UpdateNonConformanceDto, NonConformanceResponseDto } from '../dto';

@Injectable()
export class NonConformanceService {
  constructor(
    @InjectRepository(NonConformance)
    private readonly ncrRepository: Repository<NonConformance>,
  ) {}

  async create(createDto: CreateNonConformanceDto): Promise<NonConformanceResponseDto> {
    const existing = await this.ncrRepository.findOne({
      where: { ncrNumber: createDto.ncrNumber },
    });

    if (existing) {
      throw new BadRequestException(
        `NCR ${createDto.ncrNumber} already exists`,
      );
    }

    const ncr = this.ncrRepository.create({
      ...createDto,
      status: NCRStatus.DRAFT,
    });

    const savedNcr = await this.ncrRepository.save(ncr);
    return this.mapToResponseDto(savedNcr);
  }

  async findAll(filters?: {
    status?: NCRStatus;
    severity?: string;
    ncrType?: string;
  }): Promise<NonConformanceResponseDto[]> {
    const query = this.ncrRepository.createQueryBuilder('ncr');

    if (filters?.status) {
      query.andWhere('ncr.status = :status', { status: filters.status });
    }

    if (filters?.severity) {
      query.andWhere('ncr.severity = :severity', { severity: filters.severity });
    }

    if (filters?.ncrType) {
      query.andWhere('ncr.ncrType = :ncrType', { ncrType: filters.ncrType });
    }

    query.orderBy('ncr.createdAt', 'DESC');

    const ncrs = await query.getMany();
    return ncrs.map((n) => this.mapToResponseDto(n));
  }

  async findOne(id: string): Promise<NonConformanceResponseDto> {
    const ncr = await this.ncrRepository.findOne({
      where: { id },
    });

    if (!ncr) {
      throw new NotFoundException(`NCR with ID ${id} not found`);
    }

    return this.mapToResponseDto(ncr);
  }

  async update(
    id: string,
    updateDto: UpdateNonConformanceDto,
  ): Promise<NonConformanceResponseDto> {
    const ncr = await this.ncrRepository.findOne({
      where: { id },
    });

    if (!ncr) {
      throw new NotFoundException(`NCR with ID ${id} not found`);
    }

    Object.assign(ncr, updateDto);
    const updatedNcr = await this.ncrRepository.save(ncr);
    return this.mapToResponseDto(updatedNcr);
  }

  async remove(id: string): Promise<void> {
    const ncr = await this.ncrRepository.findOne({
      where: { id },
    });

    if (!ncr) {
      throw new NotFoundException(`NCR with ID ${id} not found`);
    }

    if (ncr.status !== NCRStatus.DRAFT) {
      throw new BadRequestException('Only draft NCRs can be deleted');
    }

    await this.ncrRepository.remove(ncr);
  }

  async submit(id: string, submittedBy: string): Promise<NonConformanceResponseDto> {
    const ncr = await this.ncrRepository.findOne({ where: { id } });
    if (!ncr) throw new NotFoundException(`NCR with ID ${id} not found`);

    ncr.status = NCRStatus.SUBMITTED;
    ncr.submittedBy = submittedBy;
    ncr.submittedAt = new Date();

    const updated = await this.ncrRepository.save(ncr);
    return this.mapToResponseDto(updated);
  }

  async investigate(id: string, investigatedBy: string): Promise<NonConformanceResponseDto> {
    const ncr = await this.ncrRepository.findOne({ where: { id } });
    if (!ncr) throw new NotFoundException(`NCR with ID ${id} not found`);

    ncr.status = NCRStatus.UNDER_INVESTIGATION;
    ncr.investigatedBy = investigatedBy;

    const updated = await this.ncrRepository.save(ncr);
    return this.mapToResponseDto(updated);
  }

  async approveCAPA(id: string, approvedBy: string): Promise<NonConformanceResponseDto> {
    const ncr = await this.ncrRepository.findOne({ where: { id } });
    if (!ncr) throw new NotFoundException(`NCR with ID ${id} not found`);

    ncr.status = NCRStatus.CAPA_REQUIRED;
    ncr.requiresCAPA = true;
    ncr.approvedBy = approvedBy;
    ncr.approvedAt = new Date();

    const updated = await this.ncrRepository.save(ncr);
    return this.mapToResponseDto(updated);
  }

  async close(id: string, closedBy: string): Promise<NonConformanceResponseDto> {
    const ncr = await this.ncrRepository.findOne({ where: { id } });
    if (!ncr) throw new NotFoundException(`NCR with ID ${id} not found`);

    ncr.status = NCRStatus.CLOSED;
    ncr.closedBy = closedBy;
    ncr.closedAt = new Date();

    const updated = await this.ncrRepository.save(ncr);
    return this.mapToResponseDto(updated);
  }

  private mapToResponseDto(ncr: NonConformance): NonConformanceResponseDto {
    return {
      id: ncr.id,
      ncrNumber: ncr.ncrNumber,
      title: ncr.title,
      description: ncr.description,
      ncrType: ncr.ncrType,
      status: ncr.status,
      severity: ncr.severity,
      priority: ncr.priority,
      itemCode: ncr.itemCode,
      affectedQuantity: ncr.affectedQuantity,
      reportedDate: ncr.reportedDate,
      reportedByName: ncr.reportedByName,
      requiresCAPA: ncr.requiresCAPA,
      capaNumber: ncr.capaNumber,
      createdAt: ncr.createdAt,
      updatedAt: ncr.updatedAt,
    };
  }
}
