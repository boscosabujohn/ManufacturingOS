import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplyChainRisk, RiskLevel, RiskCategory } from '../entities/supply-chain-risk.entity';

@Injectable()
export class SupplyChainRiskService {
  constructor(
    @InjectRepository(SupplyChainRisk)
    private readonly supplyChainRiskRepository: Repository<SupplyChainRisk>,
  ) {}

  async create(createDto: Partial<SupplyChainRisk>): Promise<SupplyChainRisk> {
    const record = this.supplyChainRiskRepository.create(createDto);
    record.overallRiskScore = (Number(createDto.probabilityScore) + Number(createDto.impactScore)) / 2;
    record.riskLevel = this.calculateRiskLevel(record.overallRiskScore);
    return this.supplyChainRiskRepository.save(record);
  }

  private calculateRiskLevel(score: number): RiskLevel {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  async findAll(filters?: {
    companyId?: string;
    riskLevel?: RiskLevel;
    category?: RiskCategory;
    status?: string;
    isActive?: boolean;
  }): Promise<SupplyChainRisk[]> {
    const query = this.supplyChainRiskRepository.createQueryBuilder('risk');

    if (filters?.companyId) {
      query.andWhere('risk.companyId = :companyId', { companyId: filters.companyId });
    }
    if (filters?.riskLevel) {
      query.andWhere('risk.riskLevel = :riskLevel', { riskLevel: filters.riskLevel });
    }
    if (filters?.category) {
      query.andWhere('risk.category = :category', { category: filters.category });
    }
    if (filters?.status) {
      query.andWhere('risk.status = :status', { status: filters.status });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('risk.isActive = :isActive', { isActive: filters.isActive });
    }

    query.orderBy('risk.overallRiskScore', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<SupplyChainRisk> {
    const record = await this.supplyChainRiskRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Supply Chain Risk with ID ${id} not found`);
    }
    return record;
  }

  async update(id: string, updateDto: Partial<SupplyChainRisk>): Promise<SupplyChainRisk> {
    const record = await this.findOne(id);
    Object.assign(record, updateDto);
    if (updateDto.probabilityScore || updateDto.impactScore) {
      record.overallRiskScore = (Number(record.probabilityScore) + Number(record.impactScore)) / 2;
      record.riskLevel = this.calculateRiskLevel(record.overallRiskScore);
    }
    return this.supplyChainRiskRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.supplyChainRiskRepository.remove(record);
  }

  async addMitigationAction(id: string, action: any): Promise<SupplyChainRisk> {
    const record = await this.findOne(id);
    if (!record.mitigationActions) {
      record.mitigationActions = [];
    }
    record.mitigationActions.push(action);
    return this.supplyChainRiskRepository.save(record);
  }

  async updateMitigationStatus(id: string, actionIndex: number, status: 'pending' | 'in_progress' | 'completed'): Promise<SupplyChainRisk> {
    const record = await this.findOne(id);
    if (record.mitigationActions && record.mitigationActions[actionIndex]) {
      record.mitigationActions[actionIndex].status = status;
    }
    return this.supplyChainRiskRepository.save(record);
  }

  async getRiskSummary(companyId: string): Promise<any> {
    const risks = await this.findAll({ companyId, isActive: true });

    const byLevel: Record<RiskLevel, number> = {
      critical: 0, high: 0, medium: 0, low: 0,
    };
    const byCategory: Record<string, number> = {};

    risks.forEach(r => {
      byLevel[r.riskLevel]++;
      byCategory[r.category] = (byCategory[r.category] || 0) + 1;
    });

    const singleSourceRisks = risks.filter(r => r.sourceType === 'single');
    const avgRiskScore = risks.length > 0
      ? risks.reduce((sum, r) => sum + Number(r.overallRiskScore), 0) / risks.length
      : 0;

    return {
      totalRisks: risks.length,
      byLevel,
      byCategory,
      singleSourceCount: singleSourceRisks.length,
      averageRiskScore: avgRiskScore,
      criticalItems: risks.filter(r => r.riskLevel === 'critical').map(r => ({
        id: r.id,
        name: r.riskName,
        supplier: r.supplierName,
        score: r.overallRiskScore,
      })),
    };
  }

  async getBufferStockAlerts(companyId: string): Promise<any[]> {
    const risks = await this.findAll({ companyId, isActive: true });

    const alerts: any[] = [];
    risks.forEach(r => {
      (r.affectedItems || []).forEach(item => {
        if (item.stockStatus === 'critical' || item.stockStatus === 'low') {
          alerts.push({
            riskId: r.id,
            riskName: r.riskName,
            itemId: item.itemId,
            itemName: item.itemName,
            stockStatus: item.stockStatus,
            daysOfSupply: item.daysOfSupply,
            bufferStock: item.bufferStock,
          });
        }
      });
    });

    return alerts.sort((a, b) => a.daysOfSupply - b.daysOfSupply);
  }
}
