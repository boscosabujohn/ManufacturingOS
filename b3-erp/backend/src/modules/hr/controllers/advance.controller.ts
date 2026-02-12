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
import { AdvanceService } from '../services/advance.service';
import {
  CreateSalaryAdvanceDto,
  UpdateSalaryAdvanceDto,
  ApproveAdvanceDto,
  RejectAdvanceDto,
  SalaryAdvanceResponseDto,
} from '../dto/create-advance.dto';

@ApiTags('HR - Salary Advance Management')
@Controller('hr/advances')
export class AdvanceController {
  constructor(private readonly advanceService: AdvanceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all salary advances' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: HttpStatus.OK })
  async findAll(
    @Query('companyId') companyId: string,
    @Query('employeeId') employeeId?: string,
    @Query('status') status?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.advanceService.findAllAdvances(companyId, {
      employeeId,
      status,
      fromDate,
      toDate,
      page,
      limit,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get salary advance by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: SalaryAdvanceResponseDto })
  async findById(@Param('id') id: string) {
    return this.advanceService.findAdvanceById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create salary advance request' })
  @ApiResponse({ status: HttpStatus.CREATED, type: SalaryAdvanceResponseDto })
  async create(@Body() dto: CreateSalaryAdvanceDto) {
    return this.advanceService.createAdvance(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update salary advance' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: SalaryAdvanceResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateSalaryAdvanceDto) {
    return this.advanceService.updateAdvance(id, dto);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve salary advance' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: SalaryAdvanceResponseDto })
  async approve(@Param('id') id: string, @Body() dto: ApproveAdvanceDto) {
    return this.advanceService.approveAdvance(id, dto.approvedBy, dto.approvedAmount);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject salary advance' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: SalaryAdvanceResponseDto })
  async reject(@Param('id') id: string, @Body() dto: RejectAdvanceDto) {
    return this.advanceService.rejectAdvance(id, dto.rejectionReason);
  }

  @Post(':id/disburse')
  @ApiOperation({ summary: 'Disburse salary advance' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: SalaryAdvanceResponseDto })
  async disburse(@Param('id') id: string) {
    return this.advanceService.disburseAdvance(id);
  }

  @Post('recoveries/:recoveryId/process')
  @ApiOperation({ summary: 'Process advance recovery deduction' })
  @ApiParam({ name: 'recoveryId' })
  @ApiResponse({ status: HttpStatus.OK })
  async processRecovery(
    @Param('recoveryId') recoveryId: string,
    @Body() body: { payslipId?: string },
  ) {
    return this.advanceService.processRecovery(recoveryId, body.payslipId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete salary advance' })
  @ApiParam({ name: 'id' })
  async delete(@Param('id') id: string) {
    return this.advanceService.deleteAdvance(id);
  }

  // ============================================================================
  // ADVANCE REPORTS
  // ============================================================================

  @Get('summary/all')
  @ApiOperation({ summary: 'Get advance summary' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiResponse({ status: HttpStatus.OK })
  async getSummary(@Query('companyId') companyId: string) {
    return this.advanceService.getAdvanceSummary(companyId);
  }

  @Get('pending-recoveries')
  @ApiOperation({ summary: 'Get pending recoveries for a month' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'month', required: true })
  @ApiQuery({ name: 'year', required: true })
  @ApiResponse({ status: HttpStatus.OK })
  async getPendingRecoveries(
    @Query('companyId') companyId: string,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.advanceService.getPendingRecoveries(companyId, month, year);
  }
}
