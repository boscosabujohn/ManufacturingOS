import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DigitalTwinService } from '../services/digital-twin.service';
import { DigitalTwin } from '../entities/digital-twin.entity';

@ApiTags('Production - Industry 4.0')
@Controller('production/digital-twins')
export class DigitalTwinController {
  constructor(private readonly digitalTwinService: DigitalTwinService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new digital twin' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<DigitalTwin>): Promise<DigitalTwin> {
    return this.digitalTwinService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all digital twins' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'entityType', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('entityType') entityType?: string,
  ): Promise<DigitalTwin[]> {
    return this.digitalTwinService.findAll({ status, entityType });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get digital twin by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<DigitalTwin> {
    return this.digitalTwinService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update digital twin' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<DigitalTwin>): Promise<DigitalTwin> {
    return this.digitalTwinService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete digital twin' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.digitalTwinService.remove(id);
  }

  @Post(':id/sync')
  @ApiOperation({ summary: 'Sync with physical asset' })
  @ApiParam({ name: 'id' })
  async syncWithPhysical(@Param('id') id: string): Promise<DigitalTwin> {
    return this.digitalTwinService.syncWithPhysical(id);
  }

  @Get(':id/real-time-state')
  @ApiOperation({ summary: 'Get real-time state' })
  @ApiParam({ name: 'id' })
  async getRealTimeState(@Param('id') id: string): Promise<any> {
    return this.digitalTwinService.getRealTimeState(id);
  }

  @Post(':id/simulate')
  @ApiOperation({ summary: 'Run simulation' })
  @ApiParam({ name: 'id' })
  async runSimulation(@Param('id') id: string, @Body() parameters: any): Promise<any> {
    return this.digitalTwinService.runSimulation(id, parameters);
  }
}
