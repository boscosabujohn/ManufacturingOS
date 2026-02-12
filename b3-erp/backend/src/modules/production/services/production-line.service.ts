import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductionLine, ProductionLineStatus } from '../entities/production-line.entity';

@Injectable()
export class ProductionLineService {
  constructor(
    @InjectRepository(ProductionLine)
    private readonly productionLineRepository: Repository<ProductionLine>,
  ) {}

  async create(createDto: Partial<ProductionLine>): Promise<ProductionLine> {
    const existing = await this.productionLineRepository.findOne({
      where: { code: createDto.code },
    });

    if (existing) {
      throw new BadRequestException(`Production Line ${createDto.code} already exists`);
    }

    const line = this.productionLineRepository.create(createDto);
    return this.productionLineRepository.save(line);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: ProductionLineStatus;
  }): Promise<ProductionLine[]> {
    const query = this.productionLineRepository.createQueryBuilder('line');

    if (filters?.companyId) {
      query.andWhere('line.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('line.status = :status', { status: filters.status });
    }

    query.orderBy('line.name', 'ASC');
    return query.getMany();
  }

  async findOne(id: string): Promise<ProductionLine> {
    const line = await this.productionLineRepository.findOne({ where: { id } });
    if (!line) {
      throw new NotFoundException(`Production Line with ID ${id} not found`);
    }
    return line;
  }

  async update(id: string, updateDto: Partial<ProductionLine>): Promise<ProductionLine> {
    const line = await this.findOne(id);
    Object.assign(line, updateDto);
    return this.productionLineRepository.save(line);
  }

  async remove(id: string): Promise<void> {
    const line = await this.findOne(id);
    await this.productionLineRepository.remove(line);
  }

  async getCapacityUtilization(id: string): Promise<any> {
    const line = await this.findOne(id);

    return {
      lineId: line.id,
      lineName: line.name,
      lineCode: line.code,
      capacityPerHour: line.capacityPerHour,
      capacityUom: line.capacityUom,
      currentOee: line.currentOee,
      oeeTarget: line.oeeTarget,
      utilizationRate: line.currentOee || 0,
    };
  }
}
