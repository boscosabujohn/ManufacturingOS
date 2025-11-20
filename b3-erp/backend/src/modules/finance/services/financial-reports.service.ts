import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeneralLedger } from '../entities/general-ledger.entity';
import { ChartOfAccounts, AccountType } from '../entities/chart-of-accounts.entity';
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
  ) {}

  async getProfitLossStatement(params: {
    periodId?: string;
    startDate?: string;
    endDate?: string;
    costCenter?: string;
    department?: string;
  }): Promise<any> {
    // Get GL entries for the period
    const queryBuilder = this.generalLedgerRepository.createQueryBuilder('gl')
      .leftJoinAndSelect('gl.account', 'account');

    if (params.startDate) {
      queryBuilder.andWhere('gl.transactionDate >= :startDate', { startDate: params.startDate });
    }
    if (params.endDate) {
      queryBuilder.andWhere('gl.transactionDate <= :endDate', { endDate: params.endDate });
    }
    if (params.costCenter) {
      queryBuilder.andWhere('gl.costCenter = :costCenter', { costCenter: params.costCenter });
    }

    const entries = await queryBuilder.getMany();

    // Aggregate by account type
    const income: any[] = [];
    const cogs: any[] = [];
    const operatingExpenses: any[] = [];
    const otherExpenses: any[] = [];

    let totalRevenue = 0;
    let totalCOGS = 0;
    let totalOperatingExpenses = 0;
    let totalOtherExpenses = 0;

    // Mock aggregated data (in production, would be from GL entries)
    const revenueAccounts = [
      { accountCode: '4001', accountName: 'Product Sales', amount: 12500000 },
      { accountCode: '4002', accountName: 'Service Revenue', amount: 2800000 },
      { accountCode: '4010', accountName: 'Sales Returns', amount: -150000 },
      { accountCode: '4020', accountName: 'Sales Discounts', amount: -200000 },
    ];

    const cogsAccounts = [
      { accountCode: '5001', accountName: 'Raw Materials', amount: 5500000 },
      { accountCode: '5100', accountName: 'Direct Labor', amount: 2200000 },
      { accountCode: '5200', accountName: 'Manufacturing Overhead', amount: 1100000 },
    ];

    const opexAccounts = [
      { accountCode: '6001', accountName: 'Selling & Marketing', amount: 800000 },
      { accountCode: '6100', accountName: 'General & Admin', amount: 1200000 },
      { accountCode: '6200', accountName: 'Research & Development', amount: 500000 },
      { accountCode: '6300', accountName: 'Depreciation', amount: 350000 },
    ];

    revenueAccounts.forEach(acc => {
      income.push(acc);
      totalRevenue += acc.amount;
    });

    cogsAccounts.forEach(acc => {
      cogs.push(acc);
      totalCOGS += acc.amount;
    });

    opexAccounts.forEach(acc => {
      operatingExpenses.push(acc);
      totalOperatingExpenses += acc.amount;
    });

    const grossProfit = totalRevenue - totalCOGS;
    const operatingProfit = grossProfit - totalOperatingExpenses;
    const netProfitLoss = operatingProfit - totalOtherExpenses;

    return {
      reportType: 'Profit & Loss Statement',
      period: params,
      income: {
        operatingIncome: income,
        nonOperatingIncome: [],
        totalIncome: totalRevenue,
      },
      expenses: {
        costOfGoodsSold: cogs,
        totalCOGS,
        grossProfit,
        grossMargin: totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(2) + '%' : '0%',
        operatingExpenses,
        totalOperatingExpenses,
        financialExpenses: [],
        otherExpenses,
        totalExpenses: totalCOGS + totalOperatingExpenses + totalOtherExpenses,
      },
      operatingProfit,
      operatingMargin: totalRevenue > 0 ? ((operatingProfit / totalRevenue) * 100).toFixed(2) + '%' : '0%',
      netProfitLoss,
      netMargin: totalRevenue > 0 ? ((netProfitLoss / totalRevenue) * 100).toFixed(2) + '%' : '0%',
      generatedAt: new Date(),
    };
  }

  async getBalanceSheet(params: {
    asOfDate: string;
    costCenter?: string;
    department?: string;
  }): Promise<any> {
    // Placeholder implementation
    return {
      reportType: 'Balance Sheet',
      asOfDate: params.asOfDate,
      assets: {
        currentAssets: [],
        fixedAssets: [],
        intangibleAssets: [],
        otherAssets: [],
        totalAssets: 0,
      },
      liabilities: {
        currentLiabilities: [],
        longTermLiabilities: [],
        totalLiabilities: 0,
      },
      equity: {
        shareCapital: [],
        reserves: [],
        retainedEarnings: [],
        totalEquity: 0,
      },
      totalLiabilitiesAndEquity: 0,
      generatedAt: new Date(),
    };
  }

  async getCashFlowStatement(params: {
    periodId?: string;
    startDate?: string;
    endDate?: string;
    method: 'direct' | 'indirect';
  }): Promise<any> {
    // Placeholder implementation
    return {
      reportType: 'Cash Flow Statement',
      method: params.method,
      period: params,
      operatingActivities: {
        items: [],
        total: 0,
      },
      investingActivities: {
        items: [],
        total: 0,
      },
      financingActivities: {
        items: [],
        total: 0,
      },
      netCashFlow: 0,
      openingCashBalance: 0,
      closingCashBalance: 0,
      generatedAt: new Date(),
    };
  }

  async getTrialBalance(params: {
    periodId?: string;
    asOfDate?: string;
    includeZeroBalances: boolean;
  }): Promise<any> {
    // Placeholder implementation
    return {
      reportType: 'Trial Balance',
      asOfDate: params.asOfDate,
      accounts: [],
      totalDebit: 0,
      totalCredit: 0,
      isBalanced: true,
      generatedAt: new Date(),
    };
  }

  async getGeneralLedgerReport(params: {
    accountId?: string;
    startDate?: string;
    endDate?: string;
    periodId?: string;
  }): Promise<any> {
    // Placeholder implementation
    return {
      reportType: 'General Ledger Report',
      period: params,
      accounts: [],
      generatedAt: new Date(),
    };
  }

  async getReceivablesAging(params: {
    asOfDate?: string;
    partyId?: string;
  }): Promise<any> {
    // Placeholder implementation
    return {
      reportType: 'Receivables Aging Report',
      asOfDate: params.asOfDate || new Date().toISOString().split('T')[0],
      agingBuckets: [
        { range: 'Current', amount: 0 },
        { range: '1-30 days', amount: 0 },
        { range: '31-60 days', amount: 0 },
        { range: '61-90 days', amount: 0 },
        { range: '90+ days', amount: 0 },
      ],
      totalReceivables: 0,
      generatedAt: new Date(),
    };
  }

  async getPayablesAging(params: {
    asOfDate?: string;
    partyId?: string;
  }): Promise<any> {
    // Placeholder implementation
    return {
      reportType: 'Payables Aging Report',
      asOfDate: params.asOfDate || new Date().toISOString().split('T')[0],
      agingBuckets: [
        { range: 'Current', amount: 0 },
        { range: '1-30 days', amount: 0 },
        { range: '31-60 days', amount: 0 },
        { range: '61-90 days', amount: 0 },
        { range: '90+ days', amount: 0 },
      ],
      totalPayables: 0,
      generatedAt: new Date(),
    };
  }

  async getBudgetVarianceReport(params: {
    budgetId: string;
    periodId?: string;
  }): Promise<any> {
    // Placeholder implementation
    return {
      reportType: 'Budget Variance Report',
      budgetId: params.budgetId,
      periodId: params.periodId,
      variances: [],
      totalBudgeted: 0,
      totalActual: 0,
      totalVariance: 0,
      variancePercentage: 0,
      generatedAt: new Date(),
    };
  }

  async getFinancialRatios(params: {
    periodId?: string;
    asOfDate?: string;
  }): Promise<any> {
    // Placeholder implementation
    return {
      reportType: 'Financial Ratios',
      asOfDate: params.asOfDate,
      liquidityRatios: {
        currentRatio: 0,
        quickRatio: 0,
        cashRatio: 0,
      },
      profitabilityRatios: {
        grossProfitMargin: 0,
        netProfitMargin: 0,
        returnOnAssets: 0,
        returnOnEquity: 0,
      },
      leverageRatios: {
        debtToEquity: 0,
        debtToAssets: 0,
        equityMultiplier: 0,
      },
      efficiencyRatios: {
        assetTurnover: 0,
        inventoryTurnover: 0,
        receivablesTurnover: 0,
      },
      generatedAt: new Date(),
    };
  }

  async getCustomReport(reportParams: any): Promise<any> {
    // Placeholder for custom report generation
    return {
      reportType: 'Custom Report',
      parameters: reportParams,
      data: [],
      generatedAt: new Date(),
    };
  }
}
