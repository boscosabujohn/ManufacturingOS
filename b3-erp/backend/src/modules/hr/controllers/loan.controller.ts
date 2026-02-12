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
import { LoanService } from '../services/loan.service';
import {
  CreateLoanTypeDto,
  UpdateLoanTypeDto,
  CreateEmployeeLoanDto,
  ApproveLoanDto,
  RejectLoanDto,
  LoanTypeResponseDto,
  EmployeeLoanResponseDto,
} from '../dto/create-loan.dto';

@ApiTags('HR - Loan Management')
@Controller('hr/loans')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  // ============================================================================
  // LOAN TYPES
  // ============================================================================

  @Get('types')
  @ApiOperation({ summary: 'Get all loan types' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [LoanTypeResponseDto] })
  async findAllTypes(
    @Query('companyId') companyId: string,
    @Query('isActive') isActive?: boolean,
    @Query('search') search?: string,
  ) {
    return this.loanService.findAllLoanTypes(companyId, { isActive, search });
  }

  @Get('types/:id')
  @ApiOperation({ summary: 'Get loan type by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: LoanTypeResponseDto })
  async findTypeById(@Param('id') id: string) {
    return this.loanService.findLoanTypeById(id);
  }

  @Post('types')
  @ApiOperation({ summary: 'Create loan type' })
  @ApiResponse({ status: HttpStatus.CREATED, type: LoanTypeResponseDto })
  async createType(@Body() dto: CreateLoanTypeDto) {
    return this.loanService.createLoanType(dto);
  }

  @Put('types/:id')
  @ApiOperation({ summary: 'Update loan type' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: LoanTypeResponseDto })
  async updateType(@Param('id') id: string, @Body() dto: UpdateLoanTypeDto) {
    return this.loanService.updateLoanType(id, dto);
  }

  @Delete('types/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete loan type' })
  @ApiParam({ name: 'id' })
  async deleteType(@Param('id') id: string) {
    return this.loanService.deleteLoanType(id);
  }

  // ============================================================================
  // EMPLOYEE LOANS
  // ============================================================================

  @Get()
  @ApiOperation({ summary: 'Get all employee loans' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'loanTypeId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: HttpStatus.OK })
  async findAllLoans(
    @Query('companyId') companyId: string,
    @Query('employeeId') employeeId?: string,
    @Query('loanTypeId') loanTypeId?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.loanService.findAllLoans(companyId, {
      employeeId,
      loanTypeId,
      status,
      page,
      limit,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get loan by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: EmployeeLoanResponseDto })
  async findLoanById(@Param('id') id: string) {
    return this.loanService.findLoanById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create employee loan request' })
  @ApiResponse({ status: HttpStatus.CREATED, type: EmployeeLoanResponseDto })
  async createLoan(@Body() dto: CreateEmployeeLoanDto) {
    return this.loanService.createLoan(dto);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve loan' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: EmployeeLoanResponseDto })
  async approveLoan(@Param('id') id: string, @Body() dto: ApproveLoanDto) {
    return this.loanService.approveLoan(id, dto.approvedBy, dto.approvedAmount);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject loan' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: EmployeeLoanResponseDto })
  async rejectLoan(@Param('id') id: string, @Body() dto: RejectLoanDto) {
    return this.loanService.rejectLoan(id, dto.rejectionReason);
  }

  @Post(':id/disburse')
  @ApiOperation({ summary: 'Disburse loan' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: EmployeeLoanResponseDto })
  async disburseLoan(@Param('id') id: string) {
    return this.loanService.disburseLoan(id);
  }

  @Post('repayments/:repaymentId/process')
  @ApiOperation({ summary: 'Process EMI deduction' })
  @ApiParam({ name: 'repaymentId' })
  @ApiResponse({ status: HttpStatus.OK })
  async processEMI(
    @Param('repaymentId') repaymentId: string,
    @Body() body: { payslipId?: string },
  ) {
    return this.loanService.processEMIDeduction(repaymentId, body.payslipId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete loan' })
  @ApiParam({ name: 'id' })
  async deleteLoan(@Param('id') id: string) {
    return this.loanService.deleteLoan(id);
  }

  // ============================================================================
  // LOAN REPORTS
  // ============================================================================

  @Get('summary/all')
  @ApiOperation({ summary: 'Get loan summary' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiResponse({ status: HttpStatus.OK })
  async getLoanSummary(@Query('companyId') companyId: string) {
    return this.loanService.getLoanSummary(companyId);
  }

  @Get('pending-emis')
  @ApiOperation({ summary: 'Get pending EMIs for a month' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'month', required: true })
  @ApiQuery({ name: 'year', required: true })
  @ApiResponse({ status: HttpStatus.OK })
  async getPendingEMIs(
    @Query('companyId') companyId: string,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.loanService.getPendingEMIs(companyId, month, year);
  }
}
