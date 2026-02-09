import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { SalesTerritory } from './entities/sales-territory.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

export interface LeadFilterDto {
  search?: string;
  status?: string;
  rating?: string;
  assignedTo?: string;
  leadSource?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(SalesTerritory)
    private readonly territoryRepository: Repository<SalesTerritory>,
  ) { }

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    const lead = this.leadRepository.create(createLeadDto);

    // Calculate lead score if not provided
    if (!lead.leadScore) {
      lead.leadScore = this.calculateLeadScore(lead);
    }

    // Auto-assign lead based on region
    await this.autoAssignLead(lead);

    return await this.leadRepository.save(lead);
  }

  async findAll(filters?: LeadFilterDto): Promise<{ data: Lead[]; total: number; page: number; limit: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.leadRepository.createQueryBuilder('lead');

    // Apply search filter
    if (filters?.search) {
      queryBuilder.andWhere(
        '(lead.firstName LIKE :search OR lead.lastName LIKE :search OR lead.company LIKE :search OR lead.email LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // Apply status filter
    if (filters?.status) {
      queryBuilder.andWhere('lead.status = :status', { status: filters.status });
    }

    // Apply rating filter
    if (filters?.rating) {
      queryBuilder.andWhere('lead.rating = :rating', { rating: filters.rating });
    }

    // Apply assignedTo filter
    if (filters?.assignedTo) {
      queryBuilder.andWhere('lead.assignedTo = :assignedTo', { assignedTo: filters.assignedTo });
    }

    // Apply leadSource filter
    if (filters?.leadSource) {
      queryBuilder.andWhere('lead.leadSource = :leadSource', { leadSource: filters.leadSource });
    }

    // Apply tags filter
    if (filters?.tags && filters.tags.length > 0) {
      queryBuilder.andWhere('lead.tags && :tags', { tags: filters.tags });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination
    queryBuilder.skip(skip).take(limit);

    // Order by creation date
    queryBuilder.orderBy('lead.createdAt', 'DESC');

    const data = await queryBuilder.getMany();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadRepository.findOne({ where: { id } });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findOne(id);

    const { estimatedCloseDate, ...rest } = updateLeadDto;
    Object.assign(lead, rest);

    if (estimatedCloseDate) {
      lead.estimatedCloseDate = new Date(estimatedCloseDate);
    }

    // Recalculate lead score if relevant fields changed
    if (this.shouldRecalculateScore(updateLeadDto)) {
      lead.leadScore = this.calculateLeadScore(lead);
    }

    return await this.leadRepository.save(lead);
  }

  async remove(id: string): Promise<void> {
    const lead = await this.findOne(id);
    await this.leadRepository.remove(lead);
  }

  async getStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byRating: Record<string, number>;
    totalValue: number;
  }> {
    const leads = await this.leadRepository.find();

    const stats = {
      total: leads.length,
      byStatus: {} as Record<string, number>,
      byRating: {} as Record<string, number>,
      totalValue: 0,
    };

    leads.forEach(lead => {
      // Count by status
      stats.byStatus[lead.status] = (stats.byStatus[lead.status] || 0) + 1;

      // Count by rating
      stats.byRating[lead.rating] = (stats.byRating[lead.rating] || 0) + 1;

      // Sum total value
      if (lead.estimatedValue) {
        stats.totalValue += Number(lead.estimatedValue);
      }
    });

    return stats;
  }

  async convertToCustomer(id: string): Promise<Lead> {
    const lead = await this.findOne(id);
    lead.status = 'won' as any;
    return await this.leadRepository.save(lead);
  }

  async updateLastContactDate(id: string): Promise<Lead> {
    const lead = await this.findOne(id);
    lead.lastContactDate = new Date();
    return await this.leadRepository.save(lead);
  }

  async getLeadSourceAnalytics(): Promise<any[]> {
    const analytics = await this.leadRepository
      .createQueryBuilder('lead')
      .select('lead.leadSource', 'name')
      .addSelect('COUNT(lead.id)', 'totalLeads')
      .addSelect('COUNT(CASE WHEN lead.status = \'qualified\' THEN 1 END)', 'qualifiedLeads')
      .addSelect('COUNT(CASE WHEN lead.status = \'won\' THEN 1 END)', 'wonLeads')
      .addSelect('SUM(lead.estimatedValue)', 'totalValue')
      .groupBy('lead.leadSource')
      .getRawMany();

    return analytics.map(item => ({
      ...item,
      totalLeads: parseInt(item.totalLeads, 10),
      qualifiedLeads: parseInt(item.qualifiedLeads, 10),
      wonLeads: parseInt(item.wonLeads, 10),
      conversionRate: item.totalLeads > 0 ? (parseInt(item.wonLeads, 10) / parseInt(item.totalLeads, 10)) * 100 : 0,
      totalValue: parseFloat(item.totalValue || '0'),
    }));
  }

  async getLeadConversionStats(): Promise<any> {
    const stats = await this.leadRepository
      .createQueryBuilder('lead')
      .select('lead.status', 'status')
      .addSelect('COUNT(lead.id)', 'count')
      .groupBy('lead.status')
      .getRawMany();

    const total = stats.reduce((sum, s) => sum + parseInt(s.count, 10), 0);
    const won = stats.find(s => s.status === 'won')?.count || 0;

    return {
      byStatus: stats.map(s => ({
        status: s.status,
        count: parseInt(s.count, 10),
        percentage: total > 0 ? (parseInt(s.count, 10) / total) * 100 : 0,
      })),
      overallConversionRate: total > 0 ? (parseInt(won, 10) / total) * 100 : 0,
      totalLeads: total,
    };
  }

  async autoAssignLead(lead: Lead): Promise<void> {
    if (lead.assignedTo) return; // Don't override if already assigned

    const territories = await this.territoryRepository.find({
      where: { isActive: true },
      order: { priority: 'DESC' },
    });

    for (const territory of territories) {
      let match = true;

      if (territory.country && lead.country !== territory.country) match = false;
      if (match && territory.state && lead.state !== territory.state) match = false;
      if (match && territory.city && lead.city !== territory.city) match = false;

      if (match) {
        lead.assignedTo = territory.assignedUserId;
        lead.teamAssignment = territory.assignedTeamId;
        break;
      }
    }
  }

  private calculateLeadScore(lead: Partial<Lead>): number {
    let score = 0;

    // Company size scoring
    if (lead.employeeCount === '1000+') score += 20;
    else if (lead.employeeCount === '500-999') score += 15;
    else if (lead.employeeCount === '100-499') score += 10;
    else if (lead.employeeCount === '50-99') score += 5;

    // Revenue scoring
    if (lead.annualRevenue === '$100M+') score += 20;
    else if (lead.annualRevenue === '$50M-$100M') score += 15;
    else if (lead.annualRevenue === '$10M-$50M') score += 10;
    else if (lead.annualRevenue === '$1M-$10M') score += 5;

    // Engagement scoring
    if (lead.email) score += 10;
    if (lead.phone) score += 10;
    if (lead.website) score += 5;

    // Interest level
    if (lead.rating === 'hot') score += 20;
    else if (lead.rating === 'warm') score += 10;

    // Product interest
    if (lead.productInterest) {
      score += lead.productInterest.length * 5;
    }

    // Source quality
    if (lead.leadSource === 'Referral') score += 15;
    else if (lead.leadSource === 'Events') score += 10;

    return Math.min(score, 100);
  }

  private shouldRecalculateScore(updateDto: UpdateLeadDto): boolean {
    return !!(
      updateDto.employeeCount ||
      updateDto.annualRevenue ||
      updateDto.email ||
      updateDto.phone ||
      updateDto.website ||
      updateDto.rating ||
      updateDto.productInterest ||
      updateDto.leadSource
    );
  }
}
