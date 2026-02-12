import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GreenSupplier, SupplierTier, AssessmentStatus } from '../entities/green-supplier.entity';

@Injectable()
export class GreenSupplierService {
  constructor(
    @InjectRepository(GreenSupplier)
    private readonly greenSupplierRepository: Repository<GreenSupplier>,
  ) {}

  async create(createDto: Partial<GreenSupplier>): Promise<GreenSupplier> {
    const record = this.greenSupplierRepository.create(createDto);
    return this.greenSupplierRepository.save(record);
  }

  async findAll(filters?: {
    companyId?: string;
    tier?: SupplierTier;
    assessmentStatus?: AssessmentStatus;
    isPreferred?: boolean;
    isActive?: boolean;
  }): Promise<GreenSupplier[]> {
    const query = this.greenSupplierRepository.createQueryBuilder('supplier');

    if (filters?.companyId) {
      query.andWhere('supplier.companyId = :companyId', { companyId: filters.companyId });
    }
    if (filters?.tier) {
      query.andWhere('supplier.tier = :tier', { tier: filters.tier });
    }
    if (filters?.assessmentStatus) {
      query.andWhere('supplier.assessmentStatus = :assessmentStatus', { assessmentStatus: filters.assessmentStatus });
    }
    if (filters?.isPreferred !== undefined) {
      query.andWhere('supplier.isPreferred = :isPreferred', { isPreferred: filters.isPreferred });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('supplier.isActive = :isActive', { isActive: filters.isActive });
    }

    query.orderBy('supplier.sustainabilityScore', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<GreenSupplier> {
    const record = await this.greenSupplierRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Green Supplier with ID ${id} not found`);
    }
    return record;
  }

  async findByVendorId(vendorId: string): Promise<GreenSupplier | null> {
    return this.greenSupplierRepository.findOne({ where: { vendorId } });
  }

  async update(id: string, updateDto: Partial<GreenSupplier>): Promise<GreenSupplier> {
    const record = await this.findOne(id);
    Object.assign(record, updateDto);
    return this.greenSupplierRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.greenSupplierRepository.remove(record);
  }

  async addAssessment(id: string, assessment: any): Promise<GreenSupplier> {
    const record = await this.findOne(id);
    if (!record.assessmentHistory) {
      record.assessmentHistory = [];
    }
    record.assessmentHistory.push(assessment);
    record.lastAssessmentDate = assessment.assessmentDate;
    record.assessmentStatus = 'completed';
    record.sustainabilityScore = assessment.score;
    record.tier = this.calculateTier(assessment.score);
    return this.greenSupplierRepository.save(record);
  }

  private calculateTier(score: number): SupplierTier {
    if (score >= 90) return 'platinum';
    if (score >= 80) return 'gold';
    if (score >= 70) return 'silver';
    if (score >= 60) return 'bronze';
    return 'standard';
  }

  async getSupplierSummary(companyId: string): Promise<any> {
    const suppliers = await this.findAll({ companyId, isActive: true });

    const byTier: Record<SupplierTier, number> = {
      platinum: 0, gold: 0, silver: 0, bronze: 0, standard: 0,
    };

    suppliers.forEach(s => {
      byTier[s.tier]++;
    });

    const avgScore = suppliers.length > 0
      ? suppliers.reduce((sum, s) => sum + Number(s.sustainabilityScore), 0) / suppliers.length
      : 0;

    const certificationCounts: Record<string, number> = {};
    suppliers.forEach(s => {
      (s.certifications || []).forEach(c => {
        certificationCounts[c.type] = (certificationCounts[c.type] || 0) + 1;
      });
    });

    return {
      totalSuppliers: suppliers.length,
      preferredSuppliers: suppliers.filter(s => s.isPreferred).length,
      averageScore: avgScore,
      byTier,
      certificationCounts,
      pendingAssessments: suppliers.filter(s => s.assessmentStatus === 'pending').length,
    };
  }

  async getExpiringCertifications(companyId: string, daysAhead: number = 90): Promise<any[]> {
    const suppliers = await this.findAll({ companyId, isActive: true });
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

    const expiring: any[] = [];
    suppliers.forEach(s => {
      (s.certifications || []).forEach(c => {
        if (new Date(c.expiryDate) <= cutoffDate) {
          expiring.push({
            supplierId: s.id,
            supplierName: s.vendorName,
            certification: c.name,
            expiryDate: c.expiryDate,
          });
        }
      });
    });

    return expiring.sort((a, b) =>
      new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
    );
  }
}
