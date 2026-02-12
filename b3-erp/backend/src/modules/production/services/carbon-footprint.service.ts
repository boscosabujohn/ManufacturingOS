import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CarbonFootprint, EmissionScope, EmissionSource } from '../entities/carbon-footprint.entity';

@Injectable()
export class CarbonFootprintService {
  constructor(
    @InjectRepository(CarbonFootprint)
    private readonly carbonFootprintRepository: Repository<CarbonFootprint>,
  ) {}

  async create(createDto: Partial<CarbonFootprint>): Promise<CarbonFootprint> {
    const record = this.carbonFootprintRepository.create(createDto);
    return this.carbonFootprintRepository.save(record);
  }

  async findAll(filters?: {
    companyId?: string;
    scope?: EmissionScope;
    source?: EmissionSource;
    startDate?: Date;
    endDate?: Date;
  }): Promise<CarbonFootprint[]> {
    const query = this.carbonFootprintRepository.createQueryBuilder('carbon');

    if (filters?.companyId) {
      query.andWhere('carbon.companyId = :companyId', { companyId: filters.companyId });
    }
    if (filters?.scope) {
      query.andWhere('carbon.scope = :scope', { scope: filters.scope });
    }
    if (filters?.source) {
      query.andWhere('carbon.source = :source', { source: filters.source });
    }
    if (filters?.startDate && filters?.endDate) {
      query.andWhere('carbon.recordDate BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    query.orderBy('carbon.recordDate', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<CarbonFootprint> {
    const record = await this.carbonFootprintRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Carbon Footprint record with ID ${id} not found`);
    }
    return record;
  }

  async update(id: string, updateDto: Partial<CarbonFootprint>): Promise<CarbonFootprint> {
    const record = await this.findOne(id);
    Object.assign(record, updateDto);
    return this.carbonFootprintRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.carbonFootprintRepository.remove(record);
  }

  async getEmissionsSummary(companyId: string, startDate: Date, endDate: Date): Promise<any> {
    const records = await this.findAll({ companyId, startDate, endDate });

    const byScope = {
      scope1: records.filter(r => r.scope === 'scope1').reduce((sum, r) => sum + Number(r.emissionAmount), 0),
      scope2: records.filter(r => r.scope === 'scope2').reduce((sum, r) => sum + Number(r.emissionAmount), 0),
      scope3: records.filter(r => r.scope === 'scope3').reduce((sum, r) => sum + Number(r.emissionAmount), 0),
    };

    const totalEmissions = byScope.scope1 + byScope.scope2 + byScope.scope3;
    const totalTarget = records.reduce((sum, r) => sum + Number(r.targetAmount || 0), 0);

    return {
      period: { startDate, endDate },
      totalEmissions,
      totalTarget,
      reductionProgress: totalTarget > 0 ? ((totalTarget - totalEmissions) / totalTarget) * 100 : 0,
      byScope,
      recordCount: records.length,
    };
  }

  async verify(id: string, verifiedBy: string): Promise<CarbonFootprint> {
    const record = await this.findOne(id);
    record.isVerified = true;
    record.verifiedBy = verifiedBy;
    record.verifiedAt = new Date();
    return this.carbonFootprintRepository.save(record);
  }
}
