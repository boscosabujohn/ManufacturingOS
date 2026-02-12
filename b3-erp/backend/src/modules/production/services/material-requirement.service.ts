import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialRequirement, RequirementType } from '../entities/material-requirement.entity';

@Injectable()
export class MaterialRequirementService {
  constructor(
    @InjectRepository(MaterialRequirement)
    private readonly materialRequirementRepository: Repository<MaterialRequirement>,
  ) {}

  async create(createDto: Partial<MaterialRequirement>): Promise<MaterialRequirement> {
    const requirement = this.materialRequirementRepository.create(createDto);
    return this.materialRequirementRepository.save(requirement);
  }

  async findAll(filters?: {
    companyId?: string;
    requirementType?: RequirementType;
    itemId?: string;
    mrpRunId?: string;
  }): Promise<MaterialRequirement[]> {
    const query = this.materialRequirementRepository.createQueryBuilder('req');

    if (filters?.companyId) {
      query.andWhere('req.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.requirementType) {
      query.andWhere('req.requirementType = :requirementType', { requirementType: filters.requirementType });
    }

    if (filters?.itemId) {
      query.andWhere('req.itemId = :itemId', { itemId: filters.itemId });
    }

    if (filters?.mrpRunId) {
      query.andWhere('req.mrpRunId = :mrpRunId', { mrpRunId: filters.mrpRunId });
    }

    query.orderBy('req.requiredDate', 'ASC');
    return query.getMany();
  }

  async findOne(id: string): Promise<MaterialRequirement> {
    const requirement = await this.materialRequirementRepository.findOne({ where: { id } });
    if (!requirement) {
      throw new NotFoundException(`Material Requirement with ID ${id} not found`);
    }
    return requirement;
  }

  async update(id: string, updateDto: Partial<MaterialRequirement>): Promise<MaterialRequirement> {
    const requirement = await this.findOne(id);
    Object.assign(requirement, updateDto);
    return this.materialRequirementRepository.save(requirement);
  }

  async remove(id: string): Promise<void> {
    const requirement = await this.findOne(id);
    await this.materialRequirementRepository.remove(requirement);
  }

  async calculateNetRequirement(id: string): Promise<any> {
    const requirement = await this.findOne(id);

    const netRequirement = requirement.grossRequirement -
                          requirement.onHandQuantity -
                          requirement.scheduledReceipts +
                          requirement.safetyStock;

    requirement.netRequirement = netRequirement > 0 ? netRequirement : 0;
    await this.materialRequirementRepository.save(requirement);

    return {
      requirementId: requirement.id,
      grossRequirement: requirement.grossRequirement,
      onHand: requirement.onHandQuantity,
      scheduledReceipts: requirement.scheduledReceipts,
      safetyStock: requirement.safetyStock,
      netRequirement: requirement.netRequirement,
    };
  }
}
