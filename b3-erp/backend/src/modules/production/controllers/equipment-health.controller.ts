import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EquipmentHealthService } from '../services/equipment-health.service';
import { EquipmentHealth } from '../entities/equipment-health.entity';

@ApiTags('Production - Industry 4.0')
@Controller('production/equipment-health')
export class EquipmentHealthController {
  constructor(private readonly equipmentHealthService: EquipmentHealthService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new equipment health record' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<EquipmentHealth>): Promise<EquipmentHealth> {
    return this.equipmentHealthService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all equipment health records' })
  @ApiQuery({ name: 'equipmentId', required: false })
  @ApiQuery({ name: 'healthStatus', required: false })
  async findAll(
    @Query('equipmentId') equipmentId?: string,
    @Query('healthStatus') healthStatus?: any,
  ): Promise<EquipmentHealth[]> {
    return this.equipmentHealthService.findAll({ equipmentId, healthStatus });
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get health dashboard' })
  @ApiQuery({ name: 'companyId', required: true })
  async getDashboard(@Query('companyId') companyId: string): Promise<any> {
    return this.equipmentHealthService.getHealthDashboard(companyId);
  }

  @Get('predictive-alerts')
  @ApiOperation({ summary: 'Get predictive maintenance alerts' })
  @ApiQuery({ name: 'companyId', required: true })
  async getPredictiveAlerts(@Query('companyId') companyId: string): Promise<any[]> {
    return this.equipmentHealthService.getPredictiveMaintenanceAlerts(companyId);
  }

  @Get('latest/:equipmentId')
  @ApiOperation({ summary: 'Get latest health record for equipment' })
  @ApiParam({ name: 'equipmentId' })
  async getLatest(@Param('equipmentId') equipmentId: string): Promise<EquipmentHealth | null> {
    return this.equipmentHealthService.getLatestForEquipment(equipmentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get equipment health record by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<EquipmentHealth> {
    return this.equipmentHealthService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update equipment health record' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<EquipmentHealth>): Promise<EquipmentHealth> {
    return this.equipmentHealthService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete equipment health record' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.equipmentHealthService.remove(id);
  }
}
