import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductionScheduleService } from '../services/production-schedule.service';
import { ProductionSchedule } from '../entities/production-schedule.entity';

@ApiTags('Production - Scheduling')
@Controller('production/production-schedules')
export class ProductionScheduleController {
  constructor(private readonly productionScheduleService: ProductionScheduleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new production schedule' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<ProductionSchedule>): Promise<ProductionSchedule> {
    return this.productionScheduleService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all production schedules' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'productionLineId', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('productionLineId') productionLineId?: string,
  ): Promise<ProductionSchedule[]> {
    return this.productionScheduleService.findAll({ status, productionLineId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get production schedule by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<ProductionSchedule> {
    return this.productionScheduleService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update production schedule' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<ProductionSchedule>): Promise<ProductionSchedule> {
    return this.productionScheduleService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete production schedule' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.productionScheduleService.remove(id);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish production schedule' })
  @ApiParam({ name: 'id' })
  async publish(@Param('id') id: string): Promise<ProductionSchedule> {
    return this.productionScheduleService.publish(id);
  }

  @Post(':id/optimize')
  @ApiOperation({ summary: 'Optimize production schedule' })
  @ApiParam({ name: 'id' })
  async optimize(@Param('id') id: string): Promise<ProductionSchedule> {
    return this.productionScheduleService.optimize(id);
  }

  @Get(':id/gantt')
  @ApiOperation({ summary: 'Get Gantt chart data' })
  @ApiParam({ name: 'id' })
  async getGanttData(@Param('id') id: string): Promise<any> {
    return this.productionScheduleService.getGanttData(id);
  }
}
