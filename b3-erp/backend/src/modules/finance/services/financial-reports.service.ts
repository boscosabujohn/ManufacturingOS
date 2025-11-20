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
    // Get GL balances as of date
    const queryBuilder = this.generalLedgerRepository.createQueryBuilder('gl')
      .leftJoinAndSelect('gl.account', 'account')
      .where('gl.transactionDate <= :asOfDate', { asOfDate: params.asOfDate });

    if (params.costCenter) {
      queryBuilder.andWhere('gl.costCenter = :costCenter', { costCenter: params.costCenter });
    }

    const entries = await queryBuilder.getMany();

    // Current Assets
    const currentAssets = [
      { accountCode: '1001', accountName: 'Cash and Cash Equivalents', balance: 8500000 },
      { accountCode: '1010', accountName: 'Bank Accounts', balance: 12000000 },
      { accountCode: '1100', accountName: 'Accounts Receivable', balance: 15000000 },
      { accountCode: '1110', accountName: 'Allowance for Doubtful Accounts', balance: -450000 },
      { accountCode: '1200', accountName: 'Inventory - Raw Materials', balance: 8000000 },
      { accountCode: '1210', accountName: 'Inventory - Work in Progress', balance: 3500000 },
      { accountCode: '1220', accountName: 'Inventory - Finished Goods', balance: 6000000 },
      { accountCode: '1300', accountName: 'Prepaid Expenses', balance: 1200000 },
      { accountCode: '1310', accountName: 'Advance to Suppliers', balance: 2500000 },
    ];

    // Fixed Assets
    const fixedAssets = [
      { accountCode: '1500', accountName: 'Land', balance: 25000000 },
      { accountCode: '1510', accountName: 'Buildings', balance: 45000000 },
      { accountCode: '1511', accountName: 'Accumulated Depreciation - Buildings', balance: -9000000 },
      { accountCode: '1520', accountName: 'Plant & Machinery', balance: 35000000 },
      { accountCode: '1521', accountName: 'Accumulated Depreciation - Plant & Machinery', balance: -12000000 },
      { accountCode: '1530', accountName: 'Furniture & Fixtures', balance: 3000000 },
      { accountCode: '1531', accountName: 'Accumulated Depreciation - Furniture', balance: -1500000 },
      { accountCode: '1540', accountName: 'Vehicles', balance: 5000000 },
      { accountCode: '1541', accountName: 'Accumulated Depreciation - Vehicles', balance: -2000000 },
      { accountCode: '1550', accountName: 'Computer Equipment', balance: 2500000 },
      { accountCode: '1551', accountName: 'Accumulated Depreciation - Computer', balance: -1800000 },
    ];

    // Intangible Assets
    const intangibleAssets = [
      { accountCode: '1600', accountName: 'Software Licenses', balance: 2000000 },
      { accountCode: '1601', accountName: 'Accumulated Amortization - Software', balance: -800000 },
      { accountCode: '1610', accountName: 'Patents & Trademarks', balance: 3000000 },
      { accountCode: '1620', accountName: 'Goodwill', balance: 5000000 },
    ];

    // Other Assets
    const otherAssets = [
      { accountCode: '1700', accountName: 'Security Deposits', balance: 1500000 },
      { accountCode: '1710', accountName: 'Long-term Investments', balance: 8000000 },
      { accountCode: '1720', accountName: 'Deferred Tax Assets', balance: 1200000 },
    ];

    // Current Liabilities
    const currentLiabilities = [
      { accountCode: '2001', accountName: 'Accounts Payable', balance: 12000000 },
      { accountCode: '2010', accountName: 'Accrued Expenses', balance: 3500000 },
      { accountCode: '2020', accountName: 'Salaries & Wages Payable', balance: 2800000 },
      { accountCode: '2030', accountName: 'Taxes Payable', balance: 4500000 },
      { accountCode: '2040', accountName: 'GST/VAT Payable', balance: 1800000 },
      { accountCode: '2050', accountName: 'Short-term Loans', balance: 10000000 },
      { accountCode: '2060', accountName: 'Current Portion of Long-term Debt', balance: 5000000 },
      { accountCode: '2070', accountName: 'Advance from Customers', balance: 3200000 },
      { accountCode: '2080', accountName: 'Provisions', balance: 2000000 },
    ];

    // Long-term Liabilities
    const longTermLiabilities = [
      { accountCode: '2500', accountName: 'Long-term Bank Loans', balance: 25000000 },
      { accountCode: '2510', accountName: 'Bonds Payable', balance: 15000000 },
      { accountCode: '2520', accountName: 'Deferred Tax Liabilities', balance: 3500000 },
      { accountCode: '2530', accountName: 'Employee Benefits Obligation', balance: 4000000 },
      { accountCode: '2540', accountName: 'Lease Liabilities', balance: 6000000 },
    ];

    // Equity
    const shareCapital = [
      { accountCode: '3001', accountName: 'Authorized Share Capital', balance: 50000000 },
      { accountCode: '3010', accountName: 'Paid-up Capital', balance: 40000000 },
      { accountCode: '3020', accountName: 'Share Premium', balance: 10000000 },
    ];

    const reserves = [
      { accountCode: '3100', accountName: 'General Reserve', balance: 15000000 },
      { accountCode: '3110', accountName: 'Capital Reserve', balance: 5000000 },
      { accountCode: '3120', accountName: 'Revaluation Reserve', balance: 8000000 },
    ];

    const retainedEarnings = [
      { accountCode: '3200', accountName: 'Retained Earnings - Opening', balance: 25000000 },
      { accountCode: '3210', accountName: 'Current Year Profit', balance: 6150000 },
      { accountCode: '3220', accountName: 'Dividends Declared', balance: -3000000 },
    ];

    // Calculate totals
    const totalCurrentAssets = currentAssets.reduce((sum, a) => sum + a.balance, 0);
    const totalFixedAssets = fixedAssets.reduce((sum, a) => sum + a.balance, 0);
    const totalIntangibleAssets = intangibleAssets.reduce((sum, a) => sum + a.balance, 0);
    const totalOtherAssets = otherAssets.reduce((sum, a) => sum + a.balance, 0);
    const totalAssets = totalCurrentAssets + totalFixedAssets + totalIntangibleAssets + totalOtherAssets;

    const totalCurrentLiabilities = currentLiabilities.reduce((sum, l) => sum + l.balance, 0);
    const totalLongTermLiabilities = longTermLiabilities.reduce((sum, l) => sum + l.balance, 0);
    const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

    const totalShareCapital = shareCapital.reduce((sum, e) => sum + e.balance, 0);
    const totalReserves = reserves.reduce((sum, e) => sum + e.balance, 0);
    const totalRetainedEarnings = retainedEarnings.reduce((sum, e) => sum + e.balance, 0);
    const totalEquity = totalShareCapital + totalReserves + totalRetainedEarnings;

    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

    // Calculate key ratios
    const currentRatio = totalCurrentLiabilities > 0 ? totalCurrentAssets / totalCurrentLiabilities : 0;
    const quickRatio = totalCurrentLiabilities > 0
      ? (totalCurrentAssets - currentAssets.filter(a => a.accountCode.startsWith('12')).reduce((s, a) => s + a.balance, 0)) / totalCurrentLiabilities
      : 0;
    const debtToEquityRatio = totalEquity > 0 ? totalLiabilities / totalEquity : 0;

    return {
      reportType: 'Balance Sheet',
      asOfDate: params.asOfDate,
      assets: {
        currentAssets: {
          items: currentAssets,
          total: totalCurrentAssets,
        },
        fixedAssets: {
          items: fixedAssets,
          total: totalFixedAssets,
          netFixedAssets: totalFixedAssets,
        },
        intangibleAssets: {
          items: intangibleAssets,
          total: totalIntangibleAssets,
        },
        otherAssets: {
          items: otherAssets,
          total: totalOtherAssets,
        },
        totalAssets,
      },
      liabilities: {
        currentLiabilities: {
          items: currentLiabilities,
          total: totalCurrentLiabilities,
        },
        longTermLiabilities: {
          items: longTermLiabilities,
          total: totalLongTermLiabilities,
        },
        totalLiabilities,
      },
      equity: {
        shareCapital: {
          items: shareCapital,
          total: totalShareCapital,
        },
        reserves: {
          items: reserves,
          total: totalReserves,
        },
        retainedEarnings: {
          items: retainedEarnings,
          total: totalRetainedEarnings,
        },
        totalEquity,
      },
      totalLiabilitiesAndEquity,
      isBalanced: Math.abs(totalAssets - totalLiabilitiesAndEquity) < 1,
      keyRatios: {
        currentRatio: currentRatio.toFixed(2),
        quickRatio: quickRatio.toFixed(2),
        debtToEquityRatio: debtToEquityRatio.toFixed(2),
        workingCapital: totalCurrentAssets - totalCurrentLiabilities,
      },
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
