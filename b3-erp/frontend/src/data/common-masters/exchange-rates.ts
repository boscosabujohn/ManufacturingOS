export interface ExchangeRate {
  id: string;
  fromCurrency: string;
  fromCurrencyCode: string;
  fromCurrencySymbol: string;
  toCurrency: string;
  toCurrencyCode: string;
  toCurrencySymbol: string;

  // Rate Information
  exchangeRate: number;
  inverseRate: number;

  // Effective Period
  effectiveFrom: string;
  effectiveTo: string | null;

  // Source & Update
  source: 'manual' | 'rbi' | 'forex_api' | 'bank' | 'system';
  lastUpdated: string;
  lastUpdatedBy: string;
  autoUpdate: boolean;
  updateFrequency?: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';

  // Additional Information
  buyRate?: number;
  sellRate?: number;
  midRate?: number;
  spreadPercentage?: number;

  // Usage Statistics
  transactionsCount: number;
  totalAmountConverted: number;
  lastUsedDate: string;

  // Validation
  minRate?: number;
  maxRate?: number;
  tolerancePercentage?: number;

  isActive: boolean;
  isPrimary: boolean; // Primary rate for the currency pair
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export const mockExchangeRates: ExchangeRate[] = [
  {
    id: 'EX001',
    fromCurrency: 'US Dollar',
    fromCurrencyCode: 'USD',
    fromCurrencySymbol: '$',
    toCurrency: 'Indian Rupee',
    toCurrencyCode: 'INR',
    toCurrencySymbol: '₹',
    exchangeRate: 83.25,
    inverseRate: 0.012012,
    effectiveFrom: '2025-01-20',
    effectiveTo: null,
    source: 'rbi',
    lastUpdated: '2025-01-25T09:00:00',
    lastUpdatedBy: 'Auto System',
    autoUpdate: true,
    updateFrequency: 'daily',
    buyRate: 83.10,
    sellRate: 83.40,
    midRate: 83.25,
    spreadPercentage: 0.36,
    transactionsCount: 245,
    totalAmountConverted: 2500000,
    lastUsedDate: '2025-01-24',
    minRate: 80.00,
    maxRate: 90.00,
    tolerancePercentage: 5.0,
    isActive: true,
    isPrimary: true,
    createdBy: 'System',
    createdDate: '2024-01-01',
    modifiedBy: 'Auto System',
    modifiedDate: '2025-01-25'
  },
  {
    id: 'EX002',
    fromCurrency: 'Euro',
    fromCurrencyCode: 'EUR',
    fromCurrencySymbol: '€',
    toCurrency: 'Indian Rupee',
    toCurrencyCode: 'INR',
    toCurrencySymbol: '₹',
    exchangeRate: 90.50,
    inverseRate: 0.011050,
    effectiveFrom: '2025-01-20',
    effectiveTo: null,
    source: 'rbi',
    lastUpdated: '2025-01-25T09:00:00',
    lastUpdatedBy: 'Auto System',
    autoUpdate: true,
    updateFrequency: 'daily',
    buyRate: 90.30,
    sellRate: 90.70,
    midRate: 90.50,
    spreadPercentage: 0.44,
    transactionsCount: 128,
    totalAmountConverted: 1500000,
    lastUsedDate: '2025-01-23',
    minRate: 85.00,
    maxRate: 95.00,
    tolerancePercentage: 5.0,
    isActive: true,
    isPrimary: true,
    createdBy: 'System',
    createdDate: '2024-01-01',
    modifiedBy: 'Auto System',
    modifiedDate: '2025-01-25'
  },
  {
    id: 'EX003',
    fromCurrency: 'British Pound',
    fromCurrencyCode: 'GBP',
    fromCurrencySymbol: '£',
    toCurrency: 'Indian Rupee',
    toCurrencyCode: 'INR',
    toCurrencySymbol: '₹',
    exchangeRate: 105.75,
    inverseRate: 0.009456,
    effectiveFrom: '2025-01-20',
    effectiveTo: null,
    source: 'rbi',
    lastUpdated: '2025-01-25T09:00:00',
    lastUpdatedBy: 'Auto System',
    autoUpdate: true,
    updateFrequency: 'daily',
    buyRate: 105.50,
    sellRate: 106.00,
    midRate: 105.75,
    spreadPercentage: 0.47,
    transactionsCount: 64,
    totalAmountConverted: 850000,
    lastUsedDate: '2025-01-22',
    minRate: 100.00,
    maxRate: 110.00,
    tolerancePercentage: 5.0,
    isActive: true,
    isPrimary: true,
    createdBy: 'System',
    createdDate: '2024-01-01',
    modifiedBy: 'Auto System',
    modifiedDate: '2025-01-25'
  },
  {
    id: 'EX004',
    fromCurrency: 'Singapore Dollar',
    fromCurrencyCode: 'SGD',
    fromCurrencySymbol: 'S$',
    toCurrency: 'Indian Rupee',
    toCurrencyCode: 'INR',
    toCurrencySymbol: '₹',
    exchangeRate: 62.40,
    inverseRate: 0.016026,
    effectiveFrom: '2025-01-20',
    effectiveTo: null,
    source: 'forex_api',
    lastUpdated: '2025-01-25T09:15:00',
    lastUpdatedBy: 'Auto System',
    autoUpdate: true,
    updateFrequency: 'daily',
    buyRate: 62.25,
    sellRate: 62.55,
    midRate: 62.40,
    spreadPercentage: 0.48,
    transactionsCount: 42,
    totalAmountConverted: 620000,
    lastUsedDate: '2025-01-21',
    minRate: 58.00,
    maxRate: 68.00,
    tolerancePercentage: 5.0,
    isActive: true,
    isPrimary: true,
    createdBy: 'System',
    createdDate: '2024-01-01',
    modifiedBy: 'Auto System',
    modifiedDate: '2025-01-25'
  },
  {
    id: 'EX005',
    fromCurrency: 'UAE Dirham',
    fromCurrencyCode: 'AED',
    fromCurrencySymbol: 'د.إ',
    toCurrency: 'Indian Rupee',
    toCurrencyCode: 'INR',
    toCurrencySymbol: '₹',
    exchangeRate: 22.65,
    inverseRate: 0.044150,
    effectiveFrom: '2025-01-20',
    effectiveTo: null,
    source: 'forex_api',
    lastUpdated: '2025-01-25T09:15:00',
    lastUpdatedBy: 'Auto System',
    autoUpdate: true,
    updateFrequency: 'daily',
    buyRate: 22.55,
    sellRate: 22.75,
    midRate: 22.65,
    spreadPercentage: 0.88,
    transactionsCount: 156,
    totalAmountConverted: 1200000,
    lastUsedDate: '2025-01-24',
    minRate: 20.00,
    maxRate: 25.00,
    tolerancePercentage: 5.0,
    isActive: true,
    isPrimary: true,
    createdBy: 'System',
    createdDate: '2024-01-01',
    modifiedBy: 'Auto System',
    modifiedDate: '2025-01-25'
  },
  {
    id: 'EX006',
    fromCurrency: 'Japanese Yen',
    fromCurrencyCode: 'JPY',
    fromCurrencySymbol: '¥',
    toCurrency: 'Indian Rupee',
    toCurrencyCode: 'INR',
    toCurrencySymbol: '₹',
    exchangeRate: 0.56,
    inverseRate: 1.785714,
    effectiveFrom: '2025-01-20',
    effectiveTo: null,
    source: 'forex_api',
    lastUpdated: '2025-01-25T09:15:00',
    lastUpdatedBy: 'Auto System',
    autoUpdate: true,
    updateFrequency: 'daily',
    buyRate: 0.555,
    sellRate: 0.565,
    midRate: 0.56,
    spreadPercentage: 1.79,
    transactionsCount: 28,
    totalAmountConverted: 420000,
    lastUsedDate: '2025-01-18',
    minRate: 0.50,
    maxRate: 0.65,
    tolerancePercentage: 10.0,
    isActive: true,
    isPrimary: true,
    createdBy: 'System',
    createdDate: '2024-01-01',
    modifiedBy: 'Auto System',
    modifiedDate: '2025-01-25'
  },
  {
    id: 'EX007',
    fromCurrency: 'Chinese Yuan',
    fromCurrencyCode: 'CNY',
    fromCurrencySymbol: '¥',
    toCurrency: 'Indian Rupee',
    toCurrencyCode: 'INR',
    toCurrencySymbol: '₹',
    exchangeRate: 11.48,
    inverseRate: 0.087108,
    effectiveFrom: '2025-01-20',
    effectiveTo: null,
    source: 'forex_api',
    lastUpdated: '2025-01-25T09:15:00',
    lastUpdatedBy: 'Auto System',
    autoUpdate: true,
    updateFrequency: 'daily',
    buyRate: 11.42,
    sellRate: 11.54,
    midRate: 11.48,
    spreadPercentage: 1.05,
    transactionsCount: 92,
    totalAmountConverted: 980000,
    lastUsedDate: '2025-01-23',
    minRate: 10.50,
    maxRate: 13.00,
    tolerancePercentage: 5.0,
    isActive: true,
    isPrimary: true,
    createdBy: 'System',
    createdDate: '2024-01-01',
    modifiedBy: 'Auto System',
    modifiedDate: '2025-01-25'
  },
  {
    id: 'EX008',
    fromCurrency: 'Swiss Franc',
    fromCurrencyCode: 'CHF',
    fromCurrencySymbol: 'Fr',
    toCurrency: 'Indian Rupee',
    toCurrencyCode: 'INR',
    toCurrencySymbol: '₹',
    exchangeRate: 96.20,
    inverseRate: 0.010395,
    effectiveFrom: '2025-01-20',
    effectiveTo: null,
    source: 'forex_api',
    lastUpdated: '2025-01-25T09:15:00',
    lastUpdatedBy: 'Auto System',
    autoUpdate: true,
    updateFrequency: 'daily',
    buyRate: 96.00,
    sellRate: 96.40,
    midRate: 96.20,
    spreadPercentage: 0.42,
    transactionsCount: 18,
    totalAmountConverted: 320000,
    lastUsedDate: '2025-01-15',
    minRate: 90.00,
    maxRate: 105.00,
    tolerancePercentage: 5.0,
    isActive: true,
    isPrimary: true,
    createdBy: 'System',
    createdDate: '2024-01-01',
    modifiedBy: 'Auto System',
    modifiedDate: '2025-01-25'
  },
  // Manual/Custom Rates
  {
    id: 'EX009',
    fromCurrency: 'US Dollar',
    fromCurrencyCode: 'USD',
    fromCurrencySymbol: '$',
    toCurrency: 'Indian Rupee',
    toCurrencyCode: 'INR',
    toCurrencySymbol: '₹',
    exchangeRate: 84.00,
    inverseRate: 0.011905,
    effectiveFrom: '2025-01-01',
    effectiveTo: '2025-01-19',
    source: 'manual',
    lastUpdated: '2025-01-01T10:00:00',
    lastUpdatedBy: 'Rajesh Kumar',
    autoUpdate: false,
    transactionsCount: 89,
    totalAmountConverted: 950000,
    lastUsedDate: '2025-01-18',
    isActive: false,
    isPrimary: false,
    createdBy: 'Rajesh Kumar',
    createdDate: '2025-01-01',
    modifiedBy: 'Rajesh Kumar',
    modifiedDate: '2025-01-01'
  },
  {
    id: 'EX010',
    fromCurrency: 'Australian Dollar',
    fromCurrencyCode: 'AUD',
    fromCurrencySymbol: 'A$',
    toCurrency: 'Indian Rupee',
    toCurrencyCode: 'INR',
    toCurrencySymbol: '₹',
    exchangeRate: 54.80,
    inverseRate: 0.018248,
    effectiveFrom: '2025-01-20',
    effectiveTo: null,
    source: 'forex_api',
    lastUpdated: '2025-01-25T09:15:00',
    lastUpdatedBy: 'Auto System',
    autoUpdate: true,
    updateFrequency: 'daily',
    buyRate: 54.65,
    sellRate: 54.95,
    midRate: 54.80,
    spreadPercentage: 0.55,
    transactionsCount: 24,
    totalAmountConverted: 380000,
    lastUsedDate: '2025-01-20',
    minRate: 50.00,
    maxRate: 60.00,
    tolerancePercentage: 5.0,
    isActive: true,
    isPrimary: true,
    createdBy: 'System',
    createdDate: '2024-01-01',
    modifiedBy: 'Auto System',
    modifiedDate: '2025-01-25'
  }
];

export function getExchangeRateStats() {
  const activeRates = mockExchangeRates.filter(r => r.isActive);
  const primaryRates = mockExchangeRates.filter(r => r.isPrimary && r.isActive);

  return {
    total: mockExchangeRates.length,
    active: activeRates.length,
    primaryRates: primaryRates.length,
    autoUpdate: activeRates.filter(r => r.autoUpdate).length,
    manualUpdate: activeRates.filter(r => !r.autoUpdate).length,
    totalTransactions: mockExchangeRates.reduce((sum, r) => sum + r.transactionsCount, 0),
    totalAmountConverted: mockExchangeRates.reduce((sum, r) => sum + r.totalAmountConverted, 0),
    uniqueCurrencies: new Set([
      ...mockExchangeRates.map(r => r.fromCurrencyCode),
      ...mockExchangeRates.map(r => r.toCurrencyCode)
    ]).size,
    currencyPairs: new Set(
      mockExchangeRates.map(r => `${r.fromCurrencyCode}-${r.toCurrencyCode}`)
    ).size,
    lastUpdateTime: mockExchangeRates
      .filter(r => r.isActive)
      .reduce((latest, r) => {
        const rateTime = new Date(r.lastUpdated).getTime();
        return rateTime > latest ? rateTime : latest;
      }, 0)
  };
}

export function getCurrentRate(fromCurrency: string, toCurrency: string): ExchangeRate | undefined {
  return mockExchangeRates.find(
    r =>
      r.isActive &&
      r.isPrimary &&
      r.fromCurrencyCode === fromCurrency &&
      r.toCurrencyCode === toCurrency &&
      (!r.effectiveTo || new Date(r.effectiveTo) >= new Date())
  );
}

export function convertAmount(amount: number, fromCurrency: string, toCurrency: string): number | null {
  const rate = getCurrentRate(fromCurrency, toCurrency);
  if (!rate) return null;
  return amount * rate.exchangeRate;
}

export function getRateHistory(fromCurrency: string, toCurrency: string): ExchangeRate[] {
  return mockExchangeRates
    .filter(r => r.fromCurrencyCode === fromCurrency && r.toCurrencyCode === toCurrency)
    .sort((a, b) => new Date(b.effectiveFrom).getTime() - new Date(a.effectiveFrom).getTime());
}
