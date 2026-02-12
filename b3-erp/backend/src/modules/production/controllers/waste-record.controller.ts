import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { WasteRecordService } from '../services/waste-record.service';
import { WasteRecord, WasteType, DisposalMethod } from '../entities/waste-record.entity';

@ApiTags('Production - Sustainability - Waste Records')
@Controller('production/sustainability/waste-records')
export class WasteRecordController {
  constructor(private readonly wasteRecordService: WasteRecordService) {}

  @Post()
  @ApiOperation({ summary: 'Create waste record' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<WasteRecord>): Promise<WasteRecord> {
    return this.wasteRecordService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all waste records' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'wasteType', required: false })
  @ApiQuery({ name: 'disposalMethod', required: false })
  async findAll(
    @Query('companyId') companyId?: string,
    @Query('wasteType') wasteType?: WasteType,
    @Query('disposalMethod') disposalMethod?: DisposalMethod,
  ): Promise<WasteRecord[]> {
    return this.wasteRecordService.findAll({ companyId, wasteType, disposalMethod });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get waste summary' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  async getWasteSummary(
    @Query('companyId') companyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.wasteRecordService.getWasteSummary(companyId, new Date(startDate), new Date(endDate));
  }

  @Get('scrap-analysis')
  @ApiOperation({ summary: 'Get scrap analysis' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  async getScrapAnalysis(
    @Query('companyId') companyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.wasteRecordService.getScrapAnalysis(companyId, new Date(startDate), new Date(endDate));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get waste record by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<WasteRecord> {
    return this.wasteRecordService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update waste record' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<WasteRecord>): Promise<WasteRecord> {
    return this.wasteRecordService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete waste record' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.wasteRecordService.remove(id);
  }
}
