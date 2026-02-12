import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamActivity, ActivityType, UserStatus, ResourceActivityType } from '../entities/team-activity.entity';

@Injectable()
export class TeamActivityService {
  constructor(
    @InjectRepository(TeamActivity)
    private readonly teamActivityRepository: Repository<TeamActivity>,
  ) {}

  async create(createDto: Partial<TeamActivity>): Promise<TeamActivity> {
    const record = this.teamActivityRepository.create(createDto);
    return this.teamActivityRepository.save(record);
  }

  async findAll(filters?: {
    companyId?: string;
    userId?: string;
    activityType?: ActivityType;
    resourceType?: ResourceActivityType;
    teamId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<TeamActivity[]> {
    const query = this.teamActivityRepository.createQueryBuilder('activity');

    if (filters?.companyId) {
      query.andWhere('activity.companyId = :companyId', { companyId: filters.companyId });
    }
    if (filters?.userId) {
      query.andWhere('activity.userId = :userId', { userId: filters.userId });
    }
    if (filters?.activityType) {
      query.andWhere('activity.activityType = :activityType', { activityType: filters.activityType });
    }
    if (filters?.resourceType) {
      query.andWhere('activity.resourceType = :resourceType', { resourceType: filters.resourceType });
    }
    if (filters?.teamId) {
      query.andWhere('activity.teamId = :teamId', { teamId: filters.teamId });
    }
    if (filters?.startDate && filters?.endDate) {
      query.andWhere('activity.activityAt BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    query.orderBy('activity.activityAt', 'DESC');
    if (filters?.limit) {
      query.take(filters.limit);
    }
    return query.getMany();
  }

  async findOne(id: string): Promise<TeamActivity> {
    const record = await this.teamActivityRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Team Activity with ID ${id} not found`);
    }
    return record;
  }

  async getRecentActivity(companyId: string, limit: number = 20): Promise<TeamActivity[]> {
    return this.findAll({ companyId, limit });
  }

  async getActivityFeed(companyId: string, options?: {
    teamId?: string;
    userId?: string;
    resourceType?: ResourceActivityType;
    limit?: number;
    offset?: number;
  }): Promise<{ activities: TeamActivity[]; total: number }> {
    const query = this.teamActivityRepository.createQueryBuilder('activity')
      .where('activity.companyId = :companyId', { companyId });

    if (options?.teamId) {
      query.andWhere('activity.teamId = :teamId', { teamId: options.teamId });
    }
    if (options?.userId) {
      query.andWhere('activity.userId = :userId', { userId: options.userId });
    }
    if (options?.resourceType) {
      query.andWhere('activity.resourceType = :resourceType', { resourceType: options.resourceType });
    }

    query.orderBy('activity.activityAt', 'DESC');

    const total = await query.getCount();
    if (options?.offset) {
      query.skip(options.offset);
    }
    query.take(options?.limit || 20);

    const activities = await query.getMany();
    return { activities, total };
  }

  async getActiveUsers(companyId: string): Promise<any[]> {
    const recentActivities = await this.teamActivityRepository
      .createQueryBuilder('activity')
      .where('activity.companyId = :companyId', { companyId })
      .andWhere('activity.activityAt > :cutoff', {
        cutoff: new Date(Date.now() - 15 * 60 * 1000), // Last 15 minutes
      })
      .select('DISTINCT activity.userId, activity.userName, activity.userAvatar, activity.userStatus')
      .getRawMany();

    return recentActivities.map(a => ({
      userId: a.activity_userId,
      userName: a.activity_userName,
      userAvatar: a.activity_userAvatar,
      status: a.activity_userStatus || 'online',
    }));
  }

  async getActivitySummary(companyId: string, startDate: Date, endDate: Date): Promise<any> {
    const activities = await this.findAll({ companyId, startDate, endDate });

    const byType: Record<string, number> = {};
    const byUser: Record<string, number> = {};
    const byResource: Record<string, number> = {};

    activities.forEach(a => {
      byType[a.activityType] = (byType[a.activityType] || 0) + 1;
      byUser[a.userName] = (byUser[a.userName] || 0) + 1;
      if (a.resourceType) {
        byResource[a.resourceType] = (byResource[a.resourceType] || 0) + 1;
      }
    });

    const topUsers = Object.entries(byUser)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return {
      period: { startDate, endDate },
      totalActivities: activities.length,
      byType,
      byResource,
      topUsers,
      importantActivities: activities.filter(a => a.isImportant).length,
    };
  }

  async logActivity(data: {
    companyId: string;
    userId: string;
    userName: string;
    activityType: ActivityType;
    description: string;
    resourceType?: ResourceActivityType;
    resourceId?: string;
    resourceName?: string;
    metadata?: any;
  }): Promise<TeamActivity> {
    return this.create({
      ...data,
      activityDescription: data.description,
      activityAt: new Date(),
    });
  }
}
