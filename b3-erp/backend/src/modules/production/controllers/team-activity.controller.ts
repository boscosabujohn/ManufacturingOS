import {
  Controller, Get, Post, Body, Param, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TeamActivityService } from '../services/team-activity.service';
import { TeamActivity, ActivityType, ResourceActivityType } from '../entities/team-activity.entity';

@ApiTags('Production - Collaboration - Team Activity')
@Controller('production/collaboration/team-activities')
export class TeamActivityController {
  constructor(private readonly teamActivityService: TeamActivityService) {}

  @Post()
  @ApiOperation({ summary: 'Log team activity' })
  async logActivity(@Body() data: {
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
    return this.teamActivityService.logActivity(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all team activities' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'activityType', required: false })
  @ApiQuery({ name: 'resourceType', required: false })
  @ApiQuery({ name: 'teamId', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('companyId') companyId?: string,
    @Query('userId') userId?: string,
    @Query('activityType') activityType?: ActivityType,
    @Query('resourceType') resourceType?: ResourceActivityType,
    @Query('teamId') teamId?: string,
    @Query('limit') limit?: number,
  ): Promise<TeamActivity[]> {
    return this.teamActivityService.findAll({ companyId, userId, activityType, resourceType, teamId, limit });
  }

  @Get('feed')
  @ApiOperation({ summary: 'Get activity feed' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'teamId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'resourceType', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async getActivityFeed(
    @Query('companyId') companyId: string,
    @Query('teamId') teamId?: string,
    @Query('userId') userId?: string,
    @Query('resourceType') resourceType?: ResourceActivityType,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<{ activities: TeamActivity[]; total: number }> {
    return this.teamActivityService.getActivityFeed(companyId, { teamId, userId, resourceType, limit, offset });
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent activity' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'limit', required: false })
  async getRecentActivity(
    @Query('companyId') companyId: string,
    @Query('limit') limit?: number,
  ): Promise<TeamActivity[]> {
    return this.teamActivityService.getRecentActivity(companyId, limit);
  }

  @Get('active-users')
  @ApiOperation({ summary: 'Get active users' })
  @ApiQuery({ name: 'companyId', required: true })
  async getActiveUsers(@Query('companyId') companyId: string): Promise<any[]> {
    return this.teamActivityService.getActiveUsers(companyId);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get activity summary' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  async getActivitySummary(
    @Query('companyId') companyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.teamActivityService.getActivitySummary(companyId, new Date(startDate), new Date(endDate));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team activity by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<TeamActivity> {
    return this.teamActivityService.findOne(id);
  }
}
