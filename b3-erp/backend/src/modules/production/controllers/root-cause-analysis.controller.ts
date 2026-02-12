import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RootCauseAnalysisService } from '../services/root-cause-analysis.service';
import { RootCauseAnalysis } from '../entities/root-cause-analysis.entity';

@ApiTags('Production - Root Cause Analysis')
@Controller('production/root-cause-analyses')
export class RootCauseAnalysisController {
  constructor(private readonly rootCauseAnalysisService: RootCauseAnalysisService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new RCA' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<RootCauseAnalysis>): Promise<RootCauseAnalysis> {
    return this.rootCauseAnalysisService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all RCAs' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'methodology', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('methodology') methodology?: any,
  ): Promise<RootCauseAnalysis[]> {
    return this.rootCauseAnalysisService.findAll({ status, methodology });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get RCA by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<RootCauseAnalysis> {
    return this.rootCauseAnalysisService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update RCA' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<RootCauseAnalysis>): Promise<RootCauseAnalysis> {
    return this.rootCauseAnalysisService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete RCA' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.rootCauseAnalysisService.remove(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete RCA' })
  @ApiParam({ name: 'id' })
  async complete(
    @Param('id') id: string,
    @Body('rootCause') rootCause: string,
  ): Promise<RootCauseAnalysis> {
    return this.rootCauseAnalysisService.complete(id, rootCause);
  }

  @Post(':id/corrective-action')
  @ApiOperation({ summary: 'Add corrective action' })
  @ApiParam({ name: 'id' })
  async addCorrectiveAction(@Param('id') id: string, @Body() action: any): Promise<RootCauseAnalysis> {
    return this.rootCauseAnalysisService.addCorrectiveAction(id, action);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify RCA' })
  @ApiParam({ name: 'id' })
  async verify(
    @Param('id') id: string,
    @Body('verifiedBy') verifiedBy: string,
  ): Promise<RootCauseAnalysis> {
    return this.rootCauseAnalysisService.verify(id, verifiedBy);
  }
}
