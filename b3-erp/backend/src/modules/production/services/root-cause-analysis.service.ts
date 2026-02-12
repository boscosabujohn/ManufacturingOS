import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RootCauseAnalysis, RCAStatus, RCAMethodology } from '../entities/root-cause-analysis.entity';

@Injectable()
export class RootCauseAnalysisService {
  constructor(
    @InjectRepository(RootCauseAnalysis)
    private readonly rcaRepository: Repository<RootCauseAnalysis>,
  ) {}

  async create(createDto: Partial<RootCauseAnalysis>): Promise<RootCauseAnalysis> {
    const existing = await this.rcaRepository.findOne({
      where: { rcaNumber: createDto.rcaNumber },
    });

    if (existing) {
      throw new BadRequestException(`RCA ${createDto.rcaNumber} already exists`);
    }

    const rca = this.rcaRepository.create(createDto);
    return this.rcaRepository.save(rca);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: RCAStatus;
    methodology?: RCAMethodology;
  }): Promise<RootCauseAnalysis[]> {
    const query = this.rcaRepository.createQueryBuilder('rca');

    if (filters?.companyId) {
      query.andWhere('rca.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('rca.status = :status', { status: filters.status });
    }

    if (filters?.methodology) {
      query.andWhere('rca.methodology = :methodology', { methodology: filters.methodology });
    }

    query.orderBy('rca.createdAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<RootCauseAnalysis> {
    const rca = await this.rcaRepository.findOne({ where: { id } });
    if (!rca) {
      throw new NotFoundException(`RCA with ID ${id} not found`);
    }
    return rca;
  }

  async update(id: string, updateDto: Partial<RootCauseAnalysis>): Promise<RootCauseAnalysis> {
    const rca = await this.findOne(id);
    Object.assign(rca, updateDto);
    return this.rcaRepository.save(rca);
  }

  async remove(id: string): Promise<void> {
    const rca = await this.findOne(id);
    if (rca.status !== 'open') {
      throw new BadRequestException('Only open RCAs can be deleted');
    }
    await this.rcaRepository.remove(rca);
  }

  async complete(id: string, rootCause: string): Promise<RootCauseAnalysis> {
    const rca = await this.findOne(id);
    rca.rootCause = rootCause;
    rca.status = 'completed';
    return this.rcaRepository.save(rca);
  }

  async addCorrectiveAction(id: string, action: any): Promise<RootCauseAnalysis> {
    const rca = await this.findOne(id);
    if (!rca.correctiveActions) {
      rca.correctiveActions = [];
    }
    rca.correctiveActions.push(action);
    return this.rcaRepository.save(rca);
  }

  async verify(id: string, verifiedBy: string): Promise<RootCauseAnalysis> {
    const rca = await this.findOne(id);
    rca.verificationStatus = 'verified';
    rca.verificationDate = new Date();
    rca.verifiedBy = verifiedBy;
    rca.status = 'closed';
    return this.rcaRepository.save(rca);
  }
}
