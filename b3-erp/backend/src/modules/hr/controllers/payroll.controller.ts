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
import { PayrollService } from '../services/payroll.service';
import {
  CreatePayrollDto,
  UpdatePayrollDto,
  PayrollResponseDto,
} from '../dto';

@ApiTags('HR - Payroll')
@Controller('hr/payrolls')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payroll' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payroll created successfully',
    type: PayrollResponseDto,
  })
  async create(
    @Body() createDto: CreatePayrollDto,
  ): Promise<PayrollResponseDto> {
    return this.payrollService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payrolls' })
  @ApiQuery({ name: 'month', required: false, description: 'Filter by month' })
  @ApiQuery({ name: 'year', required: false, description: 'Filter by year' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of payrolls',
    type: [PayrollResponseDto],
  })
  async findAll(
    @Query('month') month?: number,
    @Query('year') year?: number,
    @Query('status') status?: string,
  ): Promise<PayrollResponseDto[]> {
    return this.payrollService.findAll({ month, year, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payroll by ID' })
  @ApiParam({ name: 'id', description: 'Payroll ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payroll details',
    type: PayrollResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Payroll not found' })
  async findOne(@Param('id') id: string): Promise<PayrollResponseDto> {
    return this.payrollService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update payroll' })
  @ApiParam({ name: 'id', description: 'Payroll ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payroll updated successfully',
    type: PayrollResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePayrollDto,
  ): Promise<PayrollResponseDto> {
    return this.payrollService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete payroll' })
  @ApiParam({ name: 'id', description: 'Payroll ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Payroll deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.payrollService.remove(id);
  }

  // Special Operations
  @Post(':id/process')
  @ApiOperation({ summary: 'Process payroll and generate salary slips' })
  @ApiParam({ name: 'id', description: 'Payroll ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payroll processed successfully',
  })
  async processPayroll(@Param('id') id: string): Promise<any> {
    return this.payrollService.processPayroll(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve payroll' })
  @ApiParam({ name: 'id', description: 'Payroll ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payroll approved successfully',
  })
  async approve(@Param('id') id: string, @Body() data: { approvedBy: string }): Promise<any> {
    return this.payrollService.approvePayroll(id, data.approvedBy);
  }

  @Post(':id/post-to-gl')
  @ApiOperation({ summary: 'Post payroll to general ledger' })
  @ApiParam({ name: 'id', description: 'Payroll ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payroll posted to GL successfully',
  })
  async postToGL(@Param('id') id: string, @Body() data: { postedBy: string }): Promise<any> {
    return this.payrollService.postToGL(id, data.postedBy);
  }

  @Post(':id/mark-as-paid')
  @ApiOperation({ summary: 'Mark payroll as paid' })
  @ApiParam({ name: 'id', description: 'Payroll ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payroll marked as paid successfully',
  })
  async markAsPaid(
    @Param('id') id: string,
    @Body() data: { paidBy: string; paymentRef: string },
  ): Promise<any> {
    return this.payrollService.markAsPaid(id, data.paidBy, data.paymentRef);
  }

  @Get(':id/pay-advice')
  @ApiOperation({ summary: 'Generate pay advice' })
  @ApiParam({ name: 'id', description: 'Payroll ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pay advice generated successfully',
  })
  async generatePayAdvice(@Param('id') id: string): Promise<any> {
    return this.payrollService.generatePayAdvice(id);
  }
}
