import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuditFindingsService } from '../services/audit-findings.service';
import { CreateAuditFindingsDto, UpdateAuditFindingsDto, AuditFindingsResponseDto } from '../dto';

@ApiTags('Quality - Audit Findings')
@Controller('quality/audit-findings')
export class AuditFindingsController {
  constructor(private readonly findingsService: AuditFindingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create audit finding' })
  async create(@Body() createDto: CreateAuditFindingsDto): Promise<AuditFindingsResponseDto> {
    return this.findingsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all audit findings' })
  @ApiQuery({ name: 'auditPlanId', required: false })
  @ApiQuery({ name: 'status', required: false })
  async findAll(
    @Query('auditPlanId') auditPlanId?: string,
    @Query('status') status?: any,
  ): Promise<AuditFindingsResponseDto[]> {
    return this.findingsService.findAll({ auditPlanId, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get audit finding by ID' })
  async findOne(@Param('id') id: string): Promise<AuditFindingsResponseDto> {
    return this.findingsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update audit finding' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateAuditFindingsDto): Promise<AuditFindingsResponseDto> {
    return this.findingsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete audit finding' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.findingsService.remove(id);
  }

  @Post(':id/acknowledge')
  @ApiOperation({ summary: 'Acknowledge audit finding' })
  async acknowledge(@Param('id') id: string, @Body('acknowledgedBy') acknowledgedBy: string): Promise<AuditFindingsResponseDto> {
    return this.findingsService.acknowledge(id, acknowledgedBy);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify audit finding' })
  async verify(
    @Param('id') id: string,
    @Body('verifiedBy') verifiedBy: string,
    @Body('isEffective') isEffective: boolean,
  ): Promise<AuditFindingsResponseDto> {
    return this.findingsService.verify(id, verifiedBy, isEffective);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close audit finding' })
  async close(@Param('id') id: string, @Body('closedBy') closedBy: string): Promise<AuditFindingsResponseDto> {
    return this.findingsService.close(id, closedBy);
  }
}
