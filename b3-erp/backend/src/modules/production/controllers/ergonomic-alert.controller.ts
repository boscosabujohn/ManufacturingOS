import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ErgonomicAlertService } from '../services/ergonomic-alert.service';
import { ErgonomicAlert } from '../entities/ergonomic-alert.entity';

@ApiTags('Production - Human-Centric')
@Controller('production/ergonomic-alerts')
export class ErgonomicAlertController {
  constructor(private readonly ergonomicAlertService: ErgonomicAlertService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ergonomic alert' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<ErgonomicAlert>): Promise<ErgonomicAlert> {
    return this.ergonomicAlertService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ergonomic alerts' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'employeeId', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('severity') severity?: any,
    @Query('category') category?: any,
    @Query('employeeId') employeeId?: string,
  ): Promise<ErgonomicAlert[]> {
    return this.ergonomicAlertService.findAll({ status, severity, category, employeeId });
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get alert dashboard' })
  @ApiQuery({ name: 'companyId', required: true })
  async getDashboard(@Query('companyId') companyId: string): Promise<any> {
    return this.ergonomicAlertService.getAlertDashboard(companyId);
  }

  @Get('employee/:employeeId/history')
  @ApiOperation({ summary: 'Get employee ergonomic history' })
  @ApiParam({ name: 'employeeId' })
  async getEmployeeHistory(@Param('employeeId') employeeId: string): Promise<any> {
    return this.ergonomicAlertService.getEmployeeErgonomicHistory(employeeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ergonomic alert by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<ErgonomicAlert> {
    return this.ergonomicAlertService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update ergonomic alert' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<ErgonomicAlert>): Promise<ErgonomicAlert> {
    return this.ergonomicAlertService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete ergonomic alert' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.ergonomicAlertService.remove(id);
  }

  @Post(':id/acknowledge')
  @ApiOperation({ summary: 'Acknowledge alert' })
  @ApiParam({ name: 'id' })
  async acknowledge(@Param('id') id: string, @Body('acknowledgedBy') acknowledgedBy: string): Promise<ErgonomicAlert> {
    return this.ergonomicAlertService.acknowledge(id, acknowledgedBy);
  }

  @Post(':id/resolve')
  @ApiOperation({ summary: 'Resolve alert' })
  @ApiParam({ name: 'id' })
  async resolve(
    @Param('id') id: string,
    @Body('resolutionAction') resolutionAction: string,
    @Body('resolvedBy') resolvedBy: string,
  ): Promise<ErgonomicAlert> {
    return this.ergonomicAlertService.resolve(id, resolutionAction, resolvedBy);
  }

  @Post(':id/dismiss')
  @ApiOperation({ summary: 'Dismiss alert' })
  @ApiParam({ name: 'id' })
  async dismiss(@Param('id') id: string, @Body('notes') notes: string): Promise<ErgonomicAlert> {
    return this.ergonomicAlertService.dismiss(id, notes);
  }

  @Post(':id/follow-up')
  @ApiOperation({ summary: 'Schedule follow-up' })
  @ApiParam({ name: 'id' })
  async scheduleFollowUp(@Param('id') id: string, @Body('followUpDate') followUpDate: string): Promise<ErgonomicAlert> {
    return this.ergonomicAlertService.scheduleFollowUp(id, new Date(followUpDate));
  }
}
