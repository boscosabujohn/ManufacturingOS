import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CapacityFlexibilityService } from '../services/capacity-flexibility.service';
import { CapacityFlexibility, CapacityStatus, CapacityResourceType } from '../entities/capacity-flexibility.entity';

@ApiTags('Production - Resilience - Capacity Flexibility')
@Controller('production/resilience/capacity-flexibility')
export class CapacityFlexibilityController {
  constructor(private readonly capacityFlexibilityService: CapacityFlexibilityService) {}

  @Post()
  @ApiOperation({ summary: 'Create capacity flexibility record' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<CapacityFlexibility>): Promise<CapacityFlexibility> {
    return this.capacityFlexibilityService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all capacity flexibility records' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'resourceType', required: false })
  @ApiQuery({ name: 'status', required: false })
  async findAll(
    @Query('companyId') companyId?: string,
    @Query('resourceType') resourceType?: CapacityResourceType,
    @Query('status') status?: CapacityStatus,
  ): Promise<CapacityFlexibility[]> {
    return this.capacityFlexibilityService.findAll({ companyId, resourceType, status });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get capacity summary' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'recordDate', required: false })
  async getCapacitySummary(
    @Query('companyId') companyId: string,
    @Query('recordDate') recordDate?: string,
  ): Promise<any> {
    return this.capacityFlexibilityService.getCapacitySummary(
      companyId,
      recordDate ? new Date(recordDate) : undefined,
    );
  }

  @Get('bottlenecks')
  @ApiOperation({ summary: 'Identify bottlenecks' })
  @ApiQuery({ name: 'companyId', required: true })
  async identifyBottlenecks(@Query('companyId') companyId: string): Promise<any[]> {
    return this.capacityFlexibilityService.identifyBottlenecks(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get capacity flexibility by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<CapacityFlexibility> {
    return this.capacityFlexibilityService.findOne(id);
  }

  @Get(':id/flexibility-options')
  @ApiOperation({ summary: 'Get flexibility options for a resource' })
  @ApiParam({ name: 'id' })
  async getFlexibilityOptions(@Param('id') id: string): Promise<any> {
    return this.capacityFlexibilityService.getFlexibilityOptions(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update capacity flexibility record' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<CapacityFlexibility>): Promise<CapacityFlexibility> {
    return this.capacityFlexibilityService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete capacity flexibility record' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.capacityFlexibilityService.remove(id);
  }
}
