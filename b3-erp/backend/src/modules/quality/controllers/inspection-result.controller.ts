import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { InspectionResultService } from '../services/inspection-result.service';
import { CreateInspectionResultDto, UpdateInspectionResultDto, InspectionResultResponseDto } from '../dto';

@ApiTags('Quality - Inspection Result')
@Controller('quality/inspection-result')
export class InspectionResultController {
  constructor(private readonly inspectionResultService: InspectionResultService) {}

  @Post()
  @ApiOperation({ summary: 'Create inspection result' })
  async create(@Body() createDto: CreateInspectionResultDto): Promise<InspectionResultResponseDto> {
    return this.inspectionResultService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inspection results' })
  @ApiQuery({ name: 'inspectionId', required: false })
  async findAll(@Query('inspectionId') inspectionId?: string): Promise<InspectionResultResponseDto[]> {
    return this.inspectionResultService.findAll({ inspectionId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get inspection result by ID' })
  async findOne(@Param('id') id: string): Promise<InspectionResultResponseDto> {
    return this.inspectionResultService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update inspection result' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateInspectionResultDto): Promise<InspectionResultResponseDto> {
    return this.inspectionResultService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete inspection result' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.inspectionResultService.remove(id);
  }
}
