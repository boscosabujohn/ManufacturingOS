import {
  Controller, Get, Post, Body, Param, Query, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MRPRunService } from '../services/mrp-run.service';
import { MRPRun } from '../entities/mrp-run.entity';

@ApiTags('Production - MRP')
@Controller('production/mrp-runs')
export class MRPRunController {
  constructor(private readonly mrpRunService: MRPRunService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new MRP run' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<MRPRun>): Promise<MRPRun> {
    return this.mrpRunService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all MRP runs' })
  @ApiQuery({ name: 'status', required: false })
  async findAll(@Query('status') status?: any): Promise<MRPRun[]> {
    return this.mrpRunService.findAll({ status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get MRP run by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<MRPRun> {
    return this.mrpRunService.findOne(id);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Execute MRP run' })
  @ApiParam({ name: 'id' })
  async execute(@Param('id') id: string): Promise<MRPRun> {
    return this.mrpRunService.execute(id);
  }

  @Get(':id/results')
  @ApiOperation({ summary: 'Get MRP run results' })
  @ApiParam({ name: 'id' })
  async getResults(@Param('id') id: string): Promise<any> {
    return this.mrpRunService.getResults(id);
  }
}
