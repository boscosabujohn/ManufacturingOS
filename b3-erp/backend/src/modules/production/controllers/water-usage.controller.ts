import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { WaterUsageService } from '../services/water-usage.service';
import { WaterUsage, WaterSource, WaterUseType } from '../entities/water-usage.entity';

@ApiTags('Production - Sustainability - Water Usage')
@Controller('production/sustainability/water-usage')
export class WaterUsageController {
  constructor(private readonly waterUsageService: WaterUsageService) {}

  @Post()
  @ApiOperation({ summary: 'Create water usage record' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<WaterUsage>): Promise<WaterUsage> {
    return this.waterUsageService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all water usage records' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'waterSource', required: false })
  @ApiQuery({ name: 'useType', required: false })
  async findAll(
    @Query('companyId') companyId?: string,
    @Query('waterSource') waterSource?: WaterSource,
    @Query('useType') useType?: WaterUseType,
  ): Promise<WaterUsage[]> {
    return this.waterUsageService.findAll({ companyId, waterSource, useType });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get usage summary' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  async getUsageSummary(
    @Query('companyId') companyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.waterUsageService.getUsageSummary(companyId, new Date(startDate), new Date(endDate));
  }

  @Get('leak-detection')
  @ApiOperation({ summary: 'Get leak detection status' })
  @ApiQuery({ name: 'companyId', required: true })
  async getLeakDetectionStatus(@Query('companyId') companyId: string): Promise<any> {
    return this.waterUsageService.getLeakDetectionStatus(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get water usage by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<WaterUsage> {
    return this.waterUsageService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update water usage record' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<WaterUsage>): Promise<WaterUsage> {
    return this.waterUsageService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete water usage record' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.waterUsageService.remove(id);
  }
}
