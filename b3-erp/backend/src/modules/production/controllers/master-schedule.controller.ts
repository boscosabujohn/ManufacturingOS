import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MasterScheduleService } from '../services/master-schedule.service';
import { MasterSchedule } from '../entities/master-schedule.entity';

@ApiTags('Production - Master Schedule')
@Controller('production/master-schedules')
export class MasterScheduleController {
  constructor(private readonly masterScheduleService: MasterScheduleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new master schedule' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<MasterSchedule>): Promise<MasterSchedule> {
    return this.masterScheduleService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all master schedules' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'companyId', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('companyId') companyId?: string,
  ): Promise<MasterSchedule[]> {
    return this.masterScheduleService.findAll({ status, companyId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get master schedule by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<MasterSchedule> {
    return this.masterScheduleService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update master schedule' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<MasterSchedule>): Promise<MasterSchedule> {
    return this.masterScheduleService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete master schedule' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.masterScheduleService.remove(id);
  }

  @Post(':id/freeze')
  @ApiOperation({ summary: 'Freeze master schedule' })
  @ApiParam({ name: 'id' })
  async freeze(@Param('id') id: string): Promise<MasterSchedule> {
    return this.masterScheduleService.freeze(id);
  }

  @Get(':id/atp')
  @ApiOperation({ summary: 'Calculate Available-to-Promise' })
  @ApiParam({ name: 'id' })
  async calculateATP(@Param('id') id: string): Promise<any> {
    return this.masterScheduleService.calculateATP(id);
  }
}
