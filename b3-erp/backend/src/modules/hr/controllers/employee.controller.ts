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
import { EmployeeService } from '../services/employee.service';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeResponseDto,
} from '../dto';

@ApiTags('HR - Employee')
@Controller('hr/employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Employee created successfully',
    type: EmployeeResponseDto,
  })
  async create(
    @Body() createDto: CreateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    return this.employeeService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  @ApiQuery({ name: 'departmentId', required: false, description: 'Filter by department' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name, code, or email' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of employees',
    type: [EmployeeResponseDto],
  })
  async findAll(
    @Query('departmentId') departmentId?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): Promise<EmployeeResponseDto[]> {
    return this.employeeService.findAll({ departmentId, status, search });
  }

  @Get('active/count')
  @ApiOperation({ summary: 'Get count of active employees' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Count of active employees',
  })
  async getActiveCount(): Promise<{ count: number }> {
    const count = await this.employeeService.getActiveCount();
    return { count };
  }

  @Get('department/:departmentId')
  @ApiOperation({ summary: 'Get employees by department' })
  @ApiParam({ name: 'departmentId', description: 'Department ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of employees in department',
    type: [EmployeeResponseDto],
  })
  async getByDepartment(@Param('departmentId') departmentId: string): Promise<EmployeeResponseDto[]> {
    return this.employeeService.getByDepartment(departmentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Employee details',
    type: EmployeeResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Employee not found' })
  async findOne(@Param('id') id: string): Promise<EmployeeResponseDto> {
    return this.employeeService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update employee' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Employee updated successfully',
    type: EmployeeResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    return this.employeeService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete employee' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Employee deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.employeeService.remove(id);
  }

  // Special HR Operations
  @Post(':id/onboard')
  @ApiOperation({ summary: 'Onboard employee' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Employee onboarded successfully',
    type: EmployeeResponseDto,
  })
  async onboard(@Param('id') id: string, @Body() data: any): Promise<EmployeeResponseDto> {
    return this.employeeService.onboard(id, data);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm employee after probation' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Employee confirmed successfully',
    type: EmployeeResponseDto,
  })
  async confirm(@Param('id') id: string): Promise<EmployeeResponseDto> {
    return this.employeeService.confirm(id);
  }

  @Post(':id/transfer')
  @ApiOperation({ summary: 'Transfer employee to another department' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Employee transferred successfully',
    type: EmployeeResponseDto,
  })
  async transfer(@Param('id') id: string, @Body() data: any): Promise<EmployeeResponseDto> {
    return this.employeeService.transfer(id, data);
  }

  @Post(':id/promote')
  @ApiOperation({ summary: 'Promote employee' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Employee promoted successfully',
    type: EmployeeResponseDto,
  })
  async promote(@Param('id') id: string, @Body() data: any): Promise<EmployeeResponseDto> {
    return this.employeeService.promote(id, data);
  }

  @Post(':id/terminate')
  @ApiOperation({ summary: 'Terminate employee' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Employee terminated successfully',
    type: EmployeeResponseDto,
  })
  async terminate(@Param('id') id: string, @Body() data: any): Promise<EmployeeResponseDto> {
    return this.employeeService.terminate(id, data);
  }

  @Post(':id/resign')
  @ApiOperation({ summary: 'Process employee resignation' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Employee resignation processed successfully',
    type: EmployeeResponseDto,
  })
  async resign(@Param('id') id: string, @Body() data: any): Promise<EmployeeResponseDto> {
    return this.employeeService.resign(id, data);
  }
}
