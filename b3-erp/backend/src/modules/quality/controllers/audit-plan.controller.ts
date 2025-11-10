import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuditPlanService } from '../services/audit-plan.service';
import { CreateAuditPlanDto, UpdateAuditPlanDto, AuditPlanResponseDto } from '../dto';

@ApiTags('Quality - Audit Plan')
@Controller('quality/audit-plan')
export class AuditPlanController {
  constructor(private readonly auditPlanService: AuditPlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create audit plan' })
  async create(@Body() createDto: CreateAuditPlanDto): Promise<AuditPlanResponseDto> {
    return this.auditPlanService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all audit plans' })
  @ApiQuery({ name: 'status', required: false })
  async findAll(@Query('status') status?: any): Promise<AuditPlanResponseDto[]> {
    return this.auditPlanService.findAll({ status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get audit plan by ID' })
  async findOne(@Param('id') id: string): Promise<AuditPlanResponseDto> {
    return this.auditPlanService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update audit plan' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateAuditPlanDto): Promise<AuditPlanResponseDto> {
    return this.auditPlanService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete audit plan' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.auditPlanService.remove(id);
  }

  @Post(':id/schedule')
  @ApiOperation({ summary: 'Schedule audit' })
  async schedule(@Param('id') id: string): Promise<AuditPlanResponseDto> {
    return this.auditPlanService.schedule(id);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start audit' })
  async start(@Param('id') id: string, @Body('startedBy') startedBy: string): Promise<AuditPlanResponseDto> {
    return this.auditPlanService.start(id, startedBy);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete audit' })
  async complete(@Param('id') id: string, @Body('completedBy') completedBy: string): Promise<AuditPlanResponseDto> {
    return this.auditPlanService.complete(id, completedBy);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close audit' })
  async close(@Param('id') id: string, @Body('closedBy') closedBy: string): Promise<AuditPlanResponseDto> {
    return this.auditPlanService.close(id, closedBy);
  }
}
