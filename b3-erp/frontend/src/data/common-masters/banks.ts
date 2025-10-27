export interface Bank {
  id: string;
  bankCode: string;
  bankName: string;
  branchName: string;
  branchCode: string;

  // Account Details
  accountNumber: string;
  accountType: 'savings' | 'current' | 'cash_credit' | 'overdraft' | 'fixed_deposit';
  accountHolderName: string;
  accountCurrency: string;

  // Bank Identification
  ifscCode: string;
  micrCode?: string;
  swiftCode?: string;
  ibanNumber?: string;

  // Contact Information
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  email: string;
  contactPerson?: string;

  // Balances
  currentBalance: number;
  openingBalance: number;
  availableBalance: number;
  overdraftLimit?: number;
  minimumBalance: number;

  // Transaction Limits
  dailyTransactionLimit?: number;
  singleTransactionLimit?: number;
  monthlyTransactionLimit?: number;

  // Usage & Purpose
  isPrimaryAccount: boolean;
  accountPurpose: 'operations' | 'payroll' | 'tax' | 'vendor_payments' | 'customer_receipts' | 'multi_purpose';
  allowedTransactionTypes: string[];

  // Internet Banking
  internetBankingEnabled: boolean;
  internetBankingId?: string;
  lastLoginDate?: string;

  // Integration
  bankIntegrationEnabled: boolean;
  apiEndpoint?: string;
  lastSyncDate?: string;
  autoReconciliation: boolean;

  // Statistics
  totalDeposits: number;
  totalWithdrawals: number;
  transactionCount: number;
  lastTransactionDate: string;

  // Compliance
  taxDeductionAccount: boolean;
  gstRegistered: boolean;
  gstNumber?: string;

  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export const mockBanks: Bank[] = [
  {
    id: 'BNK001',
    bankCode: 'HDFC-001',
    bankName: 'HDFC Bank',
    branchName: 'Hinjewadi Branch',
    branchCode: 'HDFC0001234',
    accountNumber: '50200012345678',
    accountType: 'current',
    accountHolderName: 'B3 Kitchen Manufacturing Pvt Ltd',
    accountCurrency: 'INR',
    ifscCode: 'HDFC0001234',
    micrCode: '411240002',
    swiftCode: 'HDFCINBB',
    address: 'Hinjewadi Phase 2, IT Park',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411057',
    country: 'India',
    phone: '+91-20-67891234',
    email: 'hinjewadi@hdfcbank.com',
    contactPerson: 'Sunil Patil',
    currentBalance: 12500000,
    openingBalance: 10000000,
    availableBalance: 12500000,
    minimumBalance: 100000,
    dailyTransactionLimit: 5000000,
    singleTransactionLimit: 2000000,
    monthlyTransactionLimit: 50000000,
    isPrimaryAccount: true,
    accountPurpose: 'multi_purpose',
    allowedTransactionTypes: ['payment', 'receipt', 'transfer', 'salary'],
    internetBankingEnabled: true,
    internetBankingId: 'B3KITCH001',
    lastLoginDate: '2025-01-24',
    bankIntegrationEnabled: true,
    apiEndpoint: 'https://api.hdfcbank.com/corporate',
    lastSyncDate: '2025-01-25',
    autoReconciliation: true,
    totalDeposits: 45000000,
    totalWithdrawals: 42500000,
    transactionCount: 1248,
    lastTransactionDate: '2025-01-24',
    taxDeductionAccount: false,
    gstRegistered: true,
    gstNumber: '27AABCB3456K1Z5',
    isActive: true,
    createdBy: 'Admin',
    createdDate: '2024-01-01',
    modifiedBy: 'Rajesh Kumar',
    modifiedDate: '2025-01-20'
  },
  {
    id: 'BNK002',
    bankCode: 'ICICI-001',
    bankName: 'ICICI Bank',
    branchName: 'Pimpri Industrial Area',
    branchCode: 'ICICI0000234',
    accountNumber: '023405000123456',
    accountType: 'cash_credit',
    accountHolderName: 'B3 Kitchen Manufacturing Pvt Ltd',
    accountCurrency: 'INR',
    ifscCode: 'ICIC0000234',
    micrCode: '411229012',
    swiftCode: 'ICICINBB',
    address: 'Pimpri-Chinchwad MIDC',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411018',
    country: 'India',
    phone: '+91-20-67892345',
    email: 'pimpri@icicibank.com',
    contactPerson: 'Neha Kulkarni',
    currentBalance: 8000000,
    openingBalance: 5000000,
    availableBalance: 13000000,
    overdraftLimit: 15000000,
    minimumBalance: 50000,
    dailyTransactionLimit: 10000000,
    singleTransactionLimit: 5000000,
    monthlyTransactionLimit: 100000000,
    isPrimaryAccount: false,
    accountPurpose: 'operations',
    allowedTransactionTypes: ['payment', 'transfer', 'loan'],
    internetBankingEnabled: true,
    internetBankingId: 'B3KITCH002',
    lastLoginDate: '2025-01-23',
    bankIntegrationEnabled: true,
    apiEndpoint: 'https://api.icicibank.com/corp',
    lastSyncDate: '2025-01-24',
    autoReconciliation: true,
    totalDeposits: 28000000,
    totalWithdrawals: 25000000,
    transactionCount: 856,
    lastTransactionDate: '2025-01-23',
    taxDeductionAccount: false,
    gstRegistered: false,
    isActive: true,
    createdBy: 'Admin',
    createdDate: '2024-01-15',
    modifiedBy: 'Priya Desai',
    modifiedDate: '2025-01-18'
  },
  {
    id: 'BNK003',
    bankCode: 'SBI-001',
    bankName: 'State Bank of India',
    branchName: 'Shivajinagar Branch',
    branchCode: 'SBIN0001234',
    accountNumber: '30123456789012',
    accountType: 'current',
    accountHolderName: 'B3 Kitchen Manufacturing Pvt Ltd',
    accountCurrency: 'INR',
    ifscCode: 'SBIN0001234',
    micrCode: '411002012',
    swiftCode: 'SBININBB',
    address: 'Shivajinagar, FC Road',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411005',
    country: 'India',
    phone: '+91-20-25534567',
    email: 'shivajinagar@sbi.co.in',
    contactPerson: 'Anil Joshi',
    currentBalance: 3500000,
    openingBalance: 2000000,
    availableBalance: 3500000,
    minimumBalance: 50000,
    dailyTransactionLimit: 3000000,
    singleTransactionLimit: 1000000,
    monthlyTransactionLimit: 30000000,
    isPrimaryAccount: false,
    accountPurpose: 'vendor_payments',
    allowedTransactionTypes: ['payment', 'transfer'],
    internetBankingEnabled: true,
    internetBankingId: 'B3KITCH003',
    lastLoginDate: '2025-01-22',
    bankIntegrationEnabled: false,
    autoReconciliation: false,
    totalDeposits: 15000000,
    totalWithdrawals: 13500000,
    transactionCount: 542,
    lastTransactionDate: '2025-01-22',
    taxDeductionAccount: false,
    gstRegistered: false,
    isActive: true,
    createdBy: 'Admin',
    createdDate: '2024-02-01',
    modifiedBy: 'Amit Sharma',
    modifiedDate: '2025-01-15'
  },
  {
    id: 'BNK004',
    bankCode: 'AXIS-001',
    bankName: 'Axis Bank',
    branchName: 'Baner Road Branch',
    branchCode: 'AXIS0000567',
    accountNumber: '911010012345678',
    accountType: 'current',
    accountHolderName: 'B3 Kitchen Manufacturing Pvt Ltd - Payroll',
    accountCurrency: 'INR',
    ifscCode: 'UTIB0000567',
    micrCode: '411211015',
    swiftCode: 'AXISINBB',
    address: 'Baner Road, Aundh',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411007',
    country: 'India',
    phone: '+91-20-67893456',
    email: 'baner@axisbank.com',
    contactPerson: 'Kavita Singh',
    currentBalance: 4200000,
    openingBalance: 3000000,
    availableBalance: 4200000,
    minimumBalance: 100000,
    dailyTransactionLimit: 5000000,
    singleTransactionLimit: 500000,
    monthlyTransactionLimit: 20000000,
    isPrimaryAccount: false,
    accountPurpose: 'payroll',
    allowedTransactionTypes: ['salary', 'transfer'],
    internetBankingEnabled: true,
    internetBankingId: 'B3KITCH004',
    lastLoginDate: '2025-01-25',
    bankIntegrationEnabled: true,
    apiEndpoint: 'https://api.axisbank.com/corporate',
    lastSyncDate: '2025-01-25',
    autoReconciliation: true,
    totalDeposits: 18000000,
    totalWithdrawals: 16800000,
    transactionCount: 324,
    lastTransactionDate: '2025-01-25',
    taxDeductionAccount: false,
    gstRegistered: false,
    isActive: true,
    createdBy: 'HR Manager',
    createdDate: '2024-01-10',
    modifiedBy: 'HR Manager',
    modifiedDate: '2025-01-25'
  },
  {
    id: 'BNK005',
    bankCode: 'KOTAK-001',
    bankName: 'Kotak Mahindra Bank',
    branchName: 'Kharadi Branch',
    branchCode: 'KKBK0001234',
    accountNumber: '1911234567890',
    accountType: 'current',
    accountHolderName: 'B3 Kitchen Manufacturing Pvt Ltd',
    accountCurrency: 'INR',
    ifscCode: 'KKBK0001234',
    micrCode: '411485010',
    swiftCode: 'KKBKINBB',
    address: 'Kharadi, EON IT Park',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411014',
    country: 'India',
    phone: '+91-20-67894567',
    email: 'kharadi@kotak.com',
    contactPerson: 'Rahul Mehta',
    currentBalance: 2800000,
    openingBalance: 1500000,
    availableBalance: 2800000,
    minimumBalance: 50000,
    dailyTransactionLimit: 2000000,
    singleTransactionLimit: 1000000,
    monthlyTransactionLimit: 20000000,
    isPrimaryAccount: false,
    accountPurpose: 'customer_receipts',
    allowedTransactionTypes: ['receipt', 'transfer'],
    internetBankingEnabled: true,
    internetBankingId: 'B3KITCH005',
    lastLoginDate: '2025-01-24',
    bankIntegrationEnabled: true,
    apiEndpoint: 'https://api.kotak.com/corp',
    lastSyncDate: '2025-01-24',
    autoReconciliation: true,
    totalDeposits: 12000000,
    totalWithdrawals: 10700000,
    transactionCount: 456,
    lastTransactionDate: '2025-01-24',
    taxDeductionAccount: false,
    gstRegistered: false,
    isActive: true,
    createdBy: 'Finance Manager',
    createdDate: '2024-03-01',
    modifiedBy: 'Finance Manager',
    modifiedDate: '2025-01-22'
  },
  {
    id: 'BNK006',
    bankCode: 'YES-001',
    bankName: 'Yes Bank',
    branchName: 'Viman Nagar Branch',
    branchCode: 'YESB0000123',
    accountNumber: '012345678901234',
    accountType: 'current',
    accountHolderName: 'B3 Kitchen Manufacturing Pvt Ltd - TDS',
    accountCurrency: 'INR',
    ifscCode: 'YESB0000123',
    micrCode: '411532005',
    swiftCode: 'YESBINBB',
    address: 'Viman Nagar, Phoenix Market City',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411014',
    country: 'India',
    phone: '+91-20-67895678',
    email: 'vimannagar@yesbank.in',
    contactPerson: 'Deepak Rao',
    currentBalance: 1200000,
    openingBalance: 500000,
    availableBalance: 1200000,
    minimumBalance: 25000,
    dailyTransactionLimit: 1000000,
    singleTransactionLimit: 500000,
    monthlyTransactionLimit: 10000000,
    isPrimaryAccount: false,
    accountPurpose: 'tax',
    allowedTransactionTypes: ['payment', 'tax'],
    internetBankingEnabled: true,
    internetBankingId: 'B3KITCH006',
    lastLoginDate: '2025-01-20',
    bankIntegrationEnabled: false,
    autoReconciliation: false,
    totalDeposits: 5000000,
    totalWithdrawals: 4300000,
    transactionCount: 124,
    lastTransactionDate: '2025-01-20',
    taxDeductionAccount: true,
    gstRegistered: false,
    isActive: true,
    createdBy: 'Finance Manager',
    createdDate: '2024-04-01',
    modifiedBy: 'Finance Manager',
    modifiedDate: '2025-01-18'
  }
];

export function getBankStats() {
  const activeBanks = mockBanks.filter(b => b.isActive);

  return {
    total: mockBanks.length,
    active: activeBanks.length,
    totalBalance: activeBanks.reduce((sum, b) => sum + b.currentBalance, 0),
    totalAvailableBalance: activeBanks.reduce((sum, b) => sum + b.availableBalance, 0),
    totalDeposits: activeBanks.reduce((sum, b) => sum + b.totalDeposits, 0),
    totalWithdrawals: activeBanks.reduce((sum, b) => sum + b.totalWithdrawals, 0),
    totalTransactions: activeBanks.reduce((sum, b) => sum + b.transactionCount, 0),
    withIntegration: activeBanks.filter(b => b.bankIntegrationEnabled).length,
    withAutoReconciliation: activeBanks.filter(b => b.autoReconciliation).length,
    primaryAccount: activeBanks.find(b => b.isPrimaryAccount),
    accountsByType: {
      current: activeBanks.filter(b => b.accountType === 'current').length,
      savings: activeBanks.filter(b => b.accountType === 'savings').length,
      cash_credit: activeBanks.filter(b => b.accountType === 'cash_credit').length,
      overdraft: activeBanks.filter(b => b.accountType === 'overdraft').length
    }
  };
}

export function getBankByPurpose(purpose: string): Bank | undefined {
  return mockBanks.find(b => b.isActive && b.accountPurpose === purpose);
}

export function getTotalBalanceByPurpose(purpose: string): number {
  return mockBanks
    .filter(b => b.isActive && b.accountPurpose === purpose)
    .reduce((sum, b) => sum + b.currentBalance, 0);
}
