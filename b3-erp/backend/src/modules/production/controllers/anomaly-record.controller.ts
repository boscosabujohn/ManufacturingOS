import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AnomalyRecordService } from '../services/anomaly-record.service';
import { AnomalyRecord } from '../entities/anomaly-record.entity';

@ApiTags('Production - Smart AI')
@Controller('production/anomaly-records')
export class AnomalyRecordController {
  constructor(private readonly anomalyRecordService: AnomalyRecordService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new anomaly record' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<AnomalyRecord>): Promise<AnomalyRecord> {
    return this.anomalyRecordService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all anomaly records' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'anomalyType', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('severity') severity?: any,
    @Query('anomalyType') anomalyType?: any,
  ): Promise<AnomalyRecord[]> {
    return this.anomalyRecordService.findAll({ status, severity, anomalyType });
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get anomaly dashboard' })
  @ApiQuery({ name: 'companyId', required: true })
  async getDashboard(@Query('companyId') companyId: string): Promise<any> {
    return this.anomalyRecordService.getAnomalyDashboard(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get anomaly record by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<AnomalyRecord> {
    return this.anomalyRecordService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update anomaly record' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<AnomalyRecord>): Promise<AnomalyRecord> {
    return this.anomalyRecordService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete anomaly record' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.anomalyRecordService.remove(id);
  }

  @Post(':id/investigate')
  @ApiOperation({ summary: 'Start investigation' })
  @ApiParam({ name: 'id' })
  async investigate(
    @Param('id') id: string,
    @Body('investigatedBy') investigatedBy: string,
    @Body('notes') notes: string,
  ): Promise<AnomalyRecord> {
    return this.anomalyRecordService.investigate(id, investigatedBy, notes);
  }

  @Post(':id/resolve')
  @ApiOperation({ summary: 'Resolve anomaly' })
  @ApiParam({ name: 'id' })
  async resolve(
    @Param('id') id: string,
    @Body('rootCause') rootCause: string,
    @Body('resolutionAction') resolutionAction: string,
    @Body('resolvedBy') resolvedBy: string,
  ): Promise<AnomalyRecord> {
    return this.anomalyRecordService.resolve(id, rootCause, resolutionAction, resolvedBy);
  }

  @Post(':id/false-positive')
  @ApiOperation({ summary: 'Mark as false positive' })
  @ApiParam({ name: 'id' })
  async markAsFalsePositive(@Param('id') id: string, @Body('notes') notes: string): Promise<AnomalyRecord> {
    return this.anomalyRecordService.markAsFalsePositive(id, notes);
  }
}
