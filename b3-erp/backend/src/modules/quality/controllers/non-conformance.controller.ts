import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { NonConformanceService } from '../services/non-conformance.service';
import { CreateNonConformanceDto, UpdateNonConformanceDto, NonConformanceResponseDto } from '../dto';

@ApiTags('Quality - Non-Conformance')
@Controller('quality/non-conformance')
export class NonConformanceController {
  constructor(private readonly ncrService: NonConformanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create NCR' })
  async create(@Body() createDto: CreateNonConformanceDto): Promise<NonConformanceResponseDto> {
    return this.ncrService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all NCRs' })
  @ApiQuery({ name: 'status', required: false })
  async findAll(@Query('status') status?: any): Promise<NonConformanceResponseDto[]> {
    return this.ncrService.findAll({ status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get NCR by ID' })
  async findOne(@Param('id') id: string): Promise<NonConformanceResponseDto> {
    return this.ncrService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update NCR' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateNonConformanceDto): Promise<NonConformanceResponseDto> {
    return this.ncrService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete NCR' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.ncrService.remove(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit NCR' })
  async submit(@Param('id') id: string, @Body('submittedBy') submittedBy: string): Promise<NonConformanceResponseDto> {
    return this.ncrService.submit(id, submittedBy);
  }

  @Post(':id/investigate')
  @ApiOperation({ summary: 'Start NCR investigation' })
  async investigate(@Param('id') id: string, @Body('investigatedBy') investigatedBy: string): Promise<NonConformanceResponseDto> {
    return this.ncrService.investigate(id, investigatedBy);
  }

  @Post(':id/approve-capa')
  @ApiOperation({ summary: 'Approve CAPA for NCR' })
  async approveCAPA(@Param('id') id: string, @Body('approvedBy') approvedBy: string): Promise<NonConformanceResponseDto> {
    return this.ncrService.approveCAPA(id, approvedBy);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close NCR' })
  async close(@Param('id') id: string, @Body('closedBy') closedBy: string): Promise<NonConformanceResponseDto> {
    return this.ncrService.close(id, closedBy);
  }
}
