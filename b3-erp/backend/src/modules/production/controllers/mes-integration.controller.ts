import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MESIntegrationService } from '../services/mes-integration.service';
import { MESIntegration } from '../entities/mes-integration.entity';

@ApiTags('Production - Automation')
@Controller('production/mes-integrations')
export class MESIntegrationController {
  constructor(private readonly mesIntegrationService: MESIntegrationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new MES integration' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<MESIntegration>): Promise<MESIntegration> {
    return this.mesIntegrationService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all MES integrations' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'integrationType', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('integrationType') integrationType?: any,
  ): Promise<MESIntegration[]> {
    return this.mesIntegrationService.findAll({ status, integrationType });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get MES integration by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<MESIntegration> {
    return this.mesIntegrationService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update MES integration' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<MESIntegration>): Promise<MESIntegration> {
    return this.mesIntegrationService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete MES integration' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.mesIntegrationService.remove(id);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate integration' })
  @ApiParam({ name: 'id' })
  async activate(@Param('id') id: string): Promise<MESIntegration> {
    return this.mesIntegrationService.activate(id);
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate integration' })
  @ApiParam({ name: 'id' })
  async deactivate(@Param('id') id: string): Promise<MESIntegration> {
    return this.mesIntegrationService.deactivate(id);
  }

  @Post(':id/sync')
  @ApiOperation({ summary: 'Trigger sync' })
  @ApiParam({ name: 'id' })
  async sync(@Param('id') id: string): Promise<any> {
    return this.mesIntegrationService.sync(id);
  }

  @Get(':id/test-connection')
  @ApiOperation({ summary: 'Test connection' })
  @ApiParam({ name: 'id' })
  async testConnection(@Param('id') id: string): Promise<any> {
    return this.mesIntegrationService.testConnection(id);
  }

  @Get(':id/health-metrics')
  @ApiOperation({ summary: 'Get health metrics' })
  @ApiParam({ name: 'id' })
  async getHealthMetrics(@Param('id') id: string): Promise<any> {
    return this.mesIntegrationService.getHealthMetrics(id);
  }
}
