import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DowntimeRecordService } from '../services/downtime-record.service';
import { DowntimeRecord } from '../entities/downtime-record.entity';

@ApiTags('Production - Downtime Tracking')
@Controller('production/downtime-records')
export class DowntimeRecordController {
  constructor(private readonly downtimeRecordService: DowntimeRecordService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new downtime record' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<DowntimeRecord>): Promise<DowntimeRecord> {
    return this.downtimeRecordService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all downtime records' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'downtimeType', required: false })
  @ApiQuery({ name: 'equipmentId', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('downtimeType') downtimeType?: any,
    @Query('equipmentId') equipmentId?: string,
  ): Promise<DowntimeRecord[]> {
    return this.downtimeRecordService.findAll({ status, downtimeType, equipmentId });
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get downtime analytics' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  async getAnalytics(
    @Query('companyId') companyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.downtimeRecordService.getAnalytics(companyId, new Date(startDate), new Date(endDate));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get downtime record by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<DowntimeRecord> {
    return this.downtimeRecordService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update downtime record' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<DowntimeRecord>): Promise<DowntimeRecord> {
    return this.downtimeRecordService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete downtime record' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.downtimeRecordService.remove(id);
  }

  @Post(':id/end')
  @ApiOperation({ summary: 'End downtime' })
  @ApiParam({ name: 'id' })
  async endDowntime(@Param('id') id: string, @Body('endedBy') endedBy: string): Promise<DowntimeRecord> {
    return this.downtimeRecordService.endDowntime(id, endedBy);
  }
}
