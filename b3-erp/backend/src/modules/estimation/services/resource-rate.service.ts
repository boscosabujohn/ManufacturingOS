import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  EquipmentRate,
  LaborRateCard,
  MaterialRateCard,
  ResourceRate,
  ResourceRateType,
  SubcontractorRate,
} from '../entities/resource-rate.entity';

@Injectable()
export class ResourceRateService {
  constructor(
    @InjectRepository(ResourceRate)
    private resourceRateRepository: Repository<ResourceRate>,
    @InjectRepository(MaterialRateCard)
    private materialRateCardRepository: Repository<MaterialRateCard>,
    @InjectRepository(LaborRateCard)
    private laborRateCardRepository: Repository<LaborRateCard>,
    @InjectRepository(EquipmentRate)
    private equipmentRateRepository: Repository<EquipmentRate>,
    @InjectRepository(SubcontractorRate)
    private subcontractorRateRepository: Repository<SubcontractorRate>,
  ) {}

  // Resource Rates
  async createResourceRate(
    companyId: string,
    data: Partial<ResourceRate>,
  ): Promise<ResourceRate> {
    const rate = this.resourceRateRepository.create({
      ...data,
      companyId,
    });
    return this.resourceRateRepository.save(rate);
  }

  async findAllResourceRates(
    companyId: string,
    filters?: {
      rateType?: ResourceRateType;
      category?: string;
      isActive?: boolean;
    },
  ): Promise<ResourceRate[]> {
    const query = this.resourceRateRepository
      .createQueryBuilder('rate')
      .where('rate.companyId = :companyId', { companyId })
      .orderBy('rate.category', 'ASC')
      .addOrderBy('rate.name', 'ASC');

    if (filters?.rateType) {
      query.andWhere('rate.rateType = :rateType', { rateType: filters.rateType });
    }
    if (filters?.category) {
      query.andWhere('rate.category = :category', { category: filters.category });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('rate.isActive = :isActive', { isActive: filters.isActive });
    }

    return query.getMany();
  }

  async findResourceRateById(
    companyId: string,
    id: string,
  ): Promise<ResourceRate> {
    const rate = await this.resourceRateRepository.findOne({
      where: { id, companyId },
    });
    if (!rate) {
      throw new NotFoundException(`Resource Rate with ID ${id} not found`);
    }
    return rate;
  }

  async updateResourceRate(
    companyId: string,
    id: string,
    data: Partial<ResourceRate>,
  ): Promise<ResourceRate> {
    const rate = await this.findResourceRateById(companyId, id);
    Object.assign(rate, data);
    return this.resourceRateRepository.save(rate);
  }

  async deleteResourceRate(companyId: string, id: string): Promise<void> {
    const rate = await this.findResourceRateById(companyId, id);
    await this.resourceRateRepository.remove(rate);
  }

  async getEffectiveRate(
    companyId: string,
    resourceRateId: string,
    quantity: number,
  ): Promise<number> {
    const rate = await this.findResourceRateById(companyId, resourceRateId);
    let effectiveRate = Number(rate.standardRate);

    if (rate.priceBreaks && rate.priceBreaks.length > 0) {
      for (const pb of rate.priceBreaks) {
        if (quantity >= pb.minQuantity && quantity <= pb.maxQuantity) {
          effectiveRate = pb.rate;
          break;
        }
      }
    }

    return effectiveRate;
  }

  // Material Rate Cards
  async createMaterialRateCard(
    companyId: string,
    data: Partial<MaterialRateCard>,
  ): Promise<MaterialRateCard> {
    if (data.isDefault) {
      await this.materialRateCardRepository.update(
        { companyId, isDefault: true },
        { isDefault: false },
      );
    }
    const card = this.materialRateCardRepository.create({
      ...data,
      companyId,
    });
    return this.materialRateCardRepository.save(card);
  }

  async findAllMaterialRateCards(
    companyId: string,
    activeOnly?: boolean,
  ): Promise<MaterialRateCard[]> {
    const query: { companyId: string; isActive?: boolean } = { companyId };
    if (activeOnly) {
      query.isActive = true;
    }
    return this.materialRateCardRepository.find({
      where: query,
      order: { isDefault: 'DESC', name: 'ASC' },
    });
  }

  async findMaterialRateCardById(
    companyId: string,
    id: string,
  ): Promise<MaterialRateCard> {
    const card = await this.materialRateCardRepository.findOne({
      where: { id, companyId },
    });
    if (!card) {
      throw new NotFoundException(`Material Rate Card with ID ${id} not found`);
    }
    return card;
  }

  async updateMaterialRateCard(
    companyId: string,
    id: string,
    data: Partial<MaterialRateCard>,
  ): Promise<MaterialRateCard> {
    if (data.isDefault) {
      await this.materialRateCardRepository.update(
        { companyId, isDefault: true },
        { isDefault: false },
      );
    }
    const card = await this.findMaterialRateCardById(companyId, id);
    Object.assign(card, data);
    return this.materialRateCardRepository.save(card);
  }

  async deleteMaterialRateCard(companyId: string, id: string): Promise<void> {
    const card = await this.findMaterialRateCardById(companyId, id);
    await this.materialRateCardRepository.remove(card);
  }

  // Labor Rate Cards
  async createLaborRateCard(
    companyId: string,
    data: Partial<LaborRateCard>,
  ): Promise<LaborRateCard> {
    if (data.isDefault) {
      await this.laborRateCardRepository.update(
        { companyId, isDefault: true },
        { isDefault: false },
      );
    }
    const card = this.laborRateCardRepository.create({
      ...data,
      companyId,
    });
    return this.laborRateCardRepository.save(card);
  }

  async findAllLaborRateCards(
    companyId: string,
    activeOnly?: boolean,
  ): Promise<LaborRateCard[]> {
    const query: { companyId: string; isActive?: boolean } = { companyId };
    if (activeOnly) {
      query.isActive = true;
    }
    return this.laborRateCardRepository.find({
      where: query,
      order: { isDefault: 'DESC', name: 'ASC' },
    });
  }

  async findLaborRateCardById(
    companyId: string,
    id: string,
  ): Promise<LaborRateCard> {
    const card = await this.laborRateCardRepository.findOne({
      where: { id, companyId },
    });
    if (!card) {
      throw new NotFoundException(`Labor Rate Card with ID ${id} not found`);
    }
    return card;
  }

  async updateLaborRateCard(
    companyId: string,
    id: string,
    data: Partial<LaborRateCard>,
  ): Promise<LaborRateCard> {
    if (data.isDefault) {
      await this.laborRateCardRepository.update(
        { companyId, isDefault: true },
        { isDefault: false },
      );
    }
    const card = await this.findLaborRateCardById(companyId, id);
    Object.assign(card, data);
    return this.laborRateCardRepository.save(card);
  }

  async deleteLaborRateCard(companyId: string, id: string): Promise<void> {
    const card = await this.findLaborRateCardById(companyId, id);
    await this.laborRateCardRepository.remove(card);
  }

  // Equipment Rates
  async createEquipmentRate(
    companyId: string,
    data: Partial<EquipmentRate>,
  ): Promise<EquipmentRate> {
    const rate = this.equipmentRateRepository.create({
      ...data,
      companyId,
    });
    return this.equipmentRateRepository.save(rate);
  }

  async findAllEquipmentRates(
    companyId: string,
    filters?: { category?: string; isActive?: boolean },
  ): Promise<EquipmentRate[]> {
    const query = this.equipmentRateRepository
      .createQueryBuilder('rate')
      .where('rate.companyId = :companyId', { companyId })
      .orderBy('rate.category', 'ASC')
      .addOrderBy('rate.name', 'ASC');

    if (filters?.category) {
      query.andWhere('rate.category = :category', { category: filters.category });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('rate.isActive = :isActive', { isActive: filters.isActive });
    }

    return query.getMany();
  }

  async findEquipmentRateById(
    companyId: string,
    id: string,
  ): Promise<EquipmentRate> {
    const rate = await this.equipmentRateRepository.findOne({
      where: { id, companyId },
    });
    if (!rate) {
      throw new NotFoundException(`Equipment Rate with ID ${id} not found`);
    }
    return rate;
  }

  async updateEquipmentRate(
    companyId: string,
    id: string,
    data: Partial<EquipmentRate>,
  ): Promise<EquipmentRate> {
    const rate = await this.findEquipmentRateById(companyId, id);
    Object.assign(rate, data);
    return this.equipmentRateRepository.save(rate);
  }

  async deleteEquipmentRate(companyId: string, id: string): Promise<void> {
    const rate = await this.findEquipmentRateById(companyId, id);
    await this.equipmentRateRepository.remove(rate);
  }

  async calculateEquipmentCost(
    companyId: string,
    equipmentRateId: string,
    days: number,
    includeOperator: boolean = false,
  ): Promise<{
    baseCost: number;
    fuelCost: number;
    operatorCost: number;
    maintenanceCost: number;
    mobilization: number;
    demobilization: number;
    totalCost: number;
  }> {
    const rate = await this.findEquipmentRateById(companyId, equipmentRateId);
    const hoursPerDay = 8;
    const totalHours = days * hoursPerDay;

    const baseCost = Number(rate.dailyRate) * days;
    const fuelCost = (Number(rate.fuelCostPerHour) || 0) * totalHours;
    const operatorCost = includeOperator
      ? (Number(rate.operatorCostPerHour) || 0) * totalHours
      : 0;
    const maintenanceCost =
      (Number(rate.maintenanceCostPerHour) || 0) * totalHours;
    const mobilization = Number(rate.mobilizationCost) || 0;
    const demobilization = Number(rate.demobilizationCost) || 0;

    return {
      baseCost,
      fuelCost,
      operatorCost,
      maintenanceCost,
      mobilization,
      demobilization,
      totalCost:
        baseCost +
        fuelCost +
        operatorCost +
        maintenanceCost +
        mobilization +
        demobilization,
    };
  }

  // Subcontractor Rates
  async createSubcontractorRate(
    companyId: string,
    data: Partial<SubcontractorRate>,
  ): Promise<SubcontractorRate> {
    const rate = this.subcontractorRateRepository.create({
      ...data,
      companyId,
    });
    return this.subcontractorRateRepository.save(rate);
  }

  async findAllSubcontractorRates(
    companyId: string,
    filters?: { isActive?: boolean; isPreferred?: boolean },
  ): Promise<SubcontractorRate[]> {
    const query = this.subcontractorRateRepository
      .createQueryBuilder('rate')
      .where('rate.companyId = :companyId', { companyId })
      .orderBy('rate.isPreferred', 'DESC')
      .addOrderBy('rate.subcontractorName', 'ASC');

    if (filters?.isActive !== undefined) {
      query.andWhere('rate.isActive = :isActive', { isActive: filters.isActive });
    }
    if (filters?.isPreferred !== undefined) {
      query.andWhere('rate.isPreferred = :isPreferred', {
        isPreferred: filters.isPreferred,
      });
    }

    return query.getMany();
  }

  async findSubcontractorRateById(
    companyId: string,
    id: string,
  ): Promise<SubcontractorRate> {
    const rate = await this.subcontractorRateRepository.findOne({
      where: { id, companyId },
    });
    if (!rate) {
      throw new NotFoundException(`Subcontractor Rate with ID ${id} not found`);
    }
    return rate;
  }

  async updateSubcontractorRate(
    companyId: string,
    id: string,
    data: Partial<SubcontractorRate>,
  ): Promise<SubcontractorRate> {
    const rate = await this.findSubcontractorRateById(companyId, id);
    Object.assign(rate, data);
    return this.subcontractorRateRepository.save(rate);
  }

  async deleteSubcontractorRate(companyId: string, id: string): Promise<void> {
    const rate = await this.findSubcontractorRateById(companyId, id);
    await this.subcontractorRateRepository.remove(rate);
  }

  async findSubcontractorsByService(
    companyId: string,
    serviceName: string,
  ): Promise<SubcontractorRate[]> {
    return this.subcontractorRateRepository
      .createQueryBuilder('rate')
      .where('rate.companyId = :companyId', { companyId })
      .andWhere('rate.isActive = :isActive', { isActive: true })
      .andWhere("rate.services @> :service", {
        service: JSON.stringify([{ serviceName }]),
      })
      .orderBy('rate.isPreferred', 'DESC')
      .addOrderBy('rate.performanceRating', 'DESC')
      .getMany();
  }
}
