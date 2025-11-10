import {
  Controller,
  Get,
  Query,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { FinancialReportsService } from '../services/financial-reports.service';

@ApiTags('Finance - Financial Reports')
@Controller('finance/reports')
export class FinancialReportsController {
  constructor(
    private readonly financialReportsService: FinancialReportsService,
  ) {}

  @Get('profit-loss')
  @ApiOperation({ summary: 'Generate Profit & Loss Statement (Income Statement)' })
  @ApiQuery({ name: 'periodId', required: false, description: 'Financial period ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'costCenter', required: false, description: 'Filter by cost center' })
  @ApiQuery({ name: 'department', required: false, description: 'Filter by department' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profit & Loss Statement',
  })
  async getProfitLossStatement(
    @Query('periodId') periodId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('costCenter') costCenter?: string,
    @Query('department') department?: string,
  ): Promise<any> {
    return this.financialReportsService.getProfitLossStatement({
      periodId,
      startDate,
      endDate,
      costCenter,
      department,
    });
  }

  @Get('balance-sheet')
  @ApiOperation({ summary: 'Generate Balance Sheet' })
  @ApiQuery({ name: 'asOfDate', required: true, description: 'Balance sheet as of date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'costCenter', required: false, description: 'Filter by cost center' })
  @ApiQuery({ name: 'department', required: false, description: 'Filter by department' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Balance Sheet',
  })
  async getBalanceSheet(
    @Query('asOfDate') asOfDate: string,
    @Query('costCenter') costCenter?: string,
    @Query('department') department?: string,
  ): Promise<any> {
    return this.financialReportsService.getBalanceSheet({
      asOfDate,
      costCenter,
      department,
    });
  }

  @Get('cash-flow')
  @ApiOperation({ summary: 'Generate Cash Flow Statement' })
  @ApiQuery({ name: 'periodId', required: false, description: 'Financial period ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'method', required: false, enum: ['direct', 'indirect'], description: 'Cash flow method' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cash Flow Statement',
  })
  async getCashFlowStatement(
    @Query('periodId') periodId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('method') method?: 'direct' | 'indirect',
  ): Promise<any> {
    return this.financialReportsService.getCashFlowStatement({
      periodId,
      startDate,
      endDate,
      method: method || 'indirect',
    });
  }

  @Get('trial-balance')
  @ApiOperation({ summary: 'Generate Trial Balance' })
  @ApiQuery({ name: 'periodId', required: false, description: 'Financial period ID' })
  @ApiQuery({ name: 'asOfDate', required: false, description: 'Trial balance as of date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'includeZeroBalances', required: false, description: 'Include accounts with zero balance' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trial Balance',
  })
  async getTrialBalance(
    @Query('periodId') periodId?: string,
    @Query('asOfDate') asOfDate?: string,
    @Query('includeZeroBalances') includeZeroBalances?: boolean,
  ): Promise<any> {
    return this.financialReportsService.getTrialBalance({
      periodId,
      asOfDate,
      includeZeroBalances: includeZeroBalances === true,
    });
  }

  @Get('general-ledger-report')
  @ApiOperation({ summary: 'Generate General Ledger Report' })
  @ApiQuery({ name: 'accountId', required: false, description: 'Account ID filter' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'periodId', required: false, description: 'Financial period ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'General Ledger Report',
  })
  async getGeneralLedgerReport(
    @Query('accountId') accountId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('periodId') periodId?: string,
  ): Promise<any> {
    return this.financialReportsService.getGeneralLedgerReport({
      accountId,
      startDate,
      endDate,
      periodId,
    });
  }

  @Get('receivables-aging')
  @ApiOperation({ summary: 'Generate Accounts Receivable Aging Report' })
  @ApiQuery({ name: 'asOfDate', required: false, description: 'Aging as of date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'partyId', required: false, description: 'Filter by customer' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Receivables Aging Report',
  })
  async getReceivablesAging(
    @Query('asOfDate') asOfDate?: string,
    @Query('partyId') partyId?: string,
  ): Promise<any> {
    return this.financialReportsService.getReceivablesAging({
      asOfDate,
      partyId,
    });
  }

  @Get('payables-aging')
  @ApiOperation({ summary: 'Generate Accounts Payable Aging Report' })
  @ApiQuery({ name: 'asOfDate', required: false, description: 'Aging as of date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'partyId', required: false, description: 'Filter by vendor' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payables Aging Report',
  })
  async getPayablesAging(
    @Query('asOfDate') asOfDate?: string,
    @Query('partyId') partyId?: string,
  ): Promise<any> {
    return this.financialReportsService.getPayablesAging({
      asOfDate,
      partyId,
    });
  }

  @Get('budget-variance')
  @ApiOperation({ summary: 'Generate Budget vs Actual Variance Report' })
  @ApiQuery({ name: 'budgetId', required: true, description: 'Budget ID' })
  @ApiQuery({ name: 'periodId', required: false, description: 'Period ID for specific period analysis' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Budget Variance Report',
  })
  async getBudgetVarianceReport(
    @Query('budgetId') budgetId: string,
    @Query('periodId') periodId?: string,
  ): Promise<any> {
    return this.financialReportsService.getBudgetVarianceReport({
      budgetId,
      periodId,
    });
  }

  @Get('financial-ratios')
  @ApiOperation({ summary: 'Calculate Financial Ratios' })
  @ApiQuery({ name: 'periodId', required: false, description: 'Financial period ID' })
  @ApiQuery({ name: 'asOfDate', required: false, description: 'Calculate ratios as of date (YYYY-MM-DD)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Financial Ratios',
  })
  async getFinancialRatios(
    @Query('periodId') periodId?: string,
    @Query('asOfDate') asOfDate?: string,
  ): Promise<any> {
    return this.financialReportsService.getFinancialRatios({
      periodId,
      asOfDate,
    });
  }

  @Post('custom-report')
  @ApiOperation({ summary: 'Generate custom financial report' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Custom Report',
  })
  async getCustomReport(
    @Body() reportParams: {
      reportType: string;
      accounts?: string[];
      startDate?: string;
      endDate?: string;
      groupBy?: string;
      filters?: any;
    },
  ): Promise<any> {
    return this.financialReportsService.getCustomReport(reportParams);
  }
}
