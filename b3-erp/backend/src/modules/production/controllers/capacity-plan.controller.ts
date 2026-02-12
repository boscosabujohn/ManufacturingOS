import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CapacityPlanService } from '../services/capacity-plan.service';
import { CapacityPlan } from '../entities/capacity-plan.entity';

@ApiTags('Production - Capacity Planning')
@Controller('production/capacity-plans')
export class CapacityPlanController {
  constructor(private readonly capacityPlanService: CapacityPlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new capacity plan' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<CapacityPlan>): Promise<CapacityPlan> {
    return this.capacityPlanService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all capacity plans' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'workCenterId', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('workCenterId') workCenterId?: string,
  ): Promise<CapacityPlan[]> {
    return this.capacityPlanService.findAll({ status, workCenterId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get capacity plan by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<CapacityPlan> {
    return this.capacityPlanService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update capacity plan' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<CapacityPlan>): Promise<CapacityPlan> {
    return this.capacityPlanService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete capacity plan' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.capacityPlanService.remove(id);
  }

  @Get(':id/utilization')
  @ApiOperation({ summary: 'Calculate capacity utilization' })
  @ApiParam({ name: 'id' })
  async calculateUtilization(@Param('id') id: string): Promise<any> {
    return this.capacityPlanService.calculateUtilization(id);
  }
}
