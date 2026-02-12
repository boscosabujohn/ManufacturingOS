import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { WorkloadAssignmentService } from '../services/workload-assignment.service';
import { WorkloadAssignment } from '../entities/workload-assignment.entity';

@ApiTags('Production - Human-Centric')
@Controller('production/workload-assignments')
export class WorkloadAssignmentController {
  constructor(private readonly workloadAssignmentService: WorkloadAssignmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workload assignment' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<WorkloadAssignment>): Promise<WorkloadAssignment> {
    return this.workloadAssignmentService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workload assignments' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'assignmentDate', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('employeeId') employeeId?: string,
    @Query('assignmentDate') assignmentDate?: string,
  ): Promise<WorkloadAssignment[]> {
    return this.workloadAssignmentService.findAll({
      status,
      employeeId,
      assignmentDate: assignmentDate ? new Date(assignmentDate) : undefined,
    });
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get workload balance' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'date', required: true })
  async getWorkloadBalance(
    @Query('companyId') companyId: string,
    @Query('date') date: string,
  ): Promise<any> {
    return this.workloadAssignmentService.getWorkloadBalance(companyId, new Date(date));
  }

  @Post('optimize')
  @ApiOperation({ summary: 'Optimize workload' })
  async optimizeWorkload(
    @Query('companyId') companyId: string,
    @Query('date') date: string,
  ): Promise<any> {
    return this.workloadAssignmentService.optimizeWorkload(companyId, new Date(date));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workload assignment by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<WorkloadAssignment> {
    return this.workloadAssignmentService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update workload assignment' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<WorkloadAssignment>): Promise<WorkloadAssignment> {
    return this.workloadAssignmentService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete workload assignment' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.workloadAssignmentService.remove(id);
  }

  @Post(':id/task')
  @ApiOperation({ summary: 'Add task' })
  @ApiParam({ name: 'id' })
  async addTask(@Param('id') id: string, @Body() task: any): Promise<WorkloadAssignment> {
    return this.workloadAssignmentService.addTask(id, task);
  }

  @Put(':id/task/:taskId/status')
  @ApiOperation({ summary: 'Update task status' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'taskId' })
  async updateTaskStatus(
    @Param('id') id: string,
    @Param('taskId') taskId: string,
    @Body('status') status: string,
    @Body('actualHours') actualHours?: number,
  ): Promise<WorkloadAssignment> {
    return this.workloadAssignmentService.updateTaskStatus(id, taskId, status, actualHours);
  }
}
