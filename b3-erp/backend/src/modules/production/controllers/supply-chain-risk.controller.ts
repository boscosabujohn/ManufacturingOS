import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SupplyChainRiskService } from '../services/supply-chain-risk.service';
import { SupplyChainRisk, RiskLevel, RiskCategory } from '../entities/supply-chain-risk.entity';

@ApiTags('Production - Resilience - Supply Chain Risk')
@Controller('production/resilience/supply-chain-risks')
export class SupplyChainRiskController {
  constructor(private readonly supplyChainRiskService: SupplyChainRiskService) {}

  @Post()
  @ApiOperation({ summary: 'Create supply chain risk' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<SupplyChainRisk>): Promise<SupplyChainRisk> {
    return this.supplyChainRiskService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all supply chain risks' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'riskLevel', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'status', required: false })
  async findAll(
    @Query('companyId') companyId?: string,
    @Query('riskLevel') riskLevel?: RiskLevel,
    @Query('category') category?: RiskCategory,
    @Query('status') status?: string,
  ): Promise<SupplyChainRisk[]> {
    return this.supplyChainRiskService.findAll({ companyId, riskLevel, category, status });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get risk summary' })
  @ApiQuery({ name: 'companyId', required: true })
  async getRiskSummary(@Query('companyId') companyId: string): Promise<any> {
    return this.supplyChainRiskService.getRiskSummary(companyId);
  }

  @Get('buffer-stock-alerts')
  @ApiOperation({ summary: 'Get buffer stock alerts' })
  @ApiQuery({ name: 'companyId', required: true })
  async getBufferStockAlerts(@Query('companyId') companyId: string): Promise<any[]> {
    return this.supplyChainRiskService.getBufferStockAlerts(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get supply chain risk by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<SupplyChainRisk> {
    return this.supplyChainRiskService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update supply chain risk' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<SupplyChainRisk>): Promise<SupplyChainRisk> {
    return this.supplyChainRiskService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete supply chain risk' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.supplyChainRiskService.remove(id);
  }

  @Post(':id/mitigation')
  @ApiOperation({ summary: 'Add mitigation action' })
  @ApiParam({ name: 'id' })
  async addMitigationAction(@Param('id') id: string, @Body() action: any): Promise<SupplyChainRisk> {
    return this.supplyChainRiskService.addMitigationAction(id, action);
  }

  @Put(':id/mitigation/:actionIndex/status')
  @ApiOperation({ summary: 'Update mitigation status' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'actionIndex' })
  async updateMitigationStatus(
    @Param('id') id: string,
    @Param('actionIndex') actionIndex: number,
    @Body('status') status: 'pending' | 'in_progress' | 'completed',
  ): Promise<SupplyChainRisk> {
    return this.supplyChainRiskService.updateMitigationStatus(id, actionIndex, status);
  }
}
