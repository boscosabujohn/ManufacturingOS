import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EnergyConsumptionService } from '../services/energy-consumption.service';
import { EnergyConsumption, EnergyType } from '../entities/energy-consumption.entity';

@ApiTags('Production - Sustainability - Energy Consumption')
@Controller('production/sustainability/energy-consumption')
export class EnergyConsumptionController {
  constructor(private readonly energyConsumptionService: EnergyConsumptionService) {}

  @Post()
  @ApiOperation({ summary: 'Create energy consumption record' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<EnergyConsumption>): Promise<EnergyConsumption> {
    return this.energyConsumptionService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all energy consumption records' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'energyType', required: false })
  @ApiQuery({ name: 'zoneId', required: false })
  async findAll(
    @Query('companyId') companyId?: string,
    @Query('energyType') energyType?: EnergyType,
    @Query('zoneId') zoneId?: string,
  ): Promise<EnergyConsumption[]> {
    return this.energyConsumptionService.findAll({ companyId, energyType, zoneId });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get consumption summary' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  async getConsumptionSummary(
    @Query('companyId') companyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.energyConsumptionService.getConsumptionSummary(companyId, new Date(startDate), new Date(endDate));
  }

  @Get('by-zone')
  @ApiOperation({ summary: 'Get consumption by zone' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'date', required: true })
  async getByZone(
    @Query('companyId') companyId: string,
    @Query('date') date: string,
  ): Promise<any> {
    return this.energyConsumptionService.getByZone(companyId, new Date(date));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get energy consumption by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<EnergyConsumption> {
    return this.energyConsumptionService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update energy consumption record' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<EnergyConsumption>): Promise<EnergyConsumption> {
    return this.energyConsumptionService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete energy consumption record' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.energyConsumptionService.remove(id);
  }
}
