import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { LeaveApplicationService } from '../services/leave-application.service';
import {
  CreateLeaveApplicationDto,
  UpdateLeaveApplicationDto,
  LeaveApplicationResponseDto,
} from '../dto';

@ApiTags('HR - Leave Application')
@Controller('hr/leave-applications')
export class LeaveApplicationController {
  constructor(private readonly service: LeaveApplicationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new leave application' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Leave application created successfully',
    type: LeaveApplicationResponseDto,
  })
  async create(
    @Body() createDto: CreateLeaveApplicationDto,
  ): Promise<LeaveApplicationResponseDto> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leave applications' })
  @ApiQuery({ name: 'employeeId', required: false, description: 'Filter by employee' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of leave applications',
    type: [LeaveApplicationResponseDto],
  })
  async findAll(
    @Query('employeeId') employeeId?: string,
    @Query('status') status?: string,
  ): Promise<LeaveApplicationResponseDto[]> {
    return this.service.findAll({ employeeId, status });
  }

  @Get('employee/:employeeId/balance/:leaveTypeId')
  @ApiOperation({ summary: 'Get leave balance for employee' })
  @ApiParam({ name: 'employeeId', description: 'Employee ID' })
  @ApiParam({ name: 'leaveTypeId', description: 'Leave Type ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Leave balance',
  })
  async getLeaveBalance(
    @Param('employeeId') employeeId: string,
    @Param('leaveTypeId') leaveTypeId: string,
  ): Promise<any> {
    return this.service.getLeaveBalance(employeeId, leaveTypeId);
  }

  @Get('employee/:employeeId/history')
  @ApiOperation({ summary: 'Get leave history for employee' })
  @ApiParam({ name: 'employeeId', description: 'Employee ID' })
  @ApiQuery({ name: 'year', required: false, description: 'Filter by year' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Leave history',
  })
  async getLeaveHistory(
    @Param('employeeId') employeeId: string,
    @Query('year') year?: number,
  ): Promise<any[]> {
    return this.service.getLeaveHistory(employeeId, year);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get leave application by ID' })
  @ApiParam({ name: 'id', description: 'Leave Application ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Leave application details',
    type: LeaveApplicationResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Leave application not found' })
  async findOne(@Param('id') id: string): Promise<LeaveApplicationResponseDto> {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update leave application' })
  @ApiParam({ name: 'id', description: 'Leave Application ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Leave application updated successfully',
    type: LeaveApplicationResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateLeaveApplicationDto,
  ): Promise<LeaveApplicationResponseDto> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete leave application' })
  @ApiParam({ name: 'id', description: 'Leave Application ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Leave application deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }

  // Special Operations
  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit leave application' })
  @ApiParam({ name: 'id', description: 'Leave Application ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Leave application submitted successfully',
  })
  async submit(@Param('id') id: string): Promise<any> {
    return this.service.submit(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve leave application' })
  @ApiParam({ name: 'id', description: 'Leave Application ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Leave application approved successfully',
  })
  async approve(@Param('id') id: string, @Body() data: { approverId: string; remarks?: string }): Promise<any> {
    return this.service.approve(id, data.approverId, data.remarks);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject leave application' })
  @ApiParam({ name: 'id', description: 'Leave Application ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Leave application rejected successfully',
  })
  async reject(@Param('id') id: string, @Body() data: { rejectedBy: string; reason: string }): Promise<any> {
    return this.service.reject(id, data.rejectedBy, data.reason);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel leave application' })
  @ApiParam({ name: 'id', description: 'Leave Application ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Leave application cancelled successfully',
  })
  async cancel(@Param('id') id: string, @Body() data: { cancelledBy: string; reason: string }): Promise<any> {
    return this.service.cancel(id, data.cancelledBy, data.reason);
  }
}
