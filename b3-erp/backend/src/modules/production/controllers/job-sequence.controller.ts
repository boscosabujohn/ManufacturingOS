import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JobSequenceService } from '../services/job-sequence.service';
import { JobSequence, SequencingRule } from '../entities/job-sequence.entity';

@ApiTags('Production - Job Sequencing')
@Controller('production/job-sequences')
export class JobSequenceController {
  constructor(private readonly jobSequenceService: JobSequenceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new job sequence' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<JobSequence>): Promise<JobSequence> {
    return this.jobSequenceService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all job sequences' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'workCenterId', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('workCenterId') workCenterId?: string,
  ): Promise<JobSequence[]> {
    return this.jobSequenceService.findAll({ status, workCenterId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job sequence by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<JobSequence> {
    return this.jobSequenceService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update job sequence' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<JobSequence>): Promise<JobSequence> {
    return this.jobSequenceService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete job sequence' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.jobSequenceService.remove(id);
  }

  @Post(':id/optimize')
  @ApiOperation({ summary: 'Optimize job sequence using specified rule' })
  @ApiParam({ name: 'id' })
  async optimize(@Param('id') id: string, @Body('rule') rule: SequencingRule): Promise<JobSequence> {
    return this.jobSequenceService.optimize(id, rule);
  }
}
