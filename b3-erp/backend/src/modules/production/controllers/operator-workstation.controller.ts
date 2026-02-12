import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OperatorWorkstationService } from '../services/operator-workstation.service';
import { OperatorWorkstation } from '../entities/operator-workstation.entity';

@ApiTags('Production - Human-Centric')
@Controller('production/operator-workstations')
export class OperatorWorkstationController {
  constructor(private readonly operatorWorkstationService: OperatorWorkstationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new operator workstation' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<OperatorWorkstation>): Promise<OperatorWorkstation> {
    return this.operatorWorkstationService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all operator workstations' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'workstationType', required: false })
  @ApiQuery({ name: 'productionLineId', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('workstationType') workstationType?: any,
    @Query('productionLineId') productionLineId?: string,
  ): Promise<OperatorWorkstation[]> {
    return this.operatorWorkstationService.findAll({ status, workstationType, productionLineId });
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get workstation dashboard' })
  @ApiQuery({ name: 'companyId', required: true })
  async getDashboard(@Query('companyId') companyId: string): Promise<any> {
    return this.operatorWorkstationService.getWorkstationDashboard(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get operator workstation by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<OperatorWorkstation> {
    return this.operatorWorkstationService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update operator workstation' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<OperatorWorkstation>): Promise<OperatorWorkstation> {
    return this.operatorWorkstationService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete operator workstation' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.operatorWorkstationService.remove(id);
  }

  @Post(':id/assign-operator')
  @ApiOperation({ summary: 'Assign operator' })
  @ApiParam({ name: 'id' })
  async assignOperator(
    @Param('id') id: string,
    @Body('operatorId') operatorId: string,
    @Body('operatorName') operatorName: string,
  ): Promise<OperatorWorkstation> {
    return this.operatorWorkstationService.assignOperator(id, operatorId, operatorName);
  }

  @Post(':id/release-operator')
  @ApiOperation({ summary: 'Release operator' })
  @ApiParam({ name: 'id' })
  async releaseOperator(@Param('id') id: string): Promise<OperatorWorkstation> {
    return this.operatorWorkstationService.releaseOperator(id);
  }

  @Post(':id/assign-work-order')
  @ApiOperation({ summary: 'Assign work order' })
  @ApiParam({ name: 'id' })
  async assignWorkOrder(
    @Param('id') id: string,
    @Body('workOrderId') workOrderId: string,
    @Body('operationId') operationId: string,
  ): Promise<OperatorWorkstation> {
    return this.operatorWorkstationService.assignWorkOrder(id, workOrderId, operationId);
  }

  @Put(':id/performance-metrics')
  @ApiOperation({ summary: 'Update performance metrics' })
  @ApiParam({ name: 'id' })
  async updatePerformanceMetrics(@Param('id') id: string, @Body() metrics: any): Promise<OperatorWorkstation> {
    return this.operatorWorkstationService.updatePerformanceMetrics(id, metrics);
  }
}
