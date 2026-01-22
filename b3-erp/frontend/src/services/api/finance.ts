/**
 * Finance API Service
 * Wires frontend to backend Finance module APIs
 */

import apiClient from '@/lib/api-client';

// ============================================
// TYPES
// ============================================

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  invoiceType: 'sales' | 'purchase';
  partyId: string;
  partyName: string;
  partyType: 'customer' | 'vendor';
  currency: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'draft' | 'submitted' | 'approved' | 'posted' | 'paid' | 'cancelled' | 'overdue';
  paymentTerms?: string;
  paymentDueDays?: number;
  notes?: string;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  description?: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  totalAmount: number;
}

export interface CreateInvoiceDto {
  invoiceType: 'sales' | 'purchase';
  partyId: string;
  partyType: 'customer' | 'vendor';
  invoiceDate: string;
  dueDate?: string;
  currency?: string;
  paymentTerms?: string;
  notes?: string;
  items: CreateInvoiceItemDto[];
}

export interface CreateInvoiceItemDto {
  itemId: string;
  quantity: number;
  unitPrice: number;
  discountPercent?: number;
  taxPercent?: number;
  description?: string;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  paymentDate: string;
  paymentType: 'receipt' | 'payment';
  partyId: string;
  partyName: string;
  partyType: 'customer' | 'vendor';
  paymentMethod: 'cash' | 'bank_transfer' | 'cheque' | 'card' | 'upi' | 'other';
  referenceNumber?: string;
  bankAccountId?: string;
  bankAccountName?: string;
  amount: number;
  currency: string;
  status: 'draft' | 'submitted' | 'approved' | 'posted' | 'reconciled' | 'cancelled';
  allocations: PaymentAllocation[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentAllocation {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  allocatedAmount: number;
}

export interface CreatePaymentDto {
  paymentType: 'receipt' | 'payment';
  partyId: string;
  partyType: 'customer' | 'vendor';
  paymentDate: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'cheque' | 'card' | 'upi' | 'other';
  amount: number;
  currency?: string;
  referenceNumber?: string;
  bankAccountId?: string;
  notes?: string;
  allocations?: { invoiceId: string; amount: number }[];
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  entryDate: string;
  entryType: string;
  description: string;
  status: 'draft' | 'submitted' | 'posted' | 'cancelled';
  totalDebit: number;
  totalCredit: number;
  lines: JournalEntryLine[];
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntryLine {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  debitAmount: number;
  creditAmount: number;
  description?: string;
  costCenterId?: string;
  costCenterName?: string;
}

export interface ChartOfAccount {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  accountSubType: string;
  parentAccountId?: string;
  parentAccountCode?: string;
  level: number;
  normalBalance: 'debit' | 'credit';
  isActive: boolean;
  allowPosting: boolean;
  isSystemAccount: boolean;
  description?: string;
  currentBalance: number;
}

export interface FinancialReportParams {
  fromDate: string;
  toDate: string;
  comparePrevious?: boolean;
  costCenterId?: string;
}

export interface ProfitLossReport {
  period: { from: string; to: string };
  revenue: ReportLineItem[];
  totalRevenue: number;
  costOfGoodsSold: ReportLineItem[];
  totalCOGS: number;
  grossProfit: number;
  operatingExpenses: ReportLineItem[];
  totalOperatingExpenses: number;
  operatingProfit: number;
  otherIncome: ReportLineItem[];
  otherExpenses: ReportLineItem[];
  profitBeforeTax: number;
  taxExpense: number;
  netProfit: number;
}

export interface BalanceSheetReport {
  asOfDate: string;
  assets: {
    currentAssets: ReportLineItem[];
    totalCurrentAssets: number;
    fixedAssets: ReportLineItem[];
    totalFixedAssets: number;
    otherAssets: ReportLineItem[];
    totalOtherAssets: number;
    totalAssets: number;
  };
  liabilities: {
    currentLiabilities: ReportLineItem[];
    totalCurrentLiabilities: number;
    longTermLiabilities: ReportLineItem[];
    totalLongTermLiabilities: number;
    totalLiabilities: number;
  };
  equity: {
    items: ReportLineItem[];
    totalEquity: number;
  };
  totalLiabilitiesAndEquity: number;
}

export interface CashFlowReport {
  period: { from: string; to: string };
  operatingActivities: ReportLineItem[];
  netCashFromOperating: number;
  investingActivities: ReportLineItem[];
  netCashFromInvesting: number;
  financingActivities: ReportLineItem[];
  netCashFromFinancing: number;
  netChangeInCash: number;
  openingCashBalance: number;
  closingCashBalance: number;
}

export interface ReportLineItem {
  accountCode: string;
  accountName: string;
  amount: number;
  previousAmount?: number;
  variance?: number;
  variancePercent?: number;
}

export interface AgingReport {
  partyType: 'customer' | 'vendor';
  asOfDate: string;
  summary: {
    current: number;
    days1to30: number;
    days31to60: number;
    days61to90: number;
    over90Days: number;
    total: number;
  };
  details: AgingReportDetail[];
}

export interface AgingReportDetail {
  partyId: string;
  partyCode: string;
  partyName: string;
  current: number;
  days1to30: number;
  days31to60: number;
  days61to90: number;
  over90Days: number;
  total: number;
  invoices: {
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    amount: number;
    balance: number;
    agingDays: number;
  }[];
}

// ============================================
// INVOICE API
// ============================================

export const invoiceApi = {
  async getAll(filters?: {
    status?: string;
    invoiceType?: string;
    partyId?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Invoice[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/finance/invoices?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<Invoice> {
    const response = await apiClient.get(`/finance/invoices/${id}`);
    return response.data;
  },

  async create(data: CreateInvoiceDto): Promise<Invoice> {
    const response = await apiClient.post('/finance/invoices', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateInvoiceDto>): Promise<Invoice> {
    const response = await apiClient.put(`/finance/invoices/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/finance/invoices/${id}`);
  },

  async submit(id: string): Promise<Invoice> {
    const response = await apiClient.post(`/finance/invoices/${id}/submit`);
    return response.data;
  },

  async approve(id: string): Promise<Invoice> {
    const response = await apiClient.post(`/finance/invoices/${id}/approve`);
    return response.data;
  },

  async post(id: string): Promise<Invoice> {
    const response = await apiClient.post(`/finance/invoices/${id}/post`);
    return response.data;
  },

  async cancel(id: string, reason?: string): Promise<Invoice> {
    const response = await apiClient.post(`/finance/invoices/${id}/cancel`, { reason });
    return response.data;
  },

  async getOverdue(): Promise<Invoice[]> {
    const response = await apiClient.get('/finance/invoices/overdue');
    return response.data;
  },

  async getAgingReport(partyType: 'customer' | 'vendor'): Promise<AgingReport> {
    const response = await apiClient.get(`/finance/invoices/aging-report?partyType=${partyType}`);
    return response.data;
  },

  async getOutstandingBalance(partyId: string): Promise<{ balance: number; currency: string }> {
    const response = await apiClient.get(`/finance/invoices/party/${partyId}/outstanding`);
    return response.data;
  },
};

// ============================================
// PAYMENT API
// ============================================

export const paymentApi = {
  async getAll(filters?: {
    status?: string;
    paymentType?: string;
    partyId?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Payment[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/finance/payments?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<Payment> {
    const response = await apiClient.get(`/finance/payments/${id}`);
    return response.data;
  },

  async create(data: CreatePaymentDto): Promise<Payment> {
    const response = await apiClient.post('/finance/payments', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreatePaymentDto>): Promise<Payment> {
    const response = await apiClient.put(`/finance/payments/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/finance/payments/${id}`);
  },

  async submit(id: string): Promise<Payment> {
    const response = await apiClient.post(`/finance/payments/${id}/submit`);
    return response.data;
  },

  async approve(id: string): Promise<Payment> {
    const response = await apiClient.post(`/finance/payments/${id}/approve`);
    return response.data;
  },

  async post(id: string): Promise<Payment> {
    const response = await apiClient.post(`/finance/payments/${id}/post`);
    return response.data;
  },

  async reverse(id: string, reason: string): Promise<Payment> {
    const response = await apiClient.post(`/finance/payments/${id}/reverse`, { reason });
    return response.data;
  },

  async reconcile(id: string, bankStatementRef: string): Promise<Payment> {
    const response = await apiClient.post(`/finance/payments/${id}/reconcile`, {
      bankStatementRef,
    });
    return response.data;
  },
};

// ============================================
// JOURNAL ENTRY API
// ============================================

export const journalEntryApi = {
  async getAll(filters?: {
    status?: string;
    entryType?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: JournalEntry[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/finance/journal-entries?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<JournalEntry> {
    const response = await apiClient.get(`/finance/journal-entries/${id}`);
    return response.data;
  },

  async create(data: {
    entryDate: string;
    entryType: string;
    description: string;
    lines: {
      accountId: string;
      debitAmount: number;
      creditAmount: number;
      description?: string;
      costCenterId?: string;
    }[];
  }): Promise<JournalEntry> {
    const response = await apiClient.post('/finance/journal-entries', data);
    return response.data;
  },

  async post(id: string): Promise<JournalEntry> {
    const response = await apiClient.post(`/finance/journal-entries/${id}/post`);
    return response.data;
  },

  async cancel(id: string, reason: string): Promise<JournalEntry> {
    const response = await apiClient.post(`/finance/journal-entries/${id}/cancel`, { reason });
    return response.data;
  },
};

// ============================================
// CHART OF ACCOUNTS API
// ============================================

export const chartOfAccountsApi = {
  async getAll(filters?: {
    accountType?: string;
    isActive?: boolean;
    allowPosting?: boolean;
  }): Promise<ChartOfAccount[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/finance/chart-of-accounts?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<ChartOfAccount> {
    const response = await apiClient.get(`/finance/chart-of-accounts/${id}`);
    return response.data;
  },

  async create(data: {
    accountCode: string;
    accountName: string;
    accountType: string;
    accountSubType: string;
    parentAccountId?: string;
    normalBalance: 'debit' | 'credit';
    allowPosting: boolean;
    description?: string;
  }): Promise<ChartOfAccount> {
    const response = await apiClient.post('/finance/chart-of-accounts', data);
    return response.data;
  },

  async update(id: string, data: Partial<ChartOfAccount>): Promise<ChartOfAccount> {
    const response = await apiClient.put(`/finance/chart-of-accounts/${id}`, data);
    return response.data;
  },

  async getHierarchy(): Promise<ChartOfAccount[]> {
    const response = await apiClient.get('/finance/chart-of-accounts/hierarchy');
    return response.data;
  },

  async seedAccounts(): Promise<{ created: number; skipped: number; errors: number }> {
    const response = await apiClient.post('/finance/chart-of-accounts/seed');
    return response.data;
  },
};

// ============================================
// FINANCIAL REPORTS API
// ============================================

export const financialReportsApi = {
  async getProfitAndLoss(params: FinancialReportParams): Promise<ProfitLossReport> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, String(value));
    });
    const response = await apiClient.get(`/finance/reports/profit-loss?${queryParams.toString()}`);
    return response.data;
  },

  async getBalanceSheet(asOfDate: string, costCenterId?: string): Promise<BalanceSheetReport> {
    const params = new URLSearchParams({ asOfDate });
    if (costCenterId) params.append('costCenterId', costCenterId);
    const response = await apiClient.get(`/finance/reports/balance-sheet?${params.toString()}`);
    return response.data;
  },

  async getCashFlow(params: FinancialReportParams): Promise<CashFlowReport> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, String(value));
    });
    const response = await apiClient.get(`/finance/reports/cash-flow?${queryParams.toString()}`);
    return response.data;
  },

  async getTrialBalance(asOfDate: string): Promise<{
    accounts: { accountCode: string; accountName: string; debit: number; credit: number }[];
    totalDebit: number;
    totalCredit: number;
  }> {
    const response = await apiClient.get(`/finance/reports/trial-balance?asOfDate=${asOfDate}`);
    return response.data;
  },

  async getGeneralLedger(accountId: string, fromDate: string, toDate: string): Promise<{
    account: ChartOfAccount;
    openingBalance: number;
    transactions: {
      date: string;
      reference: string;
      description: string;
      debit: number;
      credit: number;
      balance: number;
    }[];
    closingBalance: number;
  }> {
    const params = new URLSearchParams({ fromDate, toDate });
    const response = await apiClient.get(
      `/finance/reports/general-ledger/${accountId}?${params.toString()}`,
    );
    return response.data;
  },
};

// Export all APIs as a single object
export const financeService = {
  invoices: invoiceApi,
  payments: paymentApi,
  journalEntries: journalEntryApi,
  chartOfAccounts: chartOfAccountsApi,
  reports: financialReportsApi,
};

export default financeService;
