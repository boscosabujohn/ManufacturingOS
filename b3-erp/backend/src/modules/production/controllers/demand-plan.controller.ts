import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DemandPlanService } from '../services/demand-plan.service';
import { DemandPlan } from '../entities/demand-plan.entity';

@ApiTags('Production - Demand Planning')
@Controller('production/demand-plans')
export class DemandPlanController {
  constructor(private readonly demandPlanService: DemandPlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new demand plan' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<DemandPlan>): Promise<DemandPlan> {
    return this.demandPlanService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all demand plans' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'productId', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('productId') productId?: string,
  ): Promise<DemandPlan[]> {
    return this.demandPlanService.findAll({ status, productId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get demand plan by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<DemandPlan> {
    return this.demandPlanService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update demand plan' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<DemandPlan>): Promise<DemandPlan> {
    return this.demandPlanService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete demand plan' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.demandPlanService.remove(id);
  }

  @Post(':id/run-forecast')
  @ApiOperation({ summary: 'Run demand forecast' })
  @ApiParam({ name: 'id' })
  async runForecast(@Param('id') id: string): Promise<any> {
    return this.demandPlanService.runForecast(id);
  }
}
