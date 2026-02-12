import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ESGScoreService } from '../services/esg-score.service';
import { ESGScore, ReportingPeriod } from '../entities/esg-score.entity';

@ApiTags('Production - Sustainability - ESG Scores')
@Controller('production/sustainability/esg-scores')
export class ESGScoreController {
  constructor(private readonly esgScoreService: ESGScoreService) {}

  @Post()
  @ApiOperation({ summary: 'Create ESG score record' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<ESGScore>): Promise<ESGScore> {
    return this.esgScoreService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ESG scores' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'reportingPeriod', required: false })
  @ApiQuery({ name: 'isPublished', required: false })
  async findAll(
    @Query('companyId') companyId?: string,
    @Query('reportingPeriod') reportingPeriod?: ReportingPeriod,
    @Query('isPublished') isPublished?: boolean,
  ): Promise<ESGScore[]> {
    return this.esgScoreService.findAll({ companyId, reportingPeriod, isPublished });
  }

  @Get('latest')
  @ApiOperation({ summary: 'Get latest published ESG score' })
  @ApiQuery({ name: 'companyId', required: true })
  async getLatestScore(@Query('companyId') companyId: string): Promise<ESGScore | null> {
    return this.esgScoreService.getLatestScore(companyId);
  }

  @Get('trend')
  @ApiOperation({ summary: 'Get ESG score trend' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'periods', required: false })
  async getScoreTrend(
    @Query('companyId') companyId: string,
    @Query('periods') periods?: number,
  ): Promise<any> {
    return this.esgScoreService.getScoreTrend(companyId, periods);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ESG score by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<ESGScore> {
    return this.esgScoreService.findOne(id);
  }

  @Get(':id/kpi-performance')
  @ApiOperation({ summary: 'Get KPI performance for ESG score' })
  @ApiParam({ name: 'id' })
  async getKPIPerformance(@Param('id') id: string): Promise<any> {
    return this.esgScoreService.getKPIPerformance(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update ESG score' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<ESGScore>): Promise<ESGScore> {
    return this.esgScoreService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete ESG score' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.esgScoreService.remove(id);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish ESG score' })
  @ApiParam({ name: 'id' })
  async publish(@Param('id') id: string, @Body('approvedBy') approvedBy: string): Promise<ESGScore> {
    return this.esgScoreService.publish(id, approvedBy);
  }
}
