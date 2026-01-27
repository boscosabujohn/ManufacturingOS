'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
  useMemo,
} from 'react';

// ============================================================================
// Language Types and Constants
// ============================================================================

export type LanguageCode =
  | 'en' | 'en-US' | 'en-GB'  // English
  | 'es' | 'es-ES' | 'es-MX'  // Spanish
  | 'fr' | 'fr-FR' | 'fr-CA'  // French
  | 'de' | 'de-DE'            // German
  | 'it' | 'it-IT'            // Italian
  | 'pt' | 'pt-BR' | 'pt-PT'  // Portuguese
  | 'zh' | 'zh-CN' | 'zh-TW'  // Chinese
  | 'ja' | 'ja-JP'            // Japanese
  | 'ko' | 'ko-KR'            // Korean
  | 'ar' | 'ar-SA'            // Arabic
  | 'he' | 'he-IL'            // Hebrew
  | 'hi' | 'hi-IN'            // Hindi
  | 'ru' | 'ru-RU'            // Russian
  | 'nl' | 'nl-NL'            // Dutch
  | 'pl' | 'pl-PL'            // Polish
  | 'tr' | 'tr-TR'            // Turkish
  | 'th' | 'th-TH'            // Thai
  | 'vi' | 'vi-VN';           // Vietnamese

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
  dateFormat: string;
  numberFormat: {
    decimal: string;
    thousands: string;
  };
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false,
    dateFormat: 'MM/DD/YYYY',
    numberFormat: { decimal: '.', thousands: ',' },
  },
  {
    code: 'en-GB',
    name: 'English (UK)',
    nativeName: 'English (UK)',
    flag: '🇬🇧',
    rtl: false,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: '.', thousands: ',' },
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    rtl: false,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: ',', thousands: '.' },
  },
  {
    code: 'es-MX',
    name: 'Spanish (Mexico)',
    nativeName: 'Español (México)',
    flag: '🇲🇽',
    rtl: false,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: '.', thousands: ',' },
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    rtl: false,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: ',', thousands: ' ' },
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    rtl: false,
    dateFormat: 'DD.MM.YYYY',
    numberFormat: { decimal: ',', thousands: '.' },
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    rtl: false,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: ',', thousands: '.' },
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    rtl: false,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: ',', thousands: '.' },
  },
  {
    code: 'pt-BR',
    name: 'Portuguese (Brazil)',
    nativeName: 'Português (Brasil)',
    flag: '🇧🇷',
    rtl: false,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: ',', thousands: '.' },
  },
  {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    flag: '🇨🇳',
    rtl: false,
    dateFormat: 'YYYY/MM/DD',
    numberFormat: { decimal: '.', thousands: ',' },
  },
  {
    code: 'zh-TW',
    name: 'Chinese (Traditional)',
    nativeName: '繁體中文',
    flag: '🇹🇼',
    rtl: false,
    dateFormat: 'YYYY/MM/DD',
    numberFormat: { decimal: '.', thousands: ',' },
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    rtl: false,
    dateFormat: 'YYYY/MM/DD',
    numberFormat: { decimal: '.', thousands: ',' },
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    rtl: false,
    dateFormat: 'YYYY.MM.DD',
    numberFormat: { decimal: '.', thousands: ',' },
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    rtl: true,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: '٫', thousands: '٬' },
  },
  {
    code: 'he',
    name: 'Hebrew',
    nativeName: 'עברית',
    flag: '🇮🇱',
    rtl: true,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: '.', thousands: ',' },
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    rtl: false,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: '.', thousands: ',' },
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    rtl: false,
    dateFormat: 'DD.MM.YYYY',
    numberFormat: { decimal: ',', thousands: ' ' },
  },
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    rtl: false,
    dateFormat: 'DD-MM-YYYY',
    numberFormat: { decimal: ',', thousands: '.' },
  },
  {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    flag: '🇵🇱',
    rtl: false,
    dateFormat: 'DD.MM.YYYY',
    numberFormat: { decimal: ',', thousands: ' ' },
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    rtl: false,
    dateFormat: 'DD.MM.YYYY',
    numberFormat: { decimal: ',', thousands: '.' },
  },
  {
    code: 'th',
    name: 'Thai',
    nativeName: 'ไทย',
    flag: '🇹🇭',
    rtl: false,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: '.', thousands: ',' },
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    rtl: false,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: ',', thousands: '.' },
  },
];

// ============================================================================
// Language Context
// ============================================================================

interface LanguageContextValue {
  currentLanguage: Language;
  setLanguage: (code: LanguageCode) => void;
  languages: Language[];
  isRTL: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'app-language';
const DEFAULT_LANGUAGE: LanguageCode = 'en';

// ============================================================================
// Language Provider
// ============================================================================

export interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: LanguageCode;
  supportedLanguages?: LanguageCode[];
  translations?: Partial<Record<LanguageCode, Record<string, string>>>;
  onLanguageChange?: (language: Language) => void;
}

export function LanguageProvider({
  children,
  defaultLanguage = DEFAULT_LANGUAGE,
  supportedLanguages,
  translations = {},
  onLanguageChange,
}: LanguageProviderProps) {
  const [currentCode, setCurrentCode] = useState<LanguageCode>(defaultLanguage);

  // Filter supported languages
  const languages = useMemo(() => {
    if (supportedLanguages) {
      return SUPPORTED_LANGUAGES.filter(lang =>
        supportedLanguages.includes(lang.code)
      );
    }
    return SUPPORTED_LANGUAGES;
  }, [supportedLanguages]);

  const currentLanguage = useMemo(() => {
    return languages.find(l => l.code === currentCode) || languages[0];
  }, [currentCode, languages]);

  // Load saved language on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && languages.some(l => l.code === saved)) {
      setCurrentCode(saved as LanguageCode);
    } else {
      // Detect browser language
      const browserLang = navigator.language;
      const match = languages.find(
        l => l.code === browserLang || l.code === browserLang.split('-')[0]
      );
      if (match) {
        setCurrentCode(match.code);
      }
    }
  }, [languages]);

  // Update document attributes when language changes
  useEffect(() => {
    document.documentElement.lang = currentLanguage.code;
    document.documentElement.dir = currentLanguage.rtl ? 'rtl' : 'ltr';
    onLanguageChange?.(currentLanguage);
  }, [currentLanguage, onLanguageChange]);

  const setLanguage = useCallback((code: LanguageCode) => {
    setCurrentCode(code);
    localStorage.setItem(STORAGE_KEY, code);
  }, []);

  // Translation function
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const langTranslations = translations[currentCode] || {};
      let text = langTranslations[key] || key;

      // Replace parameters
      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          text = text.replace(new RegExp(`{{${param}}}`, 'g'), String(value));
        });
      }

      return text;
    },
    [currentCode, translations]
  );

  const value = useMemo(
    () => ({
      currentLanguage,
      setLanguage,
      languages,
      isRTL: currentLanguage.rtl,
      t,
    }),
    [currentLanguage, setLanguage, languages, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// ============================================================================
// useLanguage Hook
// ============================================================================

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// ============================================================================
// Language Switcher Component
// ============================================================================

export type SwitcherVariant = 'dropdown' | 'pills' | 'flags' | 'menu';

export interface LanguageSwitcherProps {
  /** Display variant */
  variant?: SwitcherVariant;
  /** Show native language names */
  showNativeName?: boolean;
  /** Show flags */
  showFlags?: boolean;
  /** Compact mode (flags only) */
  compact?: boolean;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className */
  className?: string;
}

export function LanguageSwitcher({
  variant = 'dropdown',
  showNativeName = false,
  showFlags = true,
  compact = false,
  size = 'md',
  className = '',
}: LanguageSwitcherProps) {
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const buttonSizeClasses = {
    sm: 'px-2 py-1',
    md: 'px-3 py-2',
    lg: 'px-4 py-2.5',
  };

  const getDisplayName = (lang: Language) => {
    if (compact) return '';
    return showNativeName ? lang.nativeName : lang.name;
  };

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center gap-2 bg-white dark:bg-gray-800
            border border-gray-300 dark:border-gray-600 rounded-lg
            hover:bg-gray-50 dark:hover:bg-gray-700
            transition-colors
            ${buttonSizeClasses[size]}
            ${sizeClasses[size]}
          `}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          {showFlags && <span className="text-lg">{currentLanguage.flag}</span>}
          {!compact && <span>{getDisplayName(currentLanguage)}</span>}
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <ul
              role="listbox"
              className={`
                absolute z-20 mt-1 w-48 max-h-60 overflow-auto
                bg-white dark:bg-gray-800 rounded-lg shadow-lg
                border border-gray-200 dark:border-gray-700
                ${sizeClasses[size]}
              `}
            >
              {languages.map((lang) => (
                <li
                  key={lang.code}
                  role="option"
                  aria-selected={lang.code === currentLanguage.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`
                    flex items-center gap-2 px-3 py-2 cursor-pointer
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    ${lang.code === currentLanguage.code ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''}
                  `}
                >
                  {showFlags && <span className="text-lg">{lang.flag}</span>}
                  <span className="flex-1">{getDisplayName(lang)}</span>
                  {lang.code === currentLanguage.code && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }

  // Pills variant
  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`} role="radiogroup">
        {languages.map((lang) => (
          <button
            key={lang.code}
            role="radio"
            aria-checked={lang.code === currentLanguage.code}
            onClick={() => setLanguage(lang.code)}
            className={`
              flex items-center gap-1.5 rounded-full
              transition-colors
              ${buttonSizeClasses[size]}
              ${sizeClasses[size]}
              ${lang.code === currentLanguage.code
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            {showFlags && <span>{lang.flag}</span>}
            {!compact && <span>{getDisplayName(lang)}</span>}
          </button>
        ))}
      </div>
    );
  }

  // Flags only variant
  if (variant === 'flags') {
    return (
      <div className={`flex items-center gap-1 ${className}`} role="radiogroup">
        {languages.map((lang) => (
          <button
            key={lang.code}
            role="radio"
            aria-checked={lang.code === currentLanguage.code}
            aria-label={lang.name}
            onClick={() => setLanguage(lang.code)}
            className={`
              p-1.5 rounded-md text-xl transition-all
              ${lang.code === currentLanguage.code
                ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 opacity-60 hover:opacity-100'
              }
            `}
          >
            {lang.flag}
          </button>
        ))}
      </div>
    );
  }

  // Menu variant (vertical list)
  if (variant === 'menu') {
    return (
      <ul className={`space-y-1 ${className}`} role="listbox">
        {languages.map((lang) => (
          <li key={lang.code}>
            <button
              role="option"
              aria-selected={lang.code === currentLanguage.code}
              onClick={() => setLanguage(lang.code)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg
                transition-colors text-left
                ${sizeClasses[size]}
                ${lang.code === currentLanguage.code
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              {showFlags && <span className="text-xl">{lang.flag}</span>}
              <div className="flex-1">
                <div className="font-medium">{lang.name}</div>
                {showNativeName && lang.name !== lang.nativeName && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {lang.nativeName}
                  </div>
                )}
              </div>
              {lang.code === currentLanguage.code && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return null;
}

// ============================================================================
// Language Select (Form Input)
// ============================================================================

export interface LanguageSelectProps {
  /** Selected language code */
  value?: LanguageCode;
  /** Change handler */
  onChange?: (code: LanguageCode) => void;
  /** Show native names */
  showNativeName?: boolean;
  /** Show flags */
  showFlags?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom className */
  className?: string;
}

export function LanguageSelect({
  value,
  onChange,
  showNativeName = false,
  showFlags = true,
  disabled = false,
  className = '',
}: LanguageSelectProps) {
  const { currentLanguage, languages } = useLanguage();
  const selectedCode = value || currentLanguage.code;

  return (
    <select
      value={selectedCode}
      onChange={(e) => onChange?.(e.target.value as LanguageCode)}
      disabled={disabled}
      className={`
        w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-800
        focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {showFlags ? `${lang.flag} ` : ''}
          {showNativeName ? lang.nativeName : lang.name}
        </option>
      ))}
    </select>
  );
}

// ============================================================================
// Translated Text Component
// ============================================================================

export interface TranslatedTextProps {
  /** Translation key */
  i18nKey: string;
  /** Parameters for interpolation */
  params?: Record<string, string | number>;
  /** Fallback text if key not found */
  fallback?: string;
  /** Element to render as */
  as?: keyof JSX.IntrinsicElements;
  /** Custom className */
  className?: string;
}

export function TranslatedText({
  i18nKey,
  params,
  fallback,
  as: Component = 'span',
  className = '',
}: TranslatedTextProps) {
  const { t } = useLanguage();
  const text = t(i18nKey, params);

  return (
    <Component className={className}>
      {text === i18nKey && fallback ? fallback : text}
    </Component>
  );
}

// Shorthand alias
export const T = TranslatedText;

