import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScenarioPlanning, DisruptionType, ScenarioStatus } from '../entities/scenario-planning.entity';

@Injectable()
export class ScenarioPlanningService {
  constructor(
    @InjectRepository(ScenarioPlanning)
    private readonly scenarioPlanningRepository: Repository<ScenarioPlanning>,
  ) {}

  async create(createDto: Partial<ScenarioPlanning>): Promise<ScenarioPlanning> {
    const record = this.scenarioPlanningRepository.create(createDto);
    record.status = 'draft';
    return this.scenarioPlanningRepository.save(record);
  }

  async findAll(filters?: {
    companyId?: string;
    disruptionType?: DisruptionType;
    status?: ScenarioStatus;
  }): Promise<ScenarioPlanning[]> {
    const query = this.scenarioPlanningRepository.createQueryBuilder('scenario');

    if (filters?.companyId) {
      query.andWhere('scenario.companyId = :companyId', { companyId: filters.companyId });
    }
    if (filters?.disruptionType) {
      query.andWhere('scenario.disruptionType = :disruptionType', { disruptionType: filters.disruptionType });
    }
    if (filters?.status) {
      query.andWhere('scenario.status = :status', { status: filters.status });
    }

    query.orderBy('scenario.createdAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<ScenarioPlanning> {
    const record = await this.scenarioPlanningRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Scenario Planning with ID ${id} not found`);
    }
    return record;
  }

  async update(id: string, updateDto: Partial<ScenarioPlanning>): Promise<ScenarioPlanning> {
    const record = await this.findOne(id);
    if (record.status === 'approved') {
      throw new BadRequestException('Cannot modify approved scenarios');
    }
    Object.assign(record, updateDto);
    return this.scenarioPlanningRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    if (record.status === 'approved') {
      throw new BadRequestException('Cannot delete approved scenarios');
    }
    await this.scenarioPlanningRepository.remove(record);
  }

  async analyze(id: string): Promise<ScenarioPlanning> {
    const record = await this.findOne(id);
    record.status = 'analyzed';
    return this.scenarioPlanningRepository.save(record);
  }

  async approve(id: string, approvedBy: string): Promise<ScenarioPlanning> {
    const record = await this.findOne(id);
    if (record.status !== 'analyzed') {
      throw new BadRequestException('Scenario must be analyzed before approval');
    }
    record.status = 'approved';
    record.approvedBy = approvedBy;
    record.approvedAt = new Date();
    return this.scenarioPlanningRepository.save(record);
  }

  async archive(id: string): Promise<ScenarioPlanning> {
    const record = await this.findOne(id);
    record.status = 'archived';
    return this.scenarioPlanningRepository.save(record);
  }

  async addMitigationStrategy(id: string, strategy: any): Promise<ScenarioPlanning> {
    const record = await this.findOne(id);
    if (!record.mitigationStrategies) {
      record.mitigationStrategies = [];
    }
    record.mitigationStrategies.push(strategy);
    return this.scenarioPlanningRepository.save(record);
  }

  async runImpactAnalysis(id: string, parameters: any[]): Promise<any> {
    const record = await this.findOne(id);

    // Mock impact analysis calculation
    const impactResults = parameters.map(p => ({
      area: p.name,
      metric: p.name,
      baselineValue: p.baseValue,
      projectedValue: p.scenarioValue,
      variance: ((p.scenarioValue - p.baseValue) / p.baseValue) * 100,
      financialImpact: Math.abs(p.scenarioValue - p.baseValue) * 1000,
    }));

    record.impactAnalysis = impactResults;
    record.estimatedFinancialImpact = impactResults.reduce((sum, r) => sum + r.financialImpact, 0);
    await this.scenarioPlanningRepository.save(record);

    return {
      scenarioId: id,
      scenarioName: record.scenarioName,
      impactResults,
      totalFinancialImpact: record.estimatedFinancialImpact,
    };
  }

  async getScenarioSummary(companyId: string): Promise<any> {
    const scenarios = await this.findAll({ companyId });

    const byStatus: Record<ScenarioStatus, number> = {
      draft: 0, analyzed: 0, approved: 0, archived: 0,
    };
    const byType: Record<string, number> = {};

    scenarios.forEach(s => {
      byStatus[s.status]++;
      byType[s.disruptionType] = (byType[s.disruptionType] || 0) + 1;
    });

    const totalMitigations = scenarios.reduce((sum, s) =>
      sum + (s.mitigationStrategies?.length || 0), 0
    );

    return {
      totalScenarios: scenarios.length,
      byStatus,
      byType,
      totalMitigations,
      avgRecoveryDays: scenarios.filter(s => s.estimatedRecoveryDays).length > 0
        ? scenarios.reduce((sum, s) => sum + (s.estimatedRecoveryDays || 0), 0) / scenarios.filter(s => s.estimatedRecoveryDays).length
        : 0,
    };
  }
}
