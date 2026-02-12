import {
  Controller, Get, Post, Put, Body, Param, Query, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ShortageRecordService } from '../services/shortage-record.service';
import { ShortageRecord } from '../entities/shortage-record.entity';

@ApiTags('Production - Shortage Analysis')
@Controller('production/shortage-records')
export class ShortageRecordController {
  constructor(private readonly shortageRecordService: ShortageRecordService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shortage record' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<ShortageRecord>): Promise<ShortageRecord> {
    return this.shortageRecordService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shortage records' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'itemId', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('severity') severity?: any,
    @Query('itemId') itemId?: string,
  ): Promise<ShortageRecord[]> {
    return this.shortageRecordService.findAll({ status, severity, itemId });
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get shortage analytics' })
  @ApiQuery({ name: 'companyId', required: true })
  async getAnalytics(@Query('companyId') companyId: string): Promise<any> {
    return this.shortageRecordService.getAnalytics(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shortage record by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<ShortageRecord> {
    return this.shortageRecordService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update shortage record' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<ShortageRecord>): Promise<ShortageRecord> {
    return this.shortageRecordService.update(id, updateDto);
  }

  @Post(':id/resolve')
  @ApiOperation({ summary: 'Resolve shortage' })
  @ApiParam({ name: 'id' })
  async resolve(
    @Param('id') id: string,
    @Body('resolution') resolution: string,
    @Body('resolvedBy') resolvedBy: string,
  ): Promise<ShortageRecord> {
    return this.shortageRecordService.resolve(id, resolution, resolvedBy);
  }

  @Post(':id/escalate')
  @ApiOperation({ summary: 'Escalate shortage' })
  @ApiParam({ name: 'id' })
  async escalate(@Param('id') id: string, @Body('escalateTo') escalateTo: string): Promise<ShortageRecord> {
    return this.shortageRecordService.escalate(id, escalateTo);
  }
}
