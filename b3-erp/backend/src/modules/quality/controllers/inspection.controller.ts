import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { InspectionService } from '../services/inspection.service';
import { CreateInspectionDto, UpdateInspectionDto, InspectionResponseDto } from '../dto';

@ApiTags('Quality - Inspection')
@Controller('quality/inspection')
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

  @Post()
  @ApiOperation({ summary: 'Create inspection' })
  async create(@Body() createDto: CreateInspectionDto): Promise<InspectionResponseDto> {
    return this.inspectionService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inspections' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'inspectionType', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('inspectionType') inspectionType?: string,
  ): Promise<InspectionResponseDto[]> {
    return this.inspectionService.findAll({ status, inspectionType });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get inspection by ID' })
  async findOne(@Param('id') id: string): Promise<InspectionResponseDto> {
    return this.inspectionService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update inspection' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateInspectionDto): Promise<InspectionResponseDto> {
    return this.inspectionService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete inspection' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.inspectionService.remove(id);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start inspection' })
  async start(
    @Param('id') id: string,
    @Body('inspectedById') inspectedById: string,
    @Body('inspectedByName') inspectedByName: string,
  ): Promise<InspectionResponseDto> {
    return this.inspectionService.start(id, inspectedById, inspectedByName);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit inspection' })
  async submit(@Param('id') id: string): Promise<InspectionResponseDto> {
    return this.inspectionService.submit(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve inspection' })
  async approve(@Param('id') id: string, @Body('approvedBy') approvedBy: string): Promise<InspectionResponseDto> {
    return this.inspectionService.approve(id, approvedBy);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject inspection' })
  async reject(
    @Param('id') id: string,
    @Body('rejectedBy') rejectedBy: string,
    @Body('reason') reason: string,
  ): Promise<InspectionResponseDto> {
    return this.inspectionService.reject(id, rejectedBy, reason);
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: 'Get inspection statistics' })
  async calculateStatistics(@Param('id') id: string): Promise<any> {
    return this.inspectionService.calculateStatistics(id);
  }
}
