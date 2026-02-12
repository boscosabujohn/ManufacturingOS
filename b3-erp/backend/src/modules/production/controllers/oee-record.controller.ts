import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OEERecordService } from '../services/oee-record.service';
import { OEERecord } from '../entities/oee-record.entity';

@ApiTags('Production - OEE Analytics')
@Controller('production/oee-records')
export class OEERecordController {
  constructor(private readonly oeeRecordService: OEERecordService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new OEE record' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<OEERecord>): Promise<OEERecord> {
    return this.oeeRecordService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all OEE records' })
  @ApiQuery({ name: 'equipmentId', required: false })
  @ApiQuery({ name: 'productionLineId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async findAll(
    @Query('equipmentId') equipmentId?: string,
    @Query('productionLineId') productionLineId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<OEERecord[]> {
    return this.oeeRecordService.findAll({
      equipmentId,
      productionLineId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get OEE summary' })
  @ApiQuery({ name: 'companyId', required: true })
  async getSummary(@Query('companyId') companyId: string): Promise<any> {
    return this.oeeRecordService.getOEESummary(companyId);
  }

  @Get('trend/:equipmentId')
  @ApiOperation({ summary: 'Get OEE trend for equipment' })
  @ApiParam({ name: 'equipmentId' })
  @ApiQuery({ name: 'days', required: false })
  async getTrend(@Param('equipmentId') equipmentId: string, @Query('days') days?: number): Promise<any> {
    return this.oeeRecordService.getEquipmentOEETrend(equipmentId, days);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get OEE record by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<OEERecord> {
    return this.oeeRecordService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update OEE record' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<OEERecord>): Promise<OEERecord> {
    return this.oeeRecordService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete OEE record' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.oeeRecordService.remove(id);
  }
}
