import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ShiftAssignmentService } from '../services/shift-assignment.service';
import { ShiftAssignment } from '../entities/shift-assignment.entity';

@ApiTags('Production - Settings')
@Controller('production/shift-assignments')
export class ShiftAssignmentController {
  constructor(private readonly shiftAssignmentService: ShiftAssignmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shift assignment' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<ShiftAssignment>): Promise<ShiftAssignment> {
    return this.shiftAssignmentService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shift assignments' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'shiftId', required: false })
  @ApiQuery({ name: 'assignmentDate', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('employeeId') employeeId?: string,
    @Query('shiftId') shiftId?: string,
    @Query('assignmentDate') assignmentDate?: string,
  ): Promise<ShiftAssignment[]> {
    return this.shiftAssignmentService.findAll({
      status,
      employeeId,
      shiftId,
      assignmentDate: assignmentDate ? new Date(assignmentDate) : undefined,
    });
  }

  @Get('attendance-summary')
  @ApiOperation({ summary: 'Get attendance summary' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'date', required: true })
  async getAttendanceSummary(
    @Query('companyId') companyId: string,
    @Query('date') date: string,
  ): Promise<any> {
    return this.shiftAssignmentService.getAttendanceSummary(companyId, new Date(date));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shift assignment by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<ShiftAssignment> {
    return this.shiftAssignmentService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update shift assignment' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<ShiftAssignment>): Promise<ShiftAssignment> {
    return this.shiftAssignmentService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete shift assignment' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.shiftAssignmentService.remove(id);
  }

  @Post(':id/clock-in')
  @ApiOperation({ summary: 'Clock in' })
  @ApiParam({ name: 'id' })
  async clockIn(@Param('id') id: string): Promise<ShiftAssignment> {
    return this.shiftAssignmentService.clockIn(id);
  }

  @Post(':id/clock-out')
  @ApiOperation({ summary: 'Clock out' })
  @ApiParam({ name: 'id' })
  async clockOut(@Param('id') id: string): Promise<ShiftAssignment> {
    return this.shiftAssignmentService.clockOut(id);
  }
}
