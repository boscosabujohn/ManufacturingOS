import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductivityMetricService } from '../services/productivity-metric.service';
import { ProductivityMetric } from '../entities/productivity-metric.entity';

@ApiTags('Production - Productivity Metrics')
@Controller('production/productivity-metrics')
export class ProductivityMetricController {
  constructor(private readonly productivityMetricService: ProductivityMetricService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new productivity metric' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<ProductivityMetric>): Promise<ProductivityMetric> {
    return this.productivityMetricService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all productivity metrics' })
  @ApiQuery({ name: 'metricType', required: false })
  @ApiQuery({ name: 'workCenterId', required: false })
  async findAll(
    @Query('metricType') metricType?: any,
    @Query('workCenterId') workCenterId?: string,
  ): Promise<ProductivityMetric[]> {
    return this.productivityMetricService.findAll({ metricType, workCenterId });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get productivity summary by type' })
  @ApiQuery({ name: 'companyId', required: true })
  async getSummaryByType(@Query('companyId') companyId: string): Promise<any> {
    return this.productivityMetricService.getSummaryByType(companyId);
  }

  @Get('trend/:workCenterId')
  @ApiOperation({ summary: 'Get productivity trend' })
  @ApiParam({ name: 'workCenterId' })
  @ApiQuery({ name: 'metricType', required: true })
  @ApiQuery({ name: 'days', required: false })
  async getTrend(
    @Param('workCenterId') workCenterId: string,
    @Query('metricType') metricType: any,
    @Query('days') days?: number,
  ): Promise<any> {
    return this.productivityMetricService.getProductivityTrend(workCenterId, metricType, days);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get productivity metric by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<ProductivityMetric> {
    return this.productivityMetricService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update productivity metric' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<ProductivityMetric>): Promise<ProductivityMetric> {
    return this.productivityMetricService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete productivity metric' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.productivityMetricService.remove(id);
  }
}
