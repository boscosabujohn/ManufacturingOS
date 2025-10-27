export interface Country {
  id: string;
  code: string;
  name: string;
  dialCode: string;
  currency: string;
  currencySymbol: string;
  flag: string;
  continent: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockCountries: Country[] = [
  {
    id: '1',
    code: 'IN',
    name: 'India',
    dialCode: '+91',
    currency: 'INR',
    currencySymbol: '₹',
    flag: '🇮🇳',
    continent: 'Asia',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    code: 'US',
    name: 'United States',
    dialCode: '+1',
    currency: 'USD',
    currencySymbol: '$',
    flag: '🇺🇸',
    continent: 'North America',
    isActive: true,
    createdAt: '2024-01-15T10:31:00Z',
    updatedAt: '2024-01-15T10:31:00Z'
  },
  {
    id: '3',
    code: 'GB',
    name: 'United Kingdom',
    dialCode: '+44',
    currency: 'GBP',
    currencySymbol: '£',
    flag: '🇬🇧',
    continent: 'Europe',
    isActive: true,
    createdAt: '2024-01-15T10:32:00Z',
    updatedAt: '2024-01-15T10:32:00Z'
  },
  {
    id: '4',
    code: 'AE',
    name: 'United Arab Emirates',
    dialCode: '+971',
    currency: 'AED',
    currencySymbol: 'د.إ',
    flag: '🇦🇪',
    continent: 'Asia',
    isActive: true,
    createdAt: '2024-01-15T10:33:00Z',
    updatedAt: '2024-01-15T10:33:00Z'
  },
  {
    id: '5',
    code: 'SG',
    name: 'Singapore',
    dialCode: '+65',
    currency: 'SGD',
    currencySymbol: 'S$',
    flag: '🇸🇬',
    continent: 'Asia',
    isActive: true,
    createdAt: '2024-01-15T10:34:00Z',
    updatedAt: '2024-01-15T10:34:00Z'
  },
  {
    id: '6',
    code: 'AU',
    name: 'Australia',
    dialCode: '+61',
    currency: 'AUD',
    currencySymbol: 'A$',
    flag: '🇦🇺',
    continent: 'Oceania',
    isActive: true,
    createdAt: '2024-01-15T10:35:00Z',
    updatedAt: '2024-01-15T10:35:00Z'
  },
  {
    id: '7',
    code: 'CA',
    name: 'Canada',
    dialCode: '+1',
    currency: 'CAD',
    currencySymbol: 'C$',
    flag: '🇨🇦',
    continent: 'North America',
    isActive: true,
    createdAt: '2024-01-15T10:36:00Z',
    updatedAt: '2024-01-15T10:36:00Z'
  },
  {
    id: '8',
    code: 'DE',
    name: 'Germany',
    dialCode: '+49',
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇩🇪',
    continent: 'Europe',
    isActive: true,
    createdAt: '2024-01-15T10:37:00Z',
    updatedAt: '2024-01-15T10:37:00Z'
  },
  {
    id: '9',
    code: 'FR',
    name: 'France',
    dialCode: '+33',
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇫🇷',
    continent: 'Europe',
    isActive: true,
    createdAt: '2024-01-15T10:38:00Z',
    updatedAt: '2024-01-15T10:38:00Z'
  },
  {
    id: '10',
    code: 'JP',
    name: 'Japan',
    dialCode: '+81',
    currency: 'JPY',
    currencySymbol: '¥',
    flag: '🇯🇵',
    continent: 'Asia',
    isActive: true,
    createdAt: '2024-01-15T10:39:00Z',
    updatedAt: '2024-01-15T10:39:00Z'
  },
  {
    id: '11',
    code: 'CN',
    name: 'China',
    dialCode: '+86',
    currency: 'CNY',
    currencySymbol: '¥',
    flag: '🇨🇳',
    continent: 'Asia',
    isActive: true,
    createdAt: '2024-01-15T10:40:00Z',
    updatedAt: '2024-01-15T10:40:00Z'
  },
  {
    id: '12',
    code: 'BR',
    name: 'Brazil',
    dialCode: '+55',
    currency: 'BRL',
    currencySymbol: 'R$',
    flag: '🇧🇷',
    continent: 'South America',
    isActive: true,
    createdAt: '2024-01-15T10:41:00Z',
    updatedAt: '2024-01-15T10:41:00Z'
  },
  {
    id: '13',
    code: 'SA',
    name: 'Saudi Arabia',
    dialCode: '+966',
    currency: 'SAR',
    currencySymbol: '﷼',
    flag: '🇸🇦',
    continent: 'Asia',
    isActive: true,
    createdAt: '2024-01-15T10:42:00Z',
    updatedAt: '2024-01-15T10:42:00Z'
  },
  {
    id: '14',
    code: 'MY',
    name: 'Malaysia',
    dialCode: '+60',
    currency: 'MYR',
    currencySymbol: 'RM',
    flag: '🇲🇾',
    continent: 'Asia',
    isActive: true,
    createdAt: '2024-01-15T10:43:00Z',
    updatedAt: '2024-01-15T10:43:00Z'
  },
  {
    id: '15',
    code: 'IT',
    name: 'Italy',
    dialCode: '+39',
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇮🇹',
    continent: 'Europe',
    isActive: true,
    createdAt: '2024-01-15T10:44:00Z',
    updatedAt: '2024-01-15T10:44:00Z'
  }
];
