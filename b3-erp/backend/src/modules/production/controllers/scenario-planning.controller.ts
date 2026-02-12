import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ScenarioPlanningService } from '../services/scenario-planning.service';
import { ScenarioPlanning, DisruptionType, ScenarioStatus } from '../entities/scenario-planning.entity';

@ApiTags('Production - Resilience - Scenario Planning')
@Controller('production/resilience/scenario-planning')
export class ScenarioPlanningController {
  constructor(private readonly scenarioPlanningService: ScenarioPlanningService) {}

  @Post()
  @ApiOperation({ summary: 'Create scenario' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<ScenarioPlanning>): Promise<ScenarioPlanning> {
    return this.scenarioPlanningService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all scenarios' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'disruptionType', required: false })
  @ApiQuery({ name: 'status', required: false })
  async findAll(
    @Query('companyId') companyId?: string,
    @Query('disruptionType') disruptionType?: DisruptionType,
    @Query('status') status?: ScenarioStatus,
  ): Promise<ScenarioPlanning[]> {
    return this.scenarioPlanningService.findAll({ companyId, disruptionType, status });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get scenario summary' })
  @ApiQuery({ name: 'companyId', required: true })
  async getScenarioSummary(@Query('companyId') companyId: string): Promise<any> {
    return this.scenarioPlanningService.getScenarioSummary(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get scenario by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<ScenarioPlanning> {
    return this.scenarioPlanningService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update scenario' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<ScenarioPlanning>): Promise<ScenarioPlanning> {
    return this.scenarioPlanningService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete scenario' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.scenarioPlanningService.remove(id);
  }

  @Post(':id/analyze')
  @ApiOperation({ summary: 'Analyze scenario' })
  @ApiParam({ name: 'id' })
  async analyze(@Param('id') id: string): Promise<ScenarioPlanning> {
    return this.scenarioPlanningService.analyze(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve scenario' })
  @ApiParam({ name: 'id' })
  async approve(@Param('id') id: string, @Body('approvedBy') approvedBy: string): Promise<ScenarioPlanning> {
    return this.scenarioPlanningService.approve(id, approvedBy);
  }

  @Post(':id/archive')
  @ApiOperation({ summary: 'Archive scenario' })
  @ApiParam({ name: 'id' })
  async archive(@Param('id') id: string): Promise<ScenarioPlanning> {
    return this.scenarioPlanningService.archive(id);
  }

  @Post(':id/mitigation')
  @ApiOperation({ summary: 'Add mitigation strategy' })
  @ApiParam({ name: 'id' })
  async addMitigationStrategy(@Param('id') id: string, @Body() strategy: any): Promise<ScenarioPlanning> {
    return this.scenarioPlanningService.addMitigationStrategy(id, strategy);
  }

  @Post(':id/impact-analysis')
  @ApiOperation({ summary: 'Run impact analysis' })
  @ApiParam({ name: 'id' })
  async runImpactAnalysis(@Param('id') id: string, @Body('parameters') parameters: any[]): Promise<any> {
    return this.scenarioPlanningService.runImpactAnalysis(id, parameters);
  }
}
