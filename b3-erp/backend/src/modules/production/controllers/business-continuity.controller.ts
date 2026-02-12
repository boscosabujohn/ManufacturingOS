import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { BusinessContinuityService } from '../services/business-continuity.service';
import { BusinessContinuity, BCPHealthStatus, ProcessCategory, RecoveryPriority } from '../entities/business-continuity.entity';

@ApiTags('Production - Resilience - Business Continuity')
@Controller('production/resilience/business-continuity')
export class BusinessContinuityController {
  constructor(private readonly businessContinuityService: BusinessContinuityService) {}

  @Post()
  @ApiOperation({ summary: 'Create BCP record' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<BusinessContinuity>): Promise<BusinessContinuity> {
    return this.businessContinuityService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all BCP records' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'currentStatus', required: false })
  @ApiQuery({ name: 'priority', required: false })
  async findAll(
    @Query('companyId') companyId?: string,
    @Query('category') category?: ProcessCategory,
    @Query('currentStatus') currentStatus?: BCPHealthStatus,
    @Query('priority') priority?: RecoveryPriority,
  ): Promise<BusinessContinuity[]> {
    return this.businessContinuityService.findAll({ companyId, category, currentStatus, priority });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get BCP summary' })
  @ApiQuery({ name: 'companyId', required: true })
  async getBCPSummary(@Query('companyId') companyId: string): Promise<any> {
    return this.businessContinuityService.getBCPSummary(companyId);
  }

  @Get('upcoming-drills')
  @ApiOperation({ summary: 'Get upcoming drills' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'daysAhead', required: false })
  async getUpcomingDrills(
    @Query('companyId') companyId: string,
    @Query('daysAhead') daysAhead?: number,
  ): Promise<any[]> {
    return this.businessContinuityService.getUpcomingDrills(companyId, daysAhead);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get BCP by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<BusinessContinuity> {
    return this.businessContinuityService.findOne(id);
  }

  @Get(':id/recovery-plan')
  @ApiOperation({ summary: 'Get recovery plan details' })
  @ApiParam({ name: 'id' })
  async getRecoveryPlan(@Param('id') id: string): Promise<any> {
    return this.businessContinuityService.getRecoveryPlan(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update BCP record' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<BusinessContinuity>): Promise<BusinessContinuity> {
    return this.businessContinuityService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete BCP record' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.businessContinuityService.remove(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update BCP status' })
  @ApiParam({ name: 'id' })
  async updateStatus(@Param('id') id: string, @Body('status') status: BCPHealthStatus): Promise<BusinessContinuity> {
    return this.businessContinuityService.updateStatus(id, status);
  }

  @Post(':id/drill')
  @ApiOperation({ summary: 'Record a drill' })
  @ApiParam({ name: 'id' })
  async recordDrill(@Param('id') id: string, @Body() drill: any): Promise<BusinessContinuity> {
    return this.businessContinuityService.recordDrill(id, drill);
  }

  @Post(':id/incident')
  @ApiOperation({ summary: 'Record an incident' })
  @ApiParam({ name: 'id' })
  async recordIncident(@Param('id') id: string, @Body() incident: any): Promise<BusinessContinuity> {
    return this.businessContinuityService.recordIncident(id, incident);
  }
}
