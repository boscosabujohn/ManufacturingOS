import {
  Controller, Get, Post, Param, Query, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SystemHealthCheckService } from '../services/system-health-check.service';
import { SystemHealthCheck } from '../entities/system-health-check.entity';

@ApiTags('Production - Automation')
@Controller('production/system-health-checks')
export class SystemHealthCheckController {
  constructor(private readonly systemHealthCheckService: SystemHealthCheckService) {}

  @Get()
  @ApiOperation({ summary: 'Get all system health checks' })
  @ApiQuery({ name: 'overallStatus', required: false })
  async findAll(@Query('overallStatus') overallStatus?: any): Promise<SystemHealthCheck[]> {
    return this.systemHealthCheckService.findAll({ overallStatus });
  }

  @Get('latest')
  @ApiOperation({ summary: 'Get latest health check' })
  @ApiQuery({ name: 'companyId', required: true })
  async getLatest(@Query('companyId') companyId: string): Promise<SystemHealthCheck | null> {
    return this.systemHealthCheckService.getLatest(companyId);
  }

  @Get('trend')
  @ApiOperation({ summary: 'Get health trend' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'days', required: false })
  async getTrend(
    @Query('companyId') companyId: string,
    @Query('days') days?: number,
  ): Promise<any> {
    return this.systemHealthCheckService.getHealthTrend(companyId, days);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get system health check by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<SystemHealthCheck> {
    return this.systemHealthCheckService.findOne(id);
  }

  @Post('run')
  @ApiOperation({ summary: 'Run system health check' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async runHealthCheck(
    @Query('companyId') companyId: string,
    @Query('initiatedBy') initiatedBy: string,
  ): Promise<SystemHealthCheck> {
    return this.systemHealthCheckService.runHealthCheck(companyId, initiatedBy);
  }
}
