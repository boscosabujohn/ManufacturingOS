import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BOQTemplate,
  CostCategory,
  EstimateApprovalWorkflow,
  EstimateTemplate,
  EstimateVersion,
  TemplateType,
} from '../entities/estimate-template.entity';

@Injectable()
export class EstimateTemplateService {
  constructor(
    @InjectRepository(EstimateTemplate)
    private templateRepository: Repository<EstimateTemplate>,
    @InjectRepository(BOQTemplate)
    private boqTemplateRepository: Repository<BOQTemplate>,
    @InjectRepository(CostCategory)
    private costCategoryRepository: Repository<CostCategory>,
    @InjectRepository(EstimateApprovalWorkflow)
    private workflowRepository: Repository<EstimateApprovalWorkflow>,
    @InjectRepository(EstimateVersion)
    private versionRepository: Repository<EstimateVersion>,
  ) {}

  // Estimate Templates
  async createTemplate(
    companyId: string,
    data: Partial<EstimateTemplate>,
  ): Promise<EstimateTemplate> {
    if (data.isDefault) {
      await this.templateRepository.update(
        { companyId, templateType: data.templateType, isDefault: true },
        { isDefault: false },
      );
    }
    const template = this.templateRepository.create({
      ...data,
      companyId,
    });
    return this.templateRepository.save(template);
  }

  async findAllTemplates(
    companyId: string,
    filters?: {
      templateType?: TemplateType;
      category?: string;
      isActive?: boolean;
    },
  ): Promise<EstimateTemplate[]> {
    const query = this.templateRepository
      .createQueryBuilder('template')
      .where('template.companyId = :companyId', { companyId })
      .orderBy('template.isDefault', 'DESC')
      .addOrderBy('template.name', 'ASC');

    if (filters?.templateType) {
      query.andWhere('template.templateType = :templateType', {
        templateType: filters.templateType,
      });
    }
    if (filters?.category) {
      query.andWhere('template.category = :category', {
        category: filters.category,
      });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('template.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    return query.getMany();
  }

  async findTemplateById(
    companyId: string,
    id: string,
  ): Promise<EstimateTemplate> {
    const template = await this.templateRepository.findOne({
      where: { id, companyId },
    });
    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
    return template;
  }

  async updateTemplate(
    companyId: string,
    id: string,
    data: Partial<EstimateTemplate>,
  ): Promise<EstimateTemplate> {
    if (data.isDefault) {
      const template = await this.findTemplateById(companyId, id);
      await this.templateRepository.update(
        { companyId, templateType: template.templateType, isDefault: true },
        { isDefault: false },
      );
    }
    const template = await this.findTemplateById(companyId, id);
    Object.assign(template, data);
    return this.templateRepository.save(template);
  }

  async deleteTemplate(companyId: string, id: string): Promise<void> {
    const template = await this.findTemplateById(companyId, id);
    await this.templateRepository.remove(template);
  }

  async recordTemplateUsage(companyId: string, id: string): Promise<void> {
    await this.templateRepository.update(
      { id, companyId },
      {
        usageCount: () => 'usageCount + 1',
        lastUsedAt: new Date(),
      },
    );
  }

  // BOQ Templates
  async createBOQTemplate(
    companyId: string,
    data: Partial<BOQTemplate>,
  ): Promise<BOQTemplate> {
    if (data.isDefault) {
      await this.boqTemplateRepository.update(
        { companyId, isDefault: true },
        { isDefault: false },
      );
    }
    const template = this.boqTemplateRepository.create({
      ...data,
      companyId,
    });
    return this.boqTemplateRepository.save(template);
  }

  async findAllBOQTemplates(
    companyId: string,
    filters?: { category?: string; isActive?: boolean },
  ): Promise<BOQTemplate[]> {
    const query = this.boqTemplateRepository
      .createQueryBuilder('template')
      .where('template.companyId = :companyId', { companyId })
      .orderBy('template.isDefault', 'DESC')
      .addOrderBy('template.name', 'ASC');

    if (filters?.category) {
      query.andWhere('template.category = :category', {
        category: filters.category,
      });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('template.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    return query.getMany();
  }

  async findBOQTemplateById(
    companyId: string,
    id: string,
  ): Promise<BOQTemplate> {
    const template = await this.boqTemplateRepository.findOne({
      where: { id, companyId },
    });
    if (!template) {
      throw new NotFoundException(`BOQ Template with ID ${id} not found`);
    }
    return template;
  }

  async updateBOQTemplate(
    companyId: string,
    id: string,
    data: Partial<BOQTemplate>,
  ): Promise<BOQTemplate> {
    if (data.isDefault) {
      await this.boqTemplateRepository.update(
        { companyId, isDefault: true },
        { isDefault: false },
      );
    }
    const template = await this.findBOQTemplateById(companyId, id);
    Object.assign(template, data);
    return this.boqTemplateRepository.save(template);
  }

  async deleteBOQTemplate(companyId: string, id: string): Promise<void> {
    const template = await this.findBOQTemplateById(companyId, id);
    await this.boqTemplateRepository.remove(template);
  }

  // Cost Categories
  async createCostCategory(
    companyId: string,
    data: Partial<CostCategory>,
  ): Promise<CostCategory> {
    const category = this.costCategoryRepository.create({
      ...data,
      companyId,
    });
    return this.costCategoryRepository.save(category);
  }

  async findAllCostCategories(
    companyId: string,
    filters?: {
      costType?: string;
      parentCategoryId?: string;
      isActive?: boolean;
    },
  ): Promise<CostCategory[]> {
    const query = this.costCategoryRepository
      .createQueryBuilder('category')
      .where('category.companyId = :companyId', { companyId })
      .orderBy('category.sortOrder', 'ASC')
      .addOrderBy('category.name', 'ASC');

    if (filters?.costType) {
      query.andWhere('category.costType = :costType', {
        costType: filters.costType,
      });
    }
    if (filters?.parentCategoryId) {
      query.andWhere('category.parentCategoryId = :parentCategoryId', {
        parentCategoryId: filters.parentCategoryId,
      });
    } else if (filters?.parentCategoryId === null) {
      query.andWhere('category.parentCategoryId IS NULL');
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('category.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    return query.getMany();
  }

  async findCostCategoryById(
    companyId: string,
    id: string,
  ): Promise<CostCategory> {
    const category = await this.costCategoryRepository.findOne({
      where: { id, companyId },
    });
    if (!category) {
      throw new NotFoundException(`Cost Category with ID ${id} not found`);
    }
    return category;
  }

  async updateCostCategory(
    companyId: string,
    id: string,
    data: Partial<CostCategory>,
  ): Promise<CostCategory> {
    const category = await this.findCostCategoryById(companyId, id);
    Object.assign(category, data);
    return this.costCategoryRepository.save(category);
  }

  async deleteCostCategory(companyId: string, id: string): Promise<void> {
    const category = await this.findCostCategoryById(companyId, id);
    await this.costCategoryRepository.remove(category);
  }

  async getCostCategoryTree(companyId: string): Promise<CostCategory[]> {
    const categories = await this.costCategoryRepository.find({
      where: { companyId, isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });

    return categories.filter((c) => !c.parentCategoryId);
  }

  // Approval Workflows
  async createWorkflow(
    companyId: string,
    data: Partial<EstimateApprovalWorkflow>,
  ): Promise<EstimateApprovalWorkflow> {
    if (data.isDefault) {
      await this.workflowRepository.update(
        { companyId, entityType: data.entityType, isDefault: true },
        { isDefault: false },
      );
    }
    const workflow = this.workflowRepository.create({
      ...data,
      companyId,
    });
    return this.workflowRepository.save(workflow);
  }

  async findAllWorkflows(
    companyId: string,
    filters?: { entityType?: string; isActive?: boolean },
  ): Promise<EstimateApprovalWorkflow[]> {
    const query = this.workflowRepository
      .createQueryBuilder('workflow')
      .where('workflow.companyId = :companyId', { companyId })
      .orderBy('workflow.isDefault', 'DESC')
      .addOrderBy('workflow.name', 'ASC');

    if (filters?.entityType) {
      query.andWhere('workflow.entityType = :entityType', {
        entityType: filters.entityType,
      });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('workflow.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    return query.getMany();
  }

  async findWorkflowById(
    companyId: string,
    id: string,
  ): Promise<EstimateApprovalWorkflow> {
    const workflow = await this.workflowRepository.findOne({
      where: { id, companyId },
    });
    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }
    return workflow;
  }

  async updateWorkflow(
    companyId: string,
    id: string,
    data: Partial<EstimateApprovalWorkflow>,
  ): Promise<EstimateApprovalWorkflow> {
    if (data.isDefault) {
      const workflow = await this.findWorkflowById(companyId, id);
      await this.workflowRepository.update(
        { companyId, entityType: workflow.entityType, isDefault: true },
        { isDefault: false },
      );
    }
    const workflow = await this.findWorkflowById(companyId, id);
    Object.assign(workflow, data);
    return this.workflowRepository.save(workflow);
  }

  async deleteWorkflow(companyId: string, id: string): Promise<void> {
    const workflow = await this.findWorkflowById(companyId, id);
    await this.workflowRepository.remove(workflow);
  }

  async getApplicableWorkflow(
    companyId: string,
    entityType: string,
    amount?: number,
  ): Promise<EstimateApprovalWorkflow | null> {
    const query = this.workflowRepository
      .createQueryBuilder('workflow')
      .where('workflow.companyId = :companyId', { companyId })
      .andWhere('workflow.isActive = :isActive', { isActive: true })
      .andWhere(
        '(workflow.entityType = :entityType OR workflow.entityType = :all)',
        { entityType, all: 'All' },
      )
      .orderBy('workflow.isDefault', 'DESC');

    if (amount !== undefined) {
      query.andWhere(
        '(workflow.thresholdAmount IS NULL OR workflow.thresholdAmount <= :amount)',
        { amount },
      );
    }

    return query.getOne();
  }

  // Estimate Versions
  async createVersion(
    companyId: string,
    data: Partial<EstimateVersion>,
  ): Promise<EstimateVersion> {
    const version = this.versionRepository.create({
      ...data,
      companyId,
    });
    return this.versionRepository.save(version);
  }

  async findVersionsByEstimate(
    companyId: string,
    estimateId: string,
    estimateType: 'BOQ' | 'CostEstimate' | 'Pricing',
  ): Promise<EstimateVersion[]> {
    return this.versionRepository.find({
      where: { companyId, estimateId, estimateType },
      order: { versionNumber: 'DESC' },
    });
  }

  async findVersionById(
    companyId: string,
    id: string,
  ): Promise<EstimateVersion> {
    const version = await this.versionRepository.findOne({
      where: { id, companyId },
    });
    if (!version) {
      throw new NotFoundException(`Version with ID ${id} not found`);
    }
    return version;
  }

  async compareVersions(
    companyId: string,
    versionId1: string,
    versionId2: string,
  ): Promise<{
    version1: EstimateVersion;
    version2: EstimateVersion;
    differences: {
      field: string;
      value1: unknown;
      value2: unknown;
      changeType: 'added' | 'removed' | 'modified';
    }[];
    totalDifference: number;
    percentageChange: number;
  }> {
    const version1 = await this.findVersionById(companyId, versionId1);
    const version2 = await this.findVersionById(companyId, versionId2);

    const snapshot1 = version1.snapshot as Record<string, unknown>;
    const snapshot2 = version2.snapshot as Record<string, unknown>;

    const differences: {
      field: string;
      value1: unknown;
      value2: unknown;
      changeType: 'added' | 'removed' | 'modified';
    }[] = [];

    const allKeys = new Set([
      ...Object.keys(snapshot1),
      ...Object.keys(snapshot2),
    ]);

    for (const key of allKeys) {
      const v1 = snapshot1[key];
      const v2 = snapshot2[key];

      if (v1 === undefined) {
        differences.push({ field: key, value1: null, value2: v2, changeType: 'added' });
      } else if (v2 === undefined) {
        differences.push({ field: key, value1: v1, value2: null, changeType: 'removed' });
      } else if (JSON.stringify(v1) !== JSON.stringify(v2)) {
        differences.push({ field: key, value1: v1, value2: v2, changeType: 'modified' });
      }
    }

    const total1 = Number(version1.previousTotal) || 0;
    const total2 = Number(version2.newTotal) || 0;
    const totalDifference = total2 - total1;
    const percentageChange = total1 > 0 ? (totalDifference / total1) * 100 : 0;

    return {
      version1,
      version2,
      differences,
      totalDifference,
      percentageChange,
    };
  }
}
