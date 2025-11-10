import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { WorkCenterService } from '../services/work-center.service';
import { CreateWorkCenterDto, UpdateWorkCenterDto, WorkCenterResponseDto } from '../dto';

@ApiTags('Production - Work Center')
@Controller('production/work-center')
export class WorkCenterController {
  constructor(private readonly workCenterService: WorkCenterService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new work center' })
  @ApiResponse({ status: HttpStatus.CREATED, type: WorkCenterResponseDto })
  async create(@Body() createDto: CreateWorkCenterDto): Promise<WorkCenterResponseDto> {
    return this.workCenterService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all work centers' })
  @ApiQuery({ name: 'workCenterType', required: false })
  @ApiQuery({ name: 'department', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [WorkCenterResponseDto] })
  async findAll(
    @Query('workCenterType') workCenterType?: string,
    @Query('department') department?: string,
    @Query('status') status?: any,
    @Query('isActive') isActive?: boolean,
  ): Promise<WorkCenterResponseDto[]> {
    return this.workCenterService.findAll({ workCenterType, department, status, isActive });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get work center by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: WorkCenterResponseDto })
  async findOne(@Param('id') id: string): Promise<WorkCenterResponseDto> {
    return this.workCenterService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update work center' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: WorkCenterResponseDto })
  async update(@Param('id') id: string, @Body() updateDto: UpdateWorkCenterDto): Promise<WorkCenterResponseDto> {
    return this.workCenterService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete work center' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.workCenterService.remove(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update work center status' })
  @ApiParam({ name: 'id' })
  async updateStatus(@Param('id') id: string, @Body('status') status: any): Promise<WorkCenterResponseDto> {
    return this.workCenterService.updateStatus(id, status);
  }
}
