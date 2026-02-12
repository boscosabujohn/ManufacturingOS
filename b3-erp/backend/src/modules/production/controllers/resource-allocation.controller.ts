import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ResourceAllocationService } from '../services/resource-allocation.service';
import { ResourceAllocation } from '../entities/resource-allocation.entity';

@ApiTags('Production - Resource Allocation')
@Controller('production/resource-allocations')
export class ResourceAllocationController {
  constructor(private readonly resourceAllocationService: ResourceAllocationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new resource allocation' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<ResourceAllocation>): Promise<ResourceAllocation> {
    return this.resourceAllocationService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all resource allocations' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'resourceType', required: false })
  @ApiQuery({ name: 'resourceId', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('resourceType') resourceType?: any,
    @Query('resourceId') resourceId?: string,
  ): Promise<ResourceAllocation[]> {
    return this.resourceAllocationService.findAll({ status, resourceType, resourceId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resource allocation by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<ResourceAllocation> {
    return this.resourceAllocationService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update resource allocation' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<ResourceAllocation>): Promise<ResourceAllocation> {
    return this.resourceAllocationService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete resource allocation' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.resourceAllocationService.remove(id);
  }

  @Get('conflicts/:resourceId')
  @ApiOperation({ summary: 'Check for allocation conflicts' })
  @ApiParam({ name: 'resourceId' })
  @ApiQuery({ name: 'startTime', required: true })
  @ApiQuery({ name: 'endTime', required: true })
  async checkConflicts(
    @Param('resourceId') resourceId: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ): Promise<any[]> {
    return this.resourceAllocationService.checkConflicts(resourceId, new Date(startTime), new Date(endTime));
  }

  @Get('utilization/:resourceId')
  @ApiOperation({ summary: 'Get resource utilization' })
  @ApiParam({ name: 'resourceId' })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  async getUtilization(
    @Param('resourceId') resourceId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.resourceAllocationService.getUtilization(resourceId, new Date(startDate), new Date(endDate));
  }
}
