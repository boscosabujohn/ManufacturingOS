'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  ReactNode,
  useCallback,
} from 'react';

// ============================================================================
// Locale Types
// ============================================================================

export type LocaleCode = string; // e.g., 'en-US', 'de-DE', 'ja-JP'

export interface LocaleConfig {
  locale: LocaleCode;
  currency: string;
  timezone: string;
  dateFormat: Intl.DateTimeFormatOptions;
  numberFormat: Intl.NumberFormatOptions;
}

// ============================================================================
// Default Configurations
// ============================================================================

const DEFAULT_CONFIG: LocaleConfig = {
  locale: 'en-US',
  currency: 'USD',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
  numberFormat: {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  },
};

// ============================================================================
// Locale Context
// ============================================================================

interface LocaleContextValue {
  config: LocaleConfig;
  setLocale: (locale: LocaleCode) => void;
  setCurrency: (currency: string) => void;
  setTimezone: (timezone: string) => void;
  // Formatting functions
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatDateTime: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatRelativeTime: (date: Date | string | number) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, currency?: string, options?: Intl.NumberFormatOptions) => string;
  formatPercent: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCompact: (value: number) => string;
  formatUnit: (value: number, unit: string, options?: Intl.NumberFormatOptions) => string;
  formatList: (items: string[], type?: 'conjunction' | 'disjunction' | 'unit') => string;
  formatPlural: (count: number, singular: string, plural: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

// ============================================================================
// Locale Provider
// ============================================================================

export interface LocaleProviderProps {
  children: ReactNode;
  defaultLocale?: LocaleCode;
  defaultCurrency?: string;
  defaultTimezone?: string;
  onLocaleChange?: (locale: LocaleCode) => void;
}

export function LocaleProvider({
  children,
  defaultLocale = DEFAULT_CONFIG.locale,
  defaultCurrency = DEFAULT_CONFIG.currency,
  defaultTimezone = DEFAULT_CONFIG.timezone,
  onLocaleChange,
}: LocaleProviderProps) {
  const [config, setConfig] = React.useState<LocaleConfig>({
    ...DEFAULT_CONFIG,
    locale: defaultLocale,
    currency: defaultCurrency,
    timezone: defaultTimezone,
  });

  const setLocale = useCallback((locale: LocaleCode) => {
    setConfig(prev => ({ ...prev, locale }));
    onLocaleChange?.(locale);
  }, [onLocaleChange]);

  const setCurrency = useCallback((currency: string) => {
    setConfig(prev => ({ ...prev, currency }));
  }, []);

  const setTimezone = useCallback((timezone: string) => {
    setConfig(prev => ({ ...prev, timezone }));
  }, []);

  // Date formatting
  const formatDate = useCallback(
    (date: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
      const d = new Date(date);
      return new Intl.DateTimeFormat(config.locale, {
        ...config.dateFormat,
        ...options,
        timeZone: config.timezone,
      }).format(d);
    },
    [config.locale, config.dateFormat, config.timezone]
  );

  const formatTime = useCallback(
    (date: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
      const d = new Date(date);
      return new Intl.DateTimeFormat(config.locale, {
        hour: 'numeric',
        minute: 'numeric',
        ...options,
        timeZone: config.timezone,
      }).format(d);
    },
    [config.locale, config.timezone]
  );

  const formatDateTime = useCallback(
    (date: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
      const d = new Date(date);
      return new Intl.DateTimeFormat(config.locale, {
        ...config.dateFormat,
        hour: 'numeric',
        minute: 'numeric',
        ...options,
        timeZone: config.timezone,
      }).format(d);
    },
    [config.locale, config.dateFormat, config.timezone]
  );

  const formatRelativeTime = useCallback(
    (date: Date | string | number): string => {
      const d = new Date(date);
      const now = new Date();
      const diffInSeconds = Math.floor((d.getTime() - now.getTime()) / 1000);
      const rtf = new Intl.RelativeTimeFormat(config.locale, { numeric: 'auto' });

      const units: Array<{ unit: Intl.RelativeTimeFormatUnit; seconds: number }> = [
        { unit: 'year', seconds: 31536000 },
        { unit: 'month', seconds: 2592000 },
        { unit: 'week', seconds: 604800 },
        { unit: 'day', seconds: 86400 },
        { unit: 'hour', seconds: 3600 },
        { unit: 'minute', seconds: 60 },
        { unit: 'second', seconds: 1 },
      ];

      for (const { unit, seconds } of units) {
        if (Math.abs(diffInSeconds) >= seconds || unit === 'second') {
          const value = Math.round(diffInSeconds / seconds);
          return rtf.format(value, unit);
        }
      }

      return rtf.format(0, 'second');
    },
    [config.locale]
  );

  // Number formatting
  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions): string => {
      return new Intl.NumberFormat(config.locale, {
        ...config.numberFormat,
        ...options,
      }).format(value);
    },
    [config.locale, config.numberFormat]
  );

  const formatCurrency = useCallback(
    (value: number, currency?: string, options?: Intl.NumberFormatOptions): string => {
      return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: currency || config.currency,
        ...options,
      }).format(value);
    },
    [config.locale, config.currency]
  );

  const formatPercent = useCallback(
    (value: number, options?: Intl.NumberFormatOptions): string => {
      return new Intl.NumberFormat(config.locale, {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
        ...options,
      }).format(value);
    },
    [config.locale]
  );

  const formatCompact = useCallback(
    (value: number): string => {
      return new Intl.NumberFormat(config.locale, {
        notation: 'compact',
        compactDisplay: 'short',
      }).format(value);
    },
    [config.locale]
  );

  const formatUnit = useCallback(
    (value: number, unit: string, options?: Intl.NumberFormatOptions): string => {
      try {
        return new Intl.NumberFormat(config.locale, {
          style: 'unit',
          unit,
          unitDisplay: 'short',
          ...options,
        }).format(value);
      } catch {
        // Fallback for unsupported units
        return `${formatNumber(value)} ${unit}`;
      }
    },
    [config.locale, formatNumber]
  );

  // List formatting
  const formatList = useCallback(
    (items: string[], type: 'conjunction' | 'disjunction' | 'unit' = 'conjunction'): string => {
      return new Intl.ListFormat(config.locale, { style: 'long', type }).format(items);
    },
    [config.locale]
  );

  // Plural formatting
  const formatPlural = useCallback(
    (count: number, singular: string, plural: string): string => {
      const rules = new Intl.PluralRules(config.locale);
      const rule = rules.select(count);
      return rule === 'one' ? singular : plural;
    },
    [config.locale]
  );

  const value = useMemo(
    () => ({
      config,
      setLocale,
      setCurrency,
      setTimezone,
      formatDate,
      formatTime,
      formatDateTime,
      formatRelativeTime,
      formatNumber,
      formatCurrency,
      formatPercent,
      formatCompact,
      formatUnit,
      formatList,
      formatPlural,
    }),
    [
      config,
      setLocale,
      setCurrency,
      setTimezone,
      formatDate,
      formatTime,
      formatDateTime,
      formatRelativeTime,
      formatNumber,
      formatCurrency,
      formatPercent,
      formatCompact,
      formatUnit,
      formatList,
      formatPlural,
    ]
  );

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

// ============================================================================
// useLocale Hook
// ============================================================================

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

// ============================================================================
// Formatted Date Component
// ============================================================================

export interface FormattedDateProps {
  value: Date | string | number;
  format?: 'date' | 'time' | 'datetime' | 'relative';
  options?: Intl.DateTimeFormatOptions;
  className?: string;
}

export function FormattedDate({
  value,
  format = 'date',
  options,
  className = '',
}: FormattedDateProps) {
  const { formatDate, formatTime, formatDateTime, formatRelativeTime } = useLocale();

  const formatted = useMemo(() => {
    switch (format) {
      case 'time':
        return formatTime(value, options);
      case 'datetime':
        return formatDateTime(value, options);
      case 'relative':
        return formatRelativeTime(value);
      default:
        return formatDate(value, options);
    }
  }, [value, format, options, formatDate, formatTime, formatDateTime, formatRelativeTime]);

  return (
    <time
      dateTime={new Date(value).toISOString()}
      className={className}
      title={formatDateTime(value)}
    >
      {formatted}
    </time>
  );
}

// ============================================================================
// Formatted Number Component
// ============================================================================

export interface FormattedNumberProps {
  value: number;
  format?: 'number' | 'currency' | 'percent' | 'compact' | 'unit';
  currency?: string;
  unit?: string;
  options?: Intl.NumberFormatOptions;
  className?: string;
}

export function FormattedNumber({
  value,
  format = 'number',
  currency,
  unit,
  options,
  className = '',
}: FormattedNumberProps) {
  const { formatNumber, formatCurrency, formatPercent, formatCompact, formatUnit } = useLocale();

  const formatted = useMemo(() => {
    switch (format) {
      case 'currency':
        return formatCurrency(value, currency, options);
      case 'percent':
        return formatPercent(value, options);
      case 'compact':
        return formatCompact(value);
      case 'unit':
        return formatUnit(value, unit || 'meter', options);
      default:
        return formatNumber(value, options);
    }
  }, [value, format, currency, unit, options, formatNumber, formatCurrency, formatPercent, formatCompact, formatUnit]);

  return <span className={className}>{formatted}</span>;
}

// ============================================================================
// Currency Display Component
// ============================================================================

export interface CurrencyDisplayProps {
  value: number;
  currency?: string;
  showSymbol?: boolean;
  showCode?: boolean;
  compact?: boolean;
  className?: string;
}

export function CurrencyDisplay({
  value,
  currency,
  showSymbol = true,
  showCode = false,
  compact = false,
  className = '',
}: CurrencyDisplayProps) {
  const { config, formatCurrency, formatCompact } = useLocale();
  const currencyCode = currency || config.currency;

  const formatted = useMemo(() => {
    if (compact) {
      const compactValue = formatCompact(value);
      if (showCode) {
        return `${compactValue} ${currencyCode}`;
      }
      return compactValue;
    }

    return formatCurrency(value, currencyCode, {
      currencyDisplay: showSymbol ? 'symbol' : showCode ? 'code' : 'narrowSymbol',
    });
  }, [value, currencyCode, compact, showSymbol, showCode, formatCurrency, formatCompact]);

  return <span className={className}>{formatted}</span>;
}

// ============================================================================
// Date Range Display
// ============================================================================

export interface DateRangeProps {
  start: Date | string | number;
  end: Date | string | number;
  options?: Intl.DateTimeFormatOptions;
  className?: string;
}

export function DateRange({
  start,
  end,
  options,
  className = '',
}: DateRangeProps) {
  const { config } = useLocale();

  const formatted = useMemo(() => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    try {
      // Use DateTimeFormat range if supported
      const formatter = new Intl.DateTimeFormat(config.locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options,
      });

      if ('formatRange' in formatter) {
        return (formatter as Intl.DateTimeFormat & { formatRange: (start: Date, end: Date) => string }).formatRange(startDate, endDate);
      }
    } catch {
      // Fallback
    }

    // Fallback formatting
    const formatter = new Intl.DateTimeFormat(config.locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    });
    return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
  }, [start, end, config.locale, options]);

  return <span className={className}>{formatted}</span>;
}

// ============================================================================
// Relative Time Component (Auto-updating)
// ============================================================================

export interface RelativeTimeProps {
  value: Date | string | number;
  updateInterval?: number;
  className?: string;
}

export function RelativeTime({
  value,
  updateInterval = 60000, // Update every minute
  className = '',
}: RelativeTimeProps) {
  const { formatRelativeTime, formatDateTime } = useLocale();
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  React.useEffect(() => {
    const interval = setInterval(forceUpdate, updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval]);

  return (
    <time
      dateTime={new Date(value).toISOString()}
      className={className}
      title={formatDateTime(value)}
    >
      {formatRelativeTime(value)}
    </time>
  );
}

// ============================================================================
// Number Input with Locale Formatting
// ============================================================================

export interface LocaleNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  allowNegative?: boolean;
  className?: string;
}

export function LocaleNumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  allowNegative = false,
  className = '',
}: LocaleNumberInputProps) {
  const { formatNumber, config } = useLocale();
  const [inputValue, setInputValue] = React.useState(formatNumber(value));
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    if (!isFocused) {
      setInputValue(formatNumber(value));
    }
  }, [value, isFocused, formatNumber]);

  const parseValue = (str: string): number => {
    // Remove grouping separators and normalize decimal
    const normalized = str
      .replace(new RegExp(`[^0-9${allowNegative ? '-' : ''}.,]`, 'g'), '')
      .replace(/,/g, '.');

    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    setIsFocused(false);
    let newValue = parseValue(inputValue);

    if (min !== undefined) newValue = Math.max(min, newValue);
    if (max !== undefined) newValue = Math.min(max, newValue);

    onChange(newValue);
    setInputValue(formatNumber(newValue));
  };

  return (
    <div className={`relative ${className}`}>
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          {prefix}
        </span>
      )}
      <input
        type="text"
        inputMode="decimal"
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className={`
          w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
          bg-white dark:bg-gray-800
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${prefix ? 'pl-8' : ''}
          ${suffix ? 'pr-8' : ''}
        `}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          {suffix}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// Currency Selector
// ============================================================================

export const COMMON_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
];

export interface CurrencySelectorProps {
  value?: string;
  onChange?: (currency: string) => void;
  currencies?: typeof COMMON_CURRENCIES;
  showSymbol?: boolean;
  disabled?: boolean;
  className?: string;
}

export function CurrencySelector({
  value,
  onChange,
  currencies = COMMON_CURRENCIES,
  showSymbol = true,
  disabled = false,
  className = '',
}: CurrencySelectorProps) {
  const { config, setCurrency } = useLocale();
  const selectedCurrency = value || config.currency;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value;
    onChange?.(newCurrency);
    setCurrency(newCurrency);
  };

  return (
    <select
      value={selectedCurrency}
      onChange={handleChange}
      disabled={disabled}
      className={`
        px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
        bg-white dark:bg-gray-800
        focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {currencies.map((curr) => (
        <option key={curr.code} value={curr.code}>
          {showSymbol ? `${curr.symbol} ` : ''}{curr.code} - {curr.name}
        </option>
      ))}
    </select>
  );
}

// ============================================================================
// Timezone Selector
// ============================================================================

export const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Vancouver',
  'America/Mexico_City',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Asia/Dubai',
  'Asia/Mumbai',
  'Asia/Singapore',
  'Asia/Hong_Kong',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Australia/Sydney',
  'Pacific/Auckland',
];

export interface TimezoneSelectorProps {
  value?: string;
  onChange?: (timezone: string) => void;
  timezones?: string[];
  showOffset?: boolean;
  disabled?: boolean;
  className?: string;
}

export function TimezoneSelector({
  value,
  onChange,
  timezones = COMMON_TIMEZONES,
  showOffset = true,
  disabled = false,
  className = '',
}: TimezoneSelectorProps) {
  const { config, setTimezone } = useLocale();
  const selectedTimezone = value || config.timezone;

  const getTimezoneOffset = (tz: string): string => {
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        timeZoneName: 'shortOffset',
      });
      const parts = formatter.formatToParts(now);
      const offset = parts.find(p => p.type === 'timeZoneName')?.value || '';
      return offset;
    } catch {
      return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimezone = e.target.value;
    onChange?.(newTimezone);
    setTimezone(newTimezone);
  };

  return (
    <select
      value={selectedTimezone}
      onChange={handleChange}
      disabled={disabled}
      className={`
        px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
        bg-white dark:bg-gray-800
        focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {timezones.map((tz) => (
        <option key={tz} value={tz}>
          {tz.replace(/_/g, ' ')}
          {showOffset && ` (${getTimezoneOffset(tz)})`}
        </option>
      ))}
    </select>
  );
}

