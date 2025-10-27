export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  symbolNative: string;
  decimalDigits: number;
  rounding: number;
  namePlural: string;
  isActive: boolean;
  isBaseCurrency: boolean;
  countries: string[];
  createdAt: string;
  updatedAt: string;
}

export const mockCurrencies: Currency[] = [
  {
    id: '1',
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    symbolNative: '₹',
    decimalDigits: 2,
    rounding: 0,
    namePlural: 'Indian rupees',
    isActive: true,
    isBaseCurrency: true,
    countries: ['India'],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    symbolNative: '$',
    decimalDigits: 2,
    rounding: 0,
    namePlural: 'US dollars',
    isActive: true,
    isBaseCurrency: false,
    countries: ['United States', 'Ecuador', 'El Salvador'],
    createdAt: '2024-01-15T10:31:00Z',
    updatedAt: '2024-01-15T10:31:00Z'
  },
  {
    id: '3',
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    symbolNative: '€',
    decimalDigits: 2,
    rounding: 0,
    namePlural: 'euros',
    isActive: true,
    isBaseCurrency: false,
    countries: ['Germany', 'France', 'Italy', 'Spain'],
    createdAt: '2024-01-15T10:32:00Z',
    updatedAt: '2024-01-15T10:32:00Z'
  },
  {
    id: '4',
    code: 'GBP',
    name: 'British Pound Sterling',
    symbol: '£',
    symbolNative: '£',
    decimalDigits: 2,
    rounding: 0,
    namePlural: 'British pounds sterling',
    isActive: true,
    isBaseCurrency: false,
    countries: ['United Kingdom'],
    createdAt: '2024-01-15T10:33:00Z',
    updatedAt: '2024-01-15T10:33:00Z'
  },
  {
    id: '5',
    code: 'AED',
    name: 'United Arab Emirates Dirham',
    symbol: 'AED',
    symbolNative: 'د.إ',
    decimalDigits: 2,
    rounding: 0,
    namePlural: 'UAE dirhams',
    isActive: true,
    isBaseCurrency: false,
    countries: ['United Arab Emirates'],
    createdAt: '2024-01-15T10:34:00Z',
    updatedAt: '2024-01-15T10:34:00Z'
  },
  {
    id: '6',
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    symbolNative: '$',
    decimalDigits: 2,
    rounding: 0,
    namePlural: 'Singapore dollars',
    isActive: true,
    isBaseCurrency: false,
    countries: ['Singapore'],
    createdAt: '2024-01-15T10:35:00Z',
    updatedAt: '2024-01-15T10:35:00Z'
  },
  {
    id: '7',
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    symbolNative: '¥',
    decimalDigits: 0,
    rounding: 0,
    namePlural: 'Japanese yen',
    isActive: true,
    isBaseCurrency: false,
    countries: ['Japan'],
    createdAt: '2024-01-15T10:36:00Z',
    updatedAt: '2024-01-15T10:36:00Z'
  },
  {
    id: '8',
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: 'CN¥',
    symbolNative: '¥',
    decimalDigits: 2,
    rounding: 0,
    namePlural: 'Chinese yuan',
    isActive: true,
    isBaseCurrency: false,
    countries: ['China'],
    createdAt: '2024-01-15T10:37:00Z',
    updatedAt: '2024-01-15T10:37:00Z'
  },
  {
    id: '9',
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'AU$',
    symbolNative: '$',
    decimalDigits: 2,
    rounding: 0,
    namePlural: 'Australian dollars',
    isActive: true,
    isBaseCurrency: false,
    countries: ['Australia'],
    createdAt: '2024-01-15T10:38:00Z',
    updatedAt: '2024-01-15T10:38:00Z'
  },
  {
    id: '10',
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'CA$',
    symbolNative: '$',
    decimalDigits: 2,
    rounding: 0,
    namePlural: 'Canadian dollars',
    isActive: true,
    isBaseCurrency: false,
    countries: ['Canada'],
    createdAt: '2024-01-15T10:39:00Z',
    updatedAt: '2024-01-15T10:39:00Z'
  },
  {
    id: '11',
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: 'SR',
    symbolNative: '﷼',
    decimalDigits: 2,
    rounding: 0,
    namePlural: 'Saudi riyals',
    isActive: true,
    isBaseCurrency: false,
    countries: ['Saudi Arabia'],
    createdAt: '2024-01-15T10:40:00Z',
    updatedAt: '2024-01-15T10:40:00Z'
  },
  {
    id: '12',
    code: 'MYR',
    name: 'Malaysian Ringgit',
    symbol: 'RM',
    symbolNative: 'RM',
    decimalDigits: 2,
    rounding: 0,
    namePlural: 'Malaysian ringgits',
    isActive: true,
    isBaseCurrency: false,
    countries: ['Malaysia'],
    createdAt: '2024-01-15T10:41:00Z',
    updatedAt: '2024-01-15T10:41:00Z'
  },
  {
    id: '13',
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    symbolNative: 'R$',
    decimalDigits: 2,
    rounding: 0,
    namePlural: 'Brazilian reals',
    isActive: true,
    isBaseCurrency: false,
    countries: ['Brazil'],
    createdAt: '2024-01-15T10:42:00Z',
    updatedAt: '2024-01-15T10:42:00Z'
  },
  {
    id: '14',
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    symbolNative: 'CHF',
    decimalDigits: 2,
    rounding: 0.05,
    namePlural: 'Swiss francs',
    isActive: true,
    isBaseCurrency: false,
    countries: ['Switzerland', 'Liechtenstein'],
    createdAt: '2024-01-15T10:43:00Z',
    updatedAt: '2024-01-15T10:43:00Z'
  },
  {
    id: '15',
    code: 'KRW',
    name: 'South Korean Won',
    symbol: '₩',
    symbolNative: '₩',
    decimalDigits: 0,
    rounding: 0,
    namePlural: 'South Korean won',
    isActive: true,
    isBaseCurrency: false,
    countries: ['South Korea'],
    createdAt: '2024-01-15T10:44:00Z',
    updatedAt: '2024-01-15T10:44:00Z'
  }
];
