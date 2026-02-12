import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AggregatePlanService } from '../services/aggregate-plan.service';
import { AggregatePlan } from '../entities/aggregate-plan.entity';

@ApiTags('Production - Aggregate Planning')
@Controller('production/aggregate-plans')
export class AggregatePlanController {
  constructor(private readonly aggregatePlanService: AggregatePlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new aggregate plan' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<AggregatePlan>): Promise<AggregatePlan> {
    return this.aggregatePlanService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all aggregate plans' })
  @ApiQuery({ name: 'status', required: false })
  async findAll(@Query('status') status?: any): Promise<AggregatePlan[]> {
    return this.aggregatePlanService.findAll({ status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get aggregate plan by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<AggregatePlan> {
    return this.aggregatePlanService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update aggregate plan' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<AggregatePlan>): Promise<AggregatePlan> {
    return this.aggregatePlanService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete aggregate plan' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.aggregatePlanService.remove(id);
  }

  @Post(':id/optimize')
  @ApiOperation({ summary: 'Optimize aggregate plan' })
  @ApiParam({ name: 'id' })
  async optimize(@Param('id') id: string): Promise<any> {
    return this.aggregatePlanService.optimize(id);
  }
}
