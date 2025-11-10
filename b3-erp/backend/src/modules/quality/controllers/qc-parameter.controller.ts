import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { QCParameterService } from '../services/qc-parameter.service';
import { CreateQCParameterDto, UpdateQCParameterDto, QCParameterResponseDto } from '../dto';

@ApiTags('Quality - QC Parameter')
@Controller('quality/qc-parameter')
export class QCParameterController {
  constructor(private readonly qcParameterService: QCParameterService) {}

  @Post()
  @ApiOperation({ summary: 'Create QC parameter' })
  async create(@Body() createDto: CreateQCParameterDto): Promise<QCParameterResponseDto> {
    return this.qcParameterService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all QC parameters' })
  @ApiQuery({ name: 'qcTemplateId', required: false })
  async findAll(@Query('qcTemplateId') qcTemplateId?: string): Promise<QCParameterResponseDto[]> {
    return this.qcParameterService.findAll({ qcTemplateId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get QC parameter by ID' })
  async findOne(@Param('id') id: string): Promise<QCParameterResponseDto> {
    return this.qcParameterService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update QC parameter' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateQCParameterDto): Promise<QCParameterResponseDto> {
    return this.qcParameterService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete QC parameter' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.qcParameterService.remove(id);
  }
}
