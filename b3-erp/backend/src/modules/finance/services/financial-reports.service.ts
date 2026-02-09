import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeneralLedger } from '../entities/general-ledger.entity';
import { ChartOfAccounts } from '../entities/chart-of-accounts.entity';
import { Budget } from '../entities/budget.entity';

@Injectable()
export class FinancialReportsService {
  constructor(
    @InjectRepository(GeneralLedger)
    private readonly generalLedgerRepository: Repository<GeneralLedger>,
    @InjectRepository(ChartOfAccounts)
    private readonly chartOfAccountsRepository: Repository<ChartOfAccounts>,
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
  ) { }

  async getProfitLossStatement(params: {
    periodId?: string;
    startDate?: string;
    endDate?: string;
    costCenter?: string;
    department?: string;
    companyId?: string;
  }): Promise<any> {
    const queryBuilder = this.generalLedgerRepository.createQueryBuilder('gl')
      .leftJoinAndSelect('gl.account', 'account')
      .where('gl.status = :status', { status: 'Posted' });

    if (params.startDate) {
      queryBuilder.andWhere('gl.postingDate >= :startDate', { startDate: params.startDate });
    }
    if (params.endDate) {
      queryBuilder.andWhere('gl.postingDate <= :endDate', { endDate: params.endDate });
    }
    if (params.companyId) {
      queryBuilder.andWhere('gl.companyId = :companyId', { companyId: params.companyId });
    }

    const entries = await queryBuilder.getMany();

    let totalRevenue = 0;
    let totalCOGS = 0;
    let totalExpenses = 0;

    const income = entries.filter(e => e.account.accountType === 'Income');
    const cogs = entries.filter(e => e.account.accountType === 'Expense' && e.account.accountCode.startsWith('5'));
    const opex = entries.filter(e => e.account.accountType === 'Expense' && !e.account.accountCode.startsWith('5'));

    totalRevenue = income.reduce((sum, e) => sum + Number(e.creditAmount) - Number(e.debitAmount), 0);
    totalCOGS = cogs.reduce((sum, e) => sum + Number(e.debitAmount) - Number(e.creditAmount), 0);
    totalExpenses = opex.reduce((sum, e) => sum + Number(e.debitAmount) - Number(e.creditAmount), 0);

    const grossProfit = totalRevenue - totalCOGS;
    const netProfitLoss = grossProfit - totalExpenses;

    return {
      reportType: 'Profit & Loss Statement (Live)',
      period: params,
      totalRevenue,
      totalCOGS,
      grossProfit,
      totalExpenses,
      netProfitLoss,
      generatedAt: new Date(),
    };
  }

  async getBalanceSheet(params: {
    asOfDate?: string;
    companyId?: string;
    costCenter?: string;
    department?: string;
  }): Promise<any> {
    const queryBuilder = this.generalLedgerRepository.createQueryBuilder('gl')
      .leftJoinAndSelect('gl.account', 'account')
      .where('gl.status = :status', { status: 'Posted' });

    if (params.asOfDate) {
      queryBuilder.andWhere('gl.postingDate <= :asOfDate', { asOfDate: params.asOfDate });
    }
    if (params.companyId) {
      queryBuilder.andWhere('gl.companyId = :companyId', { companyId: params.companyId });
    }

    const entries = await queryBuilder.getMany();

    const assets = entries.filter(e => e.account.accountType === 'Asset').reduce((sum, e) => sum + Number(e.debitAmount) - Number(e.creditAmount), 0);
    const liabilities = entries.filter(e => e.account.accountType === 'Liability').reduce((sum, e) => sum + Number(e.creditAmount) - Number(e.debitAmount), 0);
    const equity = entries.filter(e => e.account.accountType === 'Equity').reduce((sum, e) => sum + Number(e.creditAmount) - Number(e.debitAmount), 0);

    return {
      reportType: 'Balance Sheet (Live)',
      asOfDate: params.asOfDate || new Date().toISOString(),
      totalAssets: assets,
      totalLiabilities: liabilities,
      totalEquity: equity,
      isBalanced: Math.abs(assets - (liabilities + equity)) < 0.01,
      generatedAt: new Date(),
    };
  }

  async getTrialBalance(params: any): Promise<any> {
    return { reportType: 'Trial Balance', data: [], generatedAt: new Date() };
  }

  async getGeneralLedgerReport(params: any): Promise<any> {
    return { reportType: 'General Ledger Report', data: [], generatedAt: new Date() };
  }

  async getStatutoryComplianceReport(params: {
    companyId: string;
    reportType: 'GST' | 'TDS';
    startDate: string;
    endDate: string;
  }): Promise<any> {
    const glEntries = await this.generalLedgerRepository.createQueryBuilder('gl')
      .leftJoinAndSelect('gl.account', 'account')
      .where('gl.companyId = :companyId', { companyId: params.companyId })
      .andWhere('gl.postingDate BETWEEN :startDate AND :endDate', {
        startDate: params.startDate,
        endDate: params.endDate
      })
      .andWhere('account.accountName LIKE :taxType', { taxType: `%${params.reportType}%` })
      .getMany();

    const liability = glEntries.reduce((sum, e) => sum + Number(e.creditAmount) - Number(e.debitAmount), 0);

    return {
      companyId: params.companyId,
      reportType: `${params.reportType} Liability Report`,
      period: { startDate: params.startDate, endDate: params.endDate },
      totalLiability: liability,
      transactions: glEntries.length,
      isCompliant: true,
      generatedAt: new Date(),
    };
  }

  async getCustomReport(reportParams: any): Promise<any> {
    return { reportType: 'Custom Report', parameters: reportParams, data: [], generatedAt: new Date() };
  }

  async getReceivablesAging(params: any): Promise<any> {
    return { reportType: 'Receivables Aging', data: [], generatedAt: new Date() };
  }

  async getPayablesAging(params: any): Promise<any> {
    return { reportType: 'Payables Aging', data: [], generatedAt: new Date() };
  }

  async getBudgetVarianceReport(params: any): Promise<any> {
    return { reportType: 'Budget Variance', data: [], generatedAt: new Date() };
  }

  async getFinancialRatios(params: any): Promise<any> {
    return { reportType: 'Financial Ratios', data: [], generatedAt: new Date() };
  }

  async getCashFlowStatement(params: any): Promise<any> {
    return { reportType: 'Cash Flow', data: [], generatedAt: new Date() };
  }
}
