import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Lead } from './entities/lead.entity';
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
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    const lead = this.leadRepository.create(createLeadDto);

    // Calculate lead score if not provided
    if (!lead.leadScore) {
      lead.leadScore = this.calculateLeadScore(lead);
    }

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

    Object.assign(lead, updateLeadDto);

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
      byStatus: {},
      byRating: {},
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
